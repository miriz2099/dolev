// functions/helpers/time.helper.js

/**
 * מנרמל מחרוזת תאריך ל-naive ISO string בפורמט YYYY-MM-DDTHH:mm:ss לפי שעון ישראל.
 * תומך ב:
 * 1. naive ISO (ללא אזור זמן), למשל "2026-10-20T09:00" -> "2026-10-20T09:00:00"
 * 2. UTC ISO עם Z או offset, למשל "2026-10-20T06:00:00.000Z" -> "2026-10-20T09:00:00"
 */
const normalizeNaiveISO = (isoStr) => {
  if (!isoStr) return isoStr;

  // אם זה זמן UTC עם Z או offset, ממירים לפי שעון ישראל (Asia/Jerusalem)
  if (isoStr.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(isoStr)) {
    const date = new Date(isoStr);
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Jerusalem",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const parts = formatter.formatToParts(date);
    const getPart = (type) => parts.find((p) => p.type === type)?.value;
    const yyyy = getPart("year");
    const mm = getPart("month");
    const dd = getPart("day");
    let hh = getPart("hour");
    if (hh === "24") hh = "00";
    const min = getPart("minute");
    const ss = getPart("second");
    return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`;
  }

  // אחרת זה כבר naive ISO - רק מוודאים שניות בפורמט HH:mm:ss
  const [datePart, timePart] = isoStr.split("T");
  const parts = timePart.split(":");
  const hh = parts[0].padStart(2, "0");
  const mm = parts[1].padStart(2, "0");
  const ss = parts[2] ? parts[2].substring(0, 2).padStart(2, "0") : "00";
  return `${datePart}T${hh}:${mm}:${ss}`;
};

/**
 * הוספת דקות ל-naive ISO string ללא תלות באזור הזמן המקומי של המכונה.
 * משתמש ב-UTC כדי למנוע timezone shifts.
 */
const addMinutesToNaiveISO = (isoStr, minutesToAdd) => {
  const [datePart, timePart] = isoStr.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const timeParts = timePart.split(":");
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);
  const seconds = timeParts[2] ? parseInt(timeParts[2], 10) : 0;

  const utcMs = Date.UTC(year, month - 1, day, hours, minutes, seconds);
  const newUtcMs = utcMs + minutesToAdd * 60 * 1000;

  const d = new Date(newUtcMs);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mn = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}T${hh}:${mn}:${ss}`;
};

/**
 * חישוב הפרש בדקות בין 2 naive ISO strings
 */
const minutesDiffNaiveISO = (laterISO, earlierISO) => {
  const toUtcMs = (iso) => {
    const [datePart, timePart] = iso.split("T");
    const [y, m, d] = datePart.split("-").map(Number);
    const tp = timePart.split(":");
    const h = parseInt(tp[0], 10);
    const min = parseInt(tp[1], 10);
    const s = tp[2] ? parseInt(tp[2], 10) : 0;
    return Date.UTC(y, m - 1, d, h, min, s);
  };

  return Math.round((toUtcMs(laterISO) - toUtcMs(earlierISO)) / (60 * 1000));
};

/**
 * החזרת הזמן הנוכחי כ-naive ISO לפי timezone ישראל
 */
const getCurrentNaiveISO = () => {
  const now = new Date();
  const israelTimeStr = now.toLocaleString("sv-SE", {
    timeZone: "Asia/Jerusalem",
  });
  return israelTimeStr.replace(" ", "T");
};

module.exports = {
  normalizeNaiveISO,
  addMinutesToNaiveISO,
  minutesDiffNaiveISO,
  getCurrentNaiveISO,
};
