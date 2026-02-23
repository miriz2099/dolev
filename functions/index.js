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

// הייצוא של הפונקציה לאוויר
exports.api = functions.https.onRequest(app);