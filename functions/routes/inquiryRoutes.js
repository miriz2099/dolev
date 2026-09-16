const express = require("express");
const router = express.Router();

// שימי לב לסוגריים המסולסלים בייבוא!
const { updateAndCheckInquiry, replyToInquiry } = require("../controllers/inquiry.controller");
const { verifyAdmin } = require("../middleware/auth.middleware");

router.patch("/:id/status", verifyAdmin, updateAndCheckInquiry);
router.post("/:id/reply", verifyAdmin, replyToInquiry);

module.exports = router;
