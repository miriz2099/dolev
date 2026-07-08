// functions/controllers/report.controller.js
const { db } = require("../config/firebase");
const aiService = require("../services/ai.service");
const pdfService = require("../services/pdf.service");

/**
 * Helper: בדיקת הרשאת גישה לאבחון.
 * מותר רק למטפל שהאבחון שייך לו, או לאדמין.
 * מחזיר את נתוני האבחון כדי שנשלוף ממנו childId.
 */
const getDiagnosisAccess = async (uid, diagnosisId) => {
  const diagDoc = await db.collection("diagnoses").doc(diagnosisId).get();
  if (!diagDoc.exists) {
    return { ok: false, code: 404, error: "האבחון לא נמצא" };
  }
  const diagnosis = diagDoc.data();

  // בדיקת תפקיד המבקש (כל עוד אין Custom Claims - נשלף מ-Firestore)
  const userDoc = await db.collection("users").doc(uid).get();
  const role = userDoc.exists ? userDoc.data().role : null;

  const isAdmin = role === "admin";
  const isOwnerTherapist = diagnosis.therapistId === uid;

  if (!isAdmin && !isOwnerTherapist) {
    return { ok: false, code: 403, error: "אין הרשאה לגשת לדוח של אבחון זה" };
  }
  return { ok: true, diagnosis };
};

// GET /reports/diagnosis/:diagnosisId
// שליפת הדוח של אבחון מסוים (לטעינת טיוטה/דוח קיים לתוך הטופס)
const getReportByDiagnosis = async (req, res) => {
  try {
    const { diagnosisId } = req.params;

    const access = await getDiagnosisAccess(req.user.uid, diagnosisId);
    if (!access.ok)
      return res.status(access.code).json({ error: access.error });

    const snapshot = await db
      .collection("reports")
      .where("diagnosisId", "==", diagnosisId)
      .limit(1)
      .get();

    // חשוב: מחזירים null (ולא 404) כשעדיין אין דוח - כדי שהטופס ייפתח ריק
    if (snapshot.empty) return res.status(200).json(null);

    const doc = snapshot.docs[0];
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error in getReportByDiagnosis:", error);
    res.status(500).json({ error: "שגיאה בשליפת הדוח" });
  }
};

// POST /reports/draft
// שמירת/עדכון טיוטה (upsert לפי diagnosisId)
const saveReportDraft = async (req, res) => {
  try {
    const { diagnosisId, formData } = req.body;

    if (!diagnosisId || formData === undefined) {
      return res.status(400).json({ error: "חסר diagnosisId או formData" });
    }

    const access = await getDiagnosisAccess(req.user.uid, diagnosisId);
    if (!access.ok)
      return res.status(access.code).json({ error: access.error });

    const now = new Date().toISOString();
    const snapshot = await db
      .collection("reports")
      .where("diagnosisId", "==", diagnosisId)
      .limit(1)
      .get();

    // יצירה - אם אין עדיין דוח לאבחון הזה
    if (snapshot.empty) {
      const docRef = await db.collection("reports").add({
        diagnosisId,
        childId: access.diagnosis.childId,
        therapistId: req.user.uid,
        status: "draft",
        formData,
        createdAt: now,
        updatedAt: now,
      });
      return res.status(201).json({ id: docRef.id, message: "טיוטה נשמרה" });
    }

    // עדכון - לא נוגעים ב-status (כדי לא להפוך דוח שהושלם בחזרה לטיוטה)
    const existing = snapshot.docs[0];
    await existing.ref.update({ formData, updatedAt: now });
    res.status(200).json({ id: existing.id, message: "טיוטה עודכנה" });
  } catch (error) {
    console.error("Error in saveReportDraft:", error);
    res.status(500).json({ error: "שגיאה בשמירת הטיוטה" });
  }
};

// POST /reports/submit
// סימון הדוח כהושלם (completed)
const submitReport = async (req, res) => {
  try {
    const { diagnosisId, formData } = req.body;

    if (!diagnosisId) return res.status(400).json({ error: "חסר diagnosisId" });

    const access = await getDiagnosisAccess(req.user.uid, diagnosisId);
    if (!access.ok)
      return res.status(access.code).json({ error: access.error });

    const now = new Date().toISOString();
    const snapshot = await db
      .collection("reports")
      .where("diagnosisId", "==", diagnosisId)
      .limit(1)
      .get();

    const updatePayload = {
      status: "completed",
      updatedAt: now,
      ...(formData !== undefined ? { formData } : {}),
    };

    if (snapshot.empty) {
      const docRef = await db.collection("reports").add({
        diagnosisId,
        childId: access.diagnosis.childId,
        therapistId: req.user.uid,
        formData: formData || {},
        createdAt: now,
        ...updatePayload,
      });
      return res
        .status(201)
        .json({ id: docRef.id, message: "הדוח הושלם ונשמר" });
    }

    await snapshot.docs[0].ref.update(updatePayload);
    res.status(200).json({ id: snapshot.docs[0].id, message: "הדוח הושלם" });
  } catch (error) {
    console.error("Error in submitReport:", error);
    res.status(500).json({ error: "שגיאה בהשלמת הדוח" });
  }
};

// GET /reports
// רשימת כל הדוחות (לסליידר) - מועשרת בשם הילד והת.ז לצורך חיפוש.
// מטפל רואה את הדוחות שלו בלבד; אדמין רואה הכל.
const listReports = async (req, res) => {
  try {
    const uid = req.user.uid;
    const userDoc = await db.collection("users").doc(uid).get();
    const role = userDoc.exists ? userDoc.data().role : null;

    let query = db.collection("reports");
    if (role !== "admin") {
      query = query.where("therapistId", "==", uid);
    }
    const snapshot = await query.get();

    // העשרה בשם הילד והת.ז (כדי לאפשר חיפוש לפי שם/מזהה בסליידר)
    const reports = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        let childName = "";
        let childIdNumber = "";

        if (data.childId) {
          const childDoc = await db
            .collection("children")
            .doc(data.childId)
            .get();
          if (childDoc.exists) {
            const c = childDoc.data();
            childName = `${c.firstName} ${c.lastName}`;
            childIdNumber = c.idNumber || "";
          }
        }

        return {
          id: doc.id,
          diagnosisId: data.diagnosisId,
          childId: data.childId,
          status: data.status,
          updatedAt: data.updatedAt,
          childName,
          childIdNumber,
        };
      }),
    );

    // מיון לפי עדכון אחרון (חדש -> ישן)
    reports.sort((a, b) =>
      (b.updatedAt || "").localeCompare(a.updatedAt || ""),
    );

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error in listReports:", error);
    res.status(500).json({ error: "שגיאה בשליפת רשימת הדוחות" });
  }
};

// GET /reports/:reportId
// שליפת דוח בודד לפי ה-ID שלו (פתיחה מהסליידר)
const getReportById = async (req, res) => {
  try {
    const { reportId } = req.params;

    const doc = await db.collection("reports").doc(reportId).get();
    if (!doc.exists) return res.status(404).json({ error: "הדוח לא נמצא" });

    const data = doc.data();

    // אימות בעלות דרך האבחון המקושר
    const access = await getDiagnosisAccess(req.user.uid, data.diagnosisId);
    if (!access.ok)
      return res.status(access.code).json({ error: access.error });

    res.status(200).json({ id: doc.id, ...data });
  } catch (error) {
    console.error("Error in getReportById:", error);
    res.status(500).json({ error: "שגיאה בשליפת הדוח" });
  }
};

const generateReportSection = async (req, res) => {
  try {
    const { diagnosticId, sectionType, rawText } = req.body;

    // 1. קריאה לשירות ה-AI (ה-Controller לא יודע איזה מודל רץ מאחורי הקלעים!)
    const formattedText = await aiService.formatAssociativeNotes(
      rawText,
      sectionType,
    );

    // 2. שמירת התוצאה ב-Firestore
    // await db.collection('diagnostics').doc(diagnosticId).update({ ... });

    return res.status(200).json({ success: true, formattedText });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const downloadReportPDF = async (req, res) => {
  try {
    // Security check (Example: Only therapists or admins can export reports)
    if (req.user.role !== "therapist" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Unauthorized access to medical records." });
    }

    const { reportId } = req.params;

    // 1. Fetch data from Firestore
    const reportDoc = await db.collection("reports").doc(reportId).get();
    if (!reportDoc.exists) {
      return res.status(404).json({ error: "Report not found" });
    }

    const reportData = reportDoc.data();

    // 2. Generate PDF via our decoupled service
    const cleanHTMLResult = await pdfService.createDiagnosticPDF(reportData);

    // 3. Respond to Frontend
    res.setHeader("Content-Type", "text/html"); // בהמשך ישונה ל-application/pdf
    return res.status(200).send(cleanHTMLResult);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return res.status(500).json({ error: "Failed to generate PDF report" });
  }
};

const openReportForEditing = async (req, res) => {
  try {
    // משנים את שם המשתנה ל-diagnosisId כדי שיתאים למה שמגיע מה-Frontend
    const { reportId: diagnosisId } = req.params;

    // מחפשים את הדוח שמקושר ל-diagnosisId הזה
    const snapshot = await db
      .collection("reports")
      .where("diagnosisId", "==", diagnosisId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "הדוח לא נמצא עבור אבחון זה" });
    }

    const reportDoc = snapshot.docs[0];
    const reportData = reportDoc.data();

    // HIPAA/Security Check: אימות בעלות או אדמין
    if (req.user.role !== "admin" && reportData.therapistId !== req.user.uid) {
      return res
        .status(403)
        .json({ error: "Unauthorized to edit this report" });
    }

    // מעדכנים את הסטטוס ל-in_progress באמצעות הרפרנס של המסמך שנמצא
    await reportDoc.ref.update({
      status: "in_progress",
      updatedAt: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      message: "Report opened for editing successfully",
    });
  } catch (error) {
    console.error("Error opening report:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const exportReportToPDF = async (req, res) => {
  try {
    // משנים את שם המשתנה ל-diagnosisId
    const { reportId: diagnosisId } = req.params;

    // מחפשים את הדוח שמקושר ל-diagnosisId הזה
    const snapshot = await db
      .collection("reports")
      .where("diagnosisId", "==", diagnosisId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "הדוח לא נמצא עבור אבחון זה" });
    }

    const reportDoc = snapshot.docs[0];
    const reportData = reportDoc.data();

    // Security Check
    if (req.user.role !== "admin" && reportData.therapistId !== req.user.uid) {
      return res
        .status(403)
        .json({ error: "Unauthorized to export this report" });
    }

    // שולחים לשירות ה-PDF את ה-formData שנמצא בתוך ה-reportData
    // שימו לב: אם קובץ ה-pdf.service שלכן מצפה לתוכן של ה-Form, מומלץ להעביר את reportData.formData
    const pdfBuffer = await pdfService.generatePDFBuffer(
      reportData.formData || reportData,
    );

    // הגדרת Headers לקובץ PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=report_${diagnosisId}.pdf`,
    );

    return res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error("Error exporting PDF:", error);
    return res.status(500).json({ error: "Failed to generate PDF" });
  }
};

module.exports = {
  getReportByDiagnosis,
  saveReportDraft,
  submitReport,
  listReports,
  generateReportSection,
  getReportById,
  downloadReportPDF,
  openReportForEditing,
  exportReportToPDF,
};
