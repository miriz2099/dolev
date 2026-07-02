// functions/middleware/rateLimiter.middleware.js
const rateLimit = require("express-rate-limit");

// הגבלה כללית - 100 בקשות לדקה לכל IP
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // דקה אחת
  max: 100,
  message: { error: "יותר מדי בקשות, נסה שוב בעוד דקה" },
  standardHeaders: true,
  legacyHeaders: false,
});

// הגבלה מחמירה לנתיבים ציבוריים (בלי אימות)
// למשל: consent form by token, school questionnaire
const publicRouteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 דקות
  max: 20,
  message: { error: "יותר מדי בקשות, נסה שוב מאוחר יותר" },
  standardHeaders: true,
  legacyHeaders: false,
});

// הגבלה להודעות - מונע ספאם
const messageLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // דקה אחת
  max: 15,
  message: { error: "שלחת יותר מדי הודעות, נסה שוב בעוד דקה" },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { generalLimiter, publicRouteLimiter, messageLimiter };