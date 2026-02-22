// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.service"; // שימי לב שאנחנו מייבאים את הלוגין הפעם

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. שליחת הבקשה לפיירבייס
      const userProfile = await loginUser(email, password);

      console.log("Logged in user:", userProfile);

      // 2. ניווט לפי התפקיד של המשתמש (לוגיקה חכמה)
      // if (userProfile.role === "admin" || userProfile.role === "therapist") {
      //   navigate("/patients"); // פסיכולוג הולך לרשימת מטופלים
      // } else {
      //   navigate("/"); // הורה הולך לדף הבית
      // }
      // בתוך try אחרי קבלת userProfile
      if (userProfile.status === "pending") {
        setError("חשבונך ממתין לאישור מנהל. הודעה תישלח בסיום התהליך.");
        setLoading(false);
        return;
      }

      // ניווט חכם
      if (userProfile.role === "admin") {
        navigate("/patients"); // דף ניהול ייעודי
      } else if (userProfile.role === "therapist") {
        navigate("/patients");
      } else {
        navigate("/diagnos");
      }
    } catch (err) {
      console.error(err);
      // טיפול בשגיאות נפוצות
      if (err.code === "auth/invalid-credential") {
        setError("האימייל או הסיסמה שגויים");
      } else {
        setError("שגיאה בהתחברות, נסה שוב מאוחר יותר");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        direction: "rtl",
        textAlign: "center",
      }}
    >
      <h2>כניסה למערכת</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          type="email"
          placeholder="אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "10px" }}
        />

        <input
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "10px" }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
          }}
        >
          {loading ? "מתחבר..." : "התחבר"}
        </button>
      </form>

      {/* <p style={{ marginTop: "20px" }}>
        אין לך חשבון? <a href="/register">הירשם כאן</a>
      </p> */}
    </div>
  );
};

export default Login;
