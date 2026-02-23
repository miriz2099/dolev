const { auth, db, admin } = require("../config/firebase");

exports.createStaff = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      firstName,
      lastName,
      email,
      phone,
      role,
      // status: "approved",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: "Success", uid: userRecord.uid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// מחיקת מאבחן מהמערכת (Auth + Firestore)
exports.deleteStaff = async (req, res) => {
  const { id } = req.params; // ה-UID של המאבחן למחיקה

  try {
    // 1. מחיקה מה-Firebase Authentication
    await auth.deleteUser(id);

    // 2. מחיקה מה-Firestore Database
    await db.collection("users").doc(id).delete();

    res.status(200).json({ message: "המאבחן נמחק לצמיתות מהמערכת" });
  } catch (error) {
    res.status(400).json({ error: "שגיאה במחיקת המשתמש: " + error.message });
  }
};

// עדכון פרטי מאבחן
exports.updateStaff = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phone, role } = req.body;

  try {
    // עדכון ב-Firestore (פרטים כמו שם וטלפון)
    await db.collection("users").doc(id).update({
      firstName,
      lastName,
      phone,
      role,
    });

    // במידת הצורך, ניתן לעדכן גם את ה-DisplayName ב-Auth
    await auth.updateUser(id, {
      displayName: `${firstName} ${lastName}`,
    });

    res.status(200).json({ message: "פרטי המאבחן עודכנו בהצלחה" });
  } catch (error) {
    res.status(400).json({ error: "שגיאה בעדכון הפרטים" });
  }
};
