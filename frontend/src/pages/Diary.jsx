// // // // // // // // import React, { useState, useEffect } from "react";
// // // // // // // // import FullCalendar from "@fullcalendar/react";
// // // // // // // // import dayGridPlugin from "@fullcalendar/daygrid";
// // // // // // // // import timeGridPlugin from "@fullcalendar/timegrid";
// // // // // // // // import interactionPlugin from "@fullcalendar/interaction";
// // // // // // // // import { HDate } from "@hebcal/core";
// // // // // // // // import { useAuth } from "../contexts/AuthContext";
// // // // // // // // // import { AuthContext } from "../contexts/AuthContext";
// // // // // // // // import DiaryService from "../services/diary.service";
// // // // // // // // import EventFormModal from "../components/EventFormModal";

// // // // // // // // const Diary = () => {
// // // // // // // //   const { currentUser } = useAuth();
// // // // // // // //   const [events, setEvents] = useState([]);
// // // // // // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // // // // // //   const [selectedDate, setSelectedDate] = useState(null);

// // // // // // // //   // 1. טעינת אירועים מהשרת כשהקומפוננטה עולה
// // // // // // // //   useEffect(() => {
// // // // // // // //     const fetchEvents = async () => {
// // // // // // // //       if (currentUser) {
// // // // // // // //         // עדכון כאן
// // // // // // // //         try {
// // // // // // // //           const token = await currentUser.getIdToken(); // עדכון כאן
// // // // // // // //           const data = await DiaryService.getEvents(token);
// // // // // // // //           setEvents(data);
// // // // // // // //         } catch (error) {
// // // // // // // //           console.error("Failed to fetch events:", error);
// // // // // // // //         }
// // // // // // // //       }
// // // // // // // //     };
// // // // // // // //     fetchEvents();
// // // // // // // //   }, [currentUser]); // עדכון כאן

// // // // // // // //   // 2. פתיחת המודל בעת לחיצה על תאריך
// // // // // // // //   const handleDateClick = (arg) => {
// // // // // // // //     setSelectedDate(arg.dateStr);
// // // // // // // //     setIsModalOpen(true);
// // // // // // // //   };

// // // // // // // //   const handleSaveEvent = async (formData) => {
// // // // // // // //     console.log("1. handleSaveEvent started", formData); // בדיקה שהפונקציה התחילה
// // // // // // // //     try {
// // // // // // // //       if (!currentUser) {
// // // // // // // //         throw new Error("User context is missing");
// // // // // // // //       }

// // // // // // // //       console.log("2. Fetching Token...");
// // // // // // // //       const token = await currentUser.getIdToken();
// // // // // // // //       console.log("3. Token received, calling Service...");

// // // // // // // //       const response = await DiaryService.saveEvent(formData, token);
// // // // // // // //       console.log("4. Service response:", response);

// // // // // // // //       if (response && response.id) {
// // // // // // // //         const newEvent = {
// // // // // // // //           id: response.id,
// // // // // // // //           title: formData.title,
// // // // // // // //           start: `${formData.date}T${formData.startTime}`,
// // // // // // // //           end: `${formData.date}T${formData.endTime}`,
// // // // // // // //           extendedProps: { ...formData },
// // // // // // // //         };
// // // // // // // //         setEvents([...events, newEvent]);
// // // // // // // //         setIsModalOpen(false);
// // // // // // // //         alert("האירוע נשמר בהצלחה!");
// // // // // // // //       }
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error("FULL ERROR DETAILS:", error); // הדפסת השגיאה המלאה ל-Console
// // // // // // // //       alert("שגיאה בשמירת האירוע: " + error.message);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const renderHebrewDate = (dateArg) => {
// // // // // // // //     const hDate = new HDate(dateArg.date);
// // // // // // // //     return hDate.renderGematriya().split("ת")[0].trim();
// // // // // // // //   };

// // // // // // // //   return (
// // // // // // // //     <div
// // // // // // // //       className="diary-page-container"
// // // // // // // //       style={{ padding: "20px", direction: "rtl" }}
// // // // // // // //     >
// // // // // // // //       {/* עיצובים (אותם עיצובים מהשלב הקודם) */}
// // // // // // // //       <style>{`
// // // // // // // //         .fc-col-header-cell-cushion { color: #2c3e50 !important; font-weight: 800 !important; }
// // // // // // // //         .fc-daygrid-day-number { color: #1a1a1a !important; font-weight: 800 !important; }
// // // // // // // //         .hebrew-date-display { color: #d35400 !important; font-size: 0.85em; font-weight: 600; }
// // // // // // // //         .custom-cell-content { display: flex; flex-direction: column; align-items: center; width: 100%; }
// // // // // // // //       `}</style>

// // // // // // // //       <h1>יומן עבודה</h1>

// // // // // // // //       <FullCalendar
// // // // // // // //         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
// // // // // // // //         initialView="dayGridMonth"
// // // // // // // //         locale="he"
// // // // // // // //         direction="rtl"
// // // // // // // //         events={events}
// // // // // // // //         dateClick={handleDateClick}
// // // // // // // //         dayCellContent={(arg) => (
// // // // // // // //           <div className="custom-cell-content">
// // // // // // // //             <div className="fc-daygrid-day-number">{arg.dayNumberText}</div>
// // // // // // // //             <div className="hebrew-date-display">{renderHebrewDate(arg)}</div>
// // // // // // // //           </div>
// // // // // // // //         )}
// // // // // // // //       />

// // // // // // // //       {/* הצגת המודל רק כשהוא פתוח */}
// // // // // // // //       {isModalOpen && (
// // // // // // // //         <EventFormModal
// // // // // // // //           selectedDate={selectedDate}
// // // // // // // //           onClose={() => setIsModalOpen(false)}
// // // // // // // //           onSave={handleSaveEvent}
// // // // // // // //         />
// // // // // // // //       )}
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default Diary;
// // // // // // // import React, { useState, useEffect } from "react";
// // // // // // // import FullCalendar from "@fullcalendar/react";
// // // // // // // import dayGridPlugin from "@fullcalendar/daygrid";
// // // // // // // import timeGridPlugin from "@fullcalendar/timegrid"; // תצוגת זמנים (שבוע/יום)
// // // // // // // import interactionPlugin from "@fullcalendar/interaction";
// // // // // // // import { HDate } from "@hebcal/core";
// // // // // // // import { useAuth } from "../contexts/AuthContext";
// // // // // // // import DiaryService from "../services/diary.service";
// // // // // // // import EventFormModal from "../components/EventFormModal";

// // // // // // // const Diary = () => {
// // // // // // //   const { currentUser } = useAuth();
// // // // // // //   const [events, setEvents] = useState([]);
// // // // // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // // // // //   const [selectedDate, setSelectedDate] = useState(null);

// // // // // // //   useEffect(() => {
// // // // // // //     const fetchEvents = async () => {
// // // // // // //       if (currentUser) {
// // // // // // //         try {
// // // // // // //           const token = await currentUser.getIdToken();
// // // // // // //           const data = await DiaryService.getEvents(token);

// // // // // // //           // עיבוד האירועים שחוזרים מהשרת כדי שיוצגו נכון עם צבעים
// // // // // // //           const formattedEvents = data.map((ev) => ({
// // // // // // //             ...ev,
// // // // // // //             // הגדרת צבעים לפי סוג האירוע
// // // // // // //             backgroundColor:
// // // // // // //               ev.type === "appointment"
// // // // // // //                 ? "#3498db" // כחול לפגישה
// // // // // // //                 : ev.type === "availability"
// // // // // // //                   ? "#2ecc71" // ירוק לזמינות
// // // // // // //                   : "#95a5a6", // אפור להערה
// // // // // // //             borderColor: "transparent",
// // // // // // //           }));

// // // // // // //           setEvents(formattedEvents);
// // // // // // //         } catch (error) {
// // // // // // //           console.error("Failed to fetch events:", error);
// // // // // // //         }
// // // // // // //       }
// // // // // // //     };
// // // // // // //     fetchEvents();
// // // // // // //   }, [currentUser]);

// // // // // // //   const handleDateClick = (arg) => {
// // // // // // //     setSelectedDate(arg.dateStr);
// // // // // // //     setIsModalOpen(true);
// // // // // // //   };

// // // // // // //   const handleSaveEvent = async (formData) => {
// // // // // // //     try {
// // // // // // //       if (!currentUser) throw new Error("User context is missing");
// // // // // // //       const token = await currentUser.getIdToken();
// // // // // // //       const response = await DiaryService.saveEvent(formData, token);

// // // // // // //       if (response && response.id) {
// // // // // // //         const newEvent = {
// // // // // // //           id: response.id,
// // // // // // //           title: formData.title,
// // // // // // //           start: `${formData.date}T${formData.startTime}`,
// // // // // // //           end: `${formData.date}T${formData.endTime}`,
// // // // // // //           type: formData.type,
// // // // // // //           backgroundColor:
// // // // // // //             formData.type === "appointment"
// // // // // // //               ? "#3498db"
// // // // // // //               : formData.type === "availability"
// // // // // // //                 ? "#2ecc71"
// // // // // // //                 : "#95a5a6",
// // // // // // //         };
// // // // // // //         setEvents([...events, newEvent]);
// // // // // // //         setIsModalOpen(false);
// // // // // // //       }
// // // // // // //     } catch (error) {
// // // // // // //       alert("שגיאה בשמירת האירוע: " + error.message);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const renderHebrewDate = (dateArg) => {
// // // // // // //     const hDate = new HDate(dateArg.date);
// // // // // // //     return hDate.renderGematriya().split("ת")[0].trim();
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <div
// // // // // // //       className="diary-page-container"
// // // // // // //       style={{ padding: "20px", direction: "rtl" }}
// // // // // // //     >
// // // // // // //       <style>{`
// // // // // // //         .fc-col-header-cell-cushion { color: #2c3e50 !important; font-weight: 800 !important; }
// // // // // // //         .fc-daygrid-day-number { color: #1a1a1a !important; font-weight: 800 !important; }
// // // // // // //         .hebrew-date-display { color: #d35400 !important; font-size: 0.85em; font-weight: 600; }
// // // // // // //         .custom-cell-content { display: flex; flex-direction: column; align-items: center; width: 100% }

// // // // // // //         /* עיצוב האירועים בלוח */
// // // // // // //         .fc-event {
// // // // // // //           cursor: pointer;
// // // // // // //           padding: 2px 5px;
// // // // // // //           font-size: 0.9em;
// // // // // // //           border-radius: 4px;
// // // // // // //         }
// // // // // // //       `}</style>

// // // // // // //       <h1>יומן עבודה</h1>

// // // // // // //       <FullCalendar
// // // // // // //         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
// // // // // // //         initialView="dayGridMonth"
// // // // // // //         // הגדרת סרגל הכלים העליון
// // // // // // //         headerToolbar={{
// // // // // // //           right: "prev,next today",
// // // // // // //           center: "title",
// // // // // // //           left: "dayGridMonth,timeGridWeek,timeGridDay", // כפתורי המעבר
// // // // // // //         }}
// // // // // // //         locale="he"
// // // // // // //         direction="rtl"
// // // // // // //         events={events}
// // // // // // //         dateClick={handleDateClick}
// // // // // // //         slotMinTime="07:00:00" // שעת התחלה ביומן יומי
// // // // // // //         slotMaxTime="21:00:00" // שעת סיום ביומן יומי
// // // // // // //         allDaySlot={false} // ביטול שורת "כל היום" בתצוגת שבוע/יום
// // // // // // //         dayCellContent={(arg) => (
// // // // // // //           <div className="custom-cell-content">
// // // // // // //             <div className="fc-daygrid-day-number">{arg.dayNumberText}</div>
// // // // // // //             <div className="hebrew-date-display">{renderHebrewDate(arg)}</div>
// // // // // // //           </div>
// // // // // // //         )}
// // // // // // //         // הצגת שעה ליד האירוע בלוח
// // // // // // //         eventTimeFormat={{
// // // // // // //           hour: "2-digit",
// // // // // // //           minute: "2-digit",
// // // // // // //           meridiem: false,
// // // // // // //           hour12: false,
// // // // // // //         }}
// // // // // // //       />

// // // // // // //       {isModalOpen && (
// // // // // // //         <EventFormModal
// // // // // // //           selectedDate={selectedDate}
// // // // // // //           onClose={() => setIsModalOpen(false)}
// // // // // // //           onSave={handleSaveEvent}
// // // // // // //         />
// // // // // // //       )}
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default Diary;

// // // // // // import React, { useState, useEffect, useRef } from "react";
// // // // // // import FullCalendar from "@fullcalendar/react";
// // // // // // import dayGridPlugin from "@fullcalendar/daygrid";
// // // // // // import timeGridPlugin from "@fullcalendar/timegrid";
// // // // // // import interactionPlugin from "@fullcalendar/interaction";
// // // // // // import { HDate } from "@hebcal/core";
// // // // // // import { useAuth } from "../contexts/AuthContext";
// // // // // // import DiaryService from "../services/diary.service";
// // // // // // import EventFormModal from "../components/EventFormModal";

// // // // // // const Diary = () => {
// // // // // //   const { currentUser } = useAuth();
// // // // // //   const calendarRef = useRef(null); // רפרנס ללוח כדי לשלוט בתצוגה
// // // // // //   const [events, setEvents] = useState([]);
// // // // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // // // //   const [modalMode, setModalMode] = useState("create"); // 'create' או 'view'
// // // // // //   const [selectedDate, setSelectedDate] = useState(null);
// // // // // //   const [selectedEvent, setSelectedEvent] = useState(null);

// // // // // //   // טעינת אירועים
// // // // // //   const loadEvents = async () => {
// // // // // //     if (!currentUser) return;
// // // // // //     try {
// // // // // //       const token = await currentUser.getIdToken();
// // // // // //       const data = await DiaryService.getEvents(token);
// // // // // //       const formatted = data.map((ev) => ({
// // // // // //         id: ev.id,
// // // // // //         title: ev.title,
// // // // // //         start: ev.start,
// // // // // //         end: ev.end,
// // // // // //         backgroundColor:
// // // // // //           ev.type === "appointment"
// // // // // //             ? "#3498db"
// // // // // //             : ev.type === "availability"
// // // // // //               ? "#2ecc71"
// // // // // //               : "#95a5a6",
// // // // // //         extendedProps: { ...ev },
// // // // // //       }));
// // // // // //       setEvents(formatted);
// // // // // //     } catch (e) {
// // // // // //       console.error(e);
// // // // // //     }
// // // // // //   };

// // // // // //   useEffect(() => {
// // // // // //     loadEvents();
// // // // // //   }, [currentUser]);

// // // // // //   // לחיצה על "יום" בתצוגה החודשית - מעבר לתצוגה יומית
// // // // // //   const handleNavDayClick = (date) => {
// // // // // //     const calendarApi = calendarRef.current.getApi();
// // // // // //     calendarApi.changeView("timeGridDay", date);
// // // // // //   };

// // // // // //   // לחיצה על שעה ריקה (בתצוגה יומית/שבועית)
// // // // // //   const handleDateClick = (arg) => {
// // // // // //     setSelectedDate(arg.dateStr.split("T")[0]); // לוקחים רק את התאריך
// // // // // //     setSelectedEvent(null);
// // // // // //     setModalMode("create");
// // // // // //     setIsModalOpen(true);
// // // // // //   };

// // // // // //   // לחיצה על אירוע קיים - צפייה ומחיקה
// // // // // //   const handleEventClick = (info) => {
// // // // // //     setSelectedEvent(info.event.extendedProps);
// // // // // //     setModalMode("view");
// // // // // //     setIsModalOpen(true);
// // // // // //   };

// // // // // //   const handleDeleteEvent = async (eventId) => {
// // // // // //     if (window.confirm("האם את/ה בטוח/ה שברצונך למחוק את האירוע?")) {
// // // // // //       try {
// // // // // //         const token = await currentUser.getIdToken();
// // // // // //         await DiaryService.deleteEvent(eventId, token); // צריך להוסיף לסרוויס
// // // // // //         setIsModalOpen(false);
// // // // // //         loadEvents();
// // // // // //       } catch (e) {
// // // // // //         alert("שגיאה במחיקה");
// // // // // //       }
// // // // // //     }
// // // // // //   };

// // // // // //   const renderHebrewDate = (dateArg) => {
// // // // // //     const hDate = new HDate(dateArg.date);
// // // // // //     return hDate.renderGematriya().split("ת")[0].trim();
// // // // // //   };

// // // // // //   return (
// // // // // //     <div
// // // // // //       className="diary-container"
// // // // // //       style={{ padding: "20px", direction: "rtl" }}
// // // // // //     >
// // // // // //       <style>{`
// // // // // //         .fc-col-header-cell-cushion, .fc-daygrid-day-number { color: #1a1a1a !important; font-weight: 800 !important; font-size: 1.1em !important; }
// // // // // //         .hebrew-date-display { color: #d35400 !important; font-size: 0.85em; font-weight: 600; }
// // // // // //         .fc-nav-link { color: inherit !important; text-decoration: none !important; }
// // // // // //       `}</style>

// // // // // //       <FullCalendar
// // // // // //         ref={calendarRef}
// // // // // //         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
// // // // // //         initialView="dayGridMonth"
// // // // // //         headerToolbar={{
// // // // // //           right: "prev,next today",
// // // // // //           center: "title",
// // // // // //           left: "dayGridMonth,timeGridWeek,timeGridDay",
// // // // // //         }}
// // // // // //         navLinks={true} // מאפשר לחיצה על מספר היום למעבר לתצוגה יומית
// // // // // //         navLinkDayClick={handleNavDayClick}
// // // // // //         locale="he"
// // // // // //         direction="rtl"
// // // // // //         events={events}
// // // // // //         dateClick={handleDateClick}
// // // // // //         eventClick={handleEventClick}
// // // // // //         dayCellContent={(arg) => (
// // // // // //           <div className="custom-cell">
// // // // // //             <div className="fc-daygrid-day-number">{arg.dayNumberText}</div>
// // // // // //             <div className="hebrew-date-display">{renderHebrewDate(arg)}</div>
// // // // // //           </div>
// // // // // //         )}
// // // // // //       />

// // // // // //       {isModalOpen && (
// // // // // //         <EventFormModal
// // // // // //           mode={modalMode}
// // // // // //           selectedDate={selectedDate}
// // // // // //           eventData={selectedEvent}
// // // // // //           onClose={() => setIsModalOpen(false)}
// // // // // //           onSave={loadEvents}
// // // // // //           onDelete={handleDeleteEvent}
// // // // // //         />
// // // // // //       )}
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default Diary;

// // // // // import React, { useState, useEffect, useRef } from "react";
// // // // // import FullCalendar from "@fullcalendar/react";
// // // // // import dayGridPlugin from "@fullcalendar/daygrid";
// // // // // import timeGridPlugin from "@fullcalendar/timegrid";
// // // // // import interactionPlugin from "@fullcalendar/interaction";
// // // // // import { HDate } from "@hebcal/core";
// // // // // import { useAuth } from "../contexts/AuthContext";
// // // // // import DiaryService from "../services/diary.service";
// // // // // import EventFormModal from "../components/EventFormModal";

// // // // // const Diary = () => {
// // // // //   const { currentUser } = useAuth();
// // // // //   const calendarRef = useRef(null);
// // // // //   const [events, setEvents] = useState([]);
// // // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // // //   const [modalMode, setModalMode] = useState("create"); // 'create' או 'view'
// // // // //   const [selectedDate, setSelectedDate] = useState(null);
// // // // //   const [selectedEvent, setSelectedEvent] = useState(null);

// // // // //   // פונקציית טעינת אירועים - מוודאת שכל שדה עובר המרה נכונה ללוח
// // // // //   const loadEvents = async () => {
// // // // //     if (!currentUser) return;
// // // // //     try {
// // // // //       const token = await currentUser.getIdToken();
// // // // //       const data = await DiaryService.getEvents(token);

// // // // //       const formatted = data.map((ev) => ({
// // // // //         id: ev.id,
// // // // //         title: ev.title,
// // // // //         start: ev.start, // חייב להיות בפורמט ISO: YYYY-MM-DDTHH:mm
// // // // //         end: ev.end,
// // // // //         backgroundColor:
// // // // //           ev.type === "appointment"
// // // // //             ? "#3498db"
// // // // //             : ev.type === "availability"
// // // // //               ? "#2ecc71"
// // // // //               : "#95a5a6",
// // // // //         extendedProps: { ...ev }, // שומר את כל המידע המקורי לצפייה
// // // // //       }));
// // // // //       setEvents(formatted);
// // // // //     } catch (e) {
// // // // //       console.error("שגיאה בטעינת אירועים:", e);
// // // // //     }
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     loadEvents();
// // // // //   }, [currentUser]);

// // // // //   // 1. לחיצה על ריבוע של תאריך (בכל תצוגה)
// // // // //   const handleDateClick = (arg) => {
// // // // //     const calendarApi = calendarRef.current.getApi();

// // // // //     // אם אנחנו בתצוגת חודש - לחיצה על הריבוע רק מעבירה לתצוגת יום
// // // // //     if (calendarApi.view.type === "dayGridMonth") {
// // // // //       calendarApi.changeView("timeGridDay", arg.date);
// // // // //     }
// // // // //     // אם אנחנו כבר בתצוגת יום או שבוע - לחיצה פותחת את המודל להוספה
// // // // //     else {
// // // // //       setSelectedDate(arg.dateStr);
// // // // //       setSelectedEvent(null);
// // // // //       setModalMode("create");
// // // // //       setIsModalOpen(true);
// // // // //     }
// // // // //   };

// // // // //   // 2. לחיצה על אירוע קיים - מציג מידע
// // // // //   const handleEventClick = (info) => {
// // // // //     // מונע מהלחיצה על האירוע להפעיל גם את הלחיצה על התאריך שמתחתיו
// // // // //     info.jsEvent.stopPropagation();

// // // // //     setSelectedEvent(info.event.extendedProps);
// // // // //     setModalMode("view");
// // // // //     setIsModalOpen(true);
// // // // //   };

// // // // //   const renderHebrewDate = (dateArg) => {
// // // // //     const hDate = new HDate(dateArg.date);
// // // // //     return hDate.renderGematriya().split("ת")[0].trim();
// // // // //   };

// // // // //   return (
// // // // //     <div
// // // // //       className="diary-container"
// // // // //       style={{ padding: "20px", direction: "rtl" }}
// // // // //     >
// // // // //       <style>{`
// // // // //         /* עיצוב התאריכים שיהיו בולטים */
// // // // //         .fc-daygrid-day-number { 
// // // // //           color: #2c3e50 !important; 
// // // // //           font-weight: 900 !important; 
// // // // //           font-size: 1.2em !important;
// // // // //           padding: 5px !important;
// // // // //         }
// // // // //         .hebrew-date-display { 
// // // // //           color: #e67e22 !important; 
// // // // //           font-weight: bold; 
// // // // //           font-size: 0.9em;
// // // // //         }
// // // // //         .fc-col-header-cell-cushion { 
// // // // //           color: #34495e !important; 
// // // // //           font-size: 1.1em !important;
// // // // //         }
// // // // //         /* הדגשת היום הנוכחי */
// // // // //         .fc-day-today { background-color: #fdf2e9 !important; }
// // // // //       `}</style>

// // // // //       <FullCalendar
// // // // //         ref={calendarRef}
// // // // //         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
// // // // //         initialView="dayGridMonth"
// // // // //         headerToolbar={{
// // // // //           right: "prev,next today",
// // // // //           center: "title",
// // // // //           left: "dayGridMonth,timeGridWeek,timeGridDay",
// // // // //         }}
// // // // //         locale="he"
// // // // //         direction="rtl"
// // // // //         events={events}
// // // // //         dateClick={handleDateClick}
// // // // //         eventClick={handleEventClick}
// // // // //         // הגדרות תצוגה
// // // // //         navLinks={true} // לחיצה על מספר היום עוברת ליום
// // // // //         dayMaxEvents={true} // "עוד X אירועים" במקום רשימה ארוכה בחודש
// // // // //         dayCellContent={(arg) => (
// // // // //           <div className="custom-cell">
// // // // //             <div className="fc-daygrid-day-number">{arg.dayNumberText}</div>
// // // // //             <div className="hebrew-date-display">{renderHebrewDate(arg)}</div>
// // // // //           </div>
// // // // //         )}
// // // // //       />

// // // // //       {isModalOpen && (
// // // // //         <EventFormModal
// // // // //           mode={modalMode} // 'create' או 'view'
// // // // //           selectedDate={selectedDate}
// // // // //           eventData={selectedEvent}
// // // // //           onClose={() => setIsModalOpen(false)}
// // // // //           onSave={loadEvents} // מרענן את הלוח אחרי שמירה
// // // // //         />
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default Diary;

// // // // // frontend/src/pages/Diary.jsx
// // // // import React, { useState, useEffect, useRef } from "react";
// // // // import FullCalendar from "@fullcalendar/react";
// // // // import dayGridPlugin from "@fullcalendar/daygrid";
// // // // import timeGridPlugin from "@fullcalendar/timegrid";
// // // // import interactionPlugin from "@fullcalendar/interaction";
// // // // import { HDate } from "@hebcal/core";
// // // // import { useAuth } from "../contexts/AuthContext";
// // // // import DiaryService from "../services/diary.service";
// // // // import EventFormModal from "../components/EventFormModal";

// // // // const TYPE_COLORS = {
// // // //   appointment: "#3498db", // כחול
// // // //   availability: "#2ecc71", // ירוק
// // // //   note: "#9b59b6", // סגול
// // // // };

// // // // const Diary = () => {
// // // //   const { currentUser } = useAuth();
// // // //   const calendarRef = useRef(null);
// // // //   const [events, setEvents] = useState([]);
// // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // //   const [modalMode, setModalMode] = useState("create");
// // // //   const [selectedDate, setSelectedDate] = useState(null);
// // // //   const [selectedEvent, setSelectedEvent] = useState(null);

// // // //   // טעינת אירועים
// // // //   const loadEvents = async () => {
// // // //     if (!currentUser) return;
// // // //     try {
// // // //       const token = await currentUser.getIdToken();
// // // //       const data = await DiaryService.getEvents(token);

// // // //       const formatted = data.map((ev) => ({
// // // //         id: ev.id,
// // // //         title: ev.title,
// // // //         start: ev.start,
// // // //         end: ev.end,
// // // //         backgroundColor: TYPE_COLORS[ev.type] || "#95a5a6",
// // // //         borderColor: TYPE_COLORS[ev.type] || "#95a5a6",
// // // //         extendedProps: { ...ev },
// // // //       }));
// // // //       setEvents(formatted);
// // // //     } catch (e) {
// // // //       console.error("שגיאה בטעינת אירועים:", e);
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     loadEvents();
// // // //   }, [currentUser]);

// // // //   // לחיצה על תאריך
// // // //   const handleDateClick = (arg) => {
// // // //     const calendarApi = calendarRef.current.getApi();

// // // //     if (calendarApi.view.type === "dayGridMonth") {
// // // //       // בתצוגת חודש - מעבר ליום
// // // //       calendarApi.changeView("timeGridDay", arg.date);
// // // //     } else {
// // // //       // בתצוגת יום/שבוע - פתיחת מודל
// // // //       setSelectedDate(arg.dateStr);
// // // //       setSelectedEvent(null);
// // // //       setModalMode("create");
// // // //       setIsModalOpen(true);
// // // //     }
// // // //   };

// // // //   // לחיצה על אירוע קיים - צפייה
// // // //   const handleEventClick = (info) => {
// // // //     info.jsEvent.stopPropagation();
// // // //     setSelectedEvent({ id: info.event.id, ...info.event.extendedProps });
// // // //     setModalMode("view");
// // // //     setIsModalOpen(true);
// // // //   };

// // // //   const renderHebrewDate = (dateArg) => {
// // // //     try {
// // // //       const hDate = new HDate(dateArg.date);
// // // //       return hDate.renderGematriya().split("ת")[0].trim();
// // // //     } catch {
// // // //       return "";
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div
// // // //       className="diary-container"
// // // //       style={{ padding: "20px", direction: "rtl", background: "#F8FAFC", minHeight: "100vh" }}
// // // //     >
// // // //       <style>{`
// // // //         .fc-daygrid-day-number { 
// // // //           color: #2c3e50 !important; 
// // // //           font-weight: 900 !important; 
// // // //           font-size: 1.2em !important;
// // // //           padding: 5px !important;
// // // //         }
// // // //         .hebrew-date-display { 
// // // //           color: #e67e22 !important; 
// // // //           font-weight: bold; 
// // // //           font-size: 0.9em;
// // // //         }
// // // //         .fc-col-header-cell-cushion { 
// // // //           color: #34495e !important; 
// // // //           font-size: 1.1em !important;
// // // //         }
// // // //         .fc-day-today { background-color: #fdf2e9 !important; }
// // // //         .fc-event { cursor: pointer; }
// // // //       `}</style>

// // // //       {/* Legend - מקרא צבעים */}
// // // //       <div
// // // //         style={{
// // // //           display: "flex",
// // // //           gap: "20px",
// // // //           marginBottom: "15px",
// // // //           padding: "12px 20px",
// // // //           background: "white",
// // // //           borderRadius: "12px",
// // // //           boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
// // // //         }}
// // // //       >
// // // //         <LegendItem color={TYPE_COLORS.appointment} label="👤 אבחון" />
// // // //         <LegendItem color={TYPE_COLORS.availability} label="🕒 זמינות" />
// // // //         <LegendItem color={TYPE_COLORS.note} label="📝 הערה" />
// // // //       </div>

// // // //       <FullCalendar
// // // //         ref={calendarRef}
// // // //         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
// // // //         initialView="dayGridMonth"
// // // //         headerToolbar={{
// // // //           right: "prev,next today",
// // // //           center: "title",
// // // //           left: "dayGridMonth,timeGridWeek,timeGridDay",
// // // //         }}
// // // //         locale="he"
// // // //         direction="rtl"
// // // //         events={events}
// // // //         dateClick={handleDateClick}
// // // //         eventClick={handleEventClick}
// // // //         navLinks={true}
// // // //         dayMaxEvents={true}
// // // //         slotMinTime="07:00:00"
// // // //         slotMaxTime="22:00:00"
// // // //         allDaySlot={false}
// // // //         dayCellContent={(arg) => (
// // // //           <div className="custom-cell">
// // // //             <div className="fc-daygrid-day-number">{arg.dayNumberText}</div>
// // // //             <div className="hebrew-date-display">{renderHebrewDate(arg)}</div>
// // // //           </div>
// // // //         )}
// // // //         buttonText={{
// // // //           today: "היום",
// // // //           month: "חודש",
// // // //           week: "שבוע",
// // // //           day: "יום",
// // // //         }}
// // // //       />

// // // //       {isModalOpen && (
// // // //         <EventFormModal
// // // //           mode={modalMode}
// // // //           selectedDate={selectedDate}
// // // //           eventData={selectedEvent}
// // // //           onClose={() => setIsModalOpen(false)}
// // // //           onSave={loadEvents}
// // // //         />
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // const LegendItem = ({ color, label }) => (
// // // //   <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
// // // //     <div
// // // //       style={{
// // // //         width: "14px",
// // // //         height: "14px",
// // // //         borderRadius: "4px",
// // // //         backgroundColor: color,
// // // //       }}
// // // //     />
// // // //     <span style={{ fontSize: "14px", color: "#555" }}>{label}</span>
// // // //   </div>
// // // // );

// // // // export default Diary;


// // // // frontend/src/pages/Diary.jsx
// // // import React, { useState, useEffect, useRef } from "react";
// // // import FullCalendar from "@fullcalendar/react";
// // // import dayGridPlugin from "@fullcalendar/daygrid";
// // // import timeGridPlugin from "@fullcalendar/timegrid";
// // // import interactionPlugin from "@fullcalendar/interaction";
// // // import { HDate } from "@hebcal/core";
// // // import { useAuth } from "../contexts/AuthContext";
// // // import DiaryService from "../services/diary.service";
// // // import EventFormModal from "../components/EventFormModal";

// // // // === מערכת צבעים אחידה ===
// // // const TYPE_CONFIG = {
// // //   appointment: {
// // //     color: "#3b82f6", // blue-500
// // //     label: "אבחון",
// // //     icon: "👤",
// // //     dotClass: "bg-blue-500",
// // //     bgClass: "bg-blue-50",
// // //     borderClass: "border-blue-500",
// // //   },
// // //   availability: {
// // //     color: "#10b981", // emerald-500
// // //     label: "זמינות",
// // //     icon: "🕒",
// // //     dotClass: "bg-emerald-500",
// // //     bgClass: "bg-emerald-50",
// // //     borderClass: "border-emerald-500",
// // //   },
// // //   note: {
// // //     color: "#a855f7", // purple-500
// // //     label: "הערה",
// // //     icon: "📝",
// // //     dotClass: "bg-purple-500",
// // //     bgClass: "bg-purple-50",
// // //     borderClass: "border-purple-500",
// // //   },
// // // };

// // // const Diary = () => {
// // //   const { currentUser } = useAuth();
// // //   const calendarRef = useRef(null);
// // //   const [events, setEvents] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // //   const [modalMode, setModalMode] = useState("create");
// // //   const [selectedDate, setSelectedDate] = useState(null);
// // //   const [selectedEvent, setSelectedEvent] = useState(null);

// // //   const loadEvents = async () => {
// // //     if (!currentUser) return;
// // //     try {
// // //       setLoading(true);
// // //       const token = await currentUser.getIdToken();
// // //       const data = await DiaryService.getEvents(token);

// // //       const formatted = data.map((ev) => ({
// // //         id: ev.id,
// // //         title: ev.title,
// // //         start: ev.start,
// // //         end: ev.end,
// // //         backgroundColor: "transparent",
// // //         borderColor: "transparent",
// // //         textColor: "#1e293b",
// // //         extendedProps: { ...ev },
// // //       }));
// // //       setEvents(formatted);
// // //     } catch (e) {
// // //       console.error("שגיאה בטעינת אירועים:", e);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     loadEvents();
// // //   }, [currentUser]);

// // //   const handleDateClick = (arg) => {
// // //     const calendarApi = calendarRef.current.getApi();

// // //     if (calendarApi.view.type === "dayGridMonth") {
// // //       calendarApi.changeView("timeGridDay", arg.date);
// // //     } else {
// // //       setSelectedDate(arg.dateStr);
// // //       setSelectedEvent(null);
// // //       setModalMode("create");
// // //       setIsModalOpen(true);
// // //     }
// // //   };

// // //   const handleEventClick = (info) => {
// // //     info.jsEvent.stopPropagation();
// // //     setSelectedEvent({ id: info.event.id, ...info.event.extendedProps });
// // //     setModalMode("view");
// // //     setIsModalOpen(true);
// // //   };

// // //   const renderHebrewDate = (dateArg) => {
// // //     try {
// // //       const hDate = new HDate(dateArg.date);
// // //       return hDate.renderGematriya().split("ת")[0].trim();
// // //     } catch {
// // //       return "";
// // //     }
// // //   };

// // //   // רנדור אירוע - שונה לפי תצוגה
// // //   const renderEventContent = (eventInfo) => {
// // //     const type = eventInfo.event.extendedProps.type || "note";
// // //     const config = TYPE_CONFIG[type];
// // //     const isMonthView = eventInfo.view.type === "dayGridMonth";

// // //     if (isMonthView) {
// // //       // תצוגת חודש - נקודה צבעונית + טקסט
// // //       return (
// // //         <div className="flex items-center gap-1.5 px-1 py-0.5 w-full overflow-hidden">
// // //           <span className={`w-2 h-2 rounded-full shrink-0 ${config.dotClass}`} />
// // //           <span className="text-xs font-semibold text-gray-800 truncate">
// // //             {eventInfo.event.title}
// // //           </span>
// // //         </div>
// // //       );
// // //     }

// // //     // תצוגת שבוע/יום - כרטיס מלא עם פס צבע
// // //     return (
// // //       <div
// // //         className={`flex items-start h-full overflow-hidden rounded-md border-r-4 ${config.borderClass} ${config.bgClass} px-2 py-1`}
// // //       >
// // //         <div className="flex-1 overflow-hidden">
// // //           <div className="text-sm font-bold text-gray-800 truncate">
// // //             {eventInfo.event.title}
// // //           </div>
// // //           <div className="text-[11px] text-gray-500 mt-0.5">
// // //             {eventInfo.timeText}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   };

// // //   return (
// // //     <div className="p-6 md:p-8 bg-[#F8FAFC] min-h-screen font-sans" dir="rtl">
// // //       {/* ה-CSS הזה הכרחי - אי אפשר לעצב את FullCalendar רק עם Tailwind */}
// // //       <style>{`
// // //   /* ===== מסגרת הלוח ===== */
// // //   .fc {
// // //     font-family: inherit;
// // //     font-size: 14px;
// // //   }
// // //   .fc .fc-toolbar-title { 
// // //     font-size: 1.25rem !important; 
// // //     font-weight: 700;
// // //     color: #1e293b;
// // //   }
// // //   .fc .fc-toolbar.fc-header-toolbar {
// // //     margin-bottom: 1.25rem !important;
// // //   }

// // //   /* ===== תאי תאריך - גובה קומפקטי ===== */
// // //   .fc-daygrid-day-frame {
// // //     min-height: 95px !important;
// // //     padding: 4px !important;
// // //   }
// // //   .fc-col-header-cell-cushion { 
// // //     color: #475569 !important; 
// // //     font-weight: 700 !important;
// // //     font-size: 0.9rem !important;
// // //     padding: 10px 4px !important;
// // //     text-decoration: none !important;
// // //   }
// // //   .fc-daygrid-day-number { 
// // //     color: #1e293b !important; 
// // //     font-weight: 700 !important; 
// // //     font-size: 1rem !important;
// // //     padding: 4px !important;
// // //     text-decoration: none !important;
// // //   }
// // //   .fc-daygrid-day-number:hover {
// // //     text-decoration: none !important;
// // //     color: #1e293b !important;
// // //   }
// // //   .hebrew-date-display { 
// // //     color: #f59e0b !important; 
// // //     font-weight: 700; 
// // //     font-size: 0.7rem;
// // //     padding: 0 4px;
// // //   }

// // //   /* ===== ביטול hover על תאריכים ===== */
// // //   .fc-daygrid-day:hover,
// // //   .fc-day:hover,
// // //   .fc-timegrid-slot:hover,
// // //   .fc-timegrid-col:hover,
// // //   a.fc-daygrid-day-number:hover,
// // //   a.fc-col-header-cell-cushion:hover {
// // //     background-color: inherit !important;
// // //     color: #1e293b !important;
// // //   }
// // //   .fc-highlight {
// // //     background-color: transparent !important;
// // //   }

// // //   /* ===== היום הנוכחי - עיגול כתום אחד בלבד ===== */
// // //   .fc-day-today { 
// // //     background-color: #fef3c7 !important; 
// // //   }
// // //   /* רק על אלמנט ה-<a> של מספר היום, לא על העטיפה */
// // //   .fc-day-today a.fc-daygrid-day-number {
// // //     background-color: #f59e0b;
// // //     color: white !important;
// // //     border-radius: 9999px;
// // //     width: 28px;
// // //     height: 28px;
// // //     display: inline-flex;
// // //     align-items: center;
// // //     justify-content: center;
// // //     margin: 4px;
// // //     text-decoration: none !important;
// // //   }
// // //   /* ביטול עיצוב כפול אם יש wrapper נוסף */
// // //   .fc-day-today .custom-cell .fc-daygrid-day-number:not(a) {
// // //     background-color: transparent !important;
// // //     color: #1e293b !important;
// // //     width: auto;
// // //     height: auto;
// // //     border-radius: 0;
// // //     margin: 0;
// // //   }

// // //   /* ===== אירועים בחודש ===== */
// // //   .fc-daygrid-event {
// // //     background-color: transparent !important;
// // //     border: none !important;
// // //     padding: 0 !important;
// // //     margin: 1px 2px !important;
// // //     cursor: pointer !important;
// // //     border-radius: 6px !important;
// // //     transition: background-color 0.15s ease;
// // //   }
// // //   .fc-daygrid-event:hover {
// // //     background-color: #f1f5f9 !important;
// // //   }
// // //   .fc-daygrid-event-dot {
// // //     display: none !important;
// // //   }

// // //   /* ===== "more" link ===== */
// // //   .fc-daygrid-more-link {
// // //     color: #3b82f6 !important;
// // //     font-weight: 600 !important;
// // //     font-size: 0.75rem !important;
// // //     padding: 2px 6px !important;
// // //     border-radius: 4px;
// // //     text-decoration: none !important;
// // //   }
// // //   .fc-daygrid-more-link:hover {
// // //     background-color: #eff6ff !important;
// // //     color: #2563eb !important;
// // //   }

// // //   /* ===== תצוגת שבוע/יום ===== */
// // //   .fc-timegrid-event {
// // //     background: transparent !important;
// // //     border: none !important;
// // //     padding: 0 !important;
// // //     box-shadow: none !important;
// // //   }
// // //   .fc-timegrid-event:hover {
// // //     opacity: 0.85;
// // //   }
// // //   .fc-timegrid-event-harness {
// // //     padding: 1px;
// // //   }

// // //   /* ===== כפתורי טופ-בר ===== */
// // //   .fc-button-primary {
// // //     background-color: #475569 !important;
// // //     border-color: #475569 !important;
// // //     font-weight: 600 !important;
// // //     border-radius: 8px !important;
// // //     padding: 6px 14px !important;
// // //     font-size: 0.85rem !important;
// // //     transition: all 0.15s ease;
// // //   }
// // //   .fc-button-primary:hover {
// // //     background-color: #334155 !important;
// // //     border-color: #334155 !important;
// // //   }
// // //   .fc-button-active {
// // //     background-color: #2563eb !important;
// // //     border-color: #2563eb !important;
// // //   }
// // //   .fc-button-primary:focus {
// // //     box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2) !important;
// // //   }
// // //   .fc-button:disabled {
// // //     opacity: 0.5;
// // //   }

// // //   /* ===== Cursor ===== */
// // //   .fc-daygrid-day { cursor: pointer; }
// // //   .fc-event { cursor: pointer; }

// // //   /* ===== גבולות עדינים ===== */
// // //   .fc-theme-standard td,
// // //   .fc-theme-standard th,
// // //   .fc-theme-standard .fc-scrollgrid {
// // //     border-color: #e2e8f0 !important;
// // //   }

// // //   /* ===== ביטול highlight של תאריך נבחר בלחיצה ===== */
// // //   .fc-daygrid-day.fc-day-other:hover .fc-daygrid-day-number,
// // //   .fc-daygrid-day:hover .fc-daygrid-day-number {
// // //     background-color: transparent !important;
// // //   }
// // // `}</style>

// // //       <div className="max-w-7xl mx-auto">
// // //         {/* כותרת */}
// // //         <header className="mb-6">
// // //           <h1 className="text-3xl font-bold text-gray-800">לוח שנה</h1>
// // //           <p className="text-gray-500 mt-1 text-sm">
// // //             ניהול שריונים, אבחונים וזמני עבודה
// // //           </p>
// // //         </header>

// // //         {/* מקרא צבעים */}
// // //         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap items-center gap-6">
// // //           <span className="text-sm font-bold text-gray-700">מקרא:</span>
// // //           {Object.entries(TYPE_CONFIG).map(([key, config]) => (
// // //             <LegendItem key={key} config={config} />
// // //           ))}
// // //         </div>

// // //         {/* הלוח עצמו */}
// // //         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
// // //           {loading ? (
// // //             <div className="text-center py-20 text-blue-600 font-bold animate-pulse">
// // //               טוען לוח שנה...
// // //             </div>
// // //           ) : (
// // //             <FullCalendar
// // //               ref={calendarRef}
// // //               plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
// // //               initialView="dayGridMonth"
// // //               height="auto"
// // //               contentHeight={650}
// // //               headerToolbar={{
// // //                 right: "prev,next today",
// // //                 center: "title",
// // //                 left: "dayGridMonth,timeGridWeek,timeGridDay",
// // //               }}
// // //               locale="he"
// // //               direction="rtl"
// // //               events={events}
// // //               dateClick={handleDateClick}
// // //               eventClick={handleEventClick}
// // //               eventContent={renderEventContent}
// // //               navLinks={true}
// // //               dayMaxEvents={3}
// // //               slotMinTime="07:00:00"
// // //               slotMaxTime="22:00:00"
// // //               allDaySlot={false}
// // //               selectable={false}
// // //               selectMirror={false}
// // //               dayCellContent={(arg) => (
// // //                 <div className="flex flex-col">
// // //                   <div className="fc-daygrid-day-number">{arg.dayNumberText}</div>
// // //                   <div className="hebrew-date-display">
// // //                     {renderHebrewDate(arg)}
// // //                   </div>
// // //                 </div>
// // //               )}
// // //               buttonText={{
// // //                 today: "היום",
// // //                 month: "חודש",
// // //                 week: "שבוע",
// // //                 day: "יום",
// // //               }}
// // //             />
// // //           )}
// // //         </div>
// // //       </div>

// // //       {isModalOpen && (
// // //         <EventFormModal
// // //           mode={modalMode}
// // //           selectedDate={selectedDate}
// // //           eventData={selectedEvent}
// // //           onClose={() => setIsModalOpen(false)}
// // //           onSave={loadEvents}
// // //         />
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // // === רכיב מקרא ===
// // // const LegendItem = ({ config }) => (
// // //   <div className="flex items-center gap-2">
// // //     <span className={`w-3 h-3 rounded-full ${config.dotClass}`} />
// // //     <span className="text-sm text-gray-700 font-semibold">
// // //       {config.icon} {config.label}
// // //     </span>
// // //   </div>
// // // );

// // // export default Diary;


// // // frontend/src/pages/Diary.jsx
// // import React, { useState, useEffect, useRef } from "react";
// // import FullCalendar from "@fullcalendar/react";
// // import dayGridPlugin from "@fullcalendar/daygrid";
// // import timeGridPlugin from "@fullcalendar/timegrid";
// // import interactionPlugin from "@fullcalendar/interaction";
// // import { HDate } from "@hebcal/core";
// // import { useAuth } from "../contexts/AuthContext";
// // import DiaryService from "../services/diary.service";
// // import EventFormModal from "../components/EventFormModal";

// // // === מערכת צבעים אחידה ===
// // const TYPE_CONFIG = {
// //   appointment: {
// //     color: "#3b82f6", // blue-500
// //     label: "אבחון",
// //     icon: "👤",
// //     dotClass: "bg-blue-500",
// //     bgClass: "bg-blue-50",
// //     borderClass: "border-blue-500",
// //   },
// //   availability: {
// //     color: "#10b981", // emerald-500
// //     label: "זמינות",
// //     icon: "🕒",
// //     dotClass: "bg-emerald-500",
// //     bgClass: "bg-emerald-50",
// //     borderClass: "border-emerald-500",
// //   },
// //   note: {
// //     color: "#a855f7", // purple-500
// //     label: "הערה",
// //     icon: "📝",
// //     dotClass: "bg-purple-500",
// //     bgClass: "bg-purple-50",
// //     borderClass: "border-purple-500",
// //   },
// // };

// // const Diary = () => {
// //   const { currentUser } = useAuth();
// //   const calendarRef = useRef(null);
// //   const [events, setEvents] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [modalMode, setModalMode] = useState("create");
// //   const [selectedDate, setSelectedDate] = useState(null);
// //   const [selectedEvent, setSelectedEvent] = useState(null);

// //   const loadEvents = async () => {
// //     if (!currentUser) return;
// //     try {
// //       setLoading(true);
// //       const token = await currentUser.getIdToken();
// //       const data = await DiaryService.getEvents(token);

// //       const formatted = data.map((ev) => ({
// //         id: ev.id,
// //         title: ev.title,
// //         start: ev.start,
// //         end: ev.end,
// //         backgroundColor: "transparent",
// //         borderColor: "transparent",
// //         textColor: "#1e293b",
// //         extendedProps: { ...ev },
// //       }));
// //       setEvents(formatted);
// //     } catch (e) {
// //       console.error("שגיאה בטעינת אירועים:", e);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     loadEvents();
// //   }, [currentUser]);

// //   const handleDateClick = (arg) => {
// //     const calendarApi = calendarRef.current.getApi();

// //     if (calendarApi.view.type === "dayGridMonth") {
// //       calendarApi.changeView("timeGridDay", arg.date);
// //     } else {
// //       setSelectedDate(arg.dateStr);
// //       setSelectedEvent(null);
// //       setModalMode("create");
// //       setIsModalOpen(true);
// //     }
// //   };

// //   const handleEventClick = (info) => {
// //     info.jsEvent.stopPropagation();
// //     setSelectedEvent({ id: info.event.id, ...info.event.extendedProps });
// //     setModalMode("view");
// //     setIsModalOpen(true);
// //   };

// //   const renderHebrewDate = (dateArg) => {
// //     try {
// //       const hDate = new HDate(dateArg.date);
// //       return hDate.renderGematriya().split("ת")[0].trim();
// //     } catch {
// //       return "";
// //     }
// //   };

// //   // רנדור אירוע - שונה לפי תצוגה
// //   const renderEventContent = (eventInfo) => {
// //     const type = eventInfo.event.extendedProps.type || "note";
// //     const config = TYPE_CONFIG[type];
// //     const isMonthView = eventInfo.view.type === "dayGridMonth";

// //     if (isMonthView) {
// //       // תצוגת חודש - נקודה צבעונית + טקסט
// //       return (
// //         <div className="flex items-center gap-1.5 px-1 py-0.5 w-full overflow-hidden">
// //           <span className={`w-2 h-2 rounded-full shrink-0 ${config.dotClass}`} />
// //           <span className="text-xs font-semibold text-gray-800 truncate">
// //             {eventInfo.event.title}
// //           </span>
// //         </div>
// //       );
// //     }

// //     // תצוגת שבוע/יום - כרטיס מלא עם פס צבע
// //     return (
// //       <div
// //         className={`flex items-start h-full overflow-hidden rounded-md border-r-4 ${config.borderClass} ${config.bgClass} px-2 py-1`}
// //       >
// //         <div className="flex-1 overflow-hidden">
// //           <div className="text-sm font-bold text-gray-800 truncate">
// //             {eventInfo.event.title}
// //           </div>
// //           <div className="text-[11px] text-gray-500 mt-0.5">
// //             {eventInfo.timeText}
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className="p-6 md:p-8 bg-[#F8FAFC] min-h-screen font-sans" dir="rtl">
// //       {/* ה-CSS הזה הכרחי - אי אפשר לעצב את internals של FullCalendar רק עם Tailwind */}
// //       <style>{`
// //         /* ===== מסגרת הלוח ===== */
// //         .fc {
// //           font-family: inherit;
// //           font-size: 14px;
// //         }
// //         .fc .fc-toolbar-title { 
// //           font-size: 1.25rem !important; 
// //           font-weight: 700;
// //           color: #1e293b;
// //         }
// //         .fc .fc-toolbar.fc-header-toolbar {
// //           margin-bottom: 1.25rem !important;
// //         }

// //         /* ===== תאי תאריך - גובה קומפקטי ===== */
// //         .fc-daygrid-day-frame {
// //           min-height: 95px !important;
// //           padding: 4px !important;
// //         }
// //         .fc-col-header-cell-cushion { 
// //           color: #475569 !important; 
// //           font-weight: 700 !important;
// //           font-size: 0.9rem !important;
// //           padding: 10px 4px !important;
// //           text-decoration: none !important;
// //         }
// //         .fc-daygrid-day-number { 
// //           color: #1e293b !important; 
// //           font-weight: 700 !important; 
// //           font-size: 1rem !important;
// //           padding: 4px !important;
// //           text-decoration: none !important;
// //         }
// //         .fc-daygrid-day-number:hover {
// //           text-decoration: none !important;
// //           color: #1e293b !important;
// //         }
// //         .hebrew-date-display { 
// //           color: #f59e0b !important; 
// //           font-weight: 700; 
// //           font-size: 0.7rem;
// //           padding: 0 4px;
// //         }

// //         /* ===== ביטול hover על תאריכים ===== */
// //         .fc-daygrid-day:hover,
// //         .fc-day:hover,
// //         .fc-timegrid-slot:hover,
// //         .fc-timegrid-col:hover,
// //         a.fc-daygrid-day-number:hover,
// //         a.fc-col-header-cell-cushion:hover {
// //           background-color: inherit !important;
// //           color: #1e293b !important;
// //         }
// //         .fc-highlight {
// //           background-color: transparent !important;
// //         }

// //         /* ===== היום הנוכחי - עיגול כתום אחד בלבד ===== */
// //         .fc-day-today { 
// //           background-color: #fef3c7 !important; 
// //         }
// //         /* רק על אלמנט ה-<a> של מספר היום, לא על העטיפה */
// //         .fc-day-today a.fc-daygrid-day-number {
// //           background-color: #f59e0b;
// //           color: white !important;
// //           border-radius: 9999px;
// //           width: 28px;
// //           height: 28px;
// //           display: inline-flex;
// //           align-items: center;
// //           justify-content: center;
// //           margin: 4px;
// //           text-decoration: none !important;
// //         }
// //         /* ביטול עיצוב כפול אם יש wrapper נוסף */
// //         .fc-day-today .day-number-wrapper {
// //           background-color: transparent !important;
// //           color: #1e293b !important;
// //           width: auto;
// //           height: auto;
// //           border-radius: 0;
// //           margin: 0;
// //         }

// //         /* ===== אירועים בחודש ===== */
// //         .fc-daygrid-event {
// //           background-color: transparent !important;
// //           border: none !important;
// //           padding: 0 !important;
// //           margin: 1px 2px !important;
// //           cursor: pointer !important;
// //           border-radius: 6px !important;
// //           transition: background-color 0.15s ease;
// //         }
// //         .fc-daygrid-event:hover {
// //           background-color: #f1f5f9 !important;
// //         }
// //         .fc-daygrid-event-dot {
// //           display: none !important;
// //         }

// //         /* ===== "more" link ===== */
// //         .fc-daygrid-more-link {
// //           color: #3b82f6 !important;
// //           font-weight: 600 !important;
// //           font-size: 0.75rem !important;
// //           padding: 2px 6px !important;
// //           border-radius: 4px;
// //           text-decoration: none !important;
// //         }
// //         .fc-daygrid-more-link:hover {
// //           background-color: #eff6ff !important;
// //           color: #2563eb !important;
// //         }

// //         /* ===== תצוגת שבוע/יום ===== */
// //         .fc-timegrid-event {
// //           background: transparent !important;
// //           border: none !important;
// //           padding: 0 !important;
// //           box-shadow: none !important;
// //         }
// //         .fc-timegrid-event:hover {
// //           opacity: 0.85;
// //         }
// //         .fc-timegrid-event-harness {
// //           padding: 1px;
// //         }

// //         /* ===== כפתורי טופ-בר ===== */
// //         .fc-button-primary {
// //           background-color: #475569 !important;
// //           border-color: #475569 !important;
// //           font-weight: 600 !important;
// //           border-radius: 8px !important;
// //           padding: 6px 14px !important;
// //           font-size: 0.85rem !important;
// //           transition: all 0.15s ease;
// //         }
// //         .fc-button-primary:hover {
// //           background-color: #334155 !important;
// //           border-color: #334155 !important;
// //         }
// //         .fc-button-active {
// //           background-color: #2563eb !important;
// //           border-color: #2563eb !important;
// //         }
// //         .fc-button-primary:focus {
// //           box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2) !important;
// //         }
// //         .fc-button:disabled {
// //           opacity: 0.5;
// //         }

// //         /* ===== Cursor ===== */
// //         .fc-daygrid-day { cursor: pointer; }
// //         .fc-event { cursor: pointer; }

// //         /* ===== גבולות עדינים ===== */
// //         .fc-theme-standard td,
// //         .fc-theme-standard th,
// //         .fc-theme-standard .fc-scrollgrid {
// //           border-color: #e2e8f0 !important;
// //         }

// //         /* ===== ביטול highlight של תאריך נבחר בלחיצה ===== */
// //         .fc-daygrid-day.fc-day-other:hover .fc-daygrid-day-number,
// //         .fc-daygrid-day:hover .fc-daygrid-day-number {
// //           background-color: transparent !important;
// //         }
// //       `}</style>

// //       <div className="max-w-7xl mx-auto">
// //         {/* כותרת */}
// //         <header className="mb-6">
// //           <h1 className="text-3xl font-bold text-gray-800">לוח שנה</h1>
// //           <p className="text-gray-500 mt-1 text-sm">
// //             ניהול שריונים, אבחונים וזמני עבודה
// //           </p>
// //         </header>

// //         {/* מקרא צבעים */}
// //         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap items-center gap-6">
// //           <span className="text-sm font-bold text-gray-700">מקרא:</span>
// //           {Object.entries(TYPE_CONFIG).map(([key, config]) => (
// //             <LegendItem key={key} config={config} />
// //           ))}
// //         </div>

// //         {/* הלוח עצמו */}
// //         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
// //           {loading ? (
// //             <div className="text-center py-20 text-blue-600 font-bold animate-pulse">
// //               טוען לוח שנה...
// //             </div>
// //           ) : (
// //             <FullCalendar
// //               ref={calendarRef}
// //               plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
// //               initialView="dayGridMonth"
// //               height="auto"
// //               contentHeight={650}
// //               headerToolbar={{
// //                 right: "prev,next today",
// //                 center: "title",
// //                 left: "dayGridMonth,timeGridWeek,timeGridDay",
// //               }}
// //               locale="he"
// //               direction="rtl"
// //               events={events}
// //               dateClick={handleDateClick}
// //               eventClick={handleEventClick}
// //               eventContent={renderEventContent}
// //               navLinks={true}
// //               dayMaxEvents={3}
// //               slotMinTime="07:00:00"
// //               slotMaxTime="22:00:00"
// //               allDaySlot={false}
// //               selectable={false}
// //               selectMirror={false}
// //               dayCellContent={(arg) => (
// //                 <div className="flex flex-col">
// //                   <div className="day-number-wrapper">{arg.dayNumberText}</div>
// //                   <div className="hebrew-date-display">
// //                     {renderHebrewDate(arg)}
// //                   </div>
// //                 </div>
// //               )}
// //               buttonText={{
// //                 today: "היום",
// //                 month: "חודש",
// //                 week: "שבוע",
// //                 day: "יום",
// //               }}
// //             />
// //           )}
// //         </div>
// //       </div>

// //       {isModalOpen && (
// //         <EventFormModal
// //           mode={modalMode}
// //           selectedDate={selectedDate}
// //           eventData={selectedEvent}
// //           onClose={() => setIsModalOpen(false)}
// //           onSave={loadEvents}
// //         />
// //       )}
// //     </div>
// //   );
// // };

// // // === רכיב מקרא ===
// // const LegendItem = ({ config }) => (
// //   <div className="flex items-center gap-2">
// //     <span className={`w-3 h-3 rounded-full ${config.dotClass}`} />
// //     <span className="text-sm text-gray-700 font-semibold">
// //       {config.icon} {config.label}
// //     </span>
// //   </div>
// // );

// // export default Diary;


// // frontend/src/pages/Diary.jsx
// import React, { useState, useEffect, useRef } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { HDate } from "@hebcal/core";
// import { useAuth } from "../contexts/AuthContext";
// import DiaryService from "../services/diary.service";
// import EventFormModal from "../components/EventFormModal";

// // === מערכת צבעים אחידה ===
// const TYPE_CONFIG = {
//   appointment: {
//     color: "#3b82f6", // blue-500
//     label: "אבחון",
//     icon: "👤",
//     dotClass: "bg-blue-500",
//     bgClass: "bg-blue-50",
//     borderClass: "border-blue-500",
//   },
//   availability: {
//     color: "#10b981", // emerald-500
//     label: "זמינות",
//     icon: "🕒",
//     dotClass: "bg-emerald-500",
//     bgClass: "bg-emerald-50",
//     borderClass: "border-emerald-500",
//   },
//   note: {
//     color: "#a855f7", // purple-500
//     label: "הערה",
//     icon: "📝",
//     dotClass: "bg-purple-500",
//     bgClass: "bg-purple-50",
//     borderClass: "border-purple-500",
//   },
// };

// const Diary = () => {
//   const { currentUser } = useAuth();
//   const calendarRef = useRef(null);
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState("create");
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedEvent, setSelectedEvent] = useState(null);

//   const loadEvents = async () => {
//     if (!currentUser) return;
//     try {
//       setLoading(true);
//       const token = await currentUser.getIdToken();
//       const data = await DiaryService.getEvents(token);

//       const formatted = data.map((ev) => ({
//         id: ev.id,
//         title: ev.title,
//         start: ev.start,
//         end: ev.end,
//         backgroundColor: "transparent",
//         borderColor: "transparent",
//         textColor: "#1e293b",
//         extendedProps: { ...ev },
//       }));
//       setEvents(formatted);
//     } catch (e) {
//       console.error("שגיאה בטעינת אירועים:", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadEvents();
//   }, [currentUser]);

//   const handleDateClick = (arg) => {
//     const calendarApi = calendarRef.current.getApi();

//     if (calendarApi.view.type === "dayGridMonth") {
//       calendarApi.changeView("timeGridDay", arg.date);
//     } else {
//       setSelectedDate(arg.dateStr);
//       setSelectedEvent(null);
//       setModalMode("create");
//       setIsModalOpen(true);
//     }
//   };

//   const handleEventClick = (info) => {
//     info.jsEvent.stopPropagation();
//     setSelectedEvent({ id: info.event.id, ...info.event.extendedProps });
//     setModalMode("view");
//     setIsModalOpen(true);
//   };

//   const renderHebrewDate = (dateArg) => {
//     try {
//       const hDate = new HDate(dateArg.date);
//       return hDate.renderGematriya().split("ת")[0].trim();
//     } catch {
//       return "";
//     }
//   };

//   // רנדור אירוע - שונה לפי תצוגה
//   const renderEventContent = (eventInfo) => {
//     const type = eventInfo.event.extendedProps.type || "note";
//     const config = TYPE_CONFIG[type];
//     const isMonthView = eventInfo.view.type === "dayGridMonth";

//     if (isMonthView) {
//       // תצוגת חודש - נקודה צבעונית + טקסט
//       return (
//         <div className="flex items-center gap-1.5 px-1 py-0.5 w-full overflow-hidden">
//           <span className={`w-2 h-2 rounded-full shrink-0 ${config.dotClass}`} />
//           <span className="text-xs font-semibold text-gray-800 truncate">
//             {eventInfo.event.title}
//           </span>
//         </div>
//       );
//     }

//     // תצוגת שבוע/יום - כרטיס מלא עם פס צבע
//     return (
//       <div
//         className={`flex items-start h-full overflow-hidden rounded-md border-r-4 ${config.borderClass} ${config.bgClass} px-2 py-1`}
//       >
//         <div className="flex-1 overflow-hidden">
//           <div className="text-sm font-bold text-gray-800 truncate">
//             {eventInfo.event.title}
//           </div>
//           <div className="text-[11px] text-gray-500 mt-0.5">
//             {eventInfo.timeText}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="p-6 md:p-8 bg-[#F8FAFC] min-h-screen font-sans" dir="rtl">
//       {/* ה-CSS הזה הכרחי - אי אפשר לעצב את internals של FullCalendar רק עם Tailwind */}
//       <style>{`
//         /* ===== מסגרת הלוח ===== */
//         .fc {
//           font-family: inherit;
//           font-size: 14px;
//         }
//         .fc .fc-toolbar-title { 
//           font-size: 1.25rem !important; 
//           font-weight: 700;
//           color: #1e293b;
//         }
//         .fc .fc-toolbar.fc-header-toolbar {
//           margin-bottom: 1.25rem !important;
//         }

//         /* ===== תאי תאריך - גובה קבוע (חשוב!) ===== */
//         .fc-daygrid-day-frame {
//           min-height: 110px !important;
//           max-height: 110px !important;
//           height: 110px !important;
//           padding: 4px !important;
//           overflow: hidden !important;
//         }
//         /* קיבוע גובה לכל שורה - מונע שורות גבוהות יותר מאחרות */
//         .fc-daygrid-body tr {
//           height: 110px !important;
//         }
//         .fc-scrollgrid-sync-table {
//           height: auto !important;
//         }
        
//         .fc-col-header-cell-cushion { 
//           color: #475569 !important; 
//           font-weight: 700 !important;
//           font-size: 0.9rem !important;
//           padding: 10px 4px !important;
//           text-decoration: none !important;
//         }
//         .fc-daygrid-day-number { 
//           color: #1e293b !important; 
//           font-weight: 700 !important; 
//           font-size: 1rem !important;
//           padding: 4px !important;
//           text-decoration: none !important;
//         }
//         .fc-daygrid-day-number:hover {
//           text-decoration: none !important;
//           color: #1e293b !important;
//         }
//         .hebrew-date-display { 
//           color: #f59e0b !important; 
//           font-weight: 700; 
//           font-size: 0.7rem;
//           padding: 0 4px;
//         }

//         /* ===== ביטול hover על תאריכים ===== */
//         .fc-daygrid-day:hover,
//         .fc-day:hover,
//         .fc-timegrid-slot:hover,
//         .fc-timegrid-col:hover,
//         a.fc-daygrid-day-number:hover,
//         a.fc-col-header-cell-cushion:hover {
//           background-color: inherit !important;
//           color: #1e293b !important;
//         }
//         .fc-highlight {
//           background-color: transparent !important;
//         }

//         /* ===== היום הנוכחי - עיגול כתום מסביב למספר ===== */
//         .fc-day-today { 
//           background-color: #fef3c7 !important; 
//         }
//         /* העיגול - רק על אלמנט ה-<a> של מספר היום */
//         .fc-day-today a.fc-daygrid-day-number {
//           background-color: #f59e0b !important;
//           color: white !important;
//           border-radius: 9999px !important;
//           width: 30px !important;
//           height: 30px !important;
//           display: inline-flex !important;
//           align-items: center !important;
//           justify-content: center !important;
//           margin: 2px !important;
//           padding: 0 !important;
//           text-decoration: none !important;
//           font-weight: 700 !important;
//         }
//         /* ביטול עיצוב כפול על ה-wrapper שלנו */
//         .fc-day-today .day-number-wrapper {
//           background-color: transparent !important;
//           color: #1e293b !important;
//           width: auto !important;
//           height: auto !important;
//           border-radius: 0 !important;
//           margin: 0 !important;
//           padding: 0 !important;
//           display: block !important;
//         }

//         /* ===== אירועים בחודש - גובה קבוע ===== */
//         .fc-daygrid-day-events {
//           min-height: 0 !important;
//           margin: 0 !important;
//         }
//         .fc-daygrid-event-harness {
//           margin-top: 1px !important;
//         }
//         .fc-daygrid-event {
//           background-color: transparent !important;
//           border: none !important;
//           padding: 0 !important;
//           margin: 1px 2px !important;
//           cursor: pointer !important;
//           border-radius: 6px !important;
//           transition: background-color 0.15s ease;
//           height: 18px !important;
//           line-height: 18px !important;
//           overflow: hidden !important;
//         }
//         .fc-daygrid-event:hover {
//           background-color: #f1f5f9 !important;
//         }
//         .fc-daygrid-event-dot {
//           display: none !important;
//         }

//         /* ===== "more" link ===== */
//         .fc-daygrid-more-link {
//           color: #3b82f6 !important;
//           font-weight: 600 !important;
//           font-size: 0.75rem !important;
//           padding: 1px 6px !important;
//           border-radius: 4px;
//           text-decoration: none !important;
//           margin-top: 1px !important;
//         }
//         .fc-daygrid-more-link:hover {
//           background-color: #eff6ff !important;
//           color: #2563eb !important;
//         }

//         /* ===== תצוגת שבוע/יום ===== */
//         .fc-timegrid-event {
//           background: transparent !important;
//           border: none !important;
//           padding: 0 !important;
//           box-shadow: none !important;
//         }
//         .fc-timegrid-event:hover {
//           opacity: 0.85;
//         }
//         .fc-timegrid-event-harness {
//           padding: 1px;
//         }

//         /* ===== כפתורי טופ-בר ===== */
//         .fc-button-primary {
//           background-color: #475569 !important;
//           border-color: #475569 !important;
//           font-weight: 600 !important;
//           border-radius: 8px !important;
//           padding: 6px 14px !important;
//           font-size: 0.85rem !important;
//           transition: all 0.15s ease;
//         }
//         .fc-button-primary:hover {
//           background-color: #334155 !important;
//           border-color: #334155 !important;
//         }
//         .fc-button-active {
//           background-color: #2563eb !important;
//           border-color: #2563eb !important;
//         }
//         .fc-button-primary:focus {
//           box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2) !important;
//         }
//         .fc-button:disabled {
//           opacity: 0.5;
//         }

//         /* ===== Cursor ===== */
//         .fc-daygrid-day { cursor: pointer; }
//         .fc-event { cursor: pointer; }

//         /* ===== גבולות עדינים ===== */
//         .fc-theme-standard td,
//         .fc-theme-standard th,
//         .fc-theme-standard .fc-scrollgrid {
//           border-color: #e2e8f0 !important;
//         }
//       `}</style>

//       <div className="max-w-7xl mx-auto">
//         {/* כותרת */}
//         <header className="mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">לוח שנה</h1>
//           <p className="text-gray-500 mt-1 text-sm">
//             ניהול שריונים, אבחונים וזמני עבודה
//           </p>
//         </header>

//         {/* מקרא צבעים */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap items-center gap-6">
//           <span className="text-sm font-bold text-gray-700">מקרא:</span>
//           {Object.entries(TYPE_CONFIG).map(([key, config]) => (
//             <LegendItem key={key} config={config} />
//           ))}
//         </div>

//         {/* הלוח עצמו */}
//         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
//           {loading ? (
//             <div className="text-center py-20 text-blue-600 font-bold animate-pulse">
//               טוען לוח שנה...
//             </div>
//           ) : (
//             <FullCalendar
//               ref={calendarRef}
//               plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//               initialView="dayGridMonth"
//               height="auto"
//               contentHeight={650}
//               headerToolbar={{
//                 right: "prev,next today",
//                 center: "title",
//                 left: "dayGridMonth,timeGridWeek,timeGridDay",
//               }}
//               locale="he"
//               direction="rtl"
//               events={events}
//               dateClick={handleDateClick}
//               eventClick={handleEventClick}
//               eventContent={renderEventContent}
//               navLinks={true}
//               dayMaxEvents={true}
//               slotMinTime="07:00:00"
//               slotMaxTime="22:00:00"
//               allDaySlot={false}
//               selectable={false}
//               selectMirror={false}
//               dayCellContent={(arg) => (
//                 <div className="flex flex-col">
//                   <div className="day-number-wrapper">{arg.dayNumberText}</div>
//                   <div className="hebrew-date-display">
//                     {renderHebrewDate(arg)}
//                   </div>
//                 </div>
//               )}
//               buttonText={{
//                 today: "היום",
//                 month: "חודש",
//                 week: "שבוע",
//                 day: "יום",
//               }}
//             />
//           )}
//         </div>
//       </div>

//       {isModalOpen && (
//         <EventFormModal
//           mode={modalMode}
//           selectedDate={selectedDate}
//           eventData={selectedEvent}
//           onClose={() => setIsModalOpen(false)}
//           onSave={loadEvents}
//         />
//       )}
//     </div>
//   );
// };

// // === רכיב מקרא ===
// const LegendItem = ({ config }) => (
//   <div className="flex items-center gap-2">
//     <span className={`w-3 h-3 rounded-full ${config.dotClass}`} />
//     <span className="text-sm text-gray-700 font-semibold">
//       {config.icon} {config.label}
//     </span>
//   </div>
// );

// export default Diary;


// frontend/src/pages/Diary.jsx
import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { HDate } from "@hebcal/core";
import { useAuth } from "../contexts/AuthContext";
import DiaryService from "../services/diary.service";
import EventFormModal from "../components/EventFormModal";

// === מערכת צבעים אחידה ===
const TYPE_CONFIG = {
  appointment: {
    color: "#3b82f6", // blue-500
    label: "אבחון",
    icon: "👤",
    dotClass: "bg-blue-500",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-500",
  },
  availability: {
    color: "#10b981", // emerald-500
    label: "זמינות",
    icon: "🕒",
    dotClass: "bg-emerald-500",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-500",
  },
  note: {
    color: "#a855f7", // purple-500
    label: "הערה",
    icon: "📝",
    dotClass: "bg-purple-500",
    bgClass: "bg-purple-50",
    borderClass: "border-purple-500",
  },
};

const Diary = () => {
  const { currentUser } = useAuth();
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const loadEvents = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      const data = await DiaryService.getEvents(token);

      const formatted = data.map((ev) => ({
        id: ev.id,
        title: ev.title,
        start: ev.start,
        end: ev.end,
        backgroundColor: "transparent",
        borderColor: "transparent",
        textColor: "#1e293b",
        extendedProps: { ...ev },
      }));
      setEvents(formatted);
    } catch (e) {
      console.error("שגיאה בטעינת אירועים:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [currentUser]);

  const handleDateClick = (arg) => {
    const calendarApi = calendarRef.current.getApi();

    if (calendarApi.view.type === "dayGridMonth") {
      calendarApi.changeView("timeGridDay", arg.date);
    } else {
      setSelectedDate(arg.dateStr);
      setSelectedEvent(null);
      setModalMode("create");
      setIsModalOpen(true);
    }
  };

  const handleEventClick = (info) => {
    info.jsEvent.stopPropagation();
    setSelectedEvent({ id: info.event.id, ...info.event.extendedProps });
    setModalMode("view");
    setIsModalOpen(true);
  };

  const renderHebrewDate = (dateArg) => {
    try {
      const hDate = new HDate(dateArg.date);
      return hDate.renderGematriya().split("ת")[0].trim();
    } catch {
      return "";
    }
  };

  // רנדור אירוע - שונה לפי תצוגה
  const renderEventContent = (eventInfo) => {
    const type = eventInfo.event.extendedProps.type || "note";
    const config = TYPE_CONFIG[type];
    const isMonthView = eventInfo.view.type === "dayGridMonth";

    if (isMonthView) {
      return (
        <div className="flex items-center gap-1.5 px-1 py-0.5 w-full overflow-hidden">
          <span className={`w-2 h-2 rounded-full shrink-0 ${config.dotClass}`} />
          <span className="text-xs font-semibold text-gray-800 truncate">
            {eventInfo.event.title}
          </span>
        </div>
      );
    }

    return (
      <div
        className={`flex items-start h-full overflow-hidden rounded-md border-r-4 ${config.borderClass} ${config.bgClass} px-2 py-1`}
      >
        <div className="flex-1 overflow-hidden">
          <div className="text-sm font-bold text-gray-800 truncate">
            {eventInfo.event.title}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">
            {eventInfo.timeText}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 bg-[#F8FAFC] min-h-screen font-sans" dir="rtl">
      <style>{`
  /* ===== מסגרת הלוח ===== */
  .fc {
    font-family: inherit;
    font-size: 14px;
  }
  .fc .fc-toolbar-title { 
    font-size: 1.25rem !important; 
    font-weight: 700;
    color: #1e293b;
  }
  .fc .fc-toolbar.fc-header-toolbar {
    margin-bottom: 1.25rem !important;
  }


  /* ===== כותרת ימי השבוע - תצוגה רגילה ===== */
.fc-col-header-cell {
  background-color: #f8fafc !important;
  border-bottom: 2px solid #e2e8f0 !important;
}
  /* ===== ביטול sticky ברירת מחדל של FullCalendar ===== */
.fc .fc-scrollgrid {
  overflow: visible !important;
}
.fc .fc-scroller {
  overflow: visible !important;
  height: auto !important;
}
.fc .fc-scroller-liquid-absolute {
  position: relative !important;
  inset: auto !important;
}
.fc .fc-scrollgrid-section-sticky > * {
  position: relative !important;
  top: auto !important;
}
.fc-scrollgrid-section-header {
  position: relative !important;
  top: auto !important;
}
.fc-col-header-cell-cushion { 
  color: #475569 !important; 
  font-weight: 700 !important;
  font-size: 0.9rem !important;
  padding: 12px 4px !important;
  text-decoration: none !important;
}

  /* ===== תאי תאריך - גובה קבוע ===== */
  .fc-daygrid-day-frame {
    min-height: 110px !important;
    max-height: 110px !important;
    height: 110px !important;
    padding: 4px !important;
    overflow: hidden !important;
    position: relative !important;
  }
  .fc-daygrid-body tr {
    height: 110px !important;
  }
  .fc-scrollgrid-sync-table {
    height: auto !important;
  }
  
  .fc-daygrid-day-number { 
    color: #1e293b !important; 
    font-weight: 700 !important; 
    font-size: 1rem !important;
    padding: 4px !important;
    text-decoration: none !important;
  }
  .fc-daygrid-day-number:hover {
    text-decoration: none !important;
    color: #1e293b !important;
  }
  .hebrew-date-display { 
    color: #f59e0b !important; 
    font-weight: 700; 
    font-size: 0.7rem;
    padding: 0 4px;
  }

  /* ===== ביטול hover על תאריכים ===== */
  .fc-daygrid-day:hover,
  .fc-day:hover,
  .fc-timegrid-slot:hover,
  .fc-timegrid-col:hover,
  a.fc-daygrid-day-number:hover,
  a.fc-col-header-cell-cushion:hover {
    background-color: inherit !important;
    color: #1e293b !important;
  }
  .fc-highlight {
    background-color: transparent !important;
  }

  /* ===== היום הנוכחי - רק רקע צהוב, ללא עיגול ===== */
  .fc-day-today { 
    background-color: #fef3c7 !important; 
  }
  .fc-day-today a.fc-daygrid-day-number {
    color: #d97706 !important;
    font-weight: 800 !important;
    background-color: transparent !important;
    border-radius: 0 !important;
    width: auto !important;
    height: auto !important;
    padding: 4px !important;
    margin: 0 !important;
    display: inline !important;
  }

  /* ===== אירועים בחודש - גובה קבוע וקומפקטי ===== */
  .fc-daygrid-day-events {
    min-height: 0 !important;
    margin: 0 !important;
  }
  .fc-daygrid-event-harness {
    margin-top: 1px !important;
  }
  .fc-daygrid-event {
    background-color: transparent !important;
    border: none !important;
    padding: 0 !important;
    margin: 1px 2px !important;
    cursor: pointer !important;
    border-radius: 6px !important;
    transition: background-color 0.15s ease;
    height: 18px !important;
    line-height: 18px !important;
    overflow: hidden !important;
  }
  .fc-daygrid-event:hover {
    background-color: #f1f5f9 !important;
  }
  .fc-daygrid-event-dot {
    display: none !important;
  }

  /* ===== "more" link - כפתור קטן ויפה ===== */
  .fc-daygrid-more-link {
    color: white !important;
    font-weight: 700 !important;
    font-size: 0.7rem !important;
    padding: 2px 8px !important;
    border-radius: 9999px !important;
    text-decoration: none !important;
    margin: 2px !important;
    background-color: #3b82f6 !important;
    display: inline-block !important;
    transition: all 0.15s ease;
  }
  .fc-daygrid-more-link:hover {
    background-color: #2563eb !important;
    color: white !important;
    transform: scale(1.05);
  }

  /* ===== popover שנפתח בלחיצה על "more" ===== */
  .fc-popover {
    border-radius: 12px !important;
    border: 1px solid #e2e8f0 !important;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
    overflow: hidden;
    z-index: 200 !important;
  }
  .fc-popover-header {
    background-color: #f8fafc !important;
    padding: 10px 14px !important;
    font-weight: 700 !important;
    color: #1e293b !important;
  }
  .fc-popover-body {
    padding: 8px !important;
    background-color: #fef3c7 !important; 
  }

  /* ===== תצוגת שבוע/יום ===== */
  .fc-timegrid-event {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    box-shadow: none !important;
  }
  .fc-timegrid-event:hover {
    opacity: 0.85;
  }
  .fc-timegrid-event-harness {
    padding: 1px;
  }

  /* ===== כפתורי טופ-בר ===== */
  .fc-button-primary {
    background-color: #475569 !important;
    border-color: #475569 !important;
    font-weight: 600 !important;
    border-radius: 8px !important;
    padding: 6px 14px !important;
    font-size: 0.85rem !important;
    transition: all 0.15s ease;
  }
  .fc-button-primary:hover {
    background-color: #334155 !important;
    border-color: #334155 !important;
  }
  .fc-button-active {
    background-color: #2563eb !important;
    border-color: #2563eb !important;
  }
  .fc-button-primary:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2) !important;
  }
  .fc-button:disabled {
    opacity: 0.5;
  }

  /* ===== Cursor ===== */
  .fc-daygrid-day { cursor: pointer; }
  .fc-event { cursor: pointer; }

  /* ===== גבולות עדינים ===== */
  .fc-theme-standard td,
  .fc-theme-standard th,
  .fc-theme-standard .fc-scrollgrid {
    border-color: #e2e8f0 !important;
  }
`}</style>

      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">לוח שנה</h1>
          <p className="text-gray-500 mt-1 text-sm">
            ניהול שריונים, אבחונים וזמני עבודה
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap items-center gap-6">
          <span className="text-sm font-bold text-gray-700">מקרא:</span>
          {Object.entries(TYPE_CONFIG).map(([key, config]) => (
            <LegendItem key={key} config={config} />
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          {loading ? (
            <div className="text-center py-20 text-blue-600 font-bold animate-pulse">
              טוען לוח שנה...
            </div>
          ) : (
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              height="auto"
              contentHeight={650}
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
              eventContent={renderEventContent}
              navLinks={true}
              dayMaxEventRows={3}
              moreLinkContent={(args) => `+${args.num}`}
              moreLinkClick="popover"
              slotMinTime="07:00:00"
              slotMaxTime="22:00:00"
              allDaySlot={false}
              selectable={false}
              selectMirror={false}
              dayCellContent={(arg) => (
                <div className="flex flex-col">
                  <div className="day-number-wrapper">{arg.dayNumberText}</div>
                  <div className="hebrew-date-display">
                    {renderHebrewDate(arg)}
                  </div>
                </div>
              )}
              buttonText={{
                today: "היום",
                month: "חודש",
                week: "שבוע",
                day: "יום",
              }}
              moreLinkText="עוד"
            />
          )}
        </div>
      </div>

      {isModalOpen && (
        <EventFormModal
          mode={modalMode}
          selectedDate={selectedDate}
          eventData={selectedEvent}
          onClose={() => setIsModalOpen(false)}
          onSave={loadEvents}
        />
      )}
    </div>
  );
};

const LegendItem = ({ config }) => (
  <div className="flex items-center gap-2">
    <span className={`w-3 h-3 rounded-full ${config.dotClass}`} />
    <span className="text-sm text-gray-700 font-semibold">
      {config.icon} {config.label}
    </span>
  </div>
);

export default Diary;