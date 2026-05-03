// // client/src/components/EventFormModal.jsx
// import React, { useState } from "react";

// const EventFormModal = ({ selectedDate, onClose, onSave }) => {
//   const [type, setType] = useState("appointment"); // appointment | availability | note
//   const [formData, setFormData] = useState({
//     title: "",
//     startTime: "09:00",
//     endTime: "10:00",
//     isRecurring: false,
//     description: "",
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave({ ...formData, type, date: selectedDate });
//   };

//   return (
//     <div style={modalOverlayStyle}>
//       <div style={modalContentStyle}>
//         <h3>הגדר/י פעילות לתאריך: {selectedDate}</h3>

//         <div style={{ marginBottom: "15px" }}>
//           <label>סוג הפעילות: </label>
//           <select value={type} onChange={(e) => setType(e.target.value)}>
//             <option value="appointment">פגישה עם ילד/ה</option>
//             <option value="availability">הגדרת טווח זמינות</option>
//             <option value="note">הערה אישית</option>
//           </select>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             placeholder={type === "appointment" ? "שם הילד/ה" : "נושא/כותרת"}
//             required
//             onChange={(e) =>
//               setFormData({ ...formData, title: e.target.value })
//             }
//             style={inputStyle}
//           />

//           <div style={{ display: "flex", gap: "10px", margin: "10px 0" }}>
//             <label>
//               משעה:{" "}
//               <input
//                 type="time"
//                 value={formData.startTime}
//                 onChange={(e) =>
//                   setFormData({ ...formData, startTime: e.target.value })
//                 }
//               />
//             </label>
//             <label>
//               עד שעה:{" "}
//               <input
//                 type="time"
//                 value={formData.endTime}
//                 onChange={(e) =>
//                   setFormData({ ...formData, endTime: e.target.value })
//                 }
//               />
//             </label>
//           </div>

//           {type === "availability" && (
//             <label style={{ display: "block", marginBottom: "10px" }}>
//               <input
//                 type="checkbox"
//                 checked={formData.isRecurring}
//                 onChange={(e) =>
//                   setFormData({ ...formData, isRecurring: e.target.checked })
//                 }
//               />
//               חזור על זמינות זו בכל שבוע (ביום זה)
//             </label>
//           )}

//           <textarea
//             placeholder="הערות נוספות..."
//             onChange={(e) =>
//               setFormData({ ...formData, description: e.target.value })
//             }
//             style={{ ...inputStyle, height: "60px" }}
//           />

//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               marginTop: "20px",
//             }}
//           >
//             <button type="button" onClick={onClose} style={cancelBtnStyle}>
//               ביטול
//             </button>
//             <button type="submit" style={saveBtnStyle}>
//               שמור/י
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // עיצובים בסיסיים (אפשר להעביר ל-CSS)
// const modalOverlayStyle = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   backgroundColor: "rgba(0,0,0,0.5)",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   zIndex: 1000,
// };
// const modalContentStyle = {
//   background: "white",
//   padding: "25px",
//   borderRadius: "10px",
//   width: "400px",
//   direction: "rtl",
// };
// const inputStyle = {
//   width: "100%",
//   padding: "8px",
//   marginBottom: "10px",
//   boxSizing: "border-box",
// };
// const saveBtnStyle = {
//   backgroundColor: "#27ae60",
//   color: "white",
//   border: "none",
//   padding: "10px 20px",
//   borderRadius: "5px",
//   cursor: "pointer",
// };
// const cancelBtnStyle = {
//   backgroundColor: "#e74c3c",
//   color: "white",
//   border: "none",
//   padding: "10px 20px",
//   borderRadius: "5px",
//   cursor: "pointer",
// };

// export default EventFormModal;


// frontend/src/components/EventFormModal.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import DiaryService from "../services/diary.service";
import therapistService from "../services/therapist.service";

const DEFAULT_DURATION_MINUTES = 90; // שעה וחצי - ברירת מחדל

const EventFormModal = ({
  mode,
  selectedDate,
  eventData,
  onClose,
  onSave,
}) => {
  const { currentUser } = useAuth();

  // === מצב יצירה ===
  const [type, setType] = useState("appointment");
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [childId, setChildId] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // === אתחול שעת ההתחלה לפי מה שנבחר ===
  useEffect(() => {
    if (mode === "create" && selectedDate) {
      // selectedDate יכול להיות "2026-05-15" או "2026-05-15T14:00:00"
      const dateObj = new Date(selectedDate);

      // אם זה רק תאריך (00:00) - נקבע ברירת מחדל 09:00
      const hours = dateObj.getHours();
      if (hours === 0 && dateObj.getMinutes() === 0) {
        dateObj.setHours(9, 0, 0, 0);
      }

      const startISO = formatLocalISO(dateObj);
      const endDateObj = new Date(dateObj.getTime() + DEFAULT_DURATION_MINUTES * 60000);
      const endISO = formatLocalISO(endDateObj);

      setStartTime(startISO);
      setEndTime(endISO);
    }
  }, [mode, selectedDate]);

  // === טעינת רשימת מטופלים (רק במצב יצירת אבחון) ===
  useEffect(() => {
    if (mode === "create" && type === "appointment") {
      loadPatients();
    }
  }, [mode, type]);

  const loadPatients = async () => {
    try {
      const token = await currentUser.getIdToken();
      const data = await therapistService.getMyPatients(token);
      setPatients(data || []);
    } catch (err) {
      console.error("Failed to load patients:", err);
    }
  };

  // === שמירה ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim()) {
      setErrorMsg("נא להזין כותרת");
      return;
    }
    if (new Date(endTime) <= new Date(startTime)) {
      setErrorMsg("שעת הסיום חייבת להיות אחרי שעת ההתחלה");
      return;
    }
    if (type === "appointment" && !childId) {
      setErrorMsg("יש לבחור ילד לאבחון");
      return;
    }

    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      const payload = {
        type,
        title: title.trim(),
        start: startTime,
        end: endTime,
        description: description.trim(),
      };

      if (type === "availability") {
        payload.isRecurring = isRecurring;
      }
      if (type === "appointment") {
        payload.childId = childId;
      }

      await DiaryService.createEvent(payload, token);
      onSave();
      onClose();
    } catch (err) {
      // טיפול בשגיאות - במיוחד קונפליקטים (status 409)
      if (err.status === 409) {
        if (err.details?.conflict) {
          setErrorMsg(
            `⚠️ קיים אירוע מתנגש: "${err.details.conflict.title}" בזמן הזה. השריון לא נשמר.`
          );
        } else if (err.details?.conflicts?.length) {
          setErrorMsg(
            `⚠️ נמצאו קונפליקטים ב-${err.details.conflicts.length} מהשבועות. הסדרה לא נשמרה.`
          );
        } else {
          setErrorMsg("⚠️ קיים קונפליקט בזמנים. השריון לא נשמר.");
        }
      } else {
        setErrorMsg(err.message || "אירעה שגיאה בשמירה");
      }
    } finally {
      setLoading(false);
    }
  };

  // === מחיקה (במצב צפייה) ===
  const handleDelete = async (deleteSeries = false) => {
    const confirmMsg = deleteSeries
      ? "למחוק את כל סדרת הזמינויות החוזרות?"
      : "למחוק את האירוע הזה?";
    if (!window.confirm(confirmMsg)) return;

    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      await DiaryService.deleteEvent(eventData.id, token, deleteSeries);
      onSave();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "שגיאה במחיקה");
    } finally {
      setLoading(false);
    }
  };

  // === מצב צפייה (view) ===
  if (mode === "view" && eventData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
        <div
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          dir="rtl"
        >
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-bold text-gray-800">פרטי האירוע</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400">סוג</p>
              <p className="font-bold text-gray-800">{getTypeLabel(eventData.type)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">כותרת</p>
              <p className="font-bold text-gray-800">{eventData.title}</p>
            </div>

            {eventData.childName && (
              <div>
                <p className="text-sm text-gray-400">ילד/ה</p>
                <p className="font-bold text-blue-700">{eventData.childName}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">התחלה</p>
                <p className="font-mono text-gray-800">
                  {formatDateTime(eventData.start)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">סיום</p>
                <p className="font-mono text-gray-800">
                  {formatDateTime(eventData.end)}
                </p>
              </div>
            </div>

            {eventData.description && (
              <div>
                <p className="text-sm text-gray-400">תיאור</p>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {eventData.description}
                </p>
              </div>
            )}

            {eventData.isRecurring && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
                🔁 זהו חלק מסדרת זמינות חוזרת שבועית
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => handleDelete(false)}
              disabled={loading}
              className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-all disabled:bg-gray-400"
            >
              🗑️ מחק
            </button>
            {eventData.isRecurring && (
              <button
                onClick={() => handleDelete(true)}
                disabled={loading}
                className="flex-1 bg-red-700 text-white py-3 rounded-xl font-bold hover:bg-red-800 transition-all disabled:bg-gray-400"
              >
                מחק את כל הסדרה
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200"
            >
              סגור
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === מצב יצירה (create) ===
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6">הוספת אירוע חדש</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* בחירת סוג */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              סוג האירוע
            </label>
            <div className="grid grid-cols-3 gap-2">
              <TypeButton
                active={type === "appointment"}
                onClick={() => setType("appointment")}
                color="blue"
                icon="👤"
                label="אבחון"
              />
              <TypeButton
                active={type === "availability"}
                onClick={() => setType("availability")}
                color="green"
                icon="🕒"
                label="זמינות"
              />
              <TypeButton
                active={type === "note"}
                onClick={() => setType("note")}
                color="purple"
                icon="📝"
                label="הערה"
              />
            </div>
          </div>

          {/* בחירת ילד (רק לאבחון) */}
          {type === "appointment" && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                ילד/ה לאבחון
              </label>
              <select
                value={childId}
                onChange={(e) => {
                  setChildId(e.target.value);
                  // אוטומטית - הצב את שם הילד ככותרת
                  const selected = patients.find((p) => p.id === e.target.value);
                  if (selected) {
                    setTitle(`אבחון - ${selected.firstName} ${selected.lastName}`);
                  }
                }}
                className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- בחר/י ילד/ה --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* כותרת */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              כותרת
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === "appointment"
                  ? "לדוגמה: אבחון ראשוני"
                  : type === "availability"
                    ? "לדוגמה: שעת קבלה"
                    : "לדוגמה: לזכור להתקשר ל..."
              }
              className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* שעות התחלה וסיום */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                התחלה
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                סיום
              </label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* חזרה שבועית - רק לזמינות */}
          {type === "availability" && (
            <label className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-5 h-5 accent-green-600"
              />
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-sm">חזרה שבועית</p>
                <p className="text-xs text-gray-600">
                  ייווצרו 8 הופעות (חודשיים) באותו יום ושעה
                </p>
              </div>
            </label>
          )}

          {/* תיאור */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              תיאור (אופציונלי)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* הודעת שגיאה */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          {/* כפתורים */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-gray-400"
            >
              {loading ? "שומר..." : "💾 שמור"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// === Helper Components ===
const TypeButton = ({ active, onClick, color, icon, label }) => {
  const colorClasses = {
    blue: active ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700",
    green: active ? "bg-green-600 text-white" : "bg-green-50 text-green-700",
    purple: active ? "bg-purple-600 text-white" : "bg-purple-50 text-purple-700",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-3 rounded-xl font-bold transition-all ${colorClasses[color]}`}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xs">{label}</div>
    </button>
  );
};

// === Helper Functions ===
const formatLocalISO = (date) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatDateTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getTypeLabel = (type) => {
  const labels = {
    appointment: "👤 אבחון",
    availability: "🕒 זמינות",
    note: "📝 הערה",
  };
  return labels[type] || type;
};

export default EventFormModal;