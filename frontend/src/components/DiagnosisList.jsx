import React from "react";

const DiagnosisList = ({ diagnoses, onSelect }) => {
  if (diagnoses.length === 0) {
    return (
      <div className="p-16 border-2 border-dashed border-gray-100 rounded-3xl text-center bg-gray-50/50 text-gray-500 font-sans">
        <div className="text-5xl mb-4 text-gray-300">📊</div>
        <p className="text-lg font-medium tracking-wide">
          טרם נפתחו אבחונים לילד זה.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6 font-sans">
      {diagnoses.map((diag) => (
        <div
          key={diag.id}
          onClick={() => onSelect(diag)}
          className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm flex justify-between items-center hover:border-blue-400 cursor-pointer transition-all hover:shadow-md"
        >
          <div className="flex gap-10 items-center">
            <div>
              <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">
                סטטוס אבחון
              </p>
              <p className="font-bold text-gray-700">{diag.status}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">
                מצב שאלון הורים
              </p>
              <span
                className={`px-4 py-1 rounded-full text-xs font-bold ${
                  diag.parentQuestionnaireStatus === "נשלח"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {diag.parentQuestionnaireStatus}
              </span>
            </div>
          </div>

          <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors">
            צפייה בפרטים ←
          </button>
        </div>
      ))}
    </div>
  );
};

export default DiagnosisList;
