import React from "react";

// רכיבי עזר לתצוגה נקייה
const RenderSection = ({ title, children }) => (
  <div className="mb-10 border-b border-gray-100 pb-8 text-right" dir="rtl">
    <h5 className="text-xl font-bold text-blue-800 mb-6 bg-blue-50 px-4 py-2 rounded-lg w-fit shadow-sm">
      {title}
    </h5>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
      {children}
    </div>
  </div>
);

const AnswerBox = ({ label, value, wide = false }) => (
  <div
    className={`flex flex-col gap-1 text-right ${wide ? "md:col-span-2 lg:col-span-3" : ""}`}
  >
    <span className="text-xs font-bold text-gray-500 mb-1">{label}</span>
    <div className="text-md text-gray-900 font-medium bg-gray-50 p-3 rounded-xl border border-gray-200 min-h-[45px] flex items-center shadow-inner">
      {value || <span className="text-gray-300 italic">לא הוזן</span>}
    </div>
  </div>
);

const DataTable = ({ headers, rows }) => (
  <div className="col-span-full mt-4 overflow-hidden border border-gray-200 rounded-xl shadow-sm">
    <table className="w-full text-right border-collapse" dir="rtl">
      <thead>
        <tr className="bg-gray-100">
          {headers.map((h, i) => (
            <th
              key={i}
              className="p-3 text-sm font-bold text-gray-600 border-b"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="hover:bg-white transition-colors">
            {row.map((cell, j) => (
              <td
                key={j}
                className="p-3 text-sm text-gray-800 border-b border-gray-100"
              >
                {cell || "—"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const QuestionnaireViewer = ({ data }) => {
  if (!data || !data.formData) {
    return (
      <div className="p-10 text-center text-gray-500 italic">
        ממתין לנתוני השאלון...
      </div>
    );
  }

  const { formData } = data;

  return (
    <div
      className="bg-white p-8 rounded-3xl animate-fadeIn font-sans shadow-lg"
      dir="rtl"
    >
      {/* 1. פרטים אישיים */}
      <RenderSection title="פרטים אישיים">
        <AnswerBox
          label="שם הילד/ה"
          value={`${formData.childFirstName} ${formData.childLastName}`}
        />
        <AnswerBox label="ת.ז" value={formData.idNumber} />
        <AnswerBox label="תאריך לידה" value={formData.birthDate} />
        <AnswerBox label="מין" value={formData.gender} />
        <AnswerBox label="שם האב" value={formData.fatherName} />
        <AnswerBox label="שם האם" value={formData.motherName} />
        <AnswerBox label="מצב משפחתי" value={formData.familyStatus} />
        <AnswerBox label="שפה בבית" value={formData.homeLanguage} />
        <AnswerBox label="כתובת" value={formData.address} wide />
        <AnswerBox
          label="הערות למצב המשפחתי"
          value={formData.familyNotes}
          wide
        />
      </RenderSection>

      {/* 2. סיבת הפנייה */}
      <RenderSection title="סיבת הפנייה ואבחונים קודמים">
        <AnswerBox
          label="תיאור הקושי"
          value={formData.difficultyDescription}
          wide
        />
        <AnswerBox label="מטרות הפנייה" value={formData.referralGoals} wide />
        <AnswerBox label="מתי התחילו הקשיים?" value={formData.onsetTime} />
        <AnswerBox label="סוג אבחון קודם" value={formData.assessmentType} />
        <AnswerBox
          label="המלצות אבחונים"
          value={formData.assessmentRecommendations}
          wide
        />
        <AnswerBox
          label="טיפולים פרא-רפואיים"
          value={formData.paraMedicalTreatments}
          wide
        />
      </RenderSection>

      {/* 3. מהלך הלימודים */}
      <RenderSection title="היסטוריה לימודית">
        <AnswerBox
          label="גיל יציאה למסגרת"
          value={formData.firstFrameworkAge}
        />
        <AnswerBox
          label="סוג מסגרת ראשונה"
          value={formData.firstFrameworkType}
        />
        <AnswerBox
          label="דיווח גן חובה"
          value={formData.preSchoolReports}
          wide
        />
        <DataTable
          headers={["כיתה", "בית ספר", "יישוב"]}
          rows={
            formData.schoolHistory?.map((s) => [s.grade, s.school, s.city]) ||
            []
          }
        />
        <AnswerBox label="נשאר כיתה?" value={formData.stayedGrade} />
        <AnswerBox label="סיבה" value={formData.stayedGradeReason} />
      </RenderSection>

      {/* 4. הערכת תפקוד */}
      <RenderSection title="הערכת תפקוד כללית">
        <AnswerBox label="תפקוד לימודי" value={formData.functioning?.studies} />
        <AnswerBox label="תפקוד משפחתי" value={formData.functioning?.family} />
        <AnswerBox label="תפקוד חברתי" value={formData.functioning?.social} />
        <AnswerBox
          label="הערות תפקוד"
          value={formData.functioning?.notes}
          wide
        />
      </RenderSection>

      {/* 5. פרטים על המשפחה */}
      <RenderSection title="מבנה המשפחה">
        <AnswerBox
          label="שם האם (בטבלה)"
          value={formData.familyStructure?.motherNameInTable}
        />
        <AnswerBox
          label="עיסוק האם"
          value={formData.familyStructure?.motherJob}
        />
        <AnswerBox
          label="שם האב (בטבלה)"
          value={formData.familyStructure?.fatherNameInTable}
        />
        <AnswerBox
          label="עיסוק האב"
          value={formData.familyStructure?.fatherJob}
        />
        <div className="col-span-full font-bold text-gray-600 mt-4 mb-2">
          אחים:
        </div>
        <DataTable
          headers={["שם", "גיל", "מסגרת", "הערות"]}
          rows={
            formData.familyStructure?.siblings?.map((s) => [
              s.name,
              s.age,
              s.framework,
              s.notes,
            ]) || []
          }
        />
      </RenderSection>

      {/* 6. בריאות ורקע התפתחותי */}
      <RenderSection title="בריאות והתפתחות">
        <AnswerBox
          label="מצב בריאותי כללי"
          value={formData.generalHealth}
          wide
        />
        <AnswerBox label="ממצא בדיקת ראייה" value={formData.visionFindings} />
        <AnswerBox label="ממצא בדיקת שמיעה" value={formData.hearingFindings} />
        <AnswerBox
          label="הריון תקין?"
          value={formData.development?.normalPregnancy}
        />
        <AnswerBox
          label="משקל לידה"
          value={formData.development?.birthWeight}
        />
        <AnswerBox label="גיל הליכה" value={formData.development?.walkingAge} />
        <AnswerBox
          label="גיל דיבור (מילים ראשונות)"
          value={formData.development?.firstWordsAge}
        />
        <AnswerBox
          label="גיל גמילה מחיתולים"
          value={formData.development?.diaperGraduationAge}
        />
      </RenderSection>

      {/* 8. הילד היום */}
      <RenderSection title="התנהגות ותפקוד בבית">
        <AnswerBox
          label="בעיות אוכל/שינה/פחדים"
          value={formData.currentProblems?.foodSleepFearsDetails}
          wide
        />
        <AnswerBox
          label="חוסר מנוחה/פעילות יתר"
          value={formData.currentProblems?.restlessness}
        />
        <AnswerBox
          label="מתרגש בקלות"
          value={formData.currentProblems?.excitedEasily}
        />
        <AnswerBox
          label="מפריע לאחרים"
          value={formData.currentProblems?.disturbsOthers}
        />
        <AnswerBox
          label="תלותי/עצמאי"
          value={formData.currentProblems?.dependencyVsIndependence}
        />
        <AnswerBox
          label="למי קרוב יותר?"
          value={formData.currentProblems?.closerToWho}
        />
      </RenderSection>

      {/* 10. סדר יום */}
      <RenderSection title="סדר יום אופייני">
        <DataTable
          headers={["שעה", "פעילות"]}
          rows={formData.dailyRoutine?.map((r) => [r.time, r.activity]) || []}
        />
      </RenderSection>

      <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col items-center gap-2">
        <p className="text-gray-800 font-bold">
          חתימת הורים: {formData.parentsSignature || "—"}
        </p>
        <p className="text-xs text-gray-400">
          הוגש בתאריך: {new Date(data.submittedAt).toLocaleString("he-IL")}
        </p>
      </div>
    </div>
  );
};

export default QuestionnaireViewer;
