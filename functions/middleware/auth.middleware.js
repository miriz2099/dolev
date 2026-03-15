const firebaseApp = require("../config/firebase");
const auth = firebaseApp.auth;
const db = firebaseApp.db;

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken; // שומרים את פרטי המשתמש (כולל uid) להמשך
    next();
  } catch (error) {
    console.error("Token Verification Error:", error.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

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

module.exports = { verifyAdmin, verifyToken };
