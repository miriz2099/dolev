const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { verifyAdmin } = require("../middleware/auth.middleware");

// הכתובת המלאה תהיה: POST /api/admin/create-staff
router.post("/create-staff", verifyAdmin, adminController.createStaff);
router.delete("/delete-staff/:id", verifyAdmin, adminController.deleteStaff);
router.put("/update-staff/:id", verifyAdmin, adminController.updateStaff);

module.exports = router;
