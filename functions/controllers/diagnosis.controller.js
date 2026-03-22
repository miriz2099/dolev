// // const { db } = require("../config/firebase");

// // // פתיחת אבחון חדש
// // const createDiagnosis = async (req, res) => {
// //   try {
// //     const { childId } = req.body;
// //     const therapistId = req.user.uid;

// //     const newDiagnosis = {
// //       childId,
// //       therapistId,
// //       status: "בתהליך",
// //       parentQuestionnaireStatus: "פתוח",
// //       createdAt: new Date().toISOString(),
// //     };

// //     const docRef = await db.collection("diagnoses").add(newDiagnosis);
// //     res.status(201).json({ id: docRef.id, ...newDiagnosis });
// //   } catch (error) {
// //     res.status(500).json({ error: "Failed to create diagnosis" });
// //   }
// // };

// // // עדכון סטטוס שאלון (למשל כשנשלח או כשמוחזר לתיקון)
// // const updateQuestionnaireStatus = async (req, res) => {
// //   try {
// //     const { diagnosisId } = req.params;
// //     const { status } = req.body; // "פתוח" / "לתיקון" / "נשלח"

// //     await db.collection("diagnoses").doc(diagnosisId).update({
// //       parentQuestionnaireStatus: status,
// //     });

// //     res.status(200).json({ message: "סטטוס שאלון עודכן" });
// //   } catch (error) {
// //     res.status(500).json({ error: "Failed to update status" });
// //   }
// // };

// // module.exports = {
// //   createDiagnosis,
// //   updateQuestionnaireStatus,
// // };

// const { db } = require("../config/firebase");

// // 1. יצירת אבחון חדש (מופעל ע"י מאבחן)

// const createDiagnosis = async (req, res) => {
//   try {
//     const { childId } = req.body;
//     const therapistId = req.user.uid; // המאבחן המחובר

//     if (!childId) return res.status(400).json({ error: "Child ID is missing" });

//     // 1. שליפת פרטי הילד כדי לקבל את ה-parentId עבור ההודעה
//     const childDoc = await db.collection("children").doc(childId).get();
//     if (!childDoc.exists)
//       return res.status(404).json({ error: "Child not found" });
//     const childData = childDoc.data();

//     const batch = db.batch();

//     // 2. יצירת מסמך אבחון חדש
//     const diagRef = db.collection("diagnoses").doc();
//     batch.set(diagRef, {
//       childId,
//       therapistId,
//       status: "בתהליך",
//       parentQuestionnaireStatus: "פתוח",
//       createdAt: new Date().toISOString(),
//     });

//     // 3. עדכון הילד - פתיחת האפשרות למלא שאלון
//     const childRef = db.collection("children").doc(childId);
//     batch.update(childRef, { canFillQuestionnaire: true });

//     // 4. יצירת הודעה אוטומטית מהמאבחן להורה
//     const msgRef = db.collection("messages").doc();
//     batch.set(msgRef, {
//       senderId: therapistId,
//       receiverId: childData.parentId,
//       childId: childId,
//       text: `שלום, פתחתי תהליך אבחון עבור ${childData.firstName}. נא להיכנס ללשונית "אישורים וטפסים" ולמלא את שאלון ההורים. בהצלחה!`,
//       createdAt: new Date().toISOString(),
//       read: false,
//     });

//     await batch.commit();

//     res.status(201).json({ message: "Diagnosis opened and notification sent" });
//   } catch (error) {
//     console.error("Error in createDiagnosis:", error);
//     res.status(500).json({ error: "Failed to open diagnosis" });
//   }
// };

// // 2. שליפת כל האבחונים של ילד מסוים
// const getDiagnosesByChild = async (req, res) => {
//   try {
//     const { childId } = req.params;

//     const snapshot = await db
//       .collection("diagnoses")
//       .where("childId", "==", childId)
//       .orderBy("createdAt", "desc")
//       .get();

//     const diagnoses = [];
//     snapshot.forEach((doc) => {
//       diagnoses.push({ id: doc.id, ...doc.data() });
//     });

//     res.status(200).json(diagnoses);
//   } catch (error) {
//     console.error("Error fetching diagnoses:", error);
//     res.status(500).json({ error: "כשל בשליפת אבחונים" });
//   }
// };

// // 3. עדכון סטטוס שאלון (למשל: נשלח / לתיקון)
// const updateQuestionnaireStatus = async (req, res) => {
//   try {
//     const { diagnosisId } = req.params;
//     const { childId, status } = req.body; // יקבל "פתוח", "נשלח" או "לתיקון"

//     if (!status) {
//       return res.status(400).json({ error: "סטטוס חסר" });
//     }

//     await db.collection("diagnoses").doc(diagnosisId).update({
//       parentQuestionnaireStatus: status,
//       updatedAt: new Date().toISOString(),
//     });

//     res.status(200).json({ message: "סטטוס שאלון עודכן בהצלחה" });
//   } catch (error) {
//     console.error("Error updating status:", error);
//     res.status(500).json({ error: "כשל בעדכון הסטטוס" });
//   }
// };
// const submitQuestionnaire = async (req, res) => {
//   try {
//     const { childId, formData } = req.body;
//     const parentId = req.user.uid;

//     const batch = db.batch();

//     // 1. שמירת השאלון הסופי
//     const questionnaireRef = db
//       .collection("parent_questionnaires")
//       .doc(childId);
//     batch.set(questionnaireRef, {
//       childId,
//       parentId,
//       formData,
//       submittedAt: new Date().toISOString(),
//     });

//     // 2. מציאת האבחון הפעיל ועדכון הסטטוס שלו ל"נשלח"
//     const diagnosesSnapshot = await db
//       .collection("diagnoses")
//       .where("childId", "==", childId)
//       .where("status", "==", "בתהליך")
//       .limit(1)
//       .get();

//     if (!diagnosesSnapshot.empty) {
//       const diagDoc = diagnosesSnapshot.docs[0];
//       batch.update(diagDoc.ref, {
//         parentQuestionnaireStatus: "נשלח",
//       });
//     }

//     // 3. עדכון הילד - נעילת האפשרות למלא שוב
//     const childRef = db.collection("children").doc(childId);
//     batch.update(childRef, { canFillQuestionnaire: false });

//     await batch.commit();
//     res.status(200).json({ message: "Submitted successfully and locked" });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to submit" });
//   }
// };

// module.exports = {
//   createDiagnosis,
//   getDiagnosesByChild,
//   updateQuestionnaireStatus,
//   submitQuestionnaire,
// };

const { db } = require("../config/firebase");

// 1. יצירת אבחון חדש (מופעל ע"י מאבחן)
const createDiagnosis = async (req, res) => {
  try {
    const { childId } = req.body;
    const therapistId = req.user.uid;

    if (!childId) return res.status(400).json({ error: "Child ID is missing" });

    const childDoc = await db.collection("children").doc(childId).get();
    if (!childDoc.exists)
      return res.status(404).json({ error: "Child not found" });
    const childData = childDoc.data();

    const batch = db.batch();

    const diagRef = db.collection("diagnoses").doc();
    batch.set(diagRef, {
      childId,
      therapistId,
      status: "בתהליך",
      parentQuestionnaireStatus: "פתוח",
      createdAt: new Date().toISOString(),
    });

    const childRef = db.collection("children").doc(childId);
    batch.update(childRef, { canFillQuestionnaire: true });

    const msgRef = db.collection("messages").doc();
    batch.set(msgRef, {
      senderId: therapistId,
      receiverId: childData.parentId,
      childId: childId,
      text: `שלום, פתחתי תהליך אבחון עבור ${childData.firstName}. נא להיכנס ללשונית "אישורים וטפסים" ולמלא את שאלון ההורים. בהצלחה!`,
      createdAt: new Date().toISOString(),
      read: false,
    });

    await batch.commit();
    res.status(201).json({ message: "Diagnosis opened and notification sent" });
  } catch (error) {
    console.error("Error in createDiagnosis:", error);
    res.status(500).json({ error: "Failed to open diagnosis" });
  }
};

// 2. שליפת כל האבחונים של ילד מסוים
const getDiagnosesByChild = async (req, res) => {
  try {
    const { childId } = req.params;
    const snapshot = await db
      .collection("diagnoses")
      .where("childId", "==", childId)
      .orderBy("createdAt", "desc")
      .get();

    const diagnoses = [];
    snapshot.forEach((doc) => {
      diagnoses.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(diagnoses);
  } catch (error) {
    console.error("Error fetching diagnoses:", error);
    res.status(500).json({ error: "כשל בשליפת אבחונים" });
  }
};

// 3. עדכון סטטוס שאלון (למשל: נשלח / לתיקון) - מתוקן עם פתיחת הילד!
const updateQuestionnaireStatus = async (req, res) => {
  try {
    const { diagnosisId } = req.params;
    const { childId, status } = req.body; // סטטוס יכול להיות "פתוח", "נשלח" או "לתיקון"

    if (!status || !childId) {
      return res.status(400).json({ error: "סטטוס או מזהה ילד חסרים" });
    }

    const batch = db.batch();

    // א. עדכון האבחון עצמו
    const diagRef = db.collection("diagnoses").doc(diagnosisId);
    batch.update(diagRef, {
      parentQuestionnaireStatus: status,
      updatedAt: new Date().toISOString(),
    });

    // ב. אם הסטטוס הוא "לתיקון" או "פתוח" - אנחנו פותחים את המנעול בטבלת הילד
    if (status === "לתיקון" || status === "פתוח") {
      const childRef = db.collection("children").doc(childId);
      batch.update(childRef, { canFillQuestionnaire: true });
    }

    await batch.commit();
    res
      .status(200)
      .json({ message: `סטטוס השאלון עודכן ל-${status} והשאלון נפתח למילוי` });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "כשל בעדכון הסטטוס" });
  }
};

// 4. שליחת השאלון ע"י ההורה (נועל את האפשרות למלא שוב)
const submitQuestionnaire = async (req, res) => {
  try {
    const { childId, formData } = req.body;
    const parentId = req.user.uid;

    const batch = db.batch();

    const questionnaireRef = db
      .collection("parent_questionnaires")
      .doc(childId);
    batch.set(questionnaireRef, {
      childId,
      parentId,
      formData,
      submittedAt: new Date().toISOString(),
    });

    const diagnosesSnapshot = await db
      .collection("diagnoses")
      .where("childId", "==", childId)
      .where("status", "==", "בתהליך")
      .limit(1)
      .get();

    if (!diagnosesSnapshot.empty) {
      const diagDoc = diagnosesSnapshot.docs[0];
      batch.update(diagDoc.ref, {
        parentQuestionnaireStatus: "נשלח",
      });
    }

    const childRef = db.collection("children").doc(childId);
    batch.update(childRef, { canFillQuestionnaire: false });

    await batch.commit();
    res.status(200).json({ message: "Submitted successfully and locked" });
  } catch (error) {
    console.error("Error in submitQuestionnaire:", error);
    res.status(500).json({ error: "Failed to submit" });
  }
};

// שליפת תשובות שאלון הורים עבור ילד מסוים
const getParentQuestionnaireAnswers = async (req, res) => {
  try {
    const { childId } = req.params;
    // שליפת המסמך שבו נשמר השאלון הסופי
    const doc = await db.collection("parent_questionnaires").doc(childId).get();

    if (!doc.exists) {
      return res
        .status(404)
        .json({ error: "טרם מולא שאלון הורים עבור ילד זה" });
    }

    res.status(200).json(doc.data());
  } catch (error) {
    res.status(500).json({ error: "נכשלה שליפת השאלון" });
  }
};

module.exports = {
  createDiagnosis,
  getDiagnosesByChild,
  updateQuestionnaireStatus,
  submitQuestionnaire,
  getParentQuestionnaireAnswers,
};
