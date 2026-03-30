// import React from "react";
// import { NavLink } from "react-router-dom";
// // import home from "../pages/Home.jsx";
// // import type from "../pages/Events.jsx";

// // 1. הגדרת התפריטים עבור כל מצב
// // כל פריט מכיל: טקסט להצגה (label) ונתיב (path)
// // const MENU_ITEMS = {
// // guest: [
// //   // משתמש לא מחובר
// //   { label: "דף הבית", path: "/" },
// //   { label: "סוגי אבחונים", path: "/type" },
// //   { label: "צור קשר", path: "/contact-us" },
// //   // { label: "הרשמה / התחברות" },
// // ],
// // patient: [
// //   // מטופל מחובר
// //   { label: "דף הבית", path: "/" },
// //   { label: "אבחונים", path: "/diagnos" },
// //   { label: "אישורים", path: "/isur" },
// //   { label: "דוחות", path: "/checks" },
// //   { label: "פניות ", path: "/lids" },
// //   { label: "היומן שלי", path: "/diary" },
// //   { label: "תשלומים", path: "/pay" },
// // ],
// //   therapist: [
// //     // פסיכולוג מחובר

// //     { label: "ניהול מטופלים", path: "/patients" },
// //     { label: "פניות", path: "/lids" },
// //     { label: "לוח שנה", path: "/diary" },
// //     { label: "אבחונים", path: "/diagnos" },
// //     { label: "דוחות", path: "/checks" },
// //   ],
// //   admin: [
// //     { label: "ניהול מטופלים", path: "/patients" },
// //     { label: "פניות", path: "/therapist/inbox" },
// //     { label: "לוח שנה", path: "/diary" },
// //     { label: "אבחונים", path: "/diagnos" },
// //     { label: "דוחות", path: "/checks" },
// //     // --- פיצ'רים בלעדיים למנהל ---
// //     { label: "אישור משתמשים חדשים", path: "/approve-users" },
// //     { label: "ניהול צוות מאבחנים", path: "/staff" },
// //     // { label: "הגדרות מערכת", path: "/admin/settings" },
// //   ],
// // };

// const MENU_ITEMS = {
//   guest: [
//     { label: "דף הבית", path: "/" },
//     { label: "סוגי אבחונים", path: "/type" },
//     { label: "צור קשר", path: "/contact-us" },
//   ],
//   patient: [
//     { label: "דף הבית", path: "/" },
//     { label: "הילדים שלי", path: "/all-children" }, // עדכון נתיב
//     { label: "היומן שלי", path: "/diary" },
//     { label: "תשלומים", path: "/pay" },
//   ],
//   therapist: [
//     { label: "ניהול מטופלים", path: "/patients" },
//     { label: "תיבת הודעות", path: "/therapist/inbox" }, // עדכון נתיב לפי App.jsx
//     { label: "לוח שנה", path: "/diary" },
//   ],
//   admin: [
//     { label: "ניהול מטופלים", path: "/patients" },
//     { label: "תיבת הודעות", path: "/therapist/inbox" }, // עדכון נתיב לפי App.jsx
//     { label: "לוח שנה", path: "/diary" },
//     { label: "אישור משתמשים", path: "/approve-users" },
//     { label: "ניהול צוות", path: "/staff" },
//     { label: "תיבת הודעות", path: "/therapist/inbox" },
//   ],
// };

// const Slider = ({ userRole = "guest" }) => {
//   // 2. בחירת הרשימה המתאימה לפי ה-Role שהתקבל
//   // אם אין role, נציג ברירת מחדל של אורח
//   const linksToDisplay = MENU_ITEMS[userRole] || MENU_ITEMS.guest;

//   return (
//     <aside className="sidebar">
//       <nav>
//         <ul>
//           {/* 3. ריצה על הרשימה שנבחרה והצגת הקישורים */}
//           {linksToDisplay.map((link, index) => (
//             <li key={index}>
//               <NavLink
//                 to={link.path}
//                 className={({ isActive }) => (isActive ? "active-link" : "")}
//               >
//                 {link.label}
//               </NavLink>
//             </li>
//           ))}
//         </ul>
//       </nav>

//       <style>{`
//         .sidebar {
//           width: 250px;
//           background-color: #261d33ff;
//           border-left: 1px solid #e0e0e0; /* פס הפרדה */
//           padding: 20px 0;
//           height: 100vh;
//         }

//         ul {
//           list-style: none;
//           padding: 0;
//           margin: 0;
//         }

//         li {
//           margin-bottom: 10px;
//         }

//         a {
//           display: block;
//           padding: 10px 20px;
//           text-decoration: none;
//           color: #fefefeff;
//           font-size: 16px;
//           transition: 0.3s;
//           border-radius: 4px;

//         }

//         a:hover {
//           background-color: #5387efff;
//           color: #fefefeff;
//         }

//         /* עיצוב לקישור הפעיל (הדף שבו אני נמצא כרגע) */
//         .active-link {
//           background-color: #5387efff;
//           color: #fefefeff;
//           font-weight: bold;
//           border-right: 4px solid #2b6df6; /* פס כחול קטן בצד שמראה איפה אני */
//         }
//       `}</style>
//     </aside>
//   );
// };

// export default Slider;

import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // ייבוא ה-Context

const MENU_ITEMS = {
  guest: [
    { label: "דף הבית", path: "/" },
    { label: "סוגי אבחונים", path: "/type" },
    { label: "צור קשר", path: "/contact-us" },
  ],
  patient: [
    { label: "דף הבית", path: "/" },
    { label: "הילדים שלי", path: "/all-children" }, // עדכון נתיב
    { label: "היומן שלי", path: "/diary" },
    { label: "תשלומים", path: "/pay" },
  ],
  therapist: [
    { label: "ניהול מטופלים", path: "/patients" },
    { label: "תיבת הודעות", path: "/therapist/inbox" }, // עדכון נתיב לפי App.jsx
    { label: "לוח שנה", path: "/diary" },
    { label: "אבחונים", path: "/diagnos" },
    { label: "דוחות", path: "/checks" },
  ],
  admin: [
    { label: "ניהול מטופלים", path: "/patients" },
    { label: "תיבת הודעות", path: "/therapist/inbox" }, // עדכון נתיב לפי App.jsx
    { label: "לוח שנה", path: "/diary" },
    { label: "אבחונים", path: "/diagnos" },
    { label: "דוחות", path: "/checks" },
    { label: "יצירת משתמשים חדשים", path: "/approve-users" },
    { label: "ניהול צוות", path: "/staff" },
  ],
};

const Slider = () => {
  // משיכת ה-Role ישירות מה-Context
  const { userRole, loading } = useAuth();

  if (loading) return null; // או ספינר קטן

  // נרמול ה-Role לאותיות קטנות כדי שיתאים למפתחות ב-MENU_ITEMS
  const role = userRole?.toLowerCase() || "guest";
  const linksToDisplay = MENU_ITEMS[role] || MENU_ITEMS.guest;

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {linksToDisplay.map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.path}
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <style>{`
        /* הסטייל שלך נשאר אותו דבר */
        .sidebar {
          width: 250px;
          background-color: #261d33ff;
          padding: 20px 0;
          height: 100vh;
          position: sticky;
          top: 0;
          right: 0;
        }
        ul { list-style: none; padding: 0; margin: 0; }
        li { margin-bottom: 10px; }
        a {
          display: block;
          padding: 12px 20px;
          text-decoration: none;
          color: #fefefeff;
          transition: 0.3s;
        }
        a:hover, .active-link {
          background-color: #5387efff;
        }
        .active-link {
          font-weight: bold;
          border-left: 4px solid #fff; /* שיניתי ל-left כי האתר ב-RTL */
        }
      `}</style>
    </aside>
  );
};

export default Slider;
