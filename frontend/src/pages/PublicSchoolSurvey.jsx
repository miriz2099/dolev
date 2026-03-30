// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import schoolQuestionnaireService from "../services/schoolQuestionnaire.service"; // ייבוא הסרביס

// const PublicSchoolSurvey = () => {
//   const { token } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const verifyToken = async () => {
//       try {
//         setLoading(true);
//         // שימוש בסרביס במקום ב-fetch ישיר
//         const result = await schoolQuestionnaireService.checkInvitation(token);
//         setData(result);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (token) {
//       verifyToken();
//     }
//   }, [token]);

//   if (loading)
//     return (
//       <div className="p-20 text-center font-bold animate-pulse text-blue-600">
//         מאמת קישור מאובטח...
//       </div>
//     );

//   if (error)
//     return (
//       <div className="p-20 text-center text-red-600 font-sans" dir="rtl">
//         <div className="text-5xl mb-4">⚠️</div>
//         <h2 className="text-2xl font-bold mb-2">אופס! חלה שגיאה</h2>
//         <p>{error}</p>
//         <p className="mt-4 text-sm text-gray-500">
//           נסי לבקש מההורים לשלוח קישור חדש.
//         </p>
//       </div>
//     );

//   return (
//     <div
//       className="p-8 max-w-4xl mx-auto font-sans text-right min-h-screen"
//       dir="rtl"
//     >
//       <div className="bg-white shadow-2xl rounded-3xl p-10 border border-gray-100 animate-fadeIn">
//         <h1 className="text-3xl font-bold text-blue-900 mb-2">
//           שלום {data.teacherName},
//         </h1>
//         <p className="text-lg text-gray-600 mb-8">
//           תודה על שיתוף הפעולה. את/ה ממלא/ת כעת שאלון תפקודי עבור התלמיד/ה:
//           <span className="font-bold text-gray-900"> {data.childName}</span>
//         </p>

//         <hr className="mb-8 border-gray-100" />

//         {/* כאן תבוא קומפוננטת השאלון האמיתית שלכן */}
//         <div className="bg-blue-50/50 p-12 rounded-2xl border-2 border-dashed border-blue-100 text-center">
//           <p className="text-blue-400 font-medium italic">
//             השאלון לבית הספר ייטען כאן...
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PublicSchoolSurvey;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import schoolQuestionnaireService from "../services/schoolQuestionnaire.service";
import SchoolQuestionnaire from "../components/SchoolQuestionnaire"; // ייבוא הקומפוננטה ששלחת

const PublicSchoolSurvey = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        setLoading(true);
        // בדיקת הטוקן מול ה-Backend
        const result = await schoolQuestionnaireService.checkInvitation(token);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) verifyToken();
  }, [token]);

  // פונקציה שמופעלת כשהמורה לוחץ על "שלח טופס" בתוך SchoolQuestionnaire
  const handleFinalSubmit = async (formData) => {
    try {
      setLoading(true);
      // שליחת התשובות לסרביס (ה-POST שכתבנו בבאקנד)
      await schoolQuestionnaireService.submitSurvey(token, formData);
      setIsSubmitted(true);
    } catch (err) {
      alert("שגיאה בשליחת השאלון: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async (formData) => {
    try {
      await schoolQuestionnaireService.saveDraft(token, formData);
    } catch (err) {
      console.error("Draft save failed", err);
    }
  };
  if (loading)
    return (
      <div className="p-20 text-center font-bold animate-pulse text-blue-600 font-sans">
        מעבד נתונים...
      </div>
    );

  if (isSubmitted)
    return (
      <div className="p-20 text-center font-sans" dir="rtl">
        <div className="bg-white shadow-xl rounded-3xl p-12 max-w-2xl mx-auto border border-green-100">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            השאלון נשלח בהצלחה!
          </h2>
          <p className="text-gray-600 text-lg">
            תודה רבה על שיתוף הפעולה. המידע הועבר בצורה מאובטחת למאבחן.
          </p>
          <p className="text-sm text-gray-400 mt-6">ניתן לסגור חלון זה.</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-20 text-center text-red-600 font-sans" dir="rtl">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-2">קישור לא תקין</h2>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4" dir="rtl">
      <div className="max-w-5xl mx-auto mb-6 px-4">
        <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">שלום {data?.teacherName}</h1>
            <p className="opacity-90 text-sm">
              מילוי חוות דעת עבור התלמיד/ה: {data?.childName}
            </p>
          </div>
          <span className="bg-blue-500 text-xs px-3 py-1 rounded-full border border-blue-400">
            קישור מאובטח
          </span>
        </div>
      </div>

      {/* כאן אנחנו מחברים את הקומפוננטה שלך */}
      <SchoolQuestionnaire
        formId={token}
        initialData={data?.draftData} // הוספת ה-Prop הזה
        onSave={handleFinalSubmit}
        onSaveDraft={handleSaveDraft}
        onCancel={() => window.close()}
      />

      <p className="text-center text-gray-400 text-xs mt-8 pb-10">
        כל הזכויות שמורות למערכת האבחון הדיגיטלית &copy;{" "}
        {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default PublicSchoolSurvey;
