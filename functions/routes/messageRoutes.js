const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMyMessagesForChild,
  deleteMessage,
  markMessagesAsRead,
  getMyInbox,
} = require("../controllers/message.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.post("/send", verifyToken, sendMessage);
router.get("/child/:childId", verifyToken, getMyMessagesForChild);
router.delete("/:messageId", verifyToken, deleteMessage);
router.put("/mark-as-read/:childId", verifyToken, markMessagesAsRead);
router.get("/my-inbox", verifyToken, getMyInbox);

module.exports = router;
