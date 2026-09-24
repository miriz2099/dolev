// functions/services/diagnosisCreation.service.js
//
// הלוגיקה המשותפת לפתיחת אבחון ראשוני - מחולצת מתוך createDiagnosis
// ב-diagnosis.controller.js, כדי שגם child.controller.js יוכל להשתמש בה
// לפתיחה אוטומטית של אבחון מיד עם יצירת מטופל/ת חדש/ה.

const { db } = require("../config/firebase");

/**
 * פותחת אבחון ראשוני עבור ילד/ה: יוצרת מסמך diagnosis, פותחת את מילוי
 * שאלון ההורים, שולחת הודעה אוטומטית להורה, ויוצרת טופס הסכמה ריק.
 *
 * @param {object} params
 * @param {string} params.childId - מזהה מסמך הילד
 * @param {object} params.childData - נתוני הילד (firstName, lastName, idNumber, birthDate, parentId)
 * @param {string} params.therapistId - מזהה המאבחן/ת שפותח/ת את האבחון
 * @returns {Promise<{ diagnosisId: string, consentFormId: string }>}
 */
const openInitialDiagnosis = async ({ childId, childData, therapistId }) => {
  const batch = db.batch();

  // 1. יצירת ה-diagnosis
  const diagRef = db.collection("diagnoses").doc();
  batch.set(diagRef, {
    childId,
    therapistId,
    status: "בתהליך",
    parentQuestionnaireStatus: "פתוח",
    consentFormStatus: "pending", // 🆕 סטטוס טופס ההסכמה
    createdAt: new Date().toISOString(),
  });

  // 2. עדכון הילד - פתיחת מילוי שאלון
  const childRef = db.collection("children").doc(childId);
  batch.update(childRef, { canFillQuestionnaire: true });

  // 3. הודעה אוטומטית להורה - עדכון לכלול גם הזכרה של טופס ההסכמה
  const msgRef = db.collection("messages").doc();
  batch.set(msgRef, {
    senderId: therapistId,
    receiverId: childData.parentId,
    childId: childId,
    text: `שלום, פתחתי תהליך אבחון עבור ${childData.firstName}. נא להיכנס ללשונית "אישורים וטפסים" ולמלא את שאלון ההורים ואת טופס ההסכמה לאבחון. בהצלחה!`,
    createdAt: new Date().toISOString(),
    read: false,
  });

  // 🆕 4. יצירה אוטומטית של טופס הסכמה ריק
  const consentRef = db.collection("consent_forms").doc();
  batch.set(consentRef, {
    childId,
    diagnosisId: diagRef.id,
    therapistId,
    registeredParentId: childData.parentId,

    // snapshot של פרטי הילד מהזמן של היצירה
    childInfo: {
      fullName: `${childData.firstName} ${childData.lastName}`,
      idNumber: childData.idNumber || "",
      birthDate: childData.birthDate || "",
      schoolOrGarden: "", // ימולא ע"י ההורה בעת החתימה
    },

    // סטטוס כללי
    status: "pending", // pending | partially_signed | fully_signed

    // שני הורים - בהתחלה אף אחד לא חתום ואין הורה שני מוגדר
    parents: [
      {
        role: "registered",
        name: "", // ימולא בעת החתימה
        email: "", // ימולא אוטומטית מההורה הרשום
        signed: false,
        signedAt: null,
        signature: null,
      },
      // הורה שני יתווסף רק אם ההורה הראשון יזין את הפרטים שלו
    ],

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await batch.commit();

  return { diagnosisId: diagRef.id, consentFormId: consentRef.id };
};

module.exports = { openInitialDiagnosis };
