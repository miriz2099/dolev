import React, { useState, useEffect } from "react";
import therapistService from "../services/therapist.service";
import QuestionnaireViewer from "./QuestionnaireViewer";
import GenericMessageModal from "./GenericMessageModal"; // ודאי שהנתיב נכון
import { useAuth } from "../contexts/AuthContext";

const DiagnosisView = ({ diagnosis, onBack, childName }) => {
  // הוספתי childName כפרופ אם יש
  const [activeSubTab, setActiveSubTab] = useState("questionnaires");
  const [parentAnswers, setParentAnswers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(
    diagnosis.parentQuestionnaireStatus,
  );
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (activeSubTab === "questionnaires" && currentStatus === "נשלח") {
      fetchAnswers();
    }
  }, [activeSubTab, currentStatus]);

  const fetchAnswers = async () => {
    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      const data = await therapistService.getParentAnswers(
        diagnosis.childId,
        token,
      );
      setParentAnswers(data);
    } catch (err) {
      console.error("Error fetching answers:", err);
    } finally {
      setLoading(false);
    }
  };

  // פונקציה שמבצעת את ההחזרה לתיקון ושליחת ההודעה
  const handleConfirmCorrection = async (messageText) => {
    try {
      const token = await currentUser.getIdToken();

      // 1. הודעה גנרית אם המאבחן לא כתב כלום
      const finalMessage = messageText.trim()
        ? messageText
        : `שלום, השאלון הוחזר אליכם לתיקון או הוספת פרטים. נא להיכנס ללשונית "אישורים וטפסים" ולעדכן. תודה!`;

      // 2. עדכון הסטטוס ב-DB (פתיחת המנעול בילד + עדכון האבחון)
      await therapistService.updateQuestionnaireStatus(
        diagnosis.id,
        "לתיקון",
        token,
        diagnosis.childId,
      );

      // 3. שליחת ההודעה להורה דרך הסרביס הקיים
      const messagePayload = {
        receiverId: diagnosis.parentId || parentAnswers?.parentId, // ודאי שיש לך גישה ל-parentId
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
      case "questionnaires":
        return (
          <div className="space-y-6 animate-fadeIn text-right" dir="rtl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-5 border border-blue-100 rounded-2xl bg-blue-50/30 flex justify-between items-center shadow-sm">
                <div>
                  <h5 className="font-bold text-gray-800">שאלון הורים</h5>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`w-2 h-2 rounded-full ${currentStatus === "נשלח" ? "bg-green-500" : "bg-orange-500"}`}
                    ></span>
                    <p className="text-sm text-gray-500 font-medium">
                      סטטוס: {currentStatus}
                    </p>
                  </div>
                </div>
                {currentStatus === "נשלח" && (
                  <button
                    onClick={() => setIsCorrectionModalOpen(true)} // פתיחת המודל במקום confirm פשוט
                    className="bg-white text-orange-600 border border-orange-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-50 transition-all shadow-sm active:scale-95"
                  >
                    ↩ החזר לתיקון
                  </button>
                )}
              </div>
              {/* ... שאלון בית ספר */}
            </div>

            {currentStatus === "נשלח" ? (
              loading ? (
                <div className="p-20 text-center font-bold text-blue-500 animate-pulse">
                  טוען תשובות...
                </div>
              ) : (
                <QuestionnaireViewer data={parentAnswers} />
              )
            ) : (
              <div className="p-20 border-2 border-dashed border-gray-100 rounded-3xl text-center text-gray-400">
                <p className="text-lg">
                  השאלון נמצא כרגע בסטטוס: {currentStatus}
                </p>
                <p className="text-sm mt-2">
                  הודעה נשלחה להורים לעדכון הפרטים.
                </p>
              </div>
            )}
          </div>
        );
      // ... report case
      default:
        return null;
    }
  };

  return (
    <div className="font-sans animate-fadeIn" dir="rtl">
      {/* Header ו-Tabs (כמו קודם) */}
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
          <h3 className="text-2xl font-bold text-gray-800">ניהול אבחון</h3>
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

      {/* מודל ההודעה להחזרה לתיקון */}
      <GenericMessageModal
        isOpen={isCorrectionModalOpen}
        onClose={() => setIsCorrectionModalOpen(false)}
        onSend={handleConfirmCorrection}
        title="החזרת שאלון לתיקון"
        placeholder="הוסיפי הערות להורים (מה עליהם לתקן או להשלים)... אם תשאירי ריק, תשלח הודעה גנרית."
      />
    </div>
  );
};

export default DiagnosisView;
