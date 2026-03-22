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
      canFillQuestionnaire: false,
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

const getParentChildren = async (req, res) => {
  try {
    // ה-UID מגיע מה-Middleware של ה-Auth (מבוסס על ה-Token)
    const parentId = req.user.uid;

    const childrenSnapshot = await db
      .collection("children")
      .where("parentId", "==", parentId)
      .get();

    const children = [];
    childrenSnapshot.forEach((doc) => {
      children.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(children);
  } catch (error) {
    res.status(500).json({ message: "Error fetching children", error });
  }
};

const getChildById = async (req, res) => {
  try {
    const { childId } = req.params;
    const IdFromToken = req.user.uid;

    // 1. שליפת מסמך הילד
    const childDoc = await db.collection("children").doc(childId).get();

    if (!childDoc.exists) {
      return res.status(404).json({ error: "הילד לא נמצא" });
    }

    const childData = childDoc.data();

    // 2. בדיקת אבטחה: האם זה ההורה של הילד?
    if (
      childData.parentId !== IdFromToken &&
      childData.therapistId !== IdFromToken
    ) {
      return res.status(403).json({ error: "אין הרשאה לצפות במידע זה" });
    }

    // 3. שליפת שם המטפל ממסמך המשתמשים (users)
    let therapistName = "טרם שובץ מאבחן";
    if (childData.therapistId) {
      const therapistDoc = await db
        .collection("users")
        .doc(childData.therapistId)
        .get();
      if (therapistDoc.exists) {
        const tData = therapistDoc.data();
        // מחזירים רק את השם, בלי אימייל או פרטים רגישים אחרים של המטפל
        therapistName = `${tData.firstName} ${tData.lastName}`;
      }
    }

    // 4. החזרת המידע המאוחד
    res.status(200).json({
      id: childDoc.id,
      ...childData,
      therapistName: therapistName, // הוספת השם ששלפנו
    });
  } catch (error) {
    console.error("Error in getChildById:", error);
    res.status(500).json({ error: "שגיאת שרת פנימית" });
  }
};

const getTherapistPatients = async (req, res) => {
  try {
    // ה-UID מגיע מה-Middleware (verifyToken)
    const therapistId = req.user.uid;

    const patientsSnapshot = await db
      .collection("children")
      .where("therapistId", "==", therapistId)
      .get();

    const patients = [];
    patientsSnapshot.forEach((doc) => {
      patients.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching therapist patients:", error);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
};

// שליפת פרטי הורה עבור מאבחן
const getParentDetails = async (req, res) => {
  try {
    const { parentId } = req.params;

    // שליפת מסמך המשתמש (ההורה) מ-Collection users
    const parentDoc = await db.collection("users").doc(parentId).get();

    if (!parentDoc.exists) {
      return res.status(404).json({ error: "הורה לא נמצא" });
    }

    const userData = parentDoc.data();

    // מחזירים רק פרטים רלוונטיים (ללא סיסמאות או מידע רגיש מיותר)
    res.status(200).json({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone || "לא הוזן טלפון",
    });
  } catch (error) {
    console.error("Error fetching parent details:", error);
    res.status(500).json({ error: "שגיאה בשליפת פרטי הורה" });
  }
};

// עדכון הייצוא בסוף הקובץ
module.exports = {
  // ... שאר הפונקציות
  getParentDetails,
};

module.exports = {
  createChild,
  getParentChildren,
  getChildById,
  getTherapistPatients,
  getParentDetails,
};
