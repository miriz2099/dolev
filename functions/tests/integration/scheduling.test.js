const request = require("supertest");
const app = require("../../app");
const { seed, db } = require("./helpers");

const getNextTuesdayDate = () => {
  const d = new Date();
  const day = d.getDay(); // 0 is Sunday, 2 is Tuesday
  const daysUntilTuesday = (2 - day + 7) % 7 || 7;
  d.setDate(d.getDate() + daysUntilTuesday);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

describe("Appointment Scheduling & Concurrency Integration Tests (scheduling.test.js)", () => {
  let tokens;
  let tuesdayDate;
  let availStart;
  let availEnd;
  let slot90Start;
  let slot90End;
  const assessmentId = "asm_test_90";

  beforeEach(async () => {
    const data = await seed();
    tokens = data.tokens;

    tuesdayDate = getNextTuesdayDate();
    availStart = `${tuesdayDate}T09:00:00`;
    availEnd = `${tuesdayDate}T12:00:00`;
    slot90Start = `${tuesdayDate}T09:00:00`;
    slot90End = `${tuesdayDate}T10:30:00`;

    // הוסיפי אבחון נדרש של 90 דקות ל-d1
    await db.collection("diagnoses").doc("d1").update({
      requiredAssessments: [
        {
          id: assessmentId,
          name: "מבחן אינטליגנציה WISC",
          durationMinutes: 90,
          status: "pending",
          scheduledEventId: null,
          createdAt: new Date().toISOString(),
        },
      ],
    });

    // יצירת זמינות של therapist1 ביום שלישי הבא 09:00-12:00
    await db.collection("diary_events").add({
      therapistId: "therapist1",
      type: "availability",
      title: "זמינות לבדיקות",
      start: availStart,
      end: availEnd,
      isRecurring: false,
      createdAt: new Date().toISOString(),
    });
  });

  it("should reject booking before consent form is fully signed and keep DB unchanged", async () => {
    // consentFormStatus in d1 is 'pending'
    const res = await request(app)
      .post(`/diagnoses/d1/assessments/${assessmentId}/book`)
      .set("Authorization", `Bearer ${tokens.parentA}`)
      .send({
        start: slot90Start,
        end: slot90End,
      });

    expect(res.status).toBe(409);
    expect(res.body.error).toContain("טופס ההסכמה");

    // וידוא שלא נוצר מסמך appointment במסד
    const eventsSnap = await db
      .collection("diary_events")
      .where("therapistId", "==", "therapist1")
      .where("type", "==", "appointment")
      .get();
    expect(eventsSnap.empty).toBe(true);

    // וידוא שהאבחון נשאר pending
    const diagDoc = await db.collection("diagnoses").doc("d1").get();
    const asm = diagDoc.data().requiredAssessments[0];
    expect(asm.status).toBe("pending");
  });

  describe("After consent form is fully signed", () => {
    beforeEach(async () => {
      await db.collection("diagnoses").doc("d1").update({
        consentFormStatus: "fully_signed",
      });
    });

    it("should return available slots starting at 09:00, 09:30, 10:00, 10:30 and none ending after 12:00", async () => {
      const res = await request(app)
        .get(`/diagnoses/d1/assessments/${assessmentId}/available-slots`)
        .set("Authorization", `Bearer ${tokens.parentA}`);

      expect(res.status).toBe(200);
      expect(res.body.slots).toBeDefined();

      const startTimes = res.body.slots.map((s) => s.start.split("T")[1]);
      expect(startTimes).toEqual(["09:00:00", "09:30:00", "10:00:00", "10:30:00"]);

      // Verify no slot ends after 12:00:00
      for (const slot of res.body.slots) {
        expect(slot.end <= availEnd).toBe(true);
      }
    });

    it("should book slot successfully: create appointment, mark scheduled with scheduledStart, and notify therapist", async () => {
      const res = await request(app)
        .post(`/diagnoses/d1/assessments/${assessmentId}/book`)
        .set("Authorization", `Bearer ${tokens.parentA}`)
        .send({
          start: slot90Start,
          end: slot90End,
        });

      expect(res.status).toBe(201);
      expect(res.body.eventId).toBeDefined();

      // Verify appointment event created in diary_events
      const eventsSnap = await db
        .collection("diary_events")
        .where("therapistId", "==", "therapist1")
        .where("type", "==", "appointment")
        .get();
      expect(eventsSnap.size).toBe(1);
      const appt = eventsSnap.docs[0].data();
      expect(appt.start).toBe(slot90Start);
      expect(appt.end).toBe(slot90End);

      // Verify diagnosis assessment updated to scheduled
      const diagDoc = await db.collection("diagnoses").doc("d1").get();
      const asm = diagDoc.data().requiredAssessments[0];
      expect(asm.status).toBe("scheduled");
      expect(asm.scheduledStart).toBe(slot90Start);
      expect(asm.scheduledEventId).toBe(eventsSnap.docs[0].id);

      // Verify message sent to therapist
      const msgSnap = await db
        .collection("messages")
        .where("receiverId", "==", "therapist1")
        .get();
      expect(msgSnap.empty).toBe(false);
    });

    it("should reject booking outside availability, with wrong duration, or in the past", async () => {
      // 1. Outside availability (14:00 - 15:30)
      const resOutside = await request(app)
        .post(`/diagnoses/d1/assessments/${assessmentId}/book`)
        .set("Authorization", `Bearer ${tokens.parentA}`)
        .send({
          start: `${tuesdayDate}T14:00:00`,
          end: `${tuesdayDate}T15:30:00`,
        });
      expect(resOutside.status).toBe(409);

      // 2. Wrong duration (60 mins instead of 90)
      const resWrongDuration = await request(app)
        .post(`/diagnoses/d1/assessments/${assessmentId}/book`)
        .set("Authorization", `Bearer ${tokens.parentA}`)
        .send({
          start: `${tuesdayDate}T09:00:00`,
          end: `${tuesdayDate}T10:00:00`,
        });
      expect(resWrongDuration.status).toBe(400);

      // 3. In the past
      const resPast = await request(app)
        .post(`/diagnoses/d1/assessments/${assessmentId}/book`)
        .set("Authorization", `Bearer ${tokens.parentA}`)
        .send({
          start: "2020-01-01T09:00:00",
          end: "2020-01-01T10:30:00",
        });
      expect(resPast.status).toBe(400);
    });

    it("should reject double-booking the same assessment with 409", async () => {
      // First booking succeeds
      const res1 = await request(app)
        .post(`/diagnoses/d1/assessments/${assessmentId}/book`)
        .set("Authorization", `Bearer ${tokens.parentA}`)
        .send({ start: slot90Start, end: slot90End });
      expect(res1.status).toBe(201);

      // Second booking on the same assessment returns 409
      const res2 = await request(app)
        .post(`/diagnoses/d1/assessments/${assessmentId}/book`)
        .set("Authorization", `Bearer ${tokens.parentA}`)
        .send({ start: `${tuesdayDate}T10:30:00`, end: `${tuesdayDate}T12:00:00` });
      expect(res2.status).toBe(409);
    });

    it("should handle race condition between two parents concurrently booking the same slot (exactly one 201)", async () => {
      // Setup child c3 for parentB also assigned to therapist1, with diagnosis d3
      await db.collection("children").doc("c3").set({
        parentId: "parentB",
        therapistId: "therapist1",
        firstName: "ילד3",
        lastName: "לוי",
      });

      await db.collection("diagnoses").doc("d3").set({
        childId: "c3",
        therapistId: "therapist1",
        consentFormStatus: "fully_signed",
        closed: false,
        requiredAssessments: [
          {
            id: "asm_c3",
            name: "מבחן נפרד",
            durationMinutes: 90,
            status: "pending",
          },
        ],
      });

      // Concurrent race condition using Promise.all
      const [resParentA, resParentB] = await Promise.all([
        request(app)
          .post(`/diagnoses/d1/assessments/${assessmentId}/book`)
          .set("Authorization", `Bearer ${tokens.parentA}`)
          .send({ start: slot90Start, end: slot90End }),
        request(app)
          .post(`/diagnoses/d3/assessments/asm_c3/book`)
          .set("Authorization", `Bearer ${tokens.parentB}`)
          .send({ start: slot90Start, end: slot90End }),
      ]);

      const statuses = [resParentA.status, resParentB.status].sort();
      // Exactly one succeeds (201) and the other fails due to conflict/transaction (409)
      expect(statuses).toEqual([201, 409]);

      // Exactly one appointment event created at that hour
      const apptSnap = await db
        .collection("diary_events")
        .where("therapistId", "==", "therapist1")
        .where("type", "==", "appointment")
        .where("start", "==", slot90Start)
        .get();
      expect(apptSnap.size).toBe(1);
    });

    it("should remove booked slot from available-slots of subsequent requests", async () => {
      // Book 09:00-10:30
      await request(app)
        .post(`/diagnoses/d1/assessments/${assessmentId}/book`)
        .set("Authorization", `Bearer ${tokens.parentA}`)
        .send({ start: slot90Start, end: slot90End });

      // Create a second pending assessment on d1
      const asm2Id = "asm_second_90";
      const diagDoc = await db.collection("diagnoses").doc("d1").get();
      const currentAsms = diagDoc.data().requiredAssessments;
      currentAsms.push({
        id: asm2Id,
        name: "אבחון דידקטי",
        durationMinutes: 90,
        status: "pending",
      });
      await db.collection("diagnoses").doc("d1").update({
        requiredAssessments: currentAsms,
      });

      // Query available slots for second assessment
      const res = await request(app)
        .get(`/diagnoses/d1/assessments/${asm2Id}/available-slots`)
        .set("Authorization", `Bearer ${tokens.parentA}`);

      expect(res.status).toBe(200);
      const remainingStarts = res.body.slots.map((s) => s.start);
      // 09:00 is booked, 09:30 conflicts, 10:00 conflicts. Only 10:30 remains!
      expect(remainingStarts).not.toContain(slot90Start);
      expect(remainingStarts).toEqual([`${tuesdayDate}T10:30:00`]);
    });

    it("should reset assessment to pending when therapist deletes appointment in diary", async () => {
      const bookRes = await request(app)
        .post(`/diagnoses/d1/assessments/${assessmentId}/book`)
        .set("Authorization", `Bearer ${tokens.parentA}`)
        .send({ start: slot90Start, end: slot90End });
      const eventId = bookRes.body.eventId;

      // Therapist deletes event directly from diary
      const delRes = await request(app)
        .delete(`/diary/events/${eventId}`)
        .set("Authorization", `Bearer ${tokens.therapist1}`);
      expect(delRes.status).toBe(200);

      // Assessment reverted to pending and cleared scheduledStart
      const diagDoc = await db.collection("diagnoses").doc("d1").get();
      const asm = diagDoc.data().requiredAssessments[0];
      expect(asm.status).toBe("pending");
      expect(asm.scheduledStart).toBeNull();

      // Parent was notified
      const msgSnap = await db
        .collection("messages")
        .where("receiverId", "==", "parentA")
        .get();
      expect(msgSnap.empty).toBe(false);
    });

    it("should reset assessment to pending when therapist cancels via assessment cancel route", async () => {
      await request(app)
        .post(`/diagnoses/d1/assessments/${assessmentId}/book`)
        .set("Authorization", `Bearer ${tokens.parentA}`)
        .send({ start: slot90Start, end: slot90End });

      const cancelRes = await request(app)
        .delete(`/diagnoses/d1/assessments/${assessmentId}/cancel`)
        .set("Authorization", `Bearer ${tokens.therapist1}`);
      expect(cancelRes.status).toBe(200);

      const diagDoc = await db.collection("diagnoses").doc("d1").get();
      expect(diagDoc.data().requiredAssessments[0].status).toBe("pending");
    });

    it("should reset assessment to pending and notify therapist when parent cancels", async () => {
      await request(app)
        .post(`/diagnoses/d1/assessments/${assessmentId}/book`)
        .set("Authorization", `Bearer ${tokens.parentA}`)
        .send({ start: slot90Start, end: slot90End });

      const cancelRes = await request(app)
        .delete(`/diagnoses/d1/assessments/${assessmentId}/cancel`)
        .set("Authorization", `Bearer ${tokens.parentA}`);
      expect(cancelRes.status).toBe(200);

      const diagDoc = await db.collection("diagnoses").doc("d1").get();
      expect(diagDoc.data().requiredAssessments[0].status).toBe("pending");

      // Notification sent to therapist
      const msgSnap = await db
        .collection("messages")
        .where("receiverId", "==", "therapist1")
        .get();
      expect(msgSnap.empty).toBe(false);
    });
  });

  describe("Recurring Availability & Daylight Saving Immunity", () => {
    it("should generate recurring availability series without hour shifts across weeks", async () => {
      // Clear initial availability
      const existingAvail = await db
        .collection("diary_events")
        .where("therapistId", "==", "therapist1")
        .get();
      for (const d of existingAvail.docs) await d.ref.delete();

      await db.collection("diagnoses").doc("d1").update({
        consentFormStatus: "fully_signed",
      });

      // Post recurring availability 09:00 - 12:00
      const recRes = await request(app)
        .post("/diary/events")
        .set("Authorization", `Bearer ${tokens.therapist1}`)
        .send({
          title: "זמינות שבועית קבועה",
          start: `${tuesdayDate}T09:00:00`,
          end: `${tuesdayDate}T12:00:00`,
          type: "availability",
          isRecurring: true,
        });

      expect(recRes.status).toBe(201);

      // Query available slots
      const slotsRes = await request(app)
        .get(`/diagnoses/d1/assessments/${assessmentId}/available-slots`)
        .set("Authorization", `Bearer ${tokens.parentA}`);

      expect(slotsRes.status).toBe(200);
      expect(slotsRes.body.slots.length).toBeGreaterThan(4);

      // Check all slots start between 09:00:00 and 10:30:00
      const allowedTimeStarts = [
        "09:00:00",
        "09:30:00",
        "10:00:00",
        "10:30:00",
      ];
      for (const slot of slotsRes.body.slots) {
        const timePart = slot.start.split("T")[1];
        expect(allowedTimeStarts).toContain(timePart);
      }
    });
  });
});
