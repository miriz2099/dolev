import React from "react";
import { useNavigate } from "react-router-dom";

const ChildCard = ({ child }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    // ניתוב לעמוד הפרטים עם ה-ID של הילד הספציפי
    navigate(`/child-details/${child.id}`);
  };
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
      <div className="h-2 bg-blue-500 group-hover:bg-blue-600 transition-colors"></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="bg-blue-50 p-3 rounded-full text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
            ת"ז: {child.idNumber}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {child.firstName} {child.lastName}
        </h3>

        <div className="space-y-2 mt-4 text-gray-600">
          <p className="flex items-center gap-2">
            <span className="font-semibold text-blue-600">●</span>
            תאריך לידה: {child.birthDate || "לא הוזן"}
          </p>
          <p className="flex items-center gap-2">
            <span className="font-semibold text-blue-600">●</span>
            סטטוס: <span className="text-green-600 font-medium">פעיל</span>
          </p>
        </div>

        <button
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          onClick={handleNavigate}
        >
          <span>צפייה בתהליך אבחון</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 rotate-180"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChildCard;
