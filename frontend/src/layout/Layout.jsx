// import React from "react";
// import { Outlet } from "react-router-dom";
// import { useAuth } from "../contexs/AuthContext.jsx"; // <--- ייבוא ההוק שלנו
// import Header from "./Header";
// import Slider from "./Slider";
// import Footer from "./Footer";

// const Layout = () => {
//   const { userProfile, loading } = useAuth();

//   // 2. הגנה מפני קריסה בזמן טעינה ראשונית
//   // (אופציונלי: אפשר להציג ספינר, או פשוט לתת לו להמשיך כאורח)
//   if (loading) {
//     return (
//       <div style={{ textAlign: "center", marginTop: "50px" }}>טוען...</div>
//     );
//   }

//   // 3. לוגיקה חכמה: אם יש פרופיל - קח את התפקיד שלו. אם אין - הוא אורח.
//   const currentRole = userProfile ? userProfile.role : "guest";
//   const currentName = userProfile ? userProfile.firstName : "אורח";
//   return (
//     <div className="app-container">
//       {/* 1. הסיידבר נמצא בחוץ, הוא הילד הראשון ולכן יהיה הכי ימני */}
//       <Slider userRole={currentRole} />

//       {/* 2. עטיפה לכל הצד השמאלי (הדר, תוכן, פוטר) */}
//       <div className="left-side-wrapper">
//         <Header userName={currentName} />

//         <main className="main-content">
//           <div className="content-scrol">
//             <Outlet />
//           </div>
//         </main>

//         <Footer />
//       </div>

//       <style>{`

//   html, body {
//     margin: 0;
//     padding: 0;
//     height: 100vh;
//     overflow: hidden;
//   }

//   /* 2. המיכל הראשי תופס את כל המסך */
//   .app-container {
//     display: flex;
//     height: 100vh;
//     width: 100%;
//     direction: rtl;
//     overflow: hidden; /* מבטיח ששום דבר לא בורח החוצה */
//   }

//   /* 3. תיקון הסליידר - מונע ממנו להשתבש או להתכווץ */
//   .sidebar {
//     width: 250px !important; /* רוחב קבוע */
//     flex-shrink: 0;          /* מונע מהסליידר להימעך כשיש תוכן רב */
//     height: 100vh;
//     background-color: #261d33;
//     overflow-y: auto;        /* אם יש המון פריטים בתפריט, רק הסליידר יגלוש */
//   }

//   /* 4. עטיפת הצד השמאלי (הדר + תוכן) */
//   .left-side-wrapper {
//     display: flex;
//     flex-direction: column;
//     flex: 1;                 /* לוקח את כל שאר הרוחב */
//     height: 100vh;
//     overflow: hidden;
//   }

//   /* 5. ההדר - נשאר קבוע למעלה */
//   .header {
//     flex-shrink: 0;          /* מונע מההדר לאבד גובה */
//     z-index: 10;
//   }

//   .main-content {
//     flex: 1;
//     overflow : hidden;
//     background-color: #54925961;
//     padding: 15px;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//   }

//   .content-scrol {
//     background-color: #f8f3eb; /* שמנת */
//     width: 100%;
//     max-width: 1100px;       /* מגביל רוחב למראה נקי כמו בתמונה */
//     border-radius: 20px;     /* פינות מעוגלות */
//     padding: 30px;
//     min-height: 80vh;        /* מבטיח נוכחות ויזואלית גם כשהדף ריק */
//     box-shadow: 0 4px 15px rgba(0,0,0,0.1); /* צל עדין לעומק */
//     box-sizing: border-box;
//     overflow-y: auto;
//   }
// `}</style>
//     </div>
//   );
// };

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
