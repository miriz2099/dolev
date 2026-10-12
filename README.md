# מערכת "דולב" (Dolev) – ניהול תהליכי אבחון פסיכו-דידקטיים
## פרויקט גמר בהנדסת תוכנה

מערכת "דולב" היא פלטפורמת Full-Stack המיועדת לקליניקות אבחון פסיכו-דידקטי:
* **צד לקוח:** React 19, Tailwind CSS.
* **צד שרת:** Firebase Cloud Functions (Express 5, Node.js 22, firebase-admin 12).
* **מסד נתונים ואחסון:** Cloud Firestore, Firebase Authentication, Cloud Storage.
* **מודל בינה מלאכותית:** Google Gemini API עבור ניסוח והפשטה של תכנים קליניים עם שכבת התממת נתונים (De-identification) קפדנית.

---

## הרצת מערך הבדיקות האוטומטיות

מערך הבדיקות של המערכת בנוי בהתאם למתודולוגיית פירמידת הבדיקות ומכסה בדיקות יחידה, בדיקות אינטגרציה מלאות מול אמולטורים מקומיים, ובדיקות חוקי אבטחה של בסיס הנתונים.

### דרישות קדם
* **Node.js:** גרסה 22 ומעלה.
* **Java:** מותקן בסביבה (נדרש להרצת ה-Firebase Emulators).
* **Firebase Tools:** כלי ה-CLI מותקן גלובלית או דרך npx (`npm install -g firebase-tools`).

---

### פקודות הרצה של בדיקות צד השרת (`functions`)

1. **בדיקות יחידה (Unit Tests):**
   הרצת כלל בדיקות היחידה המבודדות בזיכרון (8 סוויטות, 48 בדיקות):
   ```bash
   npm --prefix functions run test:unit
   ```

2. **בדיקות עמידות לאזורי זמן (Timezone Tests):**
   אימות מודול הזמנים במקביל תחת אזור זמן UTC ותחת אזור זמן ישראל (Asia/Jerusalem):
   ```bash
   npm --prefix functions run test:tz
   ```

3. **בדיקות אינטגרציה מול אמולטורים (Integration Tests):**
   הרצת שרת ה-Express המלא מול Firebase Auth & Firestore Emulators (5 סוויטות, 46 בדיקות):
   ```bash
   npm --prefix functions run test:integration
   ```

4. **דוח כיסוי קוד (Coverage Report):**
   הפקת דוח כיסוי מפורט של בדיקות היחידה (Jest Coverage):
   ```bash
   npm --prefix functions run test:coverage
   ```

5. **הרצת כלל בדיקות השרת:**
   הרצה רציפה של בדיקות היחידה ולאחריהן בדיקות האינטגרציה:
   ```bash
   npm --prefix functions test
   ```

---

### פקודות הרצה של בדיקות חוקי אבטחה (`security-tests`)

בדיקות אימות לחוקי האבטחה של Cloud Firestore ו-Cloud Storage באמצעות `@firebase/rules-unit-testing`:
```bash
npm --prefix security-tests test
```

---

## מסמכי תיעוד נוספים

בתיקיית `functions/tests/` זמינים מסמכי תיעוד מעמיקים עבור סוקרי הפרויקט:
* **[BUGS_FOUND.md](functions/tests/BUGS_FOUND.md):** פירוט מלא של כלל הבאגים ומקרי הקצה שהתגלו במהלך כתיבת הבדיקות (כולל השוואת קוד Before/After ובאגים המסומנים כ-`test.failing`).
* **[TESTS_EXPLANATION_HE.md](functions/tests/TESTS_EXPLANATION_HE.md):** מדריך הנדסי מקיף בעברית המסביר בפירוט כל סוויטת בדיקה, מטרותיה הקליניות וטבלאות כיסוי קוד.
* **[TESTS_EXPLANATION_EN.md](functions/tests/TESTS_EXPLANATION_EN.md):** המדריך ההנדסי המקביל בשפה האנגלית.
* **[REPORT_SUMMARY_HE.md](functions/tests/REPORT_SUMMARY_HE.md):** טבלת סיכום תמציתית להעתקה ישירה לפרק הבדיקות של דוח הפרויקט הסופי.
