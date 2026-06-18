// functions/routes/questionnaire.routes.js
const express = require("express");
const router = express.Router();
const {
  saveDraft,
  getDraft,
} = require("../controllers/questionnaire.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// טיוטות שאלון ההורים - מקושרות לאבחון ספציפי (diagnosisId)
// ההגשה הסופית מתבצעת דרך /diagnoses/:diagnosisId/questionnaires/submit
router.post("/draft", verifyToken, saveDraft);
router.get("/draft/:diagnosisId", verifyToken, getDraft);

module.exports = router;
