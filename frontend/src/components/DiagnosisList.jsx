import React from "react";
import { diagnosisLabel, diagnosisStatusLabel } from "../utils/diagnosisDisplay";

const REPORT_STATUS_LABELS = {
  draft: "דוח: טיוטה",
  completed: "דוח: הוגש",
};

/**
 * רשימת אבחונים לילד/ה - כל כרטיס מציג הקשר מלא (איזה אבחון, מתי, סטטוס
 * שאלון ודוח) כדי שהמאבחן/ת לא יצטרך/תצטרך לפתוח כדי לדעת מה המצב.
 *
 * @param {object[]} diagnoses - ממוין מהחדש לישן (כפי שה-Backend מחזיר)
 * @param {(diagnosis: object) => void} onSelect
 * @param {string} [childFirstName] - לטקסט מצב ריק ממוקד
 * @param {Object<string,string>} [reportStatusByDiagnosis] - מפה diagnosisId -> "none"|"draft"|"completed"|"unknown"
 */
const DiagnosisList = ({
  diagnoses,
  onSelect,
  childFirstName,
  reportStatusByDiagnosis = {},
}) => {
  if (!diagnoses || diagnoses.length === 0) {
    return (
      <div className="p-16 border-2 border-dashed border-gray-100 rounded-3xl text-center bg-gray-50/50 text-gray-500 font-sans">
        <div className="text-5xl mb-4 text-gray-300">📊</div>
        <p className="text-lg font-medium tracking-wide">
          {childFirstName
            ? `טרם נפתחו אבחונים ל${childFirstName}.`
            : "טרם נפתחו אבחונים לילד זה."}
        </p>
      </div>
    );
  }

  const total = diagnoses.length;
  // "האבחון הנוכחי" - האבחון הפתוח (לא סגור) העדכני ביותר; אם כולם סגורים, אין תג
  const currentDiagnosisId = diagnoses.find((d) => !d.closed)?.id || null;

  return (
    <div className="space-y-4 mt-6 font-sans">
      {diagnoses.map((diag, index) => {
        const isCurrent = diag.id === currentDiagnosisId;
        const reportStatus = reportStatusByDiagnosis[diag.id];
        const reportLabel = REPORT_STATUS_LABELS[reportStatus] || null;

        return (
          <div
            key={diag.id}
            onClick={() => onSelect(diag)}
            className={`p-6 rounded-2xl bg-white shadow-sm flex justify-between items-center cursor-pointer transition-all hover:shadow-md flex-wrap gap-4 ${
              isCurrent
                ? "border-2 border-blue-300"
                : "border border-gray-100 hover:border-blue-400"
            }`}
          >
            <div className="flex gap-10 items-center flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    {diagnosisLabel(diag, { index, total })}
                  </p>
                  {isCurrent && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
                      האבחון הנוכחי
                    </span>
                  )}
                </div>
                <p className="font-bold text-gray-700">
                  {diagnosisStatusLabel(diag)}
                </p>
              </div>

              {diag.parentQuestionnaireStatus && (
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
              )}

              {reportLabel && (
                <div>
                  <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">
                    דוח
                  </p>
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-bold ${
                      reportStatus === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {reportLabel}
                  </span>
                </div>
              )}
            </div>

            <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors shrink-0">
              {diag.closed ? "צפייה ←" : "כניסה לאבחון ←"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default DiagnosisList;
