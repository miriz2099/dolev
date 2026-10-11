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
    const error = new Error(errorData.error || "Server Error");
    error.status = response.status;
    throw error;
  }
  return response.json();
};

const consentFormService = {
  // שליפת טופס לפי diagnosisId (הורה או מאבחן)
  getByDiagnosis: async (diagnosisId, token) => {
    return await fetchWithAuth(
      `${BASE_URL}/consent-forms/by-diagnosis/${diagnosisId}`,
      token,
      { method: "GET" },
    );
  },

  // חתימת ההורה הרשום
  signByRegisteredParent: async (formId, payload, token) => {
    return await fetchWithAuth(
      `${BASE_URL}/consent-forms/${formId}/sign-registered`,
      token,
      {
        method: "POST",
        body: JSON.stringify(payload), // { name, email, signature, schoolOrGarden? }
      },
    );
  },

  // ייצוא טופס ההסכמה ל-PDF (מאבחן/אדמין בלבד) - מחזיר blob ולא JSON
  exportPDF: async (diagnosisId, token) => {
    const response = await fetch(
      `${BASE_URL}/consent-forms/by-diagnosis/${diagnosisId}/export`,
      { method: "GET", headers: { Authorization: `Bearer ${token}` } },
    );
    if (!response.ok) throw new Error("Failed to export PDF");
    return response.blob();
  },

  // 🆕 הזמנת הורה שני
  inviteSecondParent: async (formId, payload, token) => {
    return await fetchWithAuth(
      `${BASE_URL}/consent-forms/${formId}/invite-second-parent`,
      token,
      {
        method: "POST",
        body: JSON.stringify(payload), // { name, email }
      },
    );
  },

  // 🆕 פונקציות ציבוריות (ללא token)
  getByToken: async (inviteToken) => {
    const response = await fetch(
      `${BASE_URL}/consent-forms/by-token/${inviteToken}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.error || "שגיאה בטעינת הטופס");
      error.status = response.status;
      throw error;
    }
    return response.json();
  },

  signByToken: async (inviteToken, payload) => {
    const response = await fetch(
      `${BASE_URL}/consent-forms/by-token/${inviteToken}/sign`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.error || "שגיאה בשמירת החתימה");
      error.status = response.status;
      throw error;
    }
    return response.json();
  },

  // 🆕 "ההורים אינם גרושים" - משלימה את הטופס בלי הורה שני
  noSecondParentRequired: async (formId, token) => {
    return await fetchWithAuth(
      `${BASE_URL}/consent-forms/${formId}/no-second-parent`,
      token,
      { method: "POST" },
    );
  },
};

export default consentFormService;
