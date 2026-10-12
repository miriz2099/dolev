// functions/middleware/sanitize.middleware.js

const { SIGNATURE_IMAGE_RE } = require("../helpers/signature.helper");

const stripTags = (str) => {
  if (typeof str !== "string") return str;
  // חתימה כתמונה (base64) - ייתכן שתכיל רצף שנראה כמו "on...=" בסופה; ניקוי
  // היה משבש את התמונה, ולכן מחרוזת כזו מוחזרת כמו שהיא.
  if (SIGNATURE_IMAGE_RE.test(str)) return str;
  return str
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
};

// פריט שהוא מחרוזת עובר stripTags, פריט שהוא מערך מטופל רקורסיבית, ופריט
// שהוא אובייקט עובר sanitizeObject - כדי שתגיות זדוניות בתוך אובייקטים/
// מערכים מקוננים בתוך מערך (למשל [{ comment: "<script>..." }]) לא יישארו
// ללא ניקוי.
const sanitizeArray = (arr) =>
  arr.map((item) => {
    if (typeof item === "string") return stripTags(item);
    if (Array.isArray(item)) return sanitizeArray(item);
    if (item && typeof item === "object") return sanitizeObject(item);
    return item;
  });

const sanitizeObject = (obj) => {
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      cleaned[key] = stripTags(value);
    } else if (Array.isArray(value)) {
      cleaned[key] = sanitizeArray(value);
    } else if (value && typeof value === "object") {
      cleaned[key] = sanitizeObject(value);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
};

const sanitizeBody = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }
  next();
};

module.exports = { sanitizeBody, stripTags };