import React from "react";

const MessageCard = ({ msg, onReply, onDelete }) => {
  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-300 relative group ${
        msg.read
          ? "bg-white border-gray-100 shadow-sm"
          : "bg-blue-50 border-blue-200 shadow-md ring-1 ring-blue-100"
      }`}
    >
      {/* כפתור מחיקה - הוספתי z-10 ו-cursor-pointer כדי לוודא שזה לחיץ וגלוי */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // מונע מהקליק להפעיל אירועים אחרים בכרטיס
          onDelete(msg.id);
        }}
        className="absolute top-4 left-4 text-gray-400 hover:text-red-500 transition-colors p-2 z-10 cursor-pointer opacity-0 group-hover:opacity-100"
        title="מחיקת הודעה"
      >
        <span className="text-xl">🗑️</span>
      </button>

      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {!msg.read && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                הודעה חדשה
              </span>
            )}
            <span className="text-xs text-gray-400 font-mono">
              {new Date(msg.createdAt).toLocaleString("he-IL")}
            </span>
          </div>
          <h4 className="text-md font-bold text-gray-800">
            לגבי המטופל/ת:{" "}
            <span className="text-blue-700">
              {msg.childName || "טוען שם..."}
            </span>
          </h4>
        </div>
      </div>

      <p className="text-gray-700 bg-white/50 p-3 rounded-xl border border-gray-50 italic mb-4">
        "{msg.text}"
      </p>

      <div className="flex justify-end">
        <button
          onClick={() => onReply(msg)}
          className="flex items-center gap-2 bg-gray-800 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-black transition-all active:scale-95 shadow-sm"
        >
          <span>↩️</span> השב להורה
        </button>
      </div>
    </div>
  );
};

export default MessageCard;
