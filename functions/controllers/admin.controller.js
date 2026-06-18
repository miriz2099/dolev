const { auth, db, admin } = require("../config/firebase");
const { deleteParentCascade } = require("../helpers/cascade.helper");
const crypto = require("crypto");
const { sendWelcomeEmail } = require("../helpers/mail.helper");

exports.createStaff = async (req, res) => {
  let userRecord = null; // לצורך rollback במקרה כשל

  try {
    // ⚠️ שימי לב: אין יותר password בקלט — המנהל לא מגדיר סיסמה
    const { email, firstName, lastName, phone, role } = req.body;

    // 1. ולידציה
    if (!email || !firstName || !lastName || !role) {
      return res.status(400).json({
        error: "חסרים שדות חובה: מייל, שם פרטי, שם משפחה ותפקיד",
      });
    }

    // 2. סיסמה זמנית אקראית — לעולם לא נחשפת ולא נשלחת במייל
    const tempPassword = crypto.randomBytes(24).toString("hex");

    // 3. יצירת המשתמש ב-Firebase Auth
    userRecord = await auth.createUser({
      email,
      password: tempPassword,
      displayName: `${firstName} ${lastName}`,
    });

    // 4. שמירת הפרופיל ב-Firestore (ISO string לפי קונבנציית הפרויקט)
    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      firstName,
      lastName,
      email,
      phone: phone || null,
      role,
      status: "active",        // נוצר ע"י אדמין => מאושר מראש
      mustSetPassword: true,    // דגל אינפורמטיבי (אופציונלי, ראי הערה למטה)
      createdAt: new Date().toISOString(),
    });

    // 5. יצירת קישור מאובטח להגדרת סיסמה
    const actionCodeSettings = {
      url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/login`,
      handleCodeInApp: false,
    };
    const resetLink = await auth.generatePasswordResetLink(
      email,
      actionCodeSettings
    );

    // 6. שליחת המייל
    await sendWelcomeEmail({ to: email, firstName, role, resetLink });

    res.status(201).json({
      message: "User created and invitation email sent",
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error("Error in createStaff:", error);

    // Rollback: אם המשתמש נוצר אך השלב הבא נכשל — מוחקים כדי לא להשאיר "יתום"
    if (userRecord?.uid) {
      await auth.deleteUser(userRecord.uid).catch(() => {});
      await db.collection("users").doc(userRecord.uid).delete().catch(() => {});
    }

    if (error.code === "auth/email-already-exists") {
      return res.status(409).json({ error: "כתובת המייל כבר רשומה במערכת" });
    }
    res.status(400).json({ error: error.message });
  }
};
// exports.createStaff = async (req, res) => {
//   try {
//     const { email, password, firstName, lastName, phone, role } = req.body;

//     const userRecord = await auth.createUser({
//       email,
//       password,
//       displayName: `${firstName} ${lastName}`,
//     });

//     await db.collection("users").doc(userRecord.uid).set({
//       uid: userRecord.uid,
//       firstName,
//       lastName,
//       email,
//       phone,
//       role,
    

//       createdAt: new Date(),
//     });

//     res.status(201).json({ message: "Success", uid: userRecord.uid });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

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

// שליפת כל ההורים והמטופלים לניהול (אדמין בלבד)
// GET /admin/families
// קריאה דרך ה-Admin SDK עוקפת את חוקי האבטחה של הלקוח (שלא מתירים לאדמין
// לרשום את כל אוסף ה-children מצד הלקוח) - עקבי עם שאר שליפות הילדים בשרת.
exports.getFamilies = async (req, res) => {
  try {
    const parentsSnap = await db
      .collection("users")
      .where("role", "==", "patient")
      .get();

    const childrenSnap = await db.collection("children").get();

    // קיבוץ הילדים לפי parentId
    const childrenByParent = {};
    childrenSnap.forEach((doc) => {
      const child = { id: doc.id, ...doc.data() };
      if (!childrenByParent[child.parentId]) {
        childrenByParent[child.parentId] = [];
      }
      childrenByParent[child.parentId].push(child);
    });

    const families = parentsSnap.docs.map((doc) => {
      const p = doc.data();
      return {
        id: doc.id,
        firstName: p.firstName || "",
        lastName: p.lastName || "",
        email: p.email || "",
        phone: p.phone || "",
        children: childrenByParent[doc.id] || [],
      };
    });

    res.status(200).json(families);
  } catch (error) {
    console.error("Error in getFamilies:", error);
    res
      .status(500)
      .json({ error: "שגיאה בטעינת נתוני ההורים והמטופלים" });
  }
};

// מחיקת הורה + כל הילדים והנתונים שלו + חשבון ה-Auth (אדמין בלבד)
// DELETE /admin/delete-parent/:id
exports.deleteParent = async (req, res) => {
  const { id } = req.params; // ה-UID של ההורה למחיקה

  try {
    const userDoc = await db.collection("users").doc(id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "המשתמש לא נמצא" });
    }

    // מגן: מסלול זה מיועד להורים בלבד - לא למחיקת מאבחנים/אדמינים
    if (userDoc.data().role !== "patient") {
      return res.status(400).json({
        error: "מסלול זה מיועד למחיקת הורים בלבד. למחיקת איש צוות יש להשתמש בניהול הצוות.",
      });
    }

    await deleteParentCascade(id);

    res
      .status(200)
      .json({ message: "ההורה, ילדיו וכל הנתונים המקושרים נמחקו לצמיתות" });
  } catch (error) {
    console.error("Error in deleteParent:", error);
    res.status(400).json({ error: "שגיאה במחיקת ההורה: " + error.message });
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
