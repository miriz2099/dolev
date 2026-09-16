// frontend/src/services/inquiry.service.js
import { auth } from "../firebase";

const API_URL = import.meta.env.VITE_API_URL;

export const updateInquiryStatus = async (id, status) => {
  const token = await auth.currentUser.getIdToken();
  const response = await fetch(`${API_URL}/inquiries/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "עדכון הסטטוס נכשל");
  return data;
};

export const sendInquiryReply = async (id, replyText) => {
  const token = await auth.currentUser.getIdToken();
  const response = await fetch(`${API_URL}/inquiries/${id}/reply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ replyText }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "שליחת התשובה נכשלה");
  return data;
};
