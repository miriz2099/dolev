import React from "react";
import {
  childFullName,
  childAgeYears,
  childGradeSchoolLabel,
} from "../utils/childDisplay";

/**
 * כרטיס הקשר קבוע - "על איזה ילד/ה מדובר" - מוצג בראש עמודי הילד/אבחון/
 * דוח. לא מגדיר עיצוב/צבעים חדשים לאתר, רק משתמש בפלטה הניטרלית הקיימת.
 * מציג רק שדות שבאמת קיימים כדי לא להראות "undefined" או "·" מיותר.
 *
 * @param {object} childData
 * @param {string} [therapistLabel] - תגית נוספת (למשל "מאבחן/ת אחראי/ת: ...") - מוצגת רק אם מועברת במפורש
 * @param {React.ReactNode} [extra] - תוכן נוסף בצד ימין של הכרטיס (למשל מתג מעבר בין אחים)
 */
const ChildContextCard = ({ childData, therapistLabel, extra }) => {
  if (!childData) return null;

  const name = childFullName(childData) || "מטופל/ת";
  const age = childAgeYears(childData.birthDate);
  const gradeSchool = childGradeSchoolLabel(childData);

  const metaParts = [
    age !== null ? `גיל ${age}` : null,
    gradeSchool || null,
    childData.idNumber ? `ת"ז ${childData.idNumber}` : null,
  ].filter(Boolean);

  return (
    <div
      className="bg-white border border-gray-100 rounded-2xl shadow-sm px-5 py-4 mb-6 flex items-center justify-between flex-wrap gap-3"
      dir="rtl"
    >
      <div>
        <p className="text-lg font-bold text-gray-800">{name}</p>
        {metaParts.length > 0 && (
          <p className="text-sm text-gray-400 mt-0.5">
            {metaParts.join(" · ")}
          </p>
        )}
      </div>
      {(therapistLabel || extra) && (
        <div className="flex items-center gap-3 flex-wrap">
          {therapistLabel && (
            <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold">
              {therapistLabel}
            </span>
          )}
          {extra}
        </div>
      )}
    </div>
  );
};

export default ChildContextCard;
