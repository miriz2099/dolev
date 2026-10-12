const { toUserMessage, AiError } = require("../../services/ai/errors");

describe("AI Errors & Localized User Messages (errors.js)", () => {
  const KNOWN_CODES = [
    "AI_RATE_LIMIT",
    "AI_DAILY_QUOTA",
    "AI_UNAVAILABLE",
    "AI_TIMEOUT",
    "AI_BLOCKED",
    "AI_EMPTY",
    "AI_CONFIG",
    "AI_BAD_RESPONSE",
    "AI_ERROR",
  ];

  it("should return the designated Hebrew message for each known error code", () => {
    for (const code of KNOWN_CODES) {
      const err = new AiError("internal failure message", { code });
      const msg = toUserMessage(err);

      expect(typeof msg).toBe("string");
      expect(msg.trim().length).toBeGreaterThan(5);
    }
  });

  it("should default to AI_ERROR message when code is unknown, missing, or error is undefined", () => {
    const defaultMsg = toUserMessage(new AiError("boom", { code: "AI_ERROR" }));

    expect(toUserMessage(new AiError("unknown", { code: "UNKNOWN_CODE" }))).toBe(
      defaultMsg,
    );
    expect(toUserMessage(new Error("plain error without code"))).toBe(
      defaultMsg,
    );
    expect(toUserMessage(null)).toBe(defaultMsg);
    expect(toUserMessage(undefined)).toBe(defaultMsg);
  });

  it("should guarantee that NO user message contains '[MOCK]' or Latin alphabet characters", () => {
    for (const code of KNOWN_CODES) {
      const msg = toUserMessage(new AiError("internal", { code }));

      expect(msg).not.toContain("[MOCK]");
      // Regex checking for Latin letters A-Z / a-z
      expect(msg).not.toMatch(/[a-zA-Z]/);
    }
  });
});
