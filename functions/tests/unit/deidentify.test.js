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
        ])
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

  describe("redact", () => {
    it("should replace known entity values with their tokens", () => {
      const child = { firstName: "נועה", lastName: "לוי" };
      const parent = { firstName: "רונית" };
      const entityMap = buildEntityMap(child, parent);

      const text = "נועה לוי הגיעה לאבחון מלווה באמה רונית.";
      const { text: redactedText, replacements } = redact(text, entityMap);

      expect(redactedText).toBe(
        "[שם_הנבחן] [שם_משפחה] הגיעה לאבחון מלווה באמה [שם_הורה]."
      );
      expect(replacements).toEqual(
        expect.arrayContaining([
          { token: "[שם_הנבחן]", value: "נועה" },
          { token: "[שם_משפחה]", value: "לוי" },
          { token: "[שם_הורה]", value: "רונית" },
        ])
      );
    });

    it("should mask fallback patterns for manual IDs, phones, and emails", () => {
      const entityMap = []; // no known profile data
      const text =
        "פרטי קשר נוספים: תז 987654321, טלפון 052-9876543 ומייל doctor@clinic.org.";

      const { text: redactedText } = redact(text, entityMap);

      expect(redactedText).toContain("[ת.ז]");
      expect(redactedText).toContain("[טלפון]");
      expect(redactedText).toContain("[מייל]");
      expect(redactedText).not.toContain("987654321");
      expect(redactedText).not.toContain("052-9876543");
      expect(redactedText).not.toContain("doctor@clinic.org");
    });

    it("should handle text with no matching entities without altering it", () => {
      const entityMap = [{ value: "דני", token: "[שם_הנבחן]" }];
      const text = "הילד שיתף פעולה באופן מלא במהלך המטלות.";

      const { text: redactedText, replacements } = redact(text, entityMap);

      expect(redactedText).toBe(text);
      expect(replacements).toHaveLength(0);
    });
  });

  describe("restore", () => {
    it("should restore redacted tokens back to original values", () => {
      const originalText = "אורי כהן הציג מוטיבציה גבוהה.";
      const entityMap = [
        { value: "אורי", token: "[שם_הנבחן]" },
        { value: "כהן", token: "[שם_משפחה]" },
      ];

      const { text: redactedText, replacements } = redact(
        originalText,
        entityMap
      );
      expect(redactedText).toBe("[שם_הנבחן] [שם_משפחה] הציג מוטיבציה גבוהה.");

      // Simulate model rephrasing while keeping the tokens
      const modelOutput =
        "במהלך המפגש, [שם_הנבחן] [שם_משפחה] הפגין רמת מוטיבציה ניכרת.";
      const restored = restore(modelOutput, replacements);

      expect(restored).toBe(
        "במהלך המפגש, אורי כהן הפגין רמת מוטיבציה ניכרת."
      );
      expect(restored).not.toContain("[שם_הנבחן]");
      expect(restored).not.toContain("[שם_משפחה]");
    });
  });
});
