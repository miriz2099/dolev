const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
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

// אתחול Firebase Admin
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const app = express();

// Middlewares
app.use(cors({ origin: true })); // origin: true קריטי לעבודה מול דומיינים שונים
app.use(express.json());

// הגדרת הראוטים בדיוק כפי שהיו
app.use("/admin", adminRoutes);
app.use("/inquiries", inquiryRoutes);
app.use("/users", userRoutes);
app.use("/children", childRoutes);
app.use("/questionnaires", questionnaireRoutes);
app.use("/messages", messageRoutes);
app.use("/diagnoses", diagnosisRoutes);

app.use("/school-questionnaires", schoolQuestionnaireRoutes);
app.use("/diary", diaryRoutes);

// הייצוא של הפונקציה לאוויר
exports.api = functions.https.onRequest(app);
