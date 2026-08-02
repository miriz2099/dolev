// const BASE_URL = import.meta.env.VITE_API_URL;

// const fetchWithAuth = async (url, token, options = {}) => {
//   const response = await fetch(url, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//       ...options.headers,
//     },
//   });
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     throw new Error(errorData.error || "Server Error");
//   }
//   return response.json();
// };

// const reportService = {
//   // שליפת דוח לפי אבחון (או null אם אין)
//   getByDiagnosis: (diagnosisId, token) =>
//     fetchWithAuth(`${BASE_URL}/reports/diagnosis/${diagnosisId}`, token),

//   // שמירת טיוטה
//   saveDraft: (diagnosisId, formData, token) =>
//     fetchWithAuth(`${BASE_URL}/reports/draft`, token, {
//       method: "POST",
//       body: JSON.stringify({ diagnosisId, formData }),
//     }),

//   // הגשת דוח סופי
//   submit: (diagnosisId, formData, token) =>
//     fetchWithAuth(`${BASE_URL}/reports/submit`, token, {
//       method: "POST",
//       body: JSON.stringify({ diagnosisId, formData }),
//     }),

//   // רשימת כל הדוחות (לדף דוחות בסיידבר)
//   listAll: (token) => fetchWithAuth(`${BASE_URL}/reports`, token),

//   // שליפת דוח בודד
//   getById: (reportId, token) =>
//     fetchWithAuth(`${BASE_URL}/reports/${reportId}`, token),

//   // פתיחה מחדש לעריכה (משתמש ב-PUT)
//   unlock: (reportId, token) =>
//     fetchWithAuth(`${BASE_URL}/reports/${reportId}/unlock`, token, {
//       method: "PUT",
//     }),

//   // ייצוא ל-PDF (מטפל בקובץ בינארי - Blob)
//   exportPDF: async (reportId, token) => {
//     const response = await fetch(`${BASE_URL}/reports/${reportId}/export`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     if (!response.ok) throw new Error("Failed to export PDF");
//     return response.blob(); // מחזיר blob ולא json!
//   },
// };

// export default reportService;

// frontend/src/services/report.service.js
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

// שולחת בקשת POST וקוראת תשובת NDJSON (שורת JSON אחת לכל אירוע) בהדרגה,
// כדי לדווח התקדמות בזמן אמת דרך onProgress במקום לחכות לתשובה השלמה.
// משמשת גם לניסוח מחדש קבוצתי וגם לבדיקת סבירות תוכן.
const streamNdjson = async (url, body, token, { onProgress, signal } = {}) => {
  const response = await fetch(url, {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok || !response.body) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Server Error");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let newlineIndex;
    while ((newlineIndex = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);
      if (line) onProgress?.(JSON.parse(line));
    }
  }
  if (buffer.trim()) onProgress?.(JSON.parse(buffer.trim()));
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

  // 🆕 ניסוח מחדש של מקטע ע"י AI.
  // מחזיר הצעה בלבד - השמירה מתבצעת רק אם המאבחנת מאשרת בממשק.
  rephrase: (diagnosisId, sectionId, rawText, token) =>
    fetchWithAuth(`${BASE_URL}/reports/ai/rephrase`, token, {
      method: "POST",
      body: JSON.stringify({ diagnosisId, sectionId, rawText }),
    }),

  // 🆕 ניסוח מחדש קבוצתי - שולח כמה מקטעים בבקשה אחת, אבל כל מקטע
  // מנוסח בנפרד מאחורי הקלעים (ראה functions/controllers/report.controller.js).
  // התשובה מגיעה כ-NDJSON (שורת JSON אחת לכל מקטע שמסתיים) כדי לאפשר
  // דיווח התקדמות בזמן אמת דרך onProgress, במקום לחכות לסיום כל הבאצ'.
  rephraseBatch: (diagnosisId, sections, token, opts) =>
    streamNdjson(
      `${BASE_URL}/reports/ai/rephrase-batch`,
      { diagnosisId, sections },
      token,
      opts,
    ),

  // 🆕 בדיקת סבירות תוכן - האם כל מקטע נבחר שייך נושאית לסעיף שבו הוא
  // נמצא. רצה בלוק-בלוק בצד השרת (checkReportPlausibility) וזורמת
  // NDJSON באותו פורמט בדיוק כמו rephraseBatch. sections כאן הוא
  // [{ sectionId, title, rawText }].
  checkPlausibility: (diagnosisId, sections, token, opts) =>
    streamNdjson(
      `${BASE_URL}/reports/ai/check-plausibility`,
      { diagnosisId, sections },
      token,
      opts,
    ),

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
