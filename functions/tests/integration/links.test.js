const mockSendMail = jest.fn().mockResolvedValue({ messageId: "msg_mock_123" });
jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({
    sendMail: mockSendMail,
  })),
}));

const request = require("supertest");
const app = require("../../app");
const { seed, db } = require("./helpers");

describe("Token Links, Expiration & Resend Integration Tests (links.test.js)", () => {
  let tokens;

  beforeEach(async () => {
    jest.clearAllMocks();
    const data = await seed();
    tokens = data.tokens;
  });

  describe("School Questionnaire Token Links", () => {
    it("should accept valid school token with 200 without exposing internal IDs (therapistId, parentId)", async () => {
      const res = await request(app).get(
        "/school-questionnaires/check-invite/valid_school_token",
      );

      expect(res.status).toBe(200);
      expect(res.body.childName).toBeDefined();
      expect(res.body.teacherName).toBe("שושנה המורה");

      // Verify privacy: internal IDs must not leak in public response
      expect(res.body.therapistId).toBeUndefined();
      expect(res.body.parentId).toBeUndefined();
    });

    it("should return 410 Gone for expired school tokens on check-invite, draft, and submit", async () => {
      // 1. check-invite
      const resCheck = await request(app).get(
        "/school-questionnaires/check-invite/expired_school_token",
      );
      expect(resCheck.status).toBe(410);

      // 2. PUT draft
      const resDraft = await request(app)
        .put("/school-questionnaires/draft/expired_school_token")
        .send({ formData: { attention: "בינוני" } });
      expect(resDraft.status).toBe(410);

      // 3. POST submit
      const resSubmit = await request(app)
        .post("/school-questionnaires/submit/expired_school_token")
        .send({ formData: { attention: "בינוני" } });
      expect(resSubmit.status).toBe(410);
    });

    it("should return 404 (and NOT 500) for nonexistent school tokens", async () => {
      const res = await request(app).get(
        "/school-questionnaires/check-invite/nonexistent_random_token",
      );

      expect(res.status).toBe(404);
      expect(res.status).not.toBe(500);
    });

    it("should resend invitation: extend expiryDate by ~7 days, reset status to pending, keep token, and call sendMail", async () => {
      const res = await request(app)
        .post("/school-questionnaires/resend")
        .set("Authorization", `Bearer ${tokens.therapist1}`)
        .send({
          diagnosisId: "d1",
          correctionNote: "נא לפרט יותר על תפקוד הילד בקריאה וכתיבה.",
        });

      expect(res.status).toBe(200);

      // Verify DB update
      const invDoc = await db
        .collection("school_invitations")
        .doc("si_valid")
        .get();
      const invData = invDoc.data();

      expect(invData.token).toBe("valid_school_token"); // Token preserved
      expect(invData.status).toBe("pending");

      // ExpiryDate extended by ~7 days (tolerance within 2 minutes)
      const expectedExpiry = Date.now() + 7 * 86400000;
      const actualExpiry = new Date(invData.expiryDate).getTime();
      expect(Math.abs(actualExpiry - expectedExpiry)).toBeLessThan(2 * 60 * 1000);

      // Correction history recorded without arrayUnion regression
      expect(Array.isArray(invData.correctionHistory)).toBe(true);
      expect(invData.correctionHistory.length).toBeGreaterThanOrEqual(1);
      expect(invData.correctionHistory[0].note).toContain("בקריאה וכתיבה");

      // Verify email was dispatched via nodemailer mock
      expect(mockSendMail).toHaveBeenCalledTimes(1);
    });
  });

  describe("Consent Form Token Links (External Parent)", () => {
    it("should reject expired consent form token on check with 410", async () => {
      const res = await request(app).get(
        "/consent-forms/by-token/consent_expired_token",
      );

      expect(res.status).toBe(410);
    });

    it("should reject signing with an expired token with 410 and ensure form status remains unchanged", async () => {
      const validSig =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

      const res = await request(app)
        .post("/consent-forms/by-token/consent_expired_token/sign")
        .send({
          signature: validSig,
          agreed: true,
        });

      expect(res.status).toBe(410);

      // Verify DB form status was NOT changed to fully_signed
      const formDoc = await db
        .collection("consent_forms")
        .doc("cf_token_expired")
        .get();
      expect(formDoc.data().status).toBe("partially_signed");
    });
  });
});
