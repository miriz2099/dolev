// // /**
// //  * פורמט תאריך לעברית להצגה בהודעה
// //  */
// // const formatDateForMessage = (isoStr) => {
// //   const date = new Date(isoStr);
// //   const day = String(date.getDate()).padStart(2, "0");
// //   const month = String(date.getMonth() + 1).padStart(2, "0");
// //   const hours = String(date.getHours()).padStart(2, "0");
// //   const minutes = String(date.getMinutes()).padStart(2, "0");
// //   return `${day}/${month} בשעה ${hours}:${minutes}`;
// // };

// // // ============================================
// // // Helpers - חישוב slots פנויים
// // // ============================================

// // /**
// //  * חיתוך availability slot לחלונות אפשריים באורך נתון
// //  */
// // const sliceAvailabilityIntoWindows = (
// //   availStart,
// //   availEnd,
// //   durationMinutes,
// // ) => {
// //   const windows = [];
// //   const stepMs = SLOT_STEP_MINUTES * 60 * 1000;
// //   const durationMs = durationMinutes * 60 * 1000;

// //   const startTime = new Date(availStart).getTime();
// //   const endTime = new Date(availEnd).getTime();

// //   let currentStart = startTime;
// //   while (currentStart + durationMs <= endTime) {
// //     const windowEnd = currentStart + durationMs;
// //     windows.push({
// //       start: new Date(currentStart).toISOString(),
// //       end: new Date(windowEnd).toISOString(),
// //     });
// //     currentStart += stepMs;
// //   }
// //   return windows;
// // };

// // /**
// //  * בדיקה האם חלון מתנגש עם appointments קיימים
// //  */
// // const isWindowConflicting = (windowStart, windowEnd, appointments) => {
// //   const wStart = new Date(windowStart).getTime();
// //   const wEnd = new Date(windowEnd).getTime();

// //   return appointments.some((appt) => {
// //     const aStart = new Date(appt.start).getTime();
// //     const aEnd = new Date(appt.end).getTime();
// //     return wStart < aEnd && aStart < wEnd;
// //   });
// // };

// // /**
// //  * בדיקה שה-slot המבוקש בתוך availability ולא מתנגש עם appointments
// //  * משמש לפני יצירת תור (להגן מפני ניסיונות זדוניים/race conditions)
// //  */
// // const validateSlotAvailability = async (therapistId, start, end) => {
// //   const startDate = new Date(start);
// //   const endDate = new Date(end);

// //   const eventsSnapshot = await db
// //     .collection("diary_events")
// //     .where("therapistId", "==", therapistId)
// //     .get();

// //   let isInsideAvailability = false;

// //   for (const doc of eventsSnapshot.docs) {
// //     const ev = doc.data();
// //     const evStart = new Date(ev.start);
// //     const evEnd = new Date(ev.end);

// //     if (ev.type === "availability") {
// //       // בודקים אם ה-slot המבוקש בתוך החלון של ה-availability
// //       if (startDate >= evStart && endDate <= evEnd) {
// //         isInsideAvailability = true;
// //       }
// //     } else if (ev.type === "appointment") {
// //       // בדיקת חפיפה עם appointment קיים
// //       if (startDate < evEnd && evStart < endDate) {
// //         return {
// //           valid: false,
// //           error: "השעה כבר תפוסה - אנא בחרי שעה אחרת",
// //         };
// //       }
// //     }
// //   }

// //   if (!isInsideAvailability) {
// //     return {
// //       valid: false,
// //       error: "השעה המבוקשת לא נמצאת בחלון זמינות של המאבחן",
// //     };
// //   }

// //   return { valid: true };
// // };

// // // ============================================
// // // Helpers - אימות בעלות
// // // ============================================

// // const verifyDiagnosisOwnership = async (diagnosisId, therapistId) => {
// //   const diagRef = db.collection("diagnoses").doc(diagnosisId);
// //   const diagDoc = await diagRef.get();

// //   if (!diagDoc.exists) {
// //     const err = new Error("האבחון לא נמצא");
// //     err.statusCode = 404;
// //     throw err;
// //   }

// //   const diagData = diagDoc.data();
// //   if (diagData.therapistId !== therapistId) {
// //     const err = new Error("אין הרשאה לערוך אבחון זה");
// //     err.statusCode = 403;
// //     throw err;
// //   }

// //   return { diagRef, diagData };
// // };

// // // ============================================
// // // יצירת / שליפת / עדכון אבחונים (Diagnoses)
// // // ============================================

// // const createDiagnosis = async (req, res) => {
// //   try {
// //     const { childId } = req.body;
// //     const therapistId = req.user.uid;

// //     if (!childId) return res.status(400).json({ error: "Child ID is missing" });

// //     const childDoc = await db.collection("children").doc(childId).get();
// //     if (!childDoc.exists)
// //       return res.status(404).json({ error: "Child not found" });
// //     const childData = childDoc.data();

// //     const batch = db.batch();

// //     const diagRef = db.collection("diagnoses").doc();
// //     batch.set(diagRef, {
// //       childId,
// //       therapistId,
// //       status: "בתהליך",
// //       parentQuestionnaireStatus: "פתוח",
// //       createdAt: new Date().toISOString(),
// //     });

// //     const childRef = db.collection("children").doc(childId);
// //     batch.update(childRef, { canFillQuestionnaire: true });

// //     const msgRef = db.collection("messages").doc();
// //     batch.set(msgRef, {
// //       senderId: therapistId,
// //       receiverId: childData.parentId,
// //       childId: childId,
// //       text: `שלום, פתחתי תהליך אבחון עבור ${childData.firstName}. נא להיכנס ללשונית "אישורים וטפסים" ולמלא את שאלון ההורים. בהצלחה!`,
// //       createdAt: new Date().toISOString(),
// //       read: false,
// //     });

// //     await batch.commit();
// //     res.status(201).json({ message: "Diagnosis opened and notification sent" });
// //   } catch (error) {
// //     console.error("Error in createDiagnosis:", error);
// //     res.status(500).json({ error: "Failed to open diagnosis" });
// //   }
// // };

// // const getDiagnosesByChild = async (req, res) => {
// //   try {
// //     const { childId } = req.params;
// //     const snapshot = await db
// //       .collection("diagnoses")
// //       .where("childId", "==", childId)
// //       .orderBy("createdAt", "desc")
// //       .get();

// //     const diagnoses = [];
// //     snapshot.forEach((doc) => {
// //       diagnoses.push({ id: doc.id, ...doc.data() });
// //     });

// //     res.status(200).json(diagnoses);
// //   } catch (error) {
// //     console.error("Error fetching diagnoses:", error);
// //     res.status(500).json({ error: "כשל בשליפת אבחונים" });
// //   }
// // };

// // const updateQuestionnaireStatus = async (req, res) => {
// //   try {
// //     const { diagnosisId } = req.params;
// //     const { childId, status } = req.body;

// //     if (!status || !childId) {
// //       return res.status(400).json({ error: "סטטוס או מזהה ילד חסרים" });
// //     }

// //     const batch = db.batch();

// //     const diagRef = db.collection("diagnoses").doc(diagnosisId);
// //     batch.update(diagRef, {
// //       parentQuestionnaireStatus: status,
// //       updatedAt: new Date().toISOString(),
// //     });

// //     if (status === "לתיקון" || status === "פתוח") {
// //       const childRef = db.collection("children").doc(childId);
// //       batch.update(childRef, { canFillQuestionnaire: true });
// //     }

// //     await batch.commit();
// //     res
// //       .status(200)
// //       .json({ message: `סטטוס השאלון עודכן ל-${status} והשאלון נפתח למילוי` });
// //   } catch (error) {
// //     console.error("Error updating status:", error);
// //     res.status(500).json({ error: "כשל בעדכון הסטטוס" });
// //   }
// // };

// // const submitQuestionnaire = async (req, res) => {
// //   try {
// //     const { childId, formData } = req.body;
// //     const parentId = req.user.uid;

// //     const batch = db.batch();

// //     const questionnaireRef = db
// //       .collection("parent_questionnaires")
// //       .doc(childId);
// //     batch.set(questionnaireRef, {
// //       childId,
// //       parentId,
// //       formData,
// //       submittedAt: new Date().toISOString(),
// //     });

// //     const diagnosesSnapshot = await db
// //       .collection("diagnoses")
// //       .where("childId", "==", childId)
// //       .where("status", "==", "בתהליך")
// //       .limit(1)
// //       .get();

// //     if (!diagnosesSnapshot.empty) {
// //       const diagDoc = diagnosesSnapshot.docs[0];
// //       batch.update(diagDoc.ref, {
// //         parentQuestionnaireStatus: "נשלח",
// //       });
// //     }

// //     const childRef = db.collection("children").doc(childId);
// //     batch.update(childRef, { canFillQuestionnaire: false });

// //     await batch.commit();
// //     res.status(200).json({ message: "Submitted successfully and locked" });
// //   } catch (error) {
// //     console.error("Error in submitQuestionnaire:", error);
// //     res.status(500).json({ error: "Failed to submit" });
// //   }
// // };

// // const getParentQuestionnaireAnswers = async (req, res) => {
// //   try {
// //     const { childId } = req.params;
// //     const doc = await db.collection("parent_questionnaires").doc(childId).get();

// //     if (!doc.exists) {
// //       return res
// //         .status(404)
// //         .json({ error: "טרם מולא שאלון הורים עבור ילד זה" });
// //     }

// //     res.status(200).json(doc.data());
// //   } catch (error) {
// //     res.status(500).json({ error: "נכשלה שליפת השאלון" });
// //   }
// // };

// // // ============================================
// // // ניהול אבחונים נדרשים (Required Assessments)
// // // ============================================

// // const addRequiredAssessment = async (req, res) => {
// //   try {
// //     const { diagnosisId } = req.params;
// //     const { name, durationMinutes } = req.body;
// //     const therapistId = req.user.uid;

// //     if (!name || !name.trim()) {
// //       return res.status(400).json({ error: "שם האבחון הוא שדה חובה" });
// //     }
// //     if (
// //       !durationMinutes ||
// //       typeof durationMinutes !== "number" ||
// //       durationMinutes <= 0 ||
// //       durationMinutes > 480
// //     ) {
// //       return res.status(400).json({
// //         error: "משך הזמן חייב להיות מספר חיובי (עד 480 דקות / 8 שעות)",
// //       });
// //     }

// //     const { diagRef, diagData } = await verifyDiagnosisOwnership(
// //       diagnosisId,
// //       therapistId,
// //     );

// //     const newAssessment = {
// //       id: `asm_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
// //       name: name.trim(),
// //       durationMinutes,
// //       status: "pending",
// //       scheduledEventId: null,
// //       createdAt: new Date().toISOString(),
// //     };

// //     const currentAssessments = diagData.requiredAssessments || [];
// //     const updatedAssessments = [...currentAssessments, newAssessment];

// //     await diagRef.update({
// //       requiredAssessments: updatedAssessments,
// //       updatedAt: new Date().toISOString(),
// //     });

// //     res.status(201).json({
// //       message: "האבחון נוסף לרשימה",
// //       assessment: newAssessment,
// //     });
// //   } catch (error) {
// //     if (error.statusCode) {
// //       return res.status(error.statusCode).json({ error: error.message });
// //     }
// //     console.error("Error in addRequiredAssessment:", error);
// //     res.status(500).json({ error: "שגיאת שרת בהוספת אבחון" });
// //   }
// // };

// // const updateRequiredAssessment = async (req, res) => {
// //   try {
// //     const { diagnosisId, assessmentId } = req.params;
// //     const { name, durationMinutes } = req.body;
// //     const therapistId = req.user.uid;

// //     const { diagRef, diagData } = await verifyDiagnosisOwnership(
// //       diagnosisId,
// //       therapistId,
// //     );

// //     const assessments = diagData.requiredAssessments || [];
// //     const idx = assessments.findIndex((a) => a.id === assessmentId);

// //     if (idx === -1) {
// //       return res.status(404).json({ error: "האבחון לא נמצא ברשימה" });
// //     }

// //     if (assessments[idx].status !== "pending") {
// //       return res.status(409).json({
// //         error: "לא ניתן לערוך אבחון שכבר נקבע לו תור או הושלם",
// //       });
// //     }

// //     const updated = { ...assessments[idx] };
// //     if (name !== undefined) {
// //       if (!name.trim()) {
// //         return res.status(400).json({ error: "שם האבחון לא יכול להיות ריק" });
// //       }
// //       updated.name = name.trim();
// //     }
// //     if (durationMinutes !== undefined) {
// //       if (
// //         typeof durationMinutes !== "number" ||
// //         durationMinutes <= 0 ||
// //         durationMinutes > 480
// //       ) {
// //         return res.status(400).json({ error: "משך זמן לא חוקי (1-480 דקות)" });
// //       }
// //       updated.durationMinutes = durationMinutes;
// //     }

// //     assessments[idx] = updated;

// //     await diagRef.update({
// //       requiredAssessments: assessments,
// //       updatedAt: new Date().toISOString(),
// //     });

// //     res.status(200).json({
// //       message: "האבחון עודכן",
// //       assessment: updated,
// //     });
// //   } catch (error) {
// //     if (error.statusCode) {
// //       return res.status(error.statusCode).json({ error: error.message });
// //     }
// //     console.error("Error in updateRequiredAssessment:", error);
// //     res.status(500).json({ error: "שגיאת שרת בעדכון אבחון" });
// //   }
// // };

// // const deleteRequiredAssessment = async (req, res) => {
// //   try {
// //     const { diagnosisId, assessmentId } = req.params;
// //     const therapistId = req.user.uid;

// //     const { diagRef, diagData } = await verifyDiagnosisOwnership(
// //       diagnosisId,
// //       therapistId,
// //     );

// //     const assessments = diagData.requiredAssessments || [];
// //     const target = assessments.find((a) => a.id === assessmentId);

// //     if (!target) {
// //       return res.status(404).json({ error: "האבחון לא נמצא ברשימה" });
// //     }

// //     if (target.status === "scheduled") {
// //       return res.status(409).json({
// //         error: "לא ניתן למחוק אבחון שכבר נקבע לו תור. יש לבטל את התור תחילה.",
// //       });
// //     }

// //     const filtered = assessments.filter((a) => a.id !== assessmentId);

// //     await diagRef.update({
// //       requiredAssessments: filtered,
// //       updatedAt: new Date().toISOString(),
// //     });

// //     res.status(200).json({ message: "האבחון נמחק מהרשימה" });
// //   } catch (error) {
// //     if (error.statusCode) {
// //       return res.status(error.statusCode).json({ error: error.message });
// //     }
// //     console.error("Error in deleteRequiredAssessment:", error);
// //     res.status(500).json({ error: "שגיאת שרת במחיקת אבחון" });
// //   }
// // };

// // // ============================================
// // // קביעת ובחירת תורים (Booking)
// // // ============================================

// // /**
// //  * GET /diagnoses/:diagnosisId/assessments/:assessmentId/available-slots
// //  * החזרת רשימת slots פנויים להורה
// //  */
// // const getAvailableSlots = async (req, res) => {
// //   try {
// //     const { diagnosisId, assessmentId } = req.params;
// //     const userId = req.user.uid;

// //     const diagDoc = await db.collection("diagnoses").doc(diagnosisId).get();
// //     if (!diagDoc.exists) {
// //       return res.status(404).json({ error: "האבחון לא נמצא" });
// //     }
// //     const diagData = diagDoc.data();

// //     const childDoc = await db
// //       .collection("children")
// //       .doc(diagData.childId)
// //       .get();
// //     if (!childDoc.exists) {
// //       return res.status(404).json({ error: "הילד לא נמצא" });
// //     }
// //     const childData = childDoc.data();

// //     if (childData.parentId !== userId) {
// //       return res
// //         .status(403)
// //         .json({ error: "אין הרשאה לצפות בזמינויות עבור ילד זה" });
// //     }

// //     const assessments = diagData.requiredAssessments || [];
// //     const assessment = assessments.find((a) => a.id === assessmentId);
// //     if (!assessment) {
// //       return res.status(404).json({ error: "האבחון הספציפי לא נמצא" });
// //     }

// //     // אם כבר נקבע תור - להחזיר אותו במקום slots
// //     if (assessment.status === "scheduled" && assessment.scheduledEventId) {
// //       const eventDoc = await db
// //         .collection("diary_events")
// //         .doc(assessment.scheduledEventId)
// //         .get();

// //       if (eventDoc.exists) {
// //         return res.status(200).json({
// //           alreadyScheduled: true,
// //           appointment: { id: eventDoc.id, ...eventDoc.data() },
// //           slots: [],
// //         });
// //       }
// //     }

// //     if (assessment.status === "completed") {
// //       return res.status(200).json({
// //         completed: true,
// //         slots: [],
// //       });
// //     }

// //     const therapistId = childData.therapistId;
// //     const eventsSnapshot = await db
// //       .collection("diary_events")
// //       .where("therapistId", "==", therapistId)
// //       .get();

// //     const now = new Date();
// //     const availabilities = [];
// //     const appointments = [];

// //     eventsSnapshot.forEach((doc) => {
// //       const ev = { id: doc.id, ...doc.data() };
// //       const evEnd = new Date(ev.end);

// //       if (evEnd <= now) return;

// //       if (ev.type === "availability") {
// //         availabilities.push(ev);
// //       } else if (ev.type === "appointment") {
// //         appointments.push(ev);
// //       }
// //     });

// //     const allSlots = [];
// //     for (const avail of availabilities) {
// //       const windows = sliceAvailabilityIntoWindows(
// //         avail.start,
// //         avail.end,
// //         assessment.durationMinutes,
// //       );

// //       for (const window of windows) {
// //         if (new Date(window.start) <= now) continue;
// //         if (isWindowConflicting(window.start, window.end, appointments)) {
// //           continue;
// //         }

// //         allSlots.push({
// //           start: window.start,
// //           end: window.end,
// //           availabilityId: avail.id,
// //         });
// //       }
// //     }

// //     allSlots.sort((a, b) => new Date(a.start) - new Date(b.start));

// //     res.status(200).json({
// //       assessment: {
// //         id: assessment.id,
// //         name: assessment.name,
// //         durationMinutes: assessment.durationMinutes,
// //         status: assessment.status,
// //       },
// //       slots: allSlots,
// //       totalSlots: allSlots.length,
// //     });
// //   } catch (error) {
// //     console.error("Error in getAvailableSlots:", error);
// //     res.status(500).json({ error: "שגיאת שרת בחישוב זמינויות" });
// //   }
// // };

// // /**
// //  * POST /diagnoses/:diagnosisId/assessments/:assessmentId/book
// //  * הזמנת תור ע"י הורה - עם Firestore Transaction למניעת race conditions
// //  */
// // const bookAssessmentAppointment = async (req, res) => {
// //   try {
// //     const { diagnosisId, assessmentId } = req.params;
// //     const { start, end } = req.body;
// //     const userId = req.user.uid;

// //     // === ולידציות בסיסיות ===
// //     if (!start || !end) {
// //       return res.status(400).json({ error: "חסרים שעות התחלה/סיום" });
// //     }
// //     if (new Date(end) <= new Date(start)) {
// //       return res
// //         .status(400)
// //         .json({ error: "שעת הסיום חייבת להיות אחרי שעת ההתחלה" });
// //     }
// //     if (new Date(start) <= new Date()) {
// //       return res.status(400).json({ error: "לא ניתן לקבוע תור בעבר" });
// //     }

// //     // === שליפת diagnosis + child לאימות בעלות ===
// //     const diagDoc = await db.collection("diagnoses").doc(diagnosisId).get();
// //     if (!diagDoc.exists) {
// //       return res.status(404).json({ error: "האבחון לא נמצא" });
// //     }
// //     const diagData = diagDoc.data();
// //     const childId = diagData.childId;

// //     const childDoc = await db.collection("children").doc(childId).get();
// //     if (!childDoc.exists) {
// //       return res.status(404).json({ error: "הילד לא נמצא" });
// //     }
// //     const childData = childDoc.data();

// //     if (childData.parentId !== userId) {
// //       return res.status(403).json({ error: "אין הרשאה לקבוע תור עבור ילד זה" });
// //     }

// //     const therapistId = childData.therapistId;

// //     // === וידוא שה-assessment עדיין pending + תואם משך ===
// //     const assessments = diagData.requiredAssessments || [];
// //     const assessment = assessments.find((a) => a.id === assessmentId);
// //     if (!assessment) {
// //       return res.status(404).json({ error: "האבחון הספציפי לא נמצא" });
// //     }
// //     if (assessment.status !== "pending") {
// //       return res.status(409).json({
// //         error:
// //           assessment.status === "scheduled"
// //             ? "כבר נקבע תור לאבחון זה"
// //             : "האבחון כבר הושלם",
// //       });
// //     }

// //     const requestedDurationMinutes =
// //       (new Date(end) - new Date(start)) / (1000 * 60);
// //     if (requestedDurationMinutes !== assessment.durationMinutes) {
// //       return res.status(400).json({
// //         error: `משך הזמן המבוקש (${requestedDurationMinutes} דק') לא תואם לאבחון (${assessment.durationMinutes} דק')`,
// //       });
// //     }

// //     // === בדיקת זמינות מקדימה (לפני ה-transaction) ===
// //     // מוודא ש-slot בתוך availability + לא מתנגש עם appointments קיימים
// //     const validation = await validateSlotAvailability(therapistId, start, end);
// //     if (!validation.valid) {
// //       return res.status(409).json({ error: validation.error });
// //     }

// //     // === FIRESTORE TRANSACTION - יצירת event + עדכון assessment ===
// //     const result = await db.runTransaction(async (transaction) => {
// //       const diagRef = db.collection("diagnoses").doc(diagnosisId);
// //       const diagSnap = await transaction.get(diagRef);

// //       if (!diagSnap.exists) {
// //         throw { statusCode: 404, message: "האבחון לא נמצא" };
// //       }

// //       const freshDiagData = diagSnap.data();
// //       const freshAssessments = freshDiagData.requiredAssessments || [];
// //       const idx = freshAssessments.findIndex((a) => a.id === assessmentId);

// //       if (idx === -1) {
// //         throw { statusCode: 404, message: "האבחון הספציפי לא נמצא" };
// //       }

// //       const freshAssessment = freshAssessments[idx];

// //       // בדיקה כפולה - שמא בזמן הבדיקה המקדימה מישהו אחר הקדים
// //       if (freshAssessment.status !== "pending") {
// //         throw { statusCode: 409, message: "כבר נקבע תור לאבחון זה" };
// //       }

// //       // יצירת ה-event החדש
// //       const newEventRef = db.collection("diary_events").doc();
// //       const eventData = {
// //         therapistId,
// //         type: "appointment",
// //         title: `${freshAssessment.name} - ${childData.firstName} ${childData.lastName}`,
// //         start,
// //         end,
// //         description: `נקבע ע"י ההורה דרך מערכת התיאום`,
// //         childId,
// //         childName: `${childData.firstName} ${childData.lastName}`,
// //         diagnosisId,
// //         assessmentId,
// //         bookedByParent: true,
// //         createdAt: new Date().toISOString(),
// //       };

// //       transaction.set(newEventRef, eventData);

// //       // עדכון ה-assessment
// //       const updatedAssessments = [...freshAssessments];
// //       updatedAssessments[idx] = {
// //         ...freshAssessment,
// //         status: "scheduled",
// //         scheduledEventId: newEventRef.id,
// //         scheduledAt: new Date().toISOString(),
// //       };

// //       transaction.update(diagRef, {
// //         requiredAssessments: updatedAssessments,
// //         updatedAt: new Date().toISOString(),
// //       });

// //       return {
// //         eventId: newEventRef.id,
// //         event: eventData,
// //         assessment: updatedAssessments[idx],
// //       };
// //     });

// //     // === הודעה למאבחן (לא חוסם אם נכשל) ===
// //     try {
// //       await db.collection("messages").add({
// //         senderId: userId,
// //         receiverId: therapistId,
// //         childId,
// //         text: `שלום, קבעתי תור ל-${result.assessment.name} עבור ${childData.firstName} בתאריך ${formatDateForMessage(start)}.`,
// //         read: false,
// //         createdAt: new Date().toISOString(),
// //       });
// //     } catch (msgErr) {
// //       console.error("Failed to send notification message:", msgErr);
// //     }

// //     res.status(201).json({
// //       message: "התור נקבע בהצלחה!",
// //       eventId: result.eventId,
// //       assessment: result.assessment,
// //     });
// //   } catch (error) {
// //     if (error.statusCode) {
// //       return res.status(error.statusCode).json({ error: error.message });
// //     }
// //     console.error("Error in bookAssessmentAppointment:", error);
// //     res.status(500).json({ error: "שגיאת שרת בקביעת התור" });
// //   }
// // };

// // /**
// //  * DELETE /diagnoses/:diagnosisId/assessments/:assessmentId/cancel
// //  * ביטול תור שנקבע - גם הורה וגם מאבחן יכולים
// //  */
// // const cancelAssessmentAppointment = async (req, res) => {
// //   try {
// //     const { diagnosisId, assessmentId } = req.params;
// //     const userId = req.user.uid;

// //     const diagDoc = await db.collection("diagnoses").doc(diagnosisId).get();
// //     if (!diagDoc.exists) {
// //       return res.status(404).json({ error: "האבחון לא נמצא" });
// //     }
// //     const diagData = diagDoc.data();

// //     const childDoc = await db
// //       .collection("children")
// //       .doc(diagData.childId)
// //       .get();
// //     if (!childDoc.exists) {
// //       return res.status(404).json({ error: "הילד לא נמצא" });
// //     }
// //     const childData = childDoc.data();

// //     // אבטחה: גם ההורה וגם המאבחן יכולים לבטל
// //     const isParent = childData.parentId === userId;
// //     const isTherapist = childData.therapistId === userId;
// //     if (!isParent && !isTherapist) {
// //       return res.status(403).json({ error: "אין הרשאה לבטל תור זה" });
// //     }

// //     const assessments = diagData.requiredAssessments || [];
// //     const idx = assessments.findIndex((a) => a.id === assessmentId);
// //     if (idx === -1) {
// //       return res.status(404).json({ error: "האבחון הספציפי לא נמצא" });
// //     }

// //     const assessment = assessments[idx];
// //     if (assessment.status !== "scheduled" || !assessment.scheduledEventId) {
// //       return res.status(409).json({ error: "אין תור פעיל לביטול" });
// //     }

// //     const batch = db.batch();

// //     // 1. מחיקת ה-event
// //     const eventRef = db
// //       .collection("diary_events")
// //       .doc(assessment.scheduledEventId);
// //     batch.delete(eventRef);

// //     // 2. החזרת ה-assessment ל-pending
// //     const updatedAssessments = [...assessments];
// //     updatedAssessments[idx] = {
// //       ...assessment,
// //       status: "pending",
// //       scheduledEventId: null,
// //       scheduledAt: null,
// //       cancelledAt: new Date().toISOString(),
// //       cancelledBy: isParent ? "parent" : "therapist",
// //     };

// //     const diagRef = db.collection("diagnoses").doc(diagnosisId);
// //     batch.update(diagRef, {
// //       requiredAssessments: updatedAssessments,
// //       updatedAt: new Date().toISOString(),
// //     });

// //     // 3. הודעה לצד השני
// //     const msgRef = db.collection("messages").doc();
// //     batch.set(msgRef, {
// //       senderId: userId,
// //       receiverId: isParent ? childData.therapistId : childData.parentId,
// //       childId: diagData.childId,
// //       text: `התור ל-${assessment.name} עבור ${childData.firstName} בוטל. ניתן לקבוע תור חדש.`,
// //       read: false,
// //       createdAt: new Date().toISOString(),
// //     });

// //     await batch.commit();

// //     res.status(200).json({
// //       message: "התור בוטל בהצלחה",
// //       assessment: updatedAssessments[idx],
// //     });
// //   } catch (error) {
// //     console.error("Error in cancelAssessmentAppointment:", error);
// //     res.status(500).json({ error: "שגיאת שרת בביטול התור" });
// //   }
// // };

// // // ============================================
// // // Module Exports
// // // ============================================

// // module.exports = {
// //   // ניהול diagnosis
// //   createDiagnosis,
// //   getDiagnosesByChild,
// //   updateQuestionnaireStatus,
// //   submitQuestionnaire,
// //   getParentQuestionnaireAnswers,

// //   // ניהול אבחונים נדרשים
// //   addRequiredAssessment,
// //   updateRequiredAssessment,
// //   deleteRequiredAssessment,

// //   // קביעת ובחירת תורים
// //   getAvailableSlots,
// //   bookAssessmentAppointment,
// //   cancelAssessmentAppointment,

// //   // Helpers (אם תרצי להשתמש בהם בקבצים אחרים)
// //   formatDateForMessage,
// // };

// const { db } = require("../config/firebase");

// const SLOT_STEP_MINUTES = 30;

// // ============================================
// // Helpers - עבודה עם Naive ISO Strings
// // ============================================
// // הערה חשובה: כל ה-events במערכת נשמרים בפורמט naive ISO ("2026-05-10T09:00")
// // בלי timezone suffix. לכן אסור להשתמש ב-new Date() ו-toISOString() על
// // המחרוזות האלה - זה יוצר timezone shift לפי שעון השרת. במקום זה,
// // משתמשים ב-Date.UTC ובניית מחרוזת ידנית כדי לשמור על העקביות.

// /**
//  * הוספת דקות ל-naive ISO string
//  * "2026-05-10T09:00" + 90 דקות => "2026-05-10T10:30:00"
//  */
// const addMinutesToNaiveISO = (isoStr, minutesToAdd) => {
//   const [datePart, timePart] = isoStr.split("T");
//   const [year, month, day] = datePart.split("-").map(Number);
//   const timeParts = timePart.split(":");
//   const hours = parseInt(timeParts[0], 10);
//   const minutes = parseInt(timeParts[1], 10);
//   const seconds = timeParts[2] ? parseInt(timeParts[2], 10) : 0;

//   // משתמשים ב-Date.UTC כדי למנוע timezone shift של השרת
//   const utcMs = Date.UTC(year, month - 1, day, hours, minutes, seconds);
//   const newUtcMs = utcMs + minutesToAdd * 60 * 1000;

//   // בנייה ידנית של מחרוזת naive ISO ללא Z
//   const d = new Date(newUtcMs);
//   const yyyy = d.getUTCFullYear();
//   const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
//   const dd = String(d.getUTCDate()).padStart(2, "0");
//   const hh = String(d.getUTCHours()).padStart(2, "0");
//   const mn = String(d.getUTCMinutes()).padStart(2, "0");
//   const ss = String(d.getUTCSeconds()).padStart(2, "0");

//   return `${yyyy}-${mm}-${dd}T${hh}:${mn}:${ss}`;
// };

// /**
//  * חישוב הפרש בדקות בין 2 naive ISO strings
//  * minutesDiffNaiveISO("...T10:30", "...T09:00") = 90
//  */
// const minutesDiffNaiveISO = (laterISO, earlierISO) => {
//   const toUtcMs = (iso) => {
//     const [datePart, timePart] = iso.split("T");
//     const [y, m, d] = datePart.split("-").map(Number);
//     const tp = timePart.split(":");
//     return Date.UTC(
//       y,
//       m - 1,
//       d,
//       parseInt(tp[0], 10),
//       parseInt(tp[1], 10),
//       tp[2] ? parseInt(tp[2], 10) : 0,
//     );
//   };
//   return (toUtcMs(laterISO) - toUtcMs(earlierISO)) / (60 * 1000);
// };

// /**
//  * החזרת הזמן הנוכחי כ-naive ISO לפי timezone ישראל
//  * (כי ה-events נשמרים לפי שעון מקומי ישראלי)
//  */
// const getCurrentNaiveISO = () => {
//   const now = new Date();
//   // sv-SE format: "2026-05-10 16:30:45"
//   const israelTimeStr = now.toLocaleString("sv-SE", {
//     timeZone: "Asia/Jerusalem",
//   });
//   return israelTimeStr.replace(" ", "T");
// };

// /**
//  * פורמט תאריך לעברית להצגה בהודעה
//  * משתמש ב-naive ISO ופירוק ידני - בלי timezone shifts
//  */
// const formatDateForMessage = (isoStr) => {
//   const [datePart, timePart] = isoStr.split("T");
//   const [, month, day] = datePart.split("-");
//   const [hh, mm] = timePart.split(":");
//   return `${day}/${month} בשעה ${hh}:${mm}`;
// };

// // ============================================
// // Helpers - חישוב slots פנויים
// // ============================================

// /**
//  * חיתוך availability slot לחלונות אפשריים באורך נתון
//  * עובד על naive ISO strings ישירות - בלי timezone shifts
//  */
// const sliceAvailabilityIntoWindows = (
//   availStart,
//   availEnd,
//   durationMinutes,
// ) => {
//   const windows = [];
//   const totalAvailableMinutes = minutesDiffNaiveISO(availEnd, availStart);

//   // אם ה-availability קצרה ממשך האבחון - אין חלונות
//   if (totalAvailableMinutes < durationMinutes) {
//     return windows;
//   }

//   // ההתחלה האחרונה האפשרית = (totalAvailableMinutes - durationMinutes)
//   // לדוגמה: availability 8.5 שעות (510 דק'), אבחון 90 דק' => maxStartOffset = 420 דק'
//   const maxStartOffset = totalAvailableMinutes - durationMinutes;

//   for (
//     let offsetMin = 0;
//     offsetMin <= maxStartOffset;
//     offsetMin += SLOT_STEP_MINUTES
//   ) {
//     const slotStart = addMinutesToNaiveISO(availStart, offsetMin);
//     const slotEnd = addMinutesToNaiveISO(slotStart, durationMinutes);
//     windows.push({ start: slotStart, end: slotEnd });
//   }

//   return windows;
// };

// /**
//  * בדיקה האם חלון מתנגש עם appointments קיימים
//  * משווה כ-strings - naive ISO לוקסיקוגרפי = chronological
//  */
// const isWindowConflicting = (windowStart, windowEnd, appointments) => {
//   return appointments.some((appt) => {
//     return windowStart < appt.end && appt.start < windowEnd;
//   });
// };

// /**
//  * בדיקה שה-slot המבוקש בתוך availability ולא מתנגש עם appointments
//  * עובד על naive ISO - השוואת strings ישירה
//  */
// const validateSlotAvailability = async (therapistId, start, end) => {
//   const eventsSnapshot = await db
//     .collection("diary_events")
//     .where("therapistId", "==", therapistId)
//     .get();

//   let isInsideAvailability = false;

//   for (const doc of eventsSnapshot.docs) {
//     const ev = doc.data();

//     if (ev.type === "availability") {
//       // ה-slot המבוקש חייב להיות בתוך החלון של ה-availability
//       if (start >= ev.start && end <= ev.end) {
//         isInsideAvailability = true;
//       }
//     } else if (ev.type === "appointment") {
//       // בדיקת חפיפה
//       if (start < ev.end && ev.start < end) {
//         return {
//           valid: false,
//           error: "השעה כבר תפוסה - אנא בחרי שעה אחרת",
//         };
//       }
//     }
//   }

//   if (!isInsideAvailability) {
//     return {
//       valid: false,
//       error: "השעה המבוקשת לא נמצאת בחלון זמינות של המאבחן",
//     };
//   }

//   return { valid: true };
// };

// // ============================================
// // Helpers - אימות בעלות
// // ============================================

// const verifyDiagnosisOwnership = async (diagnosisId, therapistId) => {
//   const diagRef = db.collection("diagnoses").doc(diagnosisId);
//   const diagDoc = await diagRef.get();

//   if (!diagDoc.exists) {
//     const err = new Error("האבחון לא נמצא");
//     err.statusCode = 404;
//     throw err;
//   }

//   const diagData = diagDoc.data();
//   if (diagData.therapistId !== therapistId) {
//     const err = new Error("אין הרשאה לערוך אבחון זה");
//     err.statusCode = 403;
//     throw err;
//   }

//   return { diagRef, diagData };
// };

// // ============================================
// // יצירת / שליפת / עדכון אבחונים (Diagnoses)
// // ============================================

// const createDiagnosis = async (req, res) => {
//   try {
//     const { childId } = req.body;
//     const therapistId = req.user.uid;

//     if (!childId) return res.status(400).json({ error: "Child ID is missing" });

//     const childDoc = await db.collection("children").doc(childId).get();
//     if (!childDoc.exists)
//       return res.status(404).json({ error: "Child not found" });
//     const childData = childDoc.data();

//     const batch = db.batch();

//     const diagRef = db.collection("diagnoses").doc();
//     batch.set(diagRef, {
//       childId,
//       therapistId,
//       status: "בתהליך",
//       parentQuestionnaireStatus: "פתוח",
//       createdAt: new Date().toISOString(),
//     });

//     const childRef = db.collection("children").doc(childId);
//     batch.update(childRef, { canFillQuestionnaire: true });

//     const msgRef = db.collection("messages").doc();
//     batch.set(msgRef, {
//       senderId: therapistId,
//       receiverId: childData.parentId,
//       childId: childId,
//       text: `שלום, פתחתי תהליך אבחון עבור ${childData.firstName}. נא להיכנס ללשונית "אישורים וטפסים" ולמלא את שאלון ההורים. בהצלחה!`,
//       createdAt: new Date().toISOString(),
//       read: false,
//     });

//     await batch.commit();
//     res.status(201).json({ message: "Diagnosis opened and notification sent" });
//   } catch (error) {
//     console.error("Error in createDiagnosis:", error);
//     res.status(500).json({ error: "Failed to open diagnosis" });
//   }
// };

// const getDiagnosesByChild = async (req, res) => {
//   try {
//     const { childId } = req.params;
//     const snapshot = await db
//       .collection("diagnoses")
//       .where("childId", "==", childId)
//       .orderBy("createdAt", "desc")
//       .get();

//     const diagnoses = [];
//     snapshot.forEach((doc) => {
//       diagnoses.push({ id: doc.id, ...doc.data() });
//     });

//     res.status(200).json(diagnoses);
//   } catch (error) {
//     console.error("Error fetching diagnoses:", error);
//     res.status(500).json({ error: "כשל בשליפת אבחונים" });
//   }
// };

// const updateQuestionnaireStatus = async (req, res) => {
//   try {
//     const { diagnosisId } = req.params;
//     const { childId, status } = req.body;

//     if (!status || !childId) {
//       return res.status(400).json({ error: "סטטוס או מזהה ילד חסרים" });
//     }

//     const batch = db.batch();

//     const diagRef = db.collection("diagnoses").doc(diagnosisId);
//     batch.update(diagRef, {
//       parentQuestionnaireStatus: status,
//       updatedAt: new Date().toISOString(),
//     });

//     if (status === "לתיקון" || status === "פתוח") {
//       const childRef = db.collection("children").doc(childId);
//       batch.update(childRef, { canFillQuestionnaire: true });
//     }

//     await batch.commit();
//     res
//       .status(200)
//       .json({ message: `סטטוס השאלון עודכן ל-${status} והשאלון נפתח למילוי` });
//   } catch (error) {
//     console.error("Error updating status:", error);
//     res.status(500).json({ error: "כשל בעדכון הסטטוס" });
//   }
// };

// const submitQuestionnaire = async (req, res) => {
//   try {
//     const { childId, formData } = req.body;
//     const parentId = req.user.uid;

//     const batch = db.batch();

//     const questionnaireRef = db
//       .collection("parent_questionnaires")
//       .doc(childId);
//     batch.set(questionnaireRef, {
//       childId,
//       parentId,
//       formData,
//       submittedAt: new Date().toISOString(),
//     });

//     const diagnosesSnapshot = await db
//       .collection("diagnoses")
//       .where("childId", "==", childId)
//       .where("status", "==", "בתהליך")
//       .limit(1)
//       .get();

//     if (!diagnosesSnapshot.empty) {
//       const diagDoc = diagnosesSnapshot.docs[0];
//       batch.update(diagDoc.ref, {
//         parentQuestionnaireStatus: "נשלח",
//       });
//     }

//     const childRef = db.collection("children").doc(childId);
//     batch.update(childRef, { canFillQuestionnaire: false });

//     await batch.commit();
//     res.status(200).json({ message: "Submitted successfully and locked" });
//   } catch (error) {
//     console.error("Error in submitQuestionnaire:", error);
//     res.status(500).json({ error: "Failed to submit" });
//   }
// };

// const getParentQuestionnaireAnswers = async (req, res) => {
//   try {
//     const { childId } = req.params;
//     const doc = await db.collection("parent_questionnaires").doc(childId).get();

//     if (!doc.exists) {
//       return res
//         .status(404)
//         .json({ error: "טרם מולא שאלון הורים עבור ילד זה" });
//     }

//     res.status(200).json(doc.data());
//   } catch (error) {
//     res.status(500).json({ error: "נכשלה שליפת השאלון" });
//   }
// };

// // ============================================
// // ניהול אבחונים נדרשים (Required Assessments)
// // ============================================

// const addRequiredAssessment = async (req, res) => {
//   try {
//     const { diagnosisId } = req.params;
//     const { name, durationMinutes } = req.body;
//     const therapistId = req.user.uid;

//     if (!name || !name.trim()) {
//       return res.status(400).json({ error: "שם האבחון הוא שדה חובה" });
//     }
//     if (
//       !durationMinutes ||
//       typeof durationMinutes !== "number" ||
//       durationMinutes <= 0 ||
//       durationMinutes > 480
//     ) {
//       return res.status(400).json({
//         error: "משך הזמן חייב להיות מספר חיובי (עד 480 דקות / 8 שעות)",
//       });
//     }

//     const { diagRef, diagData } = await verifyDiagnosisOwnership(
//       diagnosisId,
//       therapistId,
//     );

//     const newAssessment = {
//       id: `asm_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
//       name: name.trim(),
//       durationMinutes,
//       status: "pending",
//       scheduledEventId: null,
//       createdAt: new Date().toISOString(),
//     };

//     const currentAssessments = diagData.requiredAssessments || [];
//     const updatedAssessments = [...currentAssessments, newAssessment];

//     await diagRef.update({
//       requiredAssessments: updatedAssessments,
//       updatedAt: new Date().toISOString(),
//     });

//     res.status(201).json({
//       message: "האבחון נוסף לרשימה",
//       assessment: newAssessment,
//     });
//   } catch (error) {
//     if (error.statusCode) {
//       return res.status(error.statusCode).json({ error: error.message });
//     }
//     console.error("Error in addRequiredAssessment:", error);
//     res.status(500).json({ error: "שגיאת שרת בהוספת אבחון" });
//   }
// };

// const updateRequiredAssessment = async (req, res) => {
//   try {
//     const { diagnosisId, assessmentId } = req.params;
//     const { name, durationMinutes } = req.body;
//     const therapistId = req.user.uid;

//     const { diagRef, diagData } = await verifyDiagnosisOwnership(
//       diagnosisId,
//       therapistId,
//     );

//     const assessments = diagData.requiredAssessments || [];
//     const idx = assessments.findIndex((a) => a.id === assessmentId);

//     if (idx === -1) {
//       return res.status(404).json({ error: "האבחון לא נמצא ברשימה" });
//     }

//     if (assessments[idx].status !== "pending") {
//       return res.status(409).json({
//         error: "לא ניתן לערוך אבחון שכבר נקבע לו תור או הושלם",
//       });
//     }

//     const updated = { ...assessments[idx] };
//     if (name !== undefined) {
//       if (!name.trim()) {
//         return res.status(400).json({ error: "שם האבחון לא יכול להיות ריק" });
//       }
//       updated.name = name.trim();
//     }
//     if (durationMinutes !== undefined) {
//       if (
//         typeof durationMinutes !== "number" ||
//         durationMinutes <= 0 ||
//         durationMinutes > 480
//       ) {
//         return res.status(400).json({ error: "משך זמן לא חוקי (1-480 דקות)" });
//       }
//       updated.durationMinutes = durationMinutes;
//     }

//     assessments[idx] = updated;

//     await diagRef.update({
//       requiredAssessments: assessments,
//       updatedAt: new Date().toISOString(),
//     });

//     res.status(200).json({
//       message: "האבחון עודכן",
//       assessment: updated,
//     });
//   } catch (error) {
//     if (error.statusCode) {
//       return res.status(error.statusCode).json({ error: error.message });
//     }
//     console.error("Error in updateRequiredAssessment:", error);
//     res.status(500).json({ error: "שגיאת שרת בעדכון אבחון" });
//   }
// };

// const deleteRequiredAssessment = async (req, res) => {
//   try {
//     const { diagnosisId, assessmentId } = req.params;
//     const therapistId = req.user.uid;

//     const { diagRef, diagData } = await verifyDiagnosisOwnership(
//       diagnosisId,
//       therapistId,
//     );

//     const assessments = diagData.requiredAssessments || [];
//     const target = assessments.find((a) => a.id === assessmentId);

//     if (!target) {
//       return res.status(404).json({ error: "האבחון לא נמצא ברשימה" });
//     }

//     if (target.status === "scheduled") {
//       return res.status(409).json({
//         error: "לא ניתן למחוק אבחון שכבר נקבע לו תור. יש לבטל את התור תחילה.",
//       });
//     }

//     const filtered = assessments.filter((a) => a.id !== assessmentId);

//     await diagRef.update({
//       requiredAssessments: filtered,
//       updatedAt: new Date().toISOString(),
//     });

//     res.status(200).json({ message: "האבחון נמחק מהרשימה" });
//   } catch (error) {
//     if (error.statusCode) {
//       return res.status(error.statusCode).json({ error: error.message });
//     }
//     console.error("Error in deleteRequiredAssessment:", error);
//     res.status(500).json({ error: "שגיאת שרת במחיקת אבחון" });
//   }
// };

// // ============================================
// // קביעת ובחירת תורים (Booking)
// // ============================================

// /**
//  * GET /diagnoses/:diagnosisId/assessments/:assessmentId/available-slots
//  * החזרת רשימת slots פנויים להורה
//  */
// const getAvailableSlots = async (req, res) => {
//   try {
//     const { diagnosisId, assessmentId } = req.params;
//     const userId = req.user.uid;

//     const diagDoc = await db.collection("diagnoses").doc(diagnosisId).get();
//     if (!diagDoc.exists) {
//       return res.status(404).json({ error: "האבחון לא נמצא" });
//     }
//     const diagData = diagDoc.data();

//     const childDoc = await db
//       .collection("children")
//       .doc(diagData.childId)
//       .get();
//     if (!childDoc.exists) {
//       return res.status(404).json({ error: "הילד לא נמצא" });
//     }
//     const childData = childDoc.data();

//     if (childData.parentId !== userId) {
//       return res
//         .status(403)
//         .json({ error: "אין הרשאה לצפות בזמינויות עבור ילד זה" });
//     }

//     const assessments = diagData.requiredAssessments || [];
//     const assessment = assessments.find((a) => a.id === assessmentId);
//     if (!assessment) {
//       return res.status(404).json({ error: "האבחון הספציפי לא נמצא" });
//     }

//     // אם כבר נקבע תור - להחזיר אותו במקום slots
//     if (assessment.status === "scheduled" && assessment.scheduledEventId) {
//       const eventDoc = await db
//         .collection("diary_events")
//         .doc(assessment.scheduledEventId)
//         .get();

//       if (eventDoc.exists) {
//         return res.status(200).json({
//           alreadyScheduled: true,
//           appointment: { id: eventDoc.id, ...eventDoc.data() },
//           slots: [],
//         });
//       }
//     }

//     if (assessment.status === "completed") {
//       return res.status(200).json({
//         completed: true,
//         slots: [],
//       });
//     }

//     const therapistId = childData.therapistId;
//     const eventsSnapshot = await db
//       .collection("diary_events")
//       .where("therapistId", "==", therapistId)
//       .get();

//     // השוואות "עכשיו" כ-naive ISO לפי שעון ישראל
//     const nowISO = getCurrentNaiveISO();

//     const availabilities = [];
//     const appointments = [];

//     eventsSnapshot.forEach((doc) => {
//       const ev = { id: doc.id, ...doc.data() };

//       // מתעלמים מאירועים שנגמרו (השוואת strings - naive ISO chronological)
//       if (ev.end <= nowISO) return;

//       if (ev.type === "availability") {
//         availabilities.push(ev);
//       } else if (ev.type === "appointment") {
//         appointments.push(ev);
//       }
//     });

//     const allSlots = [];
//     for (const avail of availabilities) {
//       const windows = sliceAvailabilityIntoWindows(
//         avail.start,
//         avail.end,
//         assessment.durationMinutes,
//       );

//       for (const window of windows) {
//         // סינון חלונות שמתחילים בעבר (השוואת strings)
//         if (window.start <= nowISO) continue;

//         // סינון חלונות שמתנגשים עם appointments קיימים
//         if (isWindowConflicting(window.start, window.end, appointments)) {
//           continue;
//         }

//         allSlots.push({
//           start: window.start,
//           end: window.end,
//           availabilityId: avail.id,
//         });
//       }
//     }

//     // מיון - השוואת strings (naive ISO chronological)
//     allSlots.sort((a, b) =>
//       a.start < b.start ? -1 : a.start > b.start ? 1 : 0,
//     );

//     res.status(200).json({
//       assessment: {
//         id: assessment.id,
//         name: assessment.name,
//         durationMinutes: assessment.durationMinutes,
//         status: assessment.status,
//       },
//       slots: allSlots,
//       totalSlots: allSlots.length,
//     });
//   } catch (error) {
//     console.error("Error in getAvailableSlots:", error);
//     res.status(500).json({ error: "שגיאת שרת בחישוב זמינויות" });
//   }
// };

// /**
//  * POST /diagnoses/:diagnosisId/assessments/:assessmentId/book
//  * הזמנת תור ע"י הורה - עם Firestore Transaction למניעת race conditions
//  */
// const bookAssessmentAppointment = async (req, res) => {
//   try {
//     const { diagnosisId, assessmentId } = req.params;
//     const { start, end } = req.body;
//     const userId = req.user.uid;

//     // === ולידציות בסיסיות (השוואת strings, ללא timezone shifts) ===
//     if (!start || !end) {
//       return res.status(400).json({ error: "חסרים שעות התחלה/סיום" });
//     }
//     if (end <= start) {
//       return res
//         .status(400)
//         .json({ error: "שעת הסיום חייבת להיות אחרי שעת ההתחלה" });
//     }
//     if (start <= getCurrentNaiveISO()) {
//       return res.status(400).json({ error: "לא ניתן לקבוע תור בעבר" });
//     }

//     // === שליפת diagnosis + child לאימות בעלות ===
//     const diagDoc = await db.collection("diagnoses").doc(diagnosisId).get();
//     if (!diagDoc.exists) {
//       return res.status(404).json({ error: "האבחון לא נמצא" });
//     }
//     const diagData = diagDoc.data();
//     const childId = diagData.childId;

//     const childDoc = await db.collection("children").doc(childId).get();
//     if (!childDoc.exists) {
//       return res.status(404).json({ error: "הילד לא נמצא" });
//     }
//     const childData = childDoc.data();

//     if (childData.parentId !== userId) {
//       return res.status(403).json({ error: "אין הרשאה לקבוע תור עבור ילד זה" });
//     }

//     const therapistId = childData.therapistId;

//     // === וידוא שה-assessment עדיין pending + תואם משך ===
//     const assessments = diagData.requiredAssessments || [];
//     const assessment = assessments.find((a) => a.id === assessmentId);
//     if (!assessment) {
//       return res.status(404).json({ error: "האבחון הספציפי לא נמצא" });
//     }
//     if (assessment.status !== "pending") {
//       return res.status(409).json({
//         error:
//           assessment.status === "scheduled"
//             ? "כבר נקבע תור לאבחון זה"
//             : "האבחון כבר הושלם",
//       });
//     }

//     // חישוב משך באמצעות helper שעובד על naive ISO
//     const requestedDurationMinutes = minutesDiffNaiveISO(end, start);
//     if (requestedDurationMinutes !== assessment.durationMinutes) {
//       return res.status(400).json({
//         error: `משך הזמן המבוקש (${requestedDurationMinutes} דק') לא תואם לאבחון (${assessment.durationMinutes} דק')`,
//       });
//     }

//     // === בדיקת זמינות מקדימה (לפני ה-transaction) ===
//     const validation = await validateSlotAvailability(therapistId, start, end);
//     if (!validation.valid) {
//       return res.status(409).json({ error: validation.error });
//     }

//     // === FIRESTORE TRANSACTION - יצירת event + עדכון assessment ===
//     const result = await db.runTransaction(async (transaction) => {
//       const diagRef = db.collection("diagnoses").doc(diagnosisId);
//       const diagSnap = await transaction.get(diagRef);

//       if (!diagSnap.exists) {
//         throw { statusCode: 404, message: "האבחון לא נמצא" };
//       }

//       const freshDiagData = diagSnap.data();
//       const freshAssessments = freshDiagData.requiredAssessments || [];
//       const idx = freshAssessments.findIndex((a) => a.id === assessmentId);

//       if (idx === -1) {
//         throw { statusCode: 404, message: "האבחון הספציפי לא נמצא" };
//       }

//       const freshAssessment = freshAssessments[idx];

//       // בדיקה כפולה - שמא בזמן הבדיקה המקדימה מישהו אחר הקדים
//       if (freshAssessment.status !== "pending") {
//         throw { statusCode: 409, message: "כבר נקבע תור לאבחון זה" };
//       }

//       // יצירת ה-event החדש
//       const newEventRef = db.collection("diary_events").doc();
//       const eventData = {
//         therapistId,
//         type: "appointment",
//         title: `${freshAssessment.name} - ${childData.firstName} ${childData.lastName}`,
//         start,
//         end,
//         description: `נקבע ע"י ההורה דרך מערכת התיאום`,
//         childId,
//         childName: `${childData.firstName} ${childData.lastName}`,
//         diagnosisId,
//         assessmentId,
//         bookedByParent: true,
//         createdAt: new Date().toISOString(),
//       };

//       transaction.set(newEventRef, eventData);

//       // עדכון ה-assessment
//       const updatedAssessments = [...freshAssessments];
//       updatedAssessments[idx] = {
//         ...freshAssessment,
//         status: "scheduled",
//         scheduledEventId: newEventRef.id,
//         scheduledAt: new Date().toISOString(), // מתי ההזמנה בוצעה
//         scheduledStart: start, // 🆕 שעת התחלת התור
//         scheduledEnd: end,
//       };

//       transaction.update(diagRef, {
//         requiredAssessments: updatedAssessments,
//         updatedAt: new Date().toISOString(),
//       });

//       return {
//         eventId: newEventRef.id,
//         event: eventData,
//         assessment: updatedAssessments[idx],
//       };
//     });

//     // === הודעה למאבחן (לא חוסם אם נכשל) ===
//     try {
//       await db.collection("messages").add({
//         senderId: userId,
//         receiverId: therapistId,
//         childId,
//         text: `שלום, קבעתי תור ל-${result.assessment.name} עבור ${childData.firstName} בתאריך ${formatDateForMessage(start)}.`,
//         read: false,
//         createdAt: new Date().toISOString(),
//       });
//     } catch (msgErr) {
//       console.error("Failed to send notification message:", msgErr);
//     }

//     res.status(201).json({
//       message: "התור נקבע בהצלחה!",
//       eventId: result.eventId,
//       assessment: result.assessment,
//     });
//   } catch (error) {
//     if (error.statusCode) {
//       return res.status(error.statusCode).json({ error: error.message });
//     }
//     console.error("Error in bookAssessmentAppointment:", error);
//     res.status(500).json({ error: "שגיאת שרת בקביעת התור" });
//   }
// };

// /**
//  * DELETE /diagnoses/:diagnosisId/assessments/:assessmentId/cancel
//  * ביטול תור שנקבע - גם הורה וגם מאבחן יכולים
//  */
// const cancelAssessmentAppointment = async (req, res) => {
//   try {
//     const { diagnosisId, assessmentId } = req.params;
//     const userId = req.user.uid;

//     const diagDoc = await db.collection("diagnoses").doc(diagnosisId).get();
//     if (!diagDoc.exists) {
//       return res.status(404).json({ error: "האבחון לא נמצא" });
//     }
//     const diagData = diagDoc.data();

//     const childDoc = await db
//       .collection("children")
//       .doc(diagData.childId)
//       .get();
//     if (!childDoc.exists) {
//       return res.status(404).json({ error: "הילד לא נמצא" });
//     }
//     const childData = childDoc.data();

//     // אבטחה: גם ההורה וגם המאבחן יכולים לבטל
//     const isParent = childData.parentId === userId;
//     const isTherapist = childData.therapistId === userId;
//     if (!isParent && !isTherapist) {
//       return res.status(403).json({ error: "אין הרשאה לבטל תור זה" });
//     }

//     const assessments = diagData.requiredAssessments || [];
//     const idx = assessments.findIndex((a) => a.id === assessmentId);
//     if (idx === -1) {
//       return res.status(404).json({ error: "האבחון הספציפי לא נמצא" });
//     }

//     const assessment = assessments[idx];
//     if (assessment.status !== "scheduled" || !assessment.scheduledEventId) {
//       return res.status(409).json({ error: "אין תור פעיל לביטול" });
//     }

//     const batch = db.batch();

//     // 1. מחיקת ה-event
//     const eventRef = db
//       .collection("diary_events")
//       .doc(assessment.scheduledEventId);
//     batch.delete(eventRef);

//     // 2. החזרת ה-assessment ל-pending
//     const updatedAssessments = [...assessments];
//     updatedAssessments[idx] = {
//       ...assessment,
//       status: "pending",
//       scheduledEventId: null,
//       scheduledAt: null,
//       scheduledStart: null, // 🆕 ניקוי
//       scheduledEnd: null, // 🆕 ניקוי
//       cancelledAt: new Date().toISOString(),
//       cancelledBy: isParent ? "parent" : "therapist",
//     };

//     const diagRef = db.collection("diagnoses").doc(diagnosisId);
//     batch.update(diagRef, {
//       requiredAssessments: updatedAssessments,
//       updatedAt: new Date().toISOString(),
//     });

//     // 3. הודעה לצד השני
//     const msgRef = db.collection("messages").doc();
//     batch.set(msgRef, {
//       senderId: userId,
//       receiverId: isParent ? childData.therapistId : childData.parentId,
//       childId: diagData.childId,
//       text: `התור ל-${assessment.name} עבור ${childData.firstName} בוטל. ניתן לקבוע תור חדש.`,
//       read: false,
//       createdAt: new Date().toISOString(),
//     });

//     await batch.commit();

//     res.status(200).json({
//       message: "התור בוטל בהצלחה",
//       assessment: updatedAssessments[idx],
//     });
//   } catch (error) {
//     console.error("Error in cancelAssessmentAppointment:", error);
//     res.status(500).json({ error: "שגיאת שרת בביטול התור" });
//   }
// };

// // ============================================
// // Module Exports
// // ============================================

// module.exports = {
//   // ניהול diagnosis
//   createDiagnosis,
//   getDiagnosesByChild,
//   updateQuestionnaireStatus,
//   submitQuestionnaire,
//   getParentQuestionnaireAnswers,

//   // ניהול אבחונים נדרשים
//   addRequiredAssessment,
//   updateRequiredAssessment,
//   deleteRequiredAssessment,

//   // קביעת ובחירת תורים
//   getAvailableSlots,
//   bookAssessmentAppointment,
//   cancelAssessmentAppointment,

//   // Helpers (אם תרצי להשתמש בהם בקבצים אחרים)
//   formatDateForMessage,
// };

const { db } = require("../config/firebase");
const { deleteDiagnosisCascade } = require("../helpers/cascade.helper");

const SLOT_STEP_MINUTES = 30;

// ============================================
// Helpers - עבודה עם Naive ISO Strings
// ============================================
// הערה חשובה: כל ה-events במערכת נשמרים בפורמט naive ISO ("2026-05-10T09:00")
// בלי timezone suffix. לכן אסור להשתמש ב-new Date() ו-toISOString() על
// המחרוזות האלה - זה יוצר timezone shift לפי שעון השרת. במקום זה,
// משתמשים ב-Date.UTC ובניית מחרוזת ידנית כדי לשמור על העקביות.

/**
 * נורמליזציה של naive ISO לפורמט אחיד "YYYY-MM-DDTHH:MM:SS"
 * מטפל במקרים: "2026-05-10T17:30" => "2026-05-10T17:30:00"
 * חיוני להשוואות string-based שיהיו עקביות (למשל availability עם 16 תווים
 * vs slot מחושב עם 19 תווים)
 */
const normalizeNaiveISO = (isoStr) => {
  if (!isoStr) return isoStr;
  const [datePart, timePart] = isoStr.split("T");
  const parts = timePart.split(":");
  const hh = parts[0].padStart(2, "0");
  const mm = parts[1].padStart(2, "0");
  const ss = parts[2] ? parts[2].padStart(2, "0") : "00";
  return `${datePart}T${hh}:${mm}:${ss}`;
};

/**
 * הוספת דקות ל-naive ISO string
 * "2026-05-10T09:00" + 90 דקות => "2026-05-10T10:30:00"
 */
const addMinutesToNaiveISO = (isoStr, minutesToAdd) => {
  const [datePart, timePart] = isoStr.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const timeParts = timePart.split(":");
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);
  const seconds = timeParts[2] ? parseInt(timeParts[2], 10) : 0;

  // משתמשים ב-Date.UTC כדי למנוע timezone shift של השרת
  const utcMs = Date.UTC(year, month - 1, day, hours, minutes, seconds);
  const newUtcMs = utcMs + minutesToAdd * 60 * 1000;

  // בנייה ידנית של מחרוזת naive ISO ללא Z
  const d = new Date(newUtcMs);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mn = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}T${hh}:${mn}:${ss}`;
};

/**
 * חישוב הפרש בדקות בין 2 naive ISO strings
 * minutesDiffNaiveISO("...T10:30", "...T09:00") = 90
 */
const minutesDiffNaiveISO = (laterISO, earlierISO) => {
  const toUtcMs = (iso) => {
    const [datePart, timePart] = iso.split("T");
    const [y, m, d] = datePart.split("-").map(Number);
    const tp = timePart.split(":");
    return Date.UTC(
      y,
      m - 1,
      d,
      parseInt(tp[0], 10),
      parseInt(tp[1], 10),
      tp[2] ? parseInt(tp[2], 10) : 0,
    );
  };
  return (toUtcMs(laterISO) - toUtcMs(earlierISO)) / (60 * 1000);
};

/**
 * החזרת הזמן הנוכחי כ-naive ISO לפי timezone ישראל
 * (כי ה-events נשמרים לפי שעון מקומי ישראלי)
 */
const getCurrentNaiveISO = () => {
  const now = new Date();
  // sv-SE format: "2026-05-10 16:30:45"
  const israelTimeStr = now.toLocaleString("sv-SE", {
    timeZone: "Asia/Jerusalem",
  });
  return israelTimeStr.replace(" ", "T");
};

/**
 * פורמט תאריך לעברית להצגה בהודעה
 * משתמש ב-naive ISO ופירוק ידני - בלי timezone shifts
 */
const formatDateForMessage = (isoStr) => {
  const [datePart, timePart] = isoStr.split("T");
  const [, month, day] = datePart.split("-");
  const [hh, mm] = timePart.split(":");
  return `${day}/${month} בשעה ${hh}:${mm}`;
};

// ============================================
// Helpers - חישוב slots פנויים
// ============================================

/**
 * חיתוך availability slot לחלונות אפשריים באורך נתון
 * עובד על naive ISO strings ישירות - בלי timezone shifts
 */
const sliceAvailabilityIntoWindows = (
  availStart,
  availEnd,
  durationMinutes,
) => {
  const windows = [];
  const totalAvailableMinutes = minutesDiffNaiveISO(availEnd, availStart);

  // אם ה-availability קצרה ממשך האבחון - אין חלונות
  if (totalAvailableMinutes < durationMinutes) {
    return windows;
  }

  // ההתחלה האחרונה האפשרית = (totalAvailableMinutes - durationMinutes)
  // לדוגמה: availability 8.5 שעות (510 דק'), אבחון 90 דק' => maxStartOffset = 420 דק'
  const maxStartOffset = totalAvailableMinutes - durationMinutes;

  for (
    let offsetMin = 0;
    offsetMin <= maxStartOffset;
    offsetMin += SLOT_STEP_MINUTES
  ) {
    const slotStart = addMinutesToNaiveISO(availStart, offsetMin);
    const slotEnd = addMinutesToNaiveISO(slotStart, durationMinutes);
    windows.push({ start: slotStart, end: slotEnd });
  }

  return windows;
};

/**
 * בדיקה האם חלון מתנגש עם appointments קיימים
 * משווה כ-strings אחרי נורמליזציה לפורמט אחיד
 */
const isWindowConflicting = (windowStart, windowEnd, appointments) => {
  const normWStart = normalizeNaiveISO(windowStart);
  const normWEnd = normalizeNaiveISO(windowEnd);

  return appointments.some((appt) => {
    const aStart = normalizeNaiveISO(appt.start);
    const aEnd = normalizeNaiveISO(appt.end);
    return normWStart < aEnd && aStart < normWEnd;
  });
};

/**
 * בדיקה שה-slot המבוקש בתוך availability ולא מתנגש עם appointments
 * עובד על naive ISO - השוואת strings אחרי נורמליזציה לפורמט אחיד
 *
 * חיוני: ה-availability ב-DB עלולה להיות שמורה בפורמט "T17:30" (16 תווים)
 * בעוד ה-slots החדשים מחושבים כ-"T17:30:00" (19 תווים).
 * השוואה לקסיקוגרפית של strings בפורמטים שונים = bug שקט.
 */
const validateSlotAvailability = async (therapistId, start, end) => {
  // נורמליזציה של הקלט
  const normStart = normalizeNaiveISO(start);
  const normEnd = normalizeNaiveISO(end);

  const eventsSnapshot = await db
    .collection("diary_events")
    .where("therapistId", "==", therapistId)
    .get();

  let isInsideAvailability = false;

  for (const doc of eventsSnapshot.docs) {
    const ev = doc.data();
    // נורמליזציה של ה-event מ-DB (לפעמים נשמר בלי שניות)
    const evStart = normalizeNaiveISO(ev.start);
    const evEnd = normalizeNaiveISO(ev.end);

    if (ev.type === "availability") {
      // ה-slot המבוקש חייב להיות בתוך החלון של ה-availability
      if (normStart >= evStart && normEnd <= evEnd) {
        isInsideAvailability = true;
      }
    } else if (ev.type === "appointment") {
      // בדיקת חפיפה
      if (normStart < evEnd && evStart < normEnd) {
        return {
          valid: false,
          error: "השעה כבר תפוסה - אנא בחרי שעה אחרת",
        };
      }
    }
  }

  if (!isInsideAvailability) {
    return {
      valid: false,
      error: "השעה המבוקשת לא נמצאת בחלון זמינות של המאבחן",
    };
  }

  return { valid: true };
};

// ============================================
// Helpers - אימות בעלות
// ============================================

const verifyDiagnosisOwnership = async (diagnosisId, therapistId) => {
  const diagRef = db.collection("diagnoses").doc(diagnosisId);
  const diagDoc = await diagRef.get();

  if (!diagDoc.exists) {
    const err = new Error("האבחון לא נמצא");
    err.statusCode = 404;
    throw err;
  }

  const diagData = diagDoc.data();
  if (diagData.therapistId !== therapistId) {
    const err = new Error("אין הרשאה לערוך אבחון זה");
    err.statusCode = 403;
    throw err;
  }

  return { diagRef, diagData };
};

// ============================================
// יצירת / שליפת / עדכון אבחונים (Diagnoses)
// ============================================

// const createDiagnosis = async (req, res) => {
//   try {
//     const { childId } = req.body;
//     const therapistId = req.user.uid;

//     if (!childId) return res.status(400).json({ error: "Child ID is missing" });

//     const childDoc = await db.collection("children").doc(childId).get();
//     if (!childDoc.exists)
//       return res.status(404).json({ error: "Child not found" });
//     const childData = childDoc.data();

//     const batch = db.batch();

//     const diagRef = db.collection("diagnoses").doc();
//     batch.set(diagRef, {
//       childId,
//       therapistId,
//       status: "בתהליך",
//       parentQuestionnaireStatus: "פתוח",
//       createdAt: new Date().toISOString(),
//     });

//     const childRef = db.collection("children").doc(childId);
//     batch.update(childRef, { canFillQuestionnaire: true });

//     const msgRef = db.collection("messages").doc();
//     batch.set(msgRef, {
//       senderId: therapistId,
//       receiverId: childData.parentId,
//       childId: childId,
//       text: `שלום, פתחתי תהליך אבחון עבור ${childData.firstName}. נא להיכנס ללשונית "אישורים וטפסים" ולמלא את שאלון ההורים. בהצלחה!`,
//       createdAt: new Date().toISOString(),
//       read: false,
//     });

//     await batch.commit();
//     res.status(201).json({ message: "Diagnosis opened and notification sent" });
//   } catch (error) {
//     console.error("Error in createDiagnosis:", error);
//     res.status(500).json({ error: "Failed to open diagnosis" });
//   }
// };

const createDiagnosis = async (req, res) => {
  try {
    const { childId } = req.body;
    const therapistId = req.user.uid;

    if (!childId) return res.status(400).json({ error: "Child ID is missing" });

    const childDoc = await db.collection("children").doc(childId).get();
    if (!childDoc.exists)
      return res.status(404).json({ error: "Child not found" });
    const childData = childDoc.data();

    const batch = db.batch();

    // 1. יצירת ה-diagnosis
    const diagRef = db.collection("diagnoses").doc();
    batch.set(diagRef, {
      childId,
      therapistId,
      status: "בתהליך",
      parentQuestionnaireStatus: "פתוח",
      consentFormStatus: "pending", // 🆕 סטטוס טופס ההסכמה
      createdAt: new Date().toISOString(),
    });

    // 2. עדכון הילד - פתיחת מילוי שאלון
    const childRef = db.collection("children").doc(childId);
    batch.update(childRef, { canFillQuestionnaire: true });

    // 3. הודעה אוטומטית להורה - עדכון לכלול גם הזכרה של טופס ההסכמה
    const msgRef = db.collection("messages").doc();
    batch.set(msgRef, {
      senderId: therapistId,
      receiverId: childData.parentId,
      childId: childId,
      text: `שלום, פתחתי תהליך אבחון עבור ${childData.firstName}. נא להיכנס ללשונית "אישורים וטפסים" ולמלא את שאלון ההורים ואת טופס ההסכמה לאבחון. בהצלחה!`,
      createdAt: new Date().toISOString(),
      read: false,
    });

    // 🆕 4. יצירה אוטומטית של טופס הסכמה ריק
    const consentRef = db.collection("consent_forms").doc();
    batch.set(consentRef, {
      childId,
      diagnosisId: diagRef.id,
      therapistId,
      registeredParentId: childData.parentId,

      // snapshot של פרטי הילד מהזמן של היצירה
      childInfo: {
        fullName: `${childData.firstName} ${childData.lastName}`,
        idNumber: childData.idNumber || "",
        birthDate: childData.birthDate || "",
        schoolOrGarden: "", // ימולא ע"י ההורה בעת החתימה
      },

      // סטטוס כללי
      status: "pending", // pending | partially_signed | fully_signed

      // שני הורים - בהתחלה אף אחד לא חתום ואין הורה שני מוגדר
      parents: [
        {
          role: "registered",
          name: "", // ימולא בעת החתימה
          email: "", // ימולא אוטומטית מההורה הרשום
          signed: false,
          signedAt: null,
          signature: null,
        },
        // הורה שני יתווסף רק אם ההורה הראשון יזין את הפרטים שלו
      ],

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await batch.commit();
    res.status(201).json({
      message: "Diagnosis opened, notification sent, consent form created",
      diagnosisId: diagRef.id,
      consentFormId: consentRef.id,
    });
  } catch (error) {
    console.error("Error in createDiagnosis:", error);
    res.status(500).json({ error: "Failed to open diagnosis" });
  }
};
const getDiagnosesByChild = async (req, res) => {
  try {
    const { childId } = req.params;
    const snapshot = await db
      .collection("diagnoses")
      .where("childId", "==", childId)
      .orderBy("createdAt", "desc")
      .get();

    const diagnoses = [];
    snapshot.forEach((doc) => {
      diagnoses.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(diagnoses);
  } catch (error) {
    console.error("Error fetching diagnoses:", error);
    res.status(500).json({ error: "כשל בשליפת אבחונים" });
  }
};

const updateQuestionnaireStatus = async (req, res) => {
  try {
    const { diagnosisId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "סטטוס חסר" });
    }

    // childId נגזר מהאבחון עצמו ולא נסמך על הקלט מהלקוח
    const diagRef = db.collection("diagnoses").doc(diagnosisId);
    const diagDoc = await diagRef.get();
    if (!diagDoc.exists) {
      return res.status(404).json({ error: "האבחון לא נמצא" });
    }
    const { childId } = diagDoc.data();

    const batch = db.batch();

    batch.update(diagRef, {
      parentQuestionnaireStatus: status,
      updatedAt: new Date().toISOString(),
    });

    if (status === "לתיקון" || status === "פתוח") {
      const childRef = db.collection("children").doc(childId);
      batch.update(childRef, { canFillQuestionnaire: true });
    }

    await batch.commit();
    res
      .status(200)
      .json({ message: `סטטוס השאלון עודכן ל-${status} והשאלון נפתח למילוי` });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "כשל בעדכון הסטטוס" });
  }
};

// POST /diagnoses/:diagnosisId/questionnaires/submit
// שמירת שאלון ההורים תחת אבחון ספציפי (Diagnosis-centric)
const submitQuestionnaire = async (req, res) => {
  try {
    const { diagnosisId } = req.params;
    const { formData } = req.body;
    const parentId = req.user.uid;

    if (!formData) {
      return res.status(400).json({ error: "לא התקבלו נתוני שאלון" });
    }

    // אימות בעלות: שולפים את האבחון, גוזרים childId ומוודאים שהקורא הוא ההורה
    const diagRef = db.collection("diagnoses").doc(diagnosisId);
    const diagDoc = await diagRef.get();
    if (!diagDoc.exists) {
      return res.status(404).json({ error: "האבחון לא נמצא" });
    }
    const { childId } = diagDoc.data();

    const childDoc = await db.collection("children").doc(childId).get();
    if (!childDoc.exists) {
      return res.status(404).json({ error: "הילד לא נמצא" });
    }
    if (childDoc.data().parentId !== parentId) {
      return res.status(403).json({ error: "אין הרשאה למלא שאלון עבור אבחון זה" });
    }

    const batch = db.batch();

    // מסמך חדש לכל הגשה - מקושר במפורש ל-diagnosisId (לא דורס אבחונים קודמים)
    const questionnaireRef = db.collection("parent_questionnaires").doc();
    batch.set(questionnaireRef, {
      diagnosisId,
      childId,
      parentId,
      formData,
      submittedAt: new Date().toISOString(),
    });

    // עדכון האבחון הספציפי - בלי query, יש לנו את ה-ref ישירות
    batch.update(diagRef, {
      parentQuestionnaireStatus: "נשלח",
      updatedAt: new Date().toISOString(),
    });

    const childRef = db.collection("children").doc(childId);
    batch.update(childRef, { canFillQuestionnaire: false });

    await batch.commit();
    res.status(200).json({ message: "Submitted successfully and locked" });
  } catch (error) {
    console.error("Error in submitQuestionnaire:", error);
    res.status(500).json({ error: "Failed to submit" });
  }
};

// GET /diagnoses/:diagnosisId/parent-answers
// שליפת שאלון ההורים של אבחון ספציפי
const getParentQuestionnaireAnswers = async (req, res) => {
  try {
    const { diagnosisId } = req.params;
    const userId = req.user.uid;

    // אימות בעלות דרך diagnosis -> child (הורה או מאבחן)
    const diagDoc = await db.collection("diagnoses").doc(diagnosisId).get();
    if (!diagDoc.exists) {
      return res.status(404).json({ error: "האבחון לא נמצא" });
    }
    const { childId } = diagDoc.data();

    const childDoc = await db.collection("children").doc(childId).get();
    if (!childDoc.exists) {
      return res.status(404).json({ error: "הילד לא נמצא" });
    }
    const childData = childDoc.data();
    if (childData.parentId !== userId && childData.therapistId !== userId) {
      return res.status(403).json({ error: "אין הרשאה לצפות בשאלון זה" });
    }

    const snapshot = await db
      .collection("parent_questionnaires")
      .where("diagnosisId", "==", diagnosisId)
      .orderBy("submittedAt", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ error: "טרם מולא שאלון הורים עבור אבחון זה" });
    }

    res.status(200).json(snapshot.docs[0].data());
  } catch (error) {
    console.error("Error in getParentQuestionnaireAnswers:", error);
    res.status(500).json({ error: "נכשלה שליפת השאלון" });
  }
};

// ============================================
// ניהול אבחונים נדרשים (Required Assessments)
// ============================================

const addRequiredAssessment = async (req, res) => {
  try {
    const { diagnosisId } = req.params;
    const { name, durationMinutes } = req.body;
    const therapistId = req.user.uid;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "שם האבחון הוא שדה חובה" });
    }
    if (
      !durationMinutes ||
      typeof durationMinutes !== "number" ||
      durationMinutes <= 0 ||
      durationMinutes > 480
    ) {
      return res.status(400).json({
        error: "משך הזמן חייב להיות מספר חיובי (עד 480 דקות / 8 שעות)",
      });
    }

    const { diagRef, diagData } = await verifyDiagnosisOwnership(
      diagnosisId,
      therapistId,
    );

    const newAssessment = {
      id: `asm_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      name: name.trim(),
      durationMinutes,
      status: "pending",
      scheduledEventId: null,
      createdAt: new Date().toISOString(),
    };

    const currentAssessments = diagData.requiredAssessments || [];
    const updatedAssessments = [...currentAssessments, newAssessment];

    await diagRef.update({
      requiredAssessments: updatedAssessments,
      updatedAt: new Date().toISOString(),
    });

    res.status(201).json({
      message: "האבחון נוסף לרשימה",
      assessment: newAssessment,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Error in addRequiredAssessment:", error);
    res.status(500).json({ error: "שגיאת שרת בהוספת אבחון" });
  }
};

const updateRequiredAssessment = async (req, res) => {
  try {
    const { diagnosisId, assessmentId } = req.params;
    const { name, durationMinutes } = req.body;
    const therapistId = req.user.uid;

    const { diagRef, diagData } = await verifyDiagnosisOwnership(
      diagnosisId,
      therapistId,
    );

    const assessments = diagData.requiredAssessments || [];
    const idx = assessments.findIndex((a) => a.id === assessmentId);

    if (idx === -1) {
      return res.status(404).json({ error: "האבחון לא נמצא ברשימה" });
    }

    if (assessments[idx].status !== "pending") {
      return res.status(409).json({
        error: "לא ניתן לערוך אבחון שכבר נקבע לו תור או הושלם",
      });
    }

    const updated = { ...assessments[idx] };
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ error: "שם האבחון לא יכול להיות ריק" });
      }
      updated.name = name.trim();
    }
    if (durationMinutes !== undefined) {
      if (
        typeof durationMinutes !== "number" ||
        durationMinutes <= 0 ||
        durationMinutes > 480
      ) {
        return res.status(400).json({ error: "משך זמן לא חוקי (1-480 דקות)" });
      }
      updated.durationMinutes = durationMinutes;
    }

    assessments[idx] = updated;

    await diagRef.update({
      requiredAssessments: assessments,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({
      message: "האבחון עודכן",
      assessment: updated,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Error in updateRequiredAssessment:", error);
    res.status(500).json({ error: "שגיאת שרת בעדכון אבחון" });
  }
};

const deleteRequiredAssessment = async (req, res) => {
  try {
    const { diagnosisId, assessmentId } = req.params;
    const therapistId = req.user.uid;

    const { diagRef, diagData } = await verifyDiagnosisOwnership(
      diagnosisId,
      therapistId,
    );

    const assessments = diagData.requiredAssessments || [];
    const target = assessments.find((a) => a.id === assessmentId);

    if (!target) {
      return res.status(404).json({ error: "האבחון לא נמצא ברשימה" });
    }

    if (target.status === "scheduled") {
      return res.status(409).json({
        error: "לא ניתן למחוק אבחון שכבר נקבע לו תור. יש לבטל את התור תחילה.",
      });
    }

    const filtered = assessments.filter((a) => a.id !== assessmentId);

    await diagRef.update({
      requiredAssessments: filtered,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({ message: "האבחון נמחק מהרשימה" });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Error in deleteRequiredAssessment:", error);
    res.status(500).json({ error: "שגיאת שרת במחיקת אבחון" });
  }
};

// ============================================
// קביעת ובחירת תורים (Booking)
// ============================================

/**
 * GET /diagnoses/:diagnosisId/assessments/:assessmentId/available-slots
 * החזרת רשימת slots פנויים להורה
 */
const getAvailableSlots = async (req, res) => {
  try {
    const { diagnosisId, assessmentId } = req.params;
    const userId = req.user.uid;

    const diagDoc = await db.collection("diagnoses").doc(diagnosisId).get();
    if (!diagDoc.exists) {
      return res.status(404).json({ error: "האבחון לא נמצא" });
    }
    const diagData = diagDoc.data();

    const childDoc = await db
      .collection("children")
      .doc(diagData.childId)
      .get();
    if (!childDoc.exists) {
      return res.status(404).json({ error: "הילד לא נמצא" });
    }
    const childData = childDoc.data();

    if (childData.parentId !== userId) {
      return res
        .status(403)
        .json({ error: "אין הרשאה לצפות בזמינויות עבור ילד זה" });
    }

    const assessments = diagData.requiredAssessments || [];
    const assessment = assessments.find((a) => a.id === assessmentId);
    if (!assessment) {
      return res.status(404).json({ error: "האבחון הספציפי לא נמצא" });
    }

    // אם כבר נקבע תור - להחזיר אותו במקום slots
    if (assessment.status === "scheduled" && assessment.scheduledEventId) {
      const eventDoc = await db
        .collection("diary_events")
        .doc(assessment.scheduledEventId)
        .get();

      if (eventDoc.exists) {
        return res.status(200).json({
          alreadyScheduled: true,
          appointment: { id: eventDoc.id, ...eventDoc.data() },
          slots: [],
        });
      }
    }

    if (assessment.status === "completed") {
      return res.status(200).json({
        completed: true,
        slots: [],
      });
    }

    const therapistId = childData.therapistId;
    const eventsSnapshot = await db
      .collection("diary_events")
      .where("therapistId", "==", therapistId)
      .get();

    // השוואות "עכשיו" כ-naive ISO לפי שעון ישראל (כבר מנורמל ל-19 תווים)
    const nowISO = getCurrentNaiveISO();

    const availabilities = [];
    const appointments = [];

    eventsSnapshot.forEach((doc) => {
      const ev = { id: doc.id, ...doc.data() };

      // מתעלמים מאירועים שנגמרו - השוואת strings אחרי נורמליזציה
      if (normalizeNaiveISO(ev.end) <= nowISO) return;

      if (ev.type === "availability") {
        availabilities.push(ev);
      } else if (ev.type === "appointment") {
        appointments.push(ev);
      }
    });

    const allSlots = [];
    for (const avail of availabilities) {
      const windows = sliceAvailabilityIntoWindows(
        avail.start,
        avail.end,
        assessment.durationMinutes,
      );

      for (const window of windows) {
        // סינון חלונות שמתחילים בעבר (window.start כבר מנורמל ל-19 תווים)
        if (window.start <= nowISO) continue;

        // סינון חלונות שמתנגשים עם appointments קיימים
        if (isWindowConflicting(window.start, window.end, appointments)) {
          continue;
        }

        allSlots.push({
          start: window.start,
          end: window.end,
          availabilityId: avail.id,
        });
      }
    }

    // מיון - השוואת strings (naive ISO chronological)
    allSlots.sort((a, b) =>
      a.start < b.start ? -1 : a.start > b.start ? 1 : 0,
    );

    res.status(200).json({
      assessment: {
        id: assessment.id,
        name: assessment.name,
        durationMinutes: assessment.durationMinutes,
        status: assessment.status,
      },
      slots: allSlots,
      totalSlots: allSlots.length,
    });
  } catch (error) {
    console.error("Error in getAvailableSlots:", error);
    res.status(500).json({ error: "שגיאת שרת בחישוב זמינויות" });
  }
};

/**
 * POST /diagnoses/:diagnosisId/assessments/:assessmentId/book
 * הזמנת תור ע"י הורה - עם Firestore Transaction למניעת race conditions
 */
const bookAssessmentAppointment = async (req, res) => {
  try {
    const { diagnosisId, assessmentId } = req.params;
    const { start, end } = req.body;
    const userId = req.user.uid;

    // === ולידציות בסיסיות (השוואת strings, ללא timezone shifts) ===
    if (!start || !end) {
      return res.status(400).json({ error: "חסרים שעות התחלה/סיום" });
    }
    if (end <= start) {
      return res
        .status(400)
        .json({ error: "שעת הסיום חייבת להיות אחרי שעת ההתחלה" });
    }
    // נורמליזציה לפני השוואה ל-now (שכבר מנורמל)
    if (normalizeNaiveISO(start) <= getCurrentNaiveISO()) {
      return res.status(400).json({ error: "לא ניתן לקבוע תור בעבר" });
    }

    // === שליפת diagnosis + child לאימות בעלות ===
    const diagDoc = await db.collection("diagnoses").doc(diagnosisId).get();
    if (!diagDoc.exists) {
      return res.status(404).json({ error: "האבחון לא נמצא" });
    }
    const diagData = diagDoc.data();
    const childId = diagData.childId;

    const childDoc = await db.collection("children").doc(childId).get();
    if (!childDoc.exists) {
      return res.status(404).json({ error: "הילד לא נמצא" });
    }
    const childData = childDoc.data();

    if (childData.parentId !== userId) {
      return res.status(403).json({ error: "אין הרשאה לקבוע תור עבור ילד זה" });
    }

    const therapistId = childData.therapistId;

    // === וידוא שה-assessment עדיין pending + תואם משך ===
    const assessments = diagData.requiredAssessments || [];
    const assessment = assessments.find((a) => a.id === assessmentId);
    if (!assessment) {
      return res.status(404).json({ error: "האבחון הספציפי לא נמצא" });
    }
    if (assessment.status !== "pending") {
      return res.status(409).json({
        error:
          assessment.status === "scheduled"
            ? "כבר נקבע תור לאבחון זה"
            : "האבחון כבר הושלם",
      });
    }

    // חישוב משך באמצעות helper שעובד על naive ISO
    const requestedDurationMinutes = minutesDiffNaiveISO(end, start);
    if (requestedDurationMinutes !== assessment.durationMinutes) {
      return res.status(400).json({
        error: `משך הזמן המבוקש (${requestedDurationMinutes} דק') לא תואם לאבחון (${assessment.durationMinutes} דק')`,
      });
    }

    // === בדיקת זמינות מקדימה (לפני ה-transaction) ===
    const validation = await validateSlotAvailability(therapistId, start, end);
    if (!validation.valid) {
      return res.status(409).json({ error: validation.error });
    }

    // === FIRESTORE TRANSACTION - יצירת event + עדכון assessment ===
    const result = await db.runTransaction(async (transaction) => {
      const diagRef = db.collection("diagnoses").doc(diagnosisId);
      const diagSnap = await transaction.get(diagRef);

      if (!diagSnap.exists) {
        throw { statusCode: 404, message: "האבחון לא נמצא" };
      }

      const freshDiagData = diagSnap.data();
      const freshAssessments = freshDiagData.requiredAssessments || [];
      const idx = freshAssessments.findIndex((a) => a.id === assessmentId);

      if (idx === -1) {
        throw { statusCode: 404, message: "האבחון הספציפי לא נמצא" };
      }

      const freshAssessment = freshAssessments[idx];

      // בדיקה כפולה - שמא בזמן הבדיקה המקדימה מישהו אחר הקדים
      if (freshAssessment.status !== "pending") {
        throw { statusCode: 409, message: "כבר נקבע תור לאבחון זה" };
      }

      // יצירת ה-event החדש
      const newEventRef = db.collection("diary_events").doc();
      const eventData = {
        therapistId,
        type: "appointment",
        title: `${freshAssessment.name} - ${childData.firstName} ${childData.lastName}`,
        start,
        end,
        description: `נקבע ע"י ההורה דרך מערכת התיאום`,
        childId,
        childName: `${childData.firstName} ${childData.lastName}`,
        diagnosisId,
        assessmentId,
        bookedByParent: true,
        createdAt: new Date().toISOString(),
      };

      transaction.set(newEventRef, eventData);

      // עדכון ה-assessment - שמירת התאריך והשעה ישירות לתצוגה מהירה
      const updatedAssessments = [...freshAssessments];
      updatedAssessments[idx] = {
        ...freshAssessment,
        status: "scheduled",
        scheduledEventId: newEventRef.id,
        scheduledAt: new Date().toISOString(), // מתי ההזמנה בוצעה
        scheduledStart: start, // 🆕 שעת התחלת התור
        scheduledEnd: end, // 🆕 שעת סיום התור
      };

      transaction.update(diagRef, {
        requiredAssessments: updatedAssessments,
        updatedAt: new Date().toISOString(),
      });

      return {
        eventId: newEventRef.id,
        event: eventData,
        assessment: updatedAssessments[idx],
      };
    });

    // === הודעה למאבחן (לא חוסם אם נכשל) ===
    try {
      await db.collection("messages").add({
        senderId: userId,
        receiverId: therapistId,
        childId,
        text: `שלום, קבעתי תור ל-${result.assessment.name} עבור ${childData.firstName} בתאריך ${formatDateForMessage(start)}.`,
        read: false,
        createdAt: new Date().toISOString(),
      });
    } catch (msgErr) {
      console.error("Failed to send notification message:", msgErr);
    }

    res.status(201).json({
      message: "התור נקבע בהצלחה!",
      eventId: result.eventId,
      assessment: result.assessment,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Error in bookAssessmentAppointment:", error);
    res.status(500).json({ error: "שגיאת שרת בקביעת התור" });
  }
};

/**
 * DELETE /diagnoses/:diagnosisId/assessments/:assessmentId/cancel
 * ביטול תור שנקבע - גם הורה וגם מאבחן יכולים
 */
const cancelAssessmentAppointment = async (req, res) => {
  try {
    const { diagnosisId, assessmentId } = req.params;
    const userId = req.user.uid;

    const diagDoc = await db.collection("diagnoses").doc(diagnosisId).get();
    if (!diagDoc.exists) {
      return res.status(404).json({ error: "האבחון לא נמצא" });
    }
    const diagData = diagDoc.data();

    const childDoc = await db
      .collection("children")
      .doc(diagData.childId)
      .get();
    if (!childDoc.exists) {
      return res.status(404).json({ error: "הילד לא נמצא" });
    }
    const childData = childDoc.data();

    // אבטחה: גם ההורה וגם המאבחן יכולים לבטל
    const isParent = childData.parentId === userId;
    const isTherapist = childData.therapistId === userId;
    if (!isParent && !isTherapist) {
      return res.status(403).json({ error: "אין הרשאה לבטל תור זה" });
    }

    const assessments = diagData.requiredAssessments || [];
    const idx = assessments.findIndex((a) => a.id === assessmentId);
    if (idx === -1) {
      return res.status(404).json({ error: "האבחון הספציפי לא נמצא" });
    }

    const assessment = assessments[idx];
    if (assessment.status !== "scheduled" || !assessment.scheduledEventId) {
      return res.status(409).json({ error: "אין תור פעיל לביטול" });
    }

    const batch = db.batch();

    // 1. מחיקת ה-event
    const eventRef = db
      .collection("diary_events")
      .doc(assessment.scheduledEventId);
    batch.delete(eventRef);

    // 2. החזרת ה-assessment ל-pending - ניקוי כל שדות התור
    const updatedAssessments = [...assessments];
    updatedAssessments[idx] = {
      ...assessment,
      status: "pending",
      scheduledEventId: null,
      scheduledAt: null,
      scheduledStart: null, // 🆕 ניקוי
      scheduledEnd: null, // 🆕 ניקוי
      cancelledAt: new Date().toISOString(),
      cancelledBy: isParent ? "parent" : "therapist",
    };

    const diagRef = db.collection("diagnoses").doc(diagnosisId);
    batch.update(diagRef, {
      requiredAssessments: updatedAssessments,
      updatedAt: new Date().toISOString(),
    });

    // 3. הודעה לצד השני
    const msgRef = db.collection("messages").doc();
    batch.set(msgRef, {
      senderId: userId,
      receiverId: isParent ? childData.therapistId : childData.parentId,
      childId: diagData.childId,
      text: `התור ל-${assessment.name} עבור ${childData.firstName} בוטל. ניתן לקבוע תור חדש.`,
      read: false,
      createdAt: new Date().toISOString(),
    });

    await batch.commit();

    res.status(200).json({
      message: "התור בוטל בהצלחה",
      assessment: updatedAssessments[idx],
    });
  } catch (error) {
    console.error("Error in cancelAssessmentAppointment:", error);
    res.status(500).json({ error: "שגיאת שרת בביטול התור" });
  }
};

// ============================================
// מחיקת אבחון בודד + כל הטפסים שלו (מאבחן בעל האבחון)
// DELETE /diagnoses/:diagnosisId
// ============================================
const deleteDiagnosis = async (req, res) => {
  try {
    const { diagnosisId } = req.params;
    const therapistId = req.user.uid;

    // אימות בעלות - רק המאבחן של האבחון יכול למחוק אותו
    await verifyDiagnosisOwnership(diagnosisId, therapistId);

    await deleteDiagnosisCascade(diagnosisId);

    res.status(200).json({ message: "האבחון וכל הטפסים המקושרים נמחקו" });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error("Error in deleteDiagnosis:", error);
    res.status(500).json({ error: "שגיאת שרת במחיקת האבחון" });
  }
};

// ============================================
// Module Exports
// ============================================

module.exports = {
  // ניהול diagnosis
  createDiagnosis,
  getDiagnosesByChild,
  updateQuestionnaireStatus,
  submitQuestionnaire,
  getParentQuestionnaireAnswers,
  deleteDiagnosis,

  // ניהול אבחונים נדרשים
  addRequiredAssessment,
  updateRequiredAssessment,
  deleteRequiredAssessment,

  // קביעת ובחירת תורים
  getAvailableSlots,
  bookAssessmentAppointment,
  cancelAssessmentAppointment,

  // Helpers (אם תרצי להשתמש בהם בקבצים אחרים)
  formatDateForMessage,
};
