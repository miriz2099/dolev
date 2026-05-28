import React, { useState } from "react";
import therapistService from "../services/therapist.service";
import { useAuth } from "../contexts/AuthContext";

/**
 * ניהול רשימת אבחונים נדרשים בתוך diagnosis (לתצוגת מאבחן)
 *
 * Props:
 * - diagnosisId: string
 * - assessments: Array (requiredAssessments מתוך ה-diagnosis)
 * - onChange: () => void  - callback לרענון מהשרת אחרי כל פעולה
 */
const RequiredAssessmentsManager = ({
  diagnosisId,
  assessments = [],
  onChange,
}) => {
  const { currentUser } = useAuth();

  // טופס הוספה/עריכה
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = הוספה, string = עריכה
  const [name, setName] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setDurationMinutes(90);
    setEditingId(null);
    setIsFormOpen(false);
  };

  const openAddForm = () => {
    setEditingId(null);
    setName("");
    setDurationMinutes(90);
    setIsFormOpen(true);
  };

  const openEditForm = (assessment) => {
    setEditingId(assessment.id);
    setName(assessment.name);
    setDurationMinutes(assessment.durationMinutes);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("יש להזין שם אבחון");
      return;
    }
    if (!durationMinutes || durationMinutes <= 0) {
      alert("משך הזמן חייב להיות גדול מ-0");
      return;
    }

    try {
      setSubmitting(true);
      const token = await currentUser.getIdToken();

      if (editingId) {
        await therapistService.updateRequiredAssessment(
          diagnosisId,
          editingId,
          { name: name.trim(), durationMinutes: Number(durationMinutes) },
          token,
        );
      } else {
        await therapistService.addRequiredAssessment(
          diagnosisId,
          { name: name.trim(), durationMinutes: Number(durationMinutes) },
          token,
        );
      }

      resetForm();
      onChange?.(); // רענון מההורה
    } catch (err) {
      console.error("Error saving assessment:", err);
      alert(err.message || "שגיאה בשמירת האבחון");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (assessment) => {
    if (
      !window.confirm(
        `למחוק את האבחון "${assessment.name}" מרשימת האבחונים הנדרשים?`,
      )
    ) {
      return;
    }

    try {
      const token = await currentUser.getIdToken();
      await therapistService.deleteRequiredAssessment(
        diagnosisId,
        assessment.id,
        token,
      );
      onChange?.();
    } catch (err) {
      console.error("Error deleting assessment:", err);
      alert(err.message || "שגיאה במחיקת האבחון");
    }
  };

  // עזרי תצוגה לסטטוס
  const statusBadge = (status) => {
    const config = {
      pending: { label: "ממתין לתיאום", color: "bg-amber-100 text-amber-700" },
      scheduled: { label: "תור נקבע", color: "bg-blue-100 text-blue-700" },
      completed: { label: "הושלם", color: "bg-green-100 text-green-700" },
    };
    const cfg = config[status] || config.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${cfg.color}`}>
        {cfg.label}
      </span>
    );
  };

  return (
    <div
      className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 font-sans"
      dir="rtl"
    >
      {/* כותרת + כפתור הוספה */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            🧪 אבחונים נדרשים
          </h3>
        </div>
        {!isFormOpen && (
          <button
            onClick={openAddForm}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md text-sm shrink-0"
          >
            + הוספת אבחון
          </button>
        )}
      </div>

      {/* טופס הוספה/עריכה */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl mb-6 animate-fadeIn"
        >
          <h4 className="font-bold text-gray-800 mb-4">
            {editingId ? "עריכת אבחון" : "הוספת אבחון חדש"}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                שם האבחון
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="לדוגמה: WISC-V / ראיון קליני"
                className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                משך זמן (דקות)
              </label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                min="15"
                max="480"
                step="15"
                className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                disabled={submitting}
              />
              <div className="flex gap-2 mt-2">
                {[60, 90, 120, 150].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDurationMinutes(preset)}
                    className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                      Number(durationMinutes) === preset
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    {preset} דק׳
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-gray-400"
            >
              {submitting
                ? "שומר..."
                : editingId
                  ? "שמירת שינויים"
                  : "הוספת אבחון"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              disabled={submitting}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
            >
              ביטול
            </button>
          </div>
        </form>
      )}

      {/* רשימת האבחונים */}
      {assessments.length === 0 ? (
        <div className="p-12 border-2 border-dashed border-gray-100 rounded-2xl text-center bg-gray-50/50 text-gray-500">
          <div className="text-5xl mb-3 text-gray-300">📋</div>
          <p className="text-base font-medium">
            טרם הוגדרו אבחונים נדרשים לתהליך זה.
          </p>
          <p className="text-sm mt-2 text-gray-400">
            יש ללחוץ על "הוספת אבחון"
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {assessments.map((asm) => {
            const isPending = asm.status === "pending";
            const isScheduled = asm.status === "scheduled";

            // 🆕 פירוק תאריך השעה לתצוגה ידידותית (בלי timezone shifts)
            const formatScheduledTime = (isoStr) => {
              if (!isoStr) return null;
              const [datePart, timePart] = isoStr.split("T");
              const [year, month, day] = datePart.split("-");
              const [hh, mm] = timePart.split(":");

              // יצירת תאריך לתצוגה רק (לא משפיע על השוואות)
              const dateObj = new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day),
              );
              const dayName = dateObj.toLocaleDateString("he-IL", {
                weekday: "long",
              });
              const monthName = dateObj.toLocaleDateString("he-IL", {
                month: "long",
              });

              return {
                dayName,
                dayNum: day,
                monthName,
                time: `${hh}:${mm}`,
              };
            };

            const scheduledInfo = isScheduled
              ? formatScheduledTime(asm.scheduledStart)
              : null;
            const scheduledEnd = isScheduled
              ? formatScheduledTime(asm.scheduledEnd)
              : null;

            return (
              <div
                key={asm.id}
                className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between hover:border-blue-200 transition-all shadow-sm flex-wrap gap-4"
              >
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-bold text-gray-800 text-lg">
                      {asm.name}
                    </h4>
                    {statusBadge(asm.status)}
                  </div>
                  <p className="text-gray-500 text-sm">
                    משך זמן:{" "}
                    <span className="font-bold">
                      {asm.durationMinutes} דקות
                    </span>
                  </p>

                  {/* 🆕 תצוגת תאריך ושעה כשהתור נקבע */}
                  {isScheduled && scheduledInfo && scheduledEnd && (
                    <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-2 rounded-xl">
                      <span className="text-blue-600">📅</span>
                      <span className="text-sm font-bold text-blue-900">
                        יום {scheduledInfo.dayName}, {scheduledInfo.dayNum} ב
                        {scheduledInfo.monthName}
                      </span>
                      <span className="text-sm text-blue-700">•</span>
                      <span className="text-sm font-bold text-blue-900">
                        {scheduledInfo.time} - {scheduledEnd.time}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  {isPending && (
                    <button
                      onClick={() => openEditForm(asm)}
                      className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all"
                      title="ערכי"
                    >
                      ✏️ עריכה
                    </button>
                  )}
                  {asm.status !== "scheduled" && (
                    <button
                      onClick={() => handleDelete(asm)}
                      className="bg-red-50 text-red-600 border border-red-100 px-3 py-2 rounded-lg text-xs font-bold hover:bg-red-100 transition-all"
                      title="מחקי"
                    >
                      🗑️ מחיקה
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        // <div className="space-y-3">
        //   {assessments.map((asm) => {
        //     const isPending = asm.status === "pending";
        //     return (
        //       <div
        //         key={asm.id}
        //         className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between hover:border-blue-200 transition-all shadow-sm"
        //       >
        //         <div className="flex-1">
        //           <div className="flex items-center gap-3 mb-1">
        //             <h4 className="font-bold text-gray-800 text-lg">
        //               {asm.name}
        //             </h4>
        //             {statusBadge(asm.status)}
        //           </div>
        //           <p className="text-gray-500 text-sm">
        //             משך זמן:{" "}
        //             <span className="font-bold">
        //               {asm.durationMinutes} דקות
        //             </span>
        //           </p>
        //         </div>

        //         <div className="flex gap-2 shrink-0">
        //           {isPending && (
        //             <button
        //               onClick={() => openEditForm(asm)}
        //               className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all"
        //               title="ערכי"
        //             >
        //               ✏️ עריכה
        //             </button>
        //           )}
        //           {asm.status !== "scheduled" && (
        //             <button
        //               onClick={() => handleDelete(asm)}
        //               className="bg-red-50 text-red-600 border border-red-100 px-3 py-2 rounded-lg text-xs font-bold hover:bg-red-100 transition-all"
        //               title="מחקי"
        //             >
        //               🗑️ מחיקה
        //             </button>
        //           )}
        //         </div>
        //       </div>
        //     );
        //   })}
        // </div>
      )}
    </div>
  );
};

export default RequiredAssessmentsManager;
