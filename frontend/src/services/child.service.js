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

// שליחת השאלון הסופי ועדכון הסטטוס ל"נשלח" - מקושר לאבחון הספציפי
const submitParentQuestionnaire = async (diagnosisId, formData, token) => {
  return await fetchWithAuth(
    `${BASE_URL}/diagnoses/${diagnosisId}/questionnaires/submit`,
    token,
    {
      method: "POST",
      body: JSON.stringify({ formData }),
    },
  );
};

// בדיקה אם קיים אבחון פעיל עבור הילד (כדי לדעת אם השאלון פתוח/נעול)
const getActiveDiagnosis = async (childId, token) => {
  return await fetchWithAuth(`${BASE_URL}/diagnoses/child/${childId}`, token);
};

// יצירת פרופיל ילד/ה חדש/ה - משמש גם מ-AddChildModal (בעתיד) וגם מהזרימה
// האופציונלית של הוספת ילד/ה מיד בעת יצירת הורה חדש
const createChild = async (childData, token) => {
  return await fetchWithAuth(`${BASE_URL}/children/create`, token, {
    method: "POST",
    body: JSON.stringify(childData),
  });
};

export default {
  submitParentQuestionnaire,
  getActiveDiagnosis,
  createChild,
};
