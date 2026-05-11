import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import consentFormService from "../services/consentForm.service";

/**
 * מודאל לחתימה על טופס הסכמה לאבחון פסיכולוגי
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - consentForm: { id, childInfo, parents, ... }
 * - onSigned: () => void  - callback אחרי חתימה מוצלחת
 */
const ConsentFormModal = ({ isOpen, onClose, consentForm, onSigned }) => {
  const { currentUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [signature, setSignature] = useState("");
  const [schoolOrGarden, setSchoolOrGarden] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // אתחול שדות מהמשתמש המחובר ומהטופס
  useEffect(() => {
    if (isOpen && currentUser) {
      setEmail(currentUser.email || "");
      setSchoolOrGarden(consentForm?.childInfo?.schoolOrGarden || "");
      setName("");
      setSignature("");
      setAgreed(false);
      setError(null);
    }
  }, [isOpen, currentUser, consentForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("יש להזין שם מלא");
    if (!email.trim()) return setError("יש להזין כתובת מייל");
    if (!signature.trim()) return setError("יש להקליד חתימה");
    if (!agreed) return setError("יש לאשר את ההסכמה לפני החתימה");

    try {
      setSubmitting(true);
      const token = await currentUser.getIdToken();
      await consentFormService.signByRegisteredParent(
        consentForm.id,
        {
          name: name.trim(),
          email: email.trim(),
          signature: signature.trim(),
          schoolOrGarden: schoolOrGarden.trim(),
        },
        token,
      );
      onSigned?.();
      onClose();
    } catch (err) {
      console.error("Error signing consent form:", err);
      setError(err.message || "שגיאה בשמירת החתימה");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !consentForm) return null;

  const { childInfo } = consentForm;
  const today = new Date().toLocaleDateString("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl text-right max-h-[90vh] flex flex-col"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* כותרת */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              📋 הסכמת הורים לעריכת אבחון פסיכולוגי
            </h3>
            <p className="text-gray-500 text-sm mt-1">{today}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            disabled={submitting}
          >
            ✕
          </button>
        </div>

        {/* גוף הטופס - גלילה */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* פרטי הילד - כפי שכבר קיימים במערכת */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
              <h4 className="font-bold text-gray-700 mb-3 text-sm">
                פרטי הנבחן
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">שם הנבחן: </span>
                  <span className="font-bold text-gray-900">
                    {childInfo?.fullName || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">מספר מזהה : </span>
                  <span className="font-bold text-gray-900">
                    {childInfo?.idNumber || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">תאריך לידה: </span>
                  <span className="font-bold text-gray-900">
                    {childInfo?.birthDate || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* בית ספר/גן - שדה למילוי */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                שם בית הספר / הגן
              </label>
              <input
                type="text"
                value={schoolOrGarden}
                onChange={(e) => setSchoolOrGarden(e.target.value)}
                placeholder="לדוגמה: בי״ס הגליל"
                className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                disabled={submitting}
              />
            </div>

            {/* הצהרת ההסכמה */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <h4 className="font-bold text-blue-900 mb-3">הצהרת ההסכמה</h4>
              <p className="text-blue-900 text-sm leading-relaxed">
                אנו, החתומים מטה, מאשרים בזאת את עריכת מבחני האבחון הפסיכולוגי
                לבן/בת המשפחה הרשום/ה מעלה. ידוע לנו כי תוצאות האבחון יישמרו
                כחומר מקצועי חסוי ויועברו אלינו בצורה מסודרת בסיום התהליך.
              </p>

              <label className="flex items-start gap-3 mt-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 mt-0.5 cursor-pointer"
                  disabled={submitting}
                />
                <span className="text-sm font-bold text-blue-900">
                  קראתי, הבנתי ואני מסכים/ה לעריכת האבחון
                </span>
              </label>
            </div>

            {/* פרטי ההורה החותם */}
            <div className="space-y-4 border-t border-gray-100 pt-5">
              <h4 className="font-bold text-gray-700">פרטי ההורה החותם</h4>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  שם מלא *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="שם פרטי ושם משפחה"
                  className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                  className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  חתימה *{" "}
                  <span className="text-gray-400 font-normal text-xs">
                    (הקלידי את שמך המלא כחתימה)
                  </span>
                </label>
                <input
                  type="text"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="הקלידי כאן את שמך המלא"
                  className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white font-bold italic"
                  style={{ fontFamily: "cursive" }}
                  disabled={submitting}
                />
              </div>
            </div>

            {/* הודעת שגיאה */}
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* סרגל פעולה תחתון */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-gray-400"
            >
              {submitting ? "שומר חתימה..." : "✓ אישור וחתימה"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsentFormModal;
