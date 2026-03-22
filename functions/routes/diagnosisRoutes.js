const express = require("express");
const router = express.Router();
const {
  createDiagnosis,
  getDiagnosesByChild,
  updateQuestionnaireStatus,
  submitQuestionnaire,
  getParentQuestionnaireAnswers,
} = require("../controllers/diagnosis.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// כל הנתיבים כאן מוגנים ע"י ה-Token
router.post("/create", verifyToken, createDiagnosis);
router.get("/child/:childId", verifyToken, getDiagnosesByChild);
router.put("/status/:diagnosisId", verifyToken, updateQuestionnaireStatus);
router.post("/questionnaires/submit", verifyToken, submitQuestionnaire);
router.get(
  "/parent-answers/:childId",
  verifyToken,
  getParentQuestionnaireAnswers,
);
module.exports = router;
