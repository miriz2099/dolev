// src/layout/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/auth.service"; // ייבוא פונקציית ההתנתקות
import logoImage from "../assets/logo.svg";

// 1. הוספנו את userName כ-Prop שההדר מקבל מה-Layout
export default function Header({ userName }) {
  const navigate = useNavigate();

  // בדיקה האם המשתמש הנוכחי הוא אורח
  const isGuest = !userName || userName === "אורח";

  // הפונקציה שתחליט מה לעשות בלחיצה
  const handleAuthClick = async () => {
    if (isGuest) {
      // אם הוא אורח - קח אותו לדף ההתחברות
      navigate("/login");
    } else {
      // אם הוא מחובר - בצע התנתקות
      if (window.confirm("האם את/ה בטוח/ה שברצונך להתנתק?")) {
        try {
          await logoutUser();
          navigate("/"); // חזרה לדף הבית אחרי יציאה
          // אין צורך לרענן, ה-AuthContext יקלוט את השינוי אוטומטית
        } catch (error) {
          console.error("Failed to logout", error);
        }
      }
    }
  };

  return (
    <header className="header">
      {/* לחיצה על הלוגו תמיד תחזיר לדף הבית - UX בסיסי */}
      <div
        className="logo-section"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        <img src={logoImage} alt="Company Logo" />
        <span className="company-name">איבחונים פסיכודידקטים</span>
      </div>

      <div className="user-area">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* מציג את שם המשתמש אם הוא מחובר */}
          {!isGuest && (
            <span style={{ fontSize: "14px", fontWeight: "bold" }}>
              {userName}
            </span>
          )}

          <button className="login-btn" onClick={handleAuthClick}>
            {/* שינוי האייקון והטקסט לפי המצב */}
            <span className="login-icon">{isGuest ? "👤" : "🚪"}</span>
            {isGuest ? "כניסה" : "יציאה"}
          </button>
        </div>
      </div>

      <style>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
          background-color: #f8f3eb;
          height: 50px; 
          border-bottom: 1px solid rgba(0,0,0,0.05);
          flex-shrink: 0;
        }
        .logo-section {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-section img {
          height: 35px; 
        }
        .company-name {
          font-weight: bold;
          color: #261d33ff;
        }
        .login-btn {
          background: none;
          border: 1px solid #261d33;
          padding: 5px 12px;
          border-radius: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: all 0.2s ease;
        }
        .login-btn:hover {
          background-color: #261d33;
          color: white;
        }
      `}</style>
    </header>
  );
}
