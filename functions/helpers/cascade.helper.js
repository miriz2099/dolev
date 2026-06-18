// functions/helpers/cascade.helper.js
// מחיקות מדורגות (hard delete) - מקור אמת יחיד לעצי המחיקה.
// child משתמש ב-diagnosis, ו-parent משתמש ב-child.
const { db, auth } = require("../config/firebase");

// Firestore מגביל batch ל-500 פעולות. אוספים refs ומוחקים במנות.
const commitInChunks = async (refs) => {
  for (let i = 0; i < refs.length; i += 450) {
    const batch = db.batch();
    refs.slice(i, i + 450).forEach((ref) => batch.delete(ref));
    await batch.commit();
  }
};

// שליפת כל ה-refs של מסמכים בקולקשן עם field == value
const refsByQuery = async (collection, field, value) => {
  const snap = await db.collection(collection).where(field, "==", value).get();
  return snap.docs.map((d) => d.ref);
};

// ============================================
// מחיקת אבחון בודד + כל הטפסים המקושרים אליו
// ============================================
const deleteDiagnosisCascade = async (diagnosisId) => {
  const refs = [];

  for (const collection of [
    "parent_questionnaires",
    "school_questionnaires",
    "school_invitations",
    "consent_forms",
    "diary_events", // appointments שנקבעו דרך מערכת התיאום נושאים diagnosisId
  ]) {
    refs.push(...(await refsByQuery(collection, "diagnosisId", diagnosisId)));
  }

  // טיוטת שאלון ההורים נשמרת ב-doc id קבוע
  refs.push(db.collection("questionnaires").doc(`draft_${diagnosisId}`));

  // האבחון עצמו
  refs.push(db.collection("diagnoses").doc(diagnosisId));

  await commitInChunks(refs);
};

// ============================================
// מחיקת ילד + כל האבחונים והנתונים המקושרים אליו
// ============================================
const deleteChildCascade = async (childId) => {
  // 1. מחיקת כל האבחונים של הילד (כל אחד מוחק את הטפסים שלו)
  const diagSnap = await db
    .collection("diagnoses")
    .where("childId", "==", childId)
    .get();
  for (const doc of diagSnap.docs) {
    await deleteDiagnosisCascade(doc.id);
  }

  // 2. סוויפ ביטחון לפי childId - תופס מסמכים יתומים / מלפני הרפקטור
  const refs = [];
  for (const collection of [
    "messages",
    "diary_events", // appointments שנוצרו ידנית ולא קושרו ל-diagnosis
    "parent_questionnaires",
    "school_questionnaires",
    "school_invitations",
    "consent_forms",
  ]) {
    refs.push(...(await refsByQuery(collection, "childId", childId)));
  }

  // 3. הילד עצמו
  refs.push(db.collection("children").doc(childId));

  await commitInChunks(refs);
};

// ============================================
// מחיקת הורה + כל הילדים שלו + חשבון ה-Auth
// ============================================
const deleteParentCascade = async (parentId) => {
  // 1. מחיקת כל הילדים של ההורה (כל אחד מדורג)
  const childrenSnap = await db
    .collection("children")
    .where("parentId", "==", parentId)
    .get();
  for (const doc of childrenSnap.docs) {
    await deleteChildCascade(doc.id);
  }

  // 2. הודעות ששלח או קיבל ההורה
  const refs = [];
  refs.push(...(await refsByQuery("messages", "senderId", parentId)));
  refs.push(...(await refsByQuery("messages", "receiverId", parentId)));

  // 3. מסמך המשתמש ב-Firestore
  refs.push(db.collection("users").doc(parentId));

  await commitInChunks(refs);

  // 4. חשבון ה-Authentication (סובלני אם כבר נמחק)
  try {
    await auth.deleteUser(parentId);
  } catch (err) {
    console.error(`auth.deleteUser failed for ${parentId}:`, err.message);
  }
};

module.exports = {
  deleteDiagnosisCascade,
  deleteChildCascade,
  deleteParentCascade,
};
