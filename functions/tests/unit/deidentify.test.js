const {
  buildEntityMap,
  redact,
  restore,
} = require("../../services/ai/deidentify");

describe("AI De-identification Service (deidentify.js)", () => {
  describe("buildEntityMap", () => {
    it("should extract entities from child and parent records", () => {
      const child = {
        firstName: "יונתן",
        lastName: "ישראלי",
        idNumber: "123456789",
      };
      const parent = {
        firstName: "אברהם",
        lastName: "ישראלי",
        phone: "050-1234567",
        email: "avraham@example.com",
      };

      const entityMap = buildEntityMap(child, parent);

      expect(entityMap).toEqual(
        expect.arrayContaining([
          { value: "יונתן", token: "[שם_הנבחן]" },
          { value: "ישראלי", token: "[שם_משפחה]" },
          { value: "123456789", token: "[ת.ז]" },
          { value: "אברהם", token: "[שם_הורה]" },
          { value: "050-1234567", token: "[טלפון]" },
          { value: "avraham@example.com", token: "[מייל]" },
        ]),
      );
    });

    it("should sort entities by length descending to prevent substring collisions", () => {
      const child = { firstName: "דן", lastName: "כהן" };
      const parent = { firstName: "דניאל", lastName: "כהן" };

      const entityMap = buildEntityMap(child, parent);
      const values = entityMap.map((e) => e.value);

      // "דניאל" (length 5) must precede "דן" (length 2)
      expect(values.indexOf("דניאל")).toBeLessThan(values.indexOf("דן"));
    });

    it("should ignore empty, null, or short values (< 2 chars)", () => {
      const child = { firstName: "א", lastName: "", idNumber: null };
      const parent = {};

      const entityMap = buildEntityMap(child, parent);
      expect(entityMap).toHaveLength(0);
    });
  });

  describe("redact - word boundaries and Hebrew prefix letters", () => {
    it("should NOT replace short names embedded inside other words (טל vs טלפון)", () => {
      const child = { firstName: "טל", lastName: "רוזן" };
      const entityMap = buildEntityMap(child);

      const text = "השאירו טלפון במזכירות בבוקר.";
      const { text: redactedText } = redact(text, entityMap);

      expect(redactedText).toBe("השאירו טלפון במזכירות בבוקר.");
      expect(redactedText).not.toContain("[שם_הנבחן]");
    });

    it("should replace name when it stands as an independent word", () => {
      const child = { firstName: "טל", lastName: "רוזן" };
      const entityMap = buildEntityMap(child);

      const text = "טל הגיע לאבחון בזמן.";
      const { text: redactedText } = redact(text, entityMap);

      expect(redactedText).toBe("[שם_הנבחן] הגיע לאבחון בזמן.");
    });

    it("should preserve allowed Hebrew prefix letters before the token (לנועה, ונועה, שנועה)", () => {
      const child = { firstName: "נועה", lastName: "לוי" };
      const entityMap = buildEntityMap(child);

      expect(redact("לנועה יש קושי בריכוז", entityMap).text).toBe(
        "ל[שם_הנבחן] יש קושי בריכוז",
      );
      expect(redact("ונועה ישבה בשקט", entityMap).text).toBe(
        "ו[שם_הנבחן] ישבה בשקט",
      );
      expect(redact("שנועה תגיע מחר", entityMap).text).toBe(
        "ש[שם_הנבחן] תגיע מחר",
      );
      expect(redact("כשנועה נכנסה לחדר", entityMap).text).toBe(
        "כש[שם_הנבחן] נכנסה לחדר",
      );
    });

    it("should replace known entity values with their tokens", () => {
      const child = { firstName: "נועה", lastName: "לוי" };
      const parent = { firstName: "רונית" };
      const entityMap = buildEntityMap(child, parent);

      const text = "נועה לוי הגיעה לאבחון מלווה באמה רונית.";
      const { text: redactedText, replacements } = redact(text, entityMap);

      expect(redactedText).toBe(
        "[שם_הנבחן] [שם_משפחה] הגיעה לאבחון מלווה באמה [שם_הורה].",
      );
      expect(replacements).toEqual(
        expect.arrayContaining([
          { token: "[שם_הנבחן]", value: "נועה" },
          { token: "[שם_משפחה]", value: "לוי" },
          { token: "[שם_הורה]", value: "רונית" },
        ]),
      );
    });
  });

  describe("redact - fallback regex patterns", () => {
    const testPhoneFormat = (phoneStr) => {
      const text = `מספר יצירת קשר: ${phoneStr}. המשך טקסט.`;
      const { text: redactedText } = redact(text, []);
      expect(redactedText).toContain("[טלפון]");
      expect(redactedText).not.toContain(phoneStr);
    };

    it("should mask all 5 common Israeli phone number formats to [טלפון]", () => {
      testPhoneFormat("052 987 6543");
      testPhoneFormat("052-987-6543");
      testPhoneFormat("+972-52-9876543");
      testPhoneFormat("+972529876543");
      testPhoneFormat("03-1234567");
    });

    it("should mask email addresses regardless of uppercase characters", () => {
      const text = "פנייה נשלחה אל Doctor@Clinic.ORG בבוקר.";
      const { text: redactedText } = redact(text, []);

      expect(redactedText).toBe("פנייה נשלחה אל [מייל] בבוקר.");
      expect(redactedText).not.toContain("Doctor@Clinic.ORG");
    });

    it("should mask manual 9-digit national IDs", () => {
      const text = "תעודת זהות של הנבדק 987654321 סופקה.";
      const { text: redactedText } = redact(text, []);

      expect(redactedText).toBe("תעודת זהות של הנבדק [ת.ז] סופקה.");
      expect(redactedText).not.toContain("987654321");
    });
  });

  describe("restore & edge cases", () => {
    it("should handle child and parent sharing the exact same last name without double substitution", () => {
      const child = { firstName: "יונתן", lastName: "כהן" };
      const parent = { firstName: "דוד", lastName: "כהן" };
      const entityMap = buildEntityMap(child, parent);

      const originalText = "יונתן כהן ואביו דוד כהן הגיעו יחד.";
      const { text: redactedText, replacements } = redact(
        originalText,
        entityMap,
      );

      // Verify redaction replaced both instances
      expect(redactedText).not.toContain("כהן");

      const restored = restore(redactedText, replacements);
      expect(restored).toBe(originalText);
    });

    it("should restore both occurrences when the AI model duplicates a token", () => {
      const replacements = [{ token: "[שם_הנבחן]", value: "דני" }];
      const modelOutput =
        "[שם_הנבחן] שיתף פעולה יפה. בסיום, [שם_הנבחן] קיבל מדבקה.";

      const restored = restore(modelOutput, replacements);
      expect(restored).toBe("דני שיתף פעולה יפה. בסיום, דני קיבל מדבקה.");
      expect(restored).not.toContain("[שם_הנבחן]");
    });

    it("should not crash and not leave brackets when model omitted a token", () => {
      const replacements = [
        { token: "[שם_הנבחן]", value: "דני" },
        { token: "[ת.ז]", value: "123456789" },
      ];
      // Model output only contains [שם_הנבחן], omitted [ת.ז]
      const modelOutput = "[שם_הנבחן] השלים את המשימה.";

      const restored = restore(modelOutput, replacements);
      expect(restored).toBe("דני השלים את המשימה.");
      expect(restored).not.toContain("[");
      expect(restored).not.toContain("]");
    });

    it("should perform a lossless round-trip on a paragraph containing all entity types", () => {
      const child = {
        firstName: "איתי",
        lastName: "ברקוביץ",
        idNumber: "312456789",
      };
      const parent = {
        firstName: "מיכל",
        lastName: "ברקוביץ",
        phone: "054-9876543",
        email: "michal@berko.co.il",
      };
      const entityMap = buildEntityMap(child, parent);

      const originalParagraph =
        "איתי ברקוביץ ת.ז 312456789 הגיע בליווי אמו מיכל ברקוביץ. " +
        "לאיתי מוטיבציה גבוהה, ומיכל דיווחה על שיפור. טלפון ליצירת קשר 054-9876543 ומייל michal@berko.co.il.";

      const { text: redactedText, replacements } = redact(
        originalParagraph,
        entityMap,
      );

      // Verify all sensitive items were removed
      expect(redactedText).not.toContain("איתי");
      expect(redactedText).not.toContain("מיכל");
      expect(redactedText).not.toContain("ברקוביץ");
      expect(redactedText).not.toContain("312456789");
      expect(redactedText).not.toContain("054-9876543");
      expect(redactedText).not.toContain("michal@berko.co.il");

      // Verify prefix letters remained
      expect(redactedText).toContain("לאיתי".replace("איתי", "[שם_הנבחן]"));
      expect(redactedText).toContain("ומיכל".replace("מיכל", "[שם_הורה]"));

      // Lossless restore
      const restored = restore(redactedText, replacements);
      expect(restored).toBe(originalParagraph);
    });
  });
});
