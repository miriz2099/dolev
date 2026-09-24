// export default ApproveUsers;
import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import InquiriesList from "../components/InquiriesList";
import AddParentModal from "../components/AddParentModal";
import AddChildModal from "../components/AddChildModal"; // 1. ייבוא המודאל החדש
import { updateInquiryStatus } from "../services/inquiry.service";

const ApproveUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. States לשליטה בשני המודאלים
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [isChildModalOpen, setIsChildModalOpen] = useState(false);

  // States למילוי מראש של מודל ההורה כשנפתח מתוך פנייה
  const [parentInitialData, setParentInitialData] = useState(null);
  const [sourceInquiryId, setSourceInquiryId] = useState(null);

  // State לבחירת מה לעשות בפנייה המקורית אחרי יצירת ההורה בהצלחה
  const [showInquiryStatusChoice, setShowInquiryStatusChoice] = useState(false);

  // שומר את מזהה הפנייה ברגע ההצלחה - כי handleParentModalClose (שנקרא
  // מיד אחרי onSuccess ב-AddParentModal) מאפס את sourceInquiryId, לפני
  // שהמנהל מספיק לבחור סטטוס בחלון החדש
  const capturedInquiryIdRef = useRef(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "users"),
        where("status", "==", "pending"),
      );
      const querySnapshot = await getDocs(q);
      setPendingUsers(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      );
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  // פתיחת מודל ההורה עם פרטים ממולאים מראש מתוך פנייה
  const handleAddInquiryAsParent = (inquiry) => {
    const nameParts = (inquiry.fullname || "").trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ");

    const parentData = {
      firstName,
      lastName,
      email: inquiry.email,
      phone: inquiry.phone,
    };

    // 🆕 אם בפנייה יש גם פרטי ילד/ה - נעביר אותם הלאה למילוי אוטומטי
    // של הסעיף האופציונלי ב-AddParentModal
    if (inquiry.childFirstName && inquiry.childLastName) {
      parentData.child = {
        firstName: inquiry.childFirstName,
        lastName: inquiry.childLastName,
        birthDate: inquiry.childBirthDate || "",
      };
    }

    setParentInitialData(parentData);
    setSourceInquiryId(inquiry.id);
    setIsParentModalOpen(true);
  };

  const handleParentModalClose = () => {
    setIsParentModalOpen(false);
    setParentInitialData(null);
    setSourceInquiryId(null);
  };

  const handleParentCreatedSuccess = async () => {
    if (sourceInquiryId) {
      capturedInquiryIdRef.current = sourceInquiryId;
      setShowInquiryStatusChoice(true);
    }
  };

  // בחירת המנהל מה לעשות בפנייה המקורית אחרי יצירת ההורה בהצלחה
  const handleInquiryStatusChoice = async (status) => {
    if (capturedInquiryIdRef.current) {
      try {
        await updateInquiryStatus(capturedInquiryIdRef.current, status);
      } catch (error) {
        console.error("Error updating inquiry status:", error);
      }
    }
    setShowInquiryStatusChoice(false);
    setParentInitialData(null);
    setSourceInquiryId(null);
    capturedInquiryIdRef.current = null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 dir-rtl text-right" dir="rtl">
      <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 border-r-4 border-blue-600 pr-4">
            לוח בקשות ופניות
          </h1>
          <p className="text-gray-500 mt-2 mr-4 text-sm">
            ניהול פניות והוספת משתמשים חדשים
          </p>
        </div>

        <div className="flex gap-3">
          {/* כפתור הוספת הורה */}
          <button
            onClick={() => setIsParentModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95 text-sm"
          >
            <span className="text-lg">+</span>
            הוספת הורה
          </button>

          {/* 3. עדכון הכפתור לפתיחת מודאל ילד */}
          <button
            onClick={() => setIsChildModalOpen(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95 text-sm"
          >
            <span className="text-lg">+</span>
            הוספת מטופל (ילד\ה)
          </button>
        </div>
      </header>

      {/* סקציה פניות */}
      <section className="mb-12 bg-white shadow-md rounded-xl p-6 border border-gray-100">
        <InquiriesList onAddAsParent={handleAddInquiryAsParent} />
      </section>

      {/* 4. הוספת המודאלים בתחתית הדף */}
      <AddParentModal
        isOpen={isParentModalOpen}
        onClose={handleParentModalClose}
        initialData={parentInitialData}
        onSuccess={handleParentCreatedSuccess}
      />

      <AddChildModal
        isOpen={isChildModalOpen}
        onClose={() => setIsChildModalOpen(false)}
      />

      {/* בחירת סטטוס לפנייה המקורית אחרי יצירת הורה בהצלחה מתוכה */}
      {showInquiryStatusChoice && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          dir="rtl"
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-5">
              ההורה נוצר בהצלחה! מה לעשות עם הפנייה המקורית?
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => handleInquiryStatusChoice("in-progress")}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95 text-sm"
              >
                סמן כבטיפול
              </button>
              <button
                onClick={() => handleInquiryStatusChoice("completed")}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95 text-sm"
              >
                סמן כטופל
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveUsers;
