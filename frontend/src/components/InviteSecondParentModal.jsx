import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import consentFormService from "../services/consentForm.service";

/**
 * מודאל להזמנת ההורה השני לחתימה על טופס ההסכמה
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - consentForm: { id, ... }
 * - onSent: () => void
 */
const InviteSecondParentModal = ({ isOpen, onClose, consentForm, onSent }) => {
  const { currentUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const externalParent = consentForm?.parents?.find(
    (p) => p.role === "external",
  );
  const isResend = !!externalParent;

  // 🔧 אתחול השדות מהנתונים הקיימים כשהמודאל נפתח
  useEffect(() => {
    if (isOpen) {
      setName(externalParent?.name || "");
      setEmail(externalParent?.email || "");
      setError(null);
    }
  }, [isOpen, externalParent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("יש להזין שם מלא");
    if (!email.trim()) return setError("יש להזין כתובת מייל");

    try {
      setSubmitting(true);
      const token = await currentUser.getIdToken();
      await consentFormService.inviteSecondParent(
        consentForm.id,
        { name: name.trim(), email: email.trim() },
        token,
      );
      onSent?.();
      onClose();
    } catch (err) {
      console.error("Error inviting second parent:", err);
      setError(err.message || "שגיאה בשליחת ההזמנה");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !consentForm) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl text-right"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {isResend ? "🔄 שליחה חוזרת" : "📨 שליחה להורה השני"}
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              {isResend
                ? `נשלח קודם ל-${externalParent.email}`
                : "ההורה השני יקבל מייל עם לינק לחתימה"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            disabled={submitting}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-sm text-purple-900">
            <strong>💡 מתי להשתמש?</strong>
            <p className="mt-1 leading-relaxed">
              במקרה של הורים גרושים או פרודים שדרושה חתימה משני ההורים. ההורה
              השני יקבל מייל עם לינק ייחודי למילוי הטופס.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              שם מלא של ההורה השני *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="לדוגמה: דוד כהן"
              className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              כתובת מייל *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="parent@example.com"
              className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
              disabled={submitting}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-all disabled:bg-gray-400"
            >
              {submitting ? "שולח..." : isResend ? "🔄 שלח שוב" : "📨 שלח מייל"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteSecondParentModal;
