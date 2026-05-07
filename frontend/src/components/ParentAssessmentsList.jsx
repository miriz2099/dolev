import React, { useState } from "react";
import therapistService from "../services/therapist.service";
import { useAuth } from "../contexts/AuthContext";
import SlotPickerModal from "./SlotPickerModal";

/**
 * תצוגת אבחונים נדרשים להורה - עם אפשרות קביעת תור
 *
 * Props:
 * - diagnosis: { id, requiredAssessments, ... }
 * - onChange: () => void  - callback לרענון אחרי קביעה/ביטול
 */
const ParentAssessmentsList = ({ diagnosis, onChange }) => {
  const { currentUser } = useAuth();
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const assessments = diagnosis?.requiredAssessments || [];

  const handleOpenPicker = (assessment) => {
    setSelectedAssessment(assessment);
  };

  const handleClosePicker = () => {
    setSelectedAssessment(null);
  };

  const handleBooked = () => {
    onChange?.();
  };

  const handleCancel = async (assessment) => {
    if (
      !window.confirm(
        `לבטל את התור ל-"${assessment.name}"? לאחר הביטול תוכלי לקבוע תור חדש.`,
      )
    ) {
      return;
    }
    try {
      setCancellingId(assessment.id);
      const token = await currentUser.getIdToken();
      await therapistService.cancelAssessmentAppointment(
        diagnosis.id,
        assessment.id,
        token,
      );
      onChange?.();
    } catch (err) {
      console.error("Error cancelling:", err);
      alert(err.message || "שגיאה בביטול התור");
    } finally {
      setCancellingId(null);
    }
  };

  // ספירת סטטוסים למידע מהיר למעלה
  const pendingCount = assessments.filter((a) => a.status === "pending").length;
  const scheduledCount = assessments.filter(
    (a) => a.status === "scheduled",
  ).length;
  const completedCount = assessments.filter(
    (a) => a.status === "completed",
  ).length;

  if (assessments.length === 0) {
    return (
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] text-right animate-fadeIn font-sans">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-6 border-b border-gray-100">
          🧪 אבחונים לתיאום
        </h2>
        <div className="p-12 border-2 border-dashed border-gray-100 rounded-2xl text-center bg-gray-50/50">
          <div className="text-6xl mb-4 text-gray-300">📋</div>
          <p className="text-lg font-medium text-gray-600 mb-2">
            המאבחן עדיין לא הגדיר אבחונים נדרשים
          </p>
          <p className="text-sm text-gray-400">
            ברגע שהמאבחן יגדיר אילו אבחונים נדרשים, תוכלי לקבוע תור עבור כל אחד
            מהם כאן.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] text-right animate-fadeIn font-sans"
      dir="rtl"
    >
      {/* כותרת + סיכום סטטוס */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          🧪 אבחונים לתיאום
        </h2>
        <div className="flex flex-wrap gap-3">
          {pendingCount > 0 && (
            <span className="px-4 py-2 bg-amber-50 text-amber-700 rounded-xl text-sm font-bold border border-amber-100">
              {pendingCount} ממתין לתיאום
            </span>
          )}
          {scheduledCount > 0 && (
            <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold border border-blue-100">
              {scheduledCount} נקבע
            </span>
          )}
          {completedCount > 0 && (
            <span className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-bold border border-green-100">
              {completedCount} הושלם
            </span>
          )}
        </div>
      </div>

      {/* רשימת אבחונים */}
      <div className="space-y-4">
        {assessments.map((asm) => (
          <AssessmentCard
            key={asm.id}
            assessment={asm}
            onSchedule={() => handleOpenPicker(asm)}
            onCancel={() => handleCancel(asm)}
            isCancelling={cancellingId === asm.id}
          />
        ))}
      </div>

      {/* מודאל בחירת slot */}
      <SlotPickerModal
        isOpen={!!selectedAssessment}
        onClose={handleClosePicker}
        diagnosisId={diagnosis.id}
        assessment={selectedAssessment}
        onBooked={handleBooked}
      />
    </div>
  );
};

// תת-קומפוננטה לכרטיס אבחון יחיד
const AssessmentCard = ({ assessment, onSchedule, onCancel, isCancelling }) => {
  const isPending = assessment.status === "pending";
  const isScheduled = assessment.status === "scheduled";
  const isCompleted = assessment.status === "completed";

  // עיצוב צבעוני לפי סטטוס
  const cardStyle = isScheduled
    ? "border-blue-200 bg-blue-50/30"
    : isCompleted
      ? "border-green-200 bg-green-50/30"
      : "border-gray-100 bg-white";

  const formatScheduledDateTime = (isoStr) => {
    if (!isoStr) return null;
    const [datePart, timePart] = isoStr.split("T");
    const [year, month, day] = datePart.split("-");
    const [hh, mm] = timePart.split(":");

    const dateObj = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
    );
    const dayName = dateObj.toLocaleDateString("he-IL", { weekday: "long" });
    const monthName = dateObj.toLocaleDateString("he-IL", { month: "long" });

    return `יום ${dayName}, ${parseInt(day)} ב${monthName} בשעה ${hh}:${mm}`;
  };

  const scheduledStartFormatted = formatScheduledDateTime(
    assessment.scheduledStart,
  );
  const scheduledEndTime = assessment.scheduledEnd
    ? assessment.scheduledEnd.split("T")[1].slice(0, 5) // "10:30"
    : null;

  return (
    <div
      className={`p-5 border rounded-2xl transition-all shadow-sm hover:shadow-md ${cardStyle}`}
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-bold text-gray-800 text-lg">
              {assessment.name}
            </h4>
            {isPending && (
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                ⏳ ממתין לתיאום
              </span>
            )}
            {isScheduled && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                ✅ תור נקבע
              </span>
            )}
            {isCompleted && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                ✔ הושלם
              </span>
            )}
          </div>

          <p className="text-gray-500 text-sm mb-1">
            משך זמן:{" "}
            <span className="font-bold text-gray-700">
              {assessment.durationMinutes} דקות
            </span>
          </p>

          {isScheduled && scheduledStartFormatted && (
            <div className="mt-3 inline-flex items-center gap-2 bg-blue-100/50 px-3 py-2 rounded-lg">
              <span className="text-blue-600">📅</span>
              <span className="text-blue-700 font-medium text-sm">
                {scheduledStartFormatted}
                {scheduledEndTime && (
                  <span className="text-blue-500">
                    {" "}
                    (עד {scheduledEndTime})
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2 shrink-0">
          {isPending && (
            <button
              onClick={onSchedule}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md text-sm"
            >
              📅 קבעו תור
            </button>
          )}
          {isScheduled && (
            <button
              onClick={onCancel}
              disabled={isCancelling}
              className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl font-bold hover:bg-red-100 transition-all text-sm disabled:opacity-50"
            >
              {isCancelling ? "מבטל..." : "❌ ביטול תור"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentAssessmentsList;
