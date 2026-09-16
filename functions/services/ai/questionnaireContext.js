// functions/services/ai/questionnaireContext.js
//
// מיפוי בין סעיפי הדוח (referralReason / familyBackground / educationalBackground)
// לבין השדות הרלוונטיים בשאלון ההורים ובשאלון בית הספר, לצורך בניית טיוטה
// ראשונית ב-AI. התוויות מבוססות על ה-label-ים בפועל ב-
// frontend/src/components/ParentQuestionnaire.jsx ו-SchoolQuestionnaire.jsx,
// אך קוצרו לביטויים נושאיים קצרים (2-5 מילים) במקומות שבהם ה-label המקורי
// הוא בפועל שאלה מלאה ("האם...?") - כדי שהמודל יקבל נושאים לכתוב עליהם,
// ולא שאלות שהוא "עונה עליהן" חזרה בטקסט. במקומות הבודדים שבהם אין <label>
// ממשי (שדות טבלה כמו פרטי ההורים, או תווית קצרה שחוזרת על עצמה כמו
// "ממצאים"/"אחר" ותהיה חסרת משמעות מחוץ להקשר הוויזואלי שלה) - נעשה שימוש
// בטקסט התיאורי הקרוב ביותר שקיים בקוד (למשל הודעות validateAllSteps), או
// בהבהרה מינימלית בהשראת הכותרת/העמודה שממש מעליה בטופס. השדות הריקים
// מדולגים לגמרי בזמן בניית ההקשר.

const SECTION_QUESTIONNAIRE_FIELDS = {
  referralReason: {
    parent: [
      { field: "difficultyDescription", label: "תיאור הקושי" },
      { field: "referralGoals", label: "מטרות הפנייה" },
      { field: "onsetTime", label: "תחילת הקשיים" },
      { field: "hadAssessment", label: "אבחון קודם (פסיכולוגי/נוירולוגי/אחר)" },
      { field: "assessmentType", label: "סוג האבחון הקודם" },
      { field: "assessmentDate", label: "תאריך האבחון הקודם" },
      { field: "assessmentRecommendations", label: "המלצות האבחון הקודם" },
      {
        field: "paraMedicalTreatments",
        label: "טיפולים פרא-רפואיים (ריפוי בעיסוק/קלינאית תקשורת/פיזיותרפיה וכו')",
      },
      {
        field: "expressedDistress",
        label: "מצוקה רגשית שהביע/ה הילד/ה (חששות/חרדות/פחדים)",
      },
      { field: "willingToConsult", label: "נכונות להיוועצות עם איש מקצוע" },
    ],
    school: [
      { field: "referralInitiator", label: "יוזם הפנייה" },
      { field: "referralReasons", label: "סיבות הפנייה" },
      { field: "difficultyDescription", label: "תיאור קשיי התלמיד" },
    ],
  },

  familyBackground: {
    parent: [
      { field: "familyStatus", label: "מצב משפחתי (הורים)" },
      { field: "familyNotes", label: "הערות למצב המשפחתי" },
      { field: "address", label: "כתובת" },
      { field: "homeLanguage", label: "שפה מדוברת בבית" },
      { field: "aliyaDate", label: "תאריך עלייה" },

      { field: "motherNameInTable", label: "שם האם בטבלת משפחה" },
      { field: "motherAge", label: "גיל האם" },
      { field: "motherJob", label: "עיסוק האם" },
      { field: "motherNotes", label: "הערות על האם" },
      { field: "fatherNameInTable", label: "שם האב בטבלת משפחה" },
      { field: "fatherAge", label: "גיל האב" },
      { field: "fatherJob", label: "עיסוק האב" },
      { field: "fatherNotes", label: "הערות על האב" },

      { field: "plannedPregnancy", label: "תכנון ההיריון" },
      { field: "normalPregnancy", label: "תקינות מהלך ההיריון" },
      { field: "pregnancyDetails", label: "פרט על ההיריון" },
      { field: "normalBirth", label: "תקינות מהלך הלידה" },
      { field: "birthDetails", label: "פרט על הלידה" },
      { field: "birthWeight", label: "משקל הלידה" },
      { field: "problemsAfterBirthChild", label: "בעיות רפואיות לילד/ה לאחר הלידה" },
      { field: "problemsAfterBirthMother", label: "בעיות רפואיות לאם לאחר הלידה" },
      { field: "normalMotorDev", label: "התפתחות מוטורית" },
      { field: "walkingAge", label: "גיל תחילת הליכה" },
      { field: "normalLanguageDev", label: "התפתחות שפתית" },
      { field: "firstWordsAge", label: "גיל דיבור ראשוני" },
      { field: "sleepIssuesFirstYear", label: "קשיי שינה בשנה הראשונה" },
      { field: "eatingIssuesFirstYear", label: "קשיי אכילה בשנה הראשונה" },
      { field: "diaperGraduationAge", label: "גיל גמילה מחיתולים" },

      { field: "generalHealth", label: "מצב בריאותי כללי" },
      { field: "visionFindings", label: "ממצאי בדיקת ראייה" },
      { field: "hearingFindings", label: "ממצאי בדיקת שמיעה" },
      { field: "pastDiseases", label: "מחלות עבר" },
      { field: "hospitalization", label: "אשפוזים" },
      { field: "hospitalizationAge", label: "גיל האשפוז" },
      { field: "hospitalizationDuration", label: "משך האשפוז" },
      { field: "hospitalizationReason", label: "סיבת האשפוז" },
      { field: "regularMedications", label: "תרופות קבועות" },

      { field: "restlessness", label: "חוסר מנוחה/פעילות יתר" },
      { field: "excitedEasily", label: "התרגשות מהירה" },
      { field: "disturbsOthers", label: "הפרעה לאחרים" },
      { field: "difficultyCompletingTasks", label: "קושי בהתמדה וסיום משימות" },
      { field: "needsSpecialAttention", label: "צורך בתשומת לב מיוחדת" },
      { field: "dependencyVsIndependence", label: "תלותיות מול עצמאות" },
      { field: "otherBehavioral", label: "במסגרת הבית - אחר" },
      { field: "closerToWho", label: "קרבה הורית (לאם/לאב/אחר)" },

      { field: "hasFriends", label: "חברים" },
      { field: "socialLevel", label: "רמת חברותיות" },
      { field: "meaningfulConnections", label: "קשרים חברתיים משמעותיים" },
      { field: "oppositeSexConnections", label: "קשרים עם בני המין השני" },
      { field: "socialProblemsDetails", label: "בעיות חברתיות" },
    ],
    school: [],
  },

  educationalBackground: {
    parent: [
      { field: "firstFrameworkAge", label: "גיל כניסה למסגרת לימודית ראשונה" },
      { field: "firstFrameworkType", label: "סוג המסגרת הראשונה" },
      { field: "prePreSchoolReports", label: "תפקוד בגן טרום-חובה" },
      { field: "preSchoolReports", label: "תפקוד בגן חובה" },
      { field: "stayedGrade", label: "השארת כיתה" },
      { field: "stayedGradeWhich", label: "כיתת ההשארה" },
      { field: "stayedGradeReason", label: "סיבת השארת הכיתה" },
    ],
    school: [
      { field: "academicLevel", label: "רמה לימודית כללית" },
      { field: "reading", label: "קריאה" },
      { field: "writing", label: "כתיבה" },
      { field: "math", label: "חשבון" },
      { field: "teacherRelation", label: "יחס למורים" },
      { field: "teacherRelationNotes", label: "הערות ליחס למורים" },
      { field: "peerRelation", label: "יחס לבני כיתתו" },
      { field: "peerProblems", label: "תיאור בעיות חברתיות" },
      { field: "distractedEasily", label: "דעתו מוסחת בקלות" },
      { field: "hardToFocus", label: "מתקשה להתרכז" },
      { field: "excessiveMovement", label: "נע באופן מוגזם" },
      { field: "leavesSeats", label: "עוזב את הכסא" },
      { field: "integrationHours", label: "שעות שילוב" },
      { field: "integrationScope", label: 'היקף (ש"ש)' },
      { field: "integrationYears", label: "מספר שנות השילוב" },
      { field: "emotionalTreatment", label: "טיפול רגשי (קיים/לא)" },
      { field: "emotionalTreatmentDetails", label: "סוג הטיפול הרגשי" },
      { field: "specialEducation", label: "מסגרת חינוך מיוחד" },
      { field: "specialEdName", label: "שם הגן/כיתה" },
      { field: "stayedGrade", label: "השארת כיתה" },
      { field: "stayedGradeWhich", label: "כיתת ההשארה" },
      { field: "stayedGradeReasons", label: "סיבת השארת הכיתה" },
      { field: "studentSummary", label: "סיכום התרשמות המחנך/ת" },
      { field: "diagnosticQuestion", label: "שאלה אבחונית" },
    ],
  },
};

/**
 * בונה מחרוזת טקסט מתויגת (label: value) מתוך התשובות הרלוונטיות לסעיף
 * נתון, בשאלון ההורים ובשאלון בית הספר. שדות ריקים/undefined מדולגים
 * לגמרי - אין "לא צוין" או placeholder דומה, כדי לא להאכיל את המודל
 * בעובדות מזויפות.
 *
 * @param {string} sectionId - referralReason | familyBackground | educationalBackground
 * @param {object} [parentFormData] - formData מתוך parent_questionnaires
 * @param {object} [schoolFormData] - formData מתוך school_questionnaires
 * @returns {string} - מחרוזת ריקה אם אין אף שדה רלוונטי עם ערך
 */
const buildQuestionnaireContext = (
  sectionId,
  parentFormData = {},
  schoolFormData = {},
) => {
  const fieldsConfig = SECTION_QUESTIONNAIRE_FIELDS[sectionId];
  if (!fieldsConfig) return "";

  const formatFields = (fields, formData) =>
    (fields || [])
      .map(({ field, label }) => {
        const value = formData?.[field];
        if (value === undefined || value === null) return null;
        const text = String(value).trim();
        if (!text) return null;
        return `${label}: ${text}`;
      })
      .filter(Boolean);

  const parentLines = formatFields(fieldsConfig.parent, parentFormData);
  const schoolLines = formatFields(fieldsConfig.school, schoolFormData);

  const blocks = [];
  if (parentLines.length > 0) {
    blocks.push(`מתוך שאלון ההורים:\n${parentLines.join("\n")}`);
  }
  if (schoolLines.length > 0) {
    blocks.push(`מתוך שאלון בית הספר:\n${schoolLines.join("\n")}`);
  }

  return blocks.join("\n\n");
};

module.exports = { SECTION_QUESTIONNAIRE_FIELDS, buildQuestionnaireContext };
