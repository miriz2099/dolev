// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import therapistService from "../services/therapist.service";
// import GenericMessageModal from "../components/GenericMessageModal";
// import DiagnosisList from "../components/DiagnosisList";
// import DiagnosisView from "../components/DiagnosisView";
// import ConsentFormViewer from "../components/ConsentFormViewer";
// import consentFormService from "../services/consentForm.service";

// const DiagnosisDetails = () => {
//   const { childId } = useParams();
//   const navigate = useNavigate();
//   const { currentUser } = useAuth();

//   const [childData, setChildData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("childInfo");
//   const [parentData, setParentData] = useState(null);
//   const [parentLoading, setParentLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const [diagnoses, setDiagnoses] = useState([]);
//   const [diagnosesLoading, setDiagnosesLoading] = useState(false);
//   const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
//   const [consentForm, setConsentForm] = useState(null);
//   const [isConsentViewerOpen, setIsConsentViewerOpen] = useState(false);

//   // 1. שליפת פרטי ילד
//   useEffect(() => {
//     const loadChildDetails = async () => {
//       try {
//         setLoading(true);
//         const token = await currentUser.getIdToken();
//         const data = await therapistService.getChildDetails(childId, token);
//         setChildData(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (currentUser && childId) loadChildDetails();
//   }, [currentUser, childId]);

//   // 2. שליפת פרטי הורה (כשעוברים לטאב הורים)
//   useEffect(() => {
//     const fetchParentInfo = async () => {
//       if (parentData || !childData?.parentId) return;
//       try {
//         setParentLoading(true);
//         const token = await currentUser.getIdToken();
//         const data = await therapistService.getParentInfo(
//           childData.parentId,
//           token,
//         );
//         setParentData(data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setParentLoading(false);
//       }
//     };

//     if (activeTab === "parents" && childData) fetchParentInfo();
//   }, [activeTab, childData, parentData, currentUser]);

//   // 4. שליפת טופס ההסכמה
//   useEffect(() => {
//     const loadConsentForm = async () => {
//       if (!childData) return;
//       try {
//         const token = await currentUser.getIdToken();
//         const consent = await consentFormService.getByChild(childId, token);
//         setConsentForm(consent);
//       } catch (err) {
//         console.error("Error loading consent form:", err);
//       }
//     };
//     loadConsentForm();
//   }, [childData, childId, currentUser]);

//   // 3. שליפת רשימת אבחונים
//   const loadDiagnoses = async () => {
//     try {
//       setDiagnosesLoading(true);
//       const token = await currentUser.getIdToken();
//       const data = await therapistService.getDiagnoses(childId, token);
//       setDiagnoses(data);
//     } catch (err) {
//       console.error("Error loading diagnoses:", err);
//     } finally {
//       setDiagnosesLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (activeTab === "diagnoses") {
//       loadDiagnoses();
//       setSelectedDiagnosis(null);
//     }
//   }, [activeTab]);

//   const handleUpdateQStatus = async (diagnosisId, newStatus, childIdParam) => {
//     try {
//       const token = await currentUser.getIdToken();
//       await therapistService.updateQuestionnaireStatus(
//         diagnosisId,
//         newStatus,
//         token,
//         childIdParam || childId,
//       );
//       loadDiagnoses();
//     } catch (err) {
//       alert("שגיאה בעדכון הסטטוס");
//     }
//   };

//   const handleCreateDiagnosis = async () => {
//     try {
//       const token = await currentUser.getIdToken();
//       await therapistService.openNewDiagnosis(childId, token);
//       loadDiagnoses();
//     } catch (err) {
//       alert("שגיאה בפתיחת אבחון");
//     }
//   };

//   const handleSendMessage = async (messageText) => {
//     if (!messageText.trim()) return;
//     try {
//       const token = await currentUser.getIdToken();
//       const payload = {
//         receiverId: childData.parentId,
//         childId,
//         text: messageText,
//       };
//       await therapistService.sendMessage(payload, token);
//       alert("ההודעה נשלחה בהצלחה!");
//       setIsModalOpen(false);
//     } catch (err) {
//       alert("נכשלה שליחת ההודעה");
//     }
//   };

//   const renderContent = () => {
//     if (!childData) return null;

//     switch (activeTab) {
//       case "childInfo":
//         return (
//           <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 min-h-[450px] text-right animate-fadeIn font-sans">
//             <h2 className="text-3xl font-bold text-gray-800 mb-10 pb-6 border-b border-gray-100">
//               פרטי המטופל
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
//               <div>
//                 <p className="text-gray-400 text-sm mb-2">שם מלא</p>
//                 <p className="text-2xl font-bold">
//                   {childData.firstName} {childData.lastName}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-gray-400 text-sm mb-2">תעודת זהות</p>
//                 <p className="text-2xl font-bold">{childData.idNumber}</p>
//               </div>
//               <div>
//                 <p className="text-gray-400 text-sm mb-2">תאריך לידה</p>
//                 <p className="text-xl font-semibold">
//                   {childData.birthDate
//                     ? new Date(childData.birthDate).toLocaleDateString("he-IL")
//                     : "לא הוזן"}
//                 </p>
//               </div>
//             </div>
//           </div>
//         );

//       case "diagnoses":
//         return (
//           <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 min-h-[450px] text-right animate-fadeIn font-sans">
//             {!selectedDiagnosis ? (
//               <>
//                 <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
//                   <h2 className="text-3xl font-bold text-gray-800">
//                     ניהול אבחון
//                   </h2>
//                   <button
//                     onClick={handleCreateDiagnosis}
//                     className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
//                   >
//                     + פתיחת אבחון חדש
//                   </button>
//                 </div>
//                 {diagnosesLoading ? (
//                   <p>טוען אבחונים...</p>
//                 ) : (
//                   <DiagnosisList
//                     diagnoses={diagnoses}
//                     onSelect={setSelectedDiagnosis}
//                   />
//                 )}
//               </>
//             ) : (
//               <DiagnosisView
//                 diagnosis={selectedDiagnosis}
//                 onBack={() => setSelectedDiagnosis(null)}
//                 onUpdateStatus={handleUpdateQStatus}
//               />
//             )}
//           </div>
//         );

//       case "parents":
//         return (
//           <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 min-h-[450px] text-right animate-fadeIn font-sans">
//             <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-6 border-b border-gray-100">
//               פרטי התקשרות עם ההורים
//             </h2>
//             {parentLoading ? (
//               <p className="p-10 text-center">טוען פרטי הורה...</p>
//             ) : parentData ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
//                 <div className="space-y-6">
//                   <div className="flex flex-col">
//                     <span className="text-gray-400 text-sm">שם ההורה</span>
//                     <span className="text-xl font-bold text-gray-900">
//                       {parentData.firstName} {parentData.lastName}
//                     </span>
//                   </div>
//                   <div className="flex flex-col">
//                     <span className="text-gray-400 text-sm">אימייל</span>
//                     <span className="text-xl font-bold text-gray-900">
//                       {parentData.email}
//                     </span>
//                   </div>
//                   <div className="flex flex-col">
//                     <span className="text-gray-400 text-sm">טלפון</span>
//                     <span className="text-xl font-bold text-gray-900">
//                       {parentData.phone}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100 flex flex-col items-center justify-center text-center">
//                   <div className="text-4xl mb-4">✉️</div>
//                   <h3 className="text-indigo-900 font-bold text-lg mb-2">
//                     תקשורת מהירה
//                   </h3>
//                   <p className="text-indigo-700 text-sm mb-6">
//                     עדכני את ההורים על התקדמות האבחון או בקשי פרטים נוספים.
//                   </p>
//                   <button
//                     onClick={() => setIsModalOpen(true)}
//                     className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
//                   >
//                     שלחי הודעה להורה
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <p>הורה לא נמצא.</p>
//             )}
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   if (loading)
//     return (
//       <div className="p-20 text-center font-bold text-blue-600 animate-pulse">
//         טוען...
//       </div>
//     );

//   return (
//     <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans" dir="rtl">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-start mb-8">
//           <button
//             onClick={() => navigate("/patients")}
//             className="text-gray-400 hover:text-blue-600 font-medium flex items-center gap-2 group transition-all"
//           >
//             <span className="text-xl group-hover:-translate-x-1 transition-transform">
//               →
//             </span>{" "}
//             חזרה לרשימה
//           </button>
//         </div>

//         <div className="flex flex-wrap gap-3 mb-10">
//           {[
//             { id: "childInfo", label: "פרטי הילד" },
//             { id: "diagnoses", label: "אבחונים" },
//             { id: "parents", label: "פרטי הורים + הודעה" },
//           ].map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`px-10 py-4 rounded-2xl font-bold transition-all duration-300 text-lg ${activeTab === tab.id ? "bg-blue-600 text-white shadow-xl scale-105" : "bg-white text-gray-400 border border-gray-100 shadow-sm"}`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         <div className="w-full">{renderContent()}</div>

//         {/* המודל חייב להיות כאן מחוץ ל-Switch כדי שיעבוד תמיד */}
//         <GenericMessageModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           onSend={handleSendMessage}
//           title={parentData ? `הודעה ל${parentData.firstName}` : "הודעה להורה"}
//           placeholder={`כתבי הודעה בנוגע ל${childData?.firstName}...`}
//         />
//       </div>
//     </div>
//   );
// };

// export default DiagnosisDetails;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import therapistService from "../services/therapist.service";
import GenericMessageModal from "../components/GenericMessageModal";
import DiagnosisList from "../components/DiagnosisList";
import DiagnosisView from "../components/DiagnosisView";
import ConsentFormViewer from "../components/ConsentFormViewer";
import consentFormService from "../services/consentForm.service";

const DiagnosisDetails = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [childData, setChildData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("childInfo");
  const [parentData, setParentData] = useState(null);
  const [parentLoading, setParentLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [diagnoses, setDiagnoses] = useState([]);
  const [diagnosesLoading, setDiagnosesLoading] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);

  // 🆕 Consent Form
  const [consentForm, setConsentForm] = useState(null);
  const [isConsentViewerOpen, setIsConsentViewerOpen] = useState(false);

  // 1. שליפת פרטי ילד
  useEffect(() => {
    const loadChildDetails = async () => {
      try {
        setLoading(true);
        const token = await currentUser.getIdToken();
        const data = await therapistService.getChildDetails(childId, token);
        setChildData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser && childId) loadChildDetails();
  }, [currentUser, childId]);

  // 2. שליפת פרטי הורה (כשעוברים לטאב הורים)
  useEffect(() => {
    const fetchParentInfo = async () => {
      if (parentData || !childData?.parentId) return;
      try {
        setParentLoading(true);
        const token = await currentUser.getIdToken();
        const data = await therapistService.getParentInfo(
          childData.parentId,
          token,
        );
        setParentData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setParentLoading(false);
      }
    };

    if (activeTab === "parents" && childData) fetchParentInfo();
  }, [activeTab, childData, parentData, currentUser]);

  // 🆕 4. שליפת טופס ההסכמה של האבחון הנבחר (Diagnosis-centric)
  useEffect(() => {
    const loadConsentForm = async () => {
      if (!selectedDiagnosis?.id) {
        setConsentForm(null);
        return;
      }
      try {
        const token = await currentUser.getIdToken();
        const consent = await consentFormService.getByDiagnosis(
          selectedDiagnosis.id,
          token,
        );
        setConsentForm(consent);
      } catch (err) {
        console.error("Error loading consent form:", err);
      }
    };
    loadConsentForm();
  }, [selectedDiagnosis, currentUser]);

  // 3. שליפת רשימת אבחונים
  const loadDiagnoses = async () => {
    try {
      setDiagnosesLoading(true);
      const token = await currentUser.getIdToken();
      const data = await therapistService.getDiagnoses(childId, token);
      setDiagnoses(data);
    } catch (err) {
      console.error("Error loading diagnoses:", err);
    } finally {
      setDiagnosesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "diagnoses") {
      loadDiagnoses();
      setSelectedDiagnosis(null);
    }
  }, [activeTab]);

  const handleUpdateQStatus = async (diagnosisId, newStatus, childIdParam) => {
    try {
      const token = await currentUser.getIdToken();
      await therapistService.updateQuestionnaireStatus(
        diagnosisId,
        newStatus,
        token,
        childIdParam || childId,
      );
      loadDiagnoses();
    } catch (err) {
      alert("שגיאה בעדכון הסטטוס");
    }
  };

  const handleCreateDiagnosis = async () => {
    try {
      const token = await currentUser.getIdToken();
      await therapistService.openNewDiagnosis(childId, token);
      loadDiagnoses();
    } catch (err) {
      alert("שגיאה בפתיחת אבחון");
    }
  };

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;
    try {
      const token = await currentUser.getIdToken();
      const payload = {
        receiverId: childData.parentId,
        childId,
        text: messageText,
      };
      await therapistService.sendMessage(payload, token);
      alert("ההודעה נשלחה בהצלחה!");
      setIsModalOpen(false);
    } catch (err) {
      alert("נכשלה שליחת ההודעה");
    }
  };

  const renderContent = () => {
    if (!childData) return null;

    switch (activeTab) {
      case "childInfo":
        return (
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 min-h-[450px] text-right animate-fadeIn font-sans">
            <h2 className="text-3xl font-bold text-gray-800 mb-10 pb-6 border-b border-gray-100">
              פרטי המטופל
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">
              <div>
                <p className="text-gray-400 text-sm mb-2">שם מלא</p>
                <p className="text-2xl font-bold">
                  {childData.firstName} {childData.lastName}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">מספר מזהה</p>
                <p className="text-2xl font-bold">{childData.idNumber}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">תאריך לידה</p>
                <p className="text-xl font-semibold">
                  {childData.birthDate
                    ? new Date(childData.birthDate).toLocaleDateString("he-IL")
                    : "לא הוזן"}
                </p>
              </div>
            </div>

            {/* 🆕 כרטיס טופס הסכמה */}
            {consentForm &&
              (() => {
                const registered = consentForm.parents?.find(
                  (p) => p.role === "registered",
                );
                const external = consentForm.parents?.find(
                  (p) => p.role === "external",
                );
                const signedCount =
                  consentForm.parents?.filter((p) => p.signed).length || 0;
                const totalCount = consentForm.parents?.length || 0;

                const statusInfo = {
                  fully_signed: {
                    bg: "bg-green-50/70",
                    border: "border-green-200",
                    badge: "bg-green-100 text-green-700",
                    badgeText: "✅ חתום במלואו",
                    description: "שני ההורים אישרו את האבחון",
                  },
                  partially_signed: {
                    bg: "bg-amber-50/70",
                    border: "border-amber-200",
                    badge: "bg-amber-100 text-amber-700",
                    badgeText: "🕒 חתום חלקית",
                    description: external
                      ? `${registered?.name || "הורה רשום"} חתם, ממתין ל-${external.name}`
                      : `${registered?.name || "הורה רשום"} חתם`,
                  },
                  pending: {
                    bg: "bg-gray-50/70",
                    border: "border-gray-200",
                    badge: "bg-gray-100 text-gray-700",
                    badgeText: "⏳ ממתין לחתימה",
                    description: "ההורים טרם חתמו על הטופס",
                  },
                };

                const info =
                  statusInfo[consentForm.status] || statusInfo.pending;

                return (
                  <div
                    className={`${info.bg} border ${info.border} rounded-2xl p-6 cursor-pointer hover:shadow-md transition-all`}
                    onClick={() => setIsConsentViewerOpen(true)}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <span className="text-4xl">📋</span>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-800">
                              טופס הסכמה לאבחון
                            </h3>
                            <span
                              className={`text-xs px-2 py-1 rounded font-bold ${info.badge}`}
                            >
                              {info.badgeText}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">
                            {info.description}
                          </p>
                          <p className="text-gray-400 text-xs mt-2">
                            {signedCount} מתוך {totalCount} הורים חתמו •
                            <span className="text-blue-600 font-bold mr-1">
                              לחצי לצפייה בפרטים →
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
          </div>
        );

      case "diagnoses":
        return (
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 min-h-[450px] text-right animate-fadeIn font-sans">
            {!selectedDiagnosis ? (
              <>
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                  <h2 className="text-3xl font-bold text-gray-800">
                    ניהול אבחון
                  </h2>
                  <button
                    onClick={handleCreateDiagnosis}
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
                  >
                    + פתיחת אבחון חדש
                  </button>
                </div>
                {diagnosesLoading ? (
                  <p>טוען אבחונים...</p>
                ) : (
                  <DiagnosisList
                    diagnoses={diagnoses}
                    onSelect={setSelectedDiagnosis}
                  />
                )}
              </>
            ) : (
              <DiagnosisView
                diagnosis={selectedDiagnosis}
                onBack={() => setSelectedDiagnosis(null)}
                onUpdateStatus={handleUpdateQStatus}
                onDeleted={() => {
                  setSelectedDiagnosis(null);
                  loadDiagnoses();
                }}
              />
            )}
          </div>
        );

      case "parents":
        return (
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 min-h-[450px] text-right animate-fadeIn font-sans">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-6 border-b border-gray-100">
              פרטי התקשרות עם ההורים
            </h2>
            {parentLoading ? (
              <p className="p-10 text-center">טוען פרטי הורה...</p>
            ) : parentData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                <div className="space-y-6">
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">שם ההורה</span>
                    <span className="text-xl font-bold text-gray-900">
                      {parentData.firstName} {parentData.lastName}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">אימייל</span>
                    <span className="text-xl font-bold text-gray-900">
                      {parentData.email}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">טלפון</span>
                    <span className="text-xl font-bold text-gray-900">
                      {parentData.phone}
                    </span>
                  </div>
                </div>
                <div className="bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100 flex flex-col items-center justify-center text-center">
                  <div className="text-4xl mb-4">✉️</div>
                  <h3 className="text-indigo-900 font-bold text-lg mb-2">
                    תקשורת מהירה
                  </h3>
                  <p className="text-indigo-700 text-sm mb-6">
                    עדכון ההורים על התקדמות האבחון או בקשת פרטים נוספים.
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                  >
                    שליחת הודעה להור{" "}
                  </button>
                </div>
              </div>
            ) : (
              <p>הורה לא נמצא.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center font-bold text-blue-600 animate-pulse">
        טוען...
      </div>
    );

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-start mb-8">
          <button
            onClick={() => navigate("/patients")}
            className="text-gray-400 hover:text-blue-600 font-medium flex items-center gap-2 group transition-all"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">
              →
            </span>{" "}
            חזרה לרשימה
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          {[
            { id: "childInfo", label: "פרטי הילד" },
            { id: "diagnoses", label: "אבחונים" },
            { id: "parents", label: "פרטי הורים + הודעה" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-10 py-4 rounded-2xl font-bold transition-all duration-300 text-lg ${activeTab === tab.id ? "bg-blue-600 text-white shadow-xl scale-105" : "bg-white text-gray-400 border border-gray-100 shadow-sm"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full">{renderContent()}</div>

        {/* המודל חייב להיות כאן מחוץ ל-Switch כדי שיעבוד תמיד */}
        <GenericMessageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSend={handleSendMessage}
          title={parentData ? `הודעה ל${parentData.firstName}` : "הודעה להורה"}
          placeholder={`כתבי הודעה בנוגע ל${childData?.firstName}...`}
        />

        {/* 🆕 מודאל צפייה בטופס ההסכמה */}
        <ConsentFormViewer
          isOpen={isConsentViewerOpen}
          onClose={() => setIsConsentViewerOpen(false)}
          consentForm={consentForm}
        />
      </div>
    </div>
  );
};

export default DiagnosisDetails;
