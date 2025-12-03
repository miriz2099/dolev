import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Slider from "./Slider";
import Footer from "./Footer";

const currentUser = {
  name: "ישראל ישראלי",
  role: "guest",
  // role: "patient",
  // role: "psychologist",
};

const Layout = () => {
  return (
    <div className="app-container">
      {/* 1. הסיידבר נמצא בחוץ, הוא הילד הראשון ולכן יהיה הכי ימני */}
      <Slider userRole={currentUser.role} />

      {/* 2. עטיפה לכל הצד השמאלי (הדר, תוכן, פוטר) */}
      <div className="left-side-wrapper">
        <Header />

        <main className="main-content">
          <Outlet />
        </main>

        <Footer />
      </div>

      <style>{`
        /* המיכל הראשי - מסדר את הסיידבר ליד התוכן */
        .app-container {
          display: flex;
          flex-direction: row; /* מסדר לרוחב: ימין ושמאל */
          min-height: 100vh;
          width: 100%;
          direction: rtl; /* חשוב! מבטיח שהסיידבר יהיה בימין */
          font-family: Arial, sans-serif;
        }

        /* העטיפה של הצד השמאלי - מסדרת הכל במאונך */
        .left-side-wrapper {
          display: flex;
        
          flex-direction: column; /* הדר מעל תוכן מעל פוטר */
          flex: 1; /* לוקח את כל רוחב המסך שנשאר אחרי הסיידבר */
          width: 100%;
        }

        .main-content {
          flex: 1; /* דוחף את הפוטר למטה */
          padding: 20px;
          background-color: #f5f5f5;
          overflow-y: auto; /* אם יש הרבה תוכן, רק האזור הזה נגלל */
        }
      `}</style>
    </div>
  );
};

export default Layout;
