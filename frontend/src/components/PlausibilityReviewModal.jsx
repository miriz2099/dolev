// frontend/src/components/PlausibilityReviewModal.jsx
//
// מוצג לפני הגשת דוח סופי אם בדיקת הסבירות (התאמה נושאית) מצאה בלוקים
// שנראים לא שייכים לסעיף שלהם. המאבחנת יכולה לאשר כל בלוק בנפרד (או
// הכל יחד) ולהמשיך להגשה, או לבטל ולחזור לערוך.

import React from "react";

const PlausibilityReviewModal = ({
  issues,
  acknowledgedIds,
  onAcknowledge,
  onAcknowledgeAll,
  onCancel,
  onContinue,
}) => {
  const allAcknowledged = issues.every((issue) => acknowledgedIds.has(issue.sectionId));

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-6 pb-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-1">נמצא תוכן שאולי לא מתאים</h3>
          <p className="text-gray-500 text-sm mb-3">
            הבדיקה היא נושאית בלבד (האם התוכן שייך לסעיף) - היא לא בודקת נכונות
            קלינית. אם התוכן תקין, אפשר פשוט לאשר ולהמשיך.
          </p>
          <button
            type="button"
            onClick={onAcknowledgeAll}
            className="text-sm text-purple-700 border border-purple-300 rounded-xl px-3 py-1.5 hover:bg-purple-50 transition"
          >
            ✓ אשר הכל והמשך
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-4">
          {issues.map((issue) => (
            <div
              key={issue.sectionId}
              className="rounded-2xl border border-red-200 bg-red-50/40 p-4 mb-3 last:mb-0"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800">{issue.title}</span>
                {acknowledgedIds.has(issue.sectionId) && (
                  <span className="text-sm text-green-600 font-medium">✓ אושר</span>
                )}
              </div>
              <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed bg-white rounded-xl border border-gray-200 p-3 mb-2">
                {issue.rawText}
              </p>
              <p className="text-sm text-red-700 mb-2">⚠ {issue.reason}</p>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer w-fit">
                <input
                  type="checkbox"
                  checked={acknowledgedIds.has(issue.sectionId)}
                  onChange={() => onAcknowledge(issue.sectionId)}
                  className="w-4 h-4 accent-purple-600"
                />
                אשר בכל זאת
              </label>
            </div>
          ))}
        </div>

        <div className="p-6 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onContinue}
            disabled={!allAcknowledged}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            המשך להגשה
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-xl text-gray-500 hover:bg-gray-50 transition"
          >
            בטל וערוך
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlausibilityReviewModal;
