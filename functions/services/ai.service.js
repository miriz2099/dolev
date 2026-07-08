// functions/services/ai.service.js

// בהמשך תעשי כאן require ל-SDK של המודל שתרצי (למשל: const { OpenAI } = require('openai');)

/**
 * מנסח הערות אסוציאטיביות לטקסט קליני פורמלי
 * @param {string} rawText - הטקסט הגולמי שהמאבחנת הקלידה
 * @param {string} sectionType - סוג החלק בדוח (למשל: 'behavioral')
 * @returns {Promise<string>} - הטקסט המנוסח והרשמי
 */
exports.formatAssociativeNotes = async (rawText, sectionType) => {
  try {
    // --- כאן תשב הלוגיקה הספציפית של ספק ה-AI הנוכחי שלך ---

    // דוגמה קבועה (Mock) עד שתחברי את ה-API האמיתי:
    const systemPrompt = `You are a clinical psychologist... format this for ${sectionType}`;
    console.log(`Sending to AI with prompt: ${systemPrompt}`);

    // כאן תתבצע הקריאה האמיתית ל-API (למשל openai.chat.completions.create)
    const aiResponse = `[תוצאה מעובדת מה-AI עבור ${sectionType}]: ` + rawText;

    return aiResponse;
  } catch (error) {
    console.error("Error in AI Service:", error);
    throw new Error("Failed to process text with AI");
  }
};
