import logoImage from "../assets/logo.svg";

export default function Header() {
  return (
    // בתוך Header.jsx
    <header className="header">
      <div className="logo-section">
        <img src={logoImage} alt="Company Logo" />
        <span className="company-name">איבחונים פסיכודידקטים</span>
      </div>

      <div className="user-area">
        <button className="login-btn">
          <span className="login-icon">👤</span> כניסה
        </button>
      </div>

      <style>{`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      background-color: #f8f3eb;
      height: 50px; 
      border-bottom: 1px solid rgba(0,0,0,0.05);
      flex-shrink: 0;
    }
    .logo-section {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-section img {
      height: 35px; 
    }
    .company-name {
      font-weight: bold;
      color: #261d33ff;
    }
    .login-btn {
      background: none;
      border: 1px solid #261d33;
      padding: 5px 12px;
      border-radius: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
    }
  `}</style>
    </header>
  );
}
