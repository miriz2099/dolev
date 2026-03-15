// export default ChildDetails;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ChildTabsHeader from "../components/ChildTabsHeader";
import ContactTherapist from "../components/ContactTherapist";
import ParentQuestionnaire from "../components/ParentQuestionnaire"; // ייבוא הקומפוננטה החדשה

const ChildDetails = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [childData, setChildData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  // State חדש לניהול הצגת השאלון
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  useEffect(() => {
    const fetchChildDetails = async () => {
      try {
        setLoading(true);
        const idToken = await currentUser.getIdToken();
        const baseUrl = import.meta.env.VITE_API_URL;

        const response = await fetch(`${baseUrl}/children/${childId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("שגיאה בטעינת הנתונים");
        }

        const data = await response.json();
        setChildData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && childId) {
      fetchChildDetails();
    }
  }, [currentUser, childId]);

  // פונקציה שתופעל כשהשאלון נשמר
  const handleQuestionnaireSave = async (formData) => {
    console.log("שומר נתונים עבור ילד:", childId, formData);
    // כאן בהמשך נוסיף את הקריאה ל-API לשמירת ה-JSON בבאקנד
    setShowQuestionnaire(false);
    alert("השאלון נשמר בהצלחה (זמנית בלוג)");
  };

  const renderContent = () => {
    if (!childData) return null;

    // אם ההורה בחר למלא שאלון, נציג רק אותו במקום התוכן הרגיל
    if (showQuestionnaire) {
      return (
        <ParentQuestionnaire
          childId={childId}
          onSave={handleQuestionnaireSave}
          onCancel={() => setShowQuestionnaire(false)}
        />
      );
    }

    switch (activeTab) {
      case "info":
        return (
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] text-right animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-800 mb-10 pb-6 border-b border-gray-100">
              פרטי הילד
            </h2>
            <div className="flex flex-row justify-start gap-32 mb-12">
              <div className="flex flex-col">
                <p className="text-gray-400 text-sm mb-2 font-medium">שם מלא</p>
                <p className="text-2xl font-bold text-gray-900">
                  {childData.firstName} {childData.lastName}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-gray-400 text-sm mb-2 font-medium">
                  תעודת זהות
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {childData.idNumber}
                </p>
              </div>
            </div>
            {/* תיבת המאבחן כפי שהייתה */}
            <div className="mt-12 max-w-2xl">
              <div className="p-6 bg-blue-50 rounded-2xl flex items-center justify-between border border-blue-100">
                <div>
                  <p className="text-blue-600 font-semibold text-sm">
                    מאבחן אחראי
                  </p>
                  <p className="text-xl font-bold text-blue-900">
                    {childData.therapistName || "טרם שובץ"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "forms":
        return (
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] text-right animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-6 border-b border-gray-100">
              אישורים וטפסים
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50 flex flex-col items-start gap-4">
                <span className="text-4xl">🏠</span>
                <h3 className="text-xl font-bold text-gray-800">שאלון הורים</h3>
                <p className="text-gray-600 text-sm">
                  לחצו כאן כדי להתחיל במילוי השאלון המפורט.
                </p>
                <button
                  onClick={() => setShowQuestionnaire(true)} // פתיחת השאלון
                  className="mt-auto w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                  למילוי שאלון הורים
                </button>
              </div>
              {/* כרטיס שאלון בית ספר נשאר אותו דבר */}
              <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50 flex flex-col items-start gap-4 opacity-60">
                <span className="text-4xl">🏫</span>
                <h3 className="text-xl font-bold text-gray-800">
                  שאלון בית ספר
                </h3>
                <p className="text-gray-600 text-sm">
                  שאלון למורה/צוות חינוכי.
                </p>
                <button
                  disabled
                  className="mt-auto w-full bg-gray-400 text-white py-3 rounded-xl font-bold cursor-not-allowed"
                >
                  בקרוב
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-right p-10">התוכן ייטען בקרוב...</div>;
    }
  };

  if (loading) return <div className="p-20 text-center">טוען...</div>;

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen" dir="rtl">
      <div className="max-w-7xl mx-auto flex justify-start mb-6">
        <button
          onClick={() =>
            showQuestionnaire ? setShowQuestionnaire(false) : navigate(-1)
          }
          className="text-gray-500 hover:text-blue-600 flex items-center gap-2"
        >
          <span>→</span>{" "}
          {showQuestionnaire ? "ביטול וחזרה לפרטים" : "חזרה לרשימה"}
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* מחביאים את הטאבים בזמן מילוי השאלון כדי לתת פוקוס למשתמש */}
        {!showQuestionnaire && (
          <ChildTabsHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        )}

        <div
          className={`grid grid-cols-1 ${showQuestionnaire ? "" : "lg:grid-cols-12"} gap-8 items-start`}
        >
          <div className={showQuestionnaire ? "w-full" : "lg:col-span-9"}>
            {renderContent()}
          </div>
          {!showQuestionnaire && (
            <div className="lg:col-span-3">
              <ContactTherapist
                therapistName={childData?.therapistName || "המרכז"}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChildDetails;
