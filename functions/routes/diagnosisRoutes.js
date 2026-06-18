const express = require("express");
const router = express.Router();
const {
  createDiagnosis,
  getDiagnosesByChild,
  updateQuestionnaireStatus,
  submitQuestionnaire,
  getParentQuestionnaireAnswers,
  addRequiredAssessment,
  updateRequiredAssessment,
  deleteRequiredAssessment,
  getAvailableSlots,
  bookAssessmentAppointment,
  cancelAssessmentAppointment,
  deleteDiagnosis,
} = require("../controllers/diagnosis.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// כל הנתיבים כאן מוגנים ע"י ה-Token
router.post("/create", verifyToken, createDiagnosis);
router.get("/child/:childId", verifyToken, getDiagnosesByChild);
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

// 🆕 מחיקת אבחון בודד + כל הטפסים שלו (המאבחן בעל האבחון)
router.delete("/:diagnosisId", verifyToken, deleteDiagnosis);

module.exports = router;
