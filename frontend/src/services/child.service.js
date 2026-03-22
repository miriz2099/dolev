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
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

// שליחת השאלון הסופי ועדכון הסטטוס ל"נשלח"
const submitParentQuestionnaire = async (childId, formData, token) => {
  return await fetchWithAuth(
    `${BASE_URL}/diagnoses/questionnaires/submit`,
    token,
    {
      method: "POST",
      body: JSON.stringify({ childId, formData }),
    },
  );
};

// בדיקה אם קיים אבחון פעיל עבור הילד (כדי לדעת אם השאלון פתוח/נעול)
const getActiveDiagnosis = async (childId, token) => {
  return await fetchWithAuth(`${BASE_URL}/diagnoses/child/${childId}`, token);
};

export default {
  submitParentQuestionnaire,
  getActiveDiagnosis,
};
