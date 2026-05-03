import React from "react";

const ContactTherapist = ({ therapistName, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-2xl text-white shadow-lg cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-white/20 p-2 rounded-full">
          <span className="text-2xl">💬</span>
        </div>
        <h3 className="text-lg font-bold">צריך עזרה?</h3>
      </div>

      <p className="text-sm opacity-90 mb-4 leading-relaxed">
        ניתן ליצור קשר ישיר עם המאבחן{" "}
        <span className="font-bold">{therapistName}</span>
      </p>

      <button
        type="button"
        className="w-full bg-white text-blue-600 font-bold py-2.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 active:scale-95"
      >
        <span>✉️</span>
        <span>שלח הודעה</span>
      </button>
    </div>
  );
};

export default ContactTherapist;
