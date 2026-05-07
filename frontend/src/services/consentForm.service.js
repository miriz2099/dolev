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

const consentFormService = {
  // שליפת טופס לפי childId (הורה או מאבחן)
  getByChild: async (childId, token) => {
    return await fetchWithAuth(
      `${BASE_URL}/consent-forms/by-child/${childId}`,
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
      throw new Error(errorData.error || "שגיאה בטעינת הטופס");
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
      throw new Error(errorData.error || "שגיאה בשמירת החתימה");
    }
    return response.json();
  },
};

export default consentFormService;
