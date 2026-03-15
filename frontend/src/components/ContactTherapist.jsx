import React from "react";

const ContactTherapist = ({ therapistName }) => {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-2xl text-white shadow-lg">
      <h3 className="text-lg font-bold mb-2">צריך עזרה?</h3>
      <p className="text-sm opacity-90 mb-4">
        ניתן ליצור קשר ישיר עם המאבחן {therapistName}
      </p>
      <button className="w-full bg-white text-blue-600 font-bold py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
        <span>✉️</span>
        <span>שלח הודעה</span>
      </button>
    </div>
  );
};

export default ContactTherapist;
