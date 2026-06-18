// functions/routes/report.routes.js
const express = require("express");
const router = express.Router();

// ⚠️ התאימי את שם/נתיב המידלוור לזה שכבר קיים אצלך
// (תסתכלי איך message.routes.js או diary.routes.js מייבאים אותו)
const verifyToken = require("../middleware/auth.middleware");

const {
  getReportByDiagnosis,
  saveReportDraft,
  submitReport,
  listReports,
  getReportById,
} = require("../controllers/report.controller");

// כל ה-routes דורשים אימות (מטפל/אדמין)
router.get("/diagnosis/:diagnosisId", verifyToken, getReportByDiagnosis);
router.post("/draft", verifyToken, saveReportDraft);
router.post("/submit", verifyToken, submitReport);
router.get("/", verifyToken, listReports);
router.get("/:reportId", verifyToken, getReportById);

module.exports = router;