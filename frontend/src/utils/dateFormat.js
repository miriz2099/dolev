// frontend/src/utils/dateFormat.js
//
// עזרי תאריך משותפים לכל האתר - אחידות בפורמט ישראלי (יום.חודש.שנה) בתצוגה,
// בלי לשנות את פורמט הנתונים שנשמרים (מחרוזות "YYYY-MM-DD" / "YYYY-MM-DDTHH:mm").
// חשוב: בכל מקום פה נבנה/נפרק תאריך לפי רכיבים מקומיים (getFullYear/getMonth/
// getDate וכו') ולא דרך toISOString/UTC, כדי למנוע היסט יום עקב טיימזון.

/**
 * המרת ערך גולמי (Date, מחרוזת, או Firestore Timestamp) לאובייקט Date תקין.
 * מחרוזת בפורמט YYYY-MM-DD נפרקת ידנית (לא UTC). מחרוזת אחרת - new Date רגיל.
 * @param {Date|string|{toDate: Function}} value
 * @returns {Date|null} - null אם הערך לא תקין/לא ניתן לפרש
 */
export const toDate = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  // Firestore Timestamp
  if (typeof value === "object" && typeof value.toDate === "function") {
    try {
      const date = value.toDate();
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;

    // "YYYY-MM-DD" מדויק - פירוק ידני לפי רכיבים מקומיים (בלי UTC)
    const ymdMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (ymdMatch) {
      const [, year, month, day] = ymdMatch;
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      return isNaN(date.getTime()) ? null : date;
    }

    const parsed = new Date(trimmed);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
};

/**
 * תצוגת תאריך בפורמט ישראלי (d.M.yyyy).
 * אם value הוא מחרוזת שלא ניתן לפרש - מחזירה אותה כמו שהיא, כך שערכים
 * שכבר מעוצבים (למשל "29.5.2026") לא נשברים.
 * @param {Date|string|{toDate: Function}} value
 * @param {string} [fallback=""]
 * @returns {string}
 */
export const formatDate = (value, fallback = "") => {
  const date = toDate(value);
  if (date) return date.toLocaleDateString("he-IL");
  if (typeof value === "string" && value.trim()) return value;
  return fallback;
};

/**
 * תצוגת תאריך+שעה בפורמט ישראלי (d.M.yyyy, HH:mm).
 * @param {Date|string|{toDate: Function}} value
 * @param {string} [fallback=""]
 * @returns {string}
 */
export const formatDateTime = (value, fallback = "") => {
  const date = toDate(value);
  if (!date) return fallback;
  return date.toLocaleString("he-IL", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

/**
 * תצוגת שעה בלבד (HH:mm).
 * @param {Date|string|{toDate: Function}} value
 * @param {string} [fallback=""]
 * @returns {string}
 */
export const formatTime = (value, fallback = "") => {
  const date = toDate(value);
  if (!date) return fallback;
  return date.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

/**
 * המרת Date למחרוזת "YYYY-MM-DD" לפי רכיבים מקומיים (לא toISOString).
 * @param {Date} date
 * @returns {string} - מחרוזת ריקה אם date לא תקין
 */
export const toYMD = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * המרת Date למחרוזת "YYYY-MM-DDTHH:mm" לפי רכיבים מקומיים (לא toISOString).
 * @param {Date} date
 * @returns {string} - מחרוזת ריקה אם date לא תקין
 */
export const toLocalDateTime = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
