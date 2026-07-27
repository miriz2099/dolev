// functions/services/ai/providers/gemini.provider.js
//
// Adapter ל-Google Gemini. מממש את ה-interface המשותף:
//   complete({ systemPrompt, userText, signal }) -> { text, usage, model }
//
// התקנה:  npm i @google/genai   (בתוך תיקיית functions)

const { GoogleGenAI, ApiError } = require("@google/genai");
const { AiError } = require("../errors");

const PROVIDER_NAME = "gemini";

// ברירת מחדל שמרנית ומהירה. אפשר להחליף דרך .env בלי לגעת בקוד.
const DEFAULT_MODEL = "gemini-2.5-flash";

let client = null;

/**
 * אתחול עצל (lazy): לא נוגעים ב-env בזמן טעינת המודול,
 * כדי שהפריסה לא תיפול אם המפתח חסר — רק הקריאה בפועל תיכשל.
 */
const getClient = () => {
  if (client) return client;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new AiError("GEMINI_API_KEY is not defined", {
      status: 500,
      retryable: false,
      provider: PROVIDER_NAME,
      code: "AI_CONFIG",
    });
  }

  client = new GoogleGenAI({ apiKey });
  return client;
};

/**
 * ממפה שגיאות של ה-SDK ל-AiError מנורמל.
 * 429 = חריגה ממכסה, 5xx = תקלה זמנית -> שווה לנסות ספק אחר.
 */
const mapError = (error) => {
  if (error instanceof AiError) return error;

  const status = error instanceof ApiError ? error.status : undefined;

  if (status === 429) {
    // מכסה יומית (RPD) לא מתאפסת תוך שניות — אין טעם לנסות שוב.
    // מכסה לדקה (RPM) כן — שם ה-retry עוזר.
    const isDailyQuota = /per\s*day|PerDay/i.test(error.message || "");

    return new AiError(`Gemini 429: ${error.message}`, {
      status: 429,
      retryable: !isDailyQuota,
      provider: PROVIDER_NAME,
      code: "AI_RATE_LIMIT",
    });
  }

  if (status === 500 || status === 503 || status === 504) {
    return new AiError(`Gemini unavailable (${status})`, {
      status: 503,
      retryable: true,
      provider: PROVIDER_NAME,
      code: "AI_UNAVAILABLE",
    });
  }

  if (status === 400 || status === 401 || status === 403) {
    // מפתח לא תקין / בקשה פסולה — אין טעם לנסות שוב
    return new AiError(`Gemini rejected the request (${status})`, {
      status: 500,
      retryable: false,
      provider: PROVIDER_NAME,
      code: "AI_CONFIG",
    });
  }
  if (status === 404) {
    return new AiError(`Model unavailable: ${error.message}`, {
      status: 500,
      retryable: false, // ← תקלת תצורה, לא זמינות
      provider: PROVIDER_NAME,
      code: "AI_CONFIG",
    });
  }

  if (error?.name === "AbortError") {
    return new AiError("Gemini request aborted (timeout)", {
      status: 504,
      retryable: true,
      provider: PROVIDER_NAME,
      code: "AI_TIMEOUT",
    });
  }

  return new AiError(`Gemini error: ${error?.message || "unknown"}`, {
    status: 500,
    retryable: true,
    provider: PROVIDER_NAME,
    code: "AI_ERROR",
  });
};

const buildThinkingConfig = (model) =>
  /gemini-3/.test(model) ? { thinkingLevel: "minimal" } : { thinkingBudget: 0 };

module.exports = {
  name: PROVIDER_NAME,

  /**
   * @param {object} params
   * @param {string} params.systemPrompt
   * @param {string} params.userText
   * @param {AbortSignal} [params.signal]
   * @returns {Promise<{text: string, usage: object, model: string}>}
   */
  async complete({ systemPrompt, userText, signal }) {
    const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

    try {
      const ai = getClient();

      const response = await ai.models.generateContent({
        model,
        contents: userText,
        config: {
          systemInstruction: systemPrompt,
          // נמוך בכוונה: המשימה היא ניסוח מחדש, לא יצירתיות.
          temperature: 0.2,
          maxOutputTokens: 1200,
          // מבטל "חשיבה" — מיותרת למשימת rephrase, חוסכת טוקנים וזמן.
          // ⚠️ אם תעברי ל-gemini-2.5-pro או לדור 3 — הסירי/התאימי את השורה.
          thinkingConfig: buildThinkingConfig(model),
          abortSignal: signal,
        },
      });

      const text = response.text?.trim();

      if (!text) {
        // בדרך כלל: חסימת בטיחות או finishReason חריג
        const finishReason = response.candidates?.[0]?.finishReason;
        const blockReason = response.promptFeedback?.blockReason;

        throw new AiError(
          `Empty response (finishReason=${finishReason}, block=${blockReason})`,
          {
            status: 422,
            retryable: false,
            provider: PROVIDER_NAME,
            code: blockReason ? "AI_BLOCKED" : "AI_EMPTY",
          },
        );
      }

      const meta = response.usageMetadata || {};

      return {
        text,
        model,
        usage: {
          inputTokens: meta.promptTokenCount ?? null,
          outputTokens: meta.candidatesTokenCount ?? null,
          totalTokens: meta.totalTokenCount ?? null,
        },
      };
    } catch (error) {
      throw mapError(error);
    }
  },
};
