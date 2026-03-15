// backend/src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  createParentUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/user.controller");
const { verifyAdmin, verifyToken } = require("../middleware/auth.middleware");

// נתיב ליצירת הורה - מוגן על ידי verifyAdmin
router.post("/create-parent", verifyAdmin, createParentUser);
//go to profile
router.get("/profile", verifyToken, getUserProfile);
//update profile
router.put("/update-profile", verifyToken, updateUserProfile);
module.exports = router;
