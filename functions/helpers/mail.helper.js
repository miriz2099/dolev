// src/helpers/mail.helper.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER, // ⚠️ תמיד מה-env, לא hardcoded
    pass: process.env.SMTP_PASS,
  },
});

const sendWelcomeEmail = async ({ to, firstName, role, resetLink }) => {
  const roleLabel = role === "patient" ? "הורה" : "מאבחן/ת";

  const mailOptions = {
    from: `"מרכז האבחון דולב" <${process.env.SMTP_USER}>`,
    to,
    subject: "הוקם עבורך חשבון במערכת – הגדרת סיסמה",
    html: `
      <div dir="rtl" style="font-family: sans-serif; text-align: right; line-height: 1.6;">
        <h2>שלום ${firstName},</h2>
        <p>נפתח עבורך חשבון ${roleLabel} במערכת.</p>
        <p>כדי להשלים את ההרשמה ולהגדיר סיסמה אישית, יש ללחוץ על הכפתור:</p>
        <div style="margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">
            הגדרת סיסמה וכניסה למערכת
          </a>
        </div>
        <p style="color:#6b7280; font-size: 14px;">הקישור אישי ומאובטח. לאחר הגדרת הסיסמה ניתן להתחבר עם המייל והסיסמה שבחרת.</p>
        <p>בברכה,<br/>צוות מרכז האבחון דולב</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendWelcomeEmail };