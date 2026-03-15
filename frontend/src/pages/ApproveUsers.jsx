// export default ApproveUsers;
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import InquiriesList from "../components/InquiriesList";
import AddParentModal from "../components/AddParentModal";
import AddChildModal from "../components/AddChildModal"; // 1. ייבוא המודאל החדש

const ApproveUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. States לשליטה בשני המודאלים
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [isChildModalOpen, setIsChildModalOpen] = useState(false);

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
            הוספת מטופל (ילד)
          </button>
        </div>
      </header>

      {/* סקציה פניות */}
      <section className="mb-12 bg-white shadow-md rounded-xl p-6 border border-gray-100">
        <InquiriesList />
      </section>

      {/* 4. הוספת המודאלים בתחתית הדף */}
      <AddParentModal
        isOpen={isParentModalOpen}
        onClose={() => setIsParentModalOpen(false)}
      />

      <AddChildModal
        isOpen={isChildModalOpen}
        onClose={() => setIsChildModalOpen(false)}
      />
    </div>
  );
};

export default ApproveUsers;
