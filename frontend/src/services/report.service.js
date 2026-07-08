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
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Server Error");
  }
  return response.json();
};

const reportService = {
  // שליפת דוח לפי אבחון (או null אם אין)
  getByDiagnosis: (diagnosisId, token) =>
    fetchWithAuth(`${BASE_URL}/reports/diagnosis/${diagnosisId}`, token),

  // שמירת טיוטה
  saveDraft: (diagnosisId, formData, token) =>
    fetchWithAuth(`${BASE_URL}/reports/draft`, token, {
      method: "POST",
      body: JSON.stringify({ diagnosisId, formData }),
    }),

  // הגשת דוח סופי
  submit: (diagnosisId, formData, token) =>
    fetchWithAuth(`${BASE_URL}/reports/submit`, token, {
      method: "POST",
      body: JSON.stringify({ diagnosisId, formData }),
    }),

  // רשימת כל הדוחות (לדף דוחות בסיידבר)
  listAll: (token) => fetchWithAuth(`${BASE_URL}/reports`, token),

  // שליפת דוח בודד
  getById: (reportId, token) =>
    fetchWithAuth(`${BASE_URL}/reports/${reportId}`, token),

  // פתיחה מחדש לעריכה (משתמש ב-PUT)
  unlock: (reportId, token) =>
    fetchWithAuth(`${BASE_URL}/reports/${reportId}/unlock`, token, {
      method: "PUT",
    }),

  // ייצוא ל-PDF (מטפל בקובץ בינארי - Blob)
  exportPDF: async (reportId, token) => {
    const response = await fetch(`${BASE_URL}/reports/${reportId}/export`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to export PDF");
    return response.blob(); // מחזיר blob ולא json!
  },
};

export default reportService;
