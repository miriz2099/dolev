// export default Home;
import React, { useState } from "react";
import {
  BookOpen,
  BrainCircuit,
  HeartPulse,
  Layers,
  MessageSquare,
  UserCircle,
  Target,
  Users,
  CheckCircle2,
} from "lucide-react";
import ContactModal from "../components/ContactModal";

const Home = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50 text-right font-sans" dir="rtl">
      <main className="max-w-5xl mx-auto py-12 px-6">
        {/* כותרת עליונה - Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-6">
            אבחון פסיכודידקטי במרכז דולב
          </h1>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 max-w-4xl mx-auto">
            <p className="text-gray-700 text-lg leading-relaxed">
              אבחון פסיכודידקטי הוא תהליך הערכה מקיף שמטרתו להבין את אופן הלמידה
              של הילד או המתבגר, לזהות קשיים לימודיים ורגשיים המשפיעים על התפקוד
              בבית הספר, ולהציע המלצות מותאמות להמשך הדרך.
            </p>
          </div>
        </div>

        {/* Role Cards - קהלי יעד */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all cursor-pointer group">
            <div className="bg-blue-50 p-4 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
              <UserCircle className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              מידע להורים
            </h3>
            <button className="text-blue-600 font-medium text-sm">
              למאמרים והנחיות {">"}
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all cursor-pointer group">
            <div className="bg-blue-50 p-4 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
              <BookOpen className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              לאנשי חינוך
            </h3>
            <button className="text-blue-600 font-medium text-sm">
              כלים פדגוגיים {">"}
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all cursor-pointer group">
            <div className="bg-blue-50 p-4 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
              <BrainCircuit className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">למאבחנים</h3>
            <button className="text-blue-600 font-medium text-sm">
              כניסה לאזור המקצועי {">"}
            </button>
          </div>
        </div> */}

        {/* שילוב תחומים - פסיכולוגי ודידקטי */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-[2.5rem] border border-blue-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <HeartPulse className="w-8 h-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-800">
                התחום הפסיכולוגי
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              עוסק ביכולות קוגניטיביות, תפקודים רגשיים, כוחות, דימוי עצמי, סגנון
              התמודדות וקשיים רגשיים אפשריים.
            </p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-[2.5rem] border border-indigo-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-indigo-600" />
              <h3 className="text-2xl font-bold text-gray-800">
                התחום הדידקטי
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              בוחן מיומנויות למידה כגון קריאה, כתיבה, הבנת הנקרא, חשבון, ארגון,
              קשב וזיכרון, וכן את הפער בין היכולת להישגים.
            </p>
          </div>
        </section>

        {/* מטרות האבחון */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm mb-16 border border-gray-100">
          <div className="flex items-center gap-3 mb-10 border-r-4 border-blue-600 pr-4">
            <h2 className="text-3xl font-bold text-gray-800">מטרות האבחון</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
            {[
              {
                text: "זיהוי לקויות למידה, קשיי קשב וריכוז וקשיים תפקודיים ",
                icon: <Target className="text-blue-500" />,
              },
              {
                text: "הבנת הקשר בין גורמים רגשיים לבין תפקוד לימודי ",
                icon: <HeartPulse className="text-blue-500" />,
              },
              {
                text: "איתור חוזקות וכוחות אישיים בתהליך הלמידה ",
                icon: <BrainCircuit className="text-blue-500" />,
              },
              {
                text: "התאמת המלצות חינוכות, לימודיות ורגשיות ",
                icon: <CheckCircle2 className="text-blue-500" />,
              },
              {
                text: "בסיס מקצועי להתאמות במערכת החינוך (זמן נוסף, הקראה ועוד) ",
                icon: <Layers className="text-blue-500" />,
              },
            ].map((goal, index) => (
              <div key={index} className="flex gap-4 items-center">
                <div className="bg-blue-50 p-2 rounded-lg">{goal.icon}</div>
                <span className="text-gray-700 font-medium">{goal.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* למי מיועד האבחון */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              למי מיועד האבחון?
            </h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "פער מתמשך בין יכולת להבנה ולהישגים לימודיים ",
              "קשיים בקריאה, כתיבה או חשבון ",
              "ירידה במוטיבציה, תסכול או חרדה סביב לימודים ",
              "קשיי קשב, ארגון והתמדה ",
              "צורך בהבהרת תמונת התפקוד לצורך קבלת התאמות ",
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white p-5 rounded-2xl shadow-sm border border-gray-50"
              >
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* סיכום וקריאה לפעולה - CTA */}
        <section className="bg-blue-600 text-white p-12 rounded-[2.5rem] shadow-xl text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <MessageSquare className="w-16 h-16 mb-6 opacity-20" />
            <h2 className="text-3xl font-bold mb-6 italic leading-relaxed">
              "האבחון אינו תווית, אלא כלי להבנה מעמיקה ולבניית מענה מותאם"
            </h2>
            <p className="mb-10 opacity-90 text-xl max-w-2xl">
              הצוות שלנו כאן כדי לעזור לילדכם לממש את הפוטנציאל שלו תוך חיזוק
              תחושת המסוגלות והביטחון העצמי.
            </p>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="bg-white text-blue-600 font-bold py-4 px-12 rounded-full hover:bg-gray-100 transition-all shadow-lg hover:scale-105 active:scale-95 text-lg"
            >
              פתיחת פנייה חדשה
            </button>
          </div>
        </section>
      </main>
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

export default Home;
