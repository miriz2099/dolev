// functions/services/ai/deidentify.js
//
// מסיר פרטים מזהים לפני שליחה למודל, ומחזיר אותם אחרי.
// שתי שכבות:
//   1. החלפה ממוקדת לפי פרטי הילד/המשפחה שידועים לנו מ-Firestore (מדויק).
//   2. רשת ביטחון מבוססת regex לת.ז / טלפון / מייל שהוקלדו בטקסט החופשי.
//
// ⚠️ זו הפחתת סיכון, לא ערובה. גם עם השכבה הזו, ב-production יש להשתמש
// ב-tier בתשלום של ספק ה-AI.

/** בריחה מתווים מיוחדים לפני בניית RegExp */
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * בונה מפת החלפות מתוך רשומת הילד וההורים.
 * @param {object} child - מסמך children
 * @param {object} [parent] - מסמך users של ההורה (אופציונלי)
 * @returns {Array<{value: string, token: string}>}
 */
const buildEntityMap = (child = {}, parent = {}) => {
  const candidates = [
    { value: child.firstName, token: "[שם_הנבחן]" },
    { value: child.lastName, token: "[שם_משפחה]" },
    { value: child.idNumber, token: "[ת.ז]" },
    { value: parent.firstName, token: "[שם_הורה]" },
    { value: parent.lastName, token: "[שם_משפחה_הורה]" },
    { value: parent.phone, token: "[טלפון]" },
    { value: parent.email, token: "[מייל]" },
  ];

  return (
    candidates
      .filter((c) => typeof c.value === "string" && c.value.trim().length >= 2)
      .map((c) => ({ value: c.value.trim(), token: c.token }))
      // מיון לפי אורך יורד: מונע מצב שבו "דן" מוחלף בתוך "דניאל"
      .sort((a, b) => b.value.length - a.value.length)
  );
};

/** רשת ביטחון: דפוסים מזהים שהוקלדו ידנית בטקסט */
const FALLBACK_PATTERNS = [
  { pattern: /\b\d{9}\b/g, token: "[ת.ז]" },
  { pattern: /\b0\d{1,2}-?\d{7}\b/g, token: "[טלפון]" },
  { pattern: /[\w.+-]+@[\w-]+\.[\w.]+/g, token: "[מייל]" },
];

/**
 * מסיר פרטים מזהים מהטקסט.
 * @param {string} text
 * @param {Array<{value: string, token: string}>} entityMap
 * @returns {{ text: string, replacements: Array<{token: string, value: string}> }}
 */
const redact = (text, entityMap = []) => {
  let result = text;
  const replacements = [];

  for (const { value, token } of entityMap) {
    const re = new RegExp(escapeRegex(value), "g");
    if (re.test(result)) {
      result = result.replace(re, token);
      replacements.push({ token, value });
    }
  }

  for (const { pattern, token } of FALLBACK_PATTERNS) {
    result = result.replace(pattern, token);
  }

  return { text: result, replacements };
};

/**
 * משחזר את הפרטים המקוריים בטקסט שחזר מהמודל.
 * @param {string} text
 * @param {Array<{token: string, value: string}>} replacements
 * @returns {string}
 */
const restore = (text, replacements = []) => {
  let result = text;
  for (const { token, value } of replacements) {
    result = result.split(token).join(value);
  }
  return result;
};

module.exports = { buildEntityMap, redact, restore };
