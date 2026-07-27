// // functions/middleware/rateLimiter.middleware.js
// const rateLimit = require("express-rate-limit");

// // הגבלה כללית - 100 בקשות לדקה לכל IP
// const generalLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // דקה אחת
//   max: 100,
//   message: { error: "יותר מדי בקשות, נסה שוב בעוד דקה" },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// // הגבלה מחמירה לנתיבים ציבוריים (בלי אימות)
// // למשל: consent form by token, school questionnaire
// const publicRouteLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 דקות
//   max: 20,
//   message: { error: "יותר מדי בקשות, נסה שוב מאוחר יותר" },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// // הגבלה להודעות - מונע ספאם
// const messageLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // דקה אחת
//   max: 15,
//   message: { error: "שלחת יותר מדי הודעות, נסה שוב בעוד דקה" },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// const aiLimiter = rateLimit({
//   windowMs: 60 * 1000,
//   max: 5,
//   // מגבילים לפי משתמש ולא לפי IP - כמה מאבחנות באותו קליניקה
//   // יוצאות מאותה כתובת ואסור שיחסמו זו את זו
//   keyGenerator: (req) => req.user?.uid || req.ip,
//   message: { error: "יותר מדי בקשות ניסוח. המתיני דקה ונסי שוב." },
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// module.exports = {
//   generalLimiter,
//   publicRouteLimiter,
//   messageLimiter,
//   aiLimiter,
// };

// functions/middleware/rateLimiter.middleware.js
const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");

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

// הגבלה לקריאות AI - יקרות ומוגבלות במכסה יומית אצל הספק.
// מגבילים לפי משתמש ולא לפי IP: כמה מאבחנות באותה קליניקה יוצאות
// מאותה כתובת, ואסור שאחת תחסום את השנייה.
const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // דקה אחת
  max: 5,
  keyGenerator: (req) => req.user?.uid || ipKeyGenerator(req.ip),
  message: { error: "יותר מדי בקשות ניסוח. המתיני דקה ונסי שוב." },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  publicRouteLimiter,
  messageLimiter,
  aiLimiter,
};
