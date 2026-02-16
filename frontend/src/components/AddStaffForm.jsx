import React, { useState } from "react";

const AddStaffForm = ({ onAdd, onCancel }) => {
  const [newMember, setNewMember] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: "therapist",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newMember); // שולח את הנתונים חזרה לעמוד הראשי
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "12px",
          width: "400px",
          direction: "rtl",
        }}
      >
        <h3>הוספת איש צוות חדש</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="text"
            placeholder="שם פרטי"
            required
            onChange={(e) =>
              setNewMember({ ...newMember, firstName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="שם משפחה"
            required
            onChange={(e) =>
              setNewMember({ ...newMember, lastName: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="אימייל"
            required
            onChange={(e) =>
              setNewMember({ ...newMember, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="סיסמה"
            required
            onChange={(e) =>
              setNewMember({ ...newMember, password: e.target.value })
            }
          />
          <input
            type="tel"
            placeholder="טלפון"
            required
            onChange={(e) =>
              setNewMember({ ...newMember, phone: e.target.value })
            }
          />

          <select
            value={newMember.role}
            onChange={(e) =>
              setNewMember({ ...newMember, role: e.target.value })
            }
          >
            <option value="therapist">מאבחן</option>
            <option value="admin">מנהל</option>
          </select>

          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <button
              type="submit"
              style={{
                flex: 1,
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "4px",
              }}
            >
              שמור
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: 1,
                backgroundColor: "#ccc",
                border: "none",
                padding: "10px",
                borderRadius: "4px",
              }}
            >
              ביטול
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddStaffForm;
