// functions/helpers/signature.helper.js
//
// אימות חתימה שנשלחת כתמונה (data URL) מ-SignatureInput.jsx בפרונט - ציור
// חופשי (PNG) או תמונה שהועלתה (JPEG), שתיהן דחוסות ברוחב מקסימלי של 600px
// בצד הלקוח כדי להישאר הרבה מתחת למגבלת גוף הבקשה.

const SIGNATURE_IMAGE_RE = /^data:image\/(png|jpeg);base64,[A-Za-z0-9+/]+={0,2}$/;

const MAX_SIGNATURE_LENGTH = 100000;

const isValidSignatureImage = (s) =>
  typeof s === "string" &&
  s.length <= MAX_SIGNATURE_LENGTH &&
  SIGNATURE_IMAGE_RE.test(s);

module.exports = { SIGNATURE_IMAGE_RE, isValidSignatureImage };
