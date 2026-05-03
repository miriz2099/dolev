// client/src/components/EventFormModal.jsx
import React, { useState } from "react";

const EventFormModal = ({ selectedDate, onClose, onSave }) => {
  const [type, setType] = useState("appointment"); // appointment | availability | note
  const [formData, setFormData] = useState({
    title: "",
    startTime: "09:00",
    endTime: "10:00",
    isRecurring: false,
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, type, date: selectedDate });
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3>הגדר/י פעילות לתאריך: {selectedDate}</h3>

        <div style={{ marginBottom: "15px" }}>
          <label>סוג הפעילות: </label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="appointment">פגישה עם ילד/ה</option>
            <option value="availability">הגדרת טווח זמינות</option>
            <option value="note">הערה אישית</option>
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={type === "appointment" ? "שם הילד/ה" : "נושא/כותרת"}
            required
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            style={inputStyle}
          />

          <div style={{ display: "flex", gap: "10px", margin: "10px 0" }}>
            <label>
              משעה:{" "}
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
              />
            </label>
            <label>
              עד שעה:{" "}
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
              />
            </label>
          </div>

          {type === "availability" && (
            <label style={{ display: "block", marginBottom: "10px" }}>
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) =>
                  setFormData({ ...formData, isRecurring: e.target.checked })
                }
              />
              חזור על זמינות זו בכל שבוע (ביום זה)
            </label>
          )}

          <textarea
            placeholder="הערות נוספות..."
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            style={{ ...inputStyle, height: "60px" }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <button type="button" onClick={onClose} style={cancelBtnStyle}>
              ביטול
            </button>
            <button type="submit" style={saveBtnStyle}>
              שמור/י
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// עיצובים בסיסיים (אפשר להעביר ל-CSS)
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};
const modalContentStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "10px",
  width: "400px",
  direction: "rtl",
};
const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  boxSizing: "border-box",
};
const saveBtnStyle = {
  backgroundColor: "#27ae60",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
};
const cancelBtnStyle = {
  backgroundColor: "#e74c3c",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
};

export default EventFormModal;
