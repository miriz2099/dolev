// frontend/src/utils/childDisplay.js
//
// עזרים משותפים לתצוגת פרטי ילד/מטופל במקומות שונים באתר (breadcrumbs,
// כרטיסי הקשר, רשימות). המטרה: לעולם לא להציג "undefined" או "·" מיותר
// כשמידע חסר - כל פונקציה מחזירה מחרוזת ריקה/null אם אין מה להציג.

import { toDate } from "./dateFormat";

/**
 * שם מלא של הילד/ה, או מחרוזת ריקה אם אין שם כלל.
 * @param {object} childData
 * @returns {string}
 */
export const childFullName = (childData) => {
  if (!childData) return "";
  return `${childData.firstName || ""} ${childData.lastName || ""}`.trim();
};

/**
 * גיל בשנים מתוך תאריך לידה, או null אם אין תאריך לידה תקין.
 * @param {string|Date} birthDate
 * @returns {number|null}
 */
export const childAgeYears = (birthDate) => {
  const date = toDate(birthDate);
  if (!date) return null;

  const now = new Date();
  let age = now.getFullYear() - date.getFullYear();
  const hadBirthdayThisYear =
    now.getMonth() > date.getMonth() ||
    (now.getMonth() === date.getMonth() && now.getDate() >= date.getDate());
  if (!hadBirthdayThisYear) age -= 1;

  return age >= 0 ? age : null;
};

/**
 * "כיתה · בית ספר" - מציגה רק את החלקים שבאמת קיימים, בלי "·" מיותר
 * כשאחד מהם חסר.
 * @param {object} data - אובייקט שעשוי להכיל grade / school / schoolOrGarden
 * @returns {string}
 */
export const childGradeSchoolLabel = (data) => {
  if (!data) return "";
  const parts = [data.grade, data.schoolOrGarden || data.school].filter(
    (p) => p && String(p).trim(),
  );
  return parts.join(" · ");
};
