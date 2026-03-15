import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/auth.service";
import logoImage from "../assets/logo.svg";
import { LogIn, LogOut, User } from "lucide-react";

export default function Header({ userName }) {
  const navigate = useNavigate();
  const isGuest = !userName || userName === "אורח";

  const handleAuthClick = async (e) => {
    // מניעת הפעלה של לחיצות על אלמנטים עוטפים (כמו הדיב של האזור האישי)
    e.stopPropagation();

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
        <div className="flex items-center gap-4">
          {!isGuest && (
            /* אזור לחיץ לאזור אישי */
            <div
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all group"
              title="לאזור האישי"
            >
              <User
                size={18}
                className="text-dolev-blue group-hover:scale-110 transition-transform"
              />
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
