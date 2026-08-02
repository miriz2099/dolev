// frontend/src/components/DiagnosisProgressStepper.jsx
//
// סרגל התקדמות להורה - מציג באיזה שלב מתוך 5 נמצא תהליך האבחון של הילד.
// קומפוננטה מוצגת בלבד (לא מנהלת state) - מקבלת את התוצאה הגולמית
// מ-GET /diagnoses/:diagnosisId/progress (therapistService.getDiagnosisProgress).

import React from "react";

const DiagnosisProgressStepper = ({ progress }) => {
  if (!progress?.steps?.length) return null;

  const { currentStep, steps } = progress;

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6" dir="rtl">
      <h3 className="text-base font-bold text-gray-700 mb-5">שלב האבחון</h3>
      <div className="flex items-start">
        {steps.map((step, index) => {
          const isDone = step.done;
          const isCurrent = index === currentStep && !isDone;
          const isLast = index === steps.length - 1;

          const circleClass = isDone
            ? "bg-green-500 text-white"
            : isCurrent
              ? "bg-blue-600 text-white ring-4 ring-blue-100"
              : "bg-gray-100 text-gray-400";

          const lineClass = index < currentStep || isDone ? "bg-green-400" : "bg-gray-200";

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center text-center w-24 shrink-0">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${circleClass}`}
                >
                  {isDone ? "✓" : index + 1}
                </div>
                <p
                  className={`mt-2 text-xs leading-tight ${
                    isCurrent ? "text-blue-700 font-bold" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </p>
                {step.progress && step.progress.total > 0 && (
                  <span className="mt-1 text-[11px] text-gray-400 bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5">
                    {step.progress.done}/{step.progress.total}
                  </span>
                )}
              </div>
              {!isLast && (
                <div className={`h-0.5 flex-1 mt-[18px] mx-1 ${lineClass}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default DiagnosisProgressStepper;
