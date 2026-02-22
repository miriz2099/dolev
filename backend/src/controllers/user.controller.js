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

module.exports = { createParentUser };
