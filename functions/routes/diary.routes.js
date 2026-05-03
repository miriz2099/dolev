// functions/routes/diary.routes.js
const express = require("express");
const router = express.Router();
const { createEvent, getEvents } = require("../controllers/diary.controller");

const { verifyToken } = require("../middleware/auth.middleware");

// הגדרת הנתיבים וקישורם לפונקציות בקונטרולר
// שימי לב שאנחנו מעבירים את ה-authMiddleware כדי להבטיח שרק משתמש מחובר יוכל לגשת
router.post("/events", verifyToken, createEvent);
router.get("/events", verifyToken, getEvents);

module.exports = router;
