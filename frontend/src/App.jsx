// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/layout";

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ה-Layout עוטף את כל הנתיבים שבתוכו */}
        <Route path="/" element={<Layout />}>
          {/* --- נתיבים לכולם (Guest) --- */}
          <Route path="home" element={<Home />} /> {/* הכתובת הריקה / */}
          <Route path="type" element={<Type />} />
          <Route path="contact-us" element={<ContactUs />} />
          {/* --- נתיבים למטופל (Patient) --- */}
          <Route path="pay" element={<Pay />} />
          <Route path="diary" element={<Diary />} />
          <Route path="checks" element={<Checks />} />
          <Route path="isur" element={<Isur />} />
          <Route path="lids" element={<Lids />} />
          {/* --- נתיבים לפסיכולוג (Psychologist) --- */}
          <Route path="patients" element={<Patients />} />
          <Route path="diagnos" element={<Diagnos />} />
          {/* <Route path="diary" element={<Diary />} />
          <Route path="checks" element={<Checks />} /> */}
          {/* <Route path="patients" element={<PatientManager />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
