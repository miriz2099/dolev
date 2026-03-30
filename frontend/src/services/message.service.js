// const BASE_URL = import.meta.env.VITE_API_URL;

// const fetchWithAuth = async (url, token, options = {}) => {
//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//     ...options.headers,
//   };
//   const response = await fetch(url, { ...options, headers });
//   if (!response.ok) throw new Error("Network response was not ok");
//   return response.json();
// };

// const getChildMessages = async (childId, token) => {
//   return await fetchWithAuth(`${BASE_URL}/messages/child/${childId}`, token);
// };

// const sendMessage = async (payload, token) => {
//   return await fetchWithAuth(`${BASE_URL}/messages/send`, token, {
//     method: "POST",
//     body: JSON.stringify(payload),
//   });
// };

// const deleteMessage = async (messageId, token) => {
//   return await fetchWithAuth(`${BASE_URL}/messages/${messageId}`, token, {
//     method: "DELETE",
//   });
// };

// const markMessagesAsRead = async (childId, token) => {
//   return await fetchWithAuth(
//     `${BASE_URL}/messages/mark-as-read/${childId}`,
//     token,
//     {
//       method: "PUT",
//     },
//   );
// };
// export default {
//   getChildMessages,
//   sendMessage,
//   deleteMessage,
//   markMessagesAsRead,
// };

// src/services/message.service.js
const BASE_URL = import.meta.env.VITE_API_URL;

const fetchWithAuth = async (url, token, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Network response was not ok");
  }
  return response.json();
};

const messageService = {
  // שליפת ה-Inbox של המאבחן
  getMyInbox: async (token) => {
    return await fetchWithAuth(`${BASE_URL}/messages/my-inbox`, token, {
      method: "GET",
    });
  },

  // שליחת הודעה (משותף להורה ומאבחן)
  sendMessage: async (payload, token) => {
    return await fetchWithAuth(`${BASE_URL}/messages/send`, token, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // מחיקת הודעה
  deleteMessage: async (messageId, token) => {
    return await fetchWithAuth(`${BASE_URL}/messages/${messageId}`, token, {
      method: "DELETE",
    });
  },

  // שליפת הודעות לילד ספציפי (עבור ההורה)
  getChildMessages: async (childId, token) => {
    return await fetchWithAuth(`${BASE_URL}/messages/child/${childId}`, token);
  },

  markMessagesAsRead: async (childId, token) => {
    return await fetchWithAuth(
      `${BASE_URL}/messages/mark-as-read/${childId}`,
      token,
      {
        method: "PUT",
      },
    );
  },
};

export default messageService;
