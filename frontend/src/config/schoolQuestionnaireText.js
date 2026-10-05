// מקור יחיד לכל הטקסטים (תוויות, רמזים, אפשרויות וכותרות) של שאלון בית הספר,
// לפי הנוסח המקורי של הטופס. נצרך על ידי SchoolQuestionnaire.jsx (מילוי השאלון
// ע"י המחנך/ת) ו-SchoolSurveyView.jsx (צפייה המאבחנת).

export const SQ_TITLE = "טופס הפנייה לטיפול/אבחון - שאלון לבית ספר";

export const SQ_LABELS = {
  // שלב 1 - פרטים אישיים
  lastName: { label: "שם משפחה" },
  firstName: { label: "שם פרטי" },
  gender: { label: "מין" },
  fatherName: { label: "שם האב" },
  motherName: { label: "שם האם" },
  birthDate: { label: "תאריך לידה" },
  idNumber: { label: "ת.ז." },
  address: { label: "כתובת" },
  phone: { label: "מס' טלפון" },
  school: { label: "בית ספר" },
  grade: { label: "כיתה" },
  teacherName: { label: "שם המחנך/ת" },
  teacherPhone: { label: "טלפון" },

  // שלב 2 - סיבת ההפניה
  referralInitiator: { label: "מי יזם את הפנייה?" },
  referralReasons: { label: "סיבות הפנייה" },
  difficultyDescription: {
    label: "תיאור קשיי התלמיד/ה",
    hint: "(ציין/י מתי החלו הקשיים ואת תדירות הופעתם)",
  },

  // שלב 3 - הישגים לימודיים
  stayedGrade: { label: "האם נשאר/ה כיתה שנה נוספת?" },
  stayedGradeWhich: { label: "באיזו כיתה?" },
  stayedGradeReasons: { label: "מה היו הסיבות לכך?" },
  reportCardGrade: { label: "ציונים בתעודה שקיבל/ה לאחרונה - בכיתה" },
  reportCardHalf: { label: "במחצית" },
  reportCardYear: { label: "שנת" },
  academicLevel: {
    label: "הערך/י את הישגיו/ה הלימודיים בהשוואה להישגי הכיתה:",
    hint: "(סמן/י בעיגול את התשובה המתאימה)",
  },
  reading: {
    label: "קריאה",
    hint: "(רמת הקריאה – מתאים לאיזה כיתה, אוצר מילים, דיוק, קצב קריאה, פענוח, הבנת הנקרא)",
  },
  writing: {
    label: "כתיבה",
    hint: "(העתקה, כתיבה חופשית, שגיאות כתיב, כתב)",
  },
  math: {
    label: "חשבון",
    hint: "(ציין/י את מידת הבנתו/ה ושליטתו/ה בפעולות החשבון ובפתרון בעיות)",
  },

  // שלב 4 - יחסים והתנהגות
  teacherRelation: { label: "מה טיב יחסו/ה של התלמיד/ה אל המורים?" },
  teacherRelationNotes: {
    label: "הערות",
    hint: "(למשל: יחס שונה למורים שונים, יחס בלתי יציב, מתחרה עם בני כיתתו/ה על אהדת המורה)",
  },
  peerRelation: { label: "מה טיב יחסיו/ה של הילד/ה עם בני כיתתו/ה?" },
  peerProblems: {
    label: "אם קיימות בעיות בחברה, תאר/י אותן, באילו נסיבות הן מופיעות ומדוע?",
  },

  // שלב 6 - עזרה מיוחדת וסיכום
  integrationHours: { label: "שעות שילוב" },
  integrationScope: { label: 'בהיקף (ש"ש)' },
  integrationYears: { label: "כמה שנים" },
  emotionalTreatment: { label: "טיפול רגשי" },
  emotionalTreatmentDetails: { label: "איזה?" },
  otherHelp: { label: "עזרה אחרת" },
  specialEducation: { label: "האם הילד/ה למד/ה במסגרת חינוך מיוחד?" },
  specialEdName: { label: "שם הגן / כתה" },
  studentSummary: { label: "סכם/י התרשמותך מהתלמיד/ה" },
  diagnosticQuestion: {
    label: "שאלה אבחונית או אחרת הקיימת לגבי התלמיד/ה",
  },
  requestedIntervention: { label: "ההתערבות הטיפולית המבוקשת" },
  signatureDate: { label: "תאריך" },
  teacherSignatureName: { label: "שם המחנך/ת" },
};

export const SQ_OPTIONS = {
  academicLevel: [
    "חלשים מאוד",
    "חלשים",
    "למטה מבינוניים",
    "טובים",
    "טובים מאוד",
    "מצוינים",
  ],
  teacherRelation: [
    "עוין",
    "מסויג",
    "תקין",
    "מחפש/ת את אהדתם",
    "מחפש/ת אהדה בצורה מופרזת",
  ],
  peerRelation: [
    "מתבודד/ת",
    "דחוי/ה",
    "מקיים/ת יחסים חברתיים קלושים",
    "מקובל/ת",
    "מקובל/ת מאוד בעל/ת עמדה של מנהיג/ה",
  ],
  adhdFrequency: [
    "אף פעם או לעיתים רחוקות",
    "לפעמים",
    "לעיתים קרובות",
    "לעיתים קרובות מאד",
  ],
};

// ארבעת הפריטים בטבלת "הקף/י את המספר..." (שלב 4). המפתחות (key) הם שמות
// השדות הקיימים ב-formData - אינם משתנים, רק הטקסט המוצג (label).
export const SQ_ADHD_ITEMS = [
  { key: "distractedEasily", label: "1. דעתו/ה מוסחת בקלות." },
  { key: "hardToFocus", label: "2. מתקשה להתרכז במשימות או במשחקים." },
  {
    key: "excessiveMovement",
    label:
      "3. נע/ה מסתובב/ת או שמטפס/ת באופן מוגזם במצבים בהם הדבר אינו מתאים.",
  },
  {
    key: "leavesSeats",
    label:
      "4. עוזב/ת את הכסא בכתה או במצבים אחרים בהם מצופה שימשיך/תמשיך לשבת.",
  },
];

// מיפוי מהמפתח הקיים ב-BEHAVIOR_ITEMS / behaviorRatings (ללא שינוי) לטקסט
// המוצג (שלב 5). פריטים שאינם ברשימה מוצגים כמו שהם (המפתח עצמו).
export const SQ_BEHAVIOR_LABELS = {
  'נעדר מבי"ס ללא הצדקה': 'נעדר/ת מבי"ס ללא הצדקה',
  'מאחר לבי"ס ללא הצדקה': 'מאחר/ת לבי"ס ללא הצדקה',
  "מפריע בשיעורים": "מפריע/ה בשיעורים",
  "אינו מגלה עניין בלימודים": "אינו/אינה מגלה עניין בלימודים",
  "נחבא אל הכלים – ביישן": "נחבא/ת אל הכלים – ביישן/ית",
  "מתעקש": "מתעקש/ת",
  "משקר": "משקר/ת",
  "גונב": "גונב/ת",
  "חסר מנוחה": "חסר/ת מנוחה",
  "תלותי": "תלותי/ת",
  "חסר בטחון עצמי": "חסר/ת בטחון עצמי",
};

// ערכים ישנים שנשמרו בטיוטות/הגשות קודמות -> הערך החדש המתאים. מוחל בעת
// טעינת initialData כדי שבחירה ישנה תמשיך להיות מסומנת נכון.
export const SQ_LEGACY_OPTIONS = {
  teacherRelation: {
    "מחפש אהדה": "מחפש/ת את אהדתם",
    "מחפש אהדה מופרזת": "מחפש/ת אהדה בצורה מופרזת",
  },
  peerRelation: {
    "מתבודד": "מתבודד/ת",
    "דחוי": "דחוי/ה",
    "חברתיים קלושים": "מקיים/ת יחסים חברתיים קלושים",
    "מקובל": "מקובל/ת",
    "מנהיג": "מקובל/ת מאוד בעל/ת עמדה של מנהיג/ה",
  },
  adhdFrequency: {
    "אף פעם / לעיתים רחוקות": "אף פעם או לעיתים רחוקות",
  },
};

// כותרות/הוראות חד-פעמיות שאינן תוויות של שדה בודד
export const SQ_SCHOOL_HISTORY_TITLE = "מהלך לימודים בבית ספר:";
export const SQ_SCHOOL_HISTORY_HEADERS = ["כתה", "בית-ספר"];
export const SQ_SUBJECT_MASTERY_TITLE =
  "שליטתו/ה במקצועות היסוד (פרט/י במיוחד לגבי תלמידים בכיתות א'-ד'):";
export const SQ_ADHD_INSTRUCTION =
  "הקף/י את המספר שמתאר באופן הטוב ביותר את התנהגות התלמיד/ה בבית הספר במהלך 6 החודשים האחרונים.";
export const SQ_BEHAVIOR_TABLE_FIRST_COL = "ההתנהגות";
export const SQ_BEHAVIOR_TABLE_FREQ_HEADER = "תדירות הופעת ההתנהגות";
export const SQ_SPECIAL_HELP_SUBTITLE =
  'האם הילד/ה קיבל/ה במסגרת בי"ס עזרה מיוחדת?';
