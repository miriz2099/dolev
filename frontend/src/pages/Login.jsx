// // frontend/src/pages/Login.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginUser } from "../services/auth.service"; // שימי לב שאנחנו מייבאים את הלוגין הפעם

// const Login = () => {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       // 1. שליחת הבקשה לפיירבייס
//       const userProfile = await loginUser(email, password);

//       console.log("Logged in user:", userProfile);

//       if (userProfile.status === "pending") {
//         setError("חשבונך ממתין לאישור מנהל.");
//         setLoading(false);
//         return;
//       }

//       navigate("/", { replace: true });
//     } catch (err) {
//       console.error(err);
//       // טיפול בשגיאות נפוצות
//       if (err.code === "auth/invalid-credential") {
//         setError("האימייל או הסיסמה שגויים");
//       } else {
//         setError("שגיאה בהתחברות, נסה שוב מאוחר יותר");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         maxWidth: "400px",
//         margin: "50px auto",
//         direction: "rtl",
//         textAlign: "center",
//       }}
//     >
//       <h2>כניסה למערכת</h2>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <form
//         onSubmit={handleSubmit}
//         style={{ display: "flex", flexDirection: "column", gap: "15px" }}
//       >
//         <input
//           type="email"
//           placeholder="אימייל"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           style={{ padding: "10px" }}
//         />

//         <input
//           type="password"
//           placeholder="סיסמה"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           style={{ padding: "10px" }}
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           style={{
//             padding: "10px",
//             cursor: "pointer",
//             backgroundColor: "#4CAF50",
//             color: "white",
//             border: "none",
//           }}
//         >
//           {loading ? "מתחבר..." : "התחבר"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;

// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/auth.service";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userProfile = await loginUser(email, password);
      console.log("Logged in user:", userProfile);

      if (userProfile.status === "pending") {
        setError("חשבונך ממתין לאישור מנהל.");
        setLoading(false);
        return;
      }

      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
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
      className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans"
      dir="rtl"
    >
      <div className="w-full max-w-md">
        {/* כרטיס ראשי */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* כותרת עליונה עם גרדיאנט */}
          <div className="bg-gradient-to-l from-blue-600 to-blue-700 p-8 text-white text-center">
            <h1 className="text-3xl font-bold">ברוכים השבים</h1>
            <p className="text-blue-100 text-sm mt-2">
              התחברו למרכז דולב לאבחון
            </p>
          </div>

          {/* טופס */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {/* הודעת שגיאה */}
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-red-700 text-sm flex items-start gap-2">
                <span className="text-lg">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* שדה אימייל */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                אימייל
              </label>
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  ✉️
                </span>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  dir="ltr"
                  className="w-full px-10 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-right transition-all"
                />
              </div>
            </div>

            {/* שדה סיסמה */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                סיסמה
              </label>
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔒
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="הזיני סיסמה"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-10 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* כפתור התחברות */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold text-white text-lg shadow-lg transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-200"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚙️</span>
                  מתחבר...
                </span>
              ) : (
                "התחברות"
              )}
            </button>
          </form>
        </div>

        {/* פוטר */}
        <p className="text-center text-gray-400 text-xs mt-6">
          © 2026 דולב - מערכת לאבחון פסיכו-דידקטי
        </p>
      </div>
    </div>
  );
};

export default Login;
