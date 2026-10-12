# ריכוז ממצאי בדיקות ובאגים שהתגלו במערכת "דולב" (Bugs & Security Findings)

מסמך זה מתעד את כלל הפגמים, פגיעויות האבטחה ומקרי הקצה שהתגלו במהלך כתיבת והרצת מערך הבדיקות האוטומטיות (יחידה, אינטגרציה, וחוקי אבטחה) של מערכת "דולב".

בהתאם לעקרונות ההנדסיים שהוגדרו לפרויקט, באגים בקוד המוצר לא תוקנו בצורה עיוורת: בשלב הראשון כוסו באמצעות בדיקות ייעודיות המסומנות כ-`test.failing` (או תועדו כפגמים בחוקי אבטחה), למעט תיקונים תשתיתיים שאושרו במפורש (מודול ההתממה `deidentify.js`). בשלב מאוחר יותר, לאחר אישור מפורש, שלושת הבאגים שתועדו בסעיף 2 (BUG-03, BUG-04, BUG-05) תוקנו בקוד המוצר, והבדיקות המתאימות הוסרו מ-`test.failing` והפכו לבדיקות `it` רגילות שעוברות בפועל. הממצא היחיד שנותר פתוח הוא זה בחוקי אחסון ה-Storage (סעיף 3), שלא תוקן מכיוון שהרצת הבדיקות אימתה שהוא עדיין קיים במציאות (ולא, כפי שהונח בטעות, שהוא ממצא שגוי).

---

## 1. באגים שתוקנו במודול ההתממה (`deidentify.js`)

מודול `functions/services/ai/deidentify.js` אחראי להתממת (Redaction) פרטי זיהוי אישיים (PII) בטקסטים קליניים טרם העברתם למודל השפה (Google Gemini), בהתאם לחוק הגנת הפרטיות, התשמ"א-1981.

### ממצא 1.1: כשל בגבולות מילה בעברית ותחיליות שימוש (Hebrew Prefixes & Word Boundaries)
* **תיאור הכשל:** 
  המימוש המקורי התבסס על החלפת מחרוזות גנרית או על גבול מילה תקני (`\b`). ב-JavaScript RegExp, התו `\b` מוגדר מול `\w` (הכולל תווים לטיניים בלבד: `[a-zA-Z0-9_]`). כתוצאה מכך:
  1. שמות קצרים כמו "טל" הוחלפו בתוך מילים נפוצות (כגון "טלפון" -> "[שם_הנבחן]פון").
  2. אותיות יחס ותחיליות שימוש בעברית (ו, ה, ב, ל, מ, ש, כ - "משכלה וכלב") לא זוהו, כך שביטויים כגון "לנועה", "מהילד", "שההורה" לא הותממו והפרט המזהה נשלח לספק החיצוני.
* **התיקון שבוצע:**
  הוגדר טווח אותיות עבריות ולטיניות מלא (`[\u05D0-\u05EAa-zA-Z]`), שולב זיהוי תחיליות עבריות (`[\u05D5\u05D4\u05D1\u05DC\u05DE\u05E9\u05DB]{0,2}`), וההחלפה מתבצעת תוך שימור התחילית והסוואת השם בלבד.

#### השוואת קוד (Before vs. After):
```javascript
// BEFORE:
for (const { value, token } of entityMap) {
  // החלפה פשוטה ללא התחשבות בגבול מילה עברי או אותיות יחס
  result = result.split(value).join(token);
}

// AFTER:
const LETTERS = "\\u05D0-\\u05EAa-zA-Z";
const PREFIX = "[\\u05D5\\u05D4\\u05D1\\u05DC\\u05DE\\u05E9\\u05DB]{0,2}";

for (const { value, token } of entityMap) {
  const re = new RegExp(
    `(^|[^${LETTERS}])(${PREFIX})${escapeRegex(value)}(?=$|[^${LETTERS}])`,
    "g"
  );
  if (re.test(result)) {
    result = result.replace(re, `$1$2${token}`);
    if (!replacements.some((r) => r.token === token && r.value === value)) {
      replacements.push({ token, value });
    }
  }
}
```

### ממצא 1.2: כיסוי חלקי ברשת הביטחון למספרי טלפון ישראליים וכתובות דוא"ל
* **תיאור הכשל:**
  דפוס ה-Fallback לטלפונים כיסה רק פורמט יחיד (`05X-XXXXXXX`). מספרי טלפון בפורמטים שכיחים בישראל (ללא מקף: `0501234567`, טלפונים קוויים: `03-1234567`, או קידומת בינלאומית `+972-50-1234567`) לא זוהו. כמו כן, כתובות דוא"ל עם אותיות רישיות (למשל `User@Test.Co.il`) לא הותממו עקב היעדר דגל `i`.
* **התיקון שבוצע:**
  הרחבת רגולקס הטלפונים לתמיכה בכלל הקידומות הישראליות (02, 03, 04, 08, 09, 05X, 07X) ופורמט בינלאומי `+972`, והוספת דגל Case-Insensitive (`i`) לרשת זיהוי הדוא"ל.

```javascript
// BEFORE:
const FALLBACK_PATTERNS = [
  { pattern: /\b\d{9}\b/g, token: "[ת.ז]" },
  { pattern: /\b05\d-?\d{7}\b/g, token: "[טלפון]" },
  { pattern: /[\w.+-]+@[\w-]+\.[\w.]+/g, token: "[מייל]" }
];

// AFTER:
const FALLBACK_PATTERNS = [
  { pattern: /\b\d{9}\b/g, token: "[ת.ז]" },
  {
    pattern: /(?:\+972[- ]?0?|0)(?:[23489]|5\d|7\d)[- ]?(?:\d{3}[- ]?\d{4}|\d{7})\b/g,
    token: "[טלפון]",
  },
  { pattern: /[\w.+-]+@[\w-]+\.[\w.]+/gi, token: "[מייל]" },
];
```

---

## 2. באגים בקוד המוצר שתוקנו (לשעבר מסומנים כ-`test.failing`)

### ממצא 2.1: עקיפת סניטיזציית XSS במערכים של אובייקטים — תוקן
* **מיקום בקוד:** `functions/middleware/sanitize.middleware.js` (פונקציה `sanitizeObject`)
* **סוג פגיעות:** Cross-Site Scripting (XSS) / Data Sanitization Bypass
* **בדיקה תואמת:** `functions/tests/unit/sanitize.test.js` (`should sanitize objects nested inside arrays within request body`) - בדיקת `it` רגילה, עוברת.
* **תיאור הכשל:**
  בזמן ריצה רקורסיבית על מערכים בתוך אובייקט הקלט, המנגנון ביצע בדיקת טיפוס מחמירה על מחרוזות בלבד:
  ```javascript
  if (Array.isArray(val)) {
    cleaned[key] = val.map(item => typeof item === 'string' ? stripTags(item) : item);
  }
  ```
  כאשר המערך הכיל אובייקטים מקוננים (כגון שאלונים מורכבים במבנה `[{ answer: "<script>..." }]`), האלמנט הוחזר כמות שהוא (`item`), והתגיות הזדוניות לא נוקו כלל.
* **התיקון שבוצע:**
  נוספה פונקציית עזר `sanitizeArray` שמטפלת רקורסיבית בכל איבר מערך: מחרוזת עוברת `stripTags`, מערך מקונן מטופל רקורסיבית, ואובייקט עובר `sanitizeObject`.
  ```javascript
  const sanitizeArray = (arr) =>
    arr.map((item) => {
      if (typeof item === "string") return stripTags(item);
      if (Array.isArray(item)) return sanitizeArray(item);
      if (item && typeof item === "object") return sanitizeObject(item);
      return item;
    });
  ```

### ממצא 2.2: חוסר אימות בעלות ביצירת אבחון (BOLA / IDOR) — תוקן
* **מיקום בקוד:** `functions/controllers/diagnosis.controller.js` (פונקציה `createDiagnosis`)
* **סוג פגיעות:** Broken Object Level Authorization (BOLA / IDOR)
* **בדיקה תואמת:** `functions/tests/integration/access-control.test.js` (`should forbid therapist2 from opening a diagnosis for child c1 owned by therapist1`) - בדיקת `it` רגילה, עוברת.
* **תיאור הכשל:**
  בעת פנייה לנתיב `POST /diagnoses/create`, הבקר שלף את מזהה הילד (`childId`) מגוף הבקשה, אך לא בדק האם המטפל המבצע את הפנייה (`req.user.uid`) הוא אכן המטפל המשויך לרשומת הילד ב-Firestore.
  כתוצאה מכך, מטפל א' היה מסוגל לייצר תיק אבחון עבור מטופל השייך למטפל ב', תוך הפרת עקרון בידוד הדיירים (Multi-Tenant Isolation).
* **התיקון שבוצע:**
  נוספה בדיקת בעלות לפני הקריאה ל-`openInitialDiagnosis`: אם `childData.therapistId !== therapistId`, נשלפת גם רשומת המשתמש מ-`users/{uid}` ונבדק תפקידו - אם אינו `admin`, הבקשה נדחית עם 403.

### ממצא 2.3: עקיפת נעילה של אבחון סגור (Lifecycle Integrity Bypass) — תוקן
* **מיקום בקוד:** `functions/controllers/report.controller.js` (פונקציה `openReportForEditing`)
* **סוג פגיעות:** Business Logic Flaw / State Machine Violation
* **בדיקה תואמת:** `functions/tests/integration/report-lifecycle.test.js` (`should reject unlocking a report after diagnosis is officially closed`) - בדיקת `it` רגילה, עוברת.
* **תיאור הכשל:**
  נתיב `PUT /reports/:diagnosisId/unlock` איפשר החזרת דו"ח שננעל למצב עריכה. הבקר בדק האם הדו"ח עצמו קיים וננעל, אך לא בדק את מצב תיק האבחון הכולל (`diagnosisDoc.data().closed === true`).
  כתוצאה מכך, גם לאחר שתיק האבחון הושלם, אושר סופית וננעל לחלוטין (Final Closure), מטפל היה עדיין יכול לפתוח מחדש את הדו"ח לעריכה, בניגוד לכללי הרגולציה והיושרה של תיעוד רפואי/פסיכודידקטי.
* **התיקון שבוצע:**
  נוספה שליפה של מסמך האבחון ובדיקה שאם `closed === true`, הבקשה נדחית עם 409 ו-"לא ניתן לפתוח דוח של אבחון שנסגר", לפני עדכון סטטוס הדוח.

---

## 3. פגמים בחוקי אבטחת אחסון (Cloud Storage Security Rules)

### ממצא 3.1: היעדר חסימת דריסת קבצים קיימים ע"י הורים (File Overwrite Prevention) — אומת מחדש, פתוח
* **אימות מחדש:** הרצת `npm --prefix security-tests test` אימתה שהבדיקה `parent cannot overwrite existing file` נכשלת בפועל (34 בדיקות סה"כ, 33 עברו, 1 נכשלה) - הממצא תקף ולא שגוי. `storage.rules` לא שונו.
* **מיקום:** `storage.rules`
* **סוג פגיעות:** Data Integrity / Audit Tampering
* **בדיקה תואמת:** `security-tests/rules.test.mjs` (`parent cannot overwrite existing file`)
* **תיאור הכשל:**
  חוקי האחסון מאפשרים להורה מאומת להעלות קבצים (PDF/תמונות) עבור ילדו לנתיב `/questionnaires/{childId}/{fileName}`. עם זאת, כלל הכתיבה מוגדר כ-`allow write:` ללא הבחנה בין יצירה (`create`) לעדכון/דריסה (`update`), וללא בדיקה של `resource == null`.
  כפועל יוצא, הורה מסוגל להעלות קובץ באותו שם ולדרוס שאלון שכבר נחתם או הוגש, מבלי שיישמר תיעוד מקורי.
* **המלצה לתיקון בחוקים:**
  פיצול החוק ל-`allow create: if ... && resource == null;` וחסימת `update/delete` מצד לקוח הקצה (אלא רק דרך Functions עם הרשאות Admin).

---

## 4. סיכום מצב הבדיקות

| מזהה ממצא | רכיב נבדק | מהות הכשל | סטטוס טיפול |
| :--- | :--- | :--- | :--- |
| **BUG-01** | `services/ai/deidentify.js` | כשל בגבולות מילים ותחיליות עבריות בהתממה | **תוקן בקוד** (מגובה ב-Unit Tests) |
| **BUG-02** | `services/ai/deidentify.js` | כיסוי חסר בטלפונים ודוא"ל ברשת הביטחון | **תוקן בקוד** (מגובה ב-Unit Tests) |
| **BUG-03** | `middleware/sanitize.middleware.js` | דילוג על אובייקטים מקוננים בתוך מערכים | **תוקן** (מגובה ב-Unit Tests) |
| **BUG-04** | `controllers/diagnosis.controller.js` | היעדר אימות בעלות ביצירת אבחון (BOLA) | **תוקן** (מגובה ב-Integration Tests) |
| **BUG-05** | `controllers/report.controller.js` | פתיחת דו"ח לעריכה בתיק אבחון סגור | **תוקן** (מגובה ב-Integration Tests) |
| **BUG-06** | `storage.rules` | אפשרות לדריסת קבצים קיימים באחסון ע"י הורה | **פתוח** (אומת מחדש, לא תוקן) |
