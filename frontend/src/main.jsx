import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { AuthProvider } from "./contexs/AuthContext"; // <--- ייבוא

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* עוטפים את הכל ב-AuthProvider */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
