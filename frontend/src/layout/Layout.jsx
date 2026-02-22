// export default Layout;
import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../contexs/AuthContext.jsx";
import Header from "./Header";
import Slider from "./Slider";
import Footer from "./Footer";

const Layout = () => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-xl font-medium text-dolev-blue animate-pulse">
          טוען...
        </div>
      </div>
    );
  }

  const currentRole = userProfile ? userProfile.role : "guest";
  const currentName = userProfile ? userProfile.firstName : "אורח";

  // לוגיקה: האם להציג סליידר? (רק אם הוא לא אורח ולא הורה)
  // הערה: תשני את 'admin' ו-'therapist' לפי השמות המדויקים אצלך ב-DB
  const showSlider = currentRole === "admin" || currentRole === "therapist";

  return (
    <div
      className="flex h-screen w-full bg-gray-100 overflow-hidden font-sans"
      dir="rtl"
    >
      {/* 1. סליידר - מוצג רק למאבחנים/מנהלים */}
      {showSlider && (
        <div className="w-64 flex-shrink-0 h-full shadow-2xl z-20">
          <Slider userRole={currentRole} />
        </div>
      )}

      {/* 2. עטיפה ראשית לתוכן */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* הדר קבוע למעלה */}
        <Header userName={currentName} />

        {/* 3. אזור התוכן המרכזי */}
        <main className="flex-1 overflow-hidden p-4 md:p-8 flex flex-col items-center">
          <div
            className={`
    w-full 
    ${showSlider ? "max-w-6xl" : "max-w-[95%]"} 
    bg-white 
    rounded-[2.5rem] 
    shadow-sm 
    border border-gray-100 
    flex-1 
    overflow-y-auto 
    p-6 md:p-12 
    no-scrollbar 
    transition-all 
    duration-500
  `}
          >
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;
