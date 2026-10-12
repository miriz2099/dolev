const functions = require("firebase-functions");
const { initializeApp, getApps } = require("firebase-admin/app");

if (!getApps().length) {
  initializeApp();
}

const app = require("./app");

// הייצוא של הפונקציה לאוויר
// timeoutSeconds מוגדל כדי לאפשר לניסוח מחדש קבוצתי (batch AI rephrase)
// להריץ כמה קריאות LLM ברצף בלי לפגוע ב-timeout הדיפולטי (60 שניות)
exports.api = functions.runWith({ timeoutSeconds: 300 }).https.onRequest(app);
