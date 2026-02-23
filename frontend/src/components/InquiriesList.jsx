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

const API_URL = import.meta.env.VITE_API_URL;
const InquiriesList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

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

      const token = await user.getIdToken();

      const response = await fetch(
        `${API_URL}/inquiries/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (response.ok) {
        if (newStatus === "completed") {
          console.log("Inquiry completed and deleted by server");
          // אופציונלי: אלרט הצלחה קטן
          alert("הפנייה טופלה ונמחקה בהצלחה.");
        } else {
          console.log("Status updated successfully");
        }
      } else {
        const errorData = await response.json();
        alert(`שגיאה מהשרת: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("חלה שגיאה בתקשורת עם השרת");
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
                  <select
                    value={item.status}
                    onChange={(e) =>
                      handleStatusChange(item.id, e.target.value)
                    }
                    className="text-xs bg-white border border-gray-300 text-gray-700 py-1.5 px-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:border-gray-400 transition-all"
                  >
                    <option value="pending">סמן כחדשה</option>
                    <option value="in-progress">עבר לטיפול</option>
                    <option value="completed">סיים ומחק</option>
                  </select>
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
    </div>
  );
};

export default InquiriesList;
