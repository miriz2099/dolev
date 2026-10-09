// functions/services/ai/providers/mock.provider.js
//
// ספק דמה - לאמולטור בלבד. שימושים:
//   1. פיתוח UI בלי לשרוף את המכסה החינמית.
//   2. בדיקות אוטומטיות (deterministic - תמיד אותה תוצאה).
//
// הפעלה (רק באמולטור): functions/.env.local -> AI_PROVIDER_CHAIN=mock
// (או gemini,mock). ⚠️ זו לא חוליית fallback בשרת שבאוויר: getChain()
// ב-index.js מסיר "mock" מהשרשרת כש-FUNCTIONS_EMULATOR אינו "true", כך
// שמשתמשת אמיתית לעולם לא תקבל טקסט "[MOCK]" גם אם Gemini נכשל.

const PROVIDER_NAME = "mock";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
  name: PROVIDER_NAME,

  async complete({ userText }) {
    // מדמה latency אמיתי כדי שה-loading state ייבדק כמו שצריך
    await delay(600);

    // שיחה על הניסוח (refineSection): מחלץ את CURRENT ומחזיר JSON דמה
    if (userText.includes("<<<CURRENT_START>>>")) {
      const currentMatch = userText.match(
        /<<<CURRENT_START>>>\n([\s\S]*?)\n<<<CURRENT_END>>>/,
      );
      const current = (currentMatch ? currentMatch[1] : "").trim();

      const text = JSON.stringify({
        text: "[MOCK] " + current,
        note: "[MOCK] לא בוצע שינוי אמיתי.",
      });

      return {
        text,
        model: "mock-v1",
        usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
      };
    }

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
