// backend/src/controllers/child.controller.js
const { db } = require("../config/firebase");

const createChild = async (req, res) => {
  try {
    const { firstName, lastName, idNumber, birthDate, parentId, therapistId } =
      req.body;

    // בדיקה בסיסית שכל השדות הגיעו
    if (!firstName || !lastName || !idNumber || !parentId || !therapistId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // יצירת אובייקט הילד
    const newChild = {
      firstName,
      lastName,
      idNumber,
      birthDate,
      parentId, // ה-UID של ההורה מה-Dropdown
      therapistId, // ה-UID של המטפל מה-Dropdown
      createdAt: new Date().toISOString(),
    };

    // שמירה ב-Collection חדש שנקרא children
    const docRef = await db.collection("children").add(newChild);

    res.status(201).json({
      message: "Child profile created successfully",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Error creating child profile:", error);
    res.status(500).json({ error: "Failed to create child profile" });
  }
};

module.exports = { createChild };
