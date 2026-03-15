// // src/App.jsx
// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Layout from "./layout/layout";

// import Home from "./pages/Home";
// import ContactUs from "./pages/ContactUs";
// import Patients from "./pages/Patients";
// import Pay from "./pages/Pay";
// import Type from "./pages/Type";

// import Diary from "./pages/Diary";
// import Checks from "./pages/Checks";
// import Diagnos from "./pages/Diagnos";
// import Isur from "./pages/Isur";
// import Lids from "./pages/Lids";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* ה-Layout עוטף את כל הנתיבים שבתוכו */}
//         <Route path="/" element={<Layout />}>
//           {/* --- נתיבים לכולם (Guest) --- */}
//           <Route path="home" element={<Home />} /> {/* הכתובת הריקה / */}
//           <Route path="type" element={<Type />} />
//           <Route path="contact-us" element={<ContactUs />} />
//           {/* --- נתיבים למטופל (Patient) --- */}
//           <Route path="pay" element={<Pay />} />
//           <Route path="diary" element={<Diary />} />
//           <Route path="checks" element={<Checks />} />
//           <Route path="isur" element={<Isur />} />
//           <Route path="lids" element={<Lids />} />
//           {/* --- נתיבים לפסיכולוג (Psychologist) --- */}
//           <Route path="patients" element={<Patients />} />
//           <Route path="diagnos" element={<Diagnos />} />
//           {/* <Route path="diary" element={<Diary />} />
//           <Route path="checks" element={<Checks />} /> */}
//           {/* <Route path="patients" element={<PatientManager />} /> */}
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/layout";

// Pages
import Home from "./pages/Home";
import ContactUs from "./pages/ContactUs";
import Patients from "./pages/Patients";
import Pay from "./pages/Pay";
import Type from "./pages/Type";
import Diary from "./pages/Diary";
import Checks from "./pages/Checks";
import Diagnos from "./pages/Diagnos";
import Isur from "./pages/Isur";
import Lids from "./pages/Lids";
import ApproveUsers from "./pages/ApproveUsers";
import StaffManagement from "./pages/StaffManagement";
import AllChildren from "./pages/AllParentChildren";
import ChildDetails from "./pages/ChildDetails";

import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";

import { Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext"; // וודאי שהקשר קיים

const HomeRedirect = () => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) return <div>טוען מערכת...</div>;
  if (!currentUser) return <Home />;

  // נרמול - הופך הכל לאותיות קטנות כדי שלא תהיה טעות
  const role = userRole?.toLowerCase();

  if (role === "admin") return <Navigate to="/approve-users" replace />;
  if (role === "therapist") return <Navigate to="/patients" replace />;
  if (role === "patient") return <Navigate to="/all-children" replace />;

  return <Home />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* הופך את דף האינדקס לרכיב הניתוב החכם */}
          <Route index element={<HomeRedirect />} />
          {/* שאר הנתיבים נשארים כפי שהם */}
          <Route path="home" element={<Home />} />
          {/* Public Routes - פתוחים לכולם */}
          <Route path="type" element={<Type />} />
          <Route path="contact-us" element={<ContactUs />} />
          {/* Auth Routes - התחברות והרשמה */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<UserProfile />} />
          {/* --- נתיבים שבהמשך נגן עליהם (Private) --- */}

          {/* Patient Area */}
          <Route path="/child-details/:childId" element={<ChildDetails />} />
          <Route path="pay" element={<Pay />} />
          <Route path="all-children" element={<AllChildren />} />
          <Route path="diary" element={<Diary />} />
          <Route path="checks" element={<Checks />} />
          <Route path="isur" element={<Isur />} />
          <Route path="lids" element={<Lids />} />
          {/* Therapist Area */}
          <Route path="patients" element={<Patients />} />
          <Route path="diagnos" element={<Diagnos />} />
          {/* Admin Area */}
          <Route path="approve-users" element={<ApproveUsers />} />
          <Route path="staff" element={<StaffManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
