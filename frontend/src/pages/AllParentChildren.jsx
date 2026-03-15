// import React, { useEffect, useState } from "react";
// import { useAuth } from "../contexts/AuthContext";

// const AllParentChildren = () => {
//   const [children, setChildren] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { currentUser } = useAuth();

//   useEffect(() => {
//     const fetchChildren = async () => {
//       if (!currentUser) return;

//       try {
//         setLoading(true);

//         const idToken = await currentUser.getIdToken();

//         const baseUrl = import.meta.env.VITE_API_URL;

//         const response = await fetch(`${baseUrl}/children/my-children`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${idToken}`,
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`שגיאה בשרת: ${response.status}`);
//         }

//         const data = await response.json();
//         setChildren(data);
//       } catch (err) {
//         console.error("Failed to fetch children:", err);
//         setError("לא הצלחנו לטעון את נתוני הילדים. נסה שוב מאוחר יותר.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchChildren();
//   }, [currentUser]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//         <span className="mr-3 text-lg font-medium">טוען נתונים...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center p-10 text-red-500 font-bold">{error}</div>
//     );
//   }

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen" dir="rtl">
//       <header className="mb-10 text-center">
//         <h1 className="text-3xl font-extrabold text-gray-800">הילדים שלי</h1>
//         <p className="text-gray-500 mt-2">רשימת הילדים הרשומים תחת חשבונך</p>
//       </header>

//       <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {children.length > 0 ? (
//           children.map((child) => (
//             <div
//               key={child.id}
//               className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
//             >
//               {/* פס עיצובי עליון */}
//               <div className="h-2 bg-blue-500 group-hover:bg-blue-600 transition-colors"></div>

//               <div className="p-6">
//                 <div className="flex justify-between items-start mb-6">
//                   <div className="bg-blue-50 p-3 rounded-full text-blue-600">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-8 w-8"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                       />
//                     </svg>
//                   </div>
//                   <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
//                     ת"ז: {child.idNumber}
//                   </span>
//                 </div>

//                 <h3 className="text-2xl font-bold text-gray-900 mb-1">
//                   {child.firstName} {child.lastName}
//                 </h3>

//                 <div className="space-y-2 mt-4 text-gray-600">
//                   <p className="flex items-center gap-2">
//                     <span className="font-semibold text-blue-600">●</span>
//                     תאריך לידה: {child.birthDate || "לא הוזן"}
//                   </p>
//                   <p className="flex items-center gap-2">
//                     <span className="font-semibold text-blue-600">●</span>
//                     סטטוס:{" "}
//                     <span className="text-green-600 font-medium">פעיל</span>
//                   </p>
//                 </div>

//                 <button
//                   className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
//                   onClick={() =>
//                     console.log("Navigate to child details", child.id)
//                   }
//                 >
//                   <span>צפייה בתהליך אבחון</span>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5 rotate-180"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="col-span-full bg-white p-12 rounded-3xl border-2 border-dashed border-gray-200 text-center">
//             <div className="text-5xl mb-4">🔍</div>
//             <h2 className="text-xl font-bold text-gray-700">
//               לא נמצאו ילדים רשומים
//             </h2>
//             <p className="text-gray-500 mt-2">
//               אם לדעתך זו טעות, אנא צור קשר עם המנהל.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllParentChildren;

import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import ChildrenGrid from "../components/ChildrenGrid"; // וודאי נתיב נכון

const AllParentChildren = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchChildren = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);
        const idToken = await currentUser.getIdToken();
        const baseUrl = import.meta.env.VITE_API_URL;

        const response = await fetch(`${baseUrl}/children/my-children`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error(`שגיאה בשרת: ${response.status}`);

        const data = await response.json();
        setChildren(data);
      } catch (err) {
        console.error("Failed to fetch children:", err);
        setError("לא הצלחנו לטעון את נתוני הילדים.");
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [currentUser]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen" dir="rtl">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-gray-800">הילדים שלי</h1>
        <p className="text-gray-500 mt-2">רשימת הילדים הרשומים תחת חשבונך</p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center p-10 text-red-500 font-bold">{error}</div>
      ) : (
        <ChildrenGrid children={children} />
      )}
    </div>
  );
};

export default AllParentChildren;
