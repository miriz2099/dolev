// src/config/reportStructure.js
// מבנה חוות הדעת הפסיכולוגית — מקור אמת יחיד שמניע את רינדור הטופס,
// שמירת הטיוטה, והתצוגה הסופית.
//
// סוגי מקטעים (section.type):
//   "infoTable"   -> טבלת מפתח/ערך.        formData[id] = { fieldId: value }
//   "narrative"   -> פסקת טקסט חופשי אחת.   formData[id] = "string"
//   "list"        -> רשימת פריטים (bullets). formData[id] = ["...", "..."]
//   "group"       -> מקטע-אב עם subsections. formData[id] = { subId: ... }
//   "scoresTable" -> טבלת ציונים מובנית.    formData[id] = { rowId: { raw, standard, percentile, ci } }

// עמודות קבועות לכל טבלאות הציונים
const SCORE_COLUMNS = [
  { id: "raw", label: "ציון גלם" },
  { id: "standard", label: "ציון תקן" },
  { id: "percentile", label: "אחוזון" },
  { id: "ci", label: "רווח בר סמך (68%)" },
];

export const REPORT_STRUCTURE = [
  {
    id: "personalDetails",
    title: "פרטים אישיים",
    type: "infoTable",
    autoFillFromChild: true, // נמלא אוטומטית מפרטי הילד (שם, ת.ז, תאריך לידה)
    fields: [
      { id: "firstName", label: "שם פרטי", type: "text" },
      { id: "lastName", label: "שם משפחה", type: "text" },
      { id: "idNumber", label: "תעודת זהות", type: "text" },
      { id: "birthDate", label: "תאריך לידה", type: "date" },
      { id: "birthCountry", label: "ארץ לידה", type: "text" },
      { id: "homeLanguage", label: "שפה מדוברת בבית", type: "text" },
      { id: "address", label: "כתובת", type: "text" },
      { id: "parentsNames", label: "שמות ההורים", type: "text" },
      { id: "school", label: "בית ספר", type: "text" },
      { id: "grade", label: "כיתה", type: "text" },
    ],
  },
  {
    id: "testDetails",
    title: "פרטי המבחן",
    type: "infoTable",
    fields: [
      { id: "firstTestDate", label: "תאריך בחינה ראשון", type: "date" },
      { id: "ageAtTest", label: "גיל הנבחן בעת הבחינה", type: "text" },
      { id: "secondTestDate", label: "תאריך בחינה שני", type: "date" },
      { id: "examinerName", label: "שם הבוחן/ת", type: "text" },
    ],
  },
  {
    id: "referralReason",
    title: "סיבת ההפניה להערכה",
    type: "narrative",
  },
  {
    id: "familyBackground",
    title: "רקע משפחתי והתפתחותי",
    type: "narrative",
  },
  {
    id: "educationalBackground",
    title: "רקע חינוכי",
    type: "narrative",
  },
  {
    id: "appearanceBehavior",
    title: "הופעה והתנהגות",
    type: "narrative",
  },
  {
    id: "assessmentTools",
    title: "כלי אבחון",
    type: "list",
  },
  {
    id: "findings",
    title: "ממצאי האבחון",
    type: "group",
    subsections: [
      { id: "intelligence", title: "משכל", type: "narrative" },
      { id: "fluidAbility", title: "יכולת פלואידית ותפקודים ניהוליים", type: "narrative" },
      { id: "crystallizedKnowledge", title: "ידע מגובש", type: "narrative" },
      { id: "auditoryProcessing", title: "עיבוד שמיעתי", type: "narrative" },
      { id: "visualProcessing", title: "עיבוד חזותי ותפקוד גרפו-מוטורי", type: "narrative" },
      { id: "processingSpeed", title: "מהירות עיבוד ותפקודי קשב", type: "narrative" },
    ],
  },
  {
    id: "memory",
    title: "תפקודי זיכרון",
    type: "group",
    subsections: [
      { id: "shortTermMemory", title: "זיכרון לטווח הקצר", type: "narrative" },
      { id: "longTermStorage", title: "אחסון ושליפה לטווח הארוך", type: "narrative" },
    ],
  },
  {
    id: "achievements",
    title: "תחומי הישג",
    type: "group",
    subsections: [
      { id: "reading", title: "קריאה", type: "narrative" },
      { id: "comprehension", title: "הבנת הנקרא והנשמע", type: "narrative" },
      { id: "oralExpression", title: "הבעה בעל פה", type: "narrative" },
      { id: "writing", title: "כתיבה והבעה בכתב", type: "narrative" },
      { id: "math", title: "חשבון", type: "narrative" },
      { id: "english", title: "תפקוד באנגלית", type: "narrative" },
    ],
  },
  {
    id: "emotionalBehavioral",
    title: "רגשי-התנהגותי",
    type: "narrative",
  },
  {
    id: "summary",
    title: "אינטגרציה וסיכום",
    type: "group",
    subsections: [
      { id: "summaryText", title: "סיכום", type: "narrative" },
      { id: "strengths", title: "תחומי חוזק", type: "list" },
      { id: "difficulties", title: "מוקדי הקושי", type: "list" },
    ],
  },
  {
    id: "recommendations",
    title: "המלצות",
    type: "group",
    subsections: [
      { id: "forParents", title: "להורים", type: "list" },
      { id: "forSchool", title: "לבית הספר", type: "list" },
      { id: "forExams", title: "במבחני בגרות", type: "list" },
    ],
  },
  {
    id: "scores",
    title: "ציוני המבחנים והמצרפים",
    type: "group",
    subsections: [
      {
        id: "subtests",
        title: "תת-מבחנים",
        type: "scoresTable",
        columns: SCORE_COLUMNS,
        rows: [
          { id: "test1", label: "מבחן 1: הבנה מילולית" },
          { id: "test1d", label: "מבחן 1ד': אנלוגיות מילוליות" },
          { id: "test2", label: "מבחן 2: למידה חזותית-שמיעתית" },
          { id: "test3", label: "מבחן 3: עיבוד מרחבי" },
          { id: "test4", label: "מבחן 4: מיזוג צלילים" },
          { id: "test5", label: "מבחן 5: יצירת כללים" },
          { id: "test6", label: "מבחן 6: התאמה חזותית" },
          { id: "test7", label: "מבחן 7: זכירת מילים" },
          { id: "test8", label: "מבחן 8: ידע כללי" },
          { id: "test9", label: "מבחן 9: שטף סמנטי" },
          { id: "test10", label: "מבחן 10: זיהוי ציורים" },
          { id: "test11", label: "מבחן 11: מילים לא שלמות" },
          { id: "test12", label: "מבחן 12: אנליזה - סינתזה" },
          { id: "test13", label: "מבחן 13: מהירות החלטה" },
          { id: "test14", label: "מבחן 14: זכירת ספרות לאחור" },
          // מבחנים מורחבים (מודל 2018 / מורחבות)
          { id: "test15", label: "מבחן 15: זכירת שמות" },
          { id: "test16", label: "מבחן 16: תכנון" },
          { id: "test17", label: "מבחן 17: קשב שמיעתי" },
          { id: "test18", label: "מבחן 18: סדרות מספרים" },
          { id: "test19", label: "מבחן 19: איתור ציורים מהיר" },
          { id: "test20", label: "מבחן 20: זיכרון עבודה שמיעתי" },
          { id: "test21", label: "מבחן 21: שיום תמונות מהיר" },
        ],
      },
      {
        id: "composites",
        title: "מדדים ומצרפים",
        type: "scoresTable",
        columns: SCORE_COLUMNS,
        rows: [
          // מנת משכל
          { id: "iqShort", label: "מנת משכל כוללת – מדד מקוצר (1-7)" },
          { id: "iqFull", label: "מנת משכל כוללת (1-14)" },
          // מדדי CPM
          { id: "cpmAcquired", label: "ידע נרכש (CPM)" },
          { id: "cpmReasoningExt", label: "יכולת חשיבה – מדד מורחב" },
          { id: "cpmReasoningShort", label: "יכולת חשיבה – מדד מקוצר" },
          { id: "cpmCognitiveEff", label: "יעילות קוגניטיבית" },
          // יכולות CHC רחבות
          { id: "chcCrystallized", label: "ידע מגובש" },
          { id: "chcLongTerm", label: "אחסון ושליפה לטווח ארוך" },
          { id: "chcVisual", label: "עיבוד חזותי" },
          { id: "chcAuditory", label: "עיבוד שמיעתי" },
          { id: "chcFluid", label: "יכולת פלואידית" },
          { id: "chcSpeed", label: "מהירות עיבוד" },
          { id: "chcShortMem", label: "זיכרון לטווח קצר" },
          // מודל 2018
          { id: "chc2018Learning", label: "יעילות בלמידה" },
          { id: "chc2018Retrieval", label: "שטף שליפה" },
          // מדדים מורחבים
          { id: "chcVisualExt", label: "עיבוד חזותי – מורחב" },
          { id: "chcAuditoryExt", label: "עיבוד שמיעתי – מורחב" },
          { id: "chcFluidExt", label: "יכולת פלואידית – מורחב" },
          { id: "chcSpeedExt", label: "מהירות עיבוד – מורחב" },
          { id: "chcShortMemExt", label: "זיכרון לטווח קצר – מורחב" },
        ],
      },
    ],
  },
];