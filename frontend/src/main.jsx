import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { AuthProvider } from "./contexts/AuthContext"; // <--- ייבוא
import { PageProvider } from "./contexts/PageContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* עוטפים את הכל ב-AuthProvider */}
    <AuthProvider>
      <PageProvider>
        <App />
      </PageProvider>
    </AuthProvider>
  </React.StrictMode>,
);
