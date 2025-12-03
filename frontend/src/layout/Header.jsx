import logoImage from "../assets/logo.svg";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src={logoImage} alt="Company Logo" />
      </div>
      <div className="user-area">
        <span>this is the header for all pages</span>
        <button>log in</button>
      </div>
      <style>{`
      .logo img {
            height: 40px; /* קצת פחות מהגובה של ההדר כולו */
            width: auto;  /* שומר על הפרופורציות */
            display: block;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
          background-color: #2b6df6; /* כחול הלוגו */
          color: white;
          height: 60px;
        }
        .user-area span {
          margin-right: 15px;
        }
      `}</style>
    </header>
  );
}
