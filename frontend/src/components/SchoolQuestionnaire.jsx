// import React, { useState, useRef, useEffect } from "react";

// // --- רכיבי עזר (UI Components) ---

// const InputField = ({
//   label,
//   value,
//   onChange,
//   type = "text",
//   className = "",
// }) => (
//   <div className={`flex flex-col gap-1 ${className}`}>
//     <label className="text-sm font-bold text-gray-700">{label}</label>
//     <input
//       type={type}
//       value={value || ""}
//       onChange={(e) => onChange(e.target.value)}
//       className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//     />
//   </div>
// );

// const TextAreaField = ({ label, value, onChange, rows = 3, hint = "" }) => (
//   <div className="flex flex-col gap-1">
//     {label && (
//       <label className="text-sm font-bold text-gray-700">{label}</label>
//     )}
//     {hint && <span className="text-xs text-gray-500">{hint}</span>}
//     <textarea
//       rows={rows}
//       value={value || ""}
//       onChange={(e) => onChange(e.target.value)}
//       className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//     />
//   </div>
// );

// const SectionTitle = ({ children }) => (
//   <h3 className="text-xl font-bold text-blue-800 underline mt-2 mb-4">
//     {children}
//   </h3>
// );

// const AddRowButton = ({ onClick, label = "+ הוסף שורה" }) => (
//   <button
//     type="button"
//     onClick={onClick}
//     className="mt-2 text-sm text-blue-600 border border-blue-300 rounded-lg px-3 py-1 hover:bg-blue-50 transition"
//   >
//     {label}
//   </button>
// );

// // --- קבועים (Constants) ---

// const STEPS = [
//   "פרטים אישיים",
//   "סיבת ההפניה",
//   "הישגים לימודיים",
//   "יחסים ותנהגות",
//   "בעיות התנהגות",
//   "עזרה מיוחדת וסיכום",
// ];

// const FREQ_OPTIONS = ["כלל לא", "במקצת", "הרבה", "הרבה מאד"];
// const BEHAVIOR_ITEMS = [
//   'נעדר מבי"ס ללא הצדקה',
//   'מאחר לבי"ס ללא הצדקה',
//   "מפריע בשיעורים",
//   "אינו מגלה עניין בלימודים",
//   "מגלה תוקפנות פיזית",
//   "מגלה תוקפנות מילולית",
//   "מגלה התפרצויות זעם",
//   "נחבא אל הכלים – ביישן",
//   "נוטה לבכיינות",
//   "מתעקש",
//   "משקר",
//   "גונב",
//   "חסר מנוחה",
//   "נוטה למצבי רוח קודרים",
//   "תלותי",
//   "חסר בטחון עצמי",
//   "מגלה ליקויי דיבור",
// ];

// // --- הקומפוננטה הראשית ---

// const SchoolQuestionnaire = ({
//   initialData, // נתונים מהשרת
//   onSave, // פונקציית שליחה סופית
//   onSaveDraft, // פונקציית שמירת טיוטה
//   onCancel,
//   formId = "default",
// }) => {
//   const [step, setStep] = useState(1);
//   const [saveStatus, setSaveStatus] = useState("");
//   const containerRef = useRef(null);

//   // איתחול ה-State עם כל השדות
//   const [formData, setFormData] = useState({
//     date: new Date().toLocaleDateString("he-IL"),
//     lastName: "",
//     firstName: "",
//     gender: "",
//     fatherName: "",
//     motherName: "",
//     birthDate: "",
//     idNumber: "",
//     address: "",
//     phone: "",
//     school: "",
//     grade: "",
//     teacherName: "",
//     teacherPhone: "",
//     referralInitiator: "",
//     referralReasons: "",
//     difficultyDescription: "",
//     schoolHistory: [
//       { grade: "", school: "" },
//       { grade: "", school: "" },
//       { grade: "", school: "" },
//     ],
//     stayedGrade: "",
//     stayedGradeWhich: "",
//     stayedGradeReasons: "",
//     reportCardGrade: "",
//     reportCardHalf: "",
//     reportCardYear: "",
//     grades: [
//       { subject: "", grade: "" },
//       { subject: "", grade: "" },
//       { subject: "", grade: "" },
//       { subject: "", grade: "" },
//       { subject: "", grade: "" },
//     ],
//     academicLevel: "",
//     reading: "",
//     writing: "",
//     math: "",
//     teacherRelation: "",
//     teacherRelationNotes: "",
//     peerRelation: "",
//     peerProblems: "",
//     distractedEasily: "",
//     hardToFocus: "",
//     excessiveMovement: "",
//     leavesSeats: "",
//     behaviorRatings: Object.fromEntries(BEHAVIOR_ITEMS.map((b) => [b, ""])),
//     integrationHours: "",
//     integrationScope: "",
//     integrationYears: "",
//     emotionalTreatment: "",
//     emotionalTreatmentDetails: "",
//     otherHelp: "",
//     specialEducation: "",
//     specialEdName: "",
//     studentSummary: "",
//     diagnosticQuestion: "",
//     requestedIntervention: "",
//     signatureDate: "",
//     teacherSignatureName: "",
//     teacherSignature: "",
//     principalSignature: "",
//   });

//   // טעינת הדרפט מהשרת כשהוא מגיע
//   useEffect(() => {
//     if (initialData && Object.keys(initialData).length > 0) {
//       setFormData((prev) => ({
//         ...prev,
//         ...initialData,
//       }));
//     }
//   }, [initialData]);

//   // פונקציות לשינוי נתונים
//   const handleChange = (field, value) =>
//     setFormData((prev) => ({ ...prev, [field]: value }));

//   const handleSchoolHistory = (index, field, value) => {
//     const updated = [...formData.schoolHistory];
//     updated[index] = { ...updated[index], [field]: value };
//     setFormData((prev) => ({ ...prev, schoolHistory: updated }));
//   };

//   const addSchoolHistoryRow = () =>
//     setFormData((prev) => ({
//       ...prev,
//       schoolHistory: [...prev.schoolHistory, { grade: "", school: "" }],
//     }));

//   const handleGrade = (index, field, value) => {
//     const updated = [...formData.grades];
//     updated[index] = { ...updated[index], [field]: value };
//     setFormData((prev) => ({ ...prev, grades: updated }));
//   };

//   const addGradeRow = () =>
//     setFormData((prev) => ({
//       ...prev,
//       grades: [...prev.grades, { subject: "", grade: "" }],
//     }));

//   const handleBehavior = (item, value) =>
//     setFormData((prev) => ({
//       ...prev,
//       behaviorRatings: { ...prev.behaviorRatings, [item]: value },
//     }));

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // פונקציית שמירת טיוטה דרך הסרביס (onSaveDraft)
//   const saveDraft = async () => {
//     try {
//       setSaveStatus("שומר טיוטה בשרת...");
//       if (onSaveDraft) {
//         await onSaveDraft(formData);
//         setSaveStatus("הטיוטה נשמרה בשרת");
//       }
//     } catch (err) {
//       setSaveStatus("שגיאה בשמירה");
//       console.error(err);
//     }
//     setTimeout(() => setSaveStatus(""), 3000);
//   };

//   const renderStep = () => {
//     switch (step) {
//       case 1:
//         return (
//           <div className="space-y-5 animate-fadeIn">
//             <SectionTitle>פרטים אישיים</SectionTitle>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <InputField
//                 label="שם משפחה"
//                 value={formData.lastName}
//                 onChange={(v) => handleChange("lastName", v)}
//               />
//               <InputField
//                 label="שם פרטי"
//                 value={formData.firstName}
//                 onChange={(v) => handleChange("firstName", v)}
//               />
//               <div className="flex flex-col gap-1">
//                 <label className="text-sm font-bold text-gray-700">מין</label>
//                 <div className="flex gap-4 mt-2">
//                   {["ז", "נ"].map((g) => (
//                     <label
//                       key={g}
//                       className="flex items-center gap-1 cursor-pointer text-sm font-medium"
//                     >
//                       <input
//                         type="radio"
//                         name="gender"
//                         value={g}
//                         checked={formData.gender === g}
//                         onChange={() => handleChange("gender", g)}
//                         className="w-4 h-4"
//                       />
//                       {g === "ז" ? "זכר" : "נקבה"}
//                     </label>
//                   ))}
//                 </div>
//               </div>
//               <InputField
//                 label="שם האב"
//                 value={formData.fatherName}
//                 onChange={(v) => handleChange("fatherName", v)}
//               />
//               <InputField
//                 label="שם האם"
//                 value={formData.motherName}
//                 onChange={(v) => handleChange("motherName", v)}
//               />
//               <InputField
//                 label="תאריך לידה"
//                 type="date"
//                 value={formData.birthDate}
//                 onChange={(v) => handleChange("birthDate", v)}
//               />
//               <InputField
//                 label="ת.ז."
//                 value={formData.idNumber}
//                 onChange={(v) => handleChange("idNumber", v)}
//               />
//               <InputField
//                 label="כתובת"
//                 value={formData.address}
//                 onChange={(v) => handleChange("address", v)}
//               />
//               <InputField
//                 label="מס' טלפון"
//                 value={formData.phone}
//                 onChange={(v) => handleChange("phone", v)}
//               />
//               <InputField
//                 label="בית ספר"
//                 value={formData.school}
//                 onChange={(v) => handleChange("school", v)}
//               />
//               <InputField
//                 label="כיתה"
//                 value={formData.grade}
//                 onChange={(v) => handleChange("grade", v)}
//               />
//               <InputField
//                 label="שם המחנך"
//                 value={formData.teacherName}
//                 onChange={(v) => handleChange("teacherName", v)}
//               />
//               <InputField
//                 label="טלפון מחנך"
//                 value={formData.teacherPhone}
//                 onChange={(v) => handleChange("teacherPhone", v)}
//               />
//             </div>
//           </div>
//         );
//       case 2:
//         return (
//           <div className="space-y-5 animate-fadeIn">
//             <SectionTitle>סיבת ההפניה</SectionTitle>
//             <InputField
//               label="מי יזם את הפנייה?"
//               value={formData.referralInitiator}
//               onChange={(v) => handleChange("referralInitiator", v)}
//             />
//             <TextAreaField
//               label="סיבות הפנייה"
//               value={formData.referralReasons}
//               onChange={(v) => handleChange("referralReasons", v)}
//               rows={3}
//             />
//             <TextAreaField
//               label="תיאור קשיי התלמיד"
//               hint="ציין מתי החלו הקשיים ואת תדירות הופעתם"
//               value={formData.difficultyDescription}
//               onChange={(v) => handleChange("difficultyDescription", v)}
//               rows={5}
//             />
//           </div>
//         );
//       case 3:
//         return (
//           <div className="space-y-5 animate-fadeIn">
//             <SectionTitle>הישגים לימודיים</SectionTitle>
//             <p className="text-sm font-bold text-gray-700 mb-2">
//               מהלך לימודים בבית ספר:
//             </p>
//             <table className="w-full border-collapse border border-gray-300 text-sm">
//               <thead>
//                 <tr className="bg-blue-50">
//                   <th className="border border-gray-300 p-2 text-right">
//                     כיתה
//                   </th>
//                   <th className="border border-gray-300 p-2 text-right">
//                     בית ספר
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {formData.schoolHistory.map((row, i) => (
//                   <tr key={i}>
//                     <td className="border border-gray-300 p-1">
//                       <input
//                         value={row.grade}
//                         onChange={(e) =>
//                           handleSchoolHistory(i, "grade", e.target.value)
//                         }
//                         className="w-full outline-none p-1 rounded"
//                       />
//                     </td>
//                     <td className="border border-gray-300 p-1">
//                       <input
//                         value={row.school}
//                         onChange={(e) =>
//                           handleSchoolHistory(i, "school", e.target.value)
//                         }
//                         className="w-full outline-none p-1 rounded"
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <AddRowButton
//               onClick={addSchoolHistoryRow}
//               label="+ הוסף שורת בית ספר"
//             />

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
//               <InputField
//                 label="האם נשאר כיתה שנה נוספת?"
//                 value={formData.stayedGrade}
//                 onChange={(v) => handleChange("stayedGrade", v)}
//               />
//               <InputField
//                 label="באיזו כיתה?"
//                 value={formData.stayedGradeWhich}
//                 onChange={(v) => handleChange("stayedGradeWhich", v)}
//               />
//             </div>
//             <InputField
//               label="מה היו הסיבות לכך?"
//               value={formData.stayedGradeReasons}
//               onChange={(v) => handleChange("stayedGradeReasons", v)}
//             />

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
//               <InputField
//                 label="ציונים בתעודה - בכיתה"
//                 value={formData.reportCardGrade}
//                 onChange={(v) => handleChange("reportCardGrade", v)}
//               />
//               <InputField
//                 label="במחצית"
//                 value={formData.reportCardHalf}
//                 onChange={(v) => handleChange("reportCardHalf", v)}
//               />
//               <InputField
//                 label="שנת"
//                 value={formData.reportCardYear}
//                 onChange={(v) => handleChange("reportCardYear", v)}
//               />
//             </div>

//             <p className="text-sm font-bold text-gray-700 mt-6 mb-2">
//               ציונים לפי מקצוע:
//             </p>
//             <table className="w-full border-collapse border border-gray-300 text-sm">
//               <thead>
//                 <tr className="bg-blue-50">
//                   <th className="border border-gray-300 p-2 text-right">
//                     מקצוע
//                   </th>
//                   <th className="border border-gray-300 p-2 text-right w-32">
//                     ציון
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {formData.grades.map((row, i) => (
//                   <tr key={i}>
//                     <td className="border border-gray-300 p-1">
//                       <input
//                         value={row.subject}
//                         onChange={(e) =>
//                           handleGrade(i, "subject", e.target.value)
//                         }
//                         className="w-full outline-none p-1 rounded"
//                         placeholder="שם המקצוע"
//                       />
//                     </td>
//                     <td className="border border-gray-300 p-1">
//                       <input
//                         value={row.grade}
//                         onChange={(e) =>
//                           handleGrade(i, "grade", e.target.value)
//                         }
//                         className="w-full outline-none p-1 rounded"
//                         placeholder="ציון"
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <AddRowButton onClick={addGradeRow} label="+ הוסף מקצוע" />

//             <div className="mt-6">
//               <p className="text-sm font-bold text-gray-700 mb-2">
//                 הערך את הישגיו הלימודיים בהשוואה להישגי הכיתה:
//               </p>
//               <div className="flex gap-3 flex-wrap">
//                 {[
//                   "חלשים מאוד",
//                   "חלשים",
//                   "למטה מבינוניים",
//                   "טובים",
//                   "טובים מאוד",
//                   "מצוינים",
//                 ].map((opt) => (
//                   <label
//                     key={opt}
//                     className="flex items-center gap-1 cursor-pointer text-sm border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition"
//                   >
//                     <input
//                       type="radio"
//                       name="academicLevel"
//                       value={opt}
//                       checked={formData.academicLevel === opt}
//                       onChange={() => handleChange("academicLevel", opt)}
//                       className="w-4 h-4"
//                     />
//                     {opt}
//                   </label>
//                 ))}
//               </div>
//             </div>

//             <div className="space-y-4 mt-6">
//               <p className="text-sm font-bold text-gray-700 underline">
//                 שליטתו במקצועות היסוד (כיתות א'-ד'):
//               </p>
//               <TextAreaField
//                 label="קריאה"
//                 hint="רמה, אוצר מילים, דיוק, קצב, פענוח, הבנה"
//                 value={formData.reading}
//                 onChange={(v) => handleChange("reading", v)}
//               />
//               <TextAreaField
//                 label="כתיבה"
//                 hint="העתקה, כתיבה חופשית, שגיאות, כתב"
//                 value={formData.writing}
//                 onChange={(v) => handleChange("writing", v)}
//               />
//               <TextAreaField
//                 label="חשבון"
//                 hint="מידת הבנה, שליטה בפעולות, פתרון בעיות"
//                 value={formData.math}
//                 onChange={(v) => handleChange("math", v)}
//               />
//             </div>
//           </div>
//         );
//       case 4:
//         return (
//           <div className="space-y-6 animate-fadeIn">
//             <SectionTitle>יחסים והתנהגות</SectionTitle>
//             <div>
//               <p className="text-sm font-bold text-gray-700 mb-2">
//                 מה טיב יחסו של התלמיד אל המורים?
//               </p>
//               <div className="flex gap-3 flex-wrap">
//                 {[
//                   "עוין",
//                   "מסויג",
//                   "תקין",
//                   "מחפש את אהדתם",
//                   "מחפש אהדה בצורה מופרזת",
//                 ].map((opt) => (
//                   <label
//                     key={opt}
//                     className="flex items-center gap-1 cursor-pointer text-sm border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition"
//                   >
//                     <input
//                       type="radio"
//                       name="teacherRelation"
//                       value={opt}
//                       checked={formData.teacherRelation === opt}
//                       onChange={() => handleChange("teacherRelation", opt)}
//                       className="w-4 h-4"
//                     />
//                     {opt}
//                   </label>
//                 ))}
//               </div>
//             </div>
//             <TextAreaField
//               label="הערות ליחס למורים"
//               hint="למשל: יחס שונה למורים שונים, יחס בלתי יציב"
//               value={formData.teacherRelationNotes}
//               onChange={(v) => handleChange("teacherRelationNotes", v)}
//             />

//             <div>
//               <p className="text-sm font-bold text-gray-700 mb-2">
//                 מה טיב יחסיו של הילד עם בני כיתתו?
//               </p>
//               <div className="flex gap-3 flex-wrap">
//                 {["מתבודד", "דחוי", "חברתיים קלושים", "מקובל", "מנהיג"].map(
//                   (opt) => (
//                     <label
//                       key={opt}
//                       className="flex items-center gap-1 cursor-pointer text-sm border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition"
//                     >
//                       <input
//                         type="radio"
//                         name="peerRelation"
//                         value={opt}
//                         checked={formData.peerRelation === opt}
//                         onChange={() => handleChange("peerRelation", opt)}
//                         className="w-4 h-4"
//                       />
//                       {opt}
//                     </label>
//                   ),
//                 )}
//               </div>
//             </div>
//             <TextAreaField
//               label="תיאור בעיות חברתיות אם קיימות"
//               value={formData.peerProblems}
//               onChange={(v) => handleChange("peerProblems", v)}
//             />

//             <div className="mt-6">
//               <p className="text-sm font-bold text-gray-700 mb-4 font-sans">
//                 התנהגות ב-6 החודשים האחרונים:
//               </p>
//               <table className="w-full border-collapse border border-gray-300 text-sm">
//                 <thead>
//                   <tr className="bg-blue-50">
//                     <th className="border border-gray-300 p-2 text-right">
//                       התנהגות
//                     </th>
//                     {["אף פעם", "לפעמים", "קרובות", "קרובות מאד"].map((h) => (
//                       <th
//                         key={h}
//                         className="border border-gray-300 p-2 text-center text-xs"
//                       >
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {[
//                     { key: "distractedEasily", label: "1. דעתו מוסחת בקלות." },
//                     { key: "hardToFocus", label: "2. מתקשה להתרכז במשימות." },
//                     { key: "excessiveMovement", label: "3. נע/ה באופן מוגזם." },
//                     { key: "leavesSeats", label: "4. עוזב/ת את הכסא בשיעור." },
//                   ].map(({ key, label }) => (
//                     <tr key={key}>
//                       <td className="border border-gray-300 p-2 font-medium">
//                         {label}
//                       </td>
//                       {[
//                         "אף פעם / לעיתים רחוקות",
//                         "לפעמים",
//                         "לעיתים קרובות",
//                         "לעיתים קרובות מאד",
//                       ].map((opt) => (
//                         <td
//                           key={opt}
//                           className="border border-gray-300 p-2 text-center"
//                         >
//                           <input
//                             type="radio"
//                             name={key}
//                             value={opt}
//                             checked={formData[key] === opt}
//                             onChange={() => handleChange(key, opt)}
//                             className="w-4 h-4"
//                           />
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         );
//       case 5:
//         return (
//           <div className="space-y-5 animate-fadeIn">
//             <SectionTitle>בעיות התנהגות במסגרת בי"ס</SectionTitle>
//             <table className="w-full border-collapse border border-gray-300 text-sm">
//               <thead>
//                 <tr className="bg-blue-50">
//                   <th className="border border-gray-300 p-2 text-right">
//                     התנהגות
//                   </th>
//                   {FREQ_OPTIONS.map((h) => (
//                     <th
//                       key={h}
//                       className="border border-gray-300 p-2 text-center text-xs"
//                     >
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {BEHAVIOR_ITEMS.map((item) => (
//                   <tr key={item} className="hover:bg-gray-50">
//                     <td className="border border-gray-300 p-2">{item}</td>
//                     {FREQ_OPTIONS.map((opt) => (
//                       <td
//                         key={opt}
//                         className="border border-gray-300 p-2 text-center"
//                       >
//                         <input
//                           type="radio"
//                           name={`behavior_${item}`}
//                           value={opt}
//                           checked={formData.behaviorRatings[item] === opt}
//                           onChange={() => handleBehavior(item, opt)}
//                           className="w-4 h-4"
//                         />
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         );
//       case 6:
//         return (
//           <div className="space-y-5 animate-fadeIn">
//             <SectionTitle>עזרה מיוחדת וסיכום</SectionTitle>
//             <p className="text-sm font-bold text-gray-700">
//               עזרה מיוחדת שניתנה:
//             </p>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <InputField
//                 label="שעות שילוב"
//                 value={formData.integrationHours}
//                 onChange={(v) => handleChange("integrationHours", v)}
//               />
//               <InputField
//                 label='היקף (ש"ש)'
//                 value={formData.integrationScope}
//                 onChange={(v) => handleChange("integrationScope", v)}
//               />
//               <InputField
//                 label="כמה שנים"
//                 value={formData.integrationYears}
//                 onChange={(v) => handleChange("integrationYears", v)}
//               />
//             </div>
//             <div className="flex flex-col gap-1 mt-4">
//               <label className="text-sm font-bold text-gray-700">
//                 טיפול רגשי?
//               </label>
//               <div className="flex gap-4">
//                 {["כן", "לא"].map((opt) => (
//                   <label
//                     key={opt}
//                     className="flex items-center gap-1 cursor-pointer text-sm"
//                   >
//                     <input
//                       type="radio"
//                       name="emotionalTreatment"
//                       value={opt}
//                       checked={formData.emotionalTreatment === opt}
//                       onChange={() => handleChange("emotionalTreatment", opt)}
//                     />{" "}
//                     {opt}
//                   </label>
//                 ))}
//               </div>
//             </div>
//             <InputField
//               label="איזה טיפול רגשי?"
//               value={formData.emotionalTreatmentDetails}
//               onChange={(v) => handleChange("emotionalTreatmentDetails", v)}
//             />
//             <InputField
//               label="עזרה אחרת"
//               value={formData.otherHelp}
//               onChange={(v) => handleChange("otherHelp", v)}
//             />

//             <div className="flex flex-col gap-1 mt-4">
//               <label className="text-sm font-bold text-gray-700">
//                 חינוך מיוחד?
//               </label>
//               <div className="flex gap-4">
//                 {["כן", "לא"].map((opt) => (
//                   <label
//                     key={opt}
//                     className="flex items-center gap-1 cursor-pointer text-sm"
//                   >
//                     <input
//                       type="radio"
//                       name="specialEducation"
//                       value={opt}
//                       checked={formData.specialEducation === opt}
//                       onChange={() => handleChange("specialEducation", opt)}
//                     />{" "}
//                     {opt}
//                   </label>
//                 ))}
//               </div>
//             </div>
//             <InputField
//               label="שם הגן / כיתה"
//               value={formData.specialEdName}
//               onChange={(v) => handleChange("specialEdName", v)}
//             />

//             <TextAreaField
//               label="סכם התרשמותך מהתלמיד/ה"
//               value={formData.studentSummary}
//               onChange={(v) => handleChange("studentSummary", v)}
//               rows={4}
//             />
//             <TextAreaField
//               label="שאלה אבחונית קיימת"
//               value={formData.diagnosticQuestion}
//               onChange={(v) => handleChange("diagnosticQuestion", v)}
//               rows={2}
//             />
//             <InputField
//               label="ההתערבות המבוקשת"
//               value={formData.requestedIntervention}
//               onChange={(v) => handleChange("requestedIntervention", v)}
//             />

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-gray-200 mt-6">
//               <InputField
//                 label="תאריך חתימה"
//                 type="date"
//                 value={formData.signatureDate}
//                 onChange={(v) => handleChange("signatureDate", v)}
//               />
//               <InputField
//                 label="שם המחנך"
//                 value={formData.teacherSignatureName}
//                 onChange={(v) => handleChange("teacherSignatureName", v)}
//               />
//               <InputField
//                 label="חתימת מחנך"
//                 value={formData.teacherSignature}
//                 onChange={(v) => handleChange("teacherSignature", v)}
//               />
//               <InputField
//                 label="חתימת מנהל"
//                 value={formData.principalSignature}
//                 onChange={(v) => handleChange("principalSignature", v)}
//               />
//             </div>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div
//       ref={containerRef}
//       className="bg-white max-w-5xl mx-auto rounded-2xl shadow-lg p-8 font-sans"
//       dir="rtl"
//     >
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-blue-900">
//             שאלון לצוות חינוכי
//           </h2>
//           <p className="text-sm text-gray-500 mt-1 font-mono">
//             תאריך: {formData.date}
//           </p>
//         </div>
//         <div className="flex items-center gap-4">
//           {saveStatus && (
//             <span className="text-blue-600 text-sm font-bold animate-pulse">
//               {saveStatus}
//             </span>
//           )}
//           <button
//             onClick={saveDraft}
//             className="bg-blue-50 text-blue-600 border border-blue-200 px-5 py-2 rounded-xl hover:bg-blue-100 transition font-bold shadow-sm"
//           >
//             💾 שמור טיוטה בשרת
//           </button>
//         </div>
//       </div>

//       {/* Progress bar */}
//       <div className="mb-10">
//         <div className="flex justify-between text-xs text-gray-500 mb-2">
//           <span className="font-bold text-blue-700">
//             שלב {step} מתוך {STEPS.length}: {STEPS[step - 1]}
//           </span>
//           <span className="font-bold">
//             {Math.round((step / STEPS.length) * 100)}%
//           </span>
//         </div>
//         <div className="w-full bg-gray-100 rounded-full h-3 shadow-inner">
//           <div
//             className="bg-blue-600 h-3 rounded-full transition-all duration-700 ease-in-out shadow-lg"
//             style={{ width: `${(step / STEPS.length) * 100}%` }}
//           />
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div className="min-h-[450px]">{renderStep()}</div>

//       {/* Navigation Footer */}
//       <div className="flex justify-between mt-12 pt-8 border-t border-gray-100">
//         <button
//           onClick={() => {
//             if (step === 1) onCancel && onCancel();
//             else {
//               setStep(step - 1);
//               scrollToTop();
//             }
//           }}
//           className="text-gray-500 hover:text-gray-800 transition px-6 py-2 rounded-xl border border-gray-300 font-bold"
//         >
//           {step === 1 ? "ביטול וחזרה" : "→ שלב הקודם"}
//         </button>

//         {step < STEPS.length ? (
//           <button
//             onClick={() => {
//               setStep(step + 1);
//               scrollToTop();
//             }}
//             className="bg-blue-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
//           >
//             המשך לשלב הבא ←
//           </button>
//         ) : (
//           <button
//             onClick={() => {
//               if (
//                 window.confirm(
//                   "בטוח שסיימת? לאחר השליחה לא ניתן יהיה לשנות את התשובות.",
//                 )
//               ) {
//                 onSave(formData);
//               }
//             }}
//             className="bg-green-600 text-white px-10 py-2 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95"
//           >
//             ✓ שלח שאלון סופי למאבחן
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SchoolQuestionnaire;

import React, { useState, useRef, useEffect } from "react";

// --- רכיבי עזר (UI Components) ---

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  className = "",
}) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label className="text-sm font-bold text-gray-700">{label}</label>
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, rows = 3, hint = "" }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-sm font-bold text-gray-700">{label}</label>
    )}
    {hint && <span className="text-xs text-gray-500">{hint}</span>}
    <textarea
      rows={rows}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 className="text-xl font-bold text-blue-800 underline mt-2 mb-4">
    {children}
  </h3>
);

const AddRowButton = ({ onClick, label = "+ הוסף שורה" }) => (
  <button
    type="button"
    onClick={onClick}
    className="mt-2 text-sm text-blue-600 border border-blue-300 rounded-lg px-3 py-1 hover:bg-blue-50 transition"
  >
    {label}
  </button>
);

const RadioRow = ({ name, options, value, onChange, label }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-sm font-bold text-gray-700">{label}</label>
    )}
    <div className="flex gap-4 flex-wrap">
      {options.map((opt) => (
        <label
          key={opt}
          className="flex items-center gap-1 cursor-pointer text-sm"
        >
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="w-4 h-4"
          />
          {opt}
        </label>
      ))}
    </div>
  </div>
);

// --- קבועים (Constants) ---

const STEPS = [
  "פרטים אישיים",
  "סיבת ההפניה",
  "הישגים לימודיים",
  "יחסים ותנהגות",
  "בעיות התנהגות",
  "עזרה מיוחדת וסיכום",
];

const FREQ_OPTIONS = ["כלל לא", "במקצת", "הרבה", "הרבה מאד"];
const BEHAVIOR_ITEMS = [
  'נעדר מבי"ס ללא הצדקה',
  'מאחר לבי"ס ללא הצדקה',
  "מפריע בשיעורים",
  "אינו מגלה עניין בלימודים",
  "מגלה תוקפנות פיזית",
  "מגלה תוקפנות מילולית",
  "מגלה התפרצויות זעם",
  "נחבא אל הכלים – ביישן",
  "נוטה לבכיינות",
  "מתעקש",
  "משקר",
  "גונב",
  "חסר מנוחה",
  "נוטה למצבי רוח קודרים",
  "תלותי",
  "חסר בטחון עצמי",
  "מגלה ליקויי דיבור",
];

// --- הקומפוננטה הראשית ---

const SchoolQuestionnaire = ({
  initialData,
  onSave,
  onSaveDraft,
  onCancel,
  formId = "default",
}) => {
  const [step, setStep] = useState(1);
  const [saveStatus, setSaveStatus] = useState("");
  const containerRef = useRef(null);

  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString("he-IL"),
    lastName: "",
    firstName: "",
    gender: "",
    fatherName: "",
    motherName: "",
    birthDate: "",
    idNumber: "",
    address: "",
    phone: "",
    school: "",
    grade: "",
    teacherName: "",
    teacherPhone: "",
    referralInitiator: "",
    referralReasons: "",
    difficultyDescription: "",
    schoolHistory: [
      { grade: "", school: "" },
      { grade: "", school: "" },
      { grade: "", school: "" },
    ],
    stayedGrade: "",
    stayedGradeWhich: "",
    stayedGradeReasons: "",
    reportCardGrade: "",
    reportCardHalf: "",
    reportCardYear: "",
    grades: [
      { subject: "", grade: "" },
      { subject: "", grade: "" },
      { subject: "", grade: "" },
      { subject: "", grade: "" },
      { subject: "", grade: "" },
    ],
    academicLevel: "",
    reading: "",
    writing: "",
    math: "",
    teacherRelation: "",
    teacherRelationNotes: "",
    peerRelation: "",
    peerProblems: "",
    distractedEasily: "",
    hardToFocus: "",
    excessiveMovement: "",
    leavesSeats: "",
    behaviorRatings: Object.fromEntries(BEHAVIOR_ITEMS.map((b) => [b, ""])),
    integrationHours: "",
    integrationScope: "",
    integrationYears: "",
    emotionalTreatment: "",
    emotionalTreatmentDetails: "",
    otherHelp: "",
    specialEducation: "",
    specialEdName: "",
    studentSummary: "",
    diagnosticQuestion: "",
    requestedIntervention: "",
    signatureDate: "",
    teacherSignatureName: "",
    teacherSignature: "",
    principalSignature: "",
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSchoolHistory = (index, field, value) => {
    const updated = [...formData.schoolHistory];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, schoolHistory: updated }));
  };

  const addSchoolHistoryRow = () =>
    setFormData((prev) => ({
      ...prev,
      schoolHistory: [...prev.schoolHistory, { grade: "", school: "" }],
    }));

  const handleGrade = (index, field, value) => {
    const updated = [...formData.grades];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, grades: updated }));
  };

  const addGradeRow = () =>
    setFormData((prev) => ({
      ...prev,
      grades: [...prev.grades, { subject: "", grade: "" }],
    }));

  const handleBehavior = (item, value) =>
    setFormData((prev) => ({
      ...prev,
      behaviorRatings: { ...prev.behaviorRatings, [item]: value },
    }));

  // הפונקציה שגורמת לקפיצה לראש העמוד
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const saveDraft = async () => {
    try {
      setSaveStatus("שומר...");
      if (onSaveDraft) {
        await onSaveDraft(formData);
        setSaveStatus("נשמר בשרת");
      }
    } catch (err) {
      setSaveStatus("שגיאה בשמירה");
    }
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-5 animate-fadeIn">
            <SectionTitle>פרטים אישיים</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="שם משפחה"
                value={formData.lastName}
                onChange={(v) => handleChange("lastName", v)}
              />
              <InputField
                label="שם פרטי"
                value={formData.firstName}
                onChange={(v) => handleChange("firstName", v)}
              />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-gray-700">מין</label>
                <div className="flex gap-4 mt-2">
                  {["ז", "נ"].map((g) => (
                    <label
                      key={g}
                      className="flex items-center gap-1 cursor-pointer text-sm font-medium"
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={() => handleChange("gender", g)}
                        className="w-4 h-4"
                      />
                      {g === "ז" ? "זכר" : "נקבה"}
                    </label>
                  ))}
                </div>
              </div>
              <InputField
                label="שם האב"
                value={formData.fatherName}
                onChange={(v) => handleChange("fatherName", v)}
              />
              <InputField
                label="שם האם"
                value={formData.motherName}
                onChange={(v) => handleChange("motherName", v)}
              />
              <InputField
                label="תאריך לידה"
                type="date"
                value={formData.birthDate}
                onChange={(v) => handleChange("birthDate", v)}
              />
              <InputField
                label="ת.ז."
                value={formData.idNumber}
                onChange={(v) => handleChange("idNumber", v)}
              />
              <InputField
                label="כתובת"
                value={formData.address}
                onChange={(v) => handleChange("address", v)}
              />
              <InputField
                label="מס' טלפון"
                value={formData.phone}
                onChange={(v) => handleChange("phone", v)}
              />
              <InputField
                label="בית ספר"
                value={formData.school}
                onChange={(v) => handleChange("school", v)}
              />
              <InputField
                label="כיתה"
                value={formData.grade}
                onChange={(v) => handleChange("grade", v)}
              />
              <InputField
                label="שם המחנך"
                value={formData.teacherName}
                onChange={(v) => handleChange("teacherName", v)}
              />
              <InputField
                label="טלפון מחנך"
                value={formData.teacherPhone}
                onChange={(v) => handleChange("teacherPhone", v)}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5 animate-fadeIn">
            <SectionTitle>סיבת ההפניה</SectionTitle>
            <InputField
              label="מי יזם את הפנייה?"
              value={formData.referralInitiator}
              onChange={(v) => handleChange("referralInitiator", v)}
            />
            <TextAreaField
              label="סיבות הפנייה"
              value={formData.referralReasons}
              onChange={(v) => handleChange("referralReasons", v)}
              rows={3}
            />
            <TextAreaField
              label="תיאור קשיי התלמיד"
              hint="ציין מתי החלו הקשיים ואת תדירות הופעתם"
              value={formData.difficultyDescription}
              onChange={(v) => handleChange("difficultyDescription", v)}
              rows={5}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-5 animate-fadeIn">
            <SectionTitle>הישגים לימודיים</SectionTitle>
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 p-2 text-right">
                    כיתה
                  </th>
                  <th className="border border-gray-300 p-2 text-right">
                    בית ספר
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.schoolHistory.map((row, i) => (
                  <tr key={i}>
                    <td className="border border-gray-300 p-1">
                      <input
                        value={row.grade}
                        onChange={(e) =>
                          handleSchoolHistory(i, "grade", e.target.value)
                        }
                        className="w-full outline-none p-1 rounded"
                      />
                    </td>
                    <td className="border border-gray-300 p-1">
                      <input
                        value={row.school}
                        onChange={(e) =>
                          handleSchoolHistory(i, "school", e.target.value)
                        }
                        className="w-full outline-none p-1 rounded"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <AddRowButton
              onClick={addSchoolHistoryRow}
              label="+ הוסף שורת בית ספר"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <InputField
                label="האם נשאר כיתה שנה נוספת?"
                value={formData.stayedGrade}
                onChange={(v) => handleChange("stayedGrade", v)}
              />
              <InputField
                label="באיזו כיתה?"
                value={formData.stayedGradeWhich}
                onChange={(v) => handleChange("stayedGradeWhich", v)}
              />
            </div>
            <InputField
              label="מה היו הסיבות לכך?"
              value={formData.stayedGradeReasons}
              onChange={(v) => handleChange("stayedGradeReasons", v)}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <InputField
                label="ציונים בתעודה - בכיתה"
                value={formData.reportCardGrade}
                onChange={(v) => handleChange("reportCardGrade", v)}
              />
              <InputField
                label="במחצית"
                value={formData.reportCardHalf}
                onChange={(v) => handleChange("reportCardHalf", v)}
              />
              <InputField
                label="שנת"
                value={formData.reportCardYear}
                onChange={(v) => handleChange("reportCardYear", v)}
              />
            </div>
            <table className="w-full border-collapse border border-gray-300 text-sm mt-6">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 p-2 text-right">
                    מקצוע
                  </th>
                  <th className="border border-gray-300 p-2 text-right w-32">
                    ציון
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.grades.map((row, i) => (
                  <tr key={i}>
                    <td className="border border-gray-300 p-1">
                      <input
                        value={row.subject}
                        onChange={(e) =>
                          handleGrade(i, "subject", e.target.value)
                        }
                        className="w-full outline-none p-1 rounded"
                      />
                    </td>
                    <td className="border border-gray-300 p-1">
                      <input
                        value={row.grade}
                        onChange={(e) =>
                          handleGrade(i, "grade", e.target.value)
                        }
                        className="w-full outline-none p-1 rounded"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <AddRowButton onClick={addGradeRow} label="+ הוסף מקצוע" />
            <div className="mt-6">
              <p className="text-sm font-bold text-gray-700 mb-2">
                הערך את הישגיו הלימודיים:
              </p>
              <div className="flex gap-3 flex-wrap">
                {[
                  "חלשים מאוד",
                  "חלשים",
                  "למטה מבינוניים",
                  "טובים",
                  "טובים מאוד",
                  "מצוינים",
                ].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-1 cursor-pointer text-sm border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition"
                  >
                    <input
                      type="radio"
                      name="academicLevel"
                      value={opt}
                      checked={formData.academicLevel === opt}
                      onChange={() => handleChange("academicLevel", opt)}
                    />{" "}
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-fadeIn">
            <SectionTitle>יחסים והתנהגות</SectionTitle>
            <RadioRow
              label="יחס למורים:"
              options={[
                "עוין",
                "מסויג",
                "תקין",
                "מחפש אהדה",
                "מחפש אהדה מופרזת",
              ]}
              value={formData.teacherRelation}
              onChange={(v) => handleChange("teacherRelation", v)}
            />
            <TextAreaField
              label="הערות ליחס למורים"
              value={formData.teacherRelationNotes}
              onChange={(v) => handleChange("teacherRelationNotes", v)}
            />
            <RadioRow
              label="יחס לבני כיתתו:"
              options={["מתבודד", "דחוי", "חברתיים קלושים", "מקובל", "מנהיג"]}
              value={formData.peerRelation}
              onChange={(v) => handleChange("peerRelation", v)}
            />
            <TextAreaField
              label="תיאור בעיות חברתיות"
              value={formData.peerProblems}
              onChange={(v) => handleChange("peerProblems", v)}
            />
            <div className="mt-6">
              <table className="w-full border-collapse border border-gray-300 text-sm font-sans">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 p-2 text-right">
                      התנהגות
                    </th>
                    {["אף פעם", "לפעמים", "קרובות", "קרובות מאד"].map((h) => (
                      <th
                        key={h}
                        className="border border-gray-300 p-2 text-center text-xs"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: "distractedEasily", label: "1. דעתו מוסחת בקלות." },
                    { key: "hardToFocus", label: "2. מתקשה להתרכז." },
                    { key: "excessiveMovement", label: "3. נע באופן מוגזם." },
                    { key: "leavesSeats", label: "4. עוזב את הכסא." },
                  ].map(({ key, label }) => (
                    <tr key={key}>
                      <td className="border border-gray-300 p-2 font-medium">
                        {label}
                      </td>
                      {[
                        "אף פעם / לעיתים רחוקות",
                        "לפעמים",
                        "לעיתים קרובות",
                        "לעיתים קרובות מאד",
                      ].map((opt) => (
                        <td
                          key={opt}
                          className="border border-gray-300 p-2 text-center"
                        >
                          <input
                            type="radio"
                            name={key}
                            value={opt}
                            checked={formData[key] === opt}
                            onChange={() => handleChange(key, opt)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-5 animate-fadeIn">
            <SectionTitle>בעיות התנהגות</SectionTitle>
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 p-2 text-right">
                    התנהגות
                  </th>
                  {FREQ_OPTIONS.map((h) => (
                    <th
                      key={h}
                      className="border border-gray-300 p-2 text-center text-xs"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BEHAVIOR_ITEMS.map((item) => (
                  <tr key={item} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">{item}</td>
                    {FREQ_OPTIONS.map((opt) => (
                      <td
                        key={opt}
                        className="border border-gray-300 p-2 text-center"
                      >
                        <input
                          type="radio"
                          name={`behavior_${item}`}
                          value={opt}
                          checked={formData.behaviorRatings[item] === opt}
                          onChange={() => handleBehavior(item, opt)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 6:
        return (
          <div className="space-y-5 animate-fadeIn">
            <SectionTitle>עזרה מיוחדת וסיכום</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="שעות שילוב"
                value={formData.integrationHours}
                onChange={(v) => handleChange("integrationHours", v)}
              />
              <InputField
                label='היקף (ש"ש)'
                value={formData.integrationScope}
                onChange={(v) => handleChange("integrationScope", v)}
              />
              <InputField
                label="כמה שנים"
                value={formData.integrationYears}
                onChange={(v) => handleChange("integrationYears", v)}
              />
            </div>
            <RadioRow
              label="טיפול רגשי?"
              options={["כן", "לא"]}
              value={formData.emotionalTreatment}
              onChange={(v) => handleChange("emotionalTreatment", v)}
            />
            <InputField
              label="איזה טיפול?"
              value={formData.emotionalTreatmentDetails}
              onChange={(v) => handleChange("emotionalTreatmentDetails", v)}
            />
            <RadioRow
              label="חינוך מיוחד?"
              options={["כן", "לא"]}
              value={formData.specialEducation}
              onChange={(v) => handleChange("specialEducation", v)}
            />
            <InputField
              label="שם הגן/כיתה"
              value={formData.specialEdName}
              onChange={(v) => handleChange("specialEdName", v)}
            />
            <TextAreaField
              label="סכם התרשמותך"
              value={formData.studentSummary}
              onChange={(v) => handleChange("studentSummary", v)}
              rows={4}
            />
            <TextAreaField
              label="שאלה אבחונית"
              value={formData.diagnosticQuestion}
              onChange={(v) => handleChange("diagnosticQuestion", v)}
              rows={2}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t mt-6">
              <InputField
                label="תאריך"
                type="date"
                value={formData.signatureDate}
                onChange={(v) => handleChange("signatureDate", v)}
              />
              <InputField
                label="שם המחנך"
                value={formData.teacherSignatureName}
                onChange={(v) => handleChange("teacherSignatureName", v)}
              />
              <InputField
                label="חתימת מחנך"
                value={formData.teacherSignature}
                onChange={(v) => handleChange("teacherSignature", v)}
              />
              <InputField
                label="חתימת מנהל"
                value={formData.principalSignature}
                onChange={(v) => handleChange("principalSignature", v)}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="bg-white max-w-5xl mx-auto rounded-2xl shadow-lg p-8 font-sans scroll-mt-10"
      dir="rtl"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">
            שאלון לצוות חינוכי
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-mono">
            תאריך: {formData.date}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {saveStatus && (
            <span className="text-blue-600 text-sm font-bold animate-pulse">
              {saveStatus}
            </span>
          )}
          <button
            onClick={saveDraft}
            className="bg-blue-50 text-blue-600 border border-blue-200 px-5 py-2 rounded-xl hover:bg-blue-100 transition font-bold shadow-sm"
          >
            💾 שמור טיוטה
          </button>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span className="font-bold text-blue-700">
            שלב {step} מתוך {STEPS.length}: {STEPS[step - 1]}
          </span>
          <span className="font-bold">
            {Math.round((step / STEPS.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 shadow-inner">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-700 ease-in-out"
            style={{ width: `${(step / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="min-h-[450px]">{renderStep()}</div>

      <div className="flex justify-between mt-12 pt-8 border-t border-gray-100">
        <button
          onClick={() => {
            if (step === 1) onCancel && onCancel();
            else {
              setStep(step - 1);
              scrollToTop();
            } // הפעלה של הגלילה
          }}
          className="text-gray-500 hover:text-gray-800 transition px-6 py-2 rounded-xl border border-gray-300 font-bold"
        >
          {step === 1 ? "ביטול וחזרה" : "→ שלב הקודם"}
        </button>

        {step < STEPS.length ? (
          <button
            onClick={() => {
              setStep(step + 1);
              scrollToTop();
            }} // הפעלה של הגלילה
            className="bg-blue-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            המשך לשלב הבא ←
          </button>
        ) : (
          <button
            onClick={() => {
              if (
                window.confirm(
                  "בטוח שסיימת? לאחר השליחה לא ניתן יהיה לשנות את התשובות.",
                )
              ) {
                onSave(formData);
              }
            }}
            className="bg-green-600 text-white px-10 py-2 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95"
          >
            ✓ שלח שאלון סופי
          </button>
        )}
      </div>
    </div>
  );
};

export default SchoolQuestionnaire;
