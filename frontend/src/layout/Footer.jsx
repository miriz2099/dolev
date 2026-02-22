import React, { useState } from "react";
import ContactModal from "../components/ContactModal";

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    // צמצמנו py-10 ל-py-2 (מרווח פנימי קטן) והורדנו mt-20 ל-mt-4
    <footer className="bg-gray-800 text-white py-4 mt-8 w-full">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* טקסט זכויות יוצרים - קטן ובצד */}
        <div className="text-xs text-gray-400">
          © {new Date().getFullYear()} Dolev. כל הזכויות שמורות.
        </div>

        {/* כפתור יצירת קשר - קטן יותר (py-1 במקום py-2) */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-6 rounded-full text-sm transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
        >
          יצירת קשר
        </button>

        {/* טקסט עזר קטן */}
        <div className="hidden md:block text-xs text-gray-500 italic">
          מערכת פסיכודידקטית מתקדמת
        </div>
      </div>

      {/* המודאל נשאר אותו דבר, הוא לא משפיע על גובה הפוטר */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </footer>
  );
};

export default Footer;
