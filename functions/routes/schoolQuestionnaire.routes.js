const express = require("express");
const router = express.Router();
const {
  createSchoolInvitation,
  checkInvitation,
  submitSchoolSurvey,
  saveSchoolDraft,
  getSchoolSurveyByDiagnosis,
  resendSchoolInvitation,
  resetSchoolInvitation,
  getInvitationByDiagnosis,
} = require("../controllers/schoolQuestionnaire.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { publicRouteLimiter } = require("../middleware/rateLimiter.middleware");

// 1. יצירת הזמנה (מבוצע ע"י ההורה - לכן דורש אימות)
router.post("/invite", verifyToken, createSchoolInvitation);

// 2. בדיקת הטוקן (מבוצע ע"י המורה - ציבורי)
router.get("/check-invite/:token", publicRouteLimiter, checkInvitation);

router.get("/invitation/:diagnosisId", verifyToken, getInvitationByDiagnosis);

// 3. שליחת השאלון הסופי (מבוצע ע"י המורה - ציבורי - ללא verifyToken!)
router.post("/submit/:token", publicRouteLimiter, submitSchoolSurvey);

router.put("/draft/:token", publicRouteLimiter, saveSchoolDraft);

router.get("/diagnosis/:diagnosisId", verifyToken, getSchoolSurveyByDiagnosis);

router.post("/resend", verifyToken, resendSchoolInvitation);

router.post("/reset", verifyToken, resetSchoolInvitation);

module.exports = router;
