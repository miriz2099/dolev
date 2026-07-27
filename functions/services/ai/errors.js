// functions/services/ai/errors.js

/**
 * שגיאה מנורמלת של שכבת ה-AI.
 * כל provider חייב לזרוק AiError כדי שה-index יידע להחליט
 * אם לנסות שוב, לעבור לספק הבא, או להיכשל מיד.
 */
class AiError extends Error {
  /**
   * @param {string} message - הודעה פנימית ללוגים (לא נחשפת ללקוח!)
   * @param {object} options
   * @param {number} options.status - קוד HTTP מנורמל
   * @param {boolean} options.retryable - האם שווה לנסות שוב / לעבור לספק אחר
   * @param {string} [options.provider] - שם הספק שנכשל
   * @param {string} [options.code] - קוד פנימי לתרגום להודעה בעברית
   */
  constructor(
    message,
    { status = 500, retryable = false, provider, code } = {},
  ) {
    super(message);
    this.name = "AiError";
    this.status = status;
    this.retryable = retryable;
    this.provider = provider;
    this.code = code || "AI_ERROR";
  }
}

/** קודי שגיאה פנימיים -> הודעות ידידותיות בעברית (מה שהמשתמשת רואה) */
const USER_MESSAGES = {
  AI_RATE_LIMIT: "שירות הניסוח עמוס כרגע. נסי שוב בעוד רגע.",
  AI_UNAVAILABLE: "שירות הניסוח אינו זמין כרגע. נסי שוב מאוחר יותר.",
  AI_TIMEOUT: "הניסוח לוקח יותר מדי זמן. נסי שוב, או קצרי מעט את הטקסט.",
  AI_BLOCKED: "לא ניתן היה לנסח את הטקסט הזה. נסי לנסח אותו מעט אחרת.",
  AI_EMPTY: "לא התקבל ניסוח. נסי שוב.",
  AI_CONFIG: "שירות הניסוח אינו מוגדר. יש לפנות למנהל המערכת.",
  AI_ERROR: "אירעה שגיאה בניסוח הטקסט.",
};

const toUserMessage = (error) =>
  USER_MESSAGES[error?.code] || USER_MESSAGES.AI_ERROR;

module.exports = { AiError, toUserMessage };
