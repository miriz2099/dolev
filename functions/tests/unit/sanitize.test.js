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

    it("should remove inline javascript: protocols and on* event handlers", () => {
      const payload = '<a href="javascript:alert(1)" onclick="doBad()">Click</a>';
      const cleaned = stripTags(payload);

      expect(cleaned).not.toContain("javascript:");
      expect(cleaned).not.toContain("onclick=");
      expect(cleaned).toContain("&lt;a href=\"alert(1)\" \"doBad()\"&gt;Click&lt;/a&gt;");
    });

    it("should preserve valid base64 signature images untouched", () => {
      // Signature data URL format as produced by SignatureInput.jsx
      const validSignature =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

      const result = stripTags(validSignature);
      expect(result).toBe(validSignature);
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
              note: '<script>steal()</script>הערה',
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
      expect(req.body.author.name).toBe('&lt;span "evil()"&gt;ד"ר לוי&lt;/span&gt;');
      expect(req.body.author.meta.note).toBe("&lt;script&gt;steal()&lt;/script&gt;הערה");
      expect(req.body.tags).toEqual([
        "&lt;b&gt;פסיכודידקטי&lt;/b&gt;",
        "&lt;i&gt;קשב וריכוז&lt;/i&gt;",
      ]);
      expect(req.body.age).toBe(8);
      expect(req.body.isActive).toBe(true);
    });

    it("should handle missing or empty request bodies gracefully", () => {
      const req = {};
      const res = {};
      const next = jest.fn();

      sanitizeBody(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
