// frontend/src/components/AiRephraseField.jsx
//
// שדה טקסט חופשי עם כפתור "נסח מחדש".
// המאבחנת כותבת בצורה אסוציאטיבית, לוחצת, ומקבלת הצעת ניסוח קליני
// במסך השוואה. הטקסט מוחלף רק אם היא מאשרת במפורש.

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import reportService from "../services/report.service";

export const MIN_CHARS = 15;

const AiRephraseField = ({
  diagnosisId,
  sectionId,
  value,
  onChange,
  rows = 6,
  disabled = false,
  warning = null,
  onAcknowledgeWarning,
  allowDraftFromQuestionnaires = false,
}) => {
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestion, setSuggestion] = useState(null); // { text, provider, model }
  const [editedText, setEditedText] = useState("");
  const [suggestionSource, setSuggestionSource] = useState(null); // "rephrase" | "draft"
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftError, setDraftError] = useState("");

  // שיחה על הניסוח - לא נשמרת בשום מקום, רק מועברת כקלט לכל קריאת refine
  const [sourceText, setSourceText] = useState("");
  const [chatMessages, setChatMessages] = useState([]); // [{ role: "user"|"assistant", text }]
  const [chatInput, setChatInput] = useState("");
  const [refining, setRefining] = useState(false);
  const [chatError, setChatError] = useState("");
  const chatScrollRef = useRef(null);

  const isEdited = Boolean(suggestion) && editedText !== suggestion.text;

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, refining]);

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
      setEditedText(result.text);
      setSuggestionSource("rephrase");
      setSourceText(text);
      setChatMessages([]);
      setChatInput("");
      setChatError("");
    } catch (err) {
      setError(err.message || "הניסוח נכשל. נסי שוב.");
    } finally {
      setLoading(false);
    }
  };

  const requestDraftFromQuestionnaires = async () => {
    if (disabled) return;
    setDraftLoading(true);
    setDraftError("");
    try {
      const token = await currentUser.getIdToken();
      const result = await reportService.draftFromQuestionnaires(
        diagnosisId,
        sectionId,
        token,
      );
      setSuggestion(result);
      setEditedText(result.text);
      setSuggestionSource("draft");
      setSourceText("");
      setChatMessages([]);
      setChatInput("");
      setChatError("");
    } catch (err) {
      setDraftError(err.message || "יצירת הטיוטה נכשלה. נסי שוב.");
    } finally {
      setDraftLoading(false);
    }
  };

  const acceptSuggestion = () => {
    if (!editedText.trim()) return;
    onChange(editedText);
    setSuggestion(null);
  };

  const hasUnsavedWork = isEdited || chatMessages.length > 0;

  const handleRephraseAgain = () => {
    if (
      hasUnsavedWork &&
      !window.confirm("הנוסח והשיחה לא יישמרו. להמשיך?")
    ) {
      return;
    }
    setSuggestion(null);
    if (suggestionSource === "draft") {
      requestDraftFromQuestionnaires();
    } else {
      requestRephrase();
    }
  };

  const handleDiscardSuggestion = () => {
    if (
      hasUnsavedWork &&
      !window.confirm("הנוסח והשיחה לא יישמרו. להמשיך?")
    ) {
      return;
    }
    setSuggestion(null);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || refining) return;

    const message = chatInput.trim();
    const historyForRequest = chatMessages.slice(-10);

    setChatMessages((prev) => [...prev, { role: "user", text: message }]);
    setChatInput("");
    setChatError("");
    setRefining(true);

    try {
      const token = await currentUser.getIdToken();
      const result = await reportService.refine(
        diagnosisId,
        {
          sectionId,
          mode: suggestionSource,
          sourceText,
          currentText: editedText,
          history: historyForRequest,
          message,
        },
        token,
      );
      setEditedText(result.text);
      setSuggestion((prev) => ({ ...prev, text: result.text }));
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: result.note || "הנוסח עודכן." },
      ]);
    } catch (err) {
      setChatMessages((prev) => prev.slice(0, -1));
      setChatInput(message);
      setChatError(err.message || "עדכון הניסוח נכשל. נסי שוב.");
    } finally {
      setRefining(false);
    }
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
        {allowDraftFromQuestionnaires && (
          <button
            type="button"
            onClick={requestDraftFromQuestionnaires}
            disabled={disabled || draftLoading || loading || !diagnosisId}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                       bg-indigo-500 text-white hover:bg-indigo-600 transition
                       disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {draftLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                יוצר טיוטה...
              </>
            ) : (
              <>📋 טיוטה מהשאלונים</>
            )}
          </button>
        )}
      </div>

      <textarea
        rows={rows}
        value={text}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder="אפשר לכתוב בקצרה ובחופשיות - ואז ללחוץ על 'נסח מחדש'"
        className={`border p-2 rounded-lg outline-none resize-y focus:ring-2 disabled:bg-gray-50 ${
          warning
            ? "border-red-400 focus:ring-red-400"
            : "border-gray-300 focus:ring-blue-500"
        }`}
      />

      {warning && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          <span className="flex-1">⚠ ייתכן שהתוכן לא מתאים לסעיף זה: {warning}</span>
          {onAcknowledgeWarning && (
            <button
              type="button"
              onClick={onAcknowledgeWarning}
              className="px-3 py-1 rounded-lg border border-red-300 text-red-700 text-xs font-semibold hover:bg-red-100 transition shrink-0"
            >
              אשר בכל זאת
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {draftError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          {draftError}
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
              הטקסט נוצר אוטומטית ואפשר לערוך אותו כאן לפני ההחלפה. קראי אותו
              במלואו - ודאי שלא נוספו עובדות שלא כתבת.
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
                  ניסוח מוצע (אפשר לערוך)
                </p>
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  disabled={refining}
                  dir="rtl"
                  className="w-full min-h-[240px] resize-y border border-blue-200 rounded-xl bg-white p-3 text-gray-800 leading-relaxed outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50"
                />
                {isEdited && (
                  <button
                    type="button"
                    onClick={() => setEditedText(suggestion.text)}
                    className="mt-2 text-sm text-blue-600 hover:underline"
                  >
                    ביטול העריכה הידנית
                  </button>
                )}
              </div>
            </div>

            {/* שיחה על הניסוח */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 mb-5">
              <p className="text-gray-700 text-sm font-semibold mb-3">
                שיחה על הניסוח
              </p>

              <div
                ref={chatScrollRef}
                className="max-h-[220px] overflow-y-auto flex flex-col gap-2 mb-3 pr-1"
              >
                {chatMessages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
                        m.role === "user"
                          ? "bg-gray-200 text-gray-800"
                          : "bg-blue-100 text-blue-900"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {refining && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-xl px-3 py-2 text-sm bg-blue-100 text-blue-900 flex items-center gap-1.5">
                      <span>מעדכנת את הנוסח...</span>
                      <span className="inline-flex gap-0.5">
                        <span className="w-1.5 h-1.5 bg-blue-900 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-blue-900 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-blue-900 rounded-full animate-bounce" />
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-end gap-2">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendChatMessage();
                    }
                  }}
                  maxLength={1000}
                  rows={2}
                  disabled={refining}
                  placeholder="כתבי מה לשנות או מה לא ברור בניסוח"
                  className="flex-1 border border-gray-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 resize-none disabled:bg-gray-100"
                />
                <button
                  type="button"
                  onClick={sendChatMessage}
                  disabled={refining || !chatInput.trim()}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  שליחה
                </button>
              </div>

              {chatError && (
                <p className="text-sm text-red-600 mt-2">{chatError}</p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                הבינה מתקנת לפי מה שכתבת ולא מוסיפה עובדות שלא הופיעו בטקסט
                או בהודעות שלך.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={acceptSuggestion}
                disabled={refining}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                החלף את הטקסט
              </button>
              <button
                type="button"
                onClick={handleRephraseAgain}
                disabled={refining}
                className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                נסח שוב
              </button>
              <button
                type="button"
                onClick={handleDiscardSuggestion}
                className="px-5 py-2 rounded-xl text-gray-500 hover:bg-gray-50 transition"
              >
                השאר כמו שהוא
              </button>

              <span className="text-gray-500 text-sm mr-auto">
                {suggestion.model}
              </span>
            </div>

            {!editedText.trim() && (
              <p className="text-sm text-red-600 mt-2">הטקסט המוצע ריק</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiRephraseField;
