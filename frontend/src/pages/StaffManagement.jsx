// import React, { useState, useEffect } from "react";
// import { db } from "../firebase";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   // deleteDoc,
//   // doc,
// } from "firebase/firestore";

// // Components
// import AddStaffForm from "../components/AddStaffForm";
// import EditStaffForm from "../components/EditStaffForm";

// // Services
// import {
//   createStaffMember,
//   deleteStaffMember,
//   updateStaffMember,
// } from "../services/admin.service";

// const StaffManagement = () => {
//   const [staff, setStaff] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingMember, setEditingMember] = useState(null);

//   // פונקציה למשיכת הנתונים
//   const fetchStaff = async () => {
//     try {
//       setLoading(true);
//       const q = query(
//         collection(db, "users"),
//         where("role", "in", ["therapist", "admin"]),
//       );
//       const querySnapshot = await getDocs(q);
//       const staffList = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setStaff(staffList);
//     } catch (error) {
//       console.error("Error fetching staff:", error);
//       alert("שגיאה בטעינת נתוני הצוות");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStaff();
//   }, []);

//   // 1. פונקציית מחיקה דרך ה-Backend
//   const handleDelete = async (userId) => {
//     if (window.confirm("האם את בטוחה? המשתמש יימחק לצמיתות גם מה-Auth!")) {
//       try {
//         setLoading(true);
//         await deleteStaffMember(userId);
//         alert("המשתמש הוסר בהצלחה");
//         fetchStaff();
//       } catch (error) {
//         alert(error.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   // 2. פונקציית הוספה דרך ה-Backend
//   const handleAddStaff = async (newMemberData) => {
//     try {
//       setLoading(true);
//       await createStaffMember(newMemberData);
//       alert(`איש הצוות ${newMemberData.firstName} נוצר בהצלחה!`);
//       setIsModalOpen(false);
//       await fetchStaff();
//     } catch (error) {
//       alert(`שגיאה ביצירת משתמש: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 3. פונקציית עדכון דרך ה-Backend
//   const handleUpdateStaff = async (updatedData) => {
//     try {
//       setLoading(true);
//       await updateStaffMember(updatedData.id, updatedData);
//       alert("הפרטים עודכנו בהצלחה!");
//       setEditingMember(null);
//       await fetchStaff();
//     } catch (error) {
//       alert(`שגיאה בעדכון: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && staff.length === 0)
//     return (
//       <p style={{ textAlign: "center", marginTop: "50px" }}>טוען נתונים...</p>
//     );

//   return (
//     <div style={{ padding: "20px", direction: "rtl" }}>
//       <header
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "20px",
//         }}
//       >
//         <h2>ניהול צוות</h2>
//         <button
//           onClick={() => setIsModalOpen(true)}
//           style={{
//             padding: "10px 20px",
//             cursor: "pointer",
//             backgroundColor: "#4CAF50",
//             color: "white",
//             border: "none",
//             borderRadius: "4px",
//             fontWeight: "bold",
//           }}
//         >
//           + הוספת איש צוות חדש
//         </button>
//       </header>

//       {loading && (
//         <p style={{ color: "blue", fontWeight: "bold" }}>מעבד בקשה...</p>
//       )}

//       {/* מודאל הוספה */}
//       {isModalOpen && (
//         <AddStaffForm
//           onAdd={handleAddStaff}
//           onCancel={() => setIsModalOpen(false)}
//         />
//       )}

//       {/* מודאל עריכה */}
//       {editingMember && (
//         <EditStaffForm
//           member={editingMember}
//           onUpdate={handleUpdateStaff}
//           onCancel={() => setEditingMember(null)}
//         />
//       )}

//       <table
//         border="1"
//         style={{
//           width: "100%",
//           textAlign: "right",
//           borderCollapse: "collapse",
//           marginTop: "10px",
//         }}
//       >
//         <thead>
//           <tr style={{ backgroundColor: "#f2f2f2" }}>
//             <th style={{ padding: "12px" }}>שם מלא</th>
//             <th>אימייל</th>
//             <th>טלפון</th>
//             <th>תפקיד</th>
//             <th>פעולות</th>
//           </tr>
//         </thead>
//         <tbody>
//           {staff.length > 0 ? (
//             staff.map((member) => (
//               <tr key={member.id} style={{ borderBottom: "1px solid #eee" }}>
//                 <td style={{ padding: "10px" }}>
//                   {member.firstName} {member.lastName}
//                 </td>
//                 <td>{member.email}</td>
//                 <td>{member.phone}</td>
//                 <td>
//                   <span
//                     style={{
//                       padding: "4px 10px",
//                       borderRadius: "20px",
//                       fontSize: "12px",
//                       fontWeight: "bold",
//                       backgroundColor:
//                         member.role === "admin" ? "#e1f5fe" : "#e8f5e9",
//                       color: member.role === "admin" ? "#0288d1" : "#2e7d32",
//                     }}
//                   >
//                     {member.role === "admin" ? "מנהל" : "מאבחן"}
//                   </span>
//                 </td>
//                 <td>
//                   <button
//                     onClick={() => setEditingMember(member)} // פותח את המודאל עם נתוני המשתמש
//                     style={{
//                       padding: "5px 10px",
//                       cursor: "pointer",
//                       marginLeft: "5px",
//                     }}
//                   >
//                     ערוך ✏️
//                   </button>
//                   <button
//                     onClick={() => handleDelete(member.id)}
//                     style={{
//                       padding: "5px 10px",
//                       color: "red",
//                       cursor: "pointer",
//                     }}
//                   >
//                     מחק 🗑️
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
//                 לא נמצאו אנשי צוות
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default StaffManagement;

import React, { useState, useEffect, useMemo } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

import AddStaffForm from "../components/AddStaffForm";
import EditStaffForm from "../components/EditStaffForm";

import {
  createStaffMember,
  deleteStaffMember,
  updateStaffMember,
} from "../services/admin.service";

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null); // 🆕 מודאל מחיקה מותאם

  // 🆕 חיפוש וסינון
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // all | therapist | admin

  // משיכת נתונים
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "users"),
        where("role", "in", ["therapist", "admin"]),
      );
      const querySnapshot = await getDocs(q);
      const staffList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStaff(staffList);
    } catch (error) {
      console.error("Error fetching staff:", error);
      alert("שגיאה בטעינת נתוני הצוות");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // 🆕 סינון וחיפוש
  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      const matchesRole = roleFilter === "all" || member.role === roleFilter;
      const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        fullName.includes(searchQuery.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [staff, searchQuery, roleFilter]);

  // ספירות לתצוגה בכרטיסי הסטטיסטיקה
  const stats = useMemo(() => {
    const admins = staff.filter((m) => m.role === "admin").length;
    const therapists = staff.filter((m) => m.role === "therapist").length;
    return { total: staff.length, admins, therapists };
  }, [staff]);

  // מחיקה
  const confirmDelete = async () => {
    if (!deletingMember) return;
    try {
      setProcessing(true);
      await deleteStaffMember(deletingMember.id);
      setDeletingMember(null);
      await fetchStaff();
    } catch (error) {
      alert(error.message);
    } finally {
      setProcessing(false);
    }
  };

  // הוספה
  const handleAddStaff = async (newMemberData) => {
    try {
      setProcessing(true);
      await createStaffMember(newMemberData);
      alert(`איש הצוות ${newMemberData.firstName} נוצר בהצלחה!`);
      setIsModalOpen(false);
      await fetchStaff();
    } catch (error) {
      alert(`שגיאה ביצירת משתמש: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  // עדכון
  const handleUpdateStaff = async (updatedData) => {
    try {
      setProcessing(true);
      await updateStaffMember(updatedData.id, updatedData);
      alert("הפרטים עודכנו בהצלחה!");
      setEditingMember(null);
      await fetchStaff();
    } catch (error) {
      alert(`שגיאה בעדכון: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  // Skeleton loading
  if (loading && staff.length === 0) {
    return (
      <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans" dir="rtl">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded-2xl w-1/3"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-32 bg-gray-200 rounded-3xl"></div>
              <div className="h-32 bg-gray-200 rounded-3xl"></div>
              <div className="h-32 bg-gray-200 rounded-3xl"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded-3xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* כותרת */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">ניהול צוות</h1>
            <p className="text-gray-500 text-sm mt-1">
              ניהול מאבחנים ומנהלים במערכת
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-purple-100 transition-all active:scale-95"
          >
            + הוספת איש צוות חדש
          </button>
        </div>

        {/* 🆕 כרטיסי סטטיסטיקה */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">סך הכל</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {stats.total}
                </p>
              </div>
              <span className="text-3xl">👥</span>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">מאבחנים</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {stats.therapists}
                </p>
              </div>
              <span className="text-3xl">🩺</span>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">מנהלים</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {stats.admins}
                </p>
              </div>
              <span className="text-3xl">⭐</span>
            </div>
          </div>
        </div>

        {/* 🆕 חיפוש וסינון */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="🔍 חיפוש לפי שם או אימייל..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
              />
            </div>
            <div className="flex gap-2">
              {[
                { value: "all", label: "הכל" },
                { value: "therapist", label: "מאבחנים" },
                { value: "admin", label: "מנהלים" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setRoleFilter(opt.value)}
                  className={`px-5 py-2 rounded-xl font-bold transition-all ${
                    roleFilter === opt.value
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* אינדיקציית עיבוד */}
        {processing && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 text-blue-700 text-sm font-semibold flex items-center gap-2">
            <span className="animate-spin">⚙️</span> מעבד בקשה...
          </div>
        )}

        {/* טבלת הצוות */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredStaff.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                      שם מלא
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                      אימייל
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                      טלפון
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                      תפקיד
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                      פעולות
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStaff.map((member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">
                            {member.firstName?.[0]}
                            {member.lastName?.[0]}
                          </div>
                          <span className="font-bold text-gray-900">
                            {member.firstName} {member.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {member.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {member.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            member.role === "admin"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {member.role === "admin" ? "⭐ מנהל" : "🩺 מאבחן"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingMember(member)}
                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-all text-sm"
                          >
                            ✏️עריכה
                          </button>
                          <button
                            onClick={() => setDeletingMember(member)}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-all text-sm"
                          >
                            🗑️ מחיקה
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center">
              <span className="text-6xl block mb-4">🔍</span>
              <p className="text-gray-500 text-lg font-semibold">
                {searchQuery || roleFilter !== "all"
                  ? "לא נמצאו תוצאות לחיפוש"
                  : "אין אנשי צוות במערכת"}
              </p>
              {(searchQuery || roleFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setRoleFilter("all");
                  }}
                  className="mt-4 text-purple-600 font-bold hover:underline"
                >
                  נקה סינון
                </button>
              )}
            </div>
          )}
        </div>

        {/* מודאל הוספה */}
        {isModalOpen && (
          <AddStaffForm
            onAdd={handleAddStaff}
            onCancel={() => setIsModalOpen(false)}
          />
        )}

        {/* מודאל עריכה */}
        {editingMember && (
          <EditStaffForm
            member={editingMember}
            onUpdate={handleUpdateStaff}
            onCancel={() => setEditingMember(null)}
          />
        )}

        {/* 🆕 מודאל מחיקה מותאם (במקום confirm) */}
        {deletingMember && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-right"
            dir="rtl"
            onClick={() => !processing && setDeletingMember(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-red-500 p-6 text-white">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  🗑️ מחיקת איש צוות
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-gray-700">
                  האם את בטוחה שברצונך למחוק את{" "}
                  <span className="font-bold text-red-600">
                    {deletingMember.firstName} {deletingMember.lastName}
                  </span>
                  ?
                </p>
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-700">
                  <strong>⚠️ אזהרה:</strong> פעולה זו תמחק את המשתמש לצמיתות גם
                  ממערכת האימות. לא ניתן יהיה לשחזר.
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={confirmDelete}
                    disabled={processing}
                    className="flex-1 py-3 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 transition-all disabled:bg-gray-400"
                  >
                    {processing ? "מוחק..." : "כן, מחק"}
                  </button>
                  <button
                    onClick={() => setDeletingMember(null)}
                    disabled={processing}
                    className="flex-1 py-3 rounded-lg font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                  >
                    ביטול
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffManagement;
