const { admin, auth, db } = require("../../config/firebase");

const PROJECT_ID = process.env.GCLOUD_PROJECT || "demo-dolev-test";
const AUTH_EMULATOR_HOST =
  process.env.FIREBASE_AUTH_EMULATOR_HOST || "127.0.0.1:9099";
const FIRESTORE_EMULATOR_HOST =
  process.env.FIRESTORE_EMULATOR_HOST || "127.0.0.1:8080";

/**
 * מחיקת כל הנתונים מה-Emulators (Auth + Firestore)
 */
const clearEmulators = async () => {
  try {
    await fetch(
      `http://${FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/${PROJECT_ID}/databases/(default)/documents`,
      { method: "DELETE" },
    );
    await fetch(
      `http://${AUTH_EMULATOR_HOST}/emulator/v1/projects/${PROJECT_ID}/accounts`,
      { method: "DELETE" },
    );
  } catch (err) {
    console.error("Failed to clear emulators:", err.message);
  }
};

/**
 * יצירת משתמש ב-Auth וב-Firestore
 */
const createUser = async (uid, role, extra = {}) => {
  const email = `${uid.toLowerCase()}@example.com`;
  const password = "Password123!";

  try {
    await auth.createUser({
      uid,
      email,
      password,
      displayName: uid,
    });
  } catch (err) {
    if (err.code !== "auth/uid-already-exists") {
      throw err;
    }
  }

  const userData = {
    uid,
    role,
    email,
    firstName: uid,
    lastName: "בדיקה",
    phone: "050-0000000",
    createdAt: new Date().toISOString(),
    ...extra,
  };

  await db.collection("users").doc(uid).set(userData);
  return userData;
};

/**
 * השגת ID Token מה-Auth Emulator
 */
const getIdToken = async (email, password = "Password123!") => {
  const url = `http://${AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to sign in ${email}: ${errorBody}`);
  }

  const data = await response.json();
  return data.idToken;
};

/**
 * אכלוס נתוני הבסיס של המערכת עבור בדיקות
 */
const seed = async () => {
  await clearEmulators();

  // 1. משתמשים
  await createUser("parentA", "patient", { firstName: "שרה", lastName: "כהן" });
  await createUser("parentB", "patient", { firstName: "רחל", lastName: "לוי" });
  await createUser("therapist1", "therapist", { firstName: "דנה", lastName: "רוזן" });
  await createUser("therapist2", "therapist", { firstName: "תמר", lastName: "אלוני" });
  await createUser("admin1", "admin", { firstName: "מיכל", lastName: "מנהלת" });

  const tokens = {
    parentA: await getIdToken("parenta@example.com"),
    parentB: await getIdToken("parentb@example.com"),
    therapist1: await getIdToken("therapist1@example.com"),
    therapist2: await getIdToken("therapist2@example.com"),
    admin1: await getIdToken("admin1@example.com"),
  };

  // 2. ילדים
  await db.collection("children").doc("c1").set({
    parentId: "parentA",
    therapistId: "therapist1",
    firstName: "ילד1",
    lastName: "כהן",
    idNumber: "111111111",
    birthDate: "2018-05-10",
  });

  await db.collection("children").doc("c2").set({
    parentId: "parentB",
    therapistId: "therapist2",
    firstName: "ילד2",
    lastName: "לוי",
    idNumber: "222222222",
    birthDate: "2017-08-20",
  });

  // 3. אבחונים
  await db.collection("diagnoses").doc("d1").set({
    childId: "c1",
    therapistId: "therapist1",
    status: "בתהליך",
    parentQuestionnaireStatus: "פתוח",
    consentFormStatus: "pending",
    closed: false,
    requiredAssessments: [],
    createdAt: new Date().toISOString(),
  });

  await db.collection("diagnoses").doc("d2").set({
    childId: "c2",
    therapistId: "therapist2",
    status: "בתהליך",
    parentQuestionnaireStatus: "פתוח",
    consentFormStatus: "pending",
    closed: false,
    requiredAssessments: [],
    createdAt: new Date().toISOString(),
  });

  // 4. טופס הסכמה ל-d1
  await db.collection("consent_forms").doc("cf1").set({
    childId: "c1",
    diagnosisId: "d1",
    therapistId: "therapist1",
    registeredParentId: "parentA",
    status: "pending",
    parents: [
      {
        role: "registered",
        name: "שרה כהן",
        email: "parenta@example.com",
        signed: false,
        signedAt: null,
        signature: null,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // 5. שאלון הורים ל-d1
  await db.collection("parent_questionnaires").doc("pq1").set({
    diagnosisId: "d1",
    childId: "c1",
    status: "submitted",
    submittedAt: new Date().toISOString(),
    formData: {
      childFullName: "ילד1 כהן",
      gender: "זכר",
      referralReason: "קשיי קשב וריכוז",
    },
  });

  // 6. דוח עבור d1 (טיוטה)
  await db.collection("reports").doc("rep1").set({
    diagnosisId: "d1",
    childId: "c1",
    therapistId: "therapist1",
    status: "draft",
    formData: { title: "דוח אבחון ראשוני" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // 7. הזמנות שאלון בית ספר
  const futureExpiry = new Date(Date.now() + 7 * 86400000).toISOString();
  const pastExpiry = new Date(Date.now() - 86400000).toISOString();

  await db.collection("school_invitations").doc("si_valid").set({
    token: "valid_school_token",
    diagnosisId: "d1",
    childId: "c1",
    parentId: "parentA",
    teacherEmail: "teacher@school.org",
    teacherName: "שושנה המורה",
    status: "pending",
    expiryDate: futureExpiry,
    createdAt: new Date().toISOString(),
  });

  await db.collection("school_invitations").doc("si_expired").set({
    token: "expired_school_token",
    diagnosisId: "d_expired",
    childId: "c1",
    parentId: "parentA",
    teacherEmail: "teacher@school.org",
    teacherName: "שושנה המורה",
    status: "pending",
    expiryDate: pastExpiry,
    createdAt: new Date().toISOString(),
  });

  // 7. טפסי הסכמה עם טוקן הורה שני (תקף ופג תוקף)
  await db.collection("consent_forms").doc("cf_token_valid").set({
    childId: "c1",
    diagnosisId: "d1",
    therapistId: "therapist1",
    registeredParentId: "parentA",
    status: "partially_signed",
    parents: [
      { role: "registered", name: "שרה כהן", signed: true },
      {
        role: "external",
        name: "יוסי כהן",
        email: "second@example.com",
        inviteToken: "consent_valid_token",
        inviteExpiresAt: futureExpiry,
        signed: false,
      },
    ],
  });

  await db.collection("consent_forms").doc("cf_token_expired").set({
    childId: "c1",
    diagnosisId: "d1",
    therapistId: "therapist1",
    registeredParentId: "parentA",
    status: "partially_signed",
    parents: [
      { role: "registered", name: "שרה כהן", signed: true },
      {
        role: "external",
        name: "יוסי כהן",
        email: "second@example.com",
        inviteToken: "consent_expired_token",
        inviteExpiresAt: pastExpiry,
        signed: false,
      },
    ],
  });

  return { tokens, db, auth };
};

module.exports = {
  clearEmulators,
  createUser,
  getIdToken,
  seed,
  db,
  auth,
};
