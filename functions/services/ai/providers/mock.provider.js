// functions/services/ai/providers/mock.provider.js
//
// ספק דמה. שימושים:
//   1. פיתוח UI בלי לשרוף את המכסה החינמית.
//   2. בדיקות אוטומטיות (deterministic - תמיד אותה תוצאה).
//   3. חוליה אחרונה בשרשרת ה-fallback, כדי שהמערכת לא "תיפול" בהדגמה.
//
// הפעלה:  AI_PROVIDER_CHAIN=mock   (או  gemini,mock )

const PROVIDER_NAME = "mock";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
  name: PROVIDER_NAME,

  async complete({ userText }) {
    // מדמה latency אמיתי כדי שה-loading state ייבדק כמו שצריך
    await delay(600);

    // מחלץ את התוכן מתוך המפרידים שהוגדרו ב-prompts.js
    const match = userText.match(
      /<<<NOTES_START>>>\n([\s\S]*)\n<<<NOTES_END>>>/,
    );
    const raw = (match ? match[1] : userText).trim();

    const text =
      `[MOCK] להלן ניסוח לדוגמה שנוצר ללא קריאה ל-API אמיתי. ` +
      `הטקסט המקורי שהתקבל: ${raw}`;

    return {
      text,
      model: "mock-v1",
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  },
};
