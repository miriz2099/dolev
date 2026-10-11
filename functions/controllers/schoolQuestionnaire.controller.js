const { db, admin } = require("../config/firebase");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const pdfService = require("../services/pdf.service");
const { sendSchoolCorrectionEmail } = require("../helpers/mail.helper");

/**
 * הרשאה: מותר רק לאדמין או למאבחן/ת שהאבחון שייך לו/ה - אותו היגיון כמו
 * getDiagnosisAccess ב-report.controller.js, מועתק מקומית כדי לא לגעת
 * באותו קובץ.
 */
const getDiagnosisAccess = async (uid, diagnosisId) => {
  const diagDoc = await db.collection("diagnoses").doc(diagnosisId).get();
  if (!diagDoc.exists) {
    return { ok: false, code: 404, error: "האבחון לא נמצא" };
  }
  const diagnosis = diagDoc.data();

  const userDoc = await db.collection("users").doc(uid).get();
  const role = userDoc.exists ? userDoc.data().role : null;

  const isAdmin = role === "admin";
  const isOwnerTherapist = diagnosis.therapistId === uid;

  if (!isAdmin && !isOwnerTherapist) {
    return { ok: false, code: 403, error: "אין הרשאה לגשת לאבחון זה" };
  }
  return { ok: true, diagnosis };
};

const createSchoolInvitation = async (req, res) => {
  try {
    const { childId, diagnosisId, teacherEmail, teacherName } = req.body;
    const parentId = req.user?.uid; // וודאי שה-middleware מוסיף את user

    if (!childId || !diagnosisId || !teacherEmail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    // 1. שמירה ב-DB קודם (כדי שלא נשלח מייל אם ה-DB נכשל)
    // diagnosisId נשמר על ההזמנה כדי שהטוקן הציבורי יוכל לזהות את האבחון
    await db.collection("school_invitations").add({
      token,
      childId,
      diagnosisId,
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
        user: process.env.SMTP_USER, // ← נשלף מ-.env
        pass: process.env.SMTP_PASS, // כאן חייב לבוא הקוד שגוגל נתנה לך
      },
    });

    const mailOptions = {
      from: '"מרכז האבחון" ',
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
    const diagnosisId = invitationData.diagnosisId;

    // שליפת שם הילד
    const childDoc = await db.collection("children").doc(childId).get();

    // --- החלק החדש: חיפוש שאלון קיים למקרה של "החזרה לתיקון" ---
    // מקושר לאבחון הספציפי (ולא לילד) כדי לא לערבב בין אבחונים שונים
    const existingSurveySnapshot = await db
      .collection("school_questionnaires")
      .where("diagnosisId", "==", diagnosisId)
      .orderBy("submittedAt", "desc")
      .limit(1)
      .get();

    // סדר עדיפות: טיוטה שנשמרה באמצע תיקון > השאלון האחרון שנשלח > ריק -
    // כך שטיוטה שהמורה שמר/ה באמצע תיקון לא תידרס ע"י השאלון הישן יותר.
    let initialFormData = null;
    if (!existingSurveySnapshot.empty) {
      initialFormData = existingSurveySnapshot.docs[0].data().formData;
    }
    if (invitationData.draftData) {
      initialFormData = invitationData.draftData;
    }

    const correctionNote =
      invitationData.status === "pending" && invitationData.lastCorrection
        ? invitationData.lastCorrection.note
        : null;

    res.status(200).json({
      childName: childDoc.exists
        ? `${childDoc.data().firstName} ${childDoc.data().lastName}`
        : "התלמיד",
      teacherName: invitationData.teacherName,
      draftData: initialFormData, // זה יכיל את השאלון הקודם או את הטיוטה
      correctionNote,
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

    // 3. יצירת השאלון - מקושר במפורש ל-diagnosisId שנשמר על ההזמנה
    const surveyRef = db.collection("school_questionnaires").doc();
    batch.set(surveyRef, {
      childId: invitationData.childId,
      diagnosisId: invitationData.diagnosisId,
      teacherEmail: invitationData.teacherEmail,
      teacherName: invitationData.teacherName,
      formData: cleanFormData,
      submittedAt: new Date().toISOString(),
      invitationId: invitationDoc.id,
    });

    // 4. סגירת הלינק. lastCorrection נשאר כמו שהוא (היסטוריה) - מוחקים רק
    // את draftData, כדי שתיקון עתידי לא "יזכור" טיוטה מהסיבוב הזה.
    batch.update(invitationDoc.ref, {
      status: "completed",
      completedAt: new Date().toISOString(),
      draftData: null,
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

// GET /school-questionnaires/diagnosis/:diagnosisId
const getSchoolSurveyByDiagnosis = async (req, res) => {
  try {
    const { diagnosisId } = req.params;
    const userId = req.user.uid;

    // בדיקת אבטחה: רק ההורה או המטפל של האבחון רשאים לצפות בשאלון
    const diagDoc = await db.collection("diagnoses").doc(diagnosisId).get();
    if (!diagDoc.exists) {
      return res.status(404).json({ error: "האבחון לא נמצא" });
    }
    const { childId } = diagDoc.data();

    const childDoc = await db.collection("children").doc(childId).get();
    if (!childDoc.exists) {
      return res.status(404).json({ error: "הילד לא נמצא" });
    }
    const childData = childDoc.data();
    if (childData.parentId !== userId && childData.therapistId !== userId) {
      return res.status(403).json({ error: "אין הרשאה לצפות בשאלון זה" });
    }

    // חיפוש השאלון הכי עדכני שנשלח עבור האבחון הזה
    const snapshot = await db
      .collection("school_questionnaires")
      .where("diagnosisId", "==", diagnosisId)
      .orderBy("submittedAt", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ message: "לא נמצא שאלון בית ספר עבור אבחון זה" });
    }

    const surveyData = snapshot.docs[0].data();
    res.status(200).json(surveyData);
  } catch (error) {
    console.error("Error fetching school survey:", error);
    res.status(500).json({ error: "שגיאה בשליפת השאלון" });
  }
};

// GET /school-questionnaires/diagnosis/:diagnosisId/export
// ייצוא שאלון בית הספר ל-PDF - מוגבל למאבחן בעל האבחון או אדמין בלבד.
const exportSchoolQuestionnairePDF = async (req, res) => {
  try {
    const { diagnosisId } = req.params;
    const uid = req.user.uid;

    const diagDoc = await db.collection("diagnoses").doc(diagnosisId).get();
    if (!diagDoc.exists) {
      return res.status(404).json({ error: "האבחון לא נמצא" });
    }
    const diagnosis = diagDoc.data();

    const userDoc = await db.collection("users").doc(uid).get();
    const role = userDoc.exists ? userDoc.data().role : null;
    if (role !== "admin" && diagnosis.therapistId !== uid) {
      return res.status(403).json({ error: "אין הרשאה לייצא שאלון זה" });
    }

    const snapshot = await db
      .collection("school_questionnaires")
      .where("diagnosisId", "==", diagnosisId)
      .orderBy("submittedAt", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ error: "לא נמצא שאלון בית ספר עבור אבחון זה" });
    }

    const pdfBuffer = await pdfService.generateSchoolQuestionnairePDFBuffer(
      snapshot.docs[0].data(),
    );
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=school_questionnaire_${diagnosisId}.pdf`,
    );
    return res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error("Error in exportSchoolQuestionnairePDF:", error);
    res.status(500).json({ error: "שגיאה בייצוא השאלון ל-PDF" });
  }
};
const resendSchoolInvitation = async (req, res) => {
  try {
    const { diagnosisId, correctionNote } = req.body;
    const uid = req.user.uid;

    if (!diagnosisId) {
      return res.status(400).json({ error: "חסר diagnosisId" });
    }

    // --- הרשאה: רק אדמין או המאבחן/ת בעל/ת האבחון ---
    const access = await getDiagnosisAccess(uid, diagnosisId);
    if (!access.ok) {
      return res.status(access.code).json({ error: access.error });
    }

    // --- ולידציה: יש לכתוב למורה מה לתקן ---
    const trimmedNote =
      typeof correctionNote === "string" ? correctionNote.trim() : "";
    if (trimmedNote.length < 5 || trimmedNote.length > 2000) {
      return res.status(400).json({ error: "יש לכתוב למורה מה לתקן" });
    }

    // 1. חיפוש ההזמנה הקיימת
    const snapshot = await db
      .collection("school_invitations")
      .where("diagnosisId", "==", diagnosisId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "לא נמצאה הזמנה לילד זה" });
    }

    const invitationDoc = snapshot.docs[0];
    const invData = invitationDoc.data();

    // 2. עדכון תוקף ל-7 ימים נוספים, סטטוס ל-pending, ומחיקת טיוטה ישנה -
    // כך שהשאלון האחרון שנשלח ייטען כבסיס לתיקון. השמירה ב-DB קודמת
    // לשליחת המייל, כדי שלא "נאבד" את ההחזרה לתיקון אם המייל נכשל.
    const newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + 7);
    const requestedAt = new Date().toISOString();
    const correctionEntry = {
      note: trimmedNote,
      requestedAt,
      requestedBy: uid,
    };

    await invitationDoc.ref.update({
      expiryDate: newExpiry.toISOString(),
      status: "pending", // חשוב: מחזיר את האפשרות לערוך אם זה היה completed
      draftData: null,
      lastCorrection: correctionEntry,
      correctionHistory: admin.firestore.FieldValue.arrayUnion(correctionEntry),
    });

    // 3. שם פרטי של הילד/ה לנושא המייל (אם קיים)
    let childFirstName = "";
    if (invData.childId) {
      const childDoc = await db
        .collection("children")
        .doc(invData.childId)
        .get();
      if (childDoc.exists) childFirstName = childDoc.data().firstName || "";
    }

    // 4. יצירת הלינק (ממש כמו ביצירה הראשונית)
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const inviteLink = `${baseUrl}/school-survey/${invData.token}`;

    // 5. שליחת המייל - כשל כאן לא מוחק את ההחזרה לתיקון שכבר נשמרה
    try {
      await sendSchoolCorrectionEmail({
        to: invData.teacherEmail,
        teacherName: invData.teacherName,
        childFirstName,
        correctionNote: trimmedNote,
        link: inviteLink,
      });
    } catch (mailErr) {
      console.error("ERROR sending school correction email:", mailErr);
      return res.status(502).json({
        error:
          "ההחזרה לתיקון נשמרה, אך שליחת המייל למורה נכשלה. נסי שוב.",
      });
    }

    res.status(200).json({ message: "השאלון הוחזר למורה לתיקון והמייל נשלח" });
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
    const { diagnosisId } = req.body;
    const therapistId = req.user.uid; // המאבחן שמבצע את האיפוס

    if (!diagnosisId) {
      return res.status(400).json({ error: "חסר diagnosisId" });
    }

    // --- הרשאה: רק אדמין או המאבחן/ת בעל/ת האבחון ---
    const access = await getDiagnosisAccess(therapistId, diagnosisId);
    if (!access.ok) {
      return res.status(access.code).json({ error: access.error });
    }

    // 1. מחיקת ההזמנה והשאלון של האבחון הספציפי
    const invSnapshot = await db
      .collection("school_invitations")
      .where("diagnosisId", "==", diagnosisId)
      .get();
    const surveySnapshot = await db
      .collection("school_questionnaires")
      .where("diagnosisId", "==", diagnosisId)
      .get();

    const batch = db.batch();
    invSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
    surveySnapshot.docs.forEach((doc) => batch.delete(doc.ref));

    // 2. שליחת הודעה פנימית להורה על האיפוס
    // נשיג את ה-parentId ואת ה-childId מההזמנה שנמחקה או מהאבחון
    let parentId = "";
    let childId = "";
    if (!invSnapshot.empty) {
      const invData = invSnapshot.docs[0].data();
      parentId = invData.parentId;
      childId = invData.childId;
    } else {
      const diagDoc = await db.collection("diagnoses").doc(diagnosisId).get();
      childId = diagDoc.data()?.childId || "";
      if (childId) {
        const childDoc = await db.collection("children").doc(childId).get();
        parentId = childDoc.data()?.parentId;
      }
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

// GET /school-questionnaires/invitation/:diagnosisId
const getInvitationByDiagnosis = async (req, res) => {
  try {
    const { diagnosisId } = req.params;
    const uid = req.user.uid;

    const diagDoc = await db.collection("diagnoses").doc(diagnosisId).get();
    if (!diagDoc.exists) {
      return res.status(404).json({ error: "האבחון לא נמצא" });
    }
    const diagnosis = diagDoc.data();

    // הרשאה: אדמין / המאבחן/ת הבעל/ת האבחון (getDiagnosisAccess) / ההורה של הילד
    const access = await getDiagnosisAccess(uid, diagnosisId);
    let isAuthorized = access.ok;

    if (!isAuthorized && diagnosis.childId) {
      const childDoc = await db.collection("children").doc(diagnosis.childId).get();
      if (childDoc.exists && childDoc.data().parentId === uid) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return res.status(403).json({ error: "אין הרשאה לגשת להזמנה זו" });
    }

    const snapshot = await db
      .collection("school_invitations")
      .where("diagnosisId", "==", diagnosisId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(200).json(null); // חשוב: מחזירים null ולא שגיאה
    }

    // לעולם לא לשלוח את ה-token ללקוח - הוא מאפשר למלא/לצפות בשאלון כמורה
    const { token, ...safeInvitation } = snapshot.docs[0].data();
    res.status(200).json(safeInvitation);
  } catch (error) {
    console.error("Error in getInvitationByDiagnosis:", error);
    res.status(500).json({ error: "שגיאה בשליפת הזמנה" });
  }
};

module.exports = {
  createSchoolInvitation,
  checkInvitation,
  submitSchoolSurvey,
  saveSchoolDraft,
  getSchoolSurveyByDiagnosis,
  exportSchoolQuestionnairePDF,
  resendSchoolInvitation,
  resetSchoolInvitation,
  getInvitationByDiagnosis,
};
