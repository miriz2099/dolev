const request = require("supertest");
const app = require("../../app");
const { seed, db } = require("./helpers");

describe("Access Control & Tenant Isolation Integration Tests (access-control.test.js)", () => {
  let tokens;

  beforeEach(async () => {
    const data = await seed();
    tokens = data.tokens;
  });

  describe("Unauthenticated Requests (Missing Token)", () => {
    const protectedRoutes = [
      { method: "get", path: "/children/myChildren" },
      { method: "get", path: "/diagnoses/child/c1" },
      { method: "get", path: "/reports/diagnosis/d1" },
      { method: "get", path: "/diary/events" },
    ];

    for (const { method, path } of protectedRoutes) {
      it(`should reject unauthenticated request with 401 on ${method.toUpperCase()} ${path}`, async () => {
        const res = await request(app)[method](path);
        expect(res.status).toBe(401);
      });
    }
  });

  describe("Cross-Therapist Isolation (Therapist2 accessing Therapist1 data)", () => {
    it("should forbid therapist2 from accessing report of d1 with 403", async () => {
      const res = await request(app)
        .get("/reports/diagnosis/d1")
        .set("Authorization", `Bearer ${tokens.therapist2}`);

      expect(res.status).toBe(403);
    });

    it("should forbid therapist2 from closing d1 and ensure database remains unchanged", async () => {
      const res = await request(app)
        .patch("/diagnoses/d1/close")
        .set("Authorization", `Bearer ${tokens.therapist2}`);

      expect(res.status).toBe(403);

      const diagDoc = await db.collection("diagnoses").doc("d1").get();
      expect(diagDoc.data().closed).toBe(false);
    });

    it("should forbid therapist2 from adding assessment to d1 and leave database unchanged", async () => {
      const res = await request(app)
        .post("/diagnoses/d1/assessments")
        .set("Authorization", `Bearer ${tokens.therapist2}`)
        .send({ name: "אבחון לא מורשה", durationMinutes: 60 });

      expect(res.status).toBe(403);

      const diagDoc = await db.collection("diagnoses").doc("d1").get();
      expect(diagDoc.data().requiredAssessments).toEqual([]);
    });

    it("should forbid therapist2 from fetching school questionnaire invitation for d1", async () => {
      const res = await request(app)
        .get("/school-questionnaires/invitation/d1")
        .set("Authorization", `Bearer ${tokens.therapist2}`);

      expect(res.status).toBe(403);
    });
  });

  describe("Cross-Parent Isolation (ParentB accessing ParentA data)", () => {
    it("should forbid parentB from accessing child c1 with 403", async () => {
      const res = await request(app)
        .get("/children/c1")
        .set("Authorization", `Bearer ${tokens.parentB}`);

      expect(res.status).toBe(403);
    });

    it("should forbid parentB from accessing consent form of d1 with 403", async () => {
      const res = await request(app)
        .get("/consent-forms/by-diagnosis/d1")
        .set("Authorization", `Bearer ${tokens.parentB}`);

      expect(res.status).toBe(403);
    });

    it("should forbid parentB from viewing available slots of d1 with 403", async () => {
      const res = await request(app)
        .get("/diagnoses/d1/assessments/asm_dummy/available-slots")
        .set("Authorization", `Bearer ${tokens.parentB}`);

      expect(res.status).toBe(403);
    });
  });

  describe("Privilege Escalation Defense: Parent attempting Therapist Actions", () => {
    it("should forbid parent from closing a diagnosis", async () => {
      const res = await request(app)
        .patch("/diagnoses/d1/close")
        .set("Authorization", `Bearer ${tokens.parentA}`);

      expect(res.status).toBe(403);
    });

    it("should forbid parent from adding required assessments", async () => {
      const res = await request(app)
        .post("/diagnoses/d1/assessments")
        .set("Authorization", `Bearer ${tokens.parentA}`)
        .send({ name: "בדיקה אסורה", durationMinutes: 60 });

      expect(res.status).toBe(403);
    });

    it("should forbid parent from unlocking a report for editing", async () => {
      const res = await request(app)
        .put("/reports/d1/unlock")
        .set("Authorization", `Bearer ${tokens.parentA}`);

      expect(res.status).toBe(403);
    });
  });

  describe("Privilege Escalation Defense: Therapist attempting Admin Actions", () => {
    it("should forbid therapist from creating a new child profile (Admin only)", async () => {
      const res = await request(app)
        .post("/children/create")
        .set("Authorization", `Bearer ${tokens.therapist1}`)
        .send({ firstName: "ילד", lastName: "חדש", parentId: "parentA" });

      expect(res.status).toBe(403);
    });

    it("should forbid therapist from creating staff members (Admin only)", async () => {
      const res = await request(app)
        .post("/admin/create-staff")
        .set("Authorization", `Bearer ${tokens.therapist1}`)
        .send({ email: "newstaff@clinic.com", role: "therapist" });

      expect(res.status).toBe(403);
    });

    it("should forbid therapist from creating parent accounts (Admin only)", async () => {
      const res = await request(app)
        .post("/users/create-parent")
        .set("Authorization", `Bearer ${tokens.therapist1}`)
        .send({ email: "newparent@clinic.com" });

      expect(res.status).toBe(403);
    });
  });

  describe("Admin Overriding Access", () => {
    it("should permit admin1 to access report of d1 without 403", async () => {
      const res = await request(app)
        .get("/reports/diagnosis/d1")
        .set("Authorization", `Bearer ${tokens.admin1}`);

      expect(res.status).not.toBe(403);
      expect(res.status).toBe(200);
    });
  });

  describe("Known Flaw: Missing Ownership Check in POST /diagnoses/create", () => {
    // באג ידוע בקוד המוצר: ל-POST /diagnoses/create אין בדיקת בעלות,
    // ולכן therapist2 מסוגל לפתוח אבחון לילד c1 שמשויך ל-therapist1.
    // לפי עיקרון 2, הבדיקה מסומנת test.failing ומתועדת ב-BUGS_FOUND.md.
    test.failing(
      "should forbid therapist2 from opening a diagnosis for child c1 owned by therapist1 (BUG: missing ownership check in createDiagnosis)",
      async () => {
        const res = await request(app)
          .post("/diagnoses/create")
          .set("Authorization", `Bearer ${tokens.therapist2}`)
          .send({ childId: "c1" });

        // Expected behavior according to spec: therapist2 should be forbidden
        expect(res.status).toBe(403);
      },
    );
  });
});
