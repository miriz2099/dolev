// import React, { useState, useEffect } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import { fetchUserProfile, updateUserProfile } from "../services/user.service";
// import {
//   User,
//   Phone,
//   Mail,
//   Lock,
//   Edit2,
//   Save,
//   X,
//   KeyRound,
//   Loader2,
// } from "lucide-react";

// export default function UserProfile() {
//   const { currentUser, userRole, updatePassword } = useAuth();

//   // מצבי מערכת
//   const [isEditing, setIsEditing] = useState(false);
//   const [showPassModal, setShowPassModal] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [passLoading, setPassLoading] = useState(false); // טעינה ספציפית לסיסמה
//   const [error, setError] = useState(null);

//   // מידע על המשתמש
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     phone: "",
//     email: "",
//   });

//   // מידע לשינוי סיסמה
//   const [passwordData, setPasswordData] = useState({
//     oldPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [showPasswords, setShowPasswords] = useState({
//     old: false,
//     new: false,
//     confirm: false,
//   });
//   // שליפת הנתונים בטעינה
//   useEffect(() => {
//     const getProfile = async () => {
//       try {
//         setLoading(true);
//         const data = await fetchUserProfile();
//         setFormData({
//           firstName: data.firstName || "",
//           lastName: data.lastName || "",
//           phone: data.phone || "",
//           email: data.email || currentUser?.email || "",
//         });
//       } catch (err) {
//         console.error("Error fetching profile:", err);
//         setError("לא הצלחנו לטעון את פרטי הפרופיל.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     getProfile();
//   }, [currentUser]);

//   // פונקציית שמירת פרטים כלליים
//   const handleSaveInfo = async () => {
//     try {
//       setLoading(true);
//       await updateUserProfile({
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         phone: formData.phone,
//       });
//       setIsEditing(false);
//       alert("הפרטים עודכנו בהצלחה!");
//     } catch (err) {
//       alert("שגיאה בעדכון הפרטים: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- הפונקציה החדשה לשינוי סיסמה ---
//   const handlePasswordChange = async (e) => {
//     e.preventDefault();

//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       alert("הסיסמה החדשה והאימות אינם זהים");
//       return;
//     }

//     if (passwordData.newPassword.length < 6) {
//       alert("הסיסמה החדשה חייבת להכיל לפחות 6 תווים");
//       return;
//     }

//     try {
//       setPassLoading(true);
//       await updatePassword(passwordData.oldPassword, passwordData.newPassword);

//       alert("הסיסמה עודכנה בהצלחה!");
//       setShowPassModal(false);
//       setPasswordData({
//         oldPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       });
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setPassLoading(false);
//     }
//   };

//   const togglePasswordVisibility = (field) => {
//     setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50">
//         <Loader2 className="h-12 w-12 text-dolev-blue animate-spin mb-4" />
//         <p className="text-slate-600 font-bold text-lg">
//           טוען את הפרופיל שלך...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="max-w-3xl mx-auto p-8 bg-slate-50 min-h-screen rtl text-right"
//       dir="rtl"
//     >
//       {/* כותרת הדף */}
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-extrabold text-slate-800">פרופיל אישי</h1>
//         <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold shadow-sm">
//           תפקיד:{" "}
//           {userRole === "admin"
//             ? "מנהל"
//             : userRole === "therapist"
//               ? "מטפל"
//               : "מטופל"}
//         </span>
//       </div>

//       {error && (
//         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 shadow-sm">
//           {error}
//         </div>
//       )}

//       {/* כרטיסיית המידע המרכזית */}
//       <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
//         <div className="bg-dolev-blue p-6 flex justify-between items-center text-white">
//           <div className="flex items-center gap-4">
//             <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
//               <User size={32} />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold">
//                 {formData.firstName} {formData.lastName}
//               </h2>
//               <p className="text-blue-100 text-sm">
//                 ניהול פרטי חשבון והגדרות אבטחה
//               </p>
//             </div>
//           </div>
//           {!isEditing && (
//             <button
//               onClick={() => setIsEditing(true)}
//               className="bg-white text-dolev-blue px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-50 transition-all shadow-md"
//             >
//               <Edit2 size={18} /> עריכת פרטים
//             </button>
//           )}
//         </div>

//         <div className="p-8 space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* שם פרטי */}
//             <div className="space-y-2">
//               <label className="text-sm font-semibold text-slate-500 mr-1">
//                 שם פרטי
//               </label>
//               {isEditing ? (
//                 <input
//                   className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-dolev-blue outline-none"
//                   value={formData.firstName}
//                   onChange={(e) =>
//                     setFormData({ ...formData, firstName: e.target.value })
//                   }
//                 />
//               ) : (
//                 <div className="text-lg font-medium text-slate-800 p-3 bg-slate-50/50 rounded-xl border border-transparent">
//                   {formData.firstName}
//                 </div>
//               )}
//             </div>

//             {/* שם משפחה */}
//             <div className="space-y-2">
//               <label className="text-sm font-semibold text-slate-500 mr-1">
//                 שם משפחה
//               </label>
//               {isEditing ? (
//                 <input
//                   className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-dolev-blue outline-none"
//                   value={formData.lastName}
//                   onChange={(e) =>
//                     setFormData({ ...formData, lastName: e.target.value })
//                   }
//                 />
//               ) : (
//                 <div className="text-lg font-medium text-slate-800 p-3 bg-slate-50/50 rounded-xl border border-transparent">
//                   {formData.lastName}
//                 </div>
//               )}
//             </div>

//             {/* טלפון */}
//             <div className="space-y-2">
//               <label className="text-sm font-semibold text-slate-500 mr-1 flex items-center gap-2">
//                 <Phone size={14} /> טלפון
//               </label>
//               {isEditing ? (
//                 <input
//                   className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-dolev-blue outline-none text-left font-mono"
//                   value={formData.phone}
//                   onChange={(e) =>
//                     setFormData({ ...formData, phone: e.target.value })
//                   }
//                 />
//               ) : (
//                 <div className="text-lg font-medium text-slate-800 p-3 bg-slate-50/50 rounded-xl text-left font-mono border border-transparent">
//                   {formData.phone}
//                 </div>
//               )}
//             </div>

//             {/* אימייל */}
//             <div className="space-y-2">
//               <label className="text-sm font-semibold text-slate-500 mr-1 flex items-center gap-2">
//                 <Mail size={14} /> אימייל (מזהה קבוע)
//               </label>
//               <div className="text-lg font-medium text-slate-400 p-3 bg-slate-100 rounded-xl text-left font-mono border border-slate-200 cursor-not-allowed">
//                 {formData.email}
//               </div>
//             </div>
//           </div>

//           {/* שורת סיסמה */}
//           <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
//             <div className="flex items-center gap-3">
//               <div className="bg-slate-100 p-2 rounded-lg">
//                 <Lock size={20} className="text-slate-500" />
//               </div>
//               <div>
//                 <p className="font-bold text-slate-700 underline decoration-slate-300 underline-offset-4">
//                   סיסמה
//                 </p>
//                 <p className="text-slate-400 font-mono tracking-widest mt-1">
//                   ••••••••
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={() => setShowPassModal(true)}
//               className="text-dolev-blue font-bold hover:text-dolev-dark transition-colors flex items-center gap-1 group"
//             >
//               <KeyRound
//                 size={16}
//                 className="group-hover:rotate-12 transition-transform"
//               />{" "}
//               שינוי סיסמה
//             </button>
//           </div>

//           {isEditing && (
//             <div className="flex gap-4 pt-6 animate-in slide-in-from-bottom-4 duration-300">
//               <button
//                 onClick={handleSaveInfo}
//                 className="flex-1 bg-green-600 text-white py-3 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-green-700 transition-all shadow-lg active:scale-95"
//               >
//                 <Save size={18} /> שמירת פרטים
//               </button>
//               <button
//                 onClick={() => setIsEditing(false)}
//                 className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-slate-300 transition-all active:scale-95"
//               >
//                 <X size={18} /> ביטול
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* מודאל לשינוי סיסמה */}
//       {showPassModal && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
//           <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
//             <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
//               <h3 className="text-xl font-bold text-slate-800">
//                 עדכון סיסמה מאובטח
//               </h3>
//               <button
//                 onClick={() => setShowPassModal(false)}
//                 className="p-1 hover:bg-slate-200 rounded-full transition-colors"
//               >
//                 <X className="text-slate-400 hover:text-slate-600" />
//               </button>
//             </div>

//             {/* הטופס החדש */}
//             <form onSubmit={handlePasswordChange} className="p-8 space-y-4">
//               <div>
//                 <label className="block text-sm font-semibold text-slate-600 mb-1">
//                   סיסמה נוכחית
//                 </label>
//                 <input
//                   type={showPasswords.new ? "text" : "password"}
//                   // type="password"
//                   required
//                   className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-100 transition-all"
//                   placeholder="הזן סיסמה נוכחית"
//                   value={passwordData.oldPassword}
//                   onChange={(e) =>
//                     setPasswordData({
//                       ...passwordData,
//                       oldPassword: e.target.value,
//                     })
//                   }
//                 />
//                 <p className="text-[10px] text-slate-400 mt-1 mr-1">
//                   * חובה להזין את הסיסמה הנוכחית לביצוע השינוי
//                 </p>
//               </div>

//               <div className="h-px bg-slate-100 my-2"></div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-600 mb-1">
//                   סיסמה חדשה
//                 </label>
//                 <input
//                   type={showPasswords.new ? "text" : "password"}
//                   // type="password"
//                   required
//                   className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all"
//                   placeholder="לפחות 6 תווים"
//                   value={passwordData.newPassword}
//                   onChange={(e) =>
//                     setPasswordData({
//                       ...passwordData,
//                       newPassword: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-600 mb-1">
//                   אימות סיסמה חדשה
//                 </label>
//                 <input
//                   type={showPasswords.new ? "text" : "password"}
//                   // type="password"
//                   required
//                   className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all"
//                   placeholder="הקלד שוב את הסיסמה החדשה"
//                   value={passwordData.confirmPassword}
//                   onChange={(e) =>
//                     setPasswordData({
//                       ...passwordData,
//                       confirmPassword: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={passLoading}
//                 className="w-full bg-dolev-blue text-white py-4 rounded-2xl font-bold text-lg mt-4 shadow-lg hover:bg-dolev-dark transition-all active:scale-[0.98] flex justify-center items-center gap-2"
//               >
//                 {passLoading ? (
//                   <Loader2 className="animate-spin" />
//                 ) : (
//                   "עדכן סיסמה עכשיו"
//                 )}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { fetchUserProfile, updateUserProfile } from "../services/user.service";
import {
  User,
  Phone,
  Mail,
  Lock,
  Edit2,
  Save,
  X,
  KeyRound,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

export default function UserProfile() {
  const { currentUser, userRole, updatePassword } = useAuth();

  // מצבי מערכת
  const [isEditing, setIsEditing] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [passLoading, setPassLoading] = useState(false);
  const [error, setError] = useState(null);

  // מידע על המשתמש
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  // מידע לשינוי סיסמה
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // מצב נראות סיסמה (עין)
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const data = await fetchUserProfile();
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          email: data.email || currentUser?.email || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("לא הצלחנו לטעון את פרטי הפרופיל.");
      } finally {
        setLoading(false);
      }
    };
    getProfile();
  }, [currentUser]);

  const handleSaveInfo = async () => {
    try {
      setLoading(true);
      await updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });
      setIsEditing(false);
      alert("הפרטים עודכנו בהצלחה!");
    } catch (err) {
      alert("שגיאה בעדכון הפרטים: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("הסיסמה החדשה והאימות אינם זהים");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("הסיסמה החדשה חייבת להכיל לפחות 6 תווים");
      return;
    }

    try {
      setPassLoading(true);
      await updatePassword(passwordData.oldPassword, passwordData.newPassword);
      alert("הסיסמה עודכנה בהצלחה!");
      setShowPassModal(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setPassLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  if (loading && !isEditing) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50">
        <Loader2 className="h-12 w-12 text-dolev-blue animate-spin mb-4" />
        <p className="text-slate-600 font-bold text-lg">
          טוען את הפרופיל שלך...
        </p>
      </div>
    );
  }

  return (
    <div
      className="max-w-3xl mx-auto p-8 bg-slate-50 min-h-screen rtl text-right"
      dir="rtl"
    >
      {/* כותרת */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">פרופיל אישי</h1>
        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold shadow-sm">
          תפקיד:{" "}
          {userRole === "admin"
            ? "מנהל"
            : userRole === "therapist"
              ? "מטפל"
              : "מטופל"}
        </span>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 shadow-sm">
          {error}
        </div>
      )}

      {/* כרטיסיית המידע */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-dolev-blue p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-blue-100 text-sm">
                ניהול פרטי חשבון והגדרות אבטחה
              </p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-white text-dolev-blue px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-50 transition-all shadow-md"
            >
              <Edit2 size={18} /> עריכת פרטים
            </button>
          )}
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* שם פרטי */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 mr-1">
                שם פרטי
              </label>
              {isEditing ? (
                <input
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-dolev-blue outline-none"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              ) : (
                <div className="text-lg font-medium text-slate-800 p-3 bg-slate-50/50 rounded-xl border border-transparent">
                  {formData.firstName}
                </div>
              )}
            </div>

            {/* שם משפחה */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 mr-1">
                שם משפחה
              </label>
              {isEditing ? (
                <input
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-dolev-blue outline-none"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              ) : (
                <div className="text-lg font-medium text-slate-800 p-3 bg-slate-50/50 rounded-xl border border-transparent">
                  {formData.lastName}
                </div>
              )}
            </div>

            {/* טלפון */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 mr-1 flex items-center gap-2">
                <Phone size={14} /> טלפון
              </label>
              {isEditing ? (
                <input
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-dolev-blue outline-none text-left font-mono"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              ) : (
                <div className="text-lg font-medium text-slate-800 p-3 bg-slate-50/50 rounded-xl text-left font-mono border border-transparent">
                  {formData.phone}
                </div>
              )}
            </div>

            {/* אימייל */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 mr-1 flex items-center gap-2">
                <Mail size={14} /> אימייל (מזהה קבוע)
              </label>
              <div className="text-lg font-medium text-slate-400 p-3 bg-slate-100 rounded-xl text-left font-mono border border-slate-200 cursor-not-allowed">
                {formData.email}
              </div>
            </div>
          </div>

          {/* סיסמה */}
          <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-2 rounded-lg">
                <Lock size={20} className="text-slate-500" />
              </div>
              <div>
                <p className="font-bold text-slate-700 underline decoration-slate-300 underline-offset-4">
                  סיסמה
                </p>
                <p className="text-slate-400 font-mono tracking-widest mt-1">
                  ••••••••
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPassModal(true)}
              className="text-dolev-blue font-bold hover:text-dolev-dark transition-colors flex items-center gap-1 group"
            >
              <KeyRound
                size={16}
                className="group-hover:rotate-12 transition-transform"
              />{" "}
              שינוי סיסמה
            </button>
          </div>

          {isEditing && (
            <div className="flex gap-4 pt-6 animate-in slide-in-from-bottom-4 duration-300">
              <button
                onClick={handleSaveInfo}
                className="flex-1 bg-green-600 text-white py-3 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-green-700 transition-all shadow-lg active:scale-95"
              >
                <Save size={18} /> שמירת פרטים
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-slate-300 transition-all active:scale-95"
              >
                <X size={18} /> ביטול
              </button>
            </div>
          )}
        </div>
      </div>

      {/* מודאל שינוי סיסמה */}
      {showPassModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">
                עדכון סיסמה מאובטח
              </h3>
              <button
                onClick={() => setShowPassModal(false)}
                className="p-1 hover:bg-slate-200 rounded-full"
              >
                <X className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="p-8 space-y-4">
              {/* סיסמה נוכחית */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  סיסמה נוכחית
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.old ? "text" : "password"}
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-100 transition-all pl-12"
                    placeholder="הזן סיסמה נוכחית"
                    value={passwordData.oldPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        oldPassword: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("old")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPasswords.old ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="h-px bg-slate-100 my-2"></div>

              {/* סיסמה חדשה */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  סיסמה חדשה
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all pl-12"
                    placeholder="לפחות 6 תווים"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPasswords.new ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* אימות סיסמה */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  אימות סיסמה חדשה
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all pl-12"
                    placeholder="הקלד שוב"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={passLoading}
                className="w-full bg-dolev-blue text-white py-4 rounded-2xl font-bold text-lg mt-4 shadow-lg hover:bg-dolev-dark transition-all active:scale-[0.98] flex justify-center items-center gap-2"
              >
                {passLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "עדכן סיסמה עכשיו"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
