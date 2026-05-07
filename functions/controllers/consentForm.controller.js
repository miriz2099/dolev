const { db } = require("../config/firebase");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// ============================================
// Helper: יצירת nodemailer transporter
// ============================================
// 🚨 הערה: ה-credentials כאן מגיעים מ-process.env (ממליץ להעביר את כל המייל ל-.env)
// אם עדיין לא עברת - נסה לטעון מ-.env, אם לא קיים - fallback לערכים הקיימים
const createMailTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER || "***REMOVED***",
      pass: process.env.EMAIL_PASS || "***REMOVED***",
    },
  });
};

// ============================================
// 1. שליפת טופס הסכמה לפי childId (להורה הרשום ולמאבחן)
// GET /consent-forms/by-child/:childId
// ============================================
const getConsentFormByChild = async (req, res) => {
  try {
    const { childId } = req.params;
    const userId = req.user.uid;

    // אימות בעלות - הורה או מאבחן של הילד
    const childDoc = await db.collection("children").doc(childId).get();
    if (!childDoc.exists) {
      return res.status(404).json({ error: "הילד לא נמצא" });
    }
    const childData = childDoc.data();
    const isParent = childData.parentId === userId;
    const isTherapist = childData.therapistId === userId;
    if (!isParent && !isTherapist) {
      return res.status(403).json({ error: "אין הרשאה לצפות בטופס זה" });
    }

    // שליפת ה-consent form הכי עדכני (יכולים להיות כמה אם נפתחו כמה אבחונים)
    const snapshot = await db
      .collection("consent_forms")
      .where("childId", "==", childId)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(200).json(null); // עקבי עם getInvitationByChild
    }

    const formDoc = snapshot.docs[0];
    res.status(200).json({ id: formDoc.id, ...formDoc.data() });
  } catch (error) {
    console.error("Error in getConsentFormByChild:", error);
    res.status(500).json({ error: "שגיאה בשליפת טופס ההסכמה" });
  }
};

// ============================================
// 2. חתימת ההורה הרשום על הטופס
// POST /consent-forms/:formId/sign-registered
// Body: { name, email, signature, schoolOrGarden? }
// ============================================
const signByRegisteredParent = async (req, res) => {
  try {
    const { formId } = req.params;
    const { name, email, signature, schoolOrGarden } = req.body;
    const userId = req.user.uid;

    // ולידציה
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "יש להזין שם מלא" });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: "יש להזין כתובת מייל" });
    }
    if (!signature || !signature.trim()) {
      return res.status(400).json({ error: "יש להזין חתימה" });
    }

    // שליפת הטופס
    const formRef = db.collection("consent_forms").doc(formId);
    const formDoc = await formRef.get();

    if (!formDoc.exists) {
      return res.status(404).json({ error: "טופס ההסכמה לא נמצא" });
    }

    const formData = formDoc.data();

    // אבטחה: רק ההורה הרשום של הטופס יכול לחתום על החלק שלו
    if (formData.registeredParentId !== userId) {
      return res.status(403).json({ error: "אין הרשאה לחתום על טופס זה" });
    }

    // בדיקה שלא חתום כבר
    const parents = formData.parents || [];
    const registeredIdx = parents.findIndex((p) => p.role === "registered");

    if (registeredIdx === -1) {
      return res
        .status(500)
        .json({ error: "מבנה הטופס פגום - חסר רשומת הורה רשום" });
    }

    if (parents[registeredIdx].signed) {
      return res.status(409).json({ error: "ההורה הרשום כבר חתם על הטופס" });
    }

    // עדכון רשומת ההורה הרשום
    const updatedParents = [...parents];
    updatedParents[registeredIdx] = {
      ...updatedParents[registeredIdx],
      name: name.trim(),
      email: email.trim(),
      signature: signature.trim(),
      signed: true,
      signedAt: new Date().toISOString(),
    };

    // עדכון childInfo.schoolOrGarden אם נשלח (אופציונלי)
    const updatedChildInfo = { ...formData.childInfo };
    if (schoolOrGarden && schoolOrGarden.trim()) {
      updatedChildInfo.schoolOrGarden = schoolOrGarden.trim();
    }

    // קביעת סטטוס כללי חדש
    const otherParent = updatedParents.find((p) => p.role === "external");
    let newStatus;
    if (!otherParent) {
      // אין הורה שני מוגדר - ההורה הרשום חתם, צריך להחליט אם זה מספיק
      // לפי הלוגיקה שלך, סביר שצריך להזמין הורה שני אם רלוונטי
      newStatus = "partially_signed";
    } else if (otherParent.signed) {
      newStatus = "fully_signed";
    } else {
      newStatus = "partially_signed";
    }

    const batch = db.batch();

    // 1. עדכון הטופס
    batch.update(formRef, {
      parents: updatedParents,
      childInfo: updatedChildInfo,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });

    // 2. עדכון הסטטוס ב-diagnosis
    if (formData.diagnosisId) {
      const diagRef = db.collection("diagnoses").doc(formData.diagnosisId);
      batch.update(diagRef, {
        consentFormStatus: newStatus,
        updatedAt: new Date().toISOString(),
      });
    }

    // 3. אם הטופס הושלם במלואו - הודעה אוטומטית למאבחן
    if (newStatus === "fully_signed") {
      const msgRef = db.collection("messages").doc();
      batch.set(msgRef, {
        senderId: userId,
        receiverId: formData.therapistId,
        childId: formData.childId,
        text: `שלום, טופס ההסכמה לאבחון של ${formData.childInfo.fullName} הושלם וחתום ע"י שני ההורים.`,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    await batch.commit();

    res.status(200).json({
      message: "החתימה נשמרה בהצלחה",
      formId,
      status: newStatus,
    });
  } catch (error) {
    console.error("Error in signByRegisteredParent:", error);
    res.status(500).json({ error: "שגיאה בשמירת החתימה" });
  }
};

// ============================================
// 3. שליחת הזמנה להורה השני (במקרה של הורים גרושים)
// POST /consent-forms/:formId/invite-second-parent
// Body: { name, email }
// ============================================
const inviteSecondParent = async (req, res) => {
  try {
    // 🔍 דיבוג זמני
    console.log("==================================");
    console.log("🔍 ENV LOADED:");
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS length:", process.env.EMAIL_PASS?.length);
    console.log(
      "EMAIL_PASS first 4 chars:",
      process.env.EMAIL_PASS?.substring(0, 4),
    );
    console.log("==================================");
    const { formId } = req.params;
    const { name, email } = req.body;
    const userId = req.user.uid;

    // ולידציה
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "יש להזין שם מלא של ההורה השני" });
    }
    if (!email || !email.trim()) {
      return res
        .status(400)
        .json({ error: "יש להזין כתובת מייל של ההורה השני" });
    }
    // ולידציה בסיסית של מייל
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: "כתובת מייל לא תקינה" });
    }

    // שליפת הטופס
    const formRef = db.collection("consent_forms").doc(formId);
    const formDoc = await formRef.get();
    if (!formDoc.exists) {
      return res.status(404).json({ error: "טופס ההסכמה לא נמצא" });
    }

    const formData = formDoc.data();

    // אבטחה: רק ההורה הרשום של הטופס יכול להזמין הורה שני
    if (formData.registeredParentId !== userId) {
      return res
        .status(403)
        .json({ error: "אין הרשאה לשלוח הזמנה עבור טופס זה" });
    }

    // וידוא שההורה הרשום כבר חתם
    const parents = formData.parents || [];
    const registeredParent = parents.find((p) => p.role === "registered");
    if (!registeredParent || !registeredParent.signed) {
      return res.status(400).json({
        error: "יש לחתום על הטופס כהורה רשום לפני הזמנת ההורה השני",
      });
    }

    // וידוא שלא נשלחה כבר הזמנה להורה שני שעדיין לא חתם
    const existingExternal = parents.find((p) => p.role === "external");
    if (existingExternal && existingExternal.signed) {
      return res.status(409).json({ error: "ההורה השני כבר חתם על הטופס" });
    }

    // יצירת token חדש (גם אם זו שליחה חוזרת)
    const inviteToken = crypto.randomBytes(32).toString("hex");
    const now = new Date().toISOString();

    // בניית ה-parents array המעודכן
    const updatedParents = parents.filter((p) => p.role !== "external");
    updatedParents.push({
      role: "external",
      name: name.trim(),
      email: email.trim(),
      signed: false,
      signedAt: null,
      signature: null,
      inviteToken,
      inviteSentAt: now,
    });

    // שליחת המייל
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const inviteLink = `${baseUrl}/consent/${inviteToken}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER || "***REMOVED***",
        pass: process.env.SMTP_PASS || "***REMOVED***",
      },
    });

    const mailOptions = {
      from: '"מרכז האבחון" <***REMOVED***>',
      to: email.trim(),
      subject: `הסכמה לעריכת אבחון פסיכולוגי עבור ${formData.childInfo.fullName}`,
      html: `
        <div dir="rtl" style="font-family: sans-serif; text-align: right; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">שלום ${name.trim()},</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            ${registeredParent.name} פנה/תה אליך בבקשה לחתום על טופס הסכמה לעריכת אבחון פסיכולוגי עבור 
            <strong>${formData.childInfo.fullName}</strong>.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            על פי דרישות החוק, כאשר הורים גרושים או פרודים, נדרשת חתימת שני ההורים לפני תחילת תהליך האבחון.
          </p>
          <div style="margin: 35px 0; text-align: center;">
            <a href="${inviteLink}" 
               style="background-color: #7c3aed; color: white; padding: 14px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; font-size: 16px;">
              לחתימה על הטופס
            </a>
          </div>
          <p style="font-size: 14px; color: #6b7280;">
            הקישור מאובטח ואישי. אם אינך יכול/ה ללחוץ על הכפתור, ניתן להעתיק את הקישור הבא לדפדפן:
          </p>
          <p style="font-size: 13px; color: #9ca3af; word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 6px;">
            ${inviteLink}
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="font-size: 13px; color: #6b7280;">
            תודה על שיתוף הפעולה,<br/>
            צוות מרכז האבחון
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // עדכון ה-DB אחרי שליחת המייל הצליחה
    await formRef.update({
      parents: updatedParents,
      updatedAt: now,
    });

    res.status(200).json({
      message: "ההזמנה נשלחה למייל של ההורה השני בהצלחה",
      inviteLink, // לדיבאג בלבד - אפשר להסיר בפרודקשן
    });
  } catch (error) {
    console.error("Error in inviteSecondParent:", error);
    res.status(500).json({ error: "שגיאה בשליחת ההזמנה להורה השני" });
  }
};

// ============================================
// 4. שליפת טופס לפי token (ציבורי - להורה השני)
// GET /consent-forms/by-token/:token
// ============================================
const getConsentFormByToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ error: "טוקן חסר" });
    }

    // חיפוש טופס שיש לו parent עם ה-token הזה
    const snapshot = await db.collection("consent_forms").get();
    let foundForm = null;
    let externalParent = null;

    snapshot.forEach((doc) => {
      const data = doc.data();
      const external = data.parents?.find(
        (p) => p.role === "external" && p.inviteToken === token,
      );
      if (external) {
        foundForm = { id: doc.id, ...data };
        externalParent = external;
      }
    });

    if (!foundForm) {
      return res.status(404).json({
        error: "הקישור לא תקין או פג תוקפו",
      });
    }

    // אם כבר חתם - להחזיר הודעה
    if (externalParent.signed) {
      return res.status(200).json({
        alreadySigned: true,
        signedAt: externalParent.signedAt,
        childInfo: foundForm.childInfo,
        externalParent: {
          name: externalParent.name,
          email: externalParent.email,
        },
      });
    }

    // החזרת מידע מינימלי - לא חושפים פרטים פרטיים
    res.status(200).json({
      alreadySigned: false,
      formId: foundForm.id,
      childInfo: foundForm.childInfo,
      registeredParent: {
        name: foundForm.parents.find((p) => p.role === "registered")?.name,
      },
      externalParent: {
        name: externalParent.name,
        email: externalParent.email,
      },
    });
  } catch (error) {
    console.error("Error in getConsentFormByToken:", error);
    res.status(500).json({ error: "שגיאה בטעינת הטופס" });
  }
};

// ============================================
// 5. חתימה ע"י ההורה השני (ציבורי - דרך token)
// POST /consent-forms/by-token/:token/sign
// Body: { signature, agreed }
// ============================================
const signByExternalParent = async (req, res) => {
  try {
    const { token } = req.params;
    const { signature, agreed } = req.body;

    if (!signature || !signature.trim()) {
      return res.status(400).json({ error: "יש להזין חתימה" });
    }
    if (!agreed) {
      return res.status(400).json({ error: "יש לאשר את ההסכמה" });
    }

    // חיפוש הטופס לפי token
    const snapshot = await db.collection("consent_forms").get();
    let formDoc = null;
    let formData = null;

    snapshot.forEach((doc) => {
      const data = doc.data();
      const external = data.parents?.find(
        (p) => p.role === "external" && p.inviteToken === token,
      );
      if (external) {
        formDoc = doc;
        formData = data;
      }
    });

    if (!formDoc) {
      return res.status(404).json({ error: "הקישור לא תקין או פג תוקפו" });
    }

    const parents = formData.parents || [];
    const externalIdx = parents.findIndex(
      (p) => p.role === "external" && p.inviteToken === token,
    );

    if (externalIdx === -1) {
      return res.status(404).json({ error: "ההזמנה לא נמצאה" });
    }

    if (parents[externalIdx].signed) {
      return res.status(409).json({ error: "כבר חתמת על הטופס" });
    }

    // עדכון רשומת ההורה השני
    const updatedParents = [...parents];
    updatedParents[externalIdx] = {
      ...updatedParents[externalIdx],
      signed: true,
      signedAt: new Date().toISOString(),
      signature: signature.trim(),
    };

    // קביעת סטטוס חדש - כעת שני ההורים חתמו
    const registeredParent = updatedParents.find(
      (p) => p.role === "registered",
    );
    const newStatus = registeredParent?.signed
      ? "fully_signed"
      : "partially_signed";

    const batch = db.batch();

    // עדכון הטופס
    batch.update(formDoc.ref, {
      parents: updatedParents,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });

    // עדכון הסטטוס ב-diagnosis
    if (formData.diagnosisId) {
      const diagRef = db.collection("diagnoses").doc(formData.diagnosisId);
      batch.update(diagRef, {
        consentFormStatus: newStatus,
        updatedAt: new Date().toISOString(),
      });
    }

    // הודעה אוטומטית למאבחן (אם הטופס הושלם)
    if (newStatus === "fully_signed") {
      const msgRef = db.collection("messages").doc();
      batch.set(msgRef, {
        senderId: formData.registeredParentId, // נשלח בשם ההורה הרשום
        receiverId: formData.therapistId,
        childId: formData.childId,
        text: `שלום, טופס ההסכמה לאבחון של ${formData.childInfo.fullName} הושלם וחתום ע"י שני ההורים.`,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    await batch.commit();

    res.status(200).json({
      message: "החתימה נשמרה בהצלחה. תודה רבה!",
      status: newStatus,
    });
  } catch (error) {
    console.error("Error in signByExternalParent:", error);
    res.status(500).json({ error: "שגיאה בשמירת החתימה" });
  }
};

module.exports = {
  getConsentFormByChild,
  signByRegisteredParent,
  inviteSecondParent,
  getConsentFormByToken,
  signByExternalParent,
};
