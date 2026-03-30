import React, { useState, useEffect } from "react";
import therapistService from "../services/therapist.service";
import schoolQuestionnaireService from "../services/schoolQuestionnaire.service"; // ייבוא הסרביס החדש
import QuestionnaireViewer from "./QuestionnaireViewer";
import SchoolSurveyTab from "./SchoolSurveyTab"; // הקומפוננטה שבנינו לתצוגת שאלון בית ספר
import SchoolSurveyView from "./SchoolSurveyView"; // קומפוננטה חדשה לתצוגת שאלון בית ספר
import GenericMessageModal from "./GenericMessageModal";
import { useAuth } from "../contexts/AuthContext";

const DiagnosisView = ({ diagnosis, onBack, childName }) => {
  const [activeSubTab, setActiveSubTab] = useState("questionnaires");

  // ניהול צפייה בשאלונים
  const [currentlyviewing, setCurrentlyViewing] = useState("parent"); // 'parent' או 'school'
  const [parentAnswers, setParentAnswers] = useState(null);
  const [schoolAnswers, setSchoolAnswers] = useState(null);

  const [loading, setLoading] = useState(false);
  const [schoolLoading, setSchoolLoading] = useState(false);

  const [currentStatus, setCurrentStatus] = useState(
    diagnosis.parentQuestionnaireStatus,
  );
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const { currentUser } = useAuth();

  // טעינת שאלון הורים
  useEffect(() => {
    if (activeSubTab === "questionnaires" && currentStatus === "נשלח") {
      fetchParentAnswers();
    }
  }, [activeSubTab, currentStatus]);

  // טעינת שאלון בית ספר
  useEffect(() => {
    if (activeSubTab === "questionnaires") {
      fetchSchoolAnswers();
    }
  }, [activeSubTab]);

  const fetchParentAnswers = async () => {
    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      const data = await therapistService.getParentAnswers(
        diagnosis.childId,
        token,
      );
      setParentAnswers(data);
    } catch (err) {
      console.error("Error fetching parent answers:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchoolAnswers = async () => {
    try {
      setSchoolLoading(true);
      const token = await currentUser.getIdToken();
      const data = await schoolQuestionnaireService.getSurveyForTherapist(
        diagnosis.childId,
        token,
      );
      setSchoolAnswers(data);
    } catch (err) {
      console.error("Error fetching school answers:", err);
    } finally {
      setSchoolLoading(false);
    }
  };

  const handleConfirmCorrection = async (messageText) => {
    try {
      const token = await currentUser.getIdToken();
      const finalMessage = messageText.trim()
        ? messageText
        : `שלום, השאלון הוחזר אליכם לתיקון או הוספת פרטים. נא להיכנס ללשונית "אישורים וטפסים" ולעדכן. תודה!`;

      await therapistService.updateQuestionnaireStatus(
        diagnosis.id,
        "לתיקון",
        token,
        diagnosis.childId,
      );

      const messagePayload = {
        receiverId: diagnosis.parentId || parentAnswers?.parentId,
        childId: diagnosis.childId,
        text: finalMessage,
      };
      await therapistService.sendMessage(messagePayload, token);

      alert("השאלון הוחזר לתיקון והודעה נשלחה להורים.");
      setCurrentStatus("לתיקון");
      setIsCorrectionModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("שגיאה בתהליך ההחזרה לתיקון.");
    }
  };

  const renderSubContent = () => {
    switch (activeSubTab) {
      // case "questionnaires":
      //   return (
      //     <div className="space-y-6 animate-fadeIn text-right" dir="rtl">
      //       {/* גריד של כרטיסי השאלונים */}
      //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      //         {/* כרטיס שאלון הורים */}
      //         <div
      //           onClick={() => setCurrentlyViewing("parent")}
      //           className={`p-5 border rounded-2xl cursor-pointer transition-all shadow-sm flex justify-between items-center ${currentlyviewing === "parent" ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500" : "border-gray-100 bg-white hover:border-blue-200"}`}
      //         >
      //           <div>
      //             <h5 className="font-bold text-gray-800">🏠 שאלון הורים</h5>
      //             <div className="flex items-center gap-2 mt-1">
      //               <span
      //                 className={`w-2 h-2 rounded-full ${currentStatus === "נשלח" ? "bg-green-500" : "bg-orange-500"}`}
      //               ></span>
      //               <p className="text-sm text-gray-500 font-medium">
      //                 סטטוס: {currentStatus}
      //               </p>
      //             </div>
      //           </div>
      //           {currentStatus === "נשלח" && (
      //             <button
      //               onClick={(e) => {
      //                 e.stopPropagation();
      //                 setIsCorrectionModalOpen(true);
      //               }}
      //               className="bg-white text-orange-600 border border-orange-200 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-orange-50"
      //             >
      //               ↩ לתיקון
      //             </button>
      //           )}
      //         </div>

      //         {/* כרטיס שאלון בית ספר */}
      //         <div
      //           onClick={() => setCurrentlyViewing("school")}
      //           className={`p-5 border rounded-2xl cursor-pointer transition-all shadow-sm flex flex-col gap-4 ${currentlyviewing === "school" ? "border-green-500 bg-green-50/50 ring-1 ring-green-500" : "border-gray-100 bg-white hover:border-green-200"}`}
      //         >
      //           <div className="flex justify-between items-center">
      //             <div>
      //               <h5 className="font-bold text-gray-800">
      //                 🏫 שאלון בית ספר
      //               </h5>
      //               <div className="flex items-center gap-2 mt-1">
      //                 <span
      //                   className={`w-2 h-2 rounded-full ${schoolAnswers ? "bg-green-500" : "bg-orange-400"}`}
      //                 ></span>
      //                 <p className="text-sm text-gray-500 font-medium">
      //                   {schoolAnswers
      //                     ? `התקבל מ- ${schoolAnswers.teacherName}`
      //                     : "ממתין למילוי מורה"}
      //                 </p>
      //               </div>
      //             </div>
      //           </div>

      //           {/* כפתורי ניהול למאבחן (רק אם לא התקבל שאלון עדיין) */}
      //           {!schoolAnswers && (
      //             <div className="flex gap-2 border-t border-gray-100 pt-3 mt-auto">
      //               <button
      //                 onClick={async (e) => {
      //                   e.stopPropagation();
      //                   if (window.confirm("לשלוח שוב את המייל למורה?")) {
      //                     const token = await currentUser.getIdToken();
      //                     await schoolQuestionnaireService.resendInvite(
      //                       diagnosis.childId,
      //                       token,
      //                     );
      //                     alert("הנשלח שוב!");
      //                   }
      //                 }}
      //                 className="flex-1 text-[10px] font-bold py-1 px-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100"
      //               >
      //                 שליחה חוזרת
      //               </button>
      //               <button
      //                 onClick={async (e) => {
      //                   e.stopPropagation();
      //                   if (
      //                     window.confirm(
      //                       "איפוס ימחק את הקישור הקיים ויאפשר להורה לשלוח פרטים של מורה חדש. להמשיך?",
      //                     )
      //                   ) {
      //                     const token = await currentUser.getIdToken();
      //                     await schoolQuestionnaireService.resetInvite(
      //                       diagnosis.childId,
      //                       token,
      //                     );
      //                     window.location.reload(); // רענון כדי לעדכן את הממשק
      //                   }
      //                 }}
      //                 className="flex-1 text-[10px] font-bold py-1 px-2 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
      //               >
      //                 איפוס הזמנה
      //               </button>
      //             </div>
      //           )}
      //         </div>
      //         {/* כרטיס שאלון בית ספר */}
      //         {/* <div
      //           onClick={() => setCurrentlyViewing("school")}
      //           className={`p-5 border rounded-2xl cursor-pointer transition-all shadow-sm flex justify-between items-center ${currentlyviewing === "school" ? "border-green-500 bg-green-50/50 ring-1 ring-green-500" : "border-gray-100 bg-white hover:border-green-200"}`}
      //         >
      //           <div>
      //             <h5 className="font-bold text-gray-800">🏫 שאלון בית ספר</h5>
      //             <div className="flex items-center gap-2 mt-1">
      //               <span
      //                 className={`w-2 h-2 rounded-full ${schoolAnswers ? "bg-green-500" : "bg-gray-300"}`}
      //               ></span>
      //               <p className="text-sm text-gray-500 font-medium">
      //                 {schoolAnswers
      //                   ? `התקבל מ- ${schoolAnswers.teacherName}`
      //                   : "טרם התקבל דיווח"}
      //               </p>
      //             </div>
      //           </div>
      //         </div> */}
      //       </div>

      //       {/* אזור הצגת התוכן הנבחר */}
      //       <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm min-h-[400px]">
      //         {currentlyviewing === "parent" ? (
      //           currentStatus === "נשלח" ? (
      //             loading ? (
      //               <div className="p-20 text-center animate-pulse text-blue-500 font-bold">
      //                 טוען תשובות הורים...
      //               </div>
      //             ) : (
      //               <QuestionnaireViewer data={parentAnswers} />
      //             )
      //           ) : (
      //             <div className="p-20 text-center text-gray-400 border-2 border-dashed border-gray-50 rounded-2xl">
      //               <p className="text-lg">
      //                 השאלון נמצא כרגע בסטטוס: {currentStatus}
      //               </p>
      //             </div>
      //           )
      //         ) : schoolLoading ? (
      //           <div className="p-20 text-center animate-pulse text-green-500 font-bold">
      //             טוען נתוני בית ספר...
      //           </div>
      //         ) : (
      //           <SchoolSurveyView data={schoolAnswers} />
      //           // <SchoolSurveyTab
      //           //   surveyData={schoolAnswers}
      //           //   loading={schoolLoading}
      //           // />
      //         )}
      //       </div>
      //     </div>
      //   );

      case "questionnaires":
        return (
          <div className="space-y-6 animate-fadeIn text-right" dir="rtl">
            {/* גריד המלבנים (כרטיסים) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* כרטיס שאלון הורים */}
              <div
                onClick={() => setCurrentlyViewing("parent")}
                className={`p-6 border rounded-[2rem] cursor-pointer transition-all shadow-sm flex flex-col justify-between min-h-[160px] ${
                  currentlyviewing === "parent"
                    ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500"
                    : "border-gray-100 bg-white hover:border-blue-200"
                }`}
              >
                <div>
                  <h5 className="font-bold text-gray-800 text-lg">
                    🏠 שאלון הורים
                  </h5>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${currentStatus === "נשלח" ? "bg-green-500" : "bg-orange-500"}`}
                    ></span>
                    <p className="text-sm text-gray-500 font-medium">
                      סטטוס: {currentStatus}
                    </p>
                  </div>
                </div>

                {currentStatus === "נשלח" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCorrectionModalOpen(true);
                    }}
                    className="mt-4 w-full bg-white text-orange-600 border border-orange-200 py-2 rounded-xl text-xs font-bold hover:bg-orange-50 transition-all shadow-sm"
                  >
                    ↩ החזר לתיקון הורים
                  </button>
                )}
              </div>

              {/* כרטיס שאלון בית ספר */}
              <div
                onClick={() => setCurrentlyViewing("school")}
                className={`p-6 border rounded-[2rem] cursor-pointer transition-all shadow-sm flex flex-col justify-between min-h-[180px] ${
                  currentlyviewing === "school"
                    ? "border-green-500 bg-green-50/50 ring-1 ring-green-500"
                    : "border-gray-100 bg-white hover:border-green-200"
                }`}
              >
                <div>
                  <h5 className="font-bold text-gray-800 text-lg text-right">
                    🏫 שאלון בית ספר
                  </h5>
                  <div className="flex items-center gap-2 mt-2">
                    {/* ירוק אם מולא, כתום אם ממתין */}
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${schoolAnswers?.formData ? "bg-green-500" : "bg-orange-400"}`}
                    ></span>
                    <p className="text-sm text-gray-500 font-medium">
                      {schoolAnswers?.formData
                        ? `התקבל מ- ${schoolAnswers.teacherName}`
                        : "ממתין למילוי מורה"}
                    </p>
                  </div>
                </div>

                {/* הכפתורים יוצגו רק אם המורה כבר מילא את השאלון (כדי לאפשר תיקון/איפוס) */}
                {schoolAnswers?.formData && !schoolLoading && (
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (
                          window.confirm(
                            "להחזיר את השאלון למורה לתיקון? המורה יוכל לערוך את התשובות שוב.",
                          )
                        ) {
                          const token = await currentUser.getIdToken();
                          // כאן אפשר להשתמש בפונקציית resend או פונקציה ייעודית לתיקון
                          await schoolQuestionnaireService.resendInvite(
                            diagnosis.childId,
                            token,
                          );
                          alert("הודעה נשלחה למורה!");
                        }
                      }}
                      className="flex-1 text-[11px] font-bold py-2 rounded-xl bg-white text-orange-600 border border-orange-200 hover:bg-orange-50 shadow-sm transition-all"
                    >
                      ↩️ החזר לתיקון
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (
                          window.confirm(
                            "איפוס מוחלט: התשובות הקיימות יימחקו וההורה יוכל לשלוח קישור מחדש. להמשיך?",
                          )
                        ) {
                          const token = await currentUser.getIdToken();
                          await schoolQuestionnaireService.resetInvite(
                            diagnosis.childId,
                            token,
                          );
                          window.location.reload();
                        }
                      }}
                      className="flex-1 text-[11px] font-bold py-2 rounded-xl bg-white text-red-600 border border-red-100 hover:bg-red-50 shadow-sm transition-all"
                    >
                      🗑️ איפוס מוחלט
                    </button>
                  </div>
                )}

                {/* הודעה קטנה אם זה עדיין בטעינה כדי למנוע קפיצות */}
                {schoolLoading && (
                  <div className="text-[10px] text-gray-400 animate-pulse mt-4 italic">
                    בודק סטטוס...
                  </div>
                )}
              </div>
            </div>

            {/* אזור התצוגה המרכזי של השאלונים */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm min-h-[400px]">
              {currentlyviewing === "parent" ? (
                currentStatus === "נשלח" && parentAnswers ? (
                  loading ? (
                    <p className="text-center p-10 animate-pulse">טוען...</p>
                  ) : (
                    <QuestionnaireViewer data={parentAnswers} />
                  )
                ) : (
                  <div className="p-20 text-center text-gray-400 border-2 border-dashed border-gray-50 rounded-2xl">
                    <p className="text-lg">
                      שאלון הורים טרם נשלח או נמצא בתיקון
                    </p>
                  </div>
                )
              ) : /* תצוגת שאלון בית ספר */
              schoolLoading ? (
                <p className="text-center p-10 animate-pulse text-green-600 font-bold">
                  טוען נתוני בית ספר...
                </p>
              ) : schoolAnswers?.formData ? (
                <SchoolSurveyView data={schoolAnswers} />
              ) : (
                <div className="p-20 text-center text-gray-400 border-2 border-dashed border-gray-50 rounded-2xl">
                  <p className="text-lg">טרם התקבל דיווח מהמורה</p>
                  <p className="text-sm mt-2 font-medium">
                    ניתן לשלוח תזכורת למורה מהכפתור למעלה
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      case "report":
        return (
          <div className="p-20 text-center text-gray-400">
            הנפקת דוח - בקרוב
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="font-sans animate-fadeIn" dir="rtl">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-5">
          <button
            onClick={onBack}
            className="bg-white border border-gray-200 hover:border-blue-300 text-gray-600 w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm group"
          >
            <span className="text-2xl group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">ניהול אבחון</h3>
            {childName && (
              <p className="text-blue-600 font-medium">מטופל/ת: {childName}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-10 bg-gray-100/60 p-1.5 rounded-2xl w-fit">
        {[
          { id: "questionnaires", label: "שאלונים", icon: "📋" },
          { id: "report", label: "הנפקת דוח", icon: "📄" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${activeSubTab === tab.id ? "bg-white text-blue-600 shadow-md" : "text-gray-400 hover:text-gray-600"}`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">{renderSubContent()}</div>

      <GenericMessageModal
        isOpen={isCorrectionModalOpen}
        onClose={() => setIsCorrectionModalOpen(false)}
        onSend={handleConfirmCorrection}
        title="החזרת שאלון לתיקון"
        placeholder="הוסיפי הערות להורים (מה עליהם לתקן)..."
      />
    </div>
  );
};

export default DiagnosisView;
