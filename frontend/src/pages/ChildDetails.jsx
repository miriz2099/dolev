import React, { useState, useEffect, useCallback } from "react"; // ✅
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ChildTabsHeader from "../components/ChildTabsHeader";
import ContactTherapist from "../components/ContactTherapist";
import ParentQuestionnaire from "../components/ParentQuestionnaire";
import FullChatWindow from "../components/FullChatWindow";
import GenericMessageModal from "../components/GenericMessageModal";
import messageService from "../services/message.service";
import therapistService from "../services/therapist.service";
import schoolQuestionnaireService from "../services/schoolQuestionnaire.service";

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

  // School Questionnaire Logic
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [sendingInvite, setSendingInvite] = useState(false);
  const [schoolInvite, setSchoolInvite] = useState(null);
  const [activeDiagnosis, setActiveDiagnosis] = useState(null);

  // 🔴 חישוב תקין של "יש הודעות חדשות" - רק הודעות שאני הנמען שלהן
  const hasUnreadMessages = messages.some(
    (m) => !m.read && m.receiverId === currentUser?.uid,
  );

  // Fetch active diagnosis & school invite status
  const fetchStatus = useCallback(async () => {
    try {
      const token = await currentUser.getIdToken();
      const diagnoses = await therapistService.getDiagnoses(childId, token);
      if (diagnoses && diagnoses.length > 0) {
        setActiveDiagnosis(diagnoses[0]);
      }
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

  // Fetch child data and messages
  const fetchData = useCallback(async () => {
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
  }, [childId, currentUser]);

  useEffect(() => {
    if (currentUser && childId) fetchData();
  }, [fetchData, currentUser, childId]);

  // Mark as read - רק כשהמשתמש בלשונית הודעות
  useEffect(() => {
    const markAsRead = async () => {
      if (activeTab === "messages" && hasUnreadMessages) {
        try {
          const token = await currentUser.getIdToken();
          await messageService.markMessagesAsRead(childId, token);
          // עדכון הסטייט המקומי - רק הודעות שאני הנמען שלהן
          setMessages((prev) =>
            prev.map((msg) =>
              msg.receiverId === currentUser.uid ? { ...msg, read: true } : msg,
            ),
          );
        } catch (err) {
          console.error("Failed to mark messages as read:", err);
        }
      }
    };
    markAsRead();
  }, [activeTab, childId, currentUser, hasUnreadMessages]);

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
      fetchStatus();
    } catch (err) {
      console.error("Error sending invite:", err);
      alert("שגיאה בשליחת השאלון");
    } finally {
      setSendingInvite(false);
    }
  };

  // שליחת הודעה דרך המודל המהיר (Quick Action)
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
      // רענון ההודעות כדי שיופיעו בצ'אט
      fetchData();
    } catch (err) {
      alert("שגיאה בשליחה");
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

      // ✨ הלשונית החדשה - צ'אט מלא במקום רשימת הודעות
      case "messages":
        return (
          <div className="bg-transparent rounded-3xl h-[600px] animate-fadeIn">
            <FullChatWindow
              childId={childId}
              receiverId={childData.therapistId}
              onBack={() => setActiveTab("info")}
            />
          </div>
        );

      case "forms":
        const qStatus = activeDiagnosis?.parentQuestionnaireStatus;
        const canFillParent =
          childData.canFillQuestionnaire &&
          (qStatus === "פתוח" || qStatus === "לתיקון");
        const hasActiveDiag = !!activeDiagnosis;
        const isSchoolInviteActive =
          schoolInvite &&
          (schoolInvite.status === "pending" ||
            schoolInvite.status === "completed");

        return (
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] text-right animate-fadeIn font-sans">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-6 border-b border-gray-100">
              אישורים וטפסים
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Parent Questionnaire Card */}
              <div
                className={`p-6 border rounded-2xl flex flex-col items-start gap-4 transition-all ${
                  !canFillParent
                    ? "bg-gray-50 opacity-80"
                    : "bg-white border-blue-100 shadow-sm"
                }`}
              >
                <div className="flex justify-between w-full">
                  <span className="text-4xl">🏠</span>
                  {qStatus && (
                    <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 font-bold">
                      סטטוס: {qStatus}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800">שאלון הורים</h3>
                <p className="text-gray-500 text-sm">
                  מילוי פרטים על הרקע ההתפתחותי והתנהגות הילד בבית.
                </p>
                <button
                  onClick={() => canFillParent && setShowQuestionnaire(true)}
                  disabled={!canFillParent}
                  className={`mt-auto w-full py-3 rounded-xl font-bold transition-all ${
                    canFillParent
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  {qStatus === "נשלח" ? "נשלח למאבחן" : "למילוי שאלון הורים"}
                </button>
              </div>

              {/* School Questionnaire Card */}
              <div
                className={`p-6 border rounded-2xl flex flex-col items-start gap-4 transition-all ${
                  !hasActiveDiag || isSchoolInviteActive
                    ? "bg-gray-50 opacity-90 border-gray-200"
                    : "bg-white border-green-100 shadow-sm"
                }`}
              >
                <div className="flex justify-between w-full">
                  <span className="text-4xl">🏫</span>
                  {isSchoolInviteActive && (
                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 font-bold">
                      ✅ הקישור נשלח
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  שאלון בית ספר
                </h3>
                <p className="text-gray-500 text-sm">
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

            {/* Teacher Details Modal */}
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
      <div className="max-w-7xl mx-auto flex justify-start mb-6">
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
            hasUnreadMessages={hasUnreadMessages}
          />
        )}
        <div
          className={`grid grid-cols-1 ${
            showQuestionnaire ? "" : "lg:grid-cols-12"
          } gap-8 items-start`}
        >
          <div className={showQuestionnaire ? "w-full" : "lg:col-span-9"}>
            {renderContent()}
          </div>
          {!showQuestionnaire && (
            <div className="lg:col-span-3">
              {/* 🎯 הכפילות המכוונת - Quick Action לשליחת הודעה מהירה */}
              <ContactTherapist
                therapistName={childData?.therapistName || "המרכז"}
                onClick={() => setIsModalOpen(true)}
              />
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
