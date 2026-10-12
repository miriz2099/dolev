jest.mock("../../services/ai/providers/gemini.provider", () => ({
  name: "gemini",
  complete: jest.fn(),
}));

jest.mock("../../services/ai/providers/mock.provider", () => ({
  name: "mock",
  complete: jest.fn(),
}));

const geminiProvider = require("../../services/ai/providers/gemini.provider");
const mockProvider = require("../../services/ai/providers/mock.provider");
const { rephraseSection } = require("../../services/ai/index");
const { AiError } = require("../../services/ai/errors");

describe("AI Provider Chain & Privacy Gatekeeper (ai.chain.test.js)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.AI_MAX_ATTEMPTS = "1"; // keep retries fast in tests
    process.env.AI_PROVIDER_CHAIN = "gemini,mock";
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should NOT leak mock provider in production/cloud (without FUNCTIONS_EMULATOR) when Gemini fails (429)", async () => {
    delete process.env.FUNCTIONS_EMULATOR;

    geminiProvider.complete.mockRejectedValue(
      new AiError("Rate limit exceeded (429)", {
        status: 429,
        retryable: true,
        code: "AI_RATE_LIMIT",
      }),
    );

    await expect(
      rephraseSection({
        sectionId: "referralReason",
        rawText: "הילד הופנה לבדיקה עקב קשיים בכתיבה.",
      }),
    ).rejects.toThrow(AiError);

    // Crucial requirement: mock provider must never be called outside emulator
    expect(mockProvider.complete).not.toHaveBeenCalled();
  });

  it("should gracefully fall back to mock provider in emulator environment (FUNCTIONS_EMULATOR=true)", async () => {
    process.env.FUNCTIONS_EMULATOR = "true";

    geminiProvider.complete.mockRejectedValue(
      new AiError("Rate limit exceeded (429)", {
        status: 429,
        retryable: true,
        code: "AI_RATE_LIMIT",
      }),
    );

    mockProvider.complete.mockResolvedValue({
      text: "[שם_הנבחן] הופנה לאבחון מקצועי.",
      model: "mock-model",
      usage: { inputTokens: 10, outputTokens: 15 },
    });

    const result = await rephraseSection({
      sectionId: "referralReason",
      rawText: "דני הופנה לבדיקה.",
      child: { firstName: "דני", lastName: "כהן" },
    });

    expect(geminiProvider.complete).toHaveBeenCalled();
    expect(mockProvider.complete).toHaveBeenCalled();
    expect(result.text).toBe("דני הופנה לאבחון מקצועי.");
  });

  it("should ensure text sent to LLM provider contains NO identifiable patient data, and restore names in output", async () => {
    delete process.env.FUNCTIONS_EMULATOR;
    process.env.AI_PROVIDER_CHAIN = "gemini";

    geminiProvider.complete.mockImplementation(async (params) => {
      // Return clinical phrasing preserving the generic tokens
      return {
        text: `במהלך האבחון של [שם_הנבחן] [שם_משפחה], נצפו קשיי קשב. פרטי התקשרות עם [שם_הורה] הינם [טלפון].`,
        model: "gemini-2.5-flash",
        usage: { inputTokens: 50, outputTokens: 40 },
      };
    });

    const child = {
      firstName: "איתי",
      lastName: "ברקוביץ",
      idNumber: "123456789",
    };
    const parent = {
      firstName: "מיכל",
      lastName: "ברקוביץ",
      phone: "050-1234567",
      email: "michal@example.com",
    };

    const rawInput =
      "איתי ברקוביץ תז 123456789 הגיע עם מיכל ברקוביץ, טלפון 050-1234567 ומייל michal@example.com לבדיקה.";

    const result = await rephraseSection({
      sectionId: "referralReason",
      rawText: rawInput,
      child,
      parent,
    });

    // 1. Verify parameters sent to gemini.complete
    expect(geminiProvider.complete).toHaveBeenCalledTimes(1);
    const callArgs = geminiProvider.complete.mock.calls[0][0];
    const promptSent = JSON.stringify(callArgs);

    // None of the original patient details should appear in the payload sent to the LLM
    expect(promptSent).not.toContain("איתי");
    expect(promptSent).not.toContain("ברקוביץ");
    expect(promptSent).not.toContain("123456789");
    expect(promptSent).not.toContain("050-1234567");
    expect(promptSent).not.toContain("michal@example.com");

    // 2. Verify restored text returned to the user
    expect(result.text).toContain("איתי");
    expect(result.text).toContain("ברקוביץ");
    expect(result.text).toContain("מיכל");
    expect(result.text).toContain("050-1234567");
    expect(result.text).not.toContain("[שם_הנבחן]");
    expect(result.text).not.toContain("[שם_משפחה]");
  });
});
