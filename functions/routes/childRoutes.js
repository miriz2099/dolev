// backend/src/routes/childRoutes.js
const express = require("express");
const router = express.Router();

// 1. ייבוא שתי הפונקציות מה-Controller
const {
  createChild,
  getParentChildren,
  getChildById,
} = require("../controllers/child.controller");

// 2. ייבוא שני המידלוורים (הוספתי את verifyToken)
const { verifyAdmin, verifyToken } = require("../middleware/auth.middleware");
// נתיב ליצירת ילד - רק אדמין מורשה
// 1. קודם כל הנתיבים הסטטיים (הקבועים)
router.post("/create", verifyAdmin, createChild);
router.get("/myChildren", verifyToken, getParentChildren); // תמיד מעל הנתיב עם הנקודתיים!

// 2. רק בסוף הנתיבים הדינמיים (עם הפרמטרים)
router.get("/:childId", verifyToken, getChildById);

module.exports = router;
