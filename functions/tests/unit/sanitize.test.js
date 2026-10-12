const {
  stripTags,
  sanitizeBody,
} = require("../../middleware/sanitize.middleware");

describe("Input Sanitization Middleware (sanitize.middleware.js)", () => {
  describe("stripTags", () => {
    it("should escape HTML tags to prevent XSS injection", () => {
      const malicious = '<script>alert("xss")</script>';
      const cleaned = stripTags(malicious);

      expect(cleaned).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
      expect(cleaned).not.toContain("<");
      expect(cleaned).not.toContain(">");
    });

    it("should remove inline javascript: protocol with mixed case (JaVaScRiPt:)", () => {
      const payload = '<a href="JaVaScRiPt:alert(1)">Click</a>';
      const cleaned = stripTags(payload);

      expect(cleaned).not.toMatch(/javascript:/i);
      expect(cleaned).toBe('&lt;a href="alert(1)"&gt;Click&lt;/a&gt;');
    });

    it("should remove event handlers regardless of casing", () => {
      const payload = '<img src="x" OnErRoR="alert(1)">';
      const cleaned = stripTags(payload);

      expect(cleaned).not.toMatch(/onerror=/i);
      expect(cleaned).toBe('&lt;img src="x" "alert(1)"&gt;');
    });

    it("should preserve valid base64 signature images untouched", () => {
      const validSignature =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

      const result = stripTags(validSignature);
      expect(result).toBe(validSignature);
    });

    it("should preserve intentional comparison operators by escaping on input (architectural choice)", () => {
      // בחירה תכנונית: סינון XSS מקדים על הקלט גורם לתווים < ו-> להישמר כ-HTML entities
      const input = "ציון < 60";
      expect(stripTags(input)).toBe("ציון &lt; 60");
    });

    it("should return non-string inputs untouched", () => {
      expect(stripTags(12345)).toBe(12345);
      expect(stripTags(true)).toBe(true);
      expect(stripTags(null)).toBe(null);
    });
  });

  describe("sanitizeBody middleware", () => {
    it("should recursively clean deeply nested request body properties", () => {
      const req = {
        body: {
          title: "<b>כותרת דוח</b>",
          author: {
            name: '<span onclick="evil()">ד"ר לוי</span>',
            meta: {
              note: "<script>steal()</script>הערה",
            },
          },
          tags: ["<b>פסיכודידקטי</b>", "<i>קשב וריכוז</i>"],
          age: 8,
          isActive: true,
        },
      };
      const res = {};
      const next = jest.fn();

      sanitizeBody(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(req.body.title).toBe("&lt;b&gt;כותרת דוח&lt;/b&gt;");
      expect(req.body.author.name).toBe(
        '&lt;span "evil()"&gt;ד"ר לוי&lt;/span&gt;',
      );
      expect(req.body.author.meta.note).toBe(
        "&lt;script&gt;steal()&lt;/script&gt;הערה",
      );
      expect(req.body.tags).toEqual([
        "&lt;b&gt;פסיכודידקטי&lt;/b&gt;",
        "&lt;i&gt;קשב וריכוז&lt;/i&gt;",
      ]);
    });

    // באג ידוע בקוד המוצר: sanitizeObject מנקה בתוך מערכים רק מחרוזות ישירות,
    // אך מתעלם מאובייקטים המוכלים בתוך מערך.
    // לפי עיקרון 2, הבדיקה מסומנת test.failing ומתועדת ב-BUGS_FOUND.md.
    test.failing(
      "should sanitize objects nested inside arrays within request body (BUG: sanitizeObject skips non-string array items)",
      () => {
        const req = {
          body: {
            items: [
              {
                comment: "<script>evil()</script>הערה",
              },
            ],
          },
        };
        const res = {};
        const next = jest.fn();

        sanitizeBody(req, res, next);

        // Required behavior: nested object inside array should be sanitized
        expect(req.body.items[0].comment).toBe(
          "&lt;script&gt;evil()&lt;/script&gt;הערה",
        );
      },
    );

    it("should handle missing or empty request bodies gracefully", () => {
      const req = {};
      const res = {};
      const next = jest.fn();

      sanitizeBody(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
