// backend/src/routes/childRoutes.js
const express = require("express");
const router = express.Router();

// 1. ייבוא שתי הפונקציות מה-Controller
const {
  createChild,
  getParentChildren,
  getChildById,
  getTherapistPatients,
  getParentDetails,
} = require("../controllers/child.controller");

const { verifyAdmin, verifyToken } = require("../middleware/auth.middleware");

router.post("/create", verifyAdmin, createChild);
router.get("/myChildren", verifyToken, getParentChildren);
router.get("/my-patients", verifyToken, getTherapistPatients);

router.get("/:childId", verifyToken, getChildById);

router.get("/parent-info/:parentId", verifyToken, getParentDetails);

module.exports = router;
