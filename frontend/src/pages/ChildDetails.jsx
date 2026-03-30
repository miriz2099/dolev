import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ChildTabsHeader from "../components/ChildTabsHeader";
import ContactTherapist from "../components/ContactTherapist";
import ParentQuestionnaire from "../components/ParentQuestionnaire";
import messageService from "../services/message.service";
import therapistService from "../services/therapist.service";
import schoolQuestionnaireService from "../services/schoolQuestionnaire.service";
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

  // לוגיקת שאלון בית ספר
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [sendingInvite, setSendingInvite] = useState(false);
  const [schoolInvite, setSchoolInvite] = useState(null); // אחסון נתוני ההזמנה לבי"ס

  const [activeDiagnosis, setActiveDiagnosis] = useState(null);

  // פונקציה לבדיקת סטטוסים (אבחון + הזמנת בי"ס)
  const fetchStatus = useCallback(async () => {
    try {
      const token = await currentUser.getIdToken();

      // 1. משיכת אבחון פעיל
      const diagnoses = await therapistService.getDiagnoses(childId, token);
      if (diagnoses && diagnoses.length > 0) {
        setActiveDiagnosis(diagnoses[0]);
      }

      // 2. משיכת הזמנה לבית ספר (הפונקציה שכתבנו בסרביס)
      const invite = await schoolQuestionnaireService.getInviteByChild(
        childId,
        token,
      );
      setSchoolInvite(invite);
    } catch (err) {
      console.error("Error fetching status:", err);
    }
  }, [childId, currentUser]);

  useEffect(() => {
    if (currentUser && childId) fetchStatus();
  }, [fetchStatus, currentUser, childId]);

  // שליפת נתוני ילד והודעות
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

  useEffect(() => {
    const markAsRead = async () => {
      // 1. בודקים אם אנחנו בלשונית הודעות
      // 2. בודקים אם יש בכלל הודעות שלא נקראו (כדי לא לשלוח סתם בקשות)
      if (activeTab === "messages" && messages.some((m) => !m.read)) {
        try {
          const token = await currentUser.getIdToken();

          // קריאה לסרביס (שימי לב שזה השם הנכון של הפונקציה בסרביס שלך)
          await messageService.markMessagesAsRead(childId, token);

          // עדכון הסטייט המקומי כדי שהנקודה האדומה תיעלם מיד מהמסך
          setMessages((prev) => prev.map((msg) => ({ ...msg, read: true })));
        } catch (err) {
          console.error("Failed to mark messages as read:", err);
        }
      }
    };

    markAsRead();
  }, [activeTab, childId, currentUser, messages]);

  const handleSendToSchool = async () => {
    if (!teacherEmail || !teacherName) {
      alert("נא למלא את כל פרטי המורה");
      return;
    }
    try {
      setSendingInvite(true);
      const token = await currentUser.getIdToken();
      await schoolQuestionnaireService.sendInvite(
        { childId, teacherEmail, teacherName },
        token,
      );

      alert(`הקישור נשלח בהצלחה למייל של ${teacherName}`);
      setIsSchoolModalOpen(false);
      fetchStatus(); // רענון הסטטוס כדי לנעול את הכפתור מיד
    } catch (err) {
      console.error("Error sending invite:", err);
      alert("שגיאה בשליחת השאלון");
    } finally {
      setSendingInvite(false);
    }
  };

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

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("האם למחוק את ההודעה לצמיתות?")) return;

    try {
      const token = await currentUser.getIdToken();
      // קריאה לפונקציית המחיקה בסרביס ההודעות שלך
      await messageService.deleteMessage(messageId, token);

      // עדכון הסטייט המקומי כדי שההודעה תיעלם מהמסך מיד
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (err) {
      console.error("Failed to delete message:", err);
      alert("שגיאה במחיקת ההודעה");
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
            window.location.reload();
          }}
          onCancel={() => setShowQuestionnaire(false)}
        />
      );
    }

    switch (activeTab) {
      case "info":
        return (
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] text-right animate-fadeIn font-sans">
            <h2 className="text-3xl font-bold text-gray-800 mb-10 pb-6 border-b border-gray-100">
              פרטי הילד
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <p className="text-gray-400 text-sm mb-1">שם מלא</p>
                <p className="text-xl font-bold text-gray-900">
                  {childData.firstName} {childData.lastName}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">תעודת זהות</p>
                <p className="text-xl font-bold text-gray-900">
                  {childData.idNumber}
                </p>
              </div>
            </div>
          </div>
        );

      // case "messages":
      //   return (
      //     <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] text-right animate-fadeIn font-sans">
      //       <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-6 border-b border-gray-100">
      //         הודעות מהמאבחן
      //       </h2>
      //       {messages.length === 0 ? (
      //         <p className="text-gray-500 italic">אין הודעות חדשות.</p>
      //       ) : (
      //         <div className="space-y-4">
      //           {messages.map((msg) => (
      //             <div
      //               key={msg.id}
      //               className="p-6 bg-blue-50 border border-blue-100 rounded-2xl"
      //             >
      //               <p className="text-gray-800">{msg.text}</p>
      //               <span className="text-xs text-blue-400 mt-2 block font-mono">
      //                 {new Date(msg.createdAt).toLocaleString("he-IL")}
      //               </span>
      //             </div>
      //           ))}
      //         </div>
      //       )}
      //     </div>
      //   );

      case "messages":
        return (
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] text-right animate-fadeIn font-sans">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-6 border-b border-gray-100">
              הודעות מהמאבחן
            </h2>
            {messages.length === 0 ? (
              <p className="text-gray-500 italic">אין הודעות חדשות.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-6 border rounded-2xl relative group transition-all ${
                      msg.read
                        ? "bg-white border-gray-100"
                        : "bg-blue-50/50 border-blue-100 shadow-sm"
                    }`}
                  >
                    {/* כפתור מחיקה - מופיע רק כשעוברים עם העכבר על ההודעה (בזכות group-hover) */}
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="absolute left-6 top-6 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-2"
                      title="מחק הודעה"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>

                    <div className="ml-8">
                      {" "}
                      {/* ריווח כדי שהטקסט לא יעלה על הכפתור */}
                      <p className="text-gray-800 leading-relaxed">
                        {msg.text}
                      </p>
                      <span className="text-xs text-blue-400 mt-2 block font-mono">
                        {new Date(msg.createdAt).toLocaleString("he-IL")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "forms":
        const qStatus = activeDiagnosis?.parentQuestionnaireStatus;
        const canFillParent =
          childData.canFillQuestionnaire &&
          (qStatus === "פתוח" || qStatus === "לתיקון");
        const hasActiveDiag = !!activeDiagnosis;

        // לוגיקת הנעילה לשאלון בית ספר
        const isSchoolInviteActive =
          schoolInvite &&
          (schoolInvite.status === "pending" ||
            schoolInvite.status === "completed");

        return (
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] text-right animate-fadeIn font-sans">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-6 border-b border-gray-100 font-sans">
              אישורים וטפסים
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
              {/* כרטיס שאלון הורים */}
              <div
                className={`p-6 border rounded-2xl flex flex-col items-start gap-4 transition-all ${!canFillParent ? "bg-gray-50 opacity-80" : "bg-white border-blue-100 shadow-sm"}`}
              >
                <div className="flex justify-between w-full">
                  <span className="text-4xl">🏠</span>
                  {qStatus && (
                    <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 font-bold">
                      סטטוס: {qStatus}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800 font-sans">
                  שאלון הורים
                </h3>
                <p className="text-gray-500 text-sm font-sans">
                  מילוי פרטים על הרקע ההתפתחותי והתנהגות הילד בבית.
                </p>
                <button
                  onClick={() => canFillParent && setShowQuestionnaire(true)}
                  disabled={!canFillParent}
                  className={`mt-auto w-full py-3 rounded-xl font-bold transition-all ${canFillParent ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500"}`}
                >
                  {qStatus === "נשלח" ? "נשלח למאבחן" : "למילוי שאלון הורים"}
                </button>
              </div>

              {/* כרטיס שאלון בית ספר - עם לוגיקת הנעילה */}
              <div
                className={`p-6 border rounded-2xl flex flex-col items-start gap-4 transition-all ${!hasActiveDiag || isSchoolInviteActive ? "bg-gray-50 opacity-90 border-gray-200" : "bg-white border-green-100 shadow-sm"}`}
              >
                <div className="flex justify-between w-full font-sans">
                  <span className="text-4xl font-sans">🏫</span>
                  {isSchoolInviteActive && (
                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 font-bold">
                      ✅ הקישור נשלח
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800 font-sans">
                  שאלון בית ספר
                </h3>
                <p className="text-gray-500 text-sm font-sans">
                  {isSchoolInviteActive
                    ? `נשלח למורה ${schoolInvite.teacherName}. הגישה למילוי חסומה כעת.`
                    : "שליחת קישור מאובטח למורה למילוי חוות דעת לימודית."}
                </p>
                <button
                  disabled={!hasActiveDiag || isSchoolInviteActive}
                  onClick={() => setIsSchoolModalOpen(true)}
                  className={`mt-auto w-full py-3 rounded-xl font-bold transition-all ${
                    isSchoolInviteActive
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : hasActiveDiag
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 text-gray-500"
                  }`}
                >
                  {isSchoolInviteActive
                    ? "הקישור נשלח למורה"
                    : "📩 שלח קישור למורה"}
                </button>
              </div>
            </div>

            {/* מודל הזנת פרטי מורה */}
            {isSchoolModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 animate-fadeIn">
                <div
                  className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative text-right"
                  dir="rtl"
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    שליחת שאלון למורה
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        שם המורה
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="לדוגמה: המורה שרה"
                        value={teacherName}
                        onChange={(e) => setTeacherName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        מייל המורה
                      </label>
                      <input
                        type="email"
                        className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="teacher@school.com"
                        value={teacherEmail}
                        onChange={(e) => setTeacherEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={handleSendToSchool}
                      disabled={sendingInvite}
                      className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all disabled:bg-gray-400"
                    >
                      {sendingInvite ? "שולח..." : "שלח קישור במייל"}
                    </button>
                    <button
                      onClick={() => setIsSchoolModalOpen(false)}
                      className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200"
                    >
                      ביטול
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center font-bold text-blue-600 animate-pulse font-sans">
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
          className="text-gray-400 hover:text-blue-600 flex items-center gap-2"
        >
          <span>→</span> {showQuestionnaire ? "ביטול וחזרה" : "חזרה"}
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
