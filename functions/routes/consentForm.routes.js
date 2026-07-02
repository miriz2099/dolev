const express = require("express");
const router = express.Router();
const {
  getConsentFormByDiagnosis,
  signByRegisteredParent,
  inviteSecondParent,
  getConsentFormByToken,
  signByExternalParent,
} = require("../controllers/consentForm.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { publicRouteLimiter } = require("../middleware/rateLimiter.middleware");

// === Routes עם אימות (להורה הרשום והמאבחן) ===
router.get("/by-diagnosis/:diagnosisId", verifyToken, getConsentFormByDiagnosis);
router.post("/:formId/sign-registered", verifyToken, signByRegisteredParent);
router.post("/:formId/invite-second-parent", verifyToken, inviteSecondParent);

// === 🆕 Routes ציבוריים (להורה השני - דרך לינק במייל) ===
// ⚠️ אין verifyToken כאן - האימות הוא דרך ה-token שבלינק עצמו
router.get("/by-token/:token", publicRouteLimiter, getConsentFormByToken);
router.post("/by-token/:token/sign", publicRouteLimiter, signByExternalParent);

module.exports = router;
