// src/components/GenericMessageModal.jsx
import React, { useState } from "react";

const GenericMessageModal = ({
  isOpen,
  onClose,
  onSend,
  title,
  placeholder,
}) => {
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <h3 className="text-xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="text-2xl hover:opacity-70 transition-opacity"
          >
            ✕
          </button>
        </div>

        <div className="p-8">
          <textarea
            className="w-full h-44 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none resize-none text-right text-gray-700"
            placeholder={placeholder || "כתבו כאן..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            dir="rtl"
          />

          <div className="flex gap-4 mt-8 font-sans">
            <button
              onClick={() => {
                onSend(message);
                setMessage("");
              }}
              className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              שלחי הודעה
            </button>
            <button
              onClick={onClose}
              className="px-8 py-4 border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
            >
              ביטול
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericMessageModal;
