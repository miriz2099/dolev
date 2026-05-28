import React, { useState } from "react";

const EditStaffForm = ({ member, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({ ...member });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-right"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative">
        {/* כותרת - כחולה כדי להבדיל מהוספה (סגול) */}
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            ✏️ עריכת פרטי איש צוות
          </h2>
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
          {/* תצוגת המשתמש שבעריכה */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">
              {member.firstName?.[0]}
              {member.lastName?.[0]}
            </div>
            <div>
              <p className="text-sm text-blue-900 font-bold">
                עריכת: {member.firstName} {member.lastName}
              </p>
              <p className="text-xs text-blue-700">{member.email}</p>
            </div>
          </div>

          {/* שם פרטי + משפחה */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                שם פרטי
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* טלפון */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              טלפון
            </label>
            <input
              type="tel"
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
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
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
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
              className="flex-1 py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg active:scale-95 transition-all"
            >
              💾 שמור שינויים
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

export default EditStaffForm;
