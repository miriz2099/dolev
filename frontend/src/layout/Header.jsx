// // src/layout/Header.jsx
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { logoutUser } from "../services/auth.service"; // ייבוא פונקציית ההתנתקות
// import logoImage from "../assets/logo.svg";

// // 1. הוספנו את userName כ-Prop שההדר מקבל מה-Layout
// export default function Header({ userName }) {
//   const navigate = useNavigate();

//   // בדיקה האם המשתמש הנוכחי הוא אורח
//   const isGuest = !userName || userName === "אורח";

//   // הפונקציה שתחליט מה לעשות בלחיצה
//   const handleAuthClick = async () => {
//     if (isGuest) {
//       // אם הוא אורח - קח אותו לדף ההתחברות
//       navigate("/login");
//     } else {
//       // אם הוא מחובר - בצע התנתקות
//       if (window.confirm("האם את/ה בטוח/ה שברצונך להתנתק?")) {
//         try {
//           await logoutUser();
//           navigate("/"); // חזרה לדף הבית אחרי יציאה
//           // אין צורך לרענן, ה-AuthContext יקלוט את השינוי אוטומטית
//         } catch (error) {
//           console.error("Failed to logout", error);
//         }
//       }
//     }
//   };

//   return (
//     <header className="header">
//       {/* לחיצה על הלוגו תמיד תחזיר לדף הבית - UX בסיסי */}
//       <div
//         className="logo-section"
//         onClick={() => navigate("/")}
//         style={{ cursor: "pointer" }}
//       >
//         <img src={logoImage} alt="Company Logo" />
//         <span className="company-name">איבחונים פסיכודידקטים</span>
//       </div>

//       <div className="user-area">
//         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//           {/* מציג את שם המשתמש אם הוא מחובר */}
//           {!isGuest && (
//             <span style={{ fontSize: "14px", fontWeight: "bold" }}>
//               {userName}
//             </span>
//           )}

//           <button className="login-btn" onClick={handleAuthClick}>
//             {/* שינוי האייקון והטקסט לפי המצב */}
//             <span className="login-icon">{isGuest ? "👤" : "🚪"}</span>
//             {isGuest ? "כניסה" : "יציאה"}
//           </button>
//         </div>
//       </div>

//       <style>{`
//         .header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 0 20px;
//           background-color: #f8f3eb;
//           height: 50px;
//           border-bottom: 1px solid rgba(0,0,0,0.05);
//           flex-shrink: 0;
//         }
//         .logo-section {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//         }
//         .logo-section img {
//           height: 35px;
//         }
//         .company-name {
//           font-weight: bold;
//           color: #261d33ff;
//         }
//         .login-btn {
//           background: none;
//           border: 1px solid #261d33;
//           padding: 5px 12px;
//           border-radius: 20px;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           gap: 5px;
//           transition: all 0.2s ease;
//         }
//         .login-btn:hover {
//           background-color: #261d33;
//           color: white;
//         }
//       `}</style>
//     </header>
//   );
// }

import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/auth.service";
import logoImage from "../assets/logo.svg";
import { LogIn, LogOut, User } from "lucide-react"; // הוספת אייקונים מקצועיים

export default function Header({ userName }) {
  const navigate = useNavigate();
  const isGuest = !userName || userName === "אורח";

  const handleAuthClick = async () => {
    if (isGuest) {
      navigate("/login");
    } else {
      if (window.confirm("האם את/ה בטוח/ה שברצונך להתנתק?")) {
        try {
          await logoutUser();
          navigate("/");
        } catch (error) {
          console.error("Failed to logout", error);
        }
      }
    }
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 flex-shrink-0">
      <div className="max-w-[95%] mx-auto h-20 flex justify-between items-center px-4">
        {/* צד ימין - לוגו ושם חברה */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="bg-blue-50 p-2 rounded-xl group-hover:bg-blue-100 transition-colors">
            <img src={logoImage} alt="Logo" className="h-10 w-auto" />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">
            אבחונים פסיכודידקטיים
          </span>
        </div>

        {/* צד שמאל - אזור משתמש */}
        <div className="flex items-center gap-6">
          {!isGuest && (
            <div className="hidden md:flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              <User size={18} className="text-dolev-blue" />
              <span className="text-sm font-semibold">{userName}</span>
            </div>
          )}

          <button
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all duration-300 shadow-sm
              ${
                isGuest
                  ? "bg-dolev-blue text-white hover:bg-dolev-dark hover:shadow-md"
                  : "border-2 border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100"
              }
            `}
            onClick={handleAuthClick}
          >
            {isGuest ? <LogIn size={18} /> : <LogOut size={18} />}
            <span>{isGuest ? "כניסה למערכת" : "יציאה"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
