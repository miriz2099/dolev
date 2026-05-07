import React, { useState, useEffect } from "react";
import therapistService from "../services/therapist.service";
import { useAuth } from "../contexts/AuthContext";

/**
 * מודאל לבחירת slot פנוי וקביעת תור
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - diagnosisId: string
 * - assessment: { id, name, durationMinutes }
 * - onBooked: () => void  - callback אחרי הזמנה מוצלחת
 */
const SlotPickerModal = ({
  isOpen,
  onClose,
  diagnosisId,
  assessment,
  onBooked,
}) => {
  const { currentUser } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState(null);

  // טעינת slots בפתיחת המודאל
  useEffect(() => {
    if (!isOpen || !assessment) return;
    loadSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, assessment]);

  const loadSlots = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await currentUser.getIdToken();
      const data = await therapistService.getAvailableSlots(
        diagnosisId,
        assessment.id,
        token,
      );
      setSlots(data.slots || []);
    } catch (err) {
      console.error("Error loading slots:", err);
      setError(err.message || "שגיאה בטעינת זמינויות");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;
    try {
      setBooking(true);
      setError(null);
      const token = await currentUser.getIdToken();
      await therapistService.bookAssessmentAppointment(
        diagnosisId,
        assessment.id,
        { start: selectedSlot.start, end: selectedSlot.end },
        token,
      );
      onBooked?.();
      handleClose();
    } catch (err) {
      console.error("Error booking:", err);
      setError(err.message || "שגיאה בקביעת התור");
      // אם המצב השתנה - נטען מחדש את ה-slots
      if (err.message?.includes("תפוסה") || err.message?.includes("כבר נקבע")) {
        loadSlots();
      }
    } finally {
      setBooking(false);
    }
  };

  const handleClose = () => {
    setSelectedSlot(null);
    setError(null);
    onClose();
  };

  // קיבוץ slots לפי תאריך לתצוגה נוחה
  const groupSlotsByDate = (slots) => {
    const grouped = {};
    slots.forEach((slot) => {
      const dateKey = new Date(slot.start).toLocaleDateString("he-IL", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(slot);
    });
    return grouped;
  };

  const formatTime = (isoStr) => {
    return new Date(isoStr).toLocaleTimeString("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  const groupedSlots = groupSlotsByDate(slots);
  const dateKeys = Object.keys(groupedSlots);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 animate-fadeIn"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl text-right max-h-[90vh] flex flex-col"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* כותרת */}
        <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              📅 קביעת תור לאבחון
            </h3>
            <p className="text-blue-600 font-medium mt-1">
              {assessment?.name} • {assessment?.durationMinutes} דקות
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* גוף המודאל - גלילה */}
        <div className="flex-1 overflow-y-auto -mx-2 px-2">
          {loading ? (
            <div className="p-12 text-center text-blue-500 animate-pulse font-bold">
              טוען זמינויות...
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-center">
              {error}
            </div>
          ) : slots.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
              <div className="text-5xl mb-4 text-gray-300">📭</div>
              <p className="text-lg font-medium text-gray-600 mb-2">
                אין כרגע שעות פנויות מתאימות
              </p>
              <p className="text-sm text-gray-400">
                ניתן לפנות למאבחן בהודעה כדי לקבל זמנים נוספים.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {dateKeys.map((dateKey) => (
                <div key={dateKey}>
                  <h4 className="text-base font-bold text-gray-700 mb-3 sticky top-0 bg-white py-2">
                    📅 {dateKey}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {groupedSlots[dateKey].map((slot) => {
                      const isSelected =
                        selectedSlot?.start === slot.start &&
                        selectedSlot?.end === slot.end;
                      return (
                        <button
                          key={slot.start}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-3 px-3 rounded-xl font-bold text-sm transition-all border-2 ${
                            isSelected
                              ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105"
                              : "bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                          }`}
                        >
                          {formatTime(slot.start)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* סרגל פעולה תחתון */}
        {!loading && slots.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            {selectedSlot && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 text-sm">
                <span className="font-bold text-blue-900">בחירתך: </span>
                <span className="text-blue-700">
                  {new Date(selectedSlot.start).toLocaleDateString("he-IL", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}{" "}
                  בשעה {formatTime(selectedSlot.start)} -{" "}
                  {formatTime(selectedSlot.end)}
                </span>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleConfirmBooking}
                disabled={!selectedSlot || booking}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {booking ? "קובע תור..." : "אישור הזמנה"}
              </button>
              <button
                onClick={handleClose}
                disabled={booking}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
              >
                ביטול
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotPickerModal;
