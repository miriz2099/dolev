import React from "react";

/**
 * מודאל לצפייה בטופס ההסכמה (למאבחן בלבד - read-only)
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - consentForm: { id, childInfo, parents, status, ... }
 */
const ConsentFormViewer = ({ isOpen, onClose, consentForm }) => {
  if (!isOpen || !consentForm) return null;

  const { childInfo, parents, status, createdAt } = consentForm;
  const registeredParent = parents?.find((p) => p.role === "registered");
  const externalParent = parents?.find((p) => p.role === "external");

  // עיצוב סטטוס
  const getStatusBadge = () => {
    switch (status) {
      case "fully_signed":
        return {
          label: "✅ חתום במלואו",
          color: "bg-green-100 text-green-700 border-green-200",
        };
      case "partially_signed":
        return {
          label: "🖊️ חתום חלקית",
          color: "bg-amber-100 text-amber-700 border-amber-200",
        };
      default:
        return {
          label: "⏳ ממתין לחתימה",
          color: "bg-gray-100 text-gray-700 border-gray-200",
        };
    }
  };

  const badge = getStatusBadge();

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("he-IL", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // קומפוננטה פנימית לתצוגת הורה
  const ParentSection = ({ parent, label, accentColor = "blue" }) => {
    if (!parent) return null;

    const colors = {
      blue: {
        bg: "bg-blue-50/50",
        border: "border-blue-200",
        text: "text-blue-900",
      },
      purple: {
        bg: "bg-purple-50/50",
        border: "border-purple-200",
        text: "text-purple-900",
      },
    };
    const c = colors[accentColor];

    return (
      <div className={`${c.bg} border ${c.border} rounded-2xl p-5`}>
        <div className="flex justify-between items-start mb-3">
          <h4 className={`font-bold ${c.text}`}>{label}</h4>
          <span
            className={`text-xs px-2 py-1 rounded font-bold ${
              parent.signed
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {parent.signed ? "✅ חתם" : "⏳ ממתין"}
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="text-gray-500 w-32">שם:</span>
            <span className="font-bold text-gray-900">
              {parent.name || "—"}
            </span>
          </div>
          <div className="flex">
            <span className="text-gray-500 w-32">מייל:</span>
            <span className="text-gray-700">{parent.email || "—"}</span>
          </div>

          {parent.signed ? (
            <>
              <div className="flex">
                <span className="text-gray-500 w-32">תאריך חתימה:</span>
                <span className="text-gray-700">
                  {formatDate(parent.signedAt)}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="text-gray-500 text-xs block mb-2">חתימה:</span>
                <div
                  className="bg-white border border-gray-200 rounded-xl p-4 text-2xl font-bold italic text-gray-800"
                  style={{ fontFamily: "cursive" }}
                >
                  {parent.signature}
                </div>
              </div>
            </>
          ) : (
            parent.role === "external" &&
            parent.inviteSentAt && (
              <div className="flex">
                <span className="text-gray-500 w-32">הוזמן:</span>
                <span className="text-gray-700">
                  {formatDate(parent.inviteSentAt)}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl text-right max-h-[90vh] flex flex-col"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* כותרת */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-2xl font-bold text-gray-800">
                📋 טופס הסכמה לאבחון
              </h3>
              <span
                className={`text-xs px-3 py-1 rounded-full font-bold border ${badge.color}`}
              >
                {badge.label}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              נוצר: {formatDate(createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* גוף - גלילה */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* פרטי הילד */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <h4 className="font-bold text-gray-700 mb-3 text-sm">
              פרטי הנבחן/ת
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">שם הנבחן/ת: </span>
                <span className="font-bold text-gray-900">
                  {childInfo?.fullName || "—"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">תעודת זהות: </span>
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
              <div>
                <span className="text-gray-500">בית ספר/גן: </span>
                <span className="font-bold text-gray-900">
                  {childInfo?.schoolOrGarden || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* הצהרת ההסכמה */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <h4 className="font-bold text-blue-900 mb-2">הצהרת ההסכמה</h4>
            <p className="text-blue-900 text-sm leading-relaxed">
              ההורים החתומים מטה אישרו את עריכת מבחני האבחון הפסיכולוגי לבן/בת
              המשפחה הרשום/ה מעלה. תוצאות האבחון יישמרו כחומר מקצועי חסוי.
            </p>
          </div>

          {/* ההורה הרשום */}
          <ParentSection
            parent={registeredParent}
            label="הורה רשום במערכת"
            accentColor="blue"
          />

          {/* ההורה השני (אם קיים) */}
          {externalParent ? (
            <ParentSection
              parent={externalParent}
              label="הורה שני (הוזמן ע״י המייל)"
              accentColor="purple"
            />
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-5 text-center text-gray-500 text-sm">
              💡 לא הוזמן הורה שני לטופס זה.
              <br />
              <span className="text-xs text-gray-400">
                (במקרה של הורים גרושים ההורה הרשום יכול להזמין הורה שני)
              </span>
            </div>
          )}
        </div>

        {/* כפתור סגירה */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentFormViewer;
