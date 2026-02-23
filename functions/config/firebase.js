
// const admin = require("firebase-admin");
// // const serviceAccount = require("../serviceAccountKey.json"); 
// const path = require('path');
// const serviceAccount = require(path.join(__dirname, '..', 'serviceAccountKey.json'));

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
//   });
// }

// // ייצוא מפורט של השירותים
// const auth = admin.auth();
// const db = admin.firestore();

// module.exports = { admin, auth, db };



const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

console.log("!!! FIREBASE CONFIG LOADED !!!");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// שימי לב לשינוי כאן - אנחנו קוראים לפונקציות כדי לקבל את השירות
const auth = admin.auth(); 
const db = admin.firestore();

// מייצאים את השירותים המוכנים לעבודה
module.exports = { admin, auth, db };