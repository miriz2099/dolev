import React from "react";

const SchoolSurveyTab = ({ surveyData, loading }) => {
  if (loading)
    return (
      <div className="p-10 text-center animate-pulse">
        טוען נתונים מבית הספר...
      </div>
    );

  if (!surveyData)
    return (
      <div className="p-16 border-2 border-dashed border-gray-100 rounded-3xl text-center bg-gray-50/50">
        <div className="text-5xl mb-4 opacity-30">🏫</div>
        <p className="text-gray-500 font-medium">
          טרם התקבל שאלון ממולא מבית הספר.
        </p>
      </div>
    );

  const { formData, teacherName, teacherEmail, submittedAt } = surveyData;

  return (
    <div className="space-y-6 animate-fadeIn font-sans text-right" dir="rtl">
      {/* כרטיס מידע כללי */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 rounded-[2rem] text-white shadow-lg flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold mb-2 text-white">
            חוות דעת צוות חינוכי
          </h3>
          <p className="opacity-90">
            מורה מדווח/ת: <span className="font-bold">{teacherName}</span> (
            {teacherEmail})
          </p>
        </div>
        <div className="text-left">
          <p className="text-xs opacity-75">תאריך שליחה:</p>
          <p className="font-mono font-bold text-white">
            {new Date(submittedAt).toLocaleDateString("he-IL")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* סעיף: הישגים לימודיים */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h4 className="text-lg font-bold text-blue-800 mb-4 border-b pb-2">
            📊 הישגים לימודיים
          </h4>
          <div className="space-y-3">
            <p>
              <span className="font-bold text-gray-700 ml-2">רמה אקדמית:</span>{" "}
              {formData.academicLevel}
            </p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-xs text-gray-400 block mb-1">
                הערות על קריאה:
              </span>
              <p className="text-sm">{formData.reading || "אין הערות"}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-xs text-gray-400 block mb-1">
                הערות על חשבון:
              </span>
              <p className="text-sm">{formData.math || "אין הערות"}</p>
            </div>
          </div>
        </div>

        {/* סעיף: התנהגות בכיתה (סולם) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h4 className="text-lg font-bold text-blue-800 mb-4 border-b pb-2">
            🧠 התנהגות וקשב
          </h4>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center">
              <span>דעתו מוסחת בקלות:</span>
              <span className="font-bold text-blue-600">
                {formData.distractedEasily}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>מתקשה להתרכז:</span>
              <span className="font-bold text-blue-600">
                {formData.hardToFocus}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>תנועתיות יתרה:</span>
              <span className="font-bold text-blue-600">
                {formData.excessiveMovement}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* סיכום המורה */}
      <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
        <h4 className="text-lg font-bold text-amber-900 mb-3">
          📝 סיכום והתרשמות המורה:
        </h4>
        <p className="text-gray-800 leading-relaxed">
          {formData.studentSummary}
        </p>
        <p className="mt-4 text-sm font-bold text-amber-800 italic">
          "שאלה אבחונית: {formData.diagnosticQuestion}"
        </p>
      </div>
    </div>
  );
};

export default SchoolSurveyTab;
