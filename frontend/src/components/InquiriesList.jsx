// // src/components/InquiriesList.jsx
// import React, { useEffect, useState } from "react";
// import { db } from "../firebase";
// import { getAuth } from "firebase/auth";
// import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

// const InquiriesList = () => {
//   const [inquiries, setInquiries] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 1. שליפת הנתונים בזמן אמת מ-Firestore
//   useEffect(() => {
//     const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));

//     // ה-onSnapshot יעדכן את הטבלה אוטומטית גם כשהשרת מוחק פנייה
//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       const docs = [];
//       querySnapshot.forEach((doc) => {
//         docs.push({ id: doc.id, ...doc.data() });
//       });
//       setInquiries(docs);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // 2. פונקציית עדכון סטטוס דרך ה-Backend
//   const handleStatusChange = async (id, newStatus) => {
//     try {
//       const auth = getAuth();
//       const user = auth.currentUser;

//       if (!user) {
//         alert("עלייך להיות מחובר כדי לבצע פעולה זו");
//         return;
//       }

//       // שליפת הטוקן המזהה של האדמין
//       const token = await user.getIdToken();

//       // שליחת הקריאה לשרת ה-Node.js
//       const response = await fetch(
//         `http://localhost:5000/api/inquiries/${id}/status`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, // אימות אדמין
//           },
//           body: JSON.stringify({ status: newStatus }),
//         },
//       );

//       if (response.ok) {
//         // במידה והסטטוס היה 'completed', השרת ימחק את המסמך והוא ייעלם מהטבלה לבד
//         if (newStatus === "completed") {
//           console.log("Inquiry completed and deleted by server");
//         } else {
//           console.log("Status updated successfully");
//         }
//       } else {
//         const errorData = await response.json();
//         alert(`שגיאה מהשרת: ${errorData.error}`);
//       }
//     } catch (error) {
//       console.error("Network Error:", error);
//       alert("חלה שגיאה בתקשורת עם השרת");
//     }
//   };

//   // פונקציית עזר לצבעי הסטטוס (Tailwind Classes)
//   const getStatusStyles = (status) => {
//     switch (status) {
//       case "pending":
//         return "bg-red-100 text-red-700 border-red-200";
//       case "in-progress":
//         return "bg-amber-100 text-amber-700 border-amber-200";
//       case "completed":
//         return "bg-emerald-100 text-emerald-700 border-emerald-200";
//       default:
//         return "bg-gray-100 text-gray-700 border-gray-200";
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center p-10">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       </div>
//     );

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="w-full text-sm text-right text-gray-600">
//           <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
//             <tr>
//               <th className="px-6 py-4 font-bold">פרטי פונה</th>
//               <th className="px-6 py-4 font-bold">טלפון</th>
//               <th className="px-6 py-4 font-bold w-1/3">תוכן ההודעה</th>
//               <th className="px-6 py-4 font-bold text-center">סטטוס</th>
//               <th className="px-6 py-4 font-bold text-center">פעולה</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {inquiries.map((item) => (
//               <tr
//                 key={item.id}
//                 className="hover:bg-gray-50/50 transition-colors"
//               >
//                 <td className="px-6 py-4">
//                   <div className="font-semibold text-gray-900">
//                     {item.fullname}
//                   </div>
//                   <div className="text-xs text-gray-400">{item.email}</div>
//                 </td>
//                 <td className="px-6 py-4 text-gray-700 tabular-nums">
//                   {item.phone}
//                 </td>
//                 <td className="px-6 py-4 text-gray-600 leading-relaxed italic">
//                   "{item.message}"
//                 </td>
//                 <td className="px-6 py-4 text-center">
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(
//                       item.status,
//                     )}`}
//                   >
//                     {item.status === "pending"
//                       ? "חדשה"
//                       : item.status === "in-progress"
//                         ? "בטיפול"
//                         : "טופל"}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 text-center">
//                   <select
//                     value={item.status}
//                     onChange={(e) =>
//                       handleStatusChange(item.id, e.target.value)
//                     }
//                     className="text-xs bg-white border border-gray-300 text-gray-700 py-1.5 px-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:border-gray-400 transition-all"
//                   >
//                     <option value="pending">סמן כחדשה</option>
//                     <option value="in-progress">עבר לטיפול</option>
//                     <option value="completed">סיים ומחק</option>
//                   </select>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {inquiries.length === 0 && (
//         <div className="text-center py-12">
//           <p className="text-gray-400 italic">אין פניות פעילות במערכת</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InquiriesList;
// src/components/InquiriesList.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { updateInquiryStatus, sendInquiryReply } from "../services/inquiry.service";

const InquiriesList = ({ onAddAsParent }) => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setInquiries(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    // שלב האישור: אם נבחר סטטוס "הסתיים ומחק"
    if (newStatus === "completed") {
      const isConfirmed = window.confirm(
        "האם את בטוחה שברצונך לסמן את הפנייה כ'טופלה'? פעולה זו תמחק את הפנייה לצמיתות מהמערכת.",
      );

      // אם האדמין בחר "ביטול" - אנחנו עוצרים כאן ולא מעדכנים כלום
      if (!isConfirmed) return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert("עלייך להיות מחובר כדי לבצע פעולה זו");
        return;
      }

      await updateInquiryStatus(id, newStatus);

      if (newStatus === "completed") {
        console.log("Inquiry completed and deleted by server");
        // אופציונלי: אלרט הצלחה קטן
        alert("הפנייה טופלה ונמחקה בהצלחה.");
      } else {
        console.log("Status updated successfully");
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert(`שגיאה מהשרת: ${error.message}`);
    }
  };

  const openReplyModal = (item) => {
    setReplyingTo(item);
    setReplyText("");
  };

  const closeReplyModal = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      alert("נא לכתוב תוכן לתשובה");
      return;
    }

    try {
      setSendingReply(true);
      await sendInquiryReply(replyingTo.id, replyText);
      alert("התשובה נשלחה בהצלחה");
      closeReplyModal();
    } catch (error) {
      console.error("Reply Error:", error);
      alert(`שגיאה: ${error.message}`);
    } finally {
      setSendingReply(false);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-700 border-red-200";
      case "in-progress":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto text-right" dir="rtl">
        <table className="w-full text-sm text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-bold">פרטי פונה</th>
              <th className="px-6 py-4 font-bold">טלפון</th>
              <th className="px-6 py-4 font-bold w-1/3">תוכן ההודעה</th>
              <th className="px-6 py-4 font-bold text-center">סטטוס</th>
              <th className="px-6 py-4 font-bold text-center">פעולה</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inquiries.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">
                    {item.fullname}
                  </div>
                  <div className="text-xs text-gray-400">{item.email}</div>
                </td>
                <td className="px-6 py-4 text-gray-700 tabular-nums">
                  {item.phone}
                </td>
                <td className="px-6 py-4 text-gray-600 leading-relaxed italic">
                  "{item.message}"
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(item.status)}`}
                  >
                    {item.status === "pending"
                      ? "חדשה"
                      : item.status === "in-progress"
                        ? "בטיפול"
                        : "טופל"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => openReplyModal(item)}
                      title="השב במייל"
                      className="p-1.5 rounded-lg border border-gray-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => onAddAsParent?.(item)}
                      title="הוסף כהורה במערכת"
                      className="p-1.5 rounded-lg border border-gray-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 transition-all"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12.5 7a4 4 0 11-8 0 4 4 0 018 0zM20 8v6M23 11h-6"
                        />
                      </svg>
                    </button>
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item.id, e.target.value)
                      }
                      className="text-xs bg-white border border-gray-300 text-gray-700 py-1.5 px-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:border-gray-400 transition-all"
                    >
                      <option value="pending">סימון כחדשה</option>
                      <option value="in-progress">העברה לטיפול</option>
                      <option value="completed">סיום ומחיקה</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {inquiries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 italic">אין פניות פעילות במערכת</p>
        </div>
      )}

      {replyingTo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            dir="rtl"
            className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              מענה לפנייה של {replyingTo.fullname}
            </h3>

            <p className="text-xs font-bold text-gray-500 mb-1">
              ההודעה המקורית:
            </p>
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 mb-4 text-sm text-gray-700 leading-relaxed max-h-32 overflow-y-auto">
              {replyingTo.message}
            </div>

            <p className="text-xs font-bold text-gray-500 mb-1">התשובה שלך:</p>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="כתבי כאן את תוכן התשובה שתישלח במייל לפונה..."
              rows={5}
              className="w-full text-sm border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                type="button"
                onClick={closeReplyModal}
                disabled={sendingReply}
                className="px-4 py-2 rounded-lg text-sm font-bold text-gray-600 border border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                ביטול
              </button>
              <button
                type="button"
                onClick={handleSendReply}
                disabled={sendingReply}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {sendingReply ? "שולח..." : "שליחה"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiriesList;
