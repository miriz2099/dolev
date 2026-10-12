jest.mock("../../services/pdf.service", () => ({
  generatePDFBuffer: jest.fn(async () => Buffer.from("%PDF-1.4 mock pdf content")),
  createDiagnosticPDF: jest.fn(async () => "<html>mock report</html>"),
}));

const request = require("supertest");
const app = require("../../app");
const { seed, db } = require("./helpers");

describe("Report Lifecycle, Closing & PDF Export Integration Tests (report-lifecycle.test.js)", () => {
  let tokens;

  beforeEach(async () => {
    jest.clearAllMocks();
    const data = await seed();
    tokens = data.tokens;
  });

  describe("Closing a Diagnosis", () => {
    it("should reject closing when report does not exist or is in draft status (400, closed=false)", async () => {
      // 1. No report exists yet
      const resNoReport = await request(app)
        .patch("/diagnoses/d1/close")
        .set("Authorization", `Bearer ${tokens.therapist1}`);
      expect(resNoReport.status).toBe(400);

      // 2. Report exists in draft status
      await db.collection("reports").doc("rep1").set({
        diagnosisId: "d1",
        childId: "c1",
        therapistId: "therapist1",
        status: "draft",
        formData: { title: "דוח טיוטה" },
      });

      const resDraft = await request(app)
        .patch("/diagnoses/d1/close")
        .set("Authorization", `Bearer ${tokens.therapist1}`);
      expect(resDraft.status).toBe(400);

      const diagDoc = await db.collection("diagnoses").doc("d1").get();
      expect(diagDoc.data().closed).toBe(false);
    });

    it("should allow closing when report status is completed (200, closed=true)", async () => {
      await db.collection("reports").doc("rep1").set({
        diagnosisId: "d1",
        childId: "c1",
        therapistId: "therapist1",
        status: "completed",
        formData: { title: "דוח אבחון סופי" },
      });

      const res = await request(app)
        .patch("/diagnoses/d1/close")
        .set("Authorization", `Bearer ${tokens.therapist1}`);

      expect(res.status).toBe(200);

      const diagDoc = await db.collection("diagnoses").doc("d1").get();
      expect(diagDoc.data().closed).toBe(true);
      expect(diagDoc.data().closedAt).toBeDefined();
    });
  });

  describe("Parent & Therapist PDF Export Permissions", () => {
    beforeEach(async () => {
      // Completed report in rep1
      await db.collection("reports").doc("rep1").set({
        diagnosisId: "d1",
        childId: "c1",
        therapistId: "therapist1",
        status: "completed",
        formData: { title: "דוח אבחון סופי" },
      });
    });

    it("should forbid parent from exporting PDF before diagnosis is closed (403)", async () => {
      // d1.closed is false
      const res = await request(app)
        .get("/reports/d1/export")
        .set("Authorization", `Bearer ${tokens.parentA}`);

      expect(res.status).toBe(403);
      expect(res.body.error).toContain("לאחר סגירת האבחון");
    });

    it("should allow parent to export PDF after diagnosis is officially closed (200)", async () => {
      await db.collection("diagnoses").doc("d1").update({
        closed: true,
        closedAt: new Date().toISOString(),
      });

      const res = await request(app)
        .get("/reports/d1/export")
        .set("Authorization", `Bearer ${tokens.parentA}`);

      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toContain("application/pdf");
      expect(res.headers["content-disposition"]).toContain("report_d1.pdf");
    });

    it("should forbid therapist2 from exporting report of d1 (403)", async () => {
      await db.collection("diagnoses").doc("d1").update({
        closed: true,
        closedAt: new Date().toISOString(),
      });

      const res = await request(app)
        .get("/reports/d1/export")
        .set("Authorization", `Bearer ${tokens.therapist2}`);

      expect(res.status).toBe(403);
    });
  });

  describe("Reopening / Unlocking a Report", () => {
    beforeEach(async () => {
      await db.collection("reports").doc("rep1").set({
        diagnosisId: "d1",
        childId: "c1",
        therapistId: "therapist1",
        status: "completed",
        formData: { title: "דוח הושלם" },
      });
    });

    it("should unlock report before closing: set report status to in_progress", async () => {
      const res = await request(app)
        .put("/reports/d1/unlock")
        .set("Authorization", `Bearer ${tokens.therapist1}`);

      expect(res.status).toBe(200);

      const repDoc = await db.collection("reports").doc("rep1").get();
      expect(repDoc.data().status).toBe("in_progress");
    });

    it("should reject unlocking a report after diagnosis is officially closed", async () => {
      await db.collection("diagnoses").doc("d1").update({
        closed: true,
        closedAt: new Date().toISOString(),
      });

      const res = await request(app)
        .put("/reports/d1/unlock")
        .set("Authorization", `Bearer ${tokens.therapist1}`);

      expect([400, 403, 409]).toContain(res.status);
    });
  });
});
