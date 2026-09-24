import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import DatePicker, { registerLocale } from "react-datepicker";
import { he } from "date-fns/locale/he";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker-theme.css";
import childService from "../services/child.service";

registerLocale("he", he);

const API_URL = import.meta.env.VITE_API_URL;

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

const AddParentModal = ({ isOpen, onClose, initialData = null, onSuccess = undefined }) => {
  // 1. הגדרת ה-State חייבת להיות ממש כאן, בתחילת הקומפוננטה
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🆕 הוספת פרטי ילד/ה אופציונלית מיד בעת יצירת ההורה
  const [includeChild, setIncludeChild] = useState(false);
  const [childData, setChildData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    therapistId: "",
  });
  const [therapists, setTherapists] = useState([]);
  const [loadingTherapists, setLoadingTherapists] = useState(false);
  const [childCreationWarning, setChildCreationWarning] = useState("");

  // מילוי מראש של הטופס כשנפתח מתוך פנייה, או איפוס כשנפתח כטופס ריק רגיל
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
      });

      // 🆕 אם בפנייה יש גם פרטי ילד/ה - נמלא מראש את הסעיף האופציונלי.
      // therapistId תמיד נשאר ריק - המנהל/ת חייב/ת לבחור מטפל/ת ידנית.
      if (initialData.child) {
        setIncludeChild(true);
        setChildData({
          firstName: initialData.child.firstName || "",
          lastName: initialData.child.lastName || "",
          birthDate: initialData.child.birthDate || "",
          therapistId: "",
        });
      }
    } else if (isOpen && !initialData) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      });
      // איפוס הסעיף האופציונלי - למנוע "דליפה" של פרטי ילד/ה משאר פתיחה קודמת
      setIncludeChild(false);
      setChildData({
        firstName: "",
        lastName: "",
        birthDate: "",
        therapistId: "",
      });
    }
  }, [isOpen, initialData]);

  // שליפת רשימת מטפלים מה-Firestore - רק כשהסעיף האופציונלי מסומן, כדי לא לשלוף מיותר
  useEffect(() => {
    if (isOpen && includeChild) {
      const fetchTherapists = async () => {
        setLoadingTherapists(true);
        try {
          const usersRef = collection(db, "users");
          const snapshot = await getDocs(usersRef);
          const allUsers = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTherapists(
            allUsers.filter(
              (u) => u.role === "therapist" || u.role === "admin",
            ),
          );
        } catch (error) {
          console.error("Error fetching therapists list:", error);
        } finally {
          setLoadingTherapists(false);
        }
      };
      fetchTherapists();
    }
  }, [isOpen, includeChild]);

  // 2. תנאי הרינדור חייב לבוא אחרי הגדרת ה-Hooks
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ולידציה של פרטי הילד/ה - רק אם הסעיף האופציונלי מסומן
    if (
      includeChild &&
      (!childData.firstName ||
        !childData.lastName ||
        !childData.birthDate ||
        !childData.therapistId)
    ) {
      alert("יש למלא את כל פרטי הילד/ה או לבטל את הסימון");
      return;
    }

    setIsSubmitting(true); // עכשיו זה יזהה את הפונקציה
    setChildCreationWarning("");

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert("עליך להיות מחוברת כאדמין");
        setIsSubmitting(false);
        return;
      }

      const token = await user.getIdToken();

      const response = await fetch(`${API_URL}/users/create-parent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();

        // 🆕 יצירת פרופיל הילד/ה מיד אחרי ההורה, אם הסעיף האופציונלי סומן
        if (includeChild) {
          try {
            await childService.createChild(
              {
                firstName: childData.firstName,
                lastName: childData.lastName,
                birthDate: childData.birthDate,
                parentId: data.uid,
                therapistId: childData.therapistId,
              },
              token,
            );
            alert("ההורה והילד/ה נוצרו בהצלחה!");
          } catch (childError) {
            console.error("Error creating child:", childError);
            // ⚠️ ההורה כבר נוצר בהצלחה - לא סוגרים את המודל אוטומטית,
            // כדי שהמנהל/ת יראו את האזהרה לפני שממשיכים הלאה
            setChildCreationWarning(
              "ההורה נוצר/ה בהצלחה, אך הוספת הילד/ה נכשלה. ניתן להוסיף את הילד/ה ידנית דרך 'הוספת מטופל'.",
            );
            return;
          }
        } else {
          alert("הורה נוצר בהצלחה במערכת!");
        }

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        });
        setIncludeChild(false);
        setChildData({
          firstName: "",
          lastName: "",
          birthDate: "",
          therapistId: "",
        });
        onSuccess?.();
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="bg-emerald-600 p-6 text-white flex justify-between items-center text-right flex-shrink-0"
          dir="rtl"
        >
          <h2 className="text-xl font-bold">הוספת הורה חדש</h2>
          <button onClick={onClose} className="text-white text-3xl">
            &times;
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 text-right overflow-y-auto flex-1 min-h-0"
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

          {/* 🆕 צ'קבוקס להוספה אופציונלית של פרטי ילד/ה */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="includeChild"
              checked={includeChild}
              onChange={(e) => setIncludeChild(e.target.checked)}
              className="w-4 h-4 accent-emerald-600"
            />
            <label
              htmlFor="includeChild"
              className="text-sm font-semibold text-gray-700 cursor-pointer"
            >
              הוסף גם פרטי ילד/ה למערכת
            </label>
          </div>

          {/* 🆕 בלוק פרטי הילד/ה - מוצג רק כשהצ'קבוקס מסומן */}
          {includeChild && (
            <div className="border-t border-gray-200 pt-4 space-y-4">
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      שם פרטי (ילד/ה)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900 outline-none transition-all"
                      value={childData.firstName}
                      onChange={(e) =>
                        setChildData({ ...childData, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      שם משפחה (ילד/ה)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900 outline-none transition-all"
                      value={childData.lastName}
                      onChange={(e) =>
                        setChildData({ ...childData, lastName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    תאריך לידה
                  </label>
                  <DatePicker
                    selected={parseYMD(childData.birthDate)}
                    onChange={(date) =>
                      setChildData({
                        ...childData,
                        birthDate: date ? formatYMD(date) : "",
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900 outline-none transition-all"
                    wrapperClassName="w-full"
                    popperPlacement="bottom"
                    popperProps={{ strategy: "fixed" }}
                    portalId="datepicker-portal"
                    popperClassName="z-[10001]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    מטפל/ת
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900 outline-none transition-all"
                    value={childData.therapistId}
                    onChange={(e) =>
                      setChildData({ ...childData, therapistId: e.target.value })
                    }
                    required
                  >
                    <option value="">-- בחרי מטפל/ת מהרשימה --</option>
                    {therapists.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.firstName} {t.lastName}
                      </option>
                    ))}
                  </select>
                  {loadingTherapists && (
                    <p className="text-xs text-emerald-600 mt-1 italic">
                      טוען רשימת מטפלים...
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 🆕 אזהרה אם ההורה נוצר בהצלחה אך יצירת הילד/ה נכשלה */}
          {childCreationWarning && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              {childCreationWarning}
            </p>
          )}

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
