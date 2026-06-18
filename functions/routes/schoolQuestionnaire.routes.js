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

// 1. יצירת הזמנה (מבוצע ע"י ההורה - לכן דורש אימות)
router.post("/invite", verifyToken, createSchoolInvitation);

// 2. בדיקת הטוקן (מבוצע ע"י המורה - ציבורי)
router.get("/check-invite/:token", checkInvitation);

router.get("/invitation/:diagnosisId", verifyToken, getInvitationByDiagnosis);

// 3. שליחת השאלון הסופי (מבוצע ע"י המורה - ציבורי - ללא verifyToken!)
router.post("/submit/:token", submitSchoolSurvey);

router.put("/draft/:token", saveSchoolDraft);

router.get("/diagnosis/:diagnosisId", verifyToken, getSchoolSurveyByDiagnosis);

router.post("/resend", verifyToken, resendSchoolInvitation);

router.post("/reset", verifyToken, resetSchoolInvitation);

module.exports = router;
