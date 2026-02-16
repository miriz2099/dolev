// frontend/src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth.service"; // הייבוא מהסרוויס שיצרנו

const Register = () => {
  const navigate = useNavigate();

  // 1. ניהול ה-State של הטופס
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: "client", // ברירת מחדל: הורה/לקוח
    status: "pending", // סטטוס ראשוני - מחכה לאישור
    createdAt: new Date(),
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. פונקציה לעדכון השדות
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 3. שליחת הטופס
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // קריאה לפונקציה מה-Service שיצרנו קודם
      await registerUser(formData.email, formData.password, formData);

      alert("Registration successful! Welcome to Dolev.");

      // ניווט לדף הבית או לאזור האישי אחרי הרשמה מוצלחת
      navigate("/");
    } catch (err) {
      console.error(err);
      // הצגת הודעה ידידותית למשתמש במקרה של שגיאה
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Failed to register. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="register-container"
      style={{ maxWidth: "400px", margin: "50px auto", direction: "rtl" }}
    >
      <h2>הרשמה למערכת דולב</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="text"
          name="firstName"
          placeholder="שם פרטי"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="lastName"
          placeholder="שם משפחה"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="טלפון נייד"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="אימייל"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="סיסמה (לפחות 6 תווים)"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* בחירת תפקיד - אפשר להסתיר את זה אם ההרשמה היא רק להורים */}
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="patient">הורה / לקוח</option>
          <option value="therapist">פסיכולוג (לצורך בדיקה)</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: "10px", cursor: "pointer" }}
        >
          {loading ? "נרשם..." : "הירשם"}
        </button>
      </form>
    </div>
  );
};

export default Register;
