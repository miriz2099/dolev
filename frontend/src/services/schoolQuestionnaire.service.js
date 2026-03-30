// const BASE_URL = import.meta.env.VITE_API_URL;

// const fetchWithAuth = async (url, options = {}) => {
//   const headers = {
//     "Content-Type": "application/json",
//     ...options.headers,
//   };

//   // כאן אין Authorization header כי המורה לא מחובר למערכת
//   const response = await fetch(url, { ...options, headers });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.error || "שגיאה בתקשורת עם השרת");
//   }

//   return response.json();
// };

// const schoolQuestionnaireService = {
//   // בדיקת תקינות הטוקן וקבלת פרטי הילד
//   checkInvitation: async (token) => {
//     return await fetchWithAuth(
//       `${BASE_URL}/school-questionnaires/check-invite/${token}`,
//     );
//   },

//   // שליחת השאלון המלא על ידי המורה
//   submitSurvey: async (token, formData) => {
//     return await fetchWithAuth(
//       `${BASE_URL}/school-questionnaires/submit/${token}`,
//       {
//         method: "POST",
//         body: JSON.stringify({ formData }),
//       },
//     );
//   },
//   saveDraft: async (token, formData) => {
//     return await fetchWithAuth(
//       `${BASE_URL}/school-questionnaires/draft/${token}`,
//       {
//         method: "PUT", // או POST, לפי מה שהגדרת בבאקנד
//         body: JSON.stringify({ formData }),
//       },
//     );
//   },
// };

// export default schoolQuestionnaireService;

const BASE_URL = import.meta.env.VITE_API_URL;

const fetchWithAuth = async (url, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "שגיאה בתקשורת עם השרת");
  }

  return response.json();
};

const schoolQuestionnaireService = {
  // --- פונקציה עבור ההורה (דורשת Token) ---

  sendInvite: async (payload, token) => {
    return await fetchWithAuth(`${BASE_URL}/school-questionnaires/invite`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // ההורה מזדהה מול השרת
      },
      body: JSON.stringify(payload), // מכיל childId, teacherEmail, teacherName
    });
  },

  // --- פונקציות עבור המורה (ציבוריות - ללא Token) ---

  checkInvitation: async (token) => {
    return await fetchWithAuth(
      `${BASE_URL}/school-questionnaires/check-invite/${token}`,
    );
  },

  submitSurvey: async (token, formData) => {
    return await fetchWithAuth(
      `${BASE_URL}/school-questionnaires/submit/${token}`,
      {
        method: "POST",
        body: JSON.stringify({ formData }),
      },
    );
  },

  saveDraft: async (token, formData) => {
    return await fetchWithAuth(
      `${BASE_URL}/school-questionnaires/draft/${token}`,
      {
        method: "PUT",
        body: JSON.stringify({ formData }),
      },
    );
  },
  getSurveyForTherapist: async (childId, token) => {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const response = await fetch(
      `${BASE_URL}/school-questionnaires/child/${childId}`,
      {
        method: "GET",
        headers,
      },
    );

    if (response.status === 404) return null; // אם אין שאלון, פשוט נחזיר null
    if (!response.ok) throw new Error("Failed to fetch survey");

    return response.json();
  },

  resendInvite: async (childId, token) => {
    const response = await fetch(`${BASE_URL}/school-questionnaires/resend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ childId }),
    });
    if (!response.ok) throw new Error("Failed to resend invite");
    return response.json();
  },

  resetInvite: async (childId, token) => {
    const response = await fetch(`${BASE_URL}/school-questionnaires/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ childId }),
    });
    if (!response.ok) throw new Error("Failed to reset invite");
    return response.json();
  },

  getInviteByChild: async (childId, token) => {
    try {
      const response = await fetch(
        `${BASE_URL}/school-questionnaires/invitation/${childId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // אם חזר 404 זה אומר שאין הזמנה וזה תקין (נחזיר null)
      if (response.status === 404) return null;

      if (!response.ok) throw new Error("Failed to fetch invite status");

      return await response.json();
    } catch (error) {
      console.error("Error in getInviteByChild service:", error);
      return null;
    }
  },
};

export default schoolQuestionnaireService;
