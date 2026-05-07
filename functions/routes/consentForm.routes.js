const express = require("express");
const router = express.Router();
const {
  getConsentFormByChild,
  signByRegisteredParent,
  inviteSecondParent,
  getConsentFormByToken,
  signByExternalParent,
} = require("../controllers/consentForm.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// === Routes עם אימות (להורה הרשום והמאבחן) ===
router.get("/by-child/:childId", verifyToken, getConsentFormByChild);
router.post("/:formId/sign-registered", verifyToken, signByRegisteredParent);
router.post("/:formId/invite-second-parent", verifyToken, inviteSecondParent);

// === 🆕 Routes ציבוריים (להורה השני - דרך לינק במייל) ===
// ⚠️ אין verifyToken כאן - האימות הוא דרך ה-token שבלינק עצמו
router.get("/by-token/:token", getConsentFormByToken);
router.post("/by-token/:token/sign", signByExternalParent);

module.exports = router;
