const express = require("express");
const router = express.Router();

// שימי לב לסוגריים המסולסלים בייבוא!
const { updateAndCheckInquiry } = require("../controllers/inquiry.controller");
const { verifyAdmin } = require("../middleware/auth.middleware");

router.patch("/:id/status", verifyAdmin, updateAndCheckInquiry);

module.exports = router;
