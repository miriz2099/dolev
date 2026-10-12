// functions/helpers/time.helper.js
//
// Helpers משותפים לעבודה עם "naive ISO" - המוסכמה בכל המערכת: זמנים
// נשמרים כמחרוזת "YYYY-MM-DDTHH:mm:ss" בשעון ישראל, בלי timezone suffix.
// לכן אסור להשתמש ב-new Date()/toISOString() על המחרוזות האלה בלי לעבור
// דרך ה-helpers האלה - זה יוצר timezone shift לפי שעון השרת שמריץ את הקוד.

/**
 * true אם למחרוזת יש Z או offset (למשל "...Z" או "...+03:00") - כלומר
 * היא לא naive ודורשת המרה לשעון ישראל לפני שמשתמשים בה.
 */
const hasTimezoneInfo = (isoStr) => /Z$|[+-]\d{2}:\d{2}$/.test(isoStr);

/**
 * נורמליזציה לפורמט אחיד "YYYY-MM-DDTHH:mm:ss" (19 תווים, בלי מילישניות):
 * - מחרוזת עם Z/offset (למשל "2026-10-20T06:00:00.000Z"): מומרת לשעון
 *   ישראל (גם אירועים ישנים שנשמרו כך יפורשו נכון, בלי מיגרציה).
 * - מחרוזת naive (למשל "2026-05-10T17:30"): מנורמלת כמו היום -
 *   "2026-05-10T17:30:00".
 * חיוני להשוואות string-based שיהיו עקביות (למשל availability עם 16
 * תווים vs slot מחושב עם 19 תווים).
 */
const normalizeNaiveISO = (isoStr) => {
  if (!isoStr) return isoStr;

  if (hasTimezoneInfo(isoStr)) {
    return new Date(isoStr)
      .toLocaleString("sv-SE", { timeZone: "Asia/Jerusalem" })
      .replace(" ", "T");
  }

  const [datePart, timePart] = isoStr.split("T");
  const parts = timePart.split(":");
  const hh = parts[0].padStart(2, "0");
  const mm = parts[1].padStart(2, "0");
  const ss = parts[2] ? parts[2].padStart(2, "0") : "00";
  return `${datePart}T${hh}:${mm}:${ss}`;
};

/**
 * הוספת דקות ל-naive ISO string
 * "2026-05-10T09:00:00" + 90 דקות => "2026-05-10T10:30:00"
 * משתמש ב-Date.UTC כאריתמטיקה בלבד (לא כ"זמן UTC אמיתי") כדי להימנע
 * מ-timezone shift של השרת, ובכוונה "עיוור" ל-DST - כך ששעה "09:00"
 * נשארת "09:00" גם אחרי מעבר שעון חורף/קיץ באמצע הטווח.
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
 * minutesDiffNaiveISO("...T10:30", "...T09:00") = 90
 */
const minutesDiffNaiveISO = (laterISO, earlierISO) => {
  const toUtcMs = (iso) => {
    const [datePart, timePart] = iso.split("T");
    const [y, m, d] = datePart.split("-").map(Number);
    const tp = timePart.split(":");
    return Date.UTC(
      y,
      m - 1,
      d,
      parseInt(tp[0], 10),
      parseInt(tp[1], 10),
      tp[2] ? parseInt(tp[2], 10) : 0,
    );
  };
  return (toUtcMs(laterISO) - toUtcMs(earlierISO)) / (60 * 1000);
};

/**
 * החזרת הזמן הנוכחי כ-naive ISO לפי timezone ישראל
 * (כי ה-events נשמרים לפי שעון מקומי ישראלי)
 */
const getCurrentNaiveISO = () => {
  const now = new Date();
  // sv-SE format: "2026-05-10 16:30:45"
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
