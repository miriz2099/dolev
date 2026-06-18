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

const getChildDetails = async (childId, token) => {
  return await fetchWithAuth(`${BASE_URL}/children/${childId}`, token, {
    method: "GET",
  });
};

const getParentInfo = async (parentId, token) => {
  return await fetchWithAuth(
    `${BASE_URL}/children/parent-info/${parentId}`,
    token,
    {
      method: "GET",
    },
  );
};

// const sendMessage = async (payload, token) => {
//   return await fetchWithAuth(`${BASE_URL}/messages/send`, token, {
//     method: "POST",
//     body: JSON.stringify(payload),
//   });
// };
// שליפת רשימת מטופלים למאבחן
const getMyPatients = async (token) => {
  return await fetchWithAuth(`${BASE_URL}/children/my-patients`, token, {
    method: "GET",
  });
};

// שליפת כל האבחונים של ילד מסוים
const getDiagnoses = async (childId, token) => {
  return await fetchWithAuth(`${BASE_URL}/diagnoses/child/${childId}`, token, {
    method: "GET",
  });
};

// פתיחת אבחון חדש לילד
const openNewDiagnosis = async (childId, token) => {
  return await fetchWithAuth(`${BASE_URL}/diagnoses/create`, token, {
    method: "POST",
    body: JSON.stringify({ childId }),
  });
};

// עדכון סטטוס השאלון (למשל מ"נשלח" ל"לתיקון")
const updateQuestionnaireStatus = async (
  diagnosisId,
  status,
  token,
  childId,
) => {
  return await fetchWithAuth(
    `${BASE_URL}/diagnoses/status/${diagnosisId}`,
    token,
    {
      method: "PUT",
      body: JSON.stringify({ status, childId }),
    },
  );
};

const getParentAnswers = async (diagnosisId, token) => {
  return await fetchWithAuth(
    `${BASE_URL}/diagnoses/${diagnosisId}/parent-answers`,
    token,
  );
};

const addRequiredAssessment = async (diagnosisId, payload, token) => {
  return await fetchWithAuth(
    `${BASE_URL}/diagnoses/${diagnosisId}/assessments`,
    token,
    {
      method: "POST",
      body: JSON.stringify(payload), // { name, durationMinutes }
    },
  );
};

// עדכון אבחון נדרש (רק כשעדיין pending)
const updateRequiredAssessment = async (
  diagnosisId,
  assessmentId,
  payload,
  token,
) => {
  return await fetchWithAuth(
    `${BASE_URL}/diagnoses/${diagnosisId}/assessments/${assessmentId}`,
    token,
    {
      method: "PUT",
      body: JSON.stringify(payload), // { name?, durationMinutes? }
    },
  );
};

// מחיקת אבחון נדרש (רק כשעדיין pending)
const deleteRequiredAssessment = async (diagnosisId, assessmentId, token) => {
  return await fetchWithAuth(
    `${BASE_URL}/diagnoses/${diagnosisId}/assessments/${assessmentId}`,
    token,
    {
      method: "DELETE",
    },
  );
};

// ============================================
// 🆕 קביעת ובחירת תורים (להורה)
// ============================================

// שליפת slots פנויים לאבחון מסוים
const getAvailableSlots = async (diagnosisId, assessmentId, token) => {
  return await fetchWithAuth(
    `${BASE_URL}/diagnoses/${diagnosisId}/assessments/${assessmentId}/available-slots`,
    token,
    { method: "GET" },
  );
};

// קביעת תור לאבחון
const bookAssessmentAppointment = async (
  diagnosisId,
  assessmentId,
  payload, // { start, end }
  token,
) => {
  return await fetchWithAuth(
    `${BASE_URL}/diagnoses/${diagnosisId}/assessments/${assessmentId}/book`,
    token,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
};

// ביטול תור
const cancelAssessmentAppointment = async (
  diagnosisId,
  assessmentId,
  token,
) => {
  return await fetchWithAuth(
    `${BASE_URL}/diagnoses/${diagnosisId}/assessments/${assessmentId}/cancel`,
    token,
    { method: "DELETE" },
  );
};

// מחיקת אבחון בודד + כל הטפסים שלו
const deleteDiagnosis = async (diagnosisId, token) => {
  return await fetchWithAuth(`${BASE_URL}/diagnoses/${diagnosisId}`, token, {
    method: "DELETE",
  });
};
// ייצוא כל הפונקציות
export default {
  getMyPatients,
  getParentInfo,
  // sendMessage,
  getChildDetails,
  getDiagnoses,
  openNewDiagnosis,
  updateQuestionnaireStatus,
  getParentAnswers,
  // getMyMessages,
  addRequiredAssessment,
  updateRequiredAssessment,
  deleteRequiredAssessment,
  getAvailableSlots,
  bookAssessmentAppointment,
  cancelAssessmentAppointment,
  deleteDiagnosis,
};
