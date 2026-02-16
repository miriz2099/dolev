import React, { useState } from "react";

const EditStaffForm = ({ member, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({ ...member });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
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
        <h3>עריכת פרטי איש צוות</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            placeholder="שם פרטי"
            required
          />
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            placeholder="שם משפחה"
            required
          />
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="טלפון"
            required
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
                cursor: "pointer",
              }}
            >
              שמור שינויים
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
                cursor: "pointer",
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

export default EditStaffForm;
