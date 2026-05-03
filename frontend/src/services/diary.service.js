// const API_URL = import.meta.env.VITE_API_URL;
// const DiaryService = {
//   // שמירת אירוע דרך ה-Backend
//   saveEvent: async (eventData, token) => {
//     try {
//       const response = await fetch(`${API_URL}/diary/events`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // שליחת ה-Token של המשתמש לאימות בשרת
//         },
//         body: JSON.stringify(eventData),
//       });
//       return await response.json();
//     } catch (error) {
//       console.error("Service Error:", error);
//       throw error;
//     }
//   },

//   // שליפת אירועים
//   getEvents: async (token) => {
//     try {
//       const response = await fetch(`${API_URL}/diary/events`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return await response.json();
//     } catch (error) {
//       console.error("Service Error:", error);
//       return [];
//     }
//   },
// };

// export default DiaryService;


// frontend/src/services/diary.service.js

const BASE_URL = import.meta.env.VITE_API_URL;

const fetchWithAuth = async (url, token, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  // טיפול שגיאות מורחב - מאפשר ללקוח לקרוא את ה-conflict details
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.error || "Server Error");
    error.status = response.status;
    error.details = errorData;
    throw error;
  }
  return response.json();
};

const DiaryService = {
  // שליפת כל האירועים של המאבחן
  getEvents: async (token) => {
    return await fetchWithAuth(`${BASE_URL}/diary/events`, token, {
      method: "GET",
    });
  },

  // יצירת אירוע חדש (יחיד או סדרת זמינות)
  createEvent: async (eventData, token) => {
    return await fetchWithAuth(`${BASE_URL}/diary/events`, token, {
      method: "POST",
      body: JSON.stringify(eventData),
    });
  },

  // מחיקת אירוע (יחיד או סדרה שלמה)
  deleteEvent: async (eventId, token, deleteSeries = false) => {
    const url = deleteSeries
      ? `${BASE_URL}/diary/events/${eventId}?deleteSeries=true`
      : `${BASE_URL}/diary/events/${eventId}`;
    return await fetchWithAuth(url, token, { method: "DELETE" });
  },
};

export default DiaryService;