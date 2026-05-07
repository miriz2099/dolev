import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import consentFormService from "../services/consentForm.service";

const PublicConsentForm = () => {
  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(null);

  // שדות החתימה
  const [signature, setSignature] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);

  // טעינת הטופס מ-API
  useEffect(() => {
    const loadForm = async () => {
      try {
        setLoading(true);
        const data = await consentFormService.getByToken(token);
        setFormData(data);
      } catch (err) {
        console.error("Error loading consent form:", err);
        setError(err.message || "שגיאה בטעינת הטופס");
      } finally {
        setLoading(false);
      }
    };
    if (token) loadForm();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!signature.trim()) return setSubmitError("יש להזין חתימה");
    if (!agreed) return setSubmitError("יש לאשר את ההסכמה");

    try {
      setSubmitting(true);
      await consentFormService.signByToken(token, {
        signature: signature.trim(),
        agreed,
      });
      setSuccess(true);
    } catch (err) {
      console.error("Error signing:", err);
      setSubmitError(err.message || "שגיאה בשמירת החתימה");
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================
  // מצבי תצוגה
  // ============================================

  // טעינה
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="text-blue-600 text-xl font-bold animate-pulse">
            טוען טופס...
          </div>
        </div>
      </div>
    );
  }

  // שגיאה כללית
  if (error) {
    return (
      <div
        className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4"
        dir="rtl"
      >
        <div className="bg-white rounded-3xl shadow-lg p-10 max-w-md w-full text-center">
          <span className="text-6xl mb-4 block">⚠️</span>
          <h1 className="text-2xl font-bold text-red-600 mb-3">
            הקישור לא תקין
          </h1>
          <p className="text-gray-600">{error}</p>
          <p className="text-gray-400 text-sm mt-6">
            ייתכן שהקישור פג תוקף או שכבר נעשה בו שימוש.
          </p>
        </div>
      </div>
    );
  }

  // הצלחת חתימה
  if (success) {
    return (
      <div
        className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4"
        dir="rtl"
      >
        <div className="bg-white rounded-3xl shadow-lg p-10 max-w-md w-full text-center">
          <span className="text-6xl mb-4 block">✅</span>
          <h1 className="text-3xl font-bold text-green-600 mb-3">תודה רבה!</h1>
          <p className="text-gray-700 text-lg mb-6">החתימה שלך נשמרה בהצלחה.</p>
          <p className="text-gray-500 text-sm">
            ההסכמה הועברה למאבחן וניתן כעת להתחיל בתהליך האבחון.
            <br />
            אפשר לסגור את החלון הזה.
          </p>
        </div>
      </div>
    );
  }

  // כבר חתום
  if (formData?.alreadySigned) {
    return (
      <div
        className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4"
        dir="rtl"
      >
        <div className="bg-white rounded-3xl shadow-lg p-10 max-w-md w-full text-center">
          <span className="text-6xl mb-4 block">✓</span>
          <h1 className="text-2xl font-bold text-blue-600 mb-3">
            כבר חתמת על הטופס
          </h1>
          <p className="text-gray-600 mb-2">
            שלום {formData.externalParent.name},
          </p>
          <p className="text-gray-500 text-sm">
            החתימה שלך על טופס ההסכמה עבור {formData.childInfo.fullName} נשמרה
            בעבר.
          </p>
        </div>
      </div>
    );
  }

  // טופס החתימה
  const today = new Date().toLocaleDateString("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {/* כותרת ראשית */}
        <div className="bg-gradient-to-l from-purple-600 to-purple-700 rounded-3xl p-8 text-white shadow-lg mb-6">
          <h1 className="text-3xl font-bold mb-2">📋 טופס הסכמה לאבחון</h1>
          <p className="text-purple-100">{today}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-lg p-8 space-y-6"
        >
          {/* פרטי הילד */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <h3 className="font-bold text-gray-700 mb-3">פרטי הנבחן/ת</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">שם הנבחן/ת: </span>
                <span className="font-bold text-gray-900">
                  {formData.childInfo.fullName}
                </span>
              </div>
              <div>
                <span className="text-gray-500">תעודת זהות: </span>
                <span className="font-bold text-gray-900">
                  {formData.childInfo.idNumber || "—"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">תאריך לידה: </span>
                <span className="font-bold text-gray-900">
                  {formData.childInfo.birthDate || "—"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">בית ספר/גן: </span>
                <span className="font-bold text-gray-900">
                  {formData.childInfo.schoolOrGarden || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* מידע על הזרימה */}
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">
            <h3 className="font-bold text-purple-900 mb-2">
              שלום {formData.externalParent.name},
            </h3>
            <p className="text-purple-900 text-sm leading-relaxed">
              <strong>{formData.registeredParent.name}</strong> פנה/תה אליך
              בבקשה לחתום על טופס ההסכמה לעריכת אבחון פסיכולוגי עבור{" "}
              <strong>{formData.childInfo.fullName}</strong>.
            </p>
          </div>

          {/* הצהרת ההסכמה */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <h3 className="font-bold text-blue-900 mb-3">הצהרת ההסכמה</h3>
            <p className="text-blue-900 text-sm leading-relaxed">
              אני, החתום מטה, מאשר/ת בזאת את עריכת מבחני האבחון הפסיכולוגי
              לבן/בת המשפחה הרשום/ה מעלה. ידוע לי כי תוצאות האבחון יישמרו כחומר
              מקצועי חסוי ויועברו להורים בצורה מסודרת בסיום התהליך.
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

          {/* פרטי החותם */}
          <div className="space-y-4 border-t border-gray-100 pt-5">
            <h3 className="font-bold text-gray-700">פרטי ההורה החותם</h3>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                שם מלא
              </label>
              <input
                type="text"
                value={formData.externalParent.name}
                disabled
                className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 text-gray-700"
              />
              <p className="text-xs text-gray-400 mt-1">
                השם הוזן ע״י ההורה השני - לא ניתן לשנות
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                חתימה *{" "}
                <span className="text-gray-400 font-normal text-xs">
                  (הקלד/י את שמך המלא כחתימה)
                </span>
              </label>
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="הקלד/י כאן את שמך המלא"
                className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 bg-white font-bold italic"
                style={{ fontFamily: "cursive" }}
                disabled={submitting}
              />
            </div>
          </div>

          {/* שגיאה */}
          {submitError && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-red-700 text-sm">
              {submitError}
            </div>
          )}

          {/* כפתור */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-all disabled:bg-gray-400"
          >
            {submitting ? "שומר חתימה..." : "✓ אישור וחתימה"}
          </button>
        </form>

        {/* פוטר */}
        <p className="text-center text-gray-400 text-xs mt-6">
          קישור זה אישי ומאובטח. אנא אל תעביר/י אותו לאחרים.
        </p>
      </div>
    </div>
  );
};

export default PublicConsentForm;
