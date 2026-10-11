const express = require("express");
const router = express.Router();
const {
  createDiagnosis,
  getDiagnosesByChild,
  reassignTherapist,
  closeDiagnosis,
  getDiagnosisProgress,
  updateQuestionnaireStatus,
  submitQuestionnaire,
  getParentQuestionnaireAnswers,
  exportParentQuestionnairePDF,
  addRequiredAssessment,
  updateRequiredAssessment,
  deleteRequiredAssessment,
  getAvailableSlots,
  bookAssessmentAppointment,
  cancelAssessmentAppointment,
  deleteDiagnosis,
  getDiagnosisDeletePreview,
} = require("../controllers/diagnosis.controller");
const { verifyToken, verifyAdmin } = require("../middleware/auth.middleware");

// כל הנתיבים כאן מוגנים ע"י ה-Token
router.post("/create", verifyToken, createDiagnosis);
router.get("/child/:childId", verifyToken, getDiagnosesByChild);
// 🆕 שינוי המאבחן/ת המשויך/ת לאבחון קיים - אדמין בלבד
router.patch("/:diagnosisId/therapist", verifyAdmin, reassignTherapist);
// 🆕 סגירה מפורשת של אבחון (לאחר הגשת הדוח) - הבדיקה הפנימית כבר מטפלת
// בהרשאות אדמין/מטפל, ולכן מספיק verifyToken כאן
router.patch("/:diagnosisId/close", verifyToken, closeDiagnosis);
router.get("/:diagnosisId/progress", verifyToken, getDiagnosisProgress);
router.put("/status/:diagnosisId", verifyToken, updateQuestionnaireStatus);
router.post(
  "/:diagnosisId/questionnaires/submit",
  verifyToken,
  submitQuestionnaire,
);
router.get(
  "/:diagnosisId/parent-answers",
  verifyToken,
  getParentQuestionnaireAnswers,
);
router.get(
  "/:diagnosisId/parent-answers/export",
  verifyToken,
  exportParentQuestionnairePDF,
);

router.post("/:diagnosisId/assessments", verifyToken, addRequiredAssessment);
router.put(
  "/:diagnosisId/assessments/:assessmentId",
  verifyToken,
  updateRequiredAssessment,
);
router.delete(
  "/:diagnosisId/assessments/:assessmentId",
  verifyToken,
  deleteRequiredAssessment,
);
router.get(
  "/:diagnosisId/assessments/:assessmentId/available-slots",
  verifyToken,
  getAvailableSlots,
);

router.post(
  "/:diagnosisId/assessments/:assessmentId/book",
  verifyToken,
  bookAssessmentAppointment,
);

// 🆕 ביטול תור (הורה או מאבחן)
router.delete(
  "/:diagnosisId/assessments/:assessmentId/cancel",
  verifyToken,
  cancelAssessmentAppointment,
);

// 🆕 תצוגה מקדימה לפני מחיקת אבחון (אדמין או המאבחן/ת הבעל/ת האבחון)
router.get(
  "/:diagnosisId/delete-preview",
  verifyToken,
  getDiagnosisDeletePreview,
);

// 🆕 מחיקת אבחון בודד + כל הטפסים שלו (אדמין או המאבחן/ת הבעל/ת האבחון)
router.delete("/:diagnosisId", verifyToken, deleteDiagnosis);

module.exports = router;
