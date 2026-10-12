jest.mock("../../services/ai/providers/gemini.provider", () => ({
  name: "gemini",
  complete: jest.fn(),
}));

const geminiProvider = require("../../services/ai/providers/gemini.provider");
const { AiError } = require("../../services/ai/errors");
const request = require("supertest");
const app = require("../../app");
const { seed } = require("./helpers");

describe("AI Endpoint Security & De-identification Integration Tests (ai-endpoints.test.js)", () => {
  let tokens;

  beforeEach(async () => {
    jest.clearAllMocks();
    const data = await seed();
    tokens = data.tokens;
  });

  it("should forbid therapist2 from invoking AI rephrase on d1 (403) and never call Gemini", async () => {
    const res = await request(app)
      .post("/reports/ai/rephrase")
      .set("Authorization", `Bearer ${tokens.therapist2}`)
      .send({
        diagnosisId: "d1",
        sectionId: "referralReason",
        rawText: "הערות קליניות לניסוח.",
      });

    expect(res.status).toBe(403);
    expect(geminiProvider.complete).not.toHaveBeenCalled();
  });

  it("should de-identify patient details before calling LLM and restore names in response to therapist1", async () => {
    geminiProvider.complete.mockResolvedValue({
      text: "הערכה קלינית: [שם_הנבחן] [שם_משפחה] ביצע את המשימות בהצלחה מלאה.",
      model: "gemini-2.5-flash",
      usage: { inputTokens: 40, outputTokens: 30 },
    });

    const rawNotes =
      "ילד1 כהן תז 111111111 טלפון 052-9876543 הגיע בזמן לאבחון והפגין יכולת טובה.";

    const res = await request(app)
      .post("/reports/ai/rephrase")
      .set("Authorization", `Bearer ${tokens.therapist1}`)
      .send({
        diagnosisId: "d1",
        sectionId: "referralReason",
        rawText: rawNotes,
      });

    expect(res.status).toBe(200);

    // 1. Check prompt passed to gemini
    expect(geminiProvider.complete).toHaveBeenCalledTimes(1);
    const callArgs = JSON.stringify(geminiProvider.complete.mock.calls[0][0]);
    expect(callArgs).not.toContain("ילד1");
    expect(callArgs).not.toContain("111111111");
    expect(callArgs).not.toContain("052-9876543");

    // 2. Check restored text returned to client
    expect(res.body.text).toContain("ילד1 כהן");
    expect(res.body.text).not.toContain("[שם_הנבחן]");
    expect(res.body.text).not.toContain("[שם_משפחה]");
  });

  it("should return localized Hebrew error message without '[MOCK]' when Gemini throws AI_DAILY_QUOTA", async () => {
    geminiProvider.complete.mockRejectedValue(
      new AiError("Google quota exhausted", {
        status: 429,
        retryable: false,
        code: "AI_DAILY_QUOTA",
      }),
    );

    const res = await request(app)
      .post("/reports/ai/rephrase")
      .set("Authorization", `Bearer ${tokens.therapist1}`)
      .send({
        diagnosisId: "d1",
        sectionId: "referralReason",
        rawText: "הערות קליניות רגילות.",
      });

    expect(res.status).toBe(429);
    expect(res.body.error).toContain(
      "הסתיימה המכסה היומית של שירות הניסוח. היא תתחדש מחר.",
    );
    expect(res.body.error).not.toContain("[MOCK]");
  });
});
