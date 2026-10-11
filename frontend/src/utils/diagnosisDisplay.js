// frontend/src/utils/diagnosisDisplay.js
//
// עזרים משותפים לתצוגת תווית/סטטוס אבחון - כדי שהמשתמש ידע "באיזה אבחון
// מדובר" בכל מקום (breadcrumbs, כרטיסים, סרגל הקשר בטופס הדוח).

import { formatDate } from "./dateFormat";

/**
 * תווית קצרה לאבחון, למשל "אבחון 2 מתוך 3 · 14.3.2026".
 * אם יש רק אבחון אחד לילד, לא מציגים "1 מתוך 1" - רק "אבחון".
 * @param {object} diagnosis
 * @param {object} [opts]
 * @param {number} [opts.index] - אינדקס (0-based) ברשימה הממוינת
 * @param {number} [opts.total] - סה"כ אבחונים לילד זה
 * @returns {string}
 */
export const diagnosisLabel = (diagnosis, { index, total } = {}) => {
  if (!diagnosis) return "";
  const dateLabel = diagnosis.createdAt ? formatDate(diagnosis.createdAt) : "";
  const numberPart =
    total && total > 1 && typeof index === "number"
      ? `אבחון ${index + 1} מתוך ${total}`
      : "אבחון";
  return dateLabel ? `${numberPart} · ${dateLabel}` : numberPart;
};

/**
 * תווית סטטוס לאבחון (לתגית/badge) - "סגור" גובר על status הגולמי.
 * @param {object} diagnosis
 * @returns {string}
 */
export const diagnosisStatusLabel = (diagnosis) => {
  if (!diagnosis) return "";
  if (diagnosis.closed) return "סגור";
  return diagnosis.status || "פעיל";
};
