// // backend/src/middleware/auth.middleware.js
// const { auth, db } = require("../config/firebase");

// const verifyAdmin = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ error: "No token provided" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     // 1. אימות שהטוקן תקין ומקורי של פיירבייס
//     const decodedToken = await auth.verifyIdToken(token);
//     const uid = decodedToken.uid;

//     // 2. בדיקה ב-Firestore שהמשתמש הזה הוא אכן אדמין
//     const userDoc = await db.collection("users").doc(uid).get();
//     const userData = userDoc.data();

//     if (userData && userData.role === "admin") {
//       req.user = decodedToken; // שומרים את פרטי המשתמש להמשך
//       next(); // הכל תקין - אפשר להמשיך ללוגיקה של ה-Controller
//     } else {
//       console.log(`Access Denied: UID ${uid} is not an admin`);
//       res.status(403).json({ error: "Access denied. Admins only." });
//     }
//   } catch (error) {
//     console.error("Auth Error Detail:", error.message);
//     res.status(401).json({ error: "Invalid or expired token", details: error.message });
//   }
// };

// module.exports = { verifyAdmin };


const firebaseApp = require("../config/firebase");
const auth = firebaseApp.auth;
const db = firebaseApp.db;

const verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // אימות הטוקן מול פיירבייס
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // בדיקה במסד הנתונים שהמשתמש הוא אדמין
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();

    if (userData && userData.role === "admin") {
      req.user = decodedToken;
      next(); // אישור מעבר לביצוע הפעולה
    } else {
      console.warn(`Unauthorized access attempt by UID: ${uid}`);
      res.status(403).json({ error: "Access denied. Admins only." });
    }
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = { verifyAdmin };