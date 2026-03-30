// // // // import React from "react";

// // // const InfoRow = ({ label, value }) => (
// // //   <div className="flex border-b border-gray-50 py-2">
// // //     <span className="text-gray-500 w-1/3 text-sm">{label}:</span>
// // //     <span className="text-gray-900 font-medium w-2/3">{value || "---"}</span>
// // //   </div>
// // // );

// // // const SectionHeader = ({ title, icon }) => (
// // //   <h4 className="text-lg font-bold text-blue-900 mb-4 mt-8 flex items-center gap-2 border-r-4 border-blue-600 pr-3 bg-blue-50/50 py-2 rounded-l-lg">
// // //     <span>{icon}</span> {title}
// // //   </h4>
// // // );

// // // const SchoolSurveyView = ({ data }) => {
// // //   if (!data)
// // //     return (
// // //       <div className="p-20 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
// // //         לא נמצא מידע מהשאלון.
// // //       </div>
// // //     );

// // //   const { formData, teacherName, teacherEmail, submittedAt } = data;

// // //   return (
// // //     <div
// // //       className="space-y-6 animate-fadeIn text-right font-sans max-w-5xl mx-auto"
// // //       dir="rtl"
// // //     >
// // //       {/* כותרת עליונה */}
// // //       <div className="bg-white p-8 rounded-3xl border border-blue-100 shadow-sm flex justify-between items-start">
// // //         <div>
// // //           <h2 className="text-2xl font-bold text-gray-800">
// // //             שאלון צוות חינוכי - דוח מלא
// // //           </h2>
// // //           <p className="text-blue-600 font-medium mt-1">
// // //             תלמיד/ה: {formData.firstName} {formData.lastName}
// // //           </p>
// // //         </div>
// // //         <div className="text-left">
// // //           <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold mb-2 inline-block">
// // //             סטטוס: התקבל
// // //           </div>
// // //           <p className="text-gray-400 text-xs">
// // //             נשלח ב: {new Date(submittedAt).toLocaleString("he-IL")}
// // //           </p>
// // //         </div>
// // //       </div>

// // //       <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
// // //         {/* 1. פרטים אישיים ומסגרת */}
// // //         <SectionHeader title="פרטים אישיים ומסגרת חינוכית" icon="👤" />
// // //         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
// // //           <InfoRow
// // //             label="שם מלא"
// // //             value={`${formData.firstName} ${formData.lastName}`}
// // //           />
// // //           <InfoRow label="ת.ז" value={formData.idNumber} />
// // //           <InfoRow
// // //             label="מין"
// // //             value={formData.gender === "ז" ? "זכר" : "נקבה"}
// // //           />
// // //           <InfoRow label="תאריך לידה" value={formData.birthDate} />
// // //           <InfoRow label="בית ספר" value={formData.school} />
// // //           <InfoRow label="כיתה" value={formData.grade} />
// // //           <InfoRow label="שם המחנך/ת" value={teacherName} />
// // //           <InfoRow label="מייל מורה" value={teacherEmail} />
// // //         </div>

// // //         {/* 2. סיבת ההפניה */}
// // //         <SectionHeader title="סיבת ההפניה" icon="🚩" />
// // //         <div className="space-y-4">
// // //           <div>
// // //             <p className="text-sm font-bold text-gray-600 mb-1">יוזם הפנייה:</p>
// // //             <p className="bg-gray-50 p-3 rounded-xl border border-gray-100">
// // //               {formData.referralInitiator || "לא צוין"}
// // //             </p>
// // //           </div>
// // //           <div>
// // //             <p className="text-sm font-bold text-gray-600 mb-1">
// // //               סיבות הפנייה:
// // //             </p>
// // //             <p className="bg-gray-50 p-3 rounded-xl border border-gray-100">
// // //               {formData.referralReasons || "לא צוין"}
// // //             </p>
// // //           </div>
// // //           <div>
// // //             <p className="text-sm font-bold text-gray-600 mb-1">
// // //               תיאור הקשיים ותדירותם:
// // //             </p>
// // //             <p className="bg-gray-50 p-3 rounded-xl border border-gray-100">
// // //               {formData.difficultyDescription || "אין תיאור"}
// // //             </p>
// // //           </div>
// // //         </div>

// // //         {/* 3. הישגים לימודיים */}
// // //         <SectionHeader title="הישגים לימודיים" icon="📚" />
// // //         <div className="mb-6">
// // //           <p className="text-sm font-bold text-gray-600 mb-2">
// // //             מהלך לימודים (היסטוריה):
// // //           </p>
// // //           <table className="w-full text-sm border-collapse border border-gray-100 rounded-lg overflow-hidden">
// // //             <thead className="bg-gray-50">
// // //               <tr>
// // //                 <th className="border border-gray-100 p-2 text-right">כיתה</th>
// // //                 <th className="border border-gray-100 p-2 text-right">
// // //                   בית ספר
// // //                 </th>
// // //               </tr>
// // //             </thead>
// // //             <tbody>
// // //               {formData.schoolHistory?.map((item, i) => (
// // //                 <tr key={i}>
// // //                   <td className="border border-gray-100 p-2">{item.grade}</td>
// // //                   <td className="border border-gray-100 p-2">{item.school}</td>
// // //                 </tr>
// // //               ))}
// // //             </tbody>
// // //           </table>
// // //         </div>

// // //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
// // //           <div className="bg-blue-50/30 p-4 rounded-2xl border border-blue-50">
// // //             <p className="text-sm text-blue-800 font-bold mb-1">
// // //               רמה אקדמית ביחס לכיתה:
// // //             </p>
// // //             <p className="text-lg font-bold text-blue-900">
// // //               {formData.academicLevel}
// // //             </p>
// // //           </div>
// // //           <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
// // //             <p className="text-sm text-gray-600 font-bold mb-1">נשאר כיתה?</p>
// // //             <p className="font-medium">
// // //               {formData.stayedGrade}{" "}
// // //               {formData.stayedGradeWhich
// // //                 ? `(כיתה ${formData.stayedGradeWhich})`
// // //                 : ""}
// // //             </p>
// // //             {formData.stayedGradeReasons && (
// // //               <p className="text-xs text-gray-500 mt-1">
// // //                 סיבות: {formData.stayedGradeReasons}
// // //               </p>
// // //             )}
// // //           </div>
// // //         </div>

// // //         <p className="text-sm font-bold text-gray-600 mb-2">
// // //           שליטה במקצועות יסוד:
// // //         </p>
// // //         <div className="grid grid-cols-1 gap-3 mb-6">
// // //           {["reading", "writing", "math"].map((subject) => (
// // //             <div key={subject} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
// // //               <span className="font-bold text-gray-700 w-24">
// // //                 {subject === "reading"
// // //                   ? "קריאה:"
// // //                   : subject === "writing"
// // //                     ? "כתיבה:"
// // //                     : "חשבון:"}
// // //               </span>
// // //               <p className="text-gray-600 flex-1 italic">
// // //                 {formData[subject] || "לא פורט"}
// // //               </p>
// // //             </div>
// // //           ))}
// // //         </div>

// // //         {/* 4. יחסים והתנהגות */}
// // //         <SectionHeader title="יחסים והתנהגות" icon="🤝" />
// // //         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
// // //           <div>
// // //             <p className="text-sm font-bold text-gray-600 mb-2">יחס למורים:</p>
// // //             <div className="p-3 bg-blue-50 rounded-xl text-blue-900 font-bold border border-blue-100">
// // //               {formData.teacherRelation}
// // //             </div>
// // //             <p className="text-xs text-gray-500 mt-2">
// // //               הערות: {formData.teacherRelationNotes || "אין"}
// // //             </p>
// // //           </div>
// // //           <div>
// // //             <p className="text-sm font-bold text-gray-600 mb-2">
// // //               יחס לבני הכיתה:
// // //             </p>
// // //             <div className="p-3 bg-green-50 rounded-xl text-green-900 font-bold border border-green-100">
// // //               {formData.peerRelation}
// // //             </div>
// // //             <p className="text-xs text-gray-500 mt-2">
// // //               בעיות חברתיות: {formData.peerProblems || "אין"}
// // //             </p>
// // //           </div>
// // //         </div>

// // //         <p className="text-sm font-bold text-gray-600 mb-2 font-mono uppercase tracking-widest text-center">
// // //           --- סולם קשב והתנהגות (6 חודשים אחרונים) ---
// // //         </p>
// // //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //           {[
// // //             { k: "distractedEasily", l: "דעתו מוסחת בקלות" },
// // //             { k: "hardToFocus", l: "מתקשה להתרכז במשימות" },
// // //             { k: "excessiveMovement", l: "תנועתיות יתרה / מטפס" },
// // //             { k: "leavesSeats", l: "עוזב את הכסא בשיעור" },
// // //           ].map((item) => (
// // //             <div
// // //               key={item.k}
// // //               className="flex justify-between items-center p-3 border-b border-gray-100"
// // //             >
// // //               <span className="text-gray-700">{item.l}:</span>
// // //               <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
// // //                 {formData[item.k]}
// // //               </span>
// // //             </div>
// // //           ))}
// // //         </div>

// // //         {/* 5. בעיות התנהגות מפורטות */}
// // //         <SectionHeader title="בעיות התנהגות מפורטות" icon="⚠️" />
// // //         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-1">
// // //           {Object.entries(formData.behaviorRatings || {}).map(
// // //             ([behavior, rating]) => (
// // //               <div
// // //                 key={behavior}
// // //                 className="flex justify-between py-1.5 border-b border-gray-50 text-sm"
// // //               >
// // //                 <span
// // //                   className={
// // //                     rating !== "כלל לא"
// // //                       ? "font-bold text-red-600"
// // //                       : "text-gray-500"
// // //                   }
// // //                 >
// // //                   {behavior}
// // //                 </span>
// // //                 <span
// // //                   className={`font-medium ${rating !== "כלל לא" ? "text-red-700" : "text-gray-400"}`}
// // //                 >
// // //                   {rating}
// // //                 </span>
// // //               </div>
// // //             ),
// // //           )}
// // //         </div>

// // //         {/* 6. עזרה מיוחדת וסיכום */}
// // //         <SectionHeader title="עזרה מיוחדת וסיכום" icon="🏁" />
// // //         <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100 space-y-4">
// // //           <div className="grid grid-cols-3 gap-4">
// // //             <InfoRow label="שעות שילוב" value={formData.integrationHours} />
// // //             <InfoRow label="היקף ש'ש" value={formData.integrationScope} />
// // //             <InfoRow label="מספר שנים" value={formData.integrationYears} />
// // //           </div>
// // //           <InfoRow
// // //             label="טיפול רגשי"
// // //             value={`${formData.emotionalTreatment} ${formData.emotionalTreatmentDetails ? `(${formData.emotionalTreatmentDetails})` : ""}`}
// // //           />
// // //           <InfoRow
// // //             label="חינוך מיוחד"
// // //             value={`${formData.specialEducation} ${formData.specialEdName ? `(מסגרת: ${formData.specialEdName})` : ""}`}
// // //           />

// // //           <div className="mt-6">
// // //             <p className="text-sm font-bold text-amber-900 mb-2">
// // //               סיכום והתרשמות המורה:
// // //             </p>
// // //             <p className="text-gray-800 leading-relaxed bg-white p-4 rounded-2xl border border-amber-100 shadow-sm italic">
// // //               "{formData.studentSummary || "לא הוזן סיכום"}"
// // //             </p>
// // //           </div>

// // //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
// // //             <div>
// // //               <p className="text-xs font-bold text-amber-800 mb-1">
// // //                 שאלה אבחונית:
// // //               </p>
// // //               <p className="text-sm text-gray-700">
// // //                 {formData.diagnosticQuestion || "אין"}
// // //               </p>
// // //             </div>
// // //             <div>
// // //               <p className="text-xs font-bold text-amber-800 mb-1">
// // //                 התערבות מבוקשת:
// // //               </p>
// // //               <p className="text-sm text-gray-700">
// // //                 {formData.requestedIntervention || "אין"}
// // //               </p>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* חתימות */}
// // //         <div className="mt-12 flex justify-around border-t border-gray-100 pt-8 text-center text-xs text-gray-400">
// // //           <div>
// // //             <p className="font-bold text-gray-600">חתימת מורה:</p>
// // //             <p className="mt-1 italic">
// // //               {formData.teacherSignature || "חתימה דיגיטלית"}
// // //             </p>
// // //             <p>{formData.teacherSignatureName}</p>
// // //           </div>
// // //           <div>
// // //             <p className="font-bold text-gray-600">חתימת מנהל/ת:</p>
// // //             <p className="mt-1 italic">
// // //               {formData.principalSignature || "---"}
// // //             </p>
// // //           </div>
// // //           <div>
// // //             <p className="font-bold text-gray-600">תאריך חתימה:</p>
// // //             <p className="mt-1">{formData.signatureDate || formData.date}</p>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default SchoolSurveyView;

// // import React from "react";
// // import {
// //   User,
// //   BookOpen,
// //   AlertTriangle,
// //   Users,
// //   ClipboardCheck,
// //   GraduationCap,
// //   Calendar,
// //   Mail,
// // } from "lucide-react"; // כדאי להתקין lucide-react, אם אין - נחליף לאימוג'ים

// // const SchoolSurveyView = ({ data }) => {
// //   if (!data)
// //     return (
// //       <div className="p-20 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl animate-pulse">
// //         🏫 ממתין לנתוני שאלון בית הספר...
// //       </div>
// //     );

// //   const { formData, teacherName, teacherEmail, submittedAt } = data;

// //   // פונקציית עזר להדגשת רמת חומרה בבעיות התנהגות
// //   const getSeverityClass = (rating) => {
// //     if (rating === "הרבה מאד")
// //       return "bg-red-100 text-red-700 border-red-200 font-bold";
// //     if (rating === "הרבה")
// //       return "bg-orange-100 text-orange-700 border-orange-200";
// //     if (rating === "במקצת")
// //       return "bg-yellow-50 text-yellow-700 border-yellow-100";
// //     return "bg-gray-50 text-gray-400 border-gray-100";
// //   };

// //   return (
// //     <div className="max-w-6xl mx-auto font-sans text-right space-y-6" dir="rtl">
// //       {/* --- HEADER: כותרת ופרטי מילוי --- */}
// //       <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-wrap justify-between items-center gap-4">
// //         <div className="flex items-center gap-4">
// //           <div className="bg-blue-600 p-4 rounded-2xl text-white">
// //             <GraduationCap size={32} />
// //           </div>
// //           <div>
// //             <h2 className="text-2xl font-black text-gray-900 leading-tight">
// //               דוח הערכה חינוכית
// //             </h2>
// //             <p className="text-blue-600 font-bold flex items-center gap-2">
// //               {formData.firstName} {formData.lastName}{" "}
// //               <span className="text-gray-300">|</span> כיתה {formData.grade}
// //             </p>
// //           </div>
// //         </div>
// //         <div className="bg-gray-50 p-4 rounded-2xl flex gap-6 text-sm border border-gray-100">
// //           <div className="flex flex-col">
// //             <span className="text-gray-400">מחנך/ת מדווח/ת</span>
// //             <span className="font-bold text-gray-700">{teacherName}</span>
// //           </div>
// //           <div className="w-px bg-gray-200" />
// //           <div className="flex flex-col">
// //             <span className="text-gray-400">תאריך שליחה</span>
// //             <span className="font-bold text-gray-700 font-mono">
// //               {new Date(submittedAt).toLocaleDateString("he-IL")}
// //             </span>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
// //         {/* --- LEFT COLUMN: נתוני רקע (4 עמודות) --- */}
// //         <div className="lg:col-span-4 space-y-6">
// //           {/* פרטי תלמיד מהירים */}
// //           <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
// //             <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
// //               <User size={18} className="text-blue-500" /> פרטים אישיים
// //             </h3>
// //             <div className="space-y-3">
// //               <div className="flex justify-between">
// //                 <span className="text-gray-400">ת.ז:</span>{" "}
// //                 <span className="font-medium">{formData.idNumber}</span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-gray-400">ת. לידה:</span>{" "}
// //                 <span className="font-medium">{formData.birthDate}</span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-gray-400">בית ספר:</span>{" "}
// //                 <span className="font-medium">{formData.school}</span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-gray-400">מייל מורה:</span>{" "}
// //                 <span className="text-blue-600 underline text-xs">
// //                   {teacherEmail}
// //                 </span>
// //               </div>
// //             </div>
// //           </div>

// //           {/* מהלך לימודים */}
// //           <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
// //             <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
// //               <Calendar size={18} className="text-purple-500" /> היסטוריית
// //               מוסדות
// //             </h3>
// //             <div className="space-y-3">
// //               {formData.schoolHistory
// //                 ?.filter((h) => h.school)
// //                 .map((h, i) => (
// //                   <div
// //                     key={i}
// //                     className="flex gap-3 items-center text-sm p-2 bg-purple-50 rounded-xl border border-purple-100"
// //                   >
// //                     <span className="font-bold text-purple-700 w-8">
// //                       {h.grade}
// //                     </span>
// //                     <span className="text-purple-900">{h.school}</span>
// //                   </div>
// //                 ))}
// //               {(!formData.schoolHistory ||
// //                 formData.schoolHistory.length === 0) && (
// //                 <p className="text-gray-300 text-sm">אין היסטוריה מתועדת</p>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* --- MAIN COLUMN: תוכן פדגוגי והתנהגותי (8 עמודות) --- */}
// //         <div className="lg:col-span-8 space-y-6">
// //           {/* תפקוד לימודי - דגש על רמה אקדמית */}
// //           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
// //             <div className="absolute top-0 right-0 w-2 h-full bg-blue-500" />
// //             <div className="flex justify-between items-start mb-6">
// //               <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
// //                 <BookOpen className="text-blue-500" /> רמה אקדמית ושליטה
// //                 במיומנויות
// //               </h3>
// //               <div className="bg-blue-50 text-blue-700 px-4 py-1 rounded-xl text-sm font-black border border-blue-100">
// //                 רמה: {formData.academicLevel}
// //               </div>
// //             </div>

// //             <div className="grid grid-cols-1 gap-4">
// //               {["reading", "writing", "math"].map((subject) => (
// //                 <div
// //                   key={subject}
// //                   className="group p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100"
// //                 >
// //                   <h4 className="text-sm font-black text-blue-900 mb-1">
// //                     {subject === "reading"
// //                       ? "קריאה והבנת הנקרא"
// //                       : subject === "writing"
// //                         ? "כתיבה והבעה"
// //                         : "חשבון וחשיבה מתמטית"}
// //                   </h4>
// //                   <p className="text-gray-600 text-sm italic leading-relaxed">
// //                     {formData[subject] || "לא פורט עי המורה"}
// //                   </p>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           {/* מחוון התנהגות וקשב - תצוגה ויזואלית מהירה */}
// //           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
// //             <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
// //               <AlertTriangle className="text-orange-500" /> מחוון תצפית בכיתה (6
// //               חודשים)
// //             </h3>
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               {[
// //                 { k: "distractedEasily", l: "מוסחות בקלות" },
// //                 { k: "hardToFocus", l: "קושי בריכוז במטלות" },
// //                 { k: "excessiveMovement", l: "תנועתיות יתר" },
// //                 { k: "leavesSeats", l: "קימה מהמקום בשיעור" },
// //               ].map((item) => (
// //                 <div
// //                   key={item.k}
// //                   className="flex flex-col p-4 bg-gray-50 rounded-2xl border border-gray-100"
// //                 >
// //                   <span className="text-xs text-gray-400 mb-2 font-bold">
// //                     {item.l}
// //                   </span>
// //                   <div className="flex items-center justify-between">
// //                     <span
// //                       className={`text-sm px-3 py-1 rounded-lg border ${getSeverityClass(formData[item.k])}`}
// //                     >
// //                       {formData[item.k] || "לא סומן"}
// //                     </span>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           {/* בעיות התנהגות מפורטות - תצוגת תוויות (Badges) */}
// //           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
// //             <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
// //               <Users className="text-red-500" /> בעיות התנהגות וקשיים חברתיים
// //             </h3>
// //             <div className="flex flex-wrap gap-2">
// //               {Object.entries(formData.behaviorRatings || {}).map(
// //                 ([behavior, rating]) =>
// //                   rating !== "כלל לא" && (
// //                     <div
// //                       key={behavior}
// //                       className={`px-4 py-2 rounded-2xl border text-sm flex items-center gap-2 ${getSeverityClass(rating)}`}
// //                     >
// //                       <span className="font-bold">{behavior}:</span>
// //                       <span className="opacity-80">{rating}</span>
// //                     </div>
// //                   ),
// //               )}
// //               {Object.values(formData.behaviorRatings || {}).every(
// //                 (v) => v === "כלל לא",
// //               ) && (
// //                 <p className="text-gray-400 italic">
// //                   לא דווחו בעיות התנהגות חריגות.
// //                 </p>
// //               )}
// //             </div>

// //             {/* פירוט יחסים */}
// //             <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-50">
// //               <div>
// //                 <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">
// //                   יחס למורים
// //                 </span>
// //                 <p className="text-gray-800 bg-blue-50 p-3 rounded-xl border border-blue-100 font-bold">
// //                   {formData.teacherRelation}
// //                 </p>
// //               </div>
// //               <div>
// //                 <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">
// //                   יחס לקבוצת השווים
// //                 </span>
// //                 <p className="text-gray-800 bg-green-50 p-3 rounded-xl border border-green-100 font-bold">
// //                   {formData.peerRelation}
// //                 </p>
// //               </div>
// //             </div>
// //           </div>

// //           {/* --- SUMMARY: סיכום והמלצות --- */}
// //           <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-200 relative">
// //             <div className="bg-amber-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center absolute -top-6 right-8 shadow-lg">
// //               <ClipboardCheck size={24} />
// //             </div>
// //             <h3 className="text-xl font-black text-amber-900 mb-4 mt-2 italic">
// //               התרשמות המחנך/ת וסיכום
// //             </h3>
// //             <p className="text-amber-900 leading-relaxed text-lg bg-white/50 p-6 rounded-3xl border border-amber-100">
// //               "{formData.studentSummary || "לא פורט סיכום מילולי"}"
// //             </p>

// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-amber-200/50">
// //               <div>
// //                 <h4 className="text-sm font-black text-amber-800 mb-2 uppercase tracking-tighter">
// //                   שאלה אבחונית של ביה"ס
// //                 </h4>
// //                 <p className="text-gray-700 bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
// //                   {formData.diagnosticQuestion || "---"}
// //                 </p>
// //               </div>
// //               <div>
// //                 <h4 className="text-sm font-black text-amber-800 mb-2 uppercase tracking-tighter">
// //                   התערבות מבוקשת
// //                 </h4>
// //                 <p className="text-gray-700 bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
// //                   {formData.requestedIntervention || "---"}
// //                 </p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* FOOTER: חתימות */}
// //       <div className="bg-gray-900 p-8 rounded-[2rem] text-white flex flex-wrap justify-around items-center text-sm gap-8 opacity-90">
// //         <div className="text-center space-y-1">
// //           <span className="text-gray-500 block">חתימת המורה</span>
// //           <span className="font-serif italic text-lg">{teacherName}</span>
// //         </div>
// //         <div className="h-10 w-px bg-gray-700 hidden md:block" />
// //         <div className="text-center space-y-1">
// //           <span className="text-gray-500 block">חתימת הנהלה</span>
// //           <span className="font-bold">
// //             {formData.principalSignature || "אושר דיגיטלית"}
// //           </span>
// //         </div>
// //         <div className="h-10 w-px bg-gray-700 hidden md:block" />
// //         <div className="text-center space-y-1">
// //           <span className="text-gray-500 block">מזהה פנימי</span>
// //           <span className="font-mono text-xs">
// //             {data.invitationId || "---"}
// //           </span>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default SchoolSurveyView;

// import React from "react";

// // שימוש ברכיבי העזר המדויקים מה-QuestionnaireViewer שלך לאחידות עיצובית
// const RenderSection = ({ title, children }) => (
//   <div className="mb-10 border-b border-gray-100 pb-8 text-right" dir="rtl">
//     <h5 className="text-xl font-bold text-blue-800 mb-6 bg-blue-50 px-4 py-2 rounded-lg w-fit shadow-sm">
//       {title}
//     </h5>
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
//       {children}
//     </div>
//   </div>
// );

// const AnswerBox = ({ label, value, wide = false, highlight = false }) => (
//   <div
//     className={`flex flex-col gap-1 text-right ${wide ? "md:col-span-2 lg:col-span-3" : ""}`}
//   >
//     <span className="text-xs font-bold text-gray-500 mb-1">{label}</span>
//     <div
//       className={`text-md font-medium p-3 rounded-xl border min-h-[45px] flex items-center shadow-inner ${
//         highlight && value && value !== "כלל לא"
//           ? "bg-red-50 border-red-200 text-red-700"
//           : "bg-gray-50 border-gray-200 text-gray-900"
//       }`}
//     >
//       {value || <span className="text-gray-300 italic">לא הוזן</span>}
//     </div>
//   </div>
// );

// const DataTable = ({ headers, rows }) => (
//   <div className="col-span-full mt-4 overflow-hidden border border-gray-200 rounded-xl shadow-sm">
//     <table className="w-full text-right border-collapse" dir="rtl">
//       <thead>
//         <tr className="bg-gray-100">
//           {headers.map((h, i) => (
//             <th
//               key={i}
//               className="p-3 text-sm font-bold text-gray-600 border-b"
//             >
//               {h}
//             </th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {rows.map((row, i) => (
//           <tr key={i} className="hover:bg-white transition-colors">
//             {row.map((cell, j) => (
//               <td
//                 key={j}
//                 className="p-3 text-sm text-gray-800 border-b border-gray-100"
//               >
//                 {cell || "—"}
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

// const SchoolSurveyView = ({ data }) => {
//   if (!data || !data.formData) {
//     return (
//       <div className="p-10 text-center text-gray-500 italic">
//         ממתין לנתוני שאלון בית הספר...
//       </div>
//     );
//   }

//   const { formData, teacherName, teacherEmail, submittedAt } = data;

//   return (
//     <div
//       className="bg-white p-8 rounded-3xl animate-fadeIn font-sans shadow-lg"
//       dir="rtl"
//     >
//       {/* 1. פרטים כלליים (דיווח המורה) */}
//       <RenderSection title="פרטי הדיווח והתלמיד">
//         <AnswerBox
//           label="שם התלמיד/ה"
//           value={`${formData.firstName} ${formData.lastName}`}
//         />
//         <AnswerBox label="כיתה" value={formData.grade} />
//         <AnswerBox label="בית ספר" value={formData.school} />
//         <AnswerBox label="שם המחנך/ת" value={teacherName} />
//         <AnswerBox label="מייל המורה" value={teacherEmail} />
//         <AnswerBox
//           label="תאריך הגשה"
//           value={new Date(submittedAt).toLocaleDateString("he-IL")}
//         />
//       </RenderSection>

//       {/* 2. סיבת ההפניה */}
//       <RenderSection title="סיבת ההפניה">
//         <AnswerBox
//           label="מי יזם את הפנייה?"
//           value={formData.referralInitiator}
//           wide
//         />
//         <AnswerBox label="סיבות הפנייה" value={formData.referralReasons} wide />
//         <AnswerBox
//           label="תיאור קשיי התלמיד (מתי החלו ותדירות)"
//           value={formData.difficultyDescription}
//           wide
//         />
//       </RenderSection>

//       {/* 3. הישגים לימודיים */}
//       <RenderSection title="הישגים לימודיים">
//         <div className="col-span-full font-bold text-gray-600 mb-2 text-sm">
//           מהלך לימודים בבי"ס:
//         </div>
//         <DataTable
//           headers={["כיתה", "בית ספר"]}
//           rows={formData.schoolHistory?.map((h) => [h.grade, h.school]) || []}
//         />
//         <AnswerBox
//           label="רמה אקדמית בהשוואה לכיתה"
//           value={formData.academicLevel}
//         />
//         <AnswerBox label="האם נשאר כיתה?" value={formData.stayedGrade} />
//         <AnswerBox
//           label="באיזו כיתה ולמה?"
//           value={`${formData.stayedGradeWhich || ""} ${formData.stayedGradeReasons || ""}`}
//           wide
//         />

//         <div className="col-span-full mt-4 font-bold text-gray-600 text-sm">
//           שליטה במקצועות יסוד:
//         </div>
//         <AnswerBox label="קריאה" value={formData.reading} wide />
//         <AnswerBox label="כתיבה" value={formData.writing} wide />
//         <AnswerBox label="חשבון" value={formData.math} wide />
//       </RenderSection>

//       {/* 4. יחסים והתנהגות */}
//       <RenderSection title="יחסים והתנהגות">
//         <AnswerBox
//           label="טיב היחס אל המורים"
//           value={formData.teacherRelation}
//         />
//         <AnswerBox
//           label="הערות ליחס למורים"
//           value={formData.teacherRelationNotes}
//           wide
//         />
//         <AnswerBox
//           label="טיב היחסים עם בני הכיתה"
//           value={formData.peerRelation}
//         />
//         <AnswerBox
//           label="בעיות חברתיות (נסיבות וסיבות)"
//           value={formData.peerProblems}
//           wide
//         />

//         <div className="col-span-full mt-4 font-bold text-gray-600 text-sm">
//           תצפית התנהגות (6 חודשים אחרונים):
//         </div>
//         <AnswerBox label="דעתו מוסחת בקלות" value={formData.distractedEasily} />
//         <AnswerBox label="מתקשה להתרכז במשימות" value={formData.hardToFocus} />
//         <AnswerBox
//           label="נע/מסתובב באופן מוגזם"
//           value={formData.excessiveMovement}
//         />
//         <AnswerBox label="עוזב את הכיסא בשיעור" value={formData.leavesSeats} />
//       </RenderSection>

//       {/* 5. בעיות התנהגות מפורטות */}
//       <RenderSection title="דירוג בעיות התנהגות">
//         {Object.entries(formData.behaviorRatings || {}).map(
//           ([behavior, rating]) => (
//             <AnswerBox
//               key={behavior}
//               label={behavior}
//               value={rating}
//               highlight={rating !== "כלל לא"}
//             />
//           ),
//         )}
//       </RenderSection>

//       {/* 6. עזרה מיוחדת וסיכום */}
//       <RenderSection title="עזרה מיוחדת וסיכום">
//         <AnswerBox label="שעות שילוב" value={formData.integrationHours} />
//         <AnswerBox label="היקף (שש)" value={formData.integrationScope} />
//         <AnswerBox label="כמה שנים" value={formData.integrationYears} />
//         <AnswerBox
//           label="טיפול רגשי"
//           value={`${formData.emotionalTreatment || ""} - ${formData.emotionalTreatmentDetails || ""}`}
//           wide
//         />
//         <AnswerBox
//           label="חינוך מיוחד (שם גן/כיתה)"
//           value={`${formData.specialEducation || ""} - ${formData.specialEdName || ""}`}
//           wide
//         />
//         <AnswerBox label="עזרה אחרת" value={formData.otherHelp} wide />

//         <AnswerBox
//           label="סיכום התרשמות המחנך/ת"
//           value={formData.studentSummary}
//           wide
//         />
//         <AnswerBox
//           label="שאלה אבחונית קיימת"
//           value={formData.diagnosticQuestion}
//           wide
//         />
//         <AnswerBox
//           label="התערבות טיפולית מבוקשת"
//           value={formData.requestedIntervention}
//           wide
//         />
//       </RenderSection>

//       {/* חתימות */}
//       <div className="mt-12 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="text-center">
//           <p className="text-xs text-gray-400 mb-1">חתימת מחנך/ת</p>
//           <p className="text-gray-800 font-bold">
//             {formData.teacherSignature || teacherName}
//           </p>
//         </div>
//         <div className="text-center">
//           <p className="text-xs text-gray-400 mb-1">חתימת הנהלה</p>
//           <p className="text-gray-800 font-bold">
//             {formData.principalSignature || "—"}
//           </p>
//         </div>
//         <div className="text-center">
//           <p className="text-xs text-gray-400 mb-1">תאריך חתימה</p>
//           <p className="text-gray-800 font-bold">
//             {formData.signatureDate || formData.date}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SchoolSurveyView;

import React from "react";

// --- רכיבי עזר לאחידות עיצובית (מבוסס על QuestionnaireViewer שלך) ---

const RenderSection = ({ title, children }) => (
  <div className="mb-10 border-b border-gray-100 pb-8 text-right" dir="rtl">
    <h5 className="text-xl font-bold text-blue-800 mb-6 bg-blue-50 px-4 py-2 rounded-lg w-fit shadow-sm">
      {title}
    </h5>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
      {children}
    </div>
  </div>
);

const AnswerBox = ({ label, value, wide = false, highlight = false }) => (
  <div
    className={`flex flex-col gap-1 text-right ${wide ? "md:col-span-2 lg:col-span-3" : ""}`}
  >
    <span className="text-xs font-bold text-gray-500 mb-1">{label}</span>
    <div
      className={`text-md font-medium p-3 rounded-xl border min-h-[45px] flex items-center shadow-inner ${
        highlight && value && value !== "כלל לא"
          ? "bg-red-50 border-red-200 text-red-700"
          : "bg-gray-50 border-gray-200 text-gray-900"
      }`}
    >
      {value || <span className="text-gray-300 italic">לא הוזן</span>}
    </div>
  </div>
);

const DataTable = ({ headers, rows }) => (
  <div className="col-span-full mt-4 overflow-hidden border border-gray-200 rounded-xl shadow-sm">
    <table className="w-full text-right border-collapse" dir="rtl">
      <thead>
        <tr className="bg-gray-100">
          {headers.map((h, i) => (
            <th
              key={i}
              className="p-3 text-sm font-bold text-gray-600 border-b"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows && rows.length > 0 ? (
          rows.map((row, i) => (
            <tr key={i} className="hover:bg-white transition-colors">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="p-3 text-sm text-gray-800 border-b border-gray-100"
                >
                  {cell || "—"}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={headers.length}
              className="p-4 text-center text-gray-400 italic"
            >
              אין נתונים להצגה
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

// --- הקומפוננטה הראשית ---

const SchoolSurveyView = ({ data }) => {
  if (!data || !data.formData) {
    return (
      <div className="p-10 text-center text-gray-500 italic border-2 border-dashed border-gray-100 rounded-3xl">
        ממתין לנתוני שאלון בית הספר...
      </div>
    );
  }

  const { formData, teacherName, teacherEmail, submittedAt } = data;

  return (
    <div
      className="bg-white p-8 rounded-3xl animate-fadeIn font-sans shadow-lg"
      dir="rtl"
    >
      {/* 1. פרטים כלליים וזיהוי */}
      <RenderSection title="פרטי הדיווח והתלמיד">
        <AnswerBox
          label="שם התלמיד/ה"
          value={`${formData.firstName} ${formData.lastName}`}
        />
        <AnswerBox label="תעודת זהות" value={formData.idNumber} />
        <AnswerBox label="תאריך לידה" value={formData.birthDate} />
        <AnswerBox label="כיתה" value={formData.grade} />
        <AnswerBox label="בית ספר" value={formData.school} />
        <AnswerBox label="שם המחנך/ת המדווח" value={teacherName} />
        <AnswerBox label="מייל המורה" value={teacherEmail} />
        <AnswerBox label="טלפון המורה" value={formData.teacherPhone} />
        <AnswerBox
          label="תאריך הגשה"
          value={new Date(submittedAt).toLocaleDateString("he-IL")}
        />
      </RenderSection>

      {/* 2. סיבת ההפניה */}
      <RenderSection title="סיבת ההפניה">
        <AnswerBox
          label="מי יזם את הפנייה?"
          value={formData.referralInitiator}
          wide
        />
        <AnswerBox
          label="סיבות הפנייה המרכזיות"
          value={formData.referralReasons}
          wide
        />
        <AnswerBox
          label="תיאור קשיי התלמיד (תחילת הקושי ותדירותו)"
          value={formData.difficultyDescription}
          wide
        />
      </RenderSection>

      {/* 3. הישגים לימודיים */}
      <RenderSection title="הישגים לימודיים ותפקוד">
        <div className="col-span-full font-bold text-gray-600 mb-2 text-sm">
          מהלך לימודים בבי"ס:
        </div>
        <DataTable
          headers={["כיתה", "בית ספר"]}
          rows={
            formData.schoolHistory
              ?.filter((h) => h.grade || h.school)
              .map((h) => [h.grade, h.school]) || []
          }
        />
        <AnswerBox
          label="רמה אקדמית בהשוואה לכיתה"
          value={formData.academicLevel}
        />
        <AnswerBox label="האם נשאר כיתה?" value={formData.stayedGrade} />
        <AnswerBox
          label="באיזו כיתה ולמה?"
          value={`${formData.stayedGradeWhich || ""} ${formData.stayedGradeReasons || ""}`}
          wide
        />

        <div className="col-span-full mt-4 font-bold text-gray-600 text-sm border-t pt-4">
          שליטה במקצועות יסוד:
        </div>
        <AnswerBox
          label="קריאה (דיוק, קצב, הבנה, אוצר מילים)"
          value={formData.reading}
          wide
        />
        <AnswerBox
          label="כתיבה (העתקה, כתיבה חופשית, שגיאות, כתב)"
          value={formData.writing}
          wide
        />
        <AnswerBox
          label="חשבון (הבנה ושליטה בפעולות ופתרון בעיות)"
          value={formData.math}
          wide
        />
      </RenderSection>

      {/* 4. יחסים והתנהגות */}
      <RenderSection title="יחסים והתנהגות כללית">
        <AnswerBox
          label="טיב היחס אל המורים"
          value={formData.teacherRelation}
        />
        <AnswerBox
          label="הערות ליחס למורים"
          value={formData.teacherRelationNotes}
          wide
        />
        <AnswerBox
          label="טיב היחסים עם בני הכיתה"
          value={formData.peerRelation}
        />
        <AnswerBox
          label="בעיות חברתיות (נסיבות וסיבות)"
          value={formData.peerProblems}
          wide
        />

        <div className="col-span-full mt-4 font-bold text-gray-600 text-sm border-t pt-4">
          תצפית התנהגות בכיתה (6 חודשים אחרונים):
        </div>
        <AnswerBox
          label="1. דעתו מוסחת בקלות"
          value={formData.distractedEasily}
          highlight={formData.distractedEasily !== "אף פעם / לעיתים רחוקות"}
        />
        <AnswerBox
          label="2. מתקשה להתרכז במשימות"
          value={formData.hardToFocus}
          highlight={formData.hardToFocus !== "אף פעם / לעיתים רחוקות"}
        />
        <AnswerBox
          label="3. נע/מסתובב/מטפס באופן מוגזם"
          value={formData.excessiveMovement}
          highlight={formData.excessiveMovement !== "אף פעם / לעיתים רחוקות"}
        />
        <AnswerBox
          label="4. עוזב את הכיסא בשיעור"
          value={formData.leavesSeats}
          highlight={formData.leavesSeats !== "אף פעם / לעיתים רחוקות"}
        />
      </RenderSection>

      {/* 5. בעיות התנהגות מפורטות */}
      <RenderSection title="דירוג בעיות התנהגות מפורטות">
        {formData.behaviorRatings &&
          Object.entries(formData.behaviorRatings).map(([behavior, rating]) => (
            <AnswerBox
              key={behavior}
              label={behavior}
              value={rating}
              highlight={rating !== "כלל לא"}
            />
          ))}
      </RenderSection>

      {/* 6. עזרה מיוחדת וסיכום */}
      <RenderSection title="עזרה מיוחדת, התערבות וסיכום">
        <AnswerBox label="שעות שילוב" value={formData.integrationHours} />
        <AnswerBox label="היקף (שש)" value={formData.integrationScope} />
        <AnswerBox label="כמה שנים" value={formData.integrationYears} />
        <AnswerBox
          label="טיפול רגשי"
          value={`${formData.emotionalTreatment || "—"} ${formData.emotionalTreatmentDetails ? `(${formData.emotionalTreatmentDetails})` : ""}`}
          wide
        />
        <AnswerBox
          label="חינוך מיוחד (שם גן/כיתה)"
          value={`${formData.specialEducation || "—"} ${formData.specialEdName ? `(${formData.specialEdName})` : ""}`}
          wide
        />
        <AnswerBox label="עזרה אחרת" value={formData.otherHelp} wide />

        <AnswerBox
          label="סכם התרשמותך מהתלמיד/ה"
          value={formData.studentSummary}
          wide
        />
        <AnswerBox
          label="שאלה אבחונית או אחרת"
          value={formData.diagnosticQuestion}
          wide
        />
        <AnswerBox
          label="ההתערבות הטיפולית המבוקשת"
          value={formData.requestedIntervention}
          wide
        />
      </RenderSection>

      {/* חתימות מורחב */}
      <div className="mt-12 pt-8 border-t-2 border-blue-50 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-xs text-gray-400 mb-2 uppercase font-bold tracking-wider">
            חתימת מחנך/ת
          </p>
          <p className="text-lg text-gray-800 font-serif italic">
            {formData.teacherSignature || teacherName}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {formData.teacherSignatureName}
          </p>
        </div>
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-xs text-gray-400 mb-2 uppercase font-bold tracking-wider">
            חתימת הנהלה
          </p>
          <p className="text-lg text-gray-800 font-bold">
            {formData.principalSignature || "—"}
          </p>
        </div>
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-xs text-gray-400 mb-2 uppercase font-bold tracking-wider">
            תאריך חתימה
          </p>
          <p className="text-lg text-gray-800 font-mono font-bold">
            {formData.signatureDate || formData.date}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SchoolSurveyView;
