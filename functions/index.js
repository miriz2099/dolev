const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

// ייבוא הראוטים מהמבנה הקיים שהעתקתן לתיקיית functions
const adminRoutes = require("./routes/admin.routes");
const inquiryRoutes = require("./routes/inquiryRoutes");
const userRoutes = require("./routes/userRoutes");
const childRoutes = require("./routes/childRoutes");
const questionnaireRoutes = require("./routes/questionnaireRoutes");
const messageRoutes = require("./routes/messageRoutes");
const diagnosisRoutes = require("./routes/diagnosisRoutes");
const schoolQuestionnaireRoutes = require("./routes/schoolQuestionnaire.routes");
const diaryRoutes = require("./routes/diary.routes");
const consentFormRoutes = require("./routes/consentForm.routes");
const reportRoutes = require("./routes/report.routes");
const { sanitizeBody } = require("./middleware/sanitize.middleware");
const { generalLimiter } = require("./middleware/rateLimiter.middleware");
const { initializeApp, getApps } = require("firebase-admin/app");

// אתחול Firebase Admin
// if (admin.apps.length === 0) {
//   admin.initializeApp();
// }

// if (!admin.apps || admin.apps.length === 0) {
//   admin.initializeApp();
// }
if (!getApps().length) {
  initializeApp();
}

const app = express();

// Middlewares
const allowedOrigins = [
  "https://dolev-8194a.web.app",
  "https://dolev-8194a.firebaseapp.com",
  "http://localhost:5173"
];


app.use(cors({ origin: allowedOrigins }));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(express.json());
app.use(sanitizeBody);
app.use(generalLimiter);

// הגדרת הראוטים בדיוק כפי שהיו
app.use("/admin", adminRoutes);
app.use("/inquiries", inquiryRoutes);
app.use("/users", userRoutes);
app.use("/children", childRoutes);
app.use("/questionnaires", questionnaireRoutes);
app.use("/messages", messageRoutes);
app.use("/diagnoses", diagnosisRoutes);

app.use("/reports", reportRoutes);
app.use("/school-questionnaires", schoolQuestionnaireRoutes);
app.use("/diary", diaryRoutes);
app.use("/consent-forms", consentFormRoutes);
// הייצוא של הפונקציה לאוויר
exports.api = functions.https.onRequest(app);
