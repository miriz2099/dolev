// functions/routes/questionnaire.routes.js
const express = require("express");
const router = express.Router();
const {
  submitQuestionnaire,
  saveDraft,
  getDraft,
} = require("../controllers/questionnaire.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// נתיב לשליחת שאלון סופי - דורש אימות
router.post("/submit", verifyToken, saveDraft, submitQuestionnaire);
router.post("/draft", verifyToken, saveDraft);
router.get("/draft/:childId", verifyToken, getDraft);

module.exports = router;
