// import React from "react";

// const Home = () => {
//   return (
//     <div className="homepage">
//       <main>
//         <h1>סתם טקסט שלקחנו מגיפיטי</h1>
//         <section id="about">
//           <h2>מהו אבחון פסיכודידקטי?</h2>
//           <p>
//             אבחון פסיכודידקטי הוא תהליך מקיף שמטרתו להבין את הכישורים
//             הקוגניטיביים, הלימודיים וההתנהגותיים של הילד או המתבגר. האבחון מסייע
//             בזיהוי קשיים בלמידה, בכישורי קריאה וכתיבה, ומספק כלים מותאמים
//             להתמודדות עם אתגרים לימודיים.
//           </p>
//         </section>

//         <section id="types">
//           <h2>סוגי אבחונים פסיכודידקטיים</h2>
//           <p>
//             קיימים מספר סוגי אבחונים פסיכודידקטיים בהתאם לצרכים של הילד או
//             המתבגר:
//           </p>
//           <ul>
//             <li>
//               אבחון קוגניטיבי – בוחן את יכולות החשיבה, פתרון בעיות וזיכרון.
//             </li>
//             <li>אבחון למידה – מתמקד בכישורי קריאה, כתיבה ומתמטיקה.</li>
//             <li>
//               אבחון רגשי והתנהגותי – בוחן גורמים רגשיים והשפעתם על הלמידה.
//             </li>
//             <li>
//               אבחון משולב – שילוב של מספר סוגי אבחונים להתאמה מקיפה לצרכי הילד.
//             </li>
//           </ul>
//         </section>

//         <section id="contact">
//           <h2>פנייה</h2>
//           <p>
//             נשמח לעמוד לשירותכם לכל שאלה או בקשה למידע נוסף. ניתן לפנות אלינו
//             דרך טופס יצירת הקשר או באמצעות כפתורי ההרשמה והכניסה למשתמשים.
//           </p>
//         </section>
//       </main>

//       <style>{`
//         .homepage {
//           font-family: Arial, sans-serif;
//           direction: rtl;
//         }

//         main {
//           padding: 20px;
//         }

//         section {
//           margin-bottom: 40px;
//         }

//         h1, h2 {
//           color: #333;
//         }

//         p {
//           line-height: 1.6;
//         }

//         ul {
//           padding-left: 20px;
//         }

//       `}</style>
//     </div>
//   );
// };

// export default Home;
import React from "react";
import {
  BookOpen,
  BrainCircuit,
  HeartPulse,
  Layers,
  MessageSquare,
  UserCircle,
} from "lucide-react"; // ייבוא האייקונים

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-right font-sans" dir="rtl">
      <main className="max-w-5xl mx-auto py-12 px-6">
        {/* כותרת עליונה */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-dolev-blue mb-4">
            אבחון פסיכודידקטי במרכז דולב
          </h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto">
            בחרו את התוכן המתאים עבורכם וקבלו ליווי מקצועי לאורך כל הדרך
          </p>
        </div>

        {/* Role Cards - כמו בהשראה של הלקוח */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-pointer group">
            <div className="bg-blue-50 p-4 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
              <UserCircle className="w-10 h-10 text-dolev-blue" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              מידע להורים
            </h3>
            <button className="text-dolev-blue font-medium text-sm">
              למאמרים והנחיות {">"}
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-pointer group">
            <div className="bg-blue-50 p-4 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
              <BookOpen className="w-10 h-10 text-dolev-blue" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              לאנשי חינוך
            </h3>
            <button className="text-dolev-blue font-medium text-sm">
              כלים פדגוגיים {">"}
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-pointer group">
            <div className="bg-blue-50 p-4 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
              <BrainCircuit className="w-10 h-10 text-dolev-blue" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">למאבחנים</h3>
            <button className="text-dolev-blue font-medium text-sm">
              כניסה לאזור המקצועי {">"}
            </button>
          </div>
        </div>

        {/* סוגי אבחונים עם אייקונים קטנים */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm mb-12 border border-gray-100">
          <div className="flex items-center gap-3 mb-8 border-r-4 border-dolev-blue pr-4">
            <h2 className="text-2xl font-bold text-gray-800">
              סוגי אבחונים במרכז
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl items-start">
              <BrainCircuit className="w-8 h-8 text-dolev-blue flex-shrink-0" />
              <div>
                <h4 className="font-bold text-gray-800">אבחון קוגניטיבי</h4>
                <p className="text-gray-600 text-sm">
                  בחינת יכולות חשיבה, פתרון בעיות וזיכרון.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl items-start">
              <BookOpen className="w-8 h-8 text-dolev-blue flex-shrink-0" />
              <div>
                <h4 className="font-bold text-gray-800">אבחון למידה</h4>
                <p className="text-gray-600 text-sm">
                  התמקדות בכישורי קריאה, כתיבה ומתמטיקה.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl items-start">
              <HeartPulse className="w-8 h-8 text-dolev-blue flex-shrink-0" />
              <div>
                <h4 className="font-bold text-gray-800">אבחון רגשי</h4>
                <p className="text-gray-600 text-sm">
                  בחינת גורמים רגשיים והשפעתם על הלמידה.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl items-start">
              <Layers className="w-8 h-8 text-dolev-blue flex-shrink-0" />
              <div>
                <h4 className="font-bold text-gray-800">אבחון משולב</h4>
                <p className="text-gray-600 text-sm">
                  שילוב מספר תחומים להתאמה מקיפה לצרכי הילד.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA (Call to Action) */}
        <section className="bg-dolev-blue text-white p-10 rounded-[2.5rem] shadow-xl text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
            <h2 className="text-3xl font-bold mb-4">מוכנים להתחיל בתהליך?</h2>
            <p className="mb-8 opacity-90 text-lg max-w-xl">
              הצוות שלנו כאן כדי לעזור לכם להבין את הצרכים הייחודיים של ילדכם.
            </p>
            <button className="bg-white text-dolev-blue font-bold py-4 px-10 rounded-full hover:bg-gray-100 transition-all shadow-lg hover:scale-105 active:scale-95">
              פתיחת פנייה חדשה
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
