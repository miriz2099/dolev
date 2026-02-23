// backend/src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { createParentUser } = require("../controllers/user.controller");
const { verifyAdmin } = require("../middleware/auth.middleware");

// נתיב ליצירת הורה - מוגן על ידי verifyAdmin
router.post("/create-parent", verifyAdmin, createParentUser);

module.exports = router;
