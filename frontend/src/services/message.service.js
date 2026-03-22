const BASE_URL = import.meta.env.VITE_API_URL;

const fetchWithAuth = async (url, token, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

const getChildMessages = async (childId, token) => {
  return await fetchWithAuth(`${BASE_URL}/messages/child/${childId}`, token);
};

const sendMessage = async (payload, token) => {
  return await fetchWithAuth(`${BASE_URL}/messages/send`, token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

const deleteMessage = async (messageId, token) => {
  return await fetchWithAuth(`${BASE_URL}/messages/${messageId}`, token, {
    method: "DELETE",
  });
};

const markMessagesAsRead = async (childId, token) => {
  return await fetchWithAuth(
    `${BASE_URL}/messages/mark-as-read/${childId}`,
    token,
    {
      method: "PUT",
    },
  );
};
export default {
  getChildMessages,
  sendMessage,
  deleteMessage,
  markMessagesAsRead,
};
