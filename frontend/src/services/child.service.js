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
    throw new Error(errorData.error || "Network response was not ok");
  }
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

// שינוי המאבחן/ת המשויך/ת לאבחון קיים - אדמין בלבד
const reassignDiagnosisTherapist = async (diagnosisId, newTherapistId, token) => {
  return await fetchWithAuth(`${BASE_URL}/diagnoses/${diagnosisId}/therapist`, token, {
    method: "PATCH",
    body: JSON.stringify({ newTherapistId }),
  });
};

// סגירה מפורשת של אבחון - רק לאחר שהדוח הוגש. זו הפעולה שבפועל
// חושפת את הדוח להורדת PDF בצד ההורה.
const closeDiagnosis = async (diagnosisId, token) => {
  return await fetchWithAuth(`${BASE_URL}/diagnoses/${diagnosisId}/close`, token, {
    method: "PATCH",
  });
};

export default {
  submitParentQuestionnaire,
  getActiveDiagnosis,
  createChild,
  reassignDiagnosisTherapist,
  closeDiagnosis,
};
