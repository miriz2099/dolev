// frontend/src/services/admin.service.js
import { auth } from "../firebase";

const API_URL = import.meta.env.VITE_API_URL;

export const createStaffMember = async (staffData) => {
  try {
    // 1. חילוץ הטוקן של המנהל המחובר כרגע
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const token = await user.getIdToken();

    // 2. שליחת הבקשה עם ה-Token ב-Headers
    const response = await fetch(`${API_URL}/admin/create-staff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // שליחת הטוקן בצורה מאובטחת
      },
      body: JSON.stringify(staffData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "שגיאה ביצירת איש צוות");
    }

    return data;
  } catch (error) {
    console.error("AdminService Error:", error);
    throw error;
  }
};
// מחיקה
export const deleteStaffMember = async (userId) => {
  const token = await auth.currentUser.getIdToken();
  const response = await fetch(`${API_URL}/admin/delete-staff/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("מחיקה נכשלה");
  return await response.json();
};

// שליפת כל ההורים (role=patient) עם הילדים שלהם - דרך ה-Backend (Admin SDK)
export const getFamilies = async () => {
  const token = await auth.currentUser.getIdToken();
  const response = await fetch(`${API_URL}/admin/families`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(data.error || "שגיאה בטעינת נתוני ההורים והמטופלים");
  return data;
};

// מחיקת הורה + כל הילדים והנתונים שלו (cascade) + חשבון ה-Auth
export const deleteParent = async (parentId) => {
  const token = await auth.currentUser.getIdToken();
  const response = await fetch(`${API_URL}/admin/delete-parent/${parentId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "מחיקת ההורה נכשלה");
  return data;
};

// מחיקת ילד + כל הנתונים המקושרים אליו (cascade)
export const deleteChild = async (childId) => {
  const token = await auth.currentUser.getIdToken();
  const response = await fetch(`${API_URL}/children/${childId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "מחיקת הילד נכשלה");
  return data;
};

export const updateStaffMember = async (userId, updateData) => {
  const token = await auth.currentUser.getIdToken();
  const response = await fetch(`${API_URL}/admin/update-staff/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });
  if (!response.ok) throw new Error("עדכון נכשל");
  return await response.json();
};
