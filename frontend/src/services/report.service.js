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
  listAll: (token) =>
    fetchWithAuth(`${BASE_URL}/reports`, token),

  // שליפת דוח בודד
  getById: (reportId, token) =>
    fetchWithAuth(`${BASE_URL}/reports/${reportId}`, token),
};

export default reportService;