const { db } = require("../config/firebase");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const createSchoolInvitation = async (req, res) => {
  try {
    const { childId, teacherEmail, teacherName } = req.body;
    const parentId = req.user?.uid; // וודאי שה-middleware מוסיף את user

    if (!childId || !teacherEmail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    // 1. שמירה ב-DB קודם (כדי שלא נשלח מייל אם ה-DB נכשל)
    await db.collection("school_invitations").add({
      token,
      childId,
      parentId,
      teacherEmail,
      teacherName: teacherName || "מורה יקר/ה",
      status: "pending",
      createdAt: new Date().toISOString(),
      expiryDate: expiryDate.toISOString(),
    });

    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const inviteLink = `${baseUrl}/school-survey/${token}`;

    // 2. הגדרת הטרנספורטר בצורה יציבה יותר
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // שימוש ב-SSL
      auth: {
        user: "***REMOVED***",
        pass: "***REMOVED***", // כאן חייב לבוא הקוד שגוגל נתנה לך
      },
    });

    const mailOptions = {
      from: '"מרכז האבחון" <***REMOVED***>',
      to: teacherEmail,
      subject: `שאלון הערכה לימודי עבור תלמיד/ה`,
      html: `
        <div dir="rtl" style="font-family: sans-serif; text-align: right;">
          <h2>שלום ${teacherName},</h2>
          <p>הורי התלמיד הזמינו אותך למלא שאלון תפקודי כחלק מתהליך אבחון.</p>
          <div style="margin: 30px 0;">
            <a href="${inviteLink}" style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">
              כניסה למילוי השאלון
            </a>
          </div>
          <p>תודה על שיתוף הפעולה,</p>
          <p>צוות המרכז.</p>
        </div>
      `,
    };

    // 3. שליחה
    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: "הזמנה נוצרה והמייל נשלח בהצלחה",
      inviteLink,
    });
  } catch (error) {
    console.error("ERROR IN createSchoolInvitation:", error);
    return res.status(500).json({
      error: "Server Error",
      message: error.message,
    });
  }
};

// const checkInvitation = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const snapshot = await db
//       .collection("school_invitations")
//       .where("token", "==", token)
//       .where("status", "==", "pending")
//       .get();

//     if (snapshot.empty) return res.status(404).json({ error: "קישור לא תקין" });

//     const invitationData = snapshot.docs[0].data();

//     // שליפת שם הילד
//     const childDoc = await db
//       .collection("children")
//       .doc(invitationData.childId)
//       .get();

//     res.status(200).json({
//       childName: childDoc.exists
//         ? `${childDoc.data().firstName} ${childDoc.data().lastName}`
//         : "התלמיד",
//       teacherName: invitationData.teacherName,
//       // שליחת הדרפט אם קיים, אם לא - אובייקט ריק
//       draftData: invitationData.draftData || null,
//     });
//   } catch (error) {
//     res.status(500).json({ error: "שגיאה באימות" });
//   }
// };

const checkInvitation = async (req, res) => {
  try {
    const { token } = req.params;
    const snapshot = await db
      .collection("school_invitations")
      .where("token", "==", token)
      .get();

    if (snapshot.empty) return res.status(404).json({ error: "קישור לא תקין" });

    const invitationData = snapshot.docs[0].data();
    const childId = invitationData.childId;

    // שליפת שם הילד
    const childDoc = await db.collection("children").doc(childId).get();

    // --- החלק החדש: חיפוש שאלון קיים למקרה של "החזרה לתיקון" ---
    const existingSurveySnapshot = await db
      .collection("school_questionnaires")
      .where("childId", "==", childId)
      .orderBy("submittedAt", "desc")
      .limit(1)
      .get();

    let initialFormData = invitationData.draftData || null;

    // אם קיים שאלון סופי, הוא מקבל עדיפות על הטיוטה
    if (!existingSurveySnapshot.empty) {
      initialFormData = existingSurveySnapshot.docs[0].data().formData;
    }

    res.status(200).json({
      childName: childDoc.exists
        ? `${childDoc.data().firstName} ${childDoc.data().lastName}`
        : "התלמיד",
      teacherName: invitationData.teacherName,
      draftData: initialFormData, // זה יכיל את השאלון הקודם או את הטיוטה
    });
  } catch (error) {
    res.status(500).json({ error: "שגיאה באימות" });
  }
};

const submitSchoolSurvey = async (req, res) => {
  try {
    const { token } = req.params;
    const { formData } = req.body;

    if (!formData) {
      return res.status(400).json({ error: "לא התקבלו נתונים" });
    }

    // 1. חיפוש ההזמנה
    const snapshot = await db
      .collection("school_invitations")
      .where("token", "==", token)
      .where("status", "==", "pending")
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "הזמנה לא נמצאה או שכבר הושלמה" });
    }

    const invitationDoc = snapshot.docs[0];
    const invitationData = invitationDoc.data();

    // 2. ניקוי ה-formData מערכי undefined (למקרה שהמורה השאיר שדות ריקים)
    const cleanFormData = JSON.parse(
      JSON.stringify(formData, (k, v) => (v === undefined ? null : v)),
    );

    const batch = db.batch();

    // 3. יצירת השאלון - שימי לב לבדיקות ה-OR (||) למניעת undefined
    const surveyRef = db.collection("school_questionnaires").doc();
    batch.set(surveyRef, {
      childId: invitationData.childId,
      teacherEmail: invitationData.teacherEmail,
      teacherName: invitationData.teacherName,
      formData: cleanFormData,
      submittedAt: new Date().toISOString(),
      invitationId: invitationDoc.id,
    });

    // 4. סגירת הלינק
    batch.update(invitationDoc.ref, {
      status: "completed",
      completedAt: new Date().toISOString(),
    });

    await batch.commit();

    res.status(200).json({ message: "השאלון נשלח בהצלחה" });
  } catch (error) {
    console.error("Error in submitSchoolSurvey:", error);
    res.status(500).json({
      error: "נכשלה שליחת השאלון",
      details: error.message, // זה עוזר לנו לדבג
    });
  }
};

const saveSchoolDraft = async (req, res) => {
  try {
    const { token } = req.params;
    const { formData } = req.body;

    const snapshot = await db
      .collection("school_invitations")
      .where("token", "==", token)
      .get();

    if (snapshot.empty)
      return res.status(404).json({ error: "הזמנה לא נמצאה" });

    const invitationDoc = snapshot.docs[0];

    // שמירת הטיוטה בתוך מסמך ההזמנה או בקולקשיין נפרד
    await invitationDoc.ref.update({
      draftData: formData,
      completedAt: new Date(),

      //   lastDraftUpdate: new Date().toISOString(),
    });

    res.status(200).json({ message: "Draft saved" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save draft" });
  }
};

const getSchoolSurveyByChild = async (req, res) => {
  try {
    const { childId } = req.params;

    // חיפוש השאלון הכי עדכני שנשלח עבור הילד הזה
    const snapshot = await db
      .collection("school_questionnaires")
      .where("childId", "==", childId)
      .orderBy("submittedAt", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ message: "לא נמצא שאלון בית ספר עבור ילד זה" });
    }

    const surveyData = snapshot.docs[0].data();
    res.status(200).json(surveyData);
  } catch (error) {
    console.error("Error fetching school survey:", error);
    res.status(500).json({ error: "שגיאה בשליפת השאלון" });
  }
};
const resendSchoolInvitation = async (req, res) => {
  try {
    const { childId } = req.body;

    // 1. חיפוש ההזמנה הקיימת
    const snapshot = await db
      .collection("school_invitations")
      .where("childId", "==", childId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "לא נמצאה הזמנה לילד זה" });
    }

    const invitationDoc = snapshot.docs[0];
    const invData = invitationDoc.data();

    // 2. עדכון תוקף ל-7 ימים נוספים וסטטוס ל-pending
    const newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + 7);

    await invitationDoc.ref.update({
      expiryDate: newExpiry.toISOString(),
      status: "pending", // חשוב: מחזיר את האפשרות לערוך אם זה היה completed
    });

    // 3. יצירת הלינק (ממש כמו ביצירה הראשונית)
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const inviteLink = `${baseUrl}/school-survey/${invData.token}`;

    // 4. הגדרת המייל (Nodemailer)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "***REMOVED***",
        pass: "***REMOVED***",
      },
    });

    const mailOptions = {
      from: '"מרכז האבחון" <***REMOVED***>',
      to: invData.teacherEmail,
      subject: `עדכון/תזכורת: שאלון הערכה לימודי עבור התלמיד/ה`,
      html: `
        <div dir="rtl" style="font-family: sans-serif; text-align: right;">
          <h2>שלום ${invData.teacherName},</h2>
          <p>התקבלה בקשה מהמרכז לעדכון או השלמת פרטים בשאלון התפקודי של התלמיד/ה.</p>
          <p>אם כבר מילאת את השאלון, תוכלי להיכנס לקישור ולבצע את התיקונים הנדרשים.</p>
          <div style="margin: 30px 0;">
            <a href="${inviteLink}" style="background-color: #e11d48; color: white; padding: 12px 25px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">
              כניסה לעדכון השאלון
            </a>
          </div>
          <p>הקישור הוא אישי ומאובטח, ותקף ל-7 ימים הקרובים.</p>
          <p>תודה על שיתוף הפעולה,</p>
          <p>צוות המרכז.</p>
        </div>
      `,
    };

    // 5. שליחה בפועל
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "המייל נשלח שוב למורה בהצלחה" });
  } catch (error) {
    console.error("ERROR IN resendSchoolInvitation:", error);
    res
      .status(500)
      .json({ error: "נכשלה השליחה החוזרת", details: error.message });
  }
};

// const resendSchoolInvitation = async (req, res) => {
//   try {
//     const { childId } = req.body;

//     const snapshot = await db
//       .collection("school_invitations")
//       .where("childId", "==", childId)
//       .limit(1)
//       .get();

//     if (snapshot.empty)
//       return res.status(404).json({ error: "לא נמצאה הזמנה לילד זה" });

//     const invitationDoc = snapshot.docs[0];
//     const invData = invitationDoc.data();

//     // עדכון תוקף ל-7 ימים נוספים מהיום
//     const newExpiry = new Date();
//     newExpiry.setDate(newExpiry.getDate() + 7);

//     await invitationDoc.ref.update({
//       expiryDate: newExpiry.toISOString(),
//       status: "pending", // מחזיר לסטטוס ממתין כדי שהמורה יוכל לערוך
//     });

//     // כאן את צריכה להשתמש באותה לוגיקת nodemailer שיש לך ב-createInvitation
//     // כדי לשלוח למורה מייל שאומר: "השאלון הוחזר אליך לתיקון בקישור הבא..."

//     res.status(200).json({ message: "המייל נשלח שוב למורה בהצלחה" });
//   } catch (error) {
//     res.status(500).json({ error: "נכשלה השליחה החוזרת" });
//   }
// };

// 2. איפוס מוחלט (מחיקת השאלון הקיים כדי שההורה יוכל לשלוח מחדש)
const resetSchoolInvitation = async (req, res) => {
  try {
    const { childId } = req.body;
    const therapistId = req.user.uid; // המאבחן שמבצע את האיפוס

    // 1. מחיקת ההזמנה והשאלון
    const invSnapshot = await db
      .collection("school_invitations")
      .where("childId", "==", childId)
      .get();
    const surveySnapshot = await db
      .collection("school_questionnaires")
      .where("childId", "==", childId)
      .get();

    const batch = db.batch();
    invSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
    surveySnapshot.docs.forEach((doc) => batch.delete(doc.ref));

    // 2. שליחת הודעה פנימית להורה על האיפוס
    // אנחנו צריכים את ה-parentId. נשיג אותו מההזמנה שנמחקה או מהילד
    let parentId = "";
    if (!invSnapshot.empty) {
      parentId = invSnapshot.docs[0].data().parentId;
    } else {
      const childDoc = await db.collection("children").doc(childId).get();
      parentId = childDoc.data()?.parentId;
    }

    if (parentId) {
      const msgRef = db.collection("messages").doc();
      batch.set(msgRef, {
        senderId: therapistId,
        receiverId: parentId,
        childId: childId,
        text: "שלום, שאלון בית הספר אופס על ידי המאבחן. אנא היכנסו ללשונית 'אישורים וטפסים' ושלחו קישור חדש למורה המעודכן.",
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    await batch.commit();

    res.status(200).json({ message: "השאלון אופס והודעה נשלחה להורים." });
  } catch (error) {
    console.error("Error in resetSchoolInvitation:", error);
    res.status(500).json({ error: "נכשל איפוס השאלון" });
  }
};

const getInvitationByChild = async (req, res) => {
  try {
    const { childId } = req.params;
    const snapshot = await db
      .collection("school_invitations")
      .where("childId", "==", childId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(200).json(null); // חשוב: מחזירים null ולא שגיאה
    }

    res.status(200).json(snapshot.docs[0].data());
  } catch (error) {
    res.status(500).json({ error: "שגיאה בשליפת הזמנה" });
  }
};

module.exports = {
  createSchoolInvitation,
  checkInvitation,
  submitSchoolSurvey,
  saveSchoolDraft,
  getSchoolSurveyByChild,
  resendSchoolInvitation,
  resetSchoolInvitation,
  getInvitationByChild,
};
