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

const sendMessage = async (payload, token) => {
  return await fetchWithAuth(`${BASE_URL}/messages/send`, token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
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

const getParentAnswers = async (childId, token) => {
  return await fetchWithAuth(
    `${BASE_URL}/diagnoses/parent-answers/${childId}`,
    token,
  );
};

const getMyMessages = async (token) => {
  return await fetchWithAuth(
    `${import.meta.env.VITE_API_URL}/messages/my-inbox`,
    token,
    {
      method: "GET",
    },
  );
};
// ייצוא כל הפונקציות
export default {
  getMyPatients,
  getParentInfo,
  sendMessage,
  getChildDetails,
  getDiagnoses,
  openNewDiagnosis,
  updateQuestionnaireStatus,
  getParentAnswers,
  getMyMessages,
};
