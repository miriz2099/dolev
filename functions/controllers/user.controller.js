// backend/src/controllers/user.controller.js
const { auth, db } = require("../config/firebase");

const createParentUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // 1. יצירת המשתמש ב-Firebase Authentication
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: `${firstName} ${lastName}`,
      //   phoneNumber: `+972${phone.substring(1)}`, // המרה לפורמט בינלאומי אם צריך
    });

    // 2. יצירת מסמך המשתמש ב-Firestore עם ה-UID שקיבלנו מה-Auth
    const userData = {
      uid: userRecord.uid,
      firstName,
      lastName,
      email,
      phone,
      role: "patient", // כפי שביקשת - הורה הוא פציינט
      //   status: "approved", // אדמין יצר אותו, אז הוא מאושר אוטומטית
      createdAt: new Date().toISOString(),
    };

    await db.collection("users").doc(userRecord.uid).set(userData);

    res.status(201).json({
      message: "Parent user created successfully",
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error("Error creating parent user:", error);
    res.status(500).json({ error: error.message || "Failed to create user" });
  }
};
const getUserProfile = async (req, res) => {
  try {
    // ה-uid מגיע מהמידלוור verifyToken
    const uid = req.user.uid;

    // שליפת המסמך מה-Collection של users
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User document not found" });
    }

    const userData = userDoc.data();

    // מחזירים את הנתונים לצד הלקוח
    res.status(200).json({
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      phone: userData.phone || "",
      email: userData.email || req.user.email, // עדיפות למייל מהדאטהבייס
      role: userData.role || "patient",
    });
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    // ה-uid מגיע מהמידלוור verifyToken - זה מבטיח שרק בעל החשבון מעדכן את עצמו!
    const uid = req.user.uid;
    const { firstName, lastName, phone } = req.body;

    // 1. עדכון ב-Firestore
    const userRef = db.collection("users").doc(uid);

    await userRef.update({
      firstName,
      lastName,
      phone,
      updatedAt: new Date().toISOString(),
    });

    // 2. אופציונלי: עדכון ה-DisplayName גם ב-Firebase Auth (כדי שיהיה מסונכרן)
    // await auth.updateUser(uid, {
    //   displayName: `${firstName} ${lastName}`,
    // });

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

module.exports = { createParentUser, getUserProfile, updateUserProfile };
