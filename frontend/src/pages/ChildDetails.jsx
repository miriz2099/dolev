// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import ChildTabsHeader from "../components/ChildTabsHeader";
// import ContactTherapist from "../components/ContactTherapist";
// import ParentQuestionnaire from "../components/ParentQuestionnaire";
// import messageService from "../services/message.service"; // שימוש בסרביס
// import GenericMessageModal from "../components/GenericMessageModal";

// const ChildDetails = () => {
//   const { childId } = useParams();
//   const navigate = useNavigate();
//   const { currentUser } = useAuth();

//   const [childData, setChildData] = useState(null);
//   const [messages, setMessages] = useState([]); // סטייט להודעות
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("info");
//   const [showQuestionnaire, setShowQuestionnaire] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const [activeDiagnosis, setActiveDiagnosis] = useState(null);

//   useEffect(() => {
//     const checkDiagnosis = async () => {
//       try {
//         const token = await currentUser.getIdToken();
//         // קריאה לסרביס ששולף את האבחון האחרון של הילד
//         const diagnoses = await messageService.getDiagnosesByChild(
//           childId,
//           token,
//         );
//         if (diagnoses.length > 0) {
//           // לוקחים את האבחון הכי חדש (הראשון ברשימה כי זה ממוין לפי תאריך)
//           setActiveDiagnosis(diagnoses[0]);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     if (currentUser && childId) checkDiagnosis();
//   }, [childId, currentUser]);

//   // שליפת נתוני ילד והודעות בטעינה
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const token = await currentUser.getIdToken();
//         const baseUrl = import.meta.env.VITE_API_URL;

//         // שליפת פרטי ילד
//         const childRes = await fetch(`${baseUrl}/children/${childId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const childJson = await childRes.json();
//         setChildData(childJson);

//         // שליפת הודעות עבור הילד
//         const msgs = await messageService.getChildMessages(childId, token);
//         setMessages(msgs);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (currentUser && childId) fetchData();
//   }, [currentUser, childId]);

//   useEffect(() => {
//     const markAsRead = async () => {
//       // בדיקה אם אנחנו בטאב הודעות ויש הודעות שלא נקראו
//       if (activeTab === "messages" && messages.some((m) => !m.read)) {
//         try {
//           const token = await currentUser.getIdToken();
//           await messageService.markMessagesAsRead(childId, token);

//           // עדכון הסטייט המקומי כדי שהנקודה האדומה תיעלם מיד בלי ריפרש
//           setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
//         } catch (err) {
//           console.error("Failed to mark messages as read:", err);
//         }
//       }
//     };

//     markAsRead();
//   }, [activeTab, childId, messages, currentUser]);

//   const handleSendMessage = async (text) => {
//     try {
//       const token = await currentUser.getIdToken();
//       await messageService.sendMessage(
//         {
//           receiverId: childData.therapistId, // שולח למאבחן
//           childId: childId,
//           text: text,
//         },
//         token,
//       );
//       alert("ההודעה נשלחה למאבחן");
//       setIsModalOpen(false);
//     } catch (err) {
//       alert("שגיאה בשליחה");
//     }
//   };

//   const handleDeleteMessage = async (msgId) => {
//     if (!window.confirm("למחוק הודעה זו?")) return;
//     try {
//       const token = await currentUser.getIdToken();
//       await messageService.deleteMessage(msgId, token);
//       setMessages(messages.filter((m) => m.id !== msgId));
//     } catch (err) {
//       alert("מחיקה נכשלה");
//     }
//   };

//   const renderContent = () => {
//     if (!childData) return null;
//     if (showQuestionnaire) {
//       return (
//         <ParentQuestionnaire
//           childId={childId}
//           onSave={() => setShowQuestionnaire(false)}
//           onCancel={() => setShowQuestionnaire(false)}
//         />
//       );
//     }

//     switch (activeTab) {
//       case "info":
//         return (
//           <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] text-right animate-fadeIn">
//             <h2 className="text-3xl font-bold text-gray-800 mb-10 pb-6 border-b border-gray-100 font-sans">
//               פרטי הילד
//             </h2>
//             <div className="flex flex-row justify-start gap-32 mb-12">
//               <div className="flex flex-col">
//                 <p className="text-gray-400 text-sm mb-2 font-medium font-sans">
//                   שם מלא
//                 </p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {childData.firstName} {childData.lastName}
//                 </p>
//               </div>
//               <div className="flex flex-col">
//                 <p className="text-gray-400 text-sm mb-2 font-medium font-sans">
//                   תעודת זהות
//                 </p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {childData.idNumber}
//                 </p>
//               </div>
//             </div>
//           </div>
//         );

//       case "messages": // לשונית הודעות חשובות
//         return (
//           <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] text-right animate-fadeIn font-sans">
//             <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-6 border-b border-gray-100">
//               הודעות חשובות מהמאבחן
//             </h2>
//             {messages.length === 0 ? (
//               <p className="text-gray-500 italic">
//                 אין הודעות חדשות עבור {childData.firstName}.
//               </p>
//             ) : (
//               <div className="space-y-4">
//                 {messages.map((msg) => (
//                   <div
//                     key={msg.id}
//                     className="p-6 bg-blue-50 border border-blue-100 rounded-2xl relative group"
//                   >
//                     <button
//                       onClick={() => handleDeleteMessage(msg.id)}
//                       className="absolute top-4 left-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
//                     >
//                       🗑️
//                     </button>
//                     <p className="text-gray-800 text-lg leading-relaxed">
//                       {msg.text}
//                     </p>
//                     <span className="text-xs text-blue-400 mt-2 block font-mono">
//                       {new Date(msg.createdAt).toLocaleString("he-IL")}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         );

//       // case "forms":
//       //   return (
//       //     <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] text-right animate-fadeIn">
//       //       <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-6 border-b border-gray-100 font-sans">
//       //         אישורים וטפסים
//       //       </h2>
//       //       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
//       //         {/* כרטיס שאלון הורים - פעיל */}
//       //         <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50 flex flex-col items-start gap-4 transition-all hover:shadow-md">
//       //           <span className="text-4xl">🏠</span>
//       //           <h3 className="text-xl font-bold text-gray-800">שאלון הורים</h3>
//       //           <p className="text-gray-500 text-sm">
//       //             שאלון מקיף אודות הרקע ההתפתחותי והתפקודי של הילד בבית.
//       //           </p>
//       //           <button
//       //             onClick={() => setShowQuestionnaire(true)}
//       //             className="mt-auto w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm"
//       //           >
//       //             למילוי שאלון הורים
//       //           </button>
//       //         </div>

//       //         {/* כרטיס שאלון בית ספר - לא פעיל (בקרוב) */}
//       //         <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50 flex flex-col items-start gap-4 opacity-70 relative overflow-hidden group">
//       //           {/* פס אלכסוני קטן של "בקרוב" למעלה בצד */}
//       //           <div className="absolute top-2 right-[-35px] bg-gray-400 text-white text-[10px] py-1 px-10 rotate-45 shadow-sm font-bold uppercase tracking-wider">
//       //             Coming Soon
//       //           </div>

//       //           <span className="text-4xl">🏫</span>
//       //           <h3 className="text-xl font-bold text-gray-800">
//       //             שאלון בית ספר
//       //           </h3>
//       //           <p className="text-gray-500 text-sm">
//       //             שאלון המיועד למורה או לצוות החינוכי להערכת תפקוד הילד במסגרת
//       //             הלימודית.
//       //           </p>
//       //           <button
//       //             disabled
//       //             className="mt-auto w-full bg-gray-300 text-gray-500 py-3 rounded-xl font-bold cursor-not-allowed border border-gray-200"
//       //           >
//       //             טרם נשלח למורה
//       //           </button>
//       //         </div>
//       //       </div>
//       //     </div>
//       //   );

//       case "forms":
//         const qStatus = activeDiagnosis?.parentQuestionnaireStatus;
//         const canFill = qStatus === "פתוח" || qStatus === "לתיקון";

//         return (
//           <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] text-right animate-fadeIn">
//             <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-6 border-b border-gray-100 font-sans">
//               אישורים וטפסים
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
//               {/* כרטיס שאלון הורים */}
//               <div
//                 className={`p-6 border rounded-2xl flex flex-col items-start gap-4 ${!canFill ? "bg-gray-50 opacity-80" : "bg-white shadow-sm border-blue-50"}`}
//               >
//                 <div className="flex justify-between w-full items-start">
//                   <span className="text-4xl">🏠</span>
//                   {qStatus && (
//                     <span
//                       className={`text-xs px-2 py-1 rounded-md font-bold ${
//                         qStatus === "נשלח"
//                           ? "bg-green-100 text-green-700"
//                           : "bg-orange-100 text-orange-700"
//                       }`}
//                     >
//                       סטטוס: {qStatus}
//                     </span>
//                   )}
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-800">שאלון הורים</h3>
//                 <p className="text-gray-500 text-sm">
//                   {qStatus === "נשלח"
//                     ? "השאלון נשלח למאבחן וננעל לעריכה."
//                     : "נא למלא את כל הפרטים בשאלון המצורף."}
//                 </p>

//                 <button
//                   onClick={() => canFill && setShowQuestionnaire(true)}
//                   disabled={!canFill}
//                   className={`mt-auto w-full py-3 rounded-xl font-bold transition-all ${
//                     canFill
//                       ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
//                       : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   }`}
//                 >
//                   {qStatus === "לתיקון"
//                     ? "תיקון שאלון הורים"
//                     : "למילוי שאלון הורים"}
//                 </button>
//               </div>
//               {/* ... שאלון בית ספר (נעול) */}

//               {/* כרטיס שאלון בית ספר - לא פעיל (בקרוב) */}
//               <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50 flex flex-col items-start gap-4 opacity-70 relative overflow-hidden group">
//                 {/* פס אלכסוני קטן של "בקרוב" למעלה בצד */}
//                 <div className="absolute top-2 right-[-35px] bg-gray-400 text-white text-[10px] py-1 px-10 rotate-45 shadow-sm font-bold uppercase tracking-wider">
//                   Coming Soon
//                 </div>

//                 <span className="text-4xl">🏫</span>
//                 <h3 className="text-xl font-bold text-gray-800">
//                   שאלון בית ספר
//                 </h3>
//                 <p className="text-gray-500 text-sm">
//                   שאלון המיועד למורה או לצוות החינוכי להערכת תפקוד הילד במסגרת
//                   הלימודית.
//                 </p>
//                 <button
//                   disabled
//                   className="mt-auto w-full bg-gray-300 text-gray-500 py-3 rounded-xl font-bold cursor-not-allowed border border-gray-200"
//                 >
//                   טרם נשלח למורה
//                 </button>
//               </div>
//             </div>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   if (loading)
//     return (
//       <div className="p-20 text-center font-bold text-blue-600 animate-pulse">
//         טוען נתונים...
//       </div>
//     );

//   return (
//     <div className="p-8 bg-[#F8FAFC] min-h-screen" dir="rtl">
//       <div className="max-w-7xl mx-auto flex justify-start mb-6 font-sans">
//         <button
//           onClick={() =>
//             showQuestionnaire ? setShowQuestionnaire(false) : navigate(-1)
//           }
//           className="text-gray-500 hover:text-blue-600 flex items-center gap-2"
//         >
//           <span>→</span> {showQuestionnaire ? "ביטול וחזרה" : "חזרה לרשימה"}
//         </button>
//       </div>

//       <div className="max-w-7xl mx-auto">
//         {!showQuestionnaire && (
//           <ChildTabsHeader
//             activeTab={activeTab}
//             setActiveTab={setActiveTab}
//             hasUnreadMessages={messages.some((m) => !m.read)} // העברת פרופ להתראה
//           />
//         )}

//         <div
//           className={`grid grid-cols-1 ${showQuestionnaire ? "" : "lg:grid-cols-12"} gap-8 items-start`}
//         >
//           <div className={showQuestionnaire ? "w-full" : "lg:col-span-9"}>
//             {renderContent()}
//           </div>
//           {!showQuestionnaire && (
//             <div className="lg:col-span-3">
//               <div
//                 onClick={() => setIsModalOpen(true)}
//                 className="cursor-pointer"
//               >
//                 <ContactTherapist
//                   therapistName={childData?.therapistName || "המרכז"}
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <GenericMessageModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSend={handleSendMessage}
//         title={`הודעה למאבחן של ${childData?.firstName}`}
//       />
//     </div>
//   );
// };

// export default ChildDetails;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ChildTabsHeader from "../components/ChildTabsHeader";
import ContactTherapist from "../components/ContactTherapist";
import ParentQuestionnaire from "../components/ParentQuestionnaire";
import messageService from "../services/message.service";
import therapistService from "../services/therapist.service"; // נוסיף את זה כדי למשוך אבחונים
import GenericMessageModal from "../components/GenericMessageModal";

const ChildDetails = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [childData, setChildData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeDiagnosis, setActiveDiagnosis] = useState(null);

  // 1. בדיקת סטטוס אבחון פעיל
  useEffect(() => {
    const checkDiagnosis = async () => {
      try {
        const token = await currentUser.getIdToken();
        // משתמשים בסרביס ששואב את האבחונים (הגדרנו אותו קודם ב-therapistService או בנפרד)
        const diagnoses = await therapistService.getDiagnoses(childId, token);
        if (diagnoses && diagnoses.length > 0) {
          // האבחון הראשון הוא הכי חדש
          setActiveDiagnosis(diagnoses[0]);
        }
      } catch (err) {
        console.error("Error fetching diagnosis status:", err);
      }
    };
    if (currentUser && childId) checkDiagnosis();
  }, [childId, currentUser]);

  // 2. שליפת נתוני ילד והודעות
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await currentUser.getIdToken();
        const baseUrl = import.meta.env.VITE_API_URL;

        const childRes = await fetch(`${baseUrl}/children/${childId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const childJson = await childRes.json();
        setChildData(childJson);

        const msgs = await messageService.getChildMessages(childId, token);
        setMessages(msgs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && childId) fetchData();
  }, [currentUser, childId]);

  // 3. סימון הודעות כנקראו
  useEffect(() => {
    const markAsRead = async () => {
      if (activeTab === "messages" && messages.some((m) => !m.read)) {
        try {
          const token = await currentUser.getIdToken();
          await messageService.markMessagesAsRead(childId, token);
          setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
        } catch (err) {
          console.error("Failed to mark messages as read:", err);
        }
      }
    };
    markAsRead();
  }, [activeTab, childId, messages, currentUser]);

  const handleSendMessage = async (text) => {
    try {
      const token = await currentUser.getIdToken();
      await messageService.sendMessage(
        {
          receiverId: childData.therapistId,
          childId: childId,
          text: text,
        },
        token,
      );
      alert("ההודעה נשלחה למאבחן");
      setIsModalOpen(false);
    } catch (err) {
      alert("שגיאה בשליחה");
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm("למחוק הודעה זו?")) return;
    try {
      const token = await currentUser.getIdToken();
      await messageService.deleteMessage(msgId, token);
      setMessages(messages.filter((m) => m.id !== msgId));
    } catch (err) {
      alert("מחיקה נכשלה");
    }
  };

  const renderContent = () => {
    if (!childData) return null;
    if (showQuestionnaire) {
      return (
        <ParentQuestionnaire
          childId={childId}
          onSave={() => {
            setShowQuestionnaire(false);
            window.location.reload(); // רענון קטן כדי לעדכן את הסטטוס שננעל
          }}
          onCancel={() => setShowQuestionnaire(false)}
        />
      );
    }

    switch (activeTab) {
      case "info":
        return (
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] text-right animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-800 mb-10 pb-6 border-b border-gray-100 font-sans">
              פרטי הילד
            </h2>
            <div className="flex flex-row justify-start gap-32 mb-12">
              <div className="flex flex-col font-sans">
                <p className="text-gray-400 text-sm mb-2 font-medium">שם מלא</p>
                <p className="text-2xl font-bold text-gray-900">
                  {childData.firstName} {childData.lastName}
                </p>
              </div>
              <div className="flex flex-col font-sans">
                <p className="text-gray-400 text-sm mb-2 font-medium">
                  תעודת זהות
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {childData.idNumber}
                </p>
              </div>
            </div>
          </div>
        );

      case "messages":
        return (
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] text-right animate-fadeIn font-sans">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-6 border-b border-gray-100">
              הודעות חשובות מהמאבחן
            </h2>
            {messages.length === 0 ? (
              <p className="text-gray-500 italic">
                אין הודעות חדשות עבור {childData.firstName}.
              </p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-6 bg-blue-50 border border-blue-100 rounded-2xl relative group"
                  >
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="absolute top-4 left-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      🗑️
                    </button>
                    <p className="text-gray-800 text-lg leading-relaxed">
                      {msg.text}
                    </p>
                    <span className="text-xs text-blue-400 mt-2 block font-mono">
                      {new Date(msg.createdAt).toLocaleString("he-IL")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "forms":
        // לוגיקת הרשאות לפי הסטטוס החדש שקיבלנו מהאבחון
        const qStatus = activeDiagnosis?.parentQuestionnaireStatus;
        // השאלון פתוח רק אם המאבחן פתח אבחון והסטטוס הוא "פתוח" או "לתיקון"
        const canFill =
          childData.canFillQuestionnaire &&
          (qStatus === "פתוח" || qStatus === "לתיקון");

        return (
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] text-right animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-6 border-b border-gray-100 font-sans">
              אישורים וטפסים
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
              {/* כרטיס שאלון הורים */}
              <div
                className={`p-6 border rounded-2xl flex flex-col items-start gap-4 transition-all ${!canFill ? "bg-gray-50 opacity-80" : "bg-white shadow-sm border-blue-100 hover:shadow-md"}`}
              >
                <div className="flex justify-between w-full items-start">
                  <span className="text-4xl">🏠</span>
                  {qStatus && (
                    <span
                      className={`text-xs px-2 py-1 rounded-md font-bold ${qStatus === "נשלח" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}
                    >
                      סטטוס: {qStatus}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800">שאלון הורים</h3>
                <p className="text-gray-500 text-sm">
                  {qStatus === "נשלח"
                    ? "השאלון נשלח למאבחן וננעל לעריכה."
                    : !activeDiagnosis
                      ? "השאלון ייפתח למילוי ברגע שהמאבחן יפתח תהליך אבחון."
                      : "נא למלא את כל הפרטים בשאלון המצורף."}
                </p>
                <button
                  onClick={() => canFill && setShowQuestionnaire(true)}
                  disabled={!canFill}
                  className={`mt-auto w-full py-3 rounded-xl font-bold transition-all ${canFill ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                >
                  {!activeDiagnosis
                    ? "נעול (ממתין לפתיחת אבחון)"
                    : qStatus === "נשלח"
                      ? "נשלח בהצלחה"
                      : qStatus === "לתיקון"
                        ? "תיקון שאלון הורים"
                        : "למילוי שאלון הורים"}
                </button>
              </div>

              {/* כרטיס שאלון בית ספר - תמיד מוצג אך נעול כרגע */}
              <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50 flex flex-col items-start gap-4 opacity-70 relative overflow-hidden group">
                <div className="absolute top-2 right-[-35px] bg-gray-400 text-white text-[10px] py-1 px-10 rotate-45 shadow-sm font-bold uppercase tracking-wider">
                  Coming Soon
                </div>
                <span className="text-4xl">🏫</span>
                <h3 className="text-xl font-bold text-gray-800">
                  שאלון בית ספר
                </h3>
                <p className="text-gray-500 text-sm">
                  שאלון המיועד למורה או לצוות החינוכי להערכת תפקוד הילד במסגרת
                  הלימודית.
                </p>
                <button
                  disabled
                  className="mt-auto w-full bg-gray-300 text-gray-500 py-3 rounded-xl font-bold cursor-not-allowed border border-gray-200"
                >
                  טרם נשלח למורה
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center font-bold text-blue-600 animate-pulse">
        טוען נתונים...
      </div>
    );

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto flex justify-start mb-6 font-sans">
        <button
          onClick={() =>
            showQuestionnaire ? setShowQuestionnaire(false) : navigate(-1)
          }
          className="text-gray-500 hover:text-blue-600 flex items-center gap-2"
        >
          <span>→</span> {showQuestionnaire ? "ביטול וחזרה" : "חזרה לרשימה"}
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        {!showQuestionnaire && (
          <ChildTabsHeader
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            hasUnreadMessages={messages.some((m) => !m.read)}
          />
        )}

        <div
          className={`grid grid-cols-1 ${showQuestionnaire ? "" : "lg:grid-cols-12"} gap-8 items-start`}
        >
          <div className={showQuestionnaire ? "w-full" : "lg:col-span-9"}>
            {renderContent()}
          </div>
          {!showQuestionnaire && (
            <div className="lg:col-span-3">
              <div
                onClick={() => setIsModalOpen(true)}
                className="cursor-pointer"
              >
                <ContactTherapist
                  therapistName={childData?.therapistName || "המרכז"}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <GenericMessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSend={handleSendMessage}
        title={`הודעה למאבחן של ${childData?.firstName}`}
      />
    </div>
  );
};

export default ChildDetails;
