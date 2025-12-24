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
          <div className="content-scrol">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>

      <style>{`

  html, body {
    margin: 0;
    padding: 0;
    height: 100vh;
    overflow: hidden;
  }

  /* 2. המיכל הראשי תופס את כל המסך */
  .app-container {
    display: flex;
    height: 100vh;
    width: 100%;
    direction: rtl;
    overflow: hidden; /* מבטיח ששום דבר לא בורח החוצה */
  }

  /* 3. תיקון הסליידר - מונע ממנו להשתבש או להתכווץ */
  .sidebar {
    width: 250px !important; /* רוחב קבוע */
    flex-shrink: 0;          /* מונע מהסליידר להימעך כשיש תוכן רב */
    height: 100vh;
    background-color: #261d33;
    overflow-y: auto;        /* אם יש המון פריטים בתפריט, רק הסליידר יגלוש */
  }

  /* 4. עטיפת הצד השמאלי (הדר + תוכן) */
  .left-side-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;                 /* לוקח את כל שאר הרוחב */
    height: 100vh;
    overflow: hidden;
  }

  /* 5. ההדר - נשאר קבוע למעלה */
  .header {
    flex-shrink: 0;          /* מונע מההדר לאבד גובה */
    z-index: 10;
  }

  
  .main-content {
    flex: 1;
    overflow : hidden; 
    background-color: #54925961; 
    padding: 15px;         
    display: flex;
    flex-direction: column;
    align-items: center;    
  }


  .content-scrol {
    background-color: #f8f3eb; /* שמנת */
    width: 100%;
    max-width: 1100px;       /* מגביל רוחב למראה נקי כמו בתמונה */
    border-radius: 20px;     /* פינות מעוגלות */
    padding: 30px;
    min-height: 80vh;        /* מבטיח נוכחות ויזואלית גם כשהדף ריק */
    box-shadow: 0 4px 15px rgba(0,0,0,0.1); /* צל עדין לעומק */
    box-sizing: border-box;
    overflow-y: auto;
  }
`}</style>
    </div>
  );
};

export default Layout;
