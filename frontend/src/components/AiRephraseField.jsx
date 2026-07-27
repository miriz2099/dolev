// frontend/src/components/AiRephraseField.jsx
//
// שדה טקסט חופשי עם כפתור "נסח מחדש".
// המאבחנת כותבת בצורה אסוציאטיבית, לוחצת, ומקבלת הצעת ניסוח קליני
// במסך השוואה. הטקסט מוחלף רק אם היא מאשרת במפורש.

import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import reportService from "../services/report.service";

const MIN_CHARS = 15;

const AiRephraseField = ({
  diagnosisId,
  sectionId,
  value,
  onChange,
  rows = 6,
  disabled = false,
}) => {
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestion, setSuggestion] = useState(null); // { text, provider, model }

  const text = value || "";
  const tooShort = text.trim().length < MIN_CHARS;
  const canRephrase = !disabled && !loading && !tooShort && diagnosisId;

  if (!diagnosisId) {
    console.warn(
      `[AiRephraseField] missing diagnosisId for section "${sectionId}"`,
    );
  }

  const requestRephrase = async () => {
    setLoading(true);
    setError("");
    try {
      const token = await currentUser.getIdToken();
      const result = await reportService.rephrase(
        diagnosisId,
        sectionId,
        text,
        token,
      );
      setSuggestion(result);
    } catch (err) {
      setError(err.message || "הניסוח נכשל. נסי שוב.");
    } finally {
      setLoading(false);
    }
  };

  const acceptSuggestion = () => {
    onChange(suggestion.text);
    setSuggestion(null);
  };

  return (
    <div className="flex flex-col gap-2" dir="rtl">
      {/* שורת הפעולה - מיושרת לצד שמאל בתצוגת RTL */}
      <div className="flex justify-end items-center gap-3">
        {tooShort && text.length > 0 && (
          <span className="text-gray-500 text-sm">
            כתבי לפחות {MIN_CHARS} תווים כדי לנסח
          </span>
        )}
        <button
          type="button"
          onClick={requestRephrase}
          disabled={!canRephrase}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                     bg-purple-500 text-white hover:bg-purple-600 transition
                     disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              מנסח...
            </>
          ) : (
            <>✨ נסח מחדש</>
          )}
        </button>
      </div>

      <textarea
        rows={rows}
        value={text}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder="אפשר לכתוב בקצרה ובחופשיות - ואז ללחוץ על 'נסח מחדש'"
        className="border border-gray-300 p-2 rounded-lg outline-none resize-y
                   focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
      />

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {/* מסך השוואה - לפני ואחרי */}
      {suggestion && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          dir="rtl"
        >
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-1">הצעת ניסוח</h3>
            <p className="text-gray-500 text-sm mb-4">
              הטקסט נוצר אוטומטית. קראי אותו במלואו לפני ההחלפה - ודאי שלא נוספו
              עובדות שלא כתבת.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-5">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-gray-500 text-sm font-semibold mb-2">
                  הטקסט שלך
                </p>
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {text}
                </p>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-blue-700 text-sm font-semibold mb-2">
                  ניסוח מוצע
                </p>
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {suggestion.text}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={acceptSuggestion}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                החלף את הטקסט
              </button>
              <button
                type="button"
                onClick={() => {
                  setSuggestion(null);
                  requestRephrase();
                }}
                className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                נסח שוב
              </button>
              <button
                type="button"
                onClick={() => setSuggestion(null)}
                className="px-5 py-2 rounded-xl text-gray-500 hover:bg-gray-50 transition"
              >
                השאר כמו שהוא
              </button>

              <span className="text-gray-500 text-sm mr-auto">
                {suggestion.model}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiRephraseField;
