const API_URL = import.meta.env.VITE_API_URL;
const DiaryService = {
  // שמירת אירוע דרך ה-Backend
  saveEvent: async (eventData, token) => {
    try {
      const response = await fetch(`${API_URL}/diary/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // שליחת ה-Token של המשתמש לאימות בשרת
        },
        body: JSON.stringify(eventData),
      });
      return await response.json();
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  },

  // שליפת אירועים
  getEvents: async (token) => {
    try {
      const response = await fetch(`${API_URL}/diary/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error("Service Error:", error);
      return [];
    }
  },
};

export default DiaryService;
