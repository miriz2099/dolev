// import React, { useState, useEffect } from "react";
// import therapistService from "../services/therapist.service";
// import schoolQuestionnaireService from "../services/schoolQuestionnaire.service"; // ייבוא הסרביס החדש
// import QuestionnaireViewer from "./QuestionnaireViewer";
// import SchoolSurveyTab from "./SchoolSurveyTab"; // הקומפוננטה שבנינו לתצוגת שאלון בית ספר
// import SchoolSurveyView from "./SchoolSurveyView"; // קומפוננטה חדשה לתצוגת שאלון בית ספר
// import GenericMessageModal from "./GenericMessageModal";
// import { useAuth } from "../contexts/AuthContext";

// import RequiredAssessmentsManager from "./RequiredAssessmentsManager";

// const DiagnosisView = ({ diagnosis, onBack, childName, onDeleted }) => {
//   const [activeSubTab, setActiveSubTab] = useState("questionnaires");

//   // ניהול צפייה בשאלונים
//   const [currentlyviewing, setCurrentlyViewing] = useState("parent"); // 'parent' או 'school'
//   const [parentAnswers, setParentAnswers] = useState(null);
//   const [schoolAnswers, setSchoolAnswers] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [schoolLoading, setSchoolLoading] = useState(false);

//   const [currentStatus, setCurrentStatus] = useState(
//     diagnosis.parentQuestionnaireStatus,
//   );
//   const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
//   const { currentUser } = useAuth();

//   const [currentDiagnosis, setCurrentDiagnosis] = useState(diagnosis);

//   // טעינת שאלון הורים
//   useEffect(() => {
//     if (activeSubTab === "questionnaires" && currentStatus === "נשלח") {
//       fetchParentAnswers();
//     }
//   }, [activeSubTab, currentStatus]);

//   // טעינת שאלון בית ספר
//   useEffect(() => {
//     if (activeSubTab === "questionnaires") {
//       fetchSchoolAnswers();
//     }
//   }, [activeSubTab]);

//   const refreshDiagnosis = async () => {
//     try {
//       const token = await currentUser.getIdToken();
//       const allDiagnoses = await therapistService.getDiagnoses(
//         diagnosis.childId,
//         token,
//       );
//       const updated = allDiagnoses.find((d) => d.id === diagnosis.id);
//       if (updated) setCurrentDiagnosis(updated);
//     } catch (err) {
//       console.error("Error refreshing diagnosis:", err);
//     }
//   };

//   const fetchParentAnswers = async () => {
//     try {
//       setLoading(true);
//       const token = await currentUser.getIdToken();
//       const data = await therapistService.getParentAnswers(
//         diagnosis.id,
//         token,
//       );
//       setParentAnswers(data);
//     } catch (err) {
//       console.error("Error fetching parent answers:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSchoolAnswers = async () => {
//     try {
//       setSchoolLoading(true);
//       const token = await currentUser.getIdToken();
//       const data = await schoolQuestionnaireService.getSurveyForTherapist(
//         diagnosis.id,
//         token,
//       );
//       setSchoolAnswers(data);
//     } catch (err) {
//       console.error("Error fetching school answers:", err);
//     } finally {
//       setSchoolLoading(false);
//     }
//   };

//   const handleConfirmCorrection = async (messageText) => {
//     try {
//       const token = await currentUser.getIdToken();
//       const finalMessage = messageText.trim()
//         ? messageText
//         : `שלום, השאלון הוחזר אליכם לתיקון או הוספת פרטים. נא להיכנס ללשונית "אישורים וטפסים" ולעדכן. תודה!`;

//       await therapistService.updateQuestionnaireStatus(
//         diagnosis.id,
//         "לתיקון",
//         token,
//         diagnosis.childId,
//       );

//       const messagePayload = {
//         receiverId: diagnosis.parentId || parentAnswers?.parentId,
//         childId: diagnosis.childId,
//         text: finalMessage,
//       };
//       await therapistService.sendMessage(messagePayload, token);

//       alert("השאלון הוחזר לתיקון והודעה נשלחה להורים.");
//       setCurrentStatus("לתיקון");
//       setIsCorrectionModalOpen(false);
//     } catch (err) {
//       console.error(err);
//       alert("שגיאה בתהליך ההחזרה לתיקון.");
//     }
//   };

//   const handleDeleteDiagnosis = async () => {
//     if (
//       !window.confirm(
//         "למחוק את האבחון לצמיתות? פעולה זו תמחק את כל הטפסים, השאלונים, טופס ההסכמה והתורים המשויכים לאבחון זה. לא ניתן לשחזר.",
//       )
//     ) {
//       return;
//     }
//     try {
//       const token = await currentUser.getIdToken();
//       await therapistService.deleteDiagnosis(diagnosis.id, token);
//       alert("האבחון נמחק בהצלחה");
//       if (onDeleted) onDeleted();
//       else if (onBack) onBack();
//     } catch (err) {
//       console.error("Error deleting diagnosis:", err);
//       alert("שגיאה במחיקת האבחון");
//     }
//   };

//   const renderSubContent = () => {
//     switch (activeSubTab) {
//       // case "questionnaires":
//       //   return (
//       //     <div className="space-y-6 animate-fadeIn text-right" dir="rtl">
//       //       {/* גריד של כרטיסי השאלונים */}
//       //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//       //         {/* כרטיס שאלון הורים */}
//       //         <div
//       //           onClick={() => setCurrentlyViewing("parent")}
//       //           className={`p-5 border rounded-2xl cursor-pointer transition-all shadow-sm flex justify-between items-center ${currentlyviewing === "parent" ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500" : "border-gray-100 bg-white hover:border-blue-200"}`}
//       //         >
//       //           <div>
//       //             <h5 className="font-bold text-gray-800">🏠 שאלון הורים</h5>
//       //             <div className="flex items-center gap-2 mt-1">
//       //               <span
//       //                 className={`w-2 h-2 rounded-full ${currentStatus === "נשלח" ? "bg-green-500" : "bg-orange-500"}`}
//       //               ></span>
//       //               <p className="text-sm text-gray-500 font-medium">
//       //                 סטטוס: {currentStatus}
//       //               </p>
//       //             </div>
//       //           </div>
//       //           {currentStatus === "נשלח" && (
//       //             <button
//       //               onClick={(e) => {
//       //                 e.stopPropagation();
//       //                 setIsCorrectionModalOpen(true);
//       //               }}
//       //               className="bg-white text-orange-600 border border-orange-200 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-orange-50"
//       //             >
//       //               ↩ לתיקון
//       //             </button>
//       //           )}
//       //         </div>

//       //         {/* כרטיס שאלון בית ספר */}
//       //         <div
//       //           onClick={() => setCurrentlyViewing("school")}
//       //           className={`p-5 border rounded-2xl cursor-pointer transition-all shadow-sm flex flex-col gap-4 ${currentlyviewing === "school" ? "border-green-500 bg-green-50/50 ring-1 ring-green-500" : "border-gray-100 bg-white hover:border-green-200"}`}
//       //         >
//       //           <div className="flex justify-between items-center">
//       //             <div>
//       //               <h5 className="font-bold text-gray-800">
//       //                 🏫 שאלון בית ספר
//       //               </h5>
//       //               <div className="flex items-center gap-2 mt-1">
//       //                 <span
//       //                   className={`w-2 h-2 rounded-full ${schoolAnswers ? "bg-green-500" : "bg-orange-400"}`}
//       //                 ></span>
//       //                 <p className="text-sm text-gray-500 font-medium">
//       //                   {schoolAnswers
//       //                     ? `התקבל מ- ${schoolAnswers.teacherName}`
//       //                     : "ממתין למילוי מורה"}
//       //                 </p>
//       //               </div>
//       //             </div>
//       //           </div>

//       //           {/* כפתורי ניהול למאבחן (רק אם לא התקבל שאלון עדיין) */}
//       //           {!schoolAnswers && (
//       //             <div className="flex gap-2 border-t border-gray-100 pt-3 mt-auto">
//       //               <button
//       //                 onClick={async (e) => {
//       //                   e.stopPropagation();
//       //                   if (window.confirm("לשלוח שוב את המייל למורה?")) {
//       //                     const token = await currentUser.getIdToken();
//       //                     await schoolQuestionnaireService.resendInvite(
//       //                       diagnosis.childId,
//       //                       token,
//       //                     );
//       //                     alert("הנשלח שוב!");
//       //                   }
//       //                 }}
//       //                 className="flex-1 text-[10px] font-bold py-1 px-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100"
//       //               >
//       //                 שליחה חוזרת
//       //               </button>
//       //               <button
//       //                 onClick={async (e) => {
//       //                   e.stopPropagation();
//       //                   if (
//       //                     window.confirm(
//       //                       "איפוס ימחק את הקישור הקיים ויאפשר להורה לשלוח פרטים של מורה חדש. להמשיך?",
//       //                     )
//       //                   ) {
//       //                     const token = await currentUser.getIdToken();
//       //                     await schoolQuestionnaireService.resetInvite(
//       //                       diagnosis.childId,
//       //                       token,
//       //                     );
//       //                     window.location.reload(); // רענון כדי לעדכן את הממשק
//       //                   }
//       //                 }}
//       //                 className="flex-1 text-[10px] font-bold py-1 px-2 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
//       //               >
//       //                 איפוס הזמנה
//       //               </button>
//       //             </div>
//       //           )}
//       //         </div>
//       //         {/* כרטיס שאלון בית ספר */}
//       //         {/* <div
//       //           onClick={() => setCurrentlyViewing("school")}
//       //           className={`p-5 border rounded-2xl cursor-pointer transition-all shadow-sm flex justify-between items-center ${currentlyviewing === "school" ? "border-green-500 bg-green-50/50 ring-1 ring-green-500" : "border-gray-100 bg-white hover:border-green-200"}`}
//       //         >
//       //           <div>
//       //             <h5 className="font-bold text-gray-800">🏫 שאלון בית ספר</h5>
//       //             <div className="flex items-center gap-2 mt-1">
//       //               <span
//       //                 className={`w-2 h-2 rounded-full ${schoolAnswers ? "bg-green-500" : "bg-gray-300"}`}
//       //               ></span>
//       //               <p className="text-sm text-gray-500 font-medium">
//       //                 {schoolAnswers
//       //                   ? `התקבל מ- ${schoolAnswers.teacherName}`
//       //                   : "טרם התקבל דיווח"}
//       //               </p>
//       //             </div>
//       //           </div>
//       //         </div> */}
//       //       </div>

//       //       {/* אזור הצגת התוכן הנבחר */}
//       //       <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm min-h-[400px]">
//       //         {currentlyviewing === "parent" ? (
//       //           currentStatus === "נשלח" ? (
//       //             loading ? (
//       //               <div className="p-20 text-center animate-pulse text-blue-500 font-bold">
//       //                 טוען תשובות הורים...
//       //               </div>
//       //             ) : (
//       //               <QuestionnaireViewer data={parentAnswers} />
//       //             )
//       //           ) : (
//       //             <div className="p-20 text-center text-gray-400 border-2 border-dashed border-gray-50 rounded-2xl">
//       //               <p className="text-lg">
//       //                 השאלון נמצא כרגע בסטטוס: {currentStatus}
//       //               </p>
//       //             </div>
//       //           )
//       //         ) : schoolLoading ? (
//       //           <div className="p-20 text-center animate-pulse text-green-500 font-bold">
//       //             טוען נתוני בית ספר...
//       //           </div>
//       //         ) : (
//       //           <SchoolSurveyView data={schoolAnswers} />
//       //           // <SchoolSurveyTab
//       //           //   surveyData={schoolAnswers}
//       //           //   loading={schoolLoading}
//       //           // />
//       //         )}
//       //       </div>
//       //     </div>
//       //   );

//       case "questionnaires":
//         return (
//           <div className="space-y-6 animate-fadeIn text-right" dir="rtl">
//             {/* גריד המלבנים (כרטיסים) */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//               {/* כרטיס שאלון הורים */}
//               <div
//                 onClick={() => setCurrentlyViewing("parent")}
//                 className={`p-6 border rounded-[2rem] cursor-pointer transition-all shadow-sm flex flex-col justify-between min-h-[160px] ${
//                   currentlyviewing === "parent"
//                     ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500"
//                     : "border-gray-100 bg-white hover:border-blue-200"
//                 }`}
//               >
//                 <div>
//                   <h5 className="font-bold text-gray-800 text-lg">
//                     🏠 שאלון הורים
//                   </h5>
//                   <div className="flex items-center gap-2 mt-2">
//                     <span
//                       className={`w-2.5 h-2.5 rounded-full ${currentStatus === "נשלח" ? "bg-green-500" : "bg-orange-500"}`}
//                     ></span>
//                     <p className="text-sm text-gray-500 font-medium">
//                       סטטוס: {currentStatus}
//                     </p>
//                   </div>
//                 </div>

//                 {currentStatus === "נשלח" && (
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setIsCorrectionModalOpen(true);
//                     }}
//                     className="mt-4 w-full bg-white text-orange-600 border border-orange-200 py-2 rounded-xl text-xs font-bold hover:bg-orange-50 transition-all shadow-sm"
//                   >
//                     ↩ החזר לתיקון הורים
//                   </button>
//                 )}
//               </div>

//               {/* כרטיס שאלון בית ספר */}
//               <div
//                 onClick={() => setCurrentlyViewing("school")}
//                 className={`p-6 border rounded-[2rem] cursor-pointer transition-all shadow-sm flex flex-col justify-between min-h-[180px] ${
//                   currentlyviewing === "school"
//                     ? "border-green-500 bg-green-50/50 ring-1 ring-green-500"
//                     : "border-gray-100 bg-white hover:border-green-200"
//                 }`}
//               >
//                 <div>
//                   <h5 className="font-bold text-gray-800 text-lg text-right">
//                     🏫 שאלון בית ספר
//                   </h5>
//                   <div className="flex items-center gap-2 mt-2">
//                     {/* ירוק אם מולא, כתום אם ממתין */}
//                     <span
//                       className={`w-2.5 h-2.5 rounded-full ${schoolAnswers?.formData ? "bg-green-500" : "bg-orange-400"}`}
//                     ></span>
//                     <p className="text-sm text-gray-500 font-medium">
//                       {schoolAnswers?.formData
//                         ? `התקבל מ- ${schoolAnswers.teacherName}`
//                         : "ממתין למילוי מורה"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* הכפתורים יוצגו רק אם המורה כבר מילא את השאלון (כדי לאפשר תיקון/איפוס) */}
//                 {schoolAnswers?.formData && !schoolLoading && (
//                   <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
//                     <button
//                       onClick={async (e) => {
//                         e.stopPropagation();
//                         if (
//                           window.confirm(
//                             "להחזיר את השאלון למורה לתיקון? המורה יוכל לערוך את התשובות שוב.",
//                           )
//                         ) {
//                           const token = await currentUser.getIdToken();
//                           // כאן אפשר להשתמש בפונקציית resend או פונקציה ייעודית לתיקון
//                           await schoolQuestionnaireService.resendInvite(
//                             diagnosis.id,
//                             token,
//                           );
//                           alert("הודעה נשלחה למורה!");
//                         }
//                       }}
//                       className="flex-1 text-[11px] font-bold py-2 rounded-xl bg-white text-orange-600 border border-orange-200 hover:bg-orange-50 shadow-sm transition-all"
//                     >
//                       ↩️ החזר לתיקון
//                     </button>
//                     <button
//                       onClick={async (e) => {
//                         e.stopPropagation();
//                         if (
//                           window.confirm(
//                             "איפוס מוחלט: התשובות הקיימות יימחקו וההורה יוכל לשלוח קישור מחדש. להמשיך?",
//                           )
//                         ) {
//                           const token = await currentUser.getIdToken();
//                           await schoolQuestionnaireService.resetInvite(
//                             diagnosis.id,
//                             token,
//                           );
//                           window.location.reload();
//                         }
//                       }}
//                       className="flex-1 text-[11px] font-bold py-2 rounded-xl bg-white text-red-600 border border-red-100 hover:bg-red-50 shadow-sm transition-all"
//                     >
//                       🗑️ איפוס מוחלט
//                     </button>
//                   </div>
//                 )}

//                 {/* הודעה קטנה אם זה עדיין בטעינה כדי למנוע קפיצות */}
//                 {schoolLoading && (
//                   <div className="text-[10px] text-gray-400 animate-pulse mt-4 italic">
//                     בודק סטטוס...
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* אזור התצוגה המרכזי של השאלונים */}
//             <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm min-h-[400px]">
//               {currentlyviewing === "parent" ? (
//                 currentStatus === "נשלח" && parentAnswers ? (
//                   loading ? (
//                     <p className="text-center p-10 animate-pulse">טוען...</p>
//                   ) : (
//                     <QuestionnaireViewer data={parentAnswers} />
//                   )
//                 ) : (
//                   <div className="p-20 text-center text-gray-400 border-2 border-dashed border-gray-50 rounded-2xl">
//                     <p className="text-lg">
//                       שאלון הורים טרם נשלח או נמצא בתיקון
//                     </p>
//                   </div>
//                 )
//               ) : /* תצוגת שאלון בית ספר */
//               schoolLoading ? (
//                 <p className="text-center p-10 animate-pulse text-green-600 font-bold">
//                   טוען נתוני בית ספר...
//                 </p>
//               ) : schoolAnswers?.formData ? (
//                 <SchoolSurveyView data={schoolAnswers} />
//               ) : (
//                 <div className="p-20 text-center text-gray-400 border-2 border-dashed border-gray-50 rounded-2xl">
//                   <p className="text-lg">טרם התקבל דיווח מהמורה</p>
//                   <p className="text-sm mt-2 font-medium">
//                     ניתן לשלוח תזכורת למורה מהכפתור למעלה
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       case "report":
//         return (
//           <div className="p-20 text-center text-gray-400">
//             הנפקת דוח - בקרוב
//           </div>
//         );

//       case "assessments":
//         return (
//           <RequiredAssessmentsManager
//             diagnosisId={currentDiagnosis.id}
//             assessments={currentDiagnosis.requiredAssessments || []}
//             onChange={refreshDiagnosis}
//           />
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="font-sans animate-fadeIn" dir="rtl">
//       <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
//         <div className="flex items-center gap-5">
//           <button
//             onClick={onBack}
//             className="bg-white border border-gray-200 hover:border-blue-300 text-gray-600 w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm group"
//           >
//             <span className="text-2xl group-hover:translate-x-1 transition-transform">
//               →
//             </span>
//           </button>
//           <div>
//             <h3 className="text-2xl font-bold text-gray-800">ניהול אבחון</h3>
//             {childName && (
//               <p className="text-blue-600 font-medium">מטופל/ת: {childName}</p>
//             )}
//           </div>
//         </div>

//         <button
//           onClick={handleDeleteDiagnosis}
//           className="flex items-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold px-5 py-2.5 rounded-2xl transition-all shadow-sm"
//         >
//           🗑️ מחק אבחון
//         </button>
//       </div>

//       <div className="flex gap-2 mb-10 bg-gray-100/60 p-1.5 rounded-2xl w-fit">
//         {[
//           { id: "questionnaires", label: "שאלונים", icon: "📋" },
//           { id: "assessments", label: "אבחונים", icon: "🧪" }, // 🆕
//           { id: "report", label: "הנפקת דוח", icon: "📄" },
//         ].map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveSubTab(tab.id)}
//             className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${activeSubTab === tab.id ? "bg-white text-blue-600 shadow-md" : "text-gray-400 hover:text-gray-600"}`}
//           >
//             <span>{tab.icon}</span> {tab.label}
//           </button>
//         ))}
//       </div>

//       <div className="min-h-[400px]">{renderSubContent()}</div>

//       <GenericMessageModal
//         isOpen={isCorrectionModalOpen}
//         onClose={() => setIsCorrectionModalOpen(false)}
//         onSend={handleConfirmCorrection}
//         title="החזרת שאלון לתיקון"
//         placeholder=" הערות להורים (מה עליהם לתקן)..."
//       />
//     </div>
//   );
// };

// export default DiagnosisView;


import React, { useState, useEffect } from "react";
import therapistService from "../services/therapist.service";
import messageService from "../services/message.service";
import schoolQuestionnaireService from "../services/schoolQuestionnaire.service"; // ייבוא הסרביס החדש
import QuestionnaireViewer from "./QuestionnaireViewer";
import SchoolSurveyTab from "./SchoolSurveyTab"; // הקומפוננטה שבנינו לתצוגת שאלון בית ספר
import SchoolSurveyView from "./SchoolSurveyView"; // קומפוננטה חדשה לתצוגת שאלון בית ספר
import GenericMessageModal from "./GenericMessageModal";
import { useAuth } from "../contexts/AuthContext";
import ReportForm from "./ReportForm";
import childService from "../services/child.service";
import { formatDate } from "../utils/dateFormat";
import { childFullName } from "../utils/childDisplay";
import { diagnosisLabel } from "../utils/diagnosisDisplay";

const DiagnosisView = ({
  diagnosis,
  allDiagnoses = [],
  onBack,
  childName,
  onDeleted,
  consentForm,
  onViewConsentForm,
  isAdmin = false,
  therapistsList = [],
  onReassignTherapist,
  childData,
  onDiagnosisClosed,
}) => {
  const [activeSubTab, setActiveSubTab] = useState("questionnaires");

  // 🆕 מחיקת אבחון - מודאל עם תצוגה מקדימה ושער "הקלידי שם" (Part 7)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePreview, setDeletePreview] = useState(null);
  const [deletePreviewLoading, setDeletePreviewLoading] = useState(false);
  const [deletePreviewError, setDeletePreviewError] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [notifyParentChecked, setNotifyParentChecked] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // 🆕 שינוי מאבחן/ת (אדמין בלבד)
  const [reassigning, setReassigning] = useState(false);
  const [selectedNewTherapistId, setSelectedNewTherapistId] = useState(
    diagnosis?.therapistId || "",
  );

  // 🆕 סגירה מפורשת של האבחון (רק לאחר הגשת הדוח הסופי)
  const [closing, setClosing] = useState(false);

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

  // 🆕 החזרת שאלון בית הספר לתיקון עם הערות למורה
  const [schoolInvitation, setSchoolInvitation] = useState(null);
  const [isSchoolCorrectionModalOpen, setIsSchoolCorrectionModalOpen] =
    useState(false);
  const [schoolCorrectionNote, setSchoolCorrectionNote] = useState("");
  const [schoolCorrectionSubmitting, setSchoolCorrectionSubmitting] =
    useState(false);
  const [schoolCorrectionError, setSchoolCorrectionError] = useState("");
  const [showCorrectionTooltip, setShowCorrectionTooltip] = useState(false);

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
      fetchSchoolInvitation();
    }
  }, [activeSubTab]);

  const fetchParentAnswers = async () => {
    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      const data = await therapistService.getParentAnswers(
        diagnosis.id,
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
        diagnosis.id,
        token,
      );
      setSchoolAnswers(data);
    } catch (err) {
      console.error("Error fetching school answers:", err);
    } finally {
      setSchoolLoading(false);
    }
  };

  // 🆕 מצב הזמנת שאלון בית הספר (status + lastCorrection) - לתצוגת "הוחזר
  // לתיקון" בכרטיס
  const fetchSchoolInvitation = async () => {
    try {
      const token = await currentUser.getIdToken();
      const data = await schoolQuestionnaireService.getInviteByDiagnosis(
        diagnosis.id,
        token,
      );
      setSchoolInvitation(data);
    } catch (err) {
      console.error("Error fetching school invitation:", err);
    }
  };

  const handleSendSchoolCorrection = async () => {
    const note = schoolCorrectionNote.trim();
    if (note.length < 5 || schoolCorrectionSubmitting) return;

    setSchoolCorrectionSubmitting(true);
    setSchoolCorrectionError("");
    try {
      const token = await currentUser.getIdToken();
      await schoolQuestionnaireService.resendInvite(
        diagnosis.id,
        note,
        token,
      );
      setIsSchoolCorrectionModalOpen(false);
      setSchoolCorrectionNote("");
      alert("השאלון הוחזר למורה לתיקון והמייל נשלח");
      // עדכון ה-state בלי reload
      setSchoolInvitation((prev) => ({
        ...(prev || {}),
        status: "pending",
        lastCorrection: {
          note,
          requestedAt: new Date().toISOString(),
        },
      }));
    } catch (err) {
      setSchoolCorrectionError(err.message || "שליחת ההחזרה לתיקון נכשלה");
    } finally {
      setSchoolCorrectionSubmitting(false);
    }
  };

  const handleConfirmCorrection = async (messageText) => {
    const finalMessage = messageText.trim()
      ? messageText
      : `שלום, השאלון הוחזר אליכם לתיקון או הוספת פרטים. נא להיכנס ללשונית "אישורים וטפסים" ולעדכן. תודה!`;

    let token;
    try {
      token = await currentUser.getIdToken();
      await therapistService.updateQuestionnaireStatus(
        diagnosis.id,
        "לתיקון",
        token,
        diagnosis.childId,
      );
    } catch (err) {
      console.error(err);
      alert("שגיאה בתהליך ההחזרה לתיקון.");
      return;
    }

    try {
      const messagePayload = {
        receiverId: childData?.parentId || parentAnswers?.parentId,
        childId: diagnosis.childId,
        text: finalMessage,
      };
      await messageService.sendMessage(messagePayload, token);
      alert("השאלון הוחזר לתיקון והודעה נשלחה להורים.");
    } catch (err) {
      console.error(err);
      alert(
        `השאלון הוחזר לתיקון, אך שליחת ההודעה להורים נכשלה: ${err.message}. אפשר לשלוח להם הודעה ידנית.`,
      );
    }

    setCurrentStatus("לתיקון");
    setIsCorrectionModalOpen(false);
  };

  // 🆕 פתיחת מודאל המחיקה + שליפת תצוגה מקדימה (כמה מסמכים ייעלמו)
  const openDeleteModal = async () => {
    setIsDeleteModalOpen(true);
    setDeleteConfirmText("");
    setDeleteError("");
    setDeletePreviewError("");
    setDeletePreview(null);
    setDeletePreviewLoading(true);
    try {
      const token = await currentUser.getIdToken();
      const preview = await therapistService.getDeletePreview(
        diagnosis.id,
        token,
      );
      setDeletePreview(preview);
      setNotifyParentChecked(!!preview?.hasParent);
    } catch (err) {
      console.error("Error loading delete preview:", err);
      setDeletePreviewError(
        err.message || "שגיאה בטעינת תצוגה מקדימה למחיקה",
      );
    } finally {
      setDeletePreviewLoading(false);
    }
  };

  const expectedConfirmName = (deletePreview?.childFirstName || "").trim();
  const isConfirmNameMatch =
    expectedConfirmName.length > 0 &&
    deleteConfirmText.trim() === expectedConfirmName;

  const handleDeleteDiagnosis = async () => {
    if (!isConfirmNameMatch || deleting) return;
    setDeleting(true);
    setDeleteError("");
    try {
      const token = await currentUser.getIdToken();
      await therapistService.deleteDiagnosis(
        diagnosis.id,
        token,
        notifyParentChecked,
      );
      setIsDeleteModalOpen(false);
      if (onDeleted) onDeleted();
      else if (onBack) onBack();
    } catch (err) {
      console.error("Error deleting diagnosis:", err);
      setDeleteError(err.message || "שגיאה במחיקת האבחון. נסי שוב.");
    } finally {
      setDeleting(false);
    }
  };

  // 🆕 שינוי המאבחן/ת המשויך/ת לאבחון (אדמין בלבד)
  const handleReassignClick = async () => {
    if (selectedNewTherapistId === diagnosis.therapistId) return;
    setReassigning(true);
    try {
      await onReassignTherapist(diagnosis.id, selectedNewTherapistId);
    } finally {
      setReassigning(false);
    }
  };

  // 🆕 סגירה מפורשת של האבחון - זו הפעולה שבפועל חושפת את הדוח להורדת PDF בצד ההורה
  const handleCloseDiagnosis = async () => {
    setClosing(true);
    try {
      const token = await currentUser.getIdToken();
      await childService.closeDiagnosis(diagnosis.id, token);
      alert("האבחון נסגר בהצלחה");
      onDiagnosisClosed?.();
    } catch (err) {
      alert(err.message || "שגיאה בסגירת האבחון");
    } finally {
      setClosing(false);
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

                  {schoolAnswers?.formData &&
                    schoolInvitation?.status === "pending" &&
                    schoolInvitation?.lastCorrection && (
                      <div className="relative flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowCorrectionTooltip((v) => !v);
                          }}
                          className="text-xs text-orange-600 font-medium hover:underline text-right"
                        >
                          ↩️ הוחזר לתיקון ב-
                          {formatDate(
                            schoolInvitation.lastCorrection.requestedAt,
                          )}{" "}
                          – ממתין למורה
                        </button>
                        {showCorrectionTooltip && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute z-10 top-full right-0 mt-1 w-64 bg-white border border-orange-200 rounded-xl shadow-lg p-3 text-xs text-gray-700 whitespace-pre-wrap"
                          >
                            {schoolInvitation.lastCorrection.note}
                          </div>
                        )}
                      </div>
                    )}
                </div>

                {/* הכפתורים יוצגו רק אם המורה כבר מילא את השאלון (כדי לאפשר תיקון/איפוס) */}
                {schoolAnswers?.formData && !schoolLoading && (
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSchoolCorrectionError("");
                        setIsSchoolCorrectionModalOpen(true);
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
                            diagnosis.id,
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
          <ReportForm
            diagnosisId={diagnosis.id}
            childData={childData}
            diagnosisLabel={diagnosisLabel(diagnosis, {
              index: allDiagnoses.findIndex((d) => d.id === diagnosis.id),
              total: allDiagnoses.length,
            })}
            onClose={() => setActiveSubTab("questionnaires")}
          />
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
            {(() => {
              const resolvedChildName = childFullName(childData) || childName;
              const diagIndex = allDiagnoses.findIndex(
                (d) => d.id === diagnosis.id,
              );
              const headerParts = [
                resolvedChildName ? `מטופל/ת: ${resolvedChildName}` : null,
                diagnosisLabel(diagnosis, {
                  index: diagIndex >= 0 ? diagIndex : undefined,
                  total: allDiagnoses.length,
                }) || null,
              ].filter(Boolean);
              return headerParts.length > 0 ? (
                <p className="text-blue-600 font-medium">
                  {headerParts.join(" · ")}
                </p>
              ) : null;
            })()}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 🆕 סגירה מפורשת של האבחון - זו הפעולה שחושפת את הדוח להורדת PDF בצד ההורה */}
          {diagnosis.closed ? (
            <span className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 font-bold px-5 py-2.5 rounded-2xl">
              אבחון סגור ✓
            </span>
          ) : (
            <button
              onClick={handleCloseDiagnosis}
              disabled={closing || diagnosis.status !== "הושלם"}
              title={
                diagnosis.status !== "הושלם"
                  ? "יש להגיש את הדוח הסופי לפני סגירת האבחון"
                  : undefined
              }
              className="flex items-center gap-2 bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50 font-bold px-5 py-2.5 rounded-2xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              {closing ? "סוגר..." : "🔒 סגור אבחון"}
            </button>
          )}

          <button
            onClick={openDeleteModal}
            disabled={diagnosis.closed}
            title={
              diagnosis.closed
                ? "לא ניתן למחוק אבחון שנסגר רשמית"
                : undefined
            }
            className="flex items-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold px-5 py-2.5 rounded-2xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            🗑️ מחק אבחון
          </button>
        </div>
      </div>

      {/* 🆕 שינוי מאבחן/ת - אדמין בלבד */}
      {isAdmin && (
        <div className="flex items-center gap-3 mb-6 bg-purple-50 border border-purple-100 rounded-2xl p-4 flex-wrap">
          <span className="text-sm font-bold text-purple-700 shrink-0">
            מאבחן/ת אחראי/ת:
          </span>
          <select
            value={selectedNewTherapistId}
            onChange={(e) => setSelectedNewTherapistId(e.target.value)}
            className="flex-1 min-w-[180px] px-3 py-2 border border-purple-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 text-sm"
          >
            <option value="">-- בחר/י מאבחן/ת --</option>
            {therapistsList.map((t) => (
              <option key={t.id} value={t.id}>
                {t.firstName} {t.lastName}
              </option>
            ))}
          </select>
          <button
            onClick={handleReassignClick}
            disabled={
              reassigning ||
              !selectedNewTherapistId ||
              selectedNewTherapistId === diagnosis.therapistId
            }
            className="px-4 py-2 rounded-lg font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed text-sm shrink-0"
          >
            {reassigning ? "מעדכן..." : "עדכן מאבחן/ת"}
          </button>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 mb-10 flex-wrap">
        <div className="flex gap-2 bg-gray-100/60 p-1.5 rounded-2xl w-fit">
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

        {/* 🆕 גישה קבועה לטופס ההסכמה - נשארת זמינה גם בזמן צפייה בשאלונים */}
        {consentForm && onViewConsentForm && (
          <button
            onClick={onViewConsentForm}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold shadow-sm transition-all border ${
              consentForm.status === "fully_signed"
                ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                : consentForm.status === "partially_signed"
                  ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
            }`}
          >
            📋 טופס הסכמה
            <span className="text-xs">
              {consentForm.status === "fully_signed"
                ? "✅ חתום"
                : consentForm.status === "partially_signed"
                  ? "🕒 חתום חלקית"
                  : "⏳ ממתין לחתימה"}
            </span>
          </button>
        )}
      </div>

      <div className="min-h-[400px]">{renderSubContent()}</div>

      <GenericMessageModal
        isOpen={isCorrectionModalOpen}
        onClose={() => setIsCorrectionModalOpen(false)}
        onSend={handleConfirmCorrection}
        title="החזרת שאלון לתיקון"
        placeholder=" הערות להורים (מה עליהם לתקן)..."
      />

      {/* 🆕 החזרת שאלון בית הספר לתיקון, עם הערות שנשלחות במייל למורה */}
      {isSchoolCorrectionModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => !schoolCorrectionSubmitting && setIsSchoolCorrectionModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100"
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-orange-600 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">
                החזרת שאלון בית הספר לתיקון
              </h3>
              <button
                onClick={() =>
                  !schoolCorrectionSubmitting &&
                  setIsSchoolCorrectionModalOpen(false)
                }
                className="text-2xl hover:opacity-70 transition-opacity"
              >
                ✕
              </button>
            </div>

            <div className="p-8">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                מה המורה צריך/ה לתקן?
              </label>
              <textarea
                className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none resize-none text-right text-gray-700"
                placeholder="לדוגמה: נא להשלים את פירוט הקשיים בקריאה, ולסמן את רמת התפקוד בחשבון"
                value={schoolCorrectionNote}
                onChange={(e) =>
                  setSchoolCorrectionNote(e.target.value.slice(0, 2000))
                }
                maxLength={2000}
                disabled={schoolCorrectionSubmitting}
              />
              <p className="text-xs text-gray-400 mt-1 text-left">
                {schoolCorrectionNote.length}/2000
              </p>

              {schoolCorrectionError && (
                <div className="mt-3 bg-red-50 border border-red-100 rounded-xl p-3 text-red-700 text-sm">
                  {schoolCorrectionError}
                </div>
              )}

              <div className="flex gap-4 mt-6 font-sans">
                <button
                  onClick={handleSendSchoolCorrection}
                  disabled={
                    schoolCorrectionNote.trim().length < 5 ||
                    schoolCorrectionSubmitting
                  }
                  className="flex-1 bg-orange-600 text-white py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 active:scale-95 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {schoolCorrectionSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      שולח...
                    </>
                  ) : (
                    "שליחה למורה"
                  )}
                </button>
                <button
                  onClick={() => setIsSchoolCorrectionModalOpen(false)}
                  disabled={schoolCorrectionSubmitting}
                  className="px-8 py-4 border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all disabled:opacity-50"
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🆕 Part 7: מודאל מחיקת אבחון - תצוגה מקדימה + שער "הקלידי שם" */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          dir="rtl"
          onClick={() => !deleting && setIsDeleteModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden text-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-red-500 p-6 text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                🗑️ מחיקת אבחון לצמיתות
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {deletePreviewLoading ? (
                <div className="flex items-center gap-3 text-gray-500 py-4">
                  <span className="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
                  טוען תצוגה מקדימה...
                </div>
              ) : deletePreviewError ? (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-red-700 text-sm">
                  {deletePreviewError}
                </div>
              ) : (
                <>
                  <p className="text-gray-700">
                    פעולה זו תמחק לצמיתות את{" "}
                    <span className="font-bold text-red-600">
                      {diagnosisLabel(diagnosis, {
                        index: allDiagnoses.findIndex(
                          (d) => d.id === diagnosis.id,
                        ),
                        total: allDiagnoses.length,
                      })}
                    </span>{" "}
                    עבור {deletePreview?.childFullName || "המטופל/ת"}, כולל:
                  </p>

                  {(() => {
                    const countLabels = {
                      parent_questionnaires: "שאלוני הורים",
                      school_questionnaires: "שאלוני בית ספר",
                      school_invitations: "הזמנות בית ספר",
                      consent_forms: "טפסי הסכמה",
                      diary_events: "תורים שנקבעו",
                      reports: "דוחות",
                    };
                    const nonZero = Object.entries(
                      deletePreview?.counts || {},
                    ).filter(([, count]) => count > 0);

                    return nonZero.length > 0 ? (
                      <ul className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-1 text-sm text-gray-600">
                        {nonZero.map(([key, count]) => (
                          <li key={key}>
                            • {countLabels[key] || key}: {count}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400">
                        לא נמצאו טפסים או מסמכים מקושרים למחיקה.
                      </p>
                    );
                  })()}

                  <p className="text-red-600 text-sm font-bold">
                    לא ניתן לשחזר פעולה זו.
                  </p>

                  {deletePreview?.hasParent && (
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyParentChecked}
                        onChange={(e) =>
                          setNotifyParentChecked(e.target.checked)
                        }
                        disabled={deleting}
                        className="w-5 h-5 mt-0.5 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">
                        לשלוח להורה הודעה שהאבחון בוטל ואין צורך למלא את
                        הטפסים שנשלחו
                      </span>
                    </label>
                  )}

                  {expectedConfirmName && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        לאישור, הקלידי את השם הפרטי של הילד/ה: "
                        {expectedConfirmName}"
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        disabled={deleting}
                        className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-red-500 bg-white"
                        placeholder={expectedConfirmName}
                      />
                    </div>
                  )}

                  {deleteError && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-red-700 text-sm">
                      {deleteError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleDeleteDiagnosis}
                      disabled={!isConfirmNameMatch || deleting}
                      className="flex-1 py-3 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {deleting ? "מוחק..." : "כן, מחק לצמיתות"}
                    </button>
                    <button
                      onClick={() => setIsDeleteModalOpen(false)}
                      disabled={deleting}
                      className="flex-1 py-3 rounded-lg font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                    >
                      ביטול
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosisView;