const express = require("express");
const router = express.Router();
const {
  getConsentFormByDiagnosis,
  exportConsentFormPDF,
  signByRegisteredParent,
  inviteSecondParent,
  getConsentFormByToken,
  signByExternalParent,
  markNoSecondParentRequired,
} = require("../controllers/consentForm.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { publicRouteLimiter } = require("../middleware/rateLimiter.middleware");

// === Routes עם אימות (להורה הרשום והמאבחן) ===
router.get("/by-diagnosis/:diagnosisId", verifyToken, getConsentFormByDiagnosis);
router.get(
  "/by-diagnosis/:diagnosisId/export",
  verifyToken,
  exportConsentFormPDF,
);
router.post("/:formId/sign-registered", verifyToken, signByRegisteredParent);
router.post("/:formId/invite-second-parent", verifyToken, inviteSecondParent);
router.post(
  "/:formId/no-second-parent",
  verifyToken,
  markNoSecondParentRequired,
);

// === 🆕 Routes ציבוריים (להורה השני - דרך לינק במייל) ===
// ⚠️ אין verifyToken כאן - האימות הוא דרך ה-token שבלינק עצמו
router.get("/by-token/:token", publicRouteLimiter, getConsentFormByToken);
router.post("/by-token/:token/sign", publicRouteLimiter, signByExternalParent);

module.exports = router;
