// backend/src/routes/childRoutes.js
const express = require("express");
const router = express.Router();
const { createChild } = require("../controllers/child.controller");
const { verifyAdmin } = require("../middleware/auth.middleware");

// נתיב ליצירת ילד - רק אדמין מורשה
router.post("/create", verifyAdmin, createChild);

module.exports = router;
