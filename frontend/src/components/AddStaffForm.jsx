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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-right"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative">
        {/* כותרת */}
        <div className="bg-purple-600 p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">הוספת איש צוות חדש</h2>
          <button
            onClick={onCancel}
            type="button"
            className="text-white text-3xl leading-none hover:text-gray-200"
          >
            &times;
          </button>
        </div>

        {/* גוף הטופס */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* שם פרטי + משפחה */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                שם פרטי
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                value={newMember.firstName}
                onChange={(e) =>
                  setNewMember({ ...newMember, firstName: e.target.value })
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
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                value={newMember.lastName}
                onChange={(e) =>
                  setNewMember({ ...newMember, lastName: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* אימייל + טלפון */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                אימייל
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                value={newMember.email}
                onChange={(e) =>
                  setNewMember({ ...newMember, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                טלפון
              </label>
              <input
                type="tel"
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                value={newMember.phone}
                onChange={(e) =>
                  setNewMember({ ...newMember, phone: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* סיסמה */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              סיסמה
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              value={newMember.password}
              onChange={(e) =>
                setNewMember({ ...newMember, password: e.target.value })
              }
              required
            />
          </div>

          <hr className="my-2" />

          {/* תפקיד */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              תפקיד
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
              value={newMember.role}
              onChange={(e) =>
                setNewMember({ ...newMember, role: e.target.value })
              }
            >
              <option value="therapist">מאבחן/ת</option>
              <option value="admin">מנהל/ת</option>
            </select>
          </div>

          {/* כפתורים */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-lg font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-lg active:scale-95 transition-all"
            >
              שמור
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 rounded-lg font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffForm;
