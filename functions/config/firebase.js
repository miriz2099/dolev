const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

console.log("!!! FIREBASE CONFIG LOADED !!!");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// שימי לב לשינוי כאן - אנחנו קוראים לפונקציות כדי לקבל את השירות
const auth = admin.auth();
const db = admin.firestore();

// מייצאים את השירותים המוכנים לעבודה
module.exports = { admin, auth, db };
