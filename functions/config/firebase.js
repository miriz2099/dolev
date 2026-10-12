// const admin = require("firebase-admin");
// const serviceAccount = require("../serviceAccountKey.json");

// console.log("!!! FIREBASE CONFIG LOADED !!!");

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// // שימי לב לשינוי כאן - אנחנו קוראים לפונקציות כדי לקבל את השירות
// const auth = admin.auth();
// const db = admin.firestore();

// // מייצאים את השירותים המוכנים לעבודה
// module.exports = { admin, auth, db };

const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const admin = require("firebase-admin");
if (!getApps().length) {
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    initializeApp({
      projectId: process.env.GCLOUD_PROJECT || "demo-dolev-test",
    });
  } else {
    const serviceAccount = require("../serviceAccountKey.json");
    initializeApp({
      credential: cert(serviceAccount),
    });
  }
}

const auth = getAuth();
const db = getFirestore();

module.exports = { admin, auth, db };