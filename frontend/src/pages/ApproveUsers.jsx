// import React, { useState, useEffect } from "react";
// import { db } from "../firebase";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   updateDoc,
//   doc,
//   deleteDoc,
// } from "firebase/firestore";
// import InquiriesList from "../components/InquiriesList";
// import AddParentModal from "../components/AddParentModal";

// const ApproveUsers = () => {
//   const [pendingUsers, setPendingUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isParentModalOpen, setIsParentModalOpen] = useState(false);

//   // פונקציה אחת לשליפת משתמשים - מופיעה רק פעם אחת
//   const fetchPending = async () => {
//     setLoading(true);
//     try {
//       const q = query(
//         collection(db, "users"),
//         where("status", "==", "pending"),
//       );
//       const querySnapshot = await getDocs(q);
//       setPendingUsers(
//         querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
//       );
//     } catch (error) {
//       console.error("Error fetching pending users:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // useEffect אחד - מופיע רק פעם אחת
//   useEffect(() => {
//     fetchPending();
//   }, []);

//   const handleApprove = async (userId) => {
//     try {
//       await updateDoc(doc(db, "users", userId), { status: "approved" });
//       alert("המשתמש אושר בהצלחה!");
//       fetchPending();
//     } catch (e) {
//       alert("שגיאה באישור");
//     }
//   };

//   const handleReject = async (userId) => {
//     if (window.confirm("למחוק את הבקשה?")) {
//       try {
//         await deleteDoc(doc(db, "users", userId));
//         fetchPending();
//       } catch (e) {
//         alert("שגיאה בדחייה");
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8 dir-rtl text-right" dir="rtl">
//       {/* כותרת ראשית ותפריט כפתורים */}
//       <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800 border-r-4 border-blue-600 pr-4">
//             לוח בקשות ופניות
//           </h1>
//           <p className="text-gray-500 mt-2 mr-4 text-sm">
//             ניהול פניות והוספת משתמשים חדשים
//           </p>
//         </div>

//         {/* כפתורי פעולה */}
//         <div className="flex gap-3">
//           <button
//             onClick={() => setIsParentModalOpen(true)}
//             className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95 text-sm"
//           >
//             <span className="text-lg">+</span>
//             הוספת הורה
//           </button>

//           <button
//             onClick={() => console.log("הוספת ילד")}
//             className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95 text-sm"
//           >
//             <span className="text-lg">+</span>
//             הוספת מטופל (ילד)
//           </button>
//         </div>
//       </header>

//       {/* סקציה 1: פניות מהפוטר */}
//       <section className="mb-12 bg-white shadow-md rounded-xl p-6 border border-gray-100">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-semibold text-gray-700">
//             פניות חדשות מהאתר
//           </h2>
//           <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
//             LIVE
//           </span>
//         </div>
//         <InquiriesList />
//       </section>

//       {/* מודאל הוספת הורה */}
//       <AddParentModal
//         isOpen={isParentModalOpen}
//         onClose={() => setIsParentModalOpen(false)}
//       />
//     </div>
//   );
// };

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
