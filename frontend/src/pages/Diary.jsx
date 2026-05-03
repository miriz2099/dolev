// // // import React, { useState, useEffect } from "react";
// // // import FullCalendar from "@fullcalendar/react";
// // // import dayGridPlugin from "@fullcalendar/daygrid";
// // // import timeGridPlugin from "@fullcalendar/timegrid";
// // // import interactionPlugin from "@fullcalendar/interaction";
// // // import { HDate } from "@hebcal/core";
// // // import { useAuth } from "../contexts/AuthContext";
// // // // import { AuthContext } from "../contexts/AuthContext";
// // // import DiaryService from "../services/diary.service";
// // // import EventFormModal from "../components/EventFormModal";

// // // const Diary = () => {
// // //   const { currentUser } = useAuth();
// // //   const [events, setEvents] = useState([]);
// // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // //   const [selectedDate, setSelectedDate] = useState(null);

// // //   // 1. טעינת אירועים מהשרת כשהקומפוננטה עולה
// // //   useEffect(() => {
// // //     const fetchEvents = async () => {
// // //       if (currentUser) {
// // //         // עדכון כאן
// // //         try {
// // //           const token = await currentUser.getIdToken(); // עדכון כאן
// // //           const data = await DiaryService.getEvents(token);
// // //           setEvents(data);
// // //         } catch (error) {
// // //           console.error("Failed to fetch events:", error);
// // //         }
// // //       }
// // //     };
// // //     fetchEvents();
// // //   }, [currentUser]); // עדכון כאן

// // //   // 2. פתיחת המודל בעת לחיצה על תאריך
// // //   const handleDateClick = (arg) => {
// // //     setSelectedDate(arg.dateStr);
// // //     setIsModalOpen(true);
// // //   };

// // //   const handleSaveEvent = async (formData) => {
// // //     console.log("1. handleSaveEvent started", formData); // בדיקה שהפונקציה התחילה
// // //     try {
// // //       if (!currentUser) {
// // //         throw new Error("User context is missing");
// // //       }

// // //       console.log("2. Fetching Token...");
// // //       const token = await currentUser.getIdToken();
// // //       console.log("3. Token received, calling Service...");

// // //       const response = await DiaryService.saveEvent(formData, token);
// // //       console.log("4. Service response:", response);

// // //       if (response && response.id) {
// // //         const newEvent = {
// // //           id: response.id,
// // //           title: formData.title,
// // //           start: `${formData.date}T${formData.startTime}`,
// // //           end: `${formData.date}T${formData.endTime}`,
// // //           extendedProps: { ...formData },
// // //         };
// // //         setEvents([...events, newEvent]);
// // //         setIsModalOpen(false);
// // //         alert("האירוע נשמר בהצלחה!");
// // //       }
// // //     } catch (error) {
// // //       console.error("FULL ERROR DETAILS:", error); // הדפסת השגיאה המלאה ל-Console
// // //       alert("שגיאה בשמירת האירוע: " + error.message);
// // //     }
// // //   };

// // //   const renderHebrewDate = (dateArg) => {
// // //     const hDate = new HDate(dateArg.date);
// // //     return hDate.renderGematriya().split("ת")[0].trim();
// // //   };

// // //   return (
// // //     <div
// // //       className="diary-page-container"
// // //       style={{ padding: "20px", direction: "rtl" }}
// // //     >
// // //       {/* עיצובים (אותם עיצובים מהשלב הקודם) */}
// // //       <style>{`
// // //         .fc-col-header-cell-cushion { color: #2c3e50 !important; font-weight: 800 !important; }
// // //         .fc-daygrid-day-number { color: #1a1a1a !important; font-weight: 800 !important; }
// // //         .hebrew-date-display { color: #d35400 !important; font-size: 0.85em; font-weight: 600; }
// // //         .custom-cell-content { display: flex; flex-direction: column; align-items: center; width: 100%; }
// // //       `}</style>

// // //       <h1>יומן עבודה</h1>

// // //       <FullCalendar
// // //         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
// // //         initialView="dayGridMonth"
// // //         locale="he"
// // //         direction="rtl"
// // //         events={events}
// // //         dateClick={handleDateClick}
// // //         dayCellContent={(arg) => (
// // //           <div className="custom-cell-content">
// // //             <div className="fc-daygrid-day-number">{arg.dayNumberText}</div>
// // //             <div className="hebrew-date-display">{renderHebrewDate(arg)}</div>
// // //           </div>
// // //         )}
// // //       />

// // //       {/* הצגת המודל רק כשהוא פתוח */}
// // //       {isModalOpen && (
// // //         <EventFormModal
// // //           selectedDate={selectedDate}
// // //           onClose={() => setIsModalOpen(false)}
// // //           onSave={handleSaveEvent}
// // //         />
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default Diary;
// // import React, { useState, useEffect } from "react";
// // import FullCalendar from "@fullcalendar/react";
// // import dayGridPlugin from "@fullcalendar/daygrid";
// // import timeGridPlugin from "@fullcalendar/timegrid"; // תצוגת זמנים (שבוע/יום)
// // import interactionPlugin from "@fullcalendar/interaction";
// // import { HDate } from "@hebcal/core";
// // import { useAuth } from "../contexts/AuthContext";
// // import DiaryService from "../services/diary.service";
// // import EventFormModal from "../components/EventFormModal";

// // const Diary = () => {
// //   const { currentUser } = useAuth();
// //   const [events, setEvents] = useState([]);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [selectedDate, setSelectedDate] = useState(null);

// //   useEffect(() => {
// //     const fetchEvents = async () => {
// //       if (currentUser) {
// //         try {
// //           const token = await currentUser.getIdToken();
// //           const data = await DiaryService.getEvents(token);

// //           // עיבוד האירועים שחוזרים מהשרת כדי שיוצגו נכון עם צבעים
// //           const formattedEvents = data.map((ev) => ({
// //             ...ev,
// //             // הגדרת צבעים לפי סוג האירוע
// //             backgroundColor:
// //               ev.type === "appointment"
// //                 ? "#3498db" // כחול לפגישה
// //                 : ev.type === "availability"
// //                   ? "#2ecc71" // ירוק לזמינות
// //                   : "#95a5a6", // אפור להערה
// //             borderColor: "transparent",
// //           }));

// //           setEvents(formattedEvents);
// //         } catch (error) {
// //           console.error("Failed to fetch events:", error);
// //         }
// //       }
// //     };
// //     fetchEvents();
// //   }, [currentUser]);

// //   const handleDateClick = (arg) => {
// //     setSelectedDate(arg.dateStr);
// //     setIsModalOpen(true);
// //   };

// //   const handleSaveEvent = async (formData) => {
// //     try {
// //       if (!currentUser) throw new Error("User context is missing");
// //       const token = await currentUser.getIdToken();
// //       const response = await DiaryService.saveEvent(formData, token);

// //       if (response && response.id) {
// //         const newEvent = {
// //           id: response.id,
// //           title: formData.title,
// //           start: `${formData.date}T${formData.startTime}`,
// //           end: `${formData.date}T${formData.endTime}`,
// //           type: formData.type,
// //           backgroundColor:
// //             formData.type === "appointment"
// //               ? "#3498db"
// //               : formData.type === "availability"
// //                 ? "#2ecc71"
// //                 : "#95a5a6",
// //         };
// //         setEvents([...events, newEvent]);
// //         setIsModalOpen(false);
// //       }
// //     } catch (error) {
// //       alert("שגיאה בשמירת האירוע: " + error.message);
// //     }
// //   };

// //   const renderHebrewDate = (dateArg) => {
// //     const hDate = new HDate(dateArg.date);
// //     return hDate.renderGematriya().split("ת")[0].trim();
// //   };

// //   return (
// //     <div
// //       className="diary-page-container"
// //       style={{ padding: "20px", direction: "rtl" }}
// //     >
// //       <style>{`
// //         .fc-col-header-cell-cushion { color: #2c3e50 !important; font-weight: 800 !important; }
// //         .fc-daygrid-day-number { color: #1a1a1a !important; font-weight: 800 !important; }
// //         .hebrew-date-display { color: #d35400 !important; font-size: 0.85em; font-weight: 600; }
// //         .custom-cell-content { display: flex; flex-direction: column; align-items: center; width: 100% }

// //         /* עיצוב האירועים בלוח */
// //         .fc-event {
// //           cursor: pointer;
// //           padding: 2px 5px;
// //           font-size: 0.9em;
// //           border-radius: 4px;
// //         }
// //       `}</style>

// //       <h1>יומן עבודה</h1>

// //       <FullCalendar
// //         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
// //         initialView="dayGridMonth"
// //         // הגדרת סרגל הכלים העליון
// //         headerToolbar={{
// //           right: "prev,next today",
// //           center: "title",
// //           left: "dayGridMonth,timeGridWeek,timeGridDay", // כפתורי המעבר
// //         }}
// //         locale="he"
// //         direction="rtl"
// //         events={events}
// //         dateClick={handleDateClick}
// //         slotMinTime="07:00:00" // שעת התחלה ביומן יומי
// //         slotMaxTime="21:00:00" // שעת סיום ביומן יומי
// //         allDaySlot={false} // ביטול שורת "כל היום" בתצוגת שבוע/יום
// //         dayCellContent={(arg) => (
// //           <div className="custom-cell-content">
// //             <div className="fc-daygrid-day-number">{arg.dayNumberText}</div>
// //             <div className="hebrew-date-display">{renderHebrewDate(arg)}</div>
// //           </div>
// //         )}
// //         // הצגת שעה ליד האירוע בלוח
// //         eventTimeFormat={{
// //           hour: "2-digit",
// //           minute: "2-digit",
// //           meridiem: false,
// //           hour12: false,
// //         }}
// //       />

// //       {isModalOpen && (
// //         <EventFormModal
// //           selectedDate={selectedDate}
// //           onClose={() => setIsModalOpen(false)}
// //           onSave={handleSaveEvent}
// //         />
// //       )}
// //     </div>
// //   );
// // };

// // export default Diary;

// import React, { useState, useEffect, useRef } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { HDate } from "@hebcal/core";
// import { useAuth } from "../contexts/AuthContext";
// import DiaryService from "../services/diary.service";
// import EventFormModal from "../components/EventFormModal";

// const Diary = () => {
//   const { currentUser } = useAuth();
//   const calendarRef = useRef(null); // רפרנס ללוח כדי לשלוט בתצוגה
//   const [events, setEvents] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState("create"); // 'create' או 'view'
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedEvent, setSelectedEvent] = useState(null);

//   // טעינת אירועים
//   const loadEvents = async () => {
//     if (!currentUser) return;
//     try {
//       const token = await currentUser.getIdToken();
//       const data = await DiaryService.getEvents(token);
//       const formatted = data.map((ev) => ({
//         id: ev.id,
//         title: ev.title,
//         start: ev.start,
//         end: ev.end,
//         backgroundColor:
//           ev.type === "appointment"
//             ? "#3498db"
//             : ev.type === "availability"
//               ? "#2ecc71"
//               : "#95a5a6",
//         extendedProps: { ...ev },
//       }));
//       setEvents(formatted);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useEffect(() => {
//     loadEvents();
//   }, [currentUser]);

//   // לחיצה על "יום" בתצוגה החודשית - מעבר לתצוגה יומית
//   const handleNavDayClick = (date) => {
//     const calendarApi = calendarRef.current.getApi();
//     calendarApi.changeView("timeGridDay", date);
//   };

//   // לחיצה על שעה ריקה (בתצוגה יומית/שבועית)
//   const handleDateClick = (arg) => {
//     setSelectedDate(arg.dateStr.split("T")[0]); // לוקחים רק את התאריך
//     setSelectedEvent(null);
//     setModalMode("create");
//     setIsModalOpen(true);
//   };

//   // לחיצה על אירוע קיים - צפייה ומחיקה
//   const handleEventClick = (info) => {
//     setSelectedEvent(info.event.extendedProps);
//     setModalMode("view");
//     setIsModalOpen(true);
//   };

//   const handleDeleteEvent = async (eventId) => {
//     if (window.confirm("האם את/ה בטוח/ה שברצונך למחוק את האירוע?")) {
//       try {
//         const token = await currentUser.getIdToken();
//         await DiaryService.deleteEvent(eventId, token); // צריך להוסיף לסרוויס
//         setIsModalOpen(false);
//         loadEvents();
//       } catch (e) {
//         alert("שגיאה במחיקה");
//       }
//     }
//   };

//   const renderHebrewDate = (dateArg) => {
//     const hDate = new HDate(dateArg.date);
//     return hDate.renderGematriya().split("ת")[0].trim();
//   };

//   return (
//     <div
//       className="diary-container"
//       style={{ padding: "20px", direction: "rtl" }}
//     >
//       <style>{`
//         .fc-col-header-cell-cushion, .fc-daygrid-day-number { color: #1a1a1a !important; font-weight: 800 !important; font-size: 1.1em !important; }
//         .hebrew-date-display { color: #d35400 !important; font-size: 0.85em; font-weight: 600; }
//         .fc-nav-link { color: inherit !important; text-decoration: none !important; }
//       `}</style>

//       <FullCalendar
//         ref={calendarRef}
//         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         headerToolbar={{
//           right: "prev,next today",
//           center: "title",
//           left: "dayGridMonth,timeGridWeek,timeGridDay",
//         }}
//         navLinks={true} // מאפשר לחיצה על מספר היום למעבר לתצוגה יומית
//         navLinkDayClick={handleNavDayClick}
//         locale="he"
//         direction="rtl"
//         events={events}
//         dateClick={handleDateClick}
//         eventClick={handleEventClick}
//         dayCellContent={(arg) => (
//           <div className="custom-cell">
//             <div className="fc-daygrid-day-number">{arg.dayNumberText}</div>
//             <div className="hebrew-date-display">{renderHebrewDate(arg)}</div>
//           </div>
//         )}
//       />

//       {isModalOpen && (
//         <EventFormModal
//           mode={modalMode}
//           selectedDate={selectedDate}
//           eventData={selectedEvent}
//           onClose={() => setIsModalOpen(false)}
//           onSave={loadEvents}
//           onDelete={handleDeleteEvent}
//         />
//       )}
//     </div>
//   );
// };

// export default Diary;

import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { HDate } from "@hebcal/core";
import { useAuth } from "../contexts/AuthContext";
import DiaryService from "../services/diary.service";
import EventFormModal from "../components/EventFormModal";

const Diary = () => {
  const { currentUser } = useAuth();
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' או 'view'
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // פונקציית טעינת אירועים - מוודאת שכל שדה עובר המרה נכונה ללוח
  const loadEvents = async () => {
    if (!currentUser) return;
    try {
      const token = await currentUser.getIdToken();
      const data = await DiaryService.getEvents(token);

      const formatted = data.map((ev) => ({
        id: ev.id,
        title: ev.title,
        start: ev.start, // חייב להיות בפורמט ISO: YYYY-MM-DDTHH:mm
        end: ev.end,
        backgroundColor:
          ev.type === "appointment"
            ? "#3498db"
            : ev.type === "availability"
              ? "#2ecc71"
              : "#95a5a6",
        extendedProps: { ...ev }, // שומר את כל המידע המקורי לצפייה
      }));
      setEvents(formatted);
    } catch (e) {
      console.error("שגיאה בטעינת אירועים:", e);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [currentUser]);

  // 1. לחיצה על ריבוע של תאריך (בכל תצוגה)
  const handleDateClick = (arg) => {
    const calendarApi = calendarRef.current.getApi();

    // אם אנחנו בתצוגת חודש - לחיצה על הריבוע רק מעבירה לתצוגת יום
    if (calendarApi.view.type === "dayGridMonth") {
      calendarApi.changeView("timeGridDay", arg.date);
    }
    // אם אנחנו כבר בתצוגת יום או שבוע - לחיצה פותחת את המודל להוספה
    else {
      setSelectedDate(arg.dateStr);
      setSelectedEvent(null);
      setModalMode("create");
      setIsModalOpen(true);
    }
  };

  // 2. לחיצה על אירוע קיים - מציג מידע
  const handleEventClick = (info) => {
    // מונע מהלחיצה על האירוע להפעיל גם את הלחיצה על התאריך שמתחתיו
    info.jsEvent.stopPropagation();

    setSelectedEvent(info.event.extendedProps);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const renderHebrewDate = (dateArg) => {
    const hDate = new HDate(dateArg.date);
    return hDate.renderGematriya().split("ת")[0].trim();
  };

  return (
    <div
      className="diary-container"
      style={{ padding: "20px", direction: "rtl" }}
    >
      <style>{`
        /* עיצוב התאריכים שיהיו בולטים */
        .fc-daygrid-day-number { 
          color: #2c3e50 !important; 
          font-weight: 900 !important; 
          font-size: 1.2em !important;
          padding: 5px !important;
        }
        .hebrew-date-display { 
          color: #e67e22 !important; 
          font-weight: bold; 
          font-size: 0.9em;
        }
        .fc-col-header-cell-cushion { 
          color: #34495e !important; 
          font-size: 1.1em !important;
        }
        /* הדגשת היום הנוכחי */
        .fc-day-today { background-color: #fdf2e9 !important; }
      `}</style>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          right: "prev,next today",
          center: "title",
          left: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        locale="he"
        direction="rtl"
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        // הגדרות תצוגה
        navLinks={true} // לחיצה על מספר היום עוברת ליום
        dayMaxEvents={true} // "עוד X אירועים" במקום רשימה ארוכה בחודש
        dayCellContent={(arg) => (
          <div className="custom-cell">
            <div className="fc-daygrid-day-number">{arg.dayNumberText}</div>
            <div className="hebrew-date-display">{renderHebrewDate(arg)}</div>
          </div>
        )}
      />

      {isModalOpen && (
        <EventFormModal
          mode={modalMode} // 'create' או 'view'
          selectedDate={selectedDate}
          eventData={selectedEvent}
          onClose={() => setIsModalOpen(false)}
          onSave={loadEvents} // מרענן את הלוח אחרי שמירה
        />
      )}
    </div>
  );
};

export default Diary;
