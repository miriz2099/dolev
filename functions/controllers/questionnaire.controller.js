// functions/controllers/questionnaire.controller.js
const { db } = require("../config/firebase"); // ה-DB המאותחל מהקונפיג
const admin = require("firebase-admin");

const submitQuestionnaire = async (req, res) => {
  try {
    console.log("Received questionnaire submission:", req.body);
    const { childId, formData } = req.body;
    const parentId = req.user.uid; // מגיע מה-Auth Middleware

    if (!childId || !formData) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const batch = db.batch();

    // 1. יצירת מסמך שאלון חדש
    const questionnaireRef = db.collection("questionnaires").doc();
    batch.set(questionnaireRef, {
      childId,
      parentId,
      formData,
      status: "submitted",
      submittedAt: new Date(),
    });

    // 2. עדכון סטטוס הילד/אבחון
    const patientRef = db.collection("children").doc(childId);
    batch.update(patientRef, {
      status: "form_submitted",
      lastUpdate: new Date(),
    });

    // 3. מחיקת הטיוטה
    // const draftRef = db.collection("questionnaires").doc(`draft_${childId}`);
    // batch.delete(draftRef);

    await batch.commit();

    res.status(201).json({
      message: "Questionnaire submitted successfully",
      id: questionnaireRef.id,
    });
  } catch (error) {
    console.error("Error in submitQuestionnaire:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const saveDraft = async (req, res) => {
  try {
    const { childId, formData } = req.body;
    const parentId = req.user.uid; // חילוץ ה-UID מהטוקן ע"י ה-Middleware

    if (!childId) {
      return res.status(400).json({ message: "Missing childId" });
    }

    // שמירה/עדכון של טיוטה ספציפית לילד
    // אנחנו משתמשים ב-ID קבוע לטיוטה כדי שלא ייווצרו כפילויות
    const draftId = `draft_${childId}`;

    await db.collection("questionnaires").doc(draftId).set(
      {
        childId,
        parentId,
        formData,
        status: "draft",
        updatedAt: new Date(),
      },
      { merge: true },
    );

    res.status(200).json({ message: "Draft saved successfully" });
  } catch (error) {
    console.error("Error saving draft:", error);
    res
      .status(500)
      .json({ message: "Error saving draft", error: error.message });
  }
};

const getDraft = async (req, res) => {
  try {
    const { childId } = req.params; // נקבל את ה-ID מה-URL
    const draftId = `draft_${childId}`;
    const draftDoc = await db.collection("questionnaires").doc(draftId).get();

    if (!draftDoc.exists) {
      return res.status(404).json({ message: "No draft found" });
    }

    res.status(200).json(draftDoc.data());
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching draft", error: error.message });
  }
};

module.exports = { submitQuestionnaire, saveDraft, getDraft };
