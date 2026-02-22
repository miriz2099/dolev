import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null; // אם המודאל סגור, אל תרנדר כלום

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "inquiries"), {
        ...formData,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      alert("ההודעה נשלחה בהצלחה!");
      setFormData({ fullname: "", email: "", phone: "", message: "" });
      onClose(); // סגירת המודאל לאחר הצלחה
    } catch (error) {
      console.error("Error:", error);
      alert("חלה שגיאה בשליחת ההודעה.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* הוספת onClick={onClose} לרקע ו-onClick={(e) => e.stopPropagation()} למודאל עצמו */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all relative z-[10000]"
        onClick={(e) => e.stopPropagation()} // מונע מהקליקים בתוך המודאל לסגור אותו
      >
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">צרו קשר איתנו</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 text-right"
          dir="rtl"
        >
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              שם מלא
            </label>
            <input
              type="text"
              name="fullname" // הוספת name לכל שדה עוזרת לדפדפן
              className="relative z-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
              value={formData.fullname}
              onChange={(e) =>
                setFormData({ ...formData, fullname: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                אימייל
              </label>
              <input
                type="email"
                name="email"
                className="relative z-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                טלפון
              </label>
              <input
                type="tel"
                name="phone"
                minLength="10" // מוודא שהמספר לפחות 10 ספרות
                maxLength="10" // מונע הקלדה של יותר מ-10 ספרות
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                value={formData.phone}
                onChange={(e) => {
                  // רג'קס (Regex) שמאפשר רק מספרים
                  const value = e.target.value.replace(/\D/g, "");
                  setFormData({ ...formData, phone: value });
                }}
                placeholder="05XXXXXXXX"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              איך נוכל לעזור?
            </label>
            <textarea
              rows="4"
              name="message"
              className="relative z-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none text-gray-900 bg-white"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`relative z-10 w-full py-3 rounded-lg font-bold text-white transition-all ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-lg active:scale-[0.98]"
            }`}
          >
            {isSubmitting ? "שולח..." : "שלח הודעה"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
