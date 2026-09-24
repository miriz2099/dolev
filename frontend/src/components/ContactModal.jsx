import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import DatePicker, { registerLocale } from "react-datepicker";
import { he } from "date-fns/locale/he";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker-theme.css";

registerLocale("he", he);

// המרת מחרוזת YYYY-MM-DD לאובייקט Date מקומי (בלי תלות בטיימזון)
const parseYMD = (dateString) => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

// המרת אובייקט Date למחרוזת YYYY-MM-DD לפי רכיבים מקומיים (לא toISOString, כדי למנוע היסט יום עקב UTC)
const formatYMD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    message: "",
    childFirstName: "",
    childLastName: "",
    childBirthDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🆕 הוספה אופציונלית של פרטי ילד/ה לפנייה
  const [includeChild, setIncludeChild] = useState(false);

  if (!isOpen) return null; // אם המודאל סגור, אל תרנדר כלום

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ולידציה של פרטי הילד/ה - רק אם הסעיף האופציונלי מסומן
    if (
      includeChild &&
      (!formData.childFirstName ||
        !formData.childLastName ||
        !formData.childBirthDate)
    ) {
      alert("יש למלא את כל פרטי הילד/ה או לבטל את הסימון");
      return;
    }

    setIsSubmitting(true);
    try {
      // 🆕 שדות הילד/ה נכללים במסמך רק אם הסעיף האופציונלי סומן -
      // כדי לא לשמור שדות ריקים מיותר בפניות רגילות
      const { childFirstName, childLastName, childBirthDate, ...baseData } =
        formData;

      await addDoc(collection(db, "inquiries"), {
        ...baseData,
        ...(includeChild && { childFirstName, childLastName, childBirthDate }),
        status: "pending",
        createdAt: serverTimestamp(),
      });
      alert("ההודעה נשלחה בהצלחה!");
      setFormData({
        fullname: "",
        email: "",
        phone: "",
        message: "",
        childFirstName: "",
        childLastName: "",
        childBirthDate: "",
      });
      setIncludeChild(false);
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all relative z-[10000] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // מונע מהקליקים בתוך המודאל לסגור אותו
      >
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center flex-shrink-0">
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
          className="p-6 space-y-4 text-right overflow-y-auto flex-1 min-h-0"
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

          {/* 🆕 צ'קבוקס להוספה אופציונלית של פרטי ילד/ה */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="includeChild"
              checked={includeChild}
              onChange={(e) => setIncludeChild(e.target.checked)}
              className="w-4 h-4 accent-blue-600"
            />
            <label
              htmlFor="includeChild"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              יש לי גם פרטי ילד/ה להוסיף
            </label>
          </div>

          {/* 🆕 בלוק פרטי הילד/ה - מוצג רק כשהצ'קבוקס מסומן */}
          {includeChild && (
            <div className="border-t border-gray-200 pt-4 space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    שם פרטי (ילד/ה)
                  </label>
                  <input
                    type="text"
                    className="relative z-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                    value={formData.childFirstName}
                    onChange={(e) =>
                      setFormData({ ...formData, childFirstName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    שם משפחה (ילד/ה)
                  </label>
                  <input
                    type="text"
                    className="relative z-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                    value={formData.childLastName}
                    onChange={(e) =>
                      setFormData({ ...formData, childLastName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    תאריך לידה
                  </label>
                  <DatePicker
                    selected={parseYMD(formData.childBirthDate)}
                    onChange={(date) =>
                      setFormData({
                        ...formData,
                        childBirthDate: date ? formatYMD(date) : "",
                      })
                    }
                    locale="he"
                    calendarStartDay={0}
                    showYearDropdown
                    showMonthDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={80}
                    maxDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="בחר/י תאריך לידה"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                    wrapperClassName="w-full"
                    popperPlacement="bottom"
                    popperProps={{ strategy: "fixed" }}
                    portalId="datepicker-portal"
                    popperClassName="z-[10001]"
                    required
                  />
                </div>
              </div>
            </div>
          )}

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
