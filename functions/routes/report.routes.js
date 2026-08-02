// // functions/routes/report.routes.js
// const express = require("express");
// const router = express.Router();

// // (תסתכלי איך message.routes.js או diary.routes.js מייבאים אותו)
// const verifyToken = require("../middleware/auth.middleware");

// const {
//   getReportByDiagnosis,
//   saveReportDraft,
//   submitReport,
//   listReports,
//   getReportById,
// } = require("../controllers/report.controller");

// // כל ה-routes דורשים אימות (מטפל/אדמין)
// // router.get("/diagnosis/:diagnosisId", verifyToken, getReportByDiagnosis);
// // router.post("/draft", verifyToken, saveReportDraft);
// // router.post("/submit", verifyToken, submitReport);
// // router.get("/", verifyToken, listReports);
// // router.get("/:reportId", verifyToken, getReportById);

// module.exports = router;

const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const {
  aiLimiter,
  aiBatchLimiter,
  aiPlausibilityLimiter,
} = require("../middleware/rateLimiter.middleware");
const {
  getReportByDiagnosis,
  saveReportDraft,
  submitReport,
  listReports,
  getReportById,
  openReportForEditing,
  exportReportToPDF,
  generateReportSection,
  generateReportSectionsBatch,
  checkReportPlausibility,
} = require("../controllers/report.controller");

router.get("/diagnosis/:diagnosisId", verifyToken, getReportByDiagnosis);
router.post("/draft", verifyToken, saveReportDraft);
router.post("/submit", verifyToken, submitReport);
router.get("/", verifyToken, listReports);
router.post("/ai/rephrase", verifyToken, aiLimiter, generateReportSection);
router.post(
  "/ai/rephrase-batch",
  verifyToken,
  aiBatchLimiter,
  generateReportSectionsBatch,
);
router.post(
  "/ai/check-plausibility",
  verifyToken,
  aiPlausibilityLimiter,
  checkReportPlausibility,
);
router.get("/:reportId", verifyToken, getReportById);
router.put("/:reportId/unlock", verifyToken, openReportForEditing);
router.get("/:reportId/export", verifyToken, exportReportToPDF);

module.exports = router;
