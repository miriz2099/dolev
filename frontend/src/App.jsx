import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import TherapistInbox from "./pages/TherapistInbox";
import ApproveUsers from "./pages/ApproveUsers";
import StaffManagement from "./pages/StaffManagement";
import AllChildren from "./pages/AllParentChildren";
import ChildDetails from "./pages/ChildDetails";
import DiagnosisDetails from "./pages/DiagnosisDetails";
import PublicSchoolSurvey from "./pages/PublicSchoolSurvey";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";

import { useAuth } from "./contexts/AuthContext";

// רכיב לניתוב חכם בדף הבית
const HomeRedirect = () => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading)
    return <div className="p-20 text-center font-bold">טוען מערכת...</div>;
  if (!currentUser) return <Home />;

  const role = userRole?.toLowerCase();
  if (role === "admin") return <Navigate to="/approve-users" replace />;
  if (role === "therapist") return <Navigate to="/patients" replace />;
  if (role === "patient") return <Navigate to="/all-children" replace />;

  return <Home />;
};

// רכיב הגנה על נתיבים
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading)
    return <div className="p-20 text-center font-bold">בודק הרשאות...</div>;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const role = userRole?.toLowerCase();

  // אם התפקיד לא מורשה, במקום לחזור לדף הבית (שייצור לופ), נחזיר לעמוד הדיפולטיבי של התפקיד
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "admin") return <Navigate to="/approve-users" replace />;
    if (role === "therapist") return <Navigate to="/patients" replace />;
    if (role === "patient") return <Navigate to="/all-children" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* דף הבית החכם */}
          <Route index element={<HomeRedirect />} />

          {/* נתיבים ציבוריים לגמרי */}
          <Route path="home" element={<Home />} />
          <Route path="type" element={<Type />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="school-survey/:token" element={<PublicSchoolSurvey />} />

          {/* --- נתיבים להורים (Patient) + אדמין --- */}
          <Route
            path="all-children"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <AllChildren />
              </ProtectedRoute>
            }
          />
          <Route
            path="child-details/:childId"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <ChildDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="pay"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <Pay />
              </ProtectedRoute>
            }
          />
          <Route
            path="isur"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <Isur />
              </ProtectedRoute>
            }
          />

          {/* --- נתיבים למאבחנים (Therapist) + אדמין --- */}
          <Route
            path="patients"
            element={
              <ProtectedRoute allowedRoles={["therapist", "admin"]}>
                <Patients />
              </ProtectedRoute>
            }
          />
          <Route
            path="therapist/inbox"
            element={
              <ProtectedRoute allowedRoles={["therapist", "admin"]}>
                <TherapistInbox />
              </ProtectedRoute>
            }
          />
          <Route
            path="therapist/child/:childId"
            element={
              <ProtectedRoute allowedRoles={["therapist", "admin"]}>
                <DiagnosisDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="diagnos"
            element={
              <ProtectedRoute allowedRoles={["therapist", "admin"]}>
                <Diagnos />
              </ProtectedRoute>
            }
          />
          <Route
            path="diary"
            element={
              <ProtectedRoute allowedRoles={["therapist", "admin", "patient"]}>
                <Diary />
              </ProtectedRoute>
            }
          />
          <Route
            path="checks"
            element={
              <ProtectedRoute allowedRoles={["therapist", "admin", "patient"]}>
                <Checks />
              </ProtectedRoute>
            }
          />

          {/* --- נתיבים לאדמין בלבד --- */}
          <Route
            path="approve-users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ApproveUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="staff"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <StaffManagement />
              </ProtectedRoute>
            }
          />

          {/* פרופיל - לכולם */}
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          {/* דף 404 או ניתוב מחדש אם נתיב לא נמצא */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
