// functions/services/ai/index.js
//
// נקודת הכניסה היחידה לשכבת ה-AI.
// ה-controller קורא רק ל-rephraseSection ולא יודע איזה מודל רץ מאחורי הקלעים.
//
// משתני סביבה (functions/.env):
//   GEMINI_API_KEY=...
//   GEMINI_MODEL=gemini-2.5-flash
//   AI_PROVIDER_CHAIN=gemini,mock
//   AI_TIMEOUT_MS=25000

const { AiError } = require("./errors");
const prompts = require("./prompts");
const deidentify = require("./deidentify");

const providers = {
  gemini: require("./providers/gemini.provider"),
  mock: require("./providers/mock.provider"),
  // openai: require("./providers/openai.provider"),  // כשתוסיפי — רק שורה כאן
};

const DEFAULT_CHAIN = "gemini,mock";
const DEFAULT_TIMEOUT_MS = 25000;
const MAX_ATTEMPTS_PER_PROVIDER = Number(process.env.AI_MAX_ATTEMPTS) || 2;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** קורא את שרשרת הספקים מה-env ומסנן שמות לא מוכרים */
const getChain = () =>
  (process.env.AI_PROVIDER_CHAIN || DEFAULT_CHAIN)
    .split(",")
    .map((name) => name.trim())
    .filter((name) => {
      if (providers[name]) return true;
      console.warn(`[ai] unknown provider in chain: "${name}" - skipped`);
      return false;
    });

/** עוטף קריאה ב-timeout באמצעות AbortController */
const withTimeout = async (provider, params, timeoutMs) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await provider.complete({ ...params, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

/**
 * מריץ ספק אחד עם exponential backoff על שגיאות זמניות (429 / 503).
 * המתנות: 1s, 2s.
 */
const callProviderWithRetry = async (provider, params, timeoutMs) => {
  let lastError;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_PROVIDER; attempt++) {
    try {
      return await withTimeout(provider, params, timeoutMs);
    } catch (error) {
      lastError = error;

      const isLastAttempt = attempt === MAX_ATTEMPTS_PER_PROVIDER;
      if (!error.retryable || isLastAttempt) throw error;

      const waitMs = 1000 * 2 ** (attempt - 1); // 1s, 2s
      console.warn(
        `[ai] ${provider.name} attempt ${attempt} failed (${error.code}) - retrying in ${waitMs}ms`,
      );
      await sleep(waitMs);
    }
  }

  throw lastError;
};

/**
 * הפונקציה הראשית: מנסחת מחדש טקסט אסוציאטיבי לניסוח קליני.
 *
 * @param {object} params
 * @param {string} params.sectionId - מזהה המקטע בדוח (reportStructure.js)
 * @param {string} params.rawText   - הטקסט הגולמי שהמאבחנת הקלידה
 * @param {object} [params.child]   - מסמך הילד (ל-de-identification)
 * @param {object} [params.parent]  - מסמך ההורה (ל-de-identification)
 * @returns {Promise<{text: string, provider: string, model: string, usage: object}>}
 */
const rephraseSection = async ({ sectionId, rawText, child, parent }) => {
  if (typeof rawText !== "string" || !rawText.trim()) {
    throw new AiError("rawText is empty", {
      status: 400,
      retryable: false,
      code: "AI_ERROR",
    });
  }

  if (rawText.length > prompts.MAX_INPUT_CHARS) {
    throw new AiError(`rawText exceeds ${prompts.MAX_INPUT_CHARS} chars`, {
      status: 400,
      retryable: false,
      code: "AI_ERROR",
    });
  }

  // 1. הסרת פרטים מזהים לפני היציאה החוצה
  const entityMap = deidentify.buildEntityMap(child, parent);
  const { text: safeText, replacements } = deidentify.redact(
    rawText,
    entityMap,
  );

  // 2. בניית הפרומפט (בשרת בלבד)
  const params = {
    systemPrompt: prompts.buildSystemPrompt(sectionId),
    userText: prompts.buildUserContent(safeText),
  };

  const timeoutMs = Number(process.env.AI_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS;
  const chain = getChain();

  if (chain.length === 0) {
    throw new AiError("No valid AI provider configured", {
      status: 500,
      retryable: false,
      code: "AI_CONFIG",
    });
  }

  // 3. מעבר על השרשרת עד להצלחה
  let lastError;

  for (const name of chain) {
    const provider = providers[name];
    try {
      const result = await callProviderWithRetry(provider, params, timeoutMs);

      // 4. החזרת הפרטים המזהים לטקסט המנוסח
      const finalText = deidentify.restore(result.text, replacements);

      console.log(
        `[ai] ok provider=${name} model=${result.model} tokens=${result.usage?.totalTokens}`,
      );

      return {
        text: finalText,
        provider: name,
        model: result.model,
        usage: result.usage,
      };
    } catch (error) {
      lastError = error;
      console.error(`[ai] provider "${name}" failed: ${error.message}`);

      // שגיאה שאינה זמניות (מפתח פגום, תוכן חסום) — אין טעם לעבור לספק אחר
      if (!error.retryable) throw error;
    }
  }

  throw lastError;
};

/**
 * מחברת טיוטה ראשונית לסעיף בדוח ישירות מתוך תשובות מתויגות (label: value)
 * שנשלפו משאלוני הורים/בית ספר - בניגוד ל-rephraseSection שמנסחת מחדש
 * טקסט חופשי שהמאבחנת כבר כתבה. אותה תשתית פנימית (chain, retry, timeout,
 * de-identification) בדיוק כמו rephraseSection.
 *
 * @param {object} params
 * @param {string} params.sectionId   - מזהה המקטע בדוח (reportStructure.js)
 * @param {string} params.contextText - הטקסט המתויג שנבנה מהשאלונים
 *                                      (questionnaireContext.buildQuestionnaireContext)
 * @param {object} [params.child]     - מסמך הילד (ל-de-identification)
 * @param {object} [params.parent]    - מסמך ההורה (ל-de-identification)
 * @param {string} [params.childGender] - "בן" או "בת" (מ-formData.gender בשאלון ההורים),
 *                                        כדי שהניסוח ישתמש במגדר הדקדוקי הנכון
 * @returns {Promise<{text: string, provider: string, model: string, usage: object}>}
 */
const draftSectionFromQuestionnaires = async ({
  sectionId,
  contextText,
  child,
  parent,
  childGender,
}) => {
  if (typeof contextText !== "string" || !contextText.trim()) {
    throw new AiError("אין מספיק מידע בשאלונים לסעיף הזה", {
      status: 400,
      retryable: false,
      code: "AI_ERROR",
    });
  }

  // 1. הסרת פרטים מזהים לפני היציאה החוצה
  const entityMap = deidentify.buildEntityMap(child, parent);
  const { text: safeText, replacements } = deidentify.redact(
    contextText,
    entityMap,
  );

  // 2. בניית הפרומפט (בשרת בלבד)
  const params = {
    systemPrompt: prompts.buildDraftSystemPrompt(sectionId),
    userText: prompts.buildDraftUserContent(safeText, childGender),
  };

  const timeoutMs = Number(process.env.AI_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS;
  const chain = getChain();

  if (chain.length === 0) {
    throw new AiError("No valid AI provider configured", {
      status: 500,
      retryable: false,
      code: "AI_CONFIG",
    });
  }

  // 3. מעבר על השרשרת עד להצלחה
  let lastError;

  for (const name of chain) {
    const provider = providers[name];
    try {
      const result = await callProviderWithRetry(provider, params, timeoutMs);

      // 4. החזרת הפרטים המזהים לטקסט המנוסח
      const finalText = deidentify.restore(result.text, replacements);

      console.log(
        `[ai] draft ok provider=${name} model=${result.model} tokens=${result.usage?.totalTokens}`,
      );

      return {
        text: finalText,
        provider: name,
        model: result.model,
        usage: result.usage,
      };
    } catch (error) {
      lastError = error;
      console.error(`[ai] draft provider "${name}" failed: ${error.message}`);

      // שגיאה שאינה זמניות (מפתח פגום, תוכן חסום) — אין טעם לעבור לספק אחר
      if (!error.retryable) throw error;
    }
  }

  throw lastError;
};

/**
 * מפענחת את תשובת ה-JSON של בדיקת הסבירות. עמידה בפני עטיפת markdown
 * (```json ... ```) שמודלים לפעמים מוסיפים למרות ההוראה שלא.
 * Fail-open: אם אי אפשר לפענח - מחזירה reasonable:true במקום לזרוק,
 * כדי שכשל פענוח לעולם לא יחסום הגשת דוח.
 */
const parsePlausibilityResponse = (text) => {
  try {
    const cleaned = text
      .trim()
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();
    const parsed = JSON.parse(cleaned);
    if (typeof parsed.reasonable === "boolean") {
      return {
        reasonable: parsed.reasonable,
        reason: typeof parsed.reason === "string" ? parsed.reason : "",
      };
    }
  } catch (err) {
    // נופל ל-fail-open למטה
  }
  console.warn("[ai] plausibility response could not be parsed, defaulting to reasonable=true");
  return { reasonable: true, reason: "" };
};

/**
 * בודקת האם טקסט חופשי שהמאבחנת כתבה שייך נושאית לסעיף הדוח שבו הוא
 * נמצא (לא בדיקת נכונות קלינית - רק "האם זה שייך לכאן").
 *
 * @param {object} params
 * @param {string} params.sectionId - מזהה המקטע (למטרות לוג בלבד)
 * @param {string} params.sectionTitle - הכותרת בעברית של הסעיף
 * @param {string} params.rawText - הטקסט שהמאבחנת כתבה
 * @param {object} [params.child]
 * @param {object} [params.parent]
 * @returns {Promise<{reasonable: boolean, reason: string, provider: string, model: string}>}
 */
const checkSectionPlausibility = async ({
  sectionId,
  sectionTitle,
  rawText,
  child,
  parent,
}) => {
  if (typeof rawText !== "string" || !rawText.trim()) {
    throw new AiError("rawText is empty", {
      status: 400,
      retryable: false,
      code: "AI_ERROR",
    });
  }

  if (rawText.length > prompts.MAX_INPUT_CHARS) {
    throw new AiError(`rawText exceeds ${prompts.MAX_INPUT_CHARS} chars`, {
      status: 400,
      retryable: false,
      code: "AI_ERROR",
    });
  }

  const entityMap = deidentify.buildEntityMap(child, parent);
  const { text: safeText } = deidentify.redact(rawText, entityMap);

  const params = {
    systemPrompt: prompts.buildPlausibilitySystemPrompt(sectionTitle || sectionId),
    userText: prompts.buildUserContent(safeText),
  };

  const timeoutMs = Number(process.env.AI_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS;
  const chain = getChain();

  if (chain.length === 0) {
    throw new AiError("No valid AI provider configured", {
      status: 500,
      retryable: false,
      code: "AI_CONFIG",
    });
  }

  let lastError;

  for (const name of chain) {
    const provider = providers[name];
    try {
      const result = await callProviderWithRetry(provider, params, timeoutMs);
      const { reasonable, reason } = parsePlausibilityResponse(result.text);

      return { reasonable, reason, provider: name, model: result.model };
    } catch (error) {
      lastError = error;
      console.error(`[ai] plausibility provider "${name}" failed: ${error.message}`);

      if (!error.retryable) throw error;
    }
  }

  throw lastError;
};

/**
 * מפענחת את תשובת ה-JSON של "שיחה על הניסוח" (refineSection). עמידה בפני
 * עטיפת markdown (```json ... ```) כמו parsePlausibilityResponse, אבל
 * בניגוד אליה - לא fail-open: תשובה שלא ניתנת לפענוח היא שגיאה (אסור
 * להחזיר טקסט לא תקין לתוך תיבת הניסוח המוצע).
 * @param {string} text
 * @returns {{text: string, note: string}}
 */
const parseRefineResponse = (text) => {
  try {
    const cleaned = text
      .trim()
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();
    const parsed = JSON.parse(cleaned);
    if (typeof parsed.text === "string" && parsed.text.trim()) {
      return {
        text: parsed.text,
        note: typeof parsed.note === "string" ? parsed.note : "",
      };
    }
  } catch (err) {
    // נופל לזריקה למטה
  }

  throw new AiError("הבינה המלאכותית החזירה תשובה לא תקינה. נסי שוב.", {
    status: 502,
    retryable: false,
    code: "AI_BAD_RESPONSE",
  });
};

/**
 * "שיחה על הניסוח": עריכת פסקה קיימת אחת (CURRENT) לפי הודעה חופשית של
 * המאבחנת, עם היסטוריית שיחה קצרה לצורך הקשר. יש רק נוסח נוכחי אחד - בלי
 * ניהול גרסאות - והשיחה עצמה אינה נשמרת בשום מקום; היא עוברת כקלט לכל
 * קריאה ומוחזרת רק כ-note קצר שמסביר מה השתנה.
 *
 * @param {object} params
 * @param {string} params.sectionId
 * @param {"rephrase"|"draft"} params.mode
 * @param {string} params.sourceText    - המקור העובדתי היחיד (הערות המאבחנת
 *                                        או הקשר מתויג מהשאלונים)
 * @param {string} params.currentText   - הנוסח הנוכחי (כולל עריכות ידניות)
 * @param {Array<{role: "user"|"assistant", text: string}>} [params.history]
 * @param {string} params.message       - ההודעה החדשה של המאבחנת
 * @param {object} [params.child]
 * @param {object} [params.parent]
 * @param {string} [params.childGender]
 * @returns {Promise<{text: string, note: string, provider: string, model: string, usage: object}>}
 */
const refineSection = async ({
  sectionId,
  mode,
  sourceText,
  currentText,
  history,
  message,
  child,
  parent,
  childGender,
}) => {
  if (typeof message !== "string" || !message.trim()) {
    throw new AiError("message is empty", {
      status: 400,
      retryable: false,
      code: "AI_ERROR",
    });
  }
  if (message.length > prompts.REFINE_MAX_MESSAGE_CHARS) {
    throw new AiError(
      `message exceeds ${prompts.REFINE_MAX_MESSAGE_CHARS} chars`,
      { status: 400, retryable: false, code: "AI_ERROR" },
    );
  }

  if (typeof currentText !== "string" || !currentText.trim()) {
    throw new AiError("currentText is empty", {
      status: 400,
      retryable: false,
      code: "AI_ERROR",
    });
  }
  if (currentText.length > prompts.MAX_INPUT_CHARS) {
    throw new AiError(`currentText exceeds ${prompts.MAX_INPUT_CHARS} chars`, {
      status: 400,
      retryable: false,
      code: "AI_ERROR",
    });
  }

  if (typeof sourceText !== "string") {
    throw new AiError("sourceText must be a string", {
      status: 400,
      retryable: false,
      code: "AI_ERROR",
    });
  }
  if (sourceText.length > prompts.MAX_INPUT_CHARS) {
    throw new AiError(`sourceText exceeds ${prompts.MAX_INPUT_CHARS} chars`, {
      status: 400,
      retryable: false,
      code: "AI_ERROR",
    });
  }

  const historyArr = Array.isArray(history) ? history : [];
  if (historyArr.length > prompts.REFINE_MAX_HISTORY) {
    throw new AiError(
      `history exceeds ${prompts.REFINE_MAX_HISTORY} items`,
      { status: 400, retryable: false, code: "AI_ERROR" },
    );
  }
  for (const item of historyArr) {
    const validRole = item && (item.role === "user" || item.role === "assistant");
    const validText =
      item && typeof item.text === "string" && item.text.length <= prompts.REFINE_MAX_MESSAGE_CHARS;
    if (!validRole || !validText) {
      throw new AiError("history item is invalid", {
        status: 400,
        retryable: false,
        code: "AI_ERROR",
      });
    }
  }

  // 1. הסרת פרטים מזהים לפני היציאה החוצה - מפה אחת, מופעלת בנפרד על
  //    כל חלק (SOURCE/CURRENT/היסטוריה/MESSAGE) כדי לא לדלוף טוקנים בין חלקים
  const entityMap = deidentify.buildEntityMap(child, parent);

  const sourceRedacted = deidentify.redact(sourceText, entityMap);
  const currentRedacted = deidentify.redact(currentText, entityMap);
  const messageRedacted = deidentify.redact(message, entityMap);
  const historyRedacted = historyArr.map((item) => ({
    role: item.role,
    ...deidentify.redact(item.text, entityMap),
  }));

  const allReplacements = [
    ...sourceRedacted.replacements,
    ...currentRedacted.replacements,
    ...messageRedacted.replacements,
    ...historyRedacted.flatMap((h) => h.replacements),
  ];
  const seenTokens = new Set();
  const replacements = [];
  for (const r of allReplacements) {
    if (!seenTokens.has(r.token)) {
      seenTokens.add(r.token);
      replacements.push(r);
    }
  }

  // 2. בניית הפרומפט (בשרת בלבד)
  const params = {
    systemPrompt: prompts.buildRefineSystemPrompt(sectionId, mode),
    userText: prompts.buildRefineUserContent({
      sourceText: sourceRedacted.text,
      currentText: currentRedacted.text,
      history: historyRedacted.map((h) => ({ role: h.role, text: h.text })),
      message: messageRedacted.text,
      childGender,
    }),
    responseMimeType: "application/json",
    maxOutputTokens: 2048,
  };

  const timeoutMs = Number(process.env.AI_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS;
  const chain = getChain();

  if (chain.length === 0) {
    throw new AiError("No valid AI provider configured", {
      status: 500,
      retryable: false,
      code: "AI_CONFIG",
    });
  }

  // 3. מעבר על השרשרת עד להצלחה
  let lastError;

  for (const name of chain) {
    const provider = providers[name];
    try {
      const result = await callProviderWithRetry(provider, params, timeoutMs);
      const parsed = parseRefineResponse(result.text);

      // 4. החזרת הפרטים המזהים לטקסט ולהערה
      const finalText = deidentify.restore(parsed.text, replacements);
      const finalNote = deidentify.restore(parsed.note, replacements);

      console.log(
        `[ai] refine ok provider=${name} model=${result.model} tokens=${result.usage?.totalTokens}`,
      );

      return {
        text: finalText,
        note: finalNote,
        provider: name,
        model: result.model,
        usage: result.usage,
      };
    } catch (error) {
      lastError = error;
      console.error(`[ai] refine provider "${name}" failed: ${error.message}`);

      // שגיאה שאינה זמנית (מפתח פגום, תוכן חסום, תשובה לא תקינה) —
      // אין טעם לעבור לספק אחר
      if (!error.retryable) throw error;
    }
  }

  throw lastError;
};

module.exports = {
  rephraseSection,
  checkSectionPlausibility,
  draftSectionFromQuestionnaires,
  refineSection,
};
