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
const serviceAccount = require("../serviceAccountKey.json");

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const auth = getAuth();
const db = getFirestore();

module.exports = { admin, auth, db };