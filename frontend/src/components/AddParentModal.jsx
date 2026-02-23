import React, { useState } from "react";
import { getAuth } from "firebase/auth";
const API_URL = import.meta.env.VITE_API_URL;


const AddParentModal = ({ isOpen, onClose }) => {
  // 1. הגדרת ה-State חייבת להיות ממש כאן, בתחילת הקומפוננטה
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. תנאי הרינדור חייב לבוא אחרי הגדרת ה-Hooks
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // עכשיו זה יזהה את הפונקציה

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert("עליך להיות מחוברת כאדמין");
        setIsSubmitting(false);
        return;
      }

      const token = await user.getIdToken();

      const response = await fetch(
        `${API_URL}/users/create-parent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        alert("הורה נוצר בהצלחה במערכת!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
        });
        onClose();
      } else {
        const errorData = await response.json();
        alert(`שגיאה: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("חלה שגיאה בחיבור לשרת");
    } finally {
      setIsSubmitting(false); // עכשיו זה יזהה את הפונקציה
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="bg-emerald-600 p-6 text-white flex justify-between items-center text-right"
          dir="rtl"
        >
          <h2 className="text-xl font-bold">הוספת הורה חדש</h2>
          <button onClick={onClose} className="text-white text-3xl">
            &times;
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 text-right"
          dir="rtl"
        >
          {/* שורה ראשונה: שם פרטי ושם משפחה */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                שם פרטי
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900 outline-none transition-all"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                שם משפחה
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900 outline-none transition-all"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* שורת אימייל */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              כתובת אימייל
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900 outline-none transition-all"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          {/* שורת טלפון */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              מספר טלפון
            </label>
            <input
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900 outline-none transition-all"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>

          {/* שורת סיסמה */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              סיסמה ראשונית למערכת
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900 outline-none transition-all"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <p className="text-[10px] text-gray-400 mt-1">
              הסיסמה חייבת להכיל לפחות 6 תווים.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all mt-2 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-lg active:scale-95"
            }`}
          >
            {isSubmitting ? "מבצע רישום..." : "צור משתמש הורה"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddParentModal;
