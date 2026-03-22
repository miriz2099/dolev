// // // import React, { useState, useEffect } from "react";
// // // // import { db } from "./config/firebase";
// // // import { db } from "../firebase";
// // // import { getAuth } from "firebase/auth";

// // // import {
// // //   collection,
// // //   addDoc,
// // //   serverTimestamp,
// // //   doc,
// // //   setDoc,
// // //   getDoc,
// // // } from "firebase/firestore";

// // // const API_URL = import.meta.env.VITE_API_URL;

// // // const InputField = ({
// // //   label,
// // //   value,
// // //   onChange,
// // //   type = "text",
// // //   className = "",
// // //   wide = false,
// // // }) => (
// // //   <div
// // //     className={`flex flex-col gap-1 ${wide ? "col-span-2" : ""} ${className}`}
// // //   >
// // //     <label className="text-sm font-bold text-gray-700">{label}</label>
// // //     <input
// // //       type={type}
// // //       value={value || ""}
// // //       onChange={(e) => onChange(e.target.value)}
// // //       className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
// // //     />
// // //   </div>
// // // );

// // // const TextAreaField = ({ label, value, onChange, rows = 3 }) => (
// // //   <div className="flex flex-col gap-1">
// // //     <label className="text-sm font-bold text-gray-700">{label}</label>
// // //     <textarea
// // //       rows={rows}
// // //       value={value || ""}
// // //       onChange={(e) => onChange(e.target.value)}
// // //       className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
// // //     />
// // //   </div>
// // // );

// // // const SectionTitle = ({ children }) => (
// // //   <h3 className="text-xl font-bold text-blue-800 underline mt-2 mb-4">
// // //     {children}
// // //   </h3>
// // // );

// // // const SubTitle = ({ children }) => (
// // //   <h4 className="text-base font-bold text-blue-700 underline mt-4 mb-2">
// // //     {children}
// // //   </h4>
// // // );

// // // const AddRowButton = ({ onClick, label = "+ הוסף שורה" }) => (
// // //   <button
// // //     type="button"
// // //     onClick={onClick}
// // //     className="mt-2 text-sm text-blue-600 border border-blue-300 rounded-lg px-3 py-1 hover:bg-blue-50 transition"
// // //   >
// // //     {label}
// // //   </button>
// // // );

// // // const STEPS = [
// // //   "פרטים אישיים",
// // //   "סיבת הפנייה",
// // //   "מהלך הלימודים",
// // //   "הערכת תפקוד",
// // //   "פרטים על המשפחה",
// // //   "בריאות",
// // //   "רקע התפתחותי",
// // //   "הילד/ה היום",
// // //   "תפקוד חברתי",
// // //   "סדר יום וחתימה",
// // // ];

// // // const ParentQuestionnaire = ({ childId = "default", onSave, onCancel }) => {
// // //   const formTopRef = React.useRef(null);

// // //   const [step, setStep] = useState(1);
// // //   const [saveStatus, setSaveStatus] = useState("");
// // //   const [formData, setFormData] = useState({
// // //     date: new Date().toLocaleDateString("he-IL"),

// // //     // Step 1
// // //     childFirstName: "",
// // //     childLastName: "",
// // //     gender: "",
// // //     idNumber: "",
// // //     birthDate: "",
// // //     birthCountry: "",
// // //     aliyaDate: "",
// // //     fatherName: "",
// // //     motherName: "",
// // //     familyStatus: "",
// // //     familyNotes: "",
// // //     address: "",
// // //     phone: "",
// // //     schoolOrGarden: "",
// // //     grade: "",
// // //     homeLanguage: "",

// // //     // Step 2
// // //     difficultyDescription: "",
// // //     referralGoals: "",
// // //     onsetTime: "",
// // //     hadAssessment: "",
// // //     assessmentType: "",
// // //     assessmentDate: "",
// // //     assessmentRecommendations: "",
// // //     paraMedicalTreatments: "",
// // //     expressedDistress: "",
// // //     willingToConsult: "",

// // //     // Step 3
// // //     firstFrameworkAge: "",
// // //     firstFrameworkType: "",
// // //     prePreSchoolReports: "",
// // //     preSchoolReports: "",
// // //     schoolHistory: [
// // //       { grade: "", school: "", city: "" },
// // //       { grade: "", school: "", city: "" },
// // //       { grade: "", school: "", city: "" },
// // //     ],
// // //     stayedGrade: "",
// // //     stayedGradeWhich: "",
// // //     stayedGradeReason: "",

// // //     // Step 4
// // //     functioning: { studies: "", family: "", social: "", notes: "" },

// // //     // Step 5
// // //     familyStructure: {
// // //       motherAge: "",
// // //       motherJob: "",
// // //       motherNotes: "",
// // //       fatherAge: "",
// // //       fatherJob: "",
// // //       fatherNotes: "",
// // //       siblings: [
// // //         { name: "", age: "", framework: "", notes: "" },
// // //         { name: "", age: "", framework: "", notes: "" },
// // //         { name: "", age: "", framework: "", notes: "" },
// // //       ],
// // //     },

// // //     // Step 6
// // //     generalHealth: "",
// // //     visionDate: "",
// // //     visionFindings: "",
// // //     hearingDate: "",
// // //     hearingFindings: "",
// // //     pastDiseases: "",
// // //     hospitalization: "",
// // //     hospitalizationAge: "",
// // //     hospitalizationDuration: "",
// // //     hospitalizationReason: "",
// // //     regularMedications: "",

// // //     // Step 7
// // //     development: {
// // //       plannedPregnancy: "",
// // //       normalPregnancy: "",
// // //       pregnancyDetails: "",
// // //       normalBirth: "",
// // //       birthDetails: "",
// // //       birthWeight: "",
// // //       problemsAfterBirthChild: "",
// // //       problemsAfterBirthMother: "",
// // //       normalMotorDev: "",
// // //       walkingAge: "",
// // //       normalLanguageDev: "",
// // //       firstWordsAge: "",
// // //       sleepIssuesFirstYear: "",
// // //       eatingIssuesFirstYear: "",
// // //       diaperGraduationAge: "",
// // //     },

// // //     // Step 8
// // //     currentProblems: {
// // //       foodSleepFears: "",
// // //       foodSleepFearsDetails: "",
// // //       restlessness: "",
// // //       excitedEasily: "",
// // //       disturbsOthers: "",
// // //       difficultyCompletingTasks: "",
// // //       needsSpecialAttention: "",
// // //       dependencyVsIndependence: "",
// // //       otherBehavioral: "",
// // //       closerToWho: "",
// // //     },

// // //     // Step 9
// // //     social: {
// // //       hasFriends: "",
// // //       socialLevel: "",
// // //       meaningfulConnections: "",
// // //       oppositeSexConnections: "",
// // //       socialProblemsDetails: "",
// // //     },

// // //     // Step 10
// // //     dailyRoutine: [
// // //       { time: "", activity: "" },
// // //       { time: "", activity: "" },
// // //       { time: "", activity: "" },
// // //     ],
// // //     parentsSignature: "",
// // //     signatureDate: "",
// // //   });

// // //   useEffect(() => {
// // //     const loadDraft = async () => {
// // //       if (!childId || childId === "default") return;

// // //       try {
// // //         setSaveStatus("טוען טיוטה...");
// // //         const auth = getAuth();
// // //         const user = auth.currentUser;
// // //         const token = await user.getIdToken();

// // //         const response = await fetch(
// // //           `${API_URL}/questionnaires/draft/${childId}`,
// // //           {
// // //             headers: {
// // //               Authorization: `Bearer ${token}`,
// // //             },
// // //           },
// // //         );

// // //         if (response.ok) {
// // //           const data = await response.json();
// // //           setFormData(data.formData);
// // //           if (data.step) setStep(data.step);
// // //           setSaveStatus("טיוטה נטענה");
// // //         }
// // //       } catch (error) {
// // //         console.error("Load draft error:", error);
// // //       } finally {
// // //         setTimeout(() => setSaveStatus(""), 2000);
// // //       }
// // //     };

// // //     loadDraft();
// // //   }, [childId]);

// // //   const saveDraft = async () => {
// // //     if (!childId) return;

// // //     try {
// // //       setSaveStatus("שומר טיוטה...");
// // //       const auth = getAuth();
// // //       const user = auth.currentUser;
// // //       const token = await user.getIdToken();
// // //       // קריאה לבקאנד שלך (בהנחה שיצרנו נתיב לטיוטה)
// // //       // const token = await auth.currentUser.getIdToken();
// // //       const response = await fetch(`${API_URL}/questionnaires/draft`, {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //           Authorization: `Bearer ${token}`,
// // //         },
// // //         body: JSON.stringify({
// // //           childId: childId,
// // //           formData: formData,
// // //         }),
// // //       });

// // //       if (response.ok) {
// // //         setSaveStatus("טיוטה נשמרה ב-" + new Date().toLocaleTimeString());
// // //         setTimeout(() => setSaveStatus(""), 3000);
// // //       } else {
// // //         throw new Error("Failed to save draft");
// // //       }
// // //     } catch (error) {
// // //       console.error("Error saving draft:", error);
// // //       setSaveStatus("שגיאה בשמירת הטיוטה");
// // //     }
// // //   };

// // //   const scrollToTop = () => {
// // //     if (formTopRef.current) {
// // //       // גלילה למיקום האלמנט פחות 100 פיקסלים (כדי שלא יוסתר על ידי ה-Header)
// // //       const yOffset = -100;
// // //       const y =
// // //         formTopRef.current.getBoundingClientRect().top +
// // //         window.pageYOffset +
// // //         yOffset;
// // //       window.scrollTo({ top: y, behavior: "smooth" });
// // //     }
// // //   };
// // //   // --- פונקציית שליחה סופית ---
// // //   const handleFinalSubmit = async () => {
// // //     try {
// // //       setSaveStatus("שולח שאלון...");
// // //       const auth = getAuth();
// // //       const user = auth.currentUser;
// // //       const token = await user.getIdToken();

// // //       // כאן תשתמשי בפונקציית ה-API המרכזית שלך (למשל axiosInstance)
// // //       const response = await fetch(`${API_URL}/questionnaires/submit`, {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //           Authorization: `Bearer ${token}`, // הטוקן מה-AuthContext
// // //         },
// // //         body: JSON.stringify({
// // //           childId: childId,
// // //           formData: formData,
// // //         }),
// // //       });

// // //       if (response.ok) {
// // //         setSaveStatus("השאלון נשלח בהצלחה!");
// // //         onSave(formData);
// // //       } else {
// // //         throw new Error("Failed to submit");
// // //       }
// // //     } catch (error) {
// // //       setSaveStatus("שגיאה בשליחה");
// // //     }
// // //   };
// // //   const handleChange = (field, value) =>
// // //     setFormData((prev) => ({ ...prev, [field]: value }));

// // //   const handleNested = (section, field, value) =>
// // //     setFormData((prev) => ({
// // //       ...prev,
// // //       [section]: { ...prev[section], [field]: value },
// // //     }));

// // //   const handleSchoolHistory = (index, field, value) => {
// // //     const updated = [...formData.schoolHistory];
// // //     updated[index] = { ...updated[index], [field]: value };
// // //     setFormData((prev) => ({ ...prev, schoolHistory: updated }));
// // //   };

// // //   const addSchoolHistoryRow = () =>
// // //     setFormData((prev) => ({
// // //       ...prev,
// // //       schoolHistory: [
// // //         ...prev.schoolHistory,
// // //         { grade: "", school: "", city: "" },
// // //       ],
// // //     }));

// // //   const handleSibling = (index, field, value) => {
// // //     const updated = [...formData.familyStructure.siblings];
// // //     updated[index] = { ...updated[index], [field]: value };
// // //     setFormData((prev) => ({
// // //       ...prev,
// // //       familyStructure: { ...prev.familyStructure, siblings: updated },
// // //     }));
// // //   };

// // //   const addSiblingRow = () =>
// // //     setFormData((prev) => ({
// // //       ...prev,
// // //       familyStructure: {
// // //         ...prev.familyStructure,
// // //         siblings: [
// // //           ...prev.familyStructure.siblings,
// // //           { name: "", age: "", framework: "", notes: "" },
// // //         ],
// // //       },
// // //     }));

// // //   const handleDailyRoutine = (index, field, value) => {
// // //     const updated = [...formData.dailyRoutine];
// // //     updated[index] = { ...updated[index], [field]: value };
// // //     setFormData((prev) => ({ ...prev, dailyRoutine: updated }));
// // //   };

// // //   const addDailyRoutineRow = () =>
// // //     setFormData((prev) => ({
// // //       ...prev,
// // //       dailyRoutine: [...prev.dailyRoutine, { time: "", activity: "" }],
// // //     }));

// // //   const renderStep = () => {
// // //     switch (step) {
// // //       case 1:
// // //         return (
// // //           <div className="space-y-5">
// // //             <SectionTitle>פרטים אישיים</SectionTitle>
// // //             <div className="grid grid-cols-3 gap-4">
// // //               <InputField
// // //                 label="שם פרטי של הילד/ה"
// // //                 value={formData.childFirstName}
// // //                 onChange={(v) => handleChange("childFirstName", v)}
// // //               />
// // //               <InputField
// // //                 label="שם משפחה"
// // //                 value={formData.childLastName}
// // //                 onChange={(v) => handleChange("childLastName", v)}
// // //               />
// // //               <InputField
// // //                 label="מין"
// // //                 value={formData.gender}
// // //                 onChange={(v) => handleChange("gender", v)}
// // //               />
// // //               <InputField
// // //                 label="ת.ז"
// // //                 value={formData.idNumber}
// // //                 onChange={(v) => handleChange("idNumber", v)}
// // //               />
// // //               <InputField
// // //                 label="תאריך לידה"
// // //                 type="date"
// // //                 value={formData.birthDate}
// // //                 onChange={(v) => handleChange("birthDate", v)}
// // //               />
// // //               <InputField
// // //                 label="ארץ לידה"
// // //                 value={formData.birthCountry}
// // //                 onChange={(v) => handleChange("birthCountry", v)}
// // //               />
// // //               <InputField
// // //                 label="תאריך עלייה"
// // //                 value={formData.aliyaDate}
// // //                 onChange={(v) => handleChange("aliyaDate", v)}
// // //               />
// // //               <InputField
// // //                 label="שם האב"
// // //                 value={formData.fatherName}
// // //                 onChange={(v) => handleChange("fatherName", v)}
// // //               />
// // //               <InputField
// // //                 label="שם האם"
// // //                 value={formData.motherName}
// // //                 onChange={(v) => handleChange("motherName", v)}
// // //               />
// // //               <InputField
// // //                 label="מצב משפחתי (הורים)"
// // //                 value={formData.familyStatus}
// // //                 onChange={(v) => handleChange("familyStatus", v)}
// // //               />
// // //             </div>
// // //             <TextAreaField
// // //               label="הערות למצב המשפחתי"
// // //               value={formData.familyNotes}
// // //               onChange={(v) => handleChange("familyNotes", v)}
// // //             />
// // //             <div className="grid grid-cols-2 gap-4">
// // //               <InputField
// // //                 label="כתובת"
// // //                 value={formData.address}
// // //                 onChange={(v) => handleChange("address", v)}
// // //               />
// // //               <InputField
// // //                 label="מספר טלפון"
// // //                 value={formData.phone}
// // //                 onChange={(v) => handleChange("phone", v)}
// // //               />
// // //               <InputField
// // //                 label="בית ספר/גן"
// // //                 value={formData.schoolOrGarden}
// // //                 onChange={(v) => handleChange("schoolOrGarden", v)}
// // //               />
// // //               <InputField
// // //                 label="כיתה"
// // //                 value={formData.grade}
// // //                 onChange={(v) => handleChange("grade", v)}
// // //               />
// // //               <InputField
// // //                 label="שפה מדוברת בבית"
// // //                 value={formData.homeLanguage}
// // //                 onChange={(v) => handleChange("homeLanguage", v)}
// // //               />
// // //             </div>
// // //           </div>
// // //         );

// // //       case 2:
// // //         return (
// // //           <div className="space-y-5">
// // //             <SectionTitle>סיבת הפנייה</SectionTitle>
// // //             <TextAreaField
// // //               label="תיאור הקושי"
// // //               value={formData.difficultyDescription}
// // //               onChange={(v) => handleChange("difficultyDescription", v)}
// // //               rows={4}
// // //             />
// // //             <TextAreaField
// // //               label="מטרות הפנייה"
// // //               value={formData.referralGoals}
// // //               onChange={(v) => handleChange("referralGoals", v)}
// // //               rows={4}
// // //             />
// // //             <InputField
// // //               label="מתי התחילו הקשיים?"
// // //               value={formData.onsetTime}
// // //               onChange={(v) => handleChange("onsetTime", v)}
// // //             />
// // //             <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
// // //               <p className="font-bold text-gray-700 text-sm">
// // //                 האם הילד/ה עבר אבחון פסיכולוגי, או אחר (כגון: נוירולוגי / ר.
// // //                 בעיסוק / ק. תקשורת)?
// // //               </p>
// // //               <div className="grid grid-cols-2 gap-4">
// // //                 <InputField
// // //                   label="איזה אבחון/ים"
// // //                   value={formData.assessmentType}
// // //                   onChange={(v) => handleChange("assessmentType", v)}
// // //                 />
// // //                 <InputField
// // //                   label="תאריך"
// // //                   value={formData.assessmentDate}
// // //                   onChange={(v) => handleChange("assessmentDate", v)}
// // //                 />
// // //               </div>
// // //               <TextAreaField
// // //                 label="מה היו המלצות האבחון/ים?"
// // //                 value={formData.assessmentRecommendations}
// // //                 onChange={(v) => handleChange("assessmentRecommendations", v)}
// // //               />
// // //             </div>
// // //             <TextAreaField
// // //               label="האם הילד/ה היה/הייתה בטיפול פרא רפואי כגון ריפוי בעיסוק, קלינאית תקשורת, פיזיותרפיה או אחר?"
// // //               value={formData.paraMedicalTreatments}
// // //               onChange={(v) => handleChange("paraMedicalTreatments", v)}
// // //             />
// // //             <InputField
// // //               label="האם הילד/ה דיבר/ה על מצוקת חששות, חרדות, פחדים?"
// // //               value={formData.expressedDistress}
// // //               onChange={(v) => handleChange("expressedDistress", v)}
// // //             />
// // //             <InputField
// // //               label="האם הילד הביע רצון או נכונות להתייעץ עם איש מקצוע?"
// // //               value={formData.willingToConsult}
// // //               onChange={(v) => handleChange("willingToConsult", v)}
// // //             />
// // //           </div>
// // //         );

// // //       case 3:
// // //         return (
// // //           <div className="space-y-5">
// // //             <SectionTitle>מהלך הלימודים</SectionTitle>
// // //             <div className="grid grid-cols-2 gap-4">
// // //               <InputField
// // //                 label='באיזה גיל יצא/ה לראשונה למסגרת לימודית (מעון/גן/בי"ס)?'
// // //                 value={formData.firstFrameworkAge}
// // //                 onChange={(v) => handleChange("firstFrameworkAge", v)}
// // //               />
// // //               <InputField
// // //                 label="לאיזו מסגרת?"
// // //                 value={formData.firstFrameworkType}
// // //                 onChange={(v) => handleChange("firstFrameworkType", v)}
// // //               />
// // //             </div>
// // //             <TextAreaField
// // //               label="האם הילד/ה ביקר/ה בגן טרום חובה? אם כן מה היו הדיווחים על תפקודו/ה שם?"
// // //               value={formData.prePreSchoolReports}
// // //               onChange={(v) => handleChange("prePreSchoolReports", v)}
// // //             />
// // //             <TextAreaField
// // //               label="מה היו הדיווחים על התפקוד בגן-חובה? אם נשאר/ה שנה נוספת בגן חובה - מה הייתה הסיבה לכך?"
// // //               value={formData.preSchoolReports}
// // //               onChange={(v) => handleChange("preSchoolReports", v)}
// // //             />
// // //             <div>
// // //               <p className="text-sm font-bold text-gray-700 mb-2">
// // //                 מהלך הלימודים בביה"ס:
// // //               </p>
// // //               <table
// // //                 className="w-full border-collapse border border-gray-300 text-sm"
// // //                 dir="rtl"
// // //               >
// // //                 <thead>
// // //                   <tr className="bg-blue-50">
// // //                     <th className="border border-gray-300 p-2 text-right">
// // //                       כיתות
// // //                     </th>
// // //                     <th className="border border-gray-300 p-2 text-right">
// // //                       בית ספר
// // //                     </th>
// // //                     <th className="border border-gray-300 p-2 text-right">
// // //                       יישוב
// // //                     </th>
// // //                   </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                   {formData.schoolHistory.map((row, i) => (
// // //                     <tr key={i}>
// // //                       <td className="border border-gray-300 p-1">
// // //                         <input
// // //                           value={row.grade}
// // //                           onChange={(e) =>
// // //                             handleSchoolHistory(i, "grade", e.target.value)
// // //                           }
// // //                           className="w-full outline-none p-1 rounded"
// // //                         />
// // //                       </td>
// // //                       <td className="border border-gray-300 p-1">
// // //                         <input
// // //                           value={row.school}
// // //                           onChange={(e) =>
// // //                             handleSchoolHistory(i, "school", e.target.value)
// // //                           }
// // //                           className="w-full outline-none p-1 rounded"
// // //                         />
// // //                       </td>
// // //                       <td className="border border-gray-300 p-1">
// // //                         <input
// // //                           value={row.city}
// // //                           onChange={(e) =>
// // //                             handleSchoolHistory(i, "city", e.target.value)
// // //                           }
// // //                           className="w-full outline-none p-1 rounded"
// // //                         />
// // //                       </td>
// // //                     </tr>
// // //                   ))}
// // //                 </tbody>
// // //               </table>
// // //               <AddRowButton
// // //                 onClick={addSchoolHistoryRow}
// // //                 label="+ הוסף שורת בית ספר"
// // //               />
// // //             </div>
// // //             <div className="grid grid-cols-2 gap-4">
// // //               <InputField
// // //                 label="האם נשאר/ה כיתה?"
// // //                 value={formData.stayedGrade}
// // //                 onChange={(v) => handleChange("stayedGrade", v)}
// // //               />
// // //               <InputField
// // //                 label="באיזו כיתה?"
// // //                 value={formData.stayedGradeWhich}
// // //                 onChange={(v) => handleChange("stayedGradeWhich", v)}
// // //               />
// // //             </div>
// // //             <InputField
// // //               label="מדוע?"
// // //               value={formData.stayedGradeReason}
// // //               onChange={(v) => handleChange("stayedGradeReason", v)}
// // //             />
// // //           </div>
// // //         );

// // //       case 4:
// // //         return (
// // //           <div className="space-y-5">
// // //             <SectionTitle>הערכת תפקוד</SectionTitle>
// // //             <p className="text-sm font-bold text-gray-700">
// // //               באופן כללי, להערכתכם, איך אתם מתארים את התפקוד של הילד/ה?
// // //             </p>
// // //             <table
// // //               className="w-full border-collapse border border-gray-300 text-sm"
// // //               dir="rtl"
// // //             >
// // //               <thead>
// // //                 <tr className="bg-blue-50">
// // //                   <th className="border border-gray-300 p-2 text-right w-1/4">
// // //                     תחומי התפקוד
// // //                   </th>
// // //                   <th className="border border-gray-300 p-2 text-center">
// // //                     מצוין
// // //                   </th>
// // //                   <th className="border border-gray-300 p-2 text-center">
// // //                     טוב
// // //                   </th>
// // //                   <th className="border border-gray-300 p-2 text-center">
// // //                     מתקשה
// // //                   </th>
// // //                   <th className="border border-gray-300 p-2 text-center">
// // //                     מתקשה מאד
// // //                   </th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {[
// // //                   { key: "studies", label: "בלימודים" },
// // //                   { key: "family", label: "במשפחה" },
// // //                   { key: "social", label: "בחברה" },
// // //                 ].map(({ key, label }) => (
// // //                   <tr key={key}>
// // //                     <td className="border border-gray-300 p-2 font-bold">
// // //                       {label}
// // //                     </td>
// // //                     {["מצוין", "טוב", "מתקשה", "מתקשה מאד"].map((opt) => (
// // //                       <td
// // //                         key={opt}
// // //                         className="border border-gray-300 p-2 text-center"
// // //                       >
// // //                         <input
// // //                           type="radio"
// // //                           name={`functioning_${key}`}
// // //                           value={opt}
// // //                           checked={formData.functioning[key] === opt}
// // //                           onChange={() => handleNested("functioning", key, opt)}
// // //                           className="w-4 h-4"
// // //                         />
// // //                       </td>
// // //                     ))}
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //             <TextAreaField
// // //               label="הערות"
// // //               value={formData.functioning.notes}
// // //               onChange={(v) => handleNested("functioning", "notes", v)}
// // //               rows={4}
// // //             />
// // //           </div>
// // //         );

// // //       case 5:
// // //         return (
// // //           <div className="space-y-5">
// // //             <SectionTitle>
// // //               פרטים על משפחת הילד/ה (כולל הילד/ה עצמו)
// // //             </SectionTitle>
// // //             <table
// // //               className="w-full border-collapse border border-gray-300 text-sm"
// // //               dir="rtl"
// // //             >
// // //               <thead>
// // //                 <tr className="bg-blue-50">
// // //                   <th className="border border-gray-300 p-2 text-right">שם</th>
// // //                   <th className="border border-gray-300 p-2 text-right">גיל</th>
// // //                   <th className="border border-gray-300 p-2 text-right">
// // //                     עיסוק
// // //                   </th>
// // //                   <th className="border border-gray-300 p-2 text-right">
// // //                     הערות
// // //                   </th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 <tr>
// // //                   <td className="border border-gray-300 p-2 font-bold">אם:</td>
// // //                   <td className="border border-gray-300 p-1">
// // //                     <input
// // //                       value={formData.familyStructure.motherAge}
// // //                       onChange={(e) =>
// // //                         handleNested(
// // //                           "familyStructure",
// // //                           "motherAge",
// // //                           e.target.value,
// // //                         )
// // //                       }
// // //                       className="w-full outline-none p-1 rounded"
// // //                     />
// // //                   </td>
// // //                   <td className="border border-gray-300 p-1">
// // //                     <input
// // //                       value={formData.familyStructure.motherJob}
// // //                       onChange={(e) =>
// // //                         handleNested(
// // //                           "familyStructure",
// // //                           "motherJob",
// // //                           e.target.value,
// // //                         )
// // //                       }
// // //                       className="w-full outline-none p-1 rounded"
// // //                     />
// // //                   </td>
// // //                   <td className="border border-gray-300 p-1">
// // //                     <input
// // //                       value={formData.familyStructure.motherNotes}
// // //                       onChange={(e) =>
// // //                         handleNested(
// // //                           "familyStructure",
// // //                           "motherNotes",
// // //                           e.target.value,
// // //                         )
// // //                       }
// // //                       className="w-full outline-none p-1 rounded"
// // //                     />
// // //                   </td>
// // //                 </tr>
// // //                 <tr>
// // //                   <td className="border border-gray-300 p-2 font-bold">אב:</td>
// // //                   <td className="border border-gray-300 p-1">
// // //                     <input
// // //                       value={formData.familyStructure.fatherAge}
// // //                       onChange={(e) =>
// // //                         handleNested(
// // //                           "familyStructure",
// // //                           "fatherAge",
// // //                           e.target.value,
// // //                         )
// // //                       }
// // //                       className="w-full outline-none p-1 rounded"
// // //                     />
// // //                   </td>
// // //                   <td className="border border-gray-300 p-1">
// // //                     <input
// // //                       value={formData.familyStructure.fatherJob}
// // //                       onChange={(e) =>
// // //                         handleNested(
// // //                           "familyStructure",
// // //                           "fatherJob",
// // //                           e.target.value,
// // //                         )
// // //                       }
// // //                       className="w-full outline-none p-1 rounded"
// // //                     />
// // //                   </td>
// // //                   <td className="border border-gray-300 p-1">
// // //                     <input
// // //                       value={formData.familyStructure.fatherNotes}
// // //                       onChange={(e) =>
// // //                         handleNested(
// // //                           "familyStructure",
// // //                           "fatherNotes",
// // //                           e.target.value,
// // //                         )
// // //                       }
// // //                       className="w-full outline-none p-1 rounded"
// // //                     />
// // //                   </td>
// // //                 </tr>
// // //               </tbody>
// // //             </table>

// // //             <p className="text-sm font-bold text-gray-700 mt-4">
// // //               אחים (מהבכור לצעיר):
// // //             </p>
// // //             <table
// // //               className="w-full border-collapse border border-gray-300 text-sm"
// // //               dir="rtl"
// // //             >
// // //               <thead>
// // //                 <tr className="bg-blue-50">
// // //                   <th className="border border-gray-300 p-2 text-right w-8">
// // //                     #
// // //                   </th>
// // //                   <th className="border border-gray-300 p-2 text-right">שם</th>
// // //                   <th className="border border-gray-300 p-2 text-right">גיל</th>
// // //                   <th className="border border-gray-300 p-2 text-right">
// // //                     מסגרת/עיסוק
// // //                   </th>
// // //                   <th className="border border-gray-300 p-2 text-right">
// // //                     רקע חינוכי/הערות
// // //                   </th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {formData.familyStructure.siblings.map((sib, i) => (
// // //                   <tr key={i}>
// // //                     <td className="border border-gray-300 p-2 text-center font-bold">
// // //                       {i + 1}.
// // //                     </td>
// // //                     <td className="border border-gray-300 p-1">
// // //                       <input
// // //                         value={sib.name}
// // //                         onChange={(e) =>
// // //                           handleSibling(i, "name", e.target.value)
// // //                         }
// // //                         className="w-full outline-none p-1 rounded"
// // //                       />
// // //                     </td>
// // //                     <td className="border border-gray-300 p-1">
// // //                       <input
// // //                         value={sib.age}
// // //                         onChange={(e) =>
// // //                           handleSibling(i, "age", e.target.value)
// // //                         }
// // //                         className="w-full outline-none p-1 rounded"
// // //                       />
// // //                     </td>
// // //                     <td className="border border-gray-300 p-1">
// // //                       <input
// // //                         value={sib.framework}
// // //                         onChange={(e) =>
// // //                           handleSibling(i, "framework", e.target.value)
// // //                         }
// // //                         className="w-full outline-none p-1 rounded"
// // //                       />
// // //                     </td>
// // //                     <td className="border border-gray-300 p-1">
// // //                       <input
// // //                         value={sib.notes}
// // //                         onChange={(e) =>
// // //                           handleSibling(i, "notes", e.target.value)
// // //                         }
// // //                         className="w-full outline-none p-1 rounded"
// // //                       />
// // //                     </td>
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //             <AddRowButton onClick={addSiblingRow} label="+ הוסף אח/אחות" />
// // //           </div>
// // //         );

// // //       case 6:
// // //         return (
// // //           <div className="space-y-5">
// // //             <SectionTitle>בריאות</SectionTitle>
// // //             <InputField
// // //               label="מה מצב בריאותו/ה הכללי של הילד/ה?"
// // //               value={formData.generalHealth}
// // //               onChange={(v) => handleChange("generalHealth", v)}
// // //             />
// // //             <div className="grid grid-cols-2 gap-4">
// // //               <InputField
// // //                 label="בדיקת ראייה - תאריך"
// // //                 value={formData.visionDate}
// // //                 onChange={(v) => handleChange("visionDate", v)}
// // //               />
// // //               <InputField
// // //                 label="ממצאים"
// // //                 value={formData.visionFindings}
// // //                 onChange={(v) => handleChange("visionFindings", v)}
// // //               />
// // //               <InputField
// // //                 label="בדיקת שמיעה - תאריך"
// // //                 value={formData.hearingDate}
// // //                 onChange={(v) => handleChange("hearingDate", v)}
// // //               />
// // //               <InputField
// // //                 label="ממצאים"
// // //                 value={formData.hearingFindings}
// // //                 onChange={(v) => handleChange("hearingFindings", v)}
// // //               />
// // //             </div>
// // //             <TextAreaField
// // //               label="האם הילד/ה סובל או סבל בעבר ממחלה?"
// // //               value={formData.pastDiseases}
// // //               onChange={(v) => handleChange("pastDiseases", v)}
// // //             />
// // //             <div className="grid grid-cols-3 gap-4">
// // //               <InputField
// // //                 label="האם הילד/ה היה/הייתה מאושפז בבית חולים?"
// // //                 value={formData.hospitalization}
// // //                 onChange={(v) => handleChange("hospitalization", v)}
// // //               />
// // //               <InputField
// // //                 label="באיזה גיל?"
// // //                 value={formData.hospitalizationAge}
// // //                 onChange={(v) => handleChange("hospitalizationAge", v)}
// // //               />
// // //               <InputField
// // //                 label="לכמה זמן?"
// // //                 value={formData.hospitalizationDuration}
// // //                 onChange={(v) => handleChange("hospitalizationDuration", v)}
// // //               />
// // //             </div>
// // //             <TextAreaField
// // //               label="מאיזו סיבה?"
// // //               value={formData.hospitalizationReason}
// // //               onChange={(v) => handleChange("hospitalizationReason", v)}
// // //             />
// // //             <InputField
// // //               label="האם נוטל תרופות באופן קבוע?"
// // //               value={formData.regularMedications}
// // //               onChange={(v) => handleChange("regularMedications", v)}
// // //             />
// // //           </div>
// // //         );

// // //       case 7:
// // //         return (
// // //           <div className="space-y-5">
// // //             <SectionTitle>רקע התפתחותי</SectionTitle>
// // //             <div className="grid grid-cols-2 gap-4">
// // //               <InputField
// // //                 label="האם ההיריון היה/הייתה מתוכנן? (כן / לא)"
// // //                 value={formData.development.plannedPregnancy}
// // //                 onChange={(v) =>
// // //                   handleNested("development", "plannedPregnancy", v)
// // //                 }
// // //               />
// // //               <InputField
// // //                 label="האם ההיריון היה תקין? (כן / לא)"
// // //                 value={formData.development.normalPregnancy}
// // //                 onChange={(v) =>
// // //                   handleNested("development", "normalPregnancy", v)
// // //                 }
// // //               />
// // //             </div>
// // //             <InputField
// // //               label="פרט על ההיריון"
// // //               value={formData.development.pregnancyDetails}
// // //               onChange={(v) =>
// // //                 handleNested("development", "pregnancyDetails", v)
// // //               }
// // //             />
// // //             <div className="grid grid-cols-2 gap-4">
// // //               <InputField
// // //                 label="האם הלידה הייתה תקינה? (כן / לא)"
// // //                 value={formData.development.normalBirth}
// // //                 onChange={(v) => handleNested("development", "normalBirth", v)}
// // //               />
// // //               <InputField
// // //                 label="משקל הלידה"
// // //                 value={formData.development.birthWeight}
// // //                 onChange={(v) => handleNested("development", "birthWeight", v)}
// // //               />
// // //             </div>
// // //             <InputField
// // //               label="פרט על הלידה"
// // //               value={formData.development.birthDetails}
// // //               onChange={(v) => handleNested("development", "birthDetails", v)}
// // //             />
// // //             <InputField
// // //               label="האם הופיעו בעיות רפואיות לאחר הלידה?"
// // //               value={formData.development.problemsAfterBirthChild}
// // //               onChange={(v) =>
// // //                 handleNested("development", "problemsAfterBirthChild", v)
// // //               }
// // //             />
// // //             <InputField
// // //               label="האם האם סבלה מבעיות רפואיות לאחר הלידה?"
// // //               value={formData.development.problemsAfterBirthMother}
// // //               onChange={(v) =>
// // //                 handleNested("development", "problemsAfterBirthMother", v)
// // //               }
// // //             />
// // //             <div className="grid grid-cols-2 gap-4">
// // //               <InputField
// // //                 label="האם ההתפתחות המוטורית (תנועתית) הייתה תקינה?"
// // //                 value={formData.development.normalMotorDev}
// // //                 onChange={(v) =>
// // //                   handleNested("development", "normalMotorDev", v)
// // //                 }
// // //               />
// // //               <InputField
// // //                 label="מתי התחיל ללכת?"
// // //                 value={formData.development.walkingAge}
// // //                 onChange={(v) => handleNested("development", "walkingAge", v)}
// // //               />
// // //               <InputField
// // //                 label="האם ההתפתחות השפתית הייתה תקינה?"
// // //                 value={formData.development.normalLanguageDev}
// // //                 onChange={(v) =>
// // //                   handleNested("development", "normalLanguageDev", v)
// // //                 }
// // //               />
// // //               <InputField
// // //                 label="מתי דיבר לראשונה?"
// // //                 value={formData.development.firstWordsAge}
// // //                 onChange={(v) =>
// // //                   handleNested("development", "firstWordsAge", v)
// // //                 }
// // //               />
// // //             </div>
// // //             <div className="grid grid-cols-2 gap-4">
// // //               <InputField
// // //                 label="האם היו קשיי שינה בשנה הראשונה?"
// // //                 value={formData.development.sleepIssuesFirstYear}
// // //                 onChange={(v) =>
// // //                   handleNested("development", "sleepIssuesFirstYear", v)
// // //                 }
// // //               />
// // //               <InputField
// // //                 label="האם היו קשיי אכילה בשנה הראשונה?"
// // //                 value={formData.development.eatingIssuesFirstYear}
// // //                 onChange={(v) =>
// // //                   handleNested("development", "eatingIssuesFirstYear", v)
// // //                 }
// // //               />
// // //             </div>
// // //             <InputField
// // //               label="באיזה גיל נגמל/ה מחיתולים?"
// // //               value={formData.development.diaperGraduationAge}
// // //               onChange={(v) =>
// // //                 handleNested("development", "diaperGraduationAge", v)
// // //               }
// // //             />
// // //           </div>
// // //         );

// // //       case 8:
// // //         return (
// // //           <div className="space-y-5">
// // //             <SectionTitle>הילד/ה היום</SectionTitle>
// // //             <SubTitle>
// // //               האם יש כיום בעיות סביב אוכל / שינה / פחדי לילה / חרדות אחרות /
// // //               אחר?
// // //             </SubTitle>
// // //             <TextAreaField
// // //               label="אם כן, פרט:"
// // //               value={formData.currentProblems.foodSleepFearsDetails}
// // //               onChange={(v) =>
// // //                 handleNested("currentProblems", "foodSleepFearsDetails", v)
// // //               }
// // //             />
// // //             <SubTitle>במסגרת הבית:</SubTitle>
// // //             <div className="space-y-3">
// // //               <InputField
// // //                 label="האם הילד/ה חסר מנוחה, נמצא בפעילות יתר?"
// // //                 value={formData.currentProblems.restlessness}
// // //                 onChange={(v) =>
// // //                   handleNested("currentProblems", "restlessness", v)
// // //                 }
// // //               />
// // //               <InputField
// // //                 label="מתרגש/ת בקלות?"
// // //                 value={formData.currentProblems.excitedEasily}
// // //                 onChange={(v) =>
// // //                   handleNested("currentProblems", "excitedEasily", v)
// // //                 }
// // //               />
// // //               <InputField
// // //                 label="מפריע/ה לאחרים?"
// // //                 value={formData.currentProblems.disturbsOthers}
// // //                 onChange={(v) =>
// // //                   handleNested("currentProblems", "disturbsOthers", v)
// // //                 }
// // //               />
// // //               <InputField
// // //                 label="האם מתקשה להתמיד ולסיים משימות?"
// // //                 value={formData.currentProblems.difficultyCompletingTasks}
// // //                 onChange={(v) =>
// // //                   handleNested(
// // //                     "currentProblems",
// // //                     "difficultyCompletingTasks",
// // //                     v,
// // //                   )
// // //                 }
// // //               />
// // //               <InputField
// // //                 label="האם זקוק/ה לתשומת לב רבה במיוחד?"
// // //                 value={formData.currentProblems.needsSpecialAttention}
// // //                 onChange={(v) =>
// // //                   handleNested("currentProblems", "needsSpecialAttention", v)
// // //                 }
// // //               />
// // //               <InputField
// // //                 label="תלותי/ת / עצמאי/ת?"
// // //                 value={formData.currentProblems.dependencyVsIndependence}
// // //                 onChange={(v) =>
// // //                   handleNested("currentProblems", "dependencyVsIndependence", v)
// // //                 }
// // //               />
// // //               <InputField
// // //                 label="אחר:"
// // //                 value={formData.currentProblems.otherBehavioral}
// // //                 onChange={(v) =>
// // //                   handleNested("currentProblems", "otherBehavioral", v)
// // //                 }
// // //               />
// // //               <InputField
// // //                 label="למי קרוב יותר? לאם, לאב או אחר?"
// // //                 value={formData.currentProblems.closerToWho}
// // //                 onChange={(v) =>
// // //                   handleNested("currentProblems", "closerToWho", v)
// // //                 }
// // //               />
// // //             </div>
// // //           </div>
// // //         );

// // //       case 9:
// // //         return (
// // //           <div className="space-y-5">
// // //             <SectionTitle>תפקוד חברתי</SectionTitle>
// // //             <InputField
// // //               label="האם יש לילדך/ילדתך חברים?"
// // //               value={formData.social.hasFriends}
// // //               onChange={(v) => handleNested("social", "hasFriends", v)}
// // //             />
// // //             <InputField
// // //               label="האם הוא/היא מאד חברותי/ת או שיש לו/לה מספר חברים מועט?"
// // //               value={formData.social.socialLevel}
// // //               onChange={(v) => handleNested("social", "socialLevel", v)}
// // //             />
// // //             <InputField
// // //               label="האם יש לו/לה קשרים חברתיים קרובים ומשמעותיים?"
// // //               value={formData.social.meaningfulConnections}
// // //               onChange={(v) =>
// // //                 handleNested("social", "meaningfulConnections", v)
// // //               }
// // //             />
// // //             <InputField
// // //               label="האם יש לו/לה קשרים עם בני המין השני?"
// // //               value={formData.social.oppositeSexConnections}
// // //               onChange={(v) =>
// // //                 handleNested("social", "oppositeSexConnections", v)
// // //               }
// // //             />
// // //             <TextAreaField
// // //               label="האם יש לו/לה בעיות חברתיות? פרט:"
// // //               value={formData.social.socialProblemsDetails}
// // //               onChange={(v) =>
// // //                 handleNested("social", "socialProblemsDetails", v)
// // //               }
// // //             />
// // //           </div>
// // //         );

// // //       case 10:
// // //         return (
// // //           <div className="space-y-5">
// // //             <SectionTitle>סדר יום אופייני (מקימה עד שינה)</SectionTitle>
// // //             <table
// // //               className="w-full border-collapse border border-gray-300 text-sm"
// // //               dir="rtl"
// // //             >
// // //               <thead>
// // //                 <tr className="bg-blue-50">
// // //                   <th className="border border-gray-300 p-2 text-right w-1/4">
// // //                     שעות
// // //                   </th>
// // //                   <th className="border border-gray-300 p-2 text-right">
// // //                     פעילות
// // //                   </th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {formData.dailyRoutine.map((row, i) => (
// // //                   <tr key={i}>
// // //                     <td className="border border-gray-300 p-1">
// // //                       <input
// // //                         value={row.time}
// // //                         onChange={(e) =>
// // //                           handleDailyRoutine(i, "time", e.target.value)
// // //                         }
// // //                         className="w-full outline-none p-1 rounded"
// // //                         placeholder="שעה..."
// // //                       />
// // //                     </td>
// // //                     <td className="border border-gray-300 p-1">
// // //                       <input
// // //                         value={row.activity}
// // //                         onChange={(e) =>
// // //                           handleDailyRoutine(i, "activity", e.target.value)
// // //                         }
// // //                         className="w-full outline-none p-1 rounded"
// // //                         placeholder="פעילות..."
// // //                       />
// // //                     </td>
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //             <AddRowButton
// // //               onClick={addDailyRoutineRow}
// // //               label="+ הוסף שורת פעילות"
// // //             />
// // //             <div className="grid grid-cols-2 gap-4 mt-6">
// // //               <InputField
// // //                 label="תאריך"
// // //                 value={formData.signatureDate}
// // //                 onChange={(v) => handleChange("signatureDate", v)}
// // //               />
// // //               <InputField
// // //                 label="חתימת ההורים"
// // //                 value={formData.parentsSignature}
// // //                 onChange={(v) => handleChange("parentsSignature", v)}
// // //               />
// // //             </div>
// // //           </div>
// // //         );

// // //       default:
// // //         return null;
// // //     }
// // //   };

// // //   // const totalSteps = STEPS.length;

// // //   return (
// // //     <div
// // //       ref={formTopRef}
// // //       className="bg-white max-w-5xl mx-auto rounded-2xl shadow-lg p-8"
// // //       dir="rtl"
// // //     >
// // //       <div className="flex justify-between items-center mb-4">
// // //         <div>
// // //           <h2 className="text-2xl font-bold">טופס פנייה - שאלון להורים</h2>
// // //           <p className="text-sm text-gray-500 mt-1">תאריך: {formData.date}</p>
// // //         </div>
// // //         <button
// // //           onClick={saveDraft}
// // //           className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
// // //         >
// // //           <span>💾</span> שמור טיוטה
// // //         </button>
// // //       </div>

// // //       {saveStatus && (
// // //         <div
// // //           className={`text-sm mb-4 p-2 rounded ${saveStatus.includes("שגיאה") ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}
// // //         >
// // //           {saveStatus}
// // //         </div>
// // //       )}

// // //       {/* Progress Bar */}
// // //       <div className="mb-6">
// // //         <div className="flex justify-between text-xs text-gray-500 mb-1">
// // //           <span className="font-semibold text-blue-700">{STEPS[step - 1]}</span>
// // //           <span>
// // //             {step} / {STEPS.length}
// // //           </span>
// // //         </div>
// // //         <div className="w-full bg-gray-200 rounded-full h-2.5">
// // //           <div
// // //             className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
// // //             style={{ width: `${(step / STEPS.length) * 100}%` }}
// // //           />
// // //         </div>
// // //       </div>

// // //       {renderStep()}

// // //       {/* <div className="flex justify-between mt-10">
// // //         <button
// // //           onClick={step === 1 ? onCancel : () => setStep(step - 1)}
// // //           className="text-gray-500 hover:text-gray-800 transition px-4 py-2 rounded border border-gray-300 hover:border-gray-500"
// // //         >
// // //           {step === 1 ? "ביטול" : "→ הקודם"}
// // //         </button>

// // //         {step < STEPS.length ? (
// // //           <button
// // //             onClick={() => {
// // //               setStep(step + 1);
// // //               saveDraft(); // טיפ: לשמור דראפט אוטומטי בכל מעבר שלב!
// // //             }}
// // //             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
// // //           >
// // //             המשך ←
// // //           </button>
// // //         ) : (
// // //           <button
// // //             onClick={handleFinalSubmit}
// // //             className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
// // //           >
// // //             ✓ שלח שאלון סופי
// // //           </button>
// // //         )}
// // //       </div> */}
// // //       {/* <div className="flex justify-between mt-10">
// // //         <button
// // //           onClick={() => {
// // //             if (step === 1) {
// // //               onCancel();
// // //             } else {
// // //               setStep(step - 1);
// // //               window.scrollTo({ top: 0, behavior: "smooth" }); // קפיצה לראש העמוד בחזרה אחורה
// // //             }
// // //           }}
// // //           className="text-gray-500 hover:text-gray-800 transition px-4 py-2 rounded border border-gray-300 hover:border-gray-500"
// // //         >
// // //           {step === 1 ? "ביטול" : "→ הקודם"}
// // //         </button>

// // //         {step < STEPS.length ? (
// // //           <button
// // //             onClick={() => {
// // //               setStep(step + 1);
// // //               saveDraft();
// // //               window.scrollTo({ top: 0, behavior: "smooth" }); // קפיצה לראש העמוד במעבר לשלב הבא
// // //             }}
// // //             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
// // //           >
// // //             המשך ←
// // //           </button>
// // //         ) : (
// // //           <button
// // //             onClick={handleFinalSubmit}
// // //             className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
// // //           >
// // //             ✓ שלח שאלון סופי
// // //           </button>
// // //         )}
// // //       </div> */}

// // //       <div className="flex justify-between mt-10">
// // //         <button
// // //           onClick={() => {
// // //             if (step === 1) {
// // //               onCancel();
// // //             } else {
// // //               setStep(step - 1);
// // //               scrollToTop(); // שימוש בפונקציה החדשה
// // //             }
// // //           }}
// // //           className="text-gray-500 hover:text-gray-800 transition px-4 py-2 rounded border border-gray-300 hover:border-gray-500"
// // //         >
// // //           {step === 1 ? "ביטול" : "→ הקודם"}
// // //         </button>

// // //         {step < STEPS.length ? (
// // //           <button
// // //             onClick={() => {
// // //               setStep(step + 1);
// // //               saveDraft();
// // //               scrollToTop(); // שימוש בפונקציה החדשה
// // //             }}
// // //             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
// // //           >
// // //             המשך ←
// // //           </button>
// // //         ) : (
// // //           <button
// // //             onClick={handleFinalSubmit}
// // //             className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
// // //           >
// // //             ✓ שלח שאלון סופי
// // //           </button>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default ParentQuestionnaire;

import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import childService from "../services/child.service";

const API_URL = import.meta.env.VITE_API_URL;

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  className = "",
  wide = false,
}) => (
  <div
    className={`flex flex-col gap-1 ${wide ? "col-span-2" : ""} ${className}`}
  >
    <label className="text-sm font-bold text-gray-700">{label}</label>
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, rows = 3 }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-bold text-gray-700">{label}</label>
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

const SubTitle = ({ children }) => (
  <h4 className="text-base font-bold text-blue-700 underline mt-4 mb-2">
    {children}
  </h4>
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

const STEPS = [
  "פרטים אישיים",
  "סיבת הפנייה",
  "מהלך הלימודים",
  "הערכת תפקוד",
  "פרטים על המשפחה",
  "בריאות",
  "רקע התפתחותי",
  "הילד/ה היום",
  "תפקוד חברתי",
  "סדר יום וחתימה",
];

const ParentQuestionnaire = ({ childId = "default", onSave, onCancel }) => {
  const formTopRef = React.useRef(null);

  const [step, setStep] = useState(1);
  const [saveStatus, setSaveStatus] = useState("");
  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString("he-IL"),

    // Step 1
    childFirstName: "",
    childLastName: "",
    gender: "",
    idNumber: "",
    birthDate: "",
    birthCountry: "",
    aliyaDate: "",
    fatherName: "",
    motherName: "",
    familyStatus: "",
    familyNotes: "",
    address: "",
    phone: "",
    schoolOrGarden: "",
    grade: "",
    homeLanguage: "",

    // Step 2
    difficultyDescription: "",
    referralGoals: "",
    onsetTime: "",
    hadAssessment: "",
    assessmentType: "",
    assessmentDate: "",
    assessmentRecommendations: "",
    paraMedicalTreatments: "",
    expressedDistress: "",
    willingToConsult: "",

    // Step 3
    firstFrameworkAge: "",
    firstFrameworkType: "",
    prePreSchoolReports: "",
    preSchoolReports: "",
    schoolHistory: [
      { grade: "", school: "", city: "" },
      { grade: "", school: "", city: "" },
      { grade: "", school: "", city: "" },
    ],
    stayedGrade: "",
    stayedGradeWhich: "",
    stayedGradeReason: "",

    // Step 4
    functioning: { studies: "", family: "", social: "", notes: "" },

    // Step 5
    familyStructure: {
      motherNameInTable: "", // שדה חדש לשם האם בטבלה
      motherAge: "",
      motherJob: "",
      motherNotes: "",
      fatherNameInTable: "", // שדה חדש לשם האב בטבלה
      fatherAge: "",
      fatherJob: "",
      fatherNotes: "",
      siblings: [
        { name: "", age: "", framework: "", notes: "" },
        { name: "", age: "", framework: "", notes: "" },
        { name: "", age: "", framework: "", notes: "" },
      ],
    },

    // Step 6
    generalHealth: "",
    visionDate: "",
    visionFindings: "",
    hearingDate: "",
    hearingFindings: "",
    pastDiseases: "",
    hospitalization: "",
    hospitalizationAge: "",
    hospitalizationDuration: "",
    hospitalizationReason: "",
    regularMedications: "",

    // Step 7
    development: {
      plannedPregnancy: "",
      normalPregnancy: "",
      pregnancyDetails: "",
      normalBirth: "",
      birthDetails: "",
      birthWeight: "",
      problemsAfterBirthChild: "",
      problemsAfterBirthMother: "",
      normalMotorDev: "",
      walkingAge: "",
      normalLanguageDev: "",
      firstWordsAge: "",
      sleepIssuesFirstYear: "",
      eatingIssuesFirstYear: "",
      diaperGraduationAge: "",
    },

    // Step 8
    currentProblems: {
      foodSleepFears: "",
      foodSleepFearsDetails: "",
      restlessness: "",
      excitedEasily: "",
      disturbsOthers: "",
      difficultyCompletingTasks: "",
      needsSpecialAttention: "",
      dependencyVsIndependence: "",
      otherBehavioral: "",
      closerToWho: "",
    },

    // Step 9
    social: {
      hasFriends: "",
      socialLevel: "",
      meaningfulConnections: "",
      oppositeSexConnections: "",
      socialProblemsDetails: "",
    },

    // Step 10
    dailyRoutine: [
      { time: "", activity: "" },
      { time: "", activity: "" },
      { time: "", activity: "" },
    ],
    parentsSignature: "",
    signatureDate: "",
  });

  const scrollToTop = () => {
    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const loadDraft = async () => {
      if (!childId || childId === "default") return;

      try {
        setSaveStatus("טוען טיוטה...");
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();

        const response = await fetch(
          `${API_URL}/questionnaires/draft/${childId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setFormData(data.formData);
          if (data.step) setStep(data.step);
          setSaveStatus("טיוטה נטענה");
        }
      } catch (error) {
        console.error("Load draft error:", error);
      } finally {
        setTimeout(() => setSaveStatus(""), 2000);
      }
    };

    loadDraft();
  }, [childId]);

  const saveDraft = async () => {
    if (!childId) return;

    try {
      setSaveStatus("שומר טיוטה...");
      const auth = getAuth();
      const user = auth.currentUser;
      const token = await user.getIdToken();
      const response = await fetch(`${API_URL}/questionnaires/draft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          childId: childId,
          formData: formData,
        }),
      });

      if (response.ok) {
        setSaveStatus("טיוטה נשמרה ב-" + new Date().toLocaleTimeString());
        setTimeout(() => setSaveStatus(""), 3000);
      } else {
        throw new Error("Failed to save draft");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      setSaveStatus("שגיאה בשמירת הטיוטה");
    }
  };

  const handleFinalSubmit = async () => {
    try {
      setSaveStatus("שולח שאלון סופי ונעל עריכה...");

      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();

      // קריאה לפונקציה המאוחדת בסרביס
      // הפונקציה הזו בבאקנד תדאג גם לשמור את השאלון וגם לעדכן את הסטטוס ל"נשלח"
      await childService.submitParentQuestionnaire(childId, formData, token);

      setSaveStatus("השאלון נשלח בהצלחה!");

      // המתנה קצרה כדי שהמשתמש יראה את הודעת ההצלחה
      setTimeout(() => {
        onSave(formData); // סגירת השאלון וחזרה לפרטי הילד
      }, 1500);
    } catch (error) {
      console.error("Submit error:", error);
      setSaveStatus("שגיאה בשליחת השאלון, נא לנסות שוב");
    }
  };
  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleNested = (section, field, value) =>
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));

  const handleSchoolHistory = (index, field, value) => {
    const updated = [...formData.schoolHistory];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, schoolHistory: updated }));
  };

  const addSchoolHistoryRow = () =>
    setFormData((prev) => ({
      ...prev,
      schoolHistory: [
        ...prev.schoolHistory,
        { grade: "", school: "", city: "" },
      ],
    }));

  const handleSibling = (index, field, value) => {
    const updated = [...formData.familyStructure.siblings];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      familyStructure: { ...prev.familyStructure, siblings: updated },
    }));
  };

  const addSiblingRow = () =>
    setFormData((prev) => ({
      ...prev,
      familyStructure: {
        ...prev.familyStructure,
        siblings: [
          ...prev.familyStructure.siblings,
          { name: "", age: "", framework: "", notes: "" },
        ],
      },
    }));

  const handleDailyRoutine = (index, field, value) => {
    const updated = [...formData.dailyRoutine];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, dailyRoutine: updated }));
  };

  const addDailyRoutineRow = () =>
    setFormData((prev) => ({
      ...prev,
      dailyRoutine: [...prev.dailyRoutine, { time: "", activity: "" }],
    }));

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-5">
            <SectionTitle>פרטים אישיים</SectionTitle>
            <div className="grid grid-cols-3 gap-4">
              <InputField
                label="שם פרטי של הילד/ה"
                value={formData.childFirstName}
                onChange={(v) => handleChange("childFirstName", v)}
              />
              <InputField
                label="שם משפחה"
                value={formData.childLastName}
                onChange={(v) => handleChange("childLastName", v)}
              />
              <InputField
                label="מין"
                value={formData.gender}
                onChange={(v) => handleChange("gender", v)}
              />
              <InputField
                label="ת.ז"
                value={formData.idNumber}
                onChange={(v) => handleChange("idNumber", v)}
              />
              <InputField
                label="תאריך לידה"
                type="date"
                value={formData.birthDate}
                onChange={(v) => handleChange("birthDate", v)}
              />
              <InputField
                label="ארץ לידה"
                value={formData.birthCountry}
                onChange={(v) => handleChange("birthCountry", v)}
              />
              <InputField
                label="תאריך עלייה"
                value={formData.aliyaDate}
                onChange={(v) => handleChange("aliyaDate", v)}
              />
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
                label="מצב משפחתי (הורים)"
                value={formData.familyStatus}
                onChange={(v) => handleChange("familyStatus", v)}
              />
            </div>
            <TextAreaField
              label="הערות למצב המשפחתי"
              value={formData.familyNotes}
              onChange={(v) => handleChange("familyNotes", v)}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="כתובת"
                value={formData.address}
                onChange={(v) => handleChange("address", v)}
              />
              <InputField
                label="מספר טלפון"
                value={formData.phone}
                onChange={(v) => handleChange("phone", v)}
              />
              <InputField
                label="בית ספר/גן"
                value={formData.schoolOrGarden}
                onChange={(v) => handleChange("schoolOrGarden", v)}
              />
              <InputField
                label="כיתה"
                value={formData.grade}
                onChange={(v) => handleChange("grade", v)}
              />
              <InputField
                label="שפה מדוברת בבית"
                value={formData.homeLanguage}
                onChange={(v) => handleChange("homeLanguage", v)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <SectionTitle>סיבת הפנייה</SectionTitle>
            <TextAreaField
              label="תיאור הקושי"
              value={formData.difficultyDescription}
              onChange={(v) => handleChange("difficultyDescription", v)}
              rows={4}
            />
            <TextAreaField
              label="מטרות הפנייה"
              value={formData.referralGoals}
              onChange={(v) => handleChange("referralGoals", v)}
              rows={4}
            />
            <InputField
              label="מתי התחילו הקשיים?"
              value={formData.onsetTime}
              onChange={(v) => handleChange("onsetTime", v)}
            />
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
              <p className="font-bold text-gray-700 text-sm">
                האם הילד/ה עבר אבחון פסיכולוגי, או אחר (כגון: נוירולוגי / ר.
                בעיסוק / ק. תקשורת)?
              </p>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="איזה אבחון/ים"
                  value={formData.assessmentType}
                  onChange={(v) => handleChange("assessmentType", v)}
                />
                <InputField
                  label="תאריך"
                  value={formData.assessmentDate}
                  onChange={(v) => handleChange("assessmentDate", v)}
                />
              </div>
              <TextAreaField
                label="מה היו המלצות האבחון/ים?"
                value={formData.assessmentRecommendations}
                onChange={(v) => handleChange("assessmentRecommendations", v)}
              />
            </div>
            <TextAreaField
              label="האם הילד/ה היה/הייתה בטיפול פרא רפואי כגון ריפוי בעיסוק, קלינאית תקשורת, פיזיותרפיה או אחר?"
              value={formData.paraMedicalTreatments}
              onChange={(v) => handleChange("paraMedicalTreatments", v)}
            />
            <InputField
              label="האם הילד/ה דיבר/ה על מצוקת חששות, חרדות, פחדים?"
              value={formData.expressedDistress}
              onChange={(v) => handleChange("expressedDistress", v)}
            />
            <InputField
              label="האם הילד הביע רצון או נכונות להתייעץ עם איש מקצוע?"
              value={formData.willingToConsult}
              onChange={(v) => handleChange("willingToConsult", v)}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <SectionTitle>מהלך הלימודים</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label='באיזה גיל יצא/ה לראשונה למסגרת לימודית (מעון/גן/בי"ס)?'
                value={formData.firstFrameworkAge}
                onChange={(v) => handleChange("firstFrameworkAge", v)}
              />
              <InputField
                label="לאיזו מסגרת?"
                value={formData.firstFrameworkType}
                onChange={(v) => handleChange("firstFrameworkType", v)}
              />
            </div>
            <TextAreaField
              label="האם הילד/ה ביקר/ה בגן טרום חובה? אם כן מה היו הדיווחים על תפקודו/ה שם?"
              value={formData.prePreSchoolReports}
              onChange={(v) => handleChange("prePreSchoolReports", v)}
            />
            <TextAreaField
              label="מה היו הדיווחים על התפקוד בגן-חובה? אם נשאר/ה שנה נוספת בגן חובה - מה הייתה הסיבה לכך?"
              value={formData.preSchoolReports}
              onChange={(v) => handleChange("preSchoolReports", v)}
            />
            <div>
              <p className="text-sm font-bold text-gray-700 mb-2">
                מהלך הלימודים בביה"ס:
              </p>
              <table
                className="w-full border-collapse border border-gray-300 text-sm"
                dir="rtl"
              >
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 p-2 text-right">
                      כיתות
                    </th>
                    <th className="border border-gray-300 p-2 text-right">
                      בית ספר
                    </th>
                    <th className="border border-gray-300 p-2 text-right">
                      יישוב
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
                      <td className="border border-gray-300 p-1">
                        <input
                          value={row.city}
                          onChange={(e) =>
                            handleSchoolHistory(i, "city", e.target.value)
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="האם נשאר/ה כיתה?"
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
              label="מדוע?"
              value={formData.stayedGradeReason}
              onChange={(v) => handleChange("stayedGradeReason", v)}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <SectionTitle>הערכת תפקוד</SectionTitle>
            <p className="text-sm font-bold text-gray-700">
              באופן כללי, להערכתכם, איך אתם מתארים את התפקוד של הילד/ה?
            </p>
            <table
              className="w-full border-collapse border border-gray-300 text-sm"
              dir="rtl"
            >
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 p-2 text-right w-1/4">
                    תחומי התפקוד
                  </th>
                  <th className="border border-gray-300 p-2 text-center">
                    מצוין
                  </th>
                  <th className="border border-gray-300 p-2 text-center">
                    טוב
                  </th>
                  <th className="border border-gray-300 p-2 text-center">
                    מתקשה
                  </th>
                  <th className="border border-gray-300 p-2 text-center">
                    מתקשה מאד
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { key: "studies", label: "בלימודים" },
                  { key: "family", label: "במשפחה" },
                  { key: "social", label: "בחברה" },
                ].map(({ key, label }) => (
                  <tr key={key}>
                    <td className="border border-gray-300 p-2 font-bold">
                      {label}
                    </td>
                    {["מצוין", "טוב", "מתקשה", "מתקשה מאד"].map((opt) => (
                      <td
                        key={opt}
                        className="border border-gray-300 p-2 text-center"
                      >
                        <input
                          type="radio"
                          name={`functioning_${key}`}
                          value={opt}
                          checked={formData.functioning[key] === opt}
                          onChange={() => handleNested("functioning", key, opt)}
                          className="w-4 h-4"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <TextAreaField
              label="הערות"
              value={formData.functioning.notes}
              onChange={(v) => handleNested("functioning", "notes", v)}
              rows={4}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-5">
            <SectionTitle>פרטים על המשפחה</SectionTitle>
            <table
              className="w-full border-collapse border border-gray-300 text-sm"
              dir="rtl"
            >
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 p-2 text-right"></th>
                  <th className="border border-gray-300 p-2 text-right">שם</th>
                  <th className="border border-gray-300 p-2 text-right">גיל</th>
                  <th className="border border-gray-300 p-2 text-right">
                    עיסוק
                  </th>
                  <th className="border border-gray-300 p-2 text-right">
                    הערות
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 font-bold">אם:</td>
                  <td className="border border-gray-300 p-1">
                    <input
                      value={formData.familyStructure.motherNameInTable}
                      onChange={(e) =>
                        handleNested(
                          "familyStructure",
                          "motherNameInTable",
                          e.target.value,
                        )
                      }
                      className="w-full outline-none p-1 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      value={formData.familyStructure.motherAge}
                      onChange={(e) =>
                        handleNested(
                          "familyStructure",
                          "motherAge",
                          e.target.value,
                        )
                      }
                      className="w-full outline-none p-1 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      value={formData.familyStructure.motherJob}
                      onChange={(e) =>
                        handleNested(
                          "familyStructure",
                          "motherJob",
                          e.target.value,
                        )
                      }
                      className="w-full outline-none p-1 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      value={formData.familyStructure.motherNotes}
                      onChange={(e) =>
                        handleNested(
                          "familyStructure",
                          "motherNotes",
                          e.target.value,
                        )
                      }
                      className="w-full outline-none p-1 rounded"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-bold">אב:</td>
                  <td className="border border-gray-300 p-1">
                    <input
                      value={formData.familyStructure.fatherNameInTable}
                      onChange={(e) =>
                        handleNested(
                          "familyStructure",
                          "fatherNameInTable",
                          e.target.value,
                        )
                      }
                      className="w-full outline-none p-1 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      value={formData.familyStructure.fatherAge}
                      onChange={(e) =>
                        handleNested(
                          "familyStructure",
                          "fatherAge",
                          e.target.value,
                        )
                      }
                      className="w-full outline-none p-1 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      value={formData.familyStructure.fatherJob}
                      onChange={(e) =>
                        handleNested(
                          "familyStructure",
                          "fatherJob",
                          e.target.value,
                        )
                      }
                      className="w-full outline-none p-1 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      value={formData.familyStructure.fatherNotes}
                      onChange={(e) =>
                        handleNested(
                          "familyStructure",
                          "fatherNotes",
                          e.target.value,
                        )
                      }
                      className="w-full outline-none p-1 rounded"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="text-sm font-bold text-gray-700 mt-4">אחים:</p>
            <table
              className="w-full border-collapse border border-gray-300 text-sm"
              dir="rtl"
            >
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 p-2 text-right w-8">
                    #
                  </th>
                  <th className="border border-gray-300 p-2 text-right">שם</th>
                  <th className="border border-gray-300 p-2 text-right">גיל</th>
                  <th className="border border-gray-300 p-2 text-right">
                    מסגרת
                  </th>
                  <th className="border border-gray-300 p-2 text-right">
                    הערות
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.familyStructure.siblings.map((sib, i) => (
                  <tr key={i}>
                    <td className="border border-gray-300 p-2 text-center font-bold">
                      {i + 1}.
                    </td>
                    <td className="border border-gray-300 p-1">
                      <input
                        value={sib.name}
                        onChange={(e) =>
                          handleSibling(i, "name", e.target.value)
                        }
                        className="w-full outline-none p-1 rounded"
                      />
                    </td>
                    <td className="border border-gray-300 p-1">
                      <input
                        value={sib.age}
                        onChange={(e) =>
                          handleSibling(i, "age", e.target.value)
                        }
                        className="w-full outline-none p-1 rounded"
                      />
                    </td>
                    <td className="border border-gray-300 p-1">
                      <input
                        value={sib.framework}
                        onChange={(e) =>
                          handleSibling(i, "framework", e.target.value)
                        }
                        className="w-full outline-none p-1 rounded"
                      />
                    </td>
                    <td className="border border-gray-300 p-1">
                      <input
                        value={sib.notes}
                        onChange={(e) =>
                          handleSibling(i, "notes", e.target.value)
                        }
                        className="w-full outline-none p-1 rounded"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <AddRowButton onClick={addSiblingRow} label="+ הוסף אח/אחות" />
          </div>
        );

      case 6:
        return (
          <div className="space-y-5">
            <SectionTitle>בריאות</SectionTitle>
            <InputField
              label="מה מצב בריאותו/ה הכללי של הילד/ה?"
              value={formData.generalHealth}
              onChange={(v) => handleChange("generalHealth", v)}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="בדיקת ראייה - תאריך"
                value={formData.visionDate}
                onChange={(v) => handleChange("visionDate", v)}
              />
              <InputField
                label="ממצאים"
                value={formData.visionFindings}
                onChange={(v) => handleChange("visionFindings", v)}
              />
              <InputField
                label="בדיקת שמיעה - תאריך"
                value={formData.hearingDate}
                onChange={(v) => handleChange("hearingDate", v)}
              />
              <InputField
                label="ממצאים"
                value={formData.hearingFindings}
                onChange={(v) => handleChange("hearingFindings", v)}
              />
            </div>
            <TextAreaField
              label="האם הילד/ה סובל או סבל בעבר ממחלה?"
              value={formData.pastDiseases}
              onChange={(v) => handleChange("pastDiseases", v)}
            />
            <div className="grid grid-cols-3 gap-4">
              <InputField
                label="אשפוז?"
                value={formData.hospitalization}
                onChange={(v) => handleChange("hospitalization", v)}
              />
              <InputField
                label="באיזה גיל?"
                value={formData.hospitalizationAge}
                onChange={(v) => handleChange("hospitalizationAge", v)}
              />
              <InputField
                label="לכמה זמן?"
                value={formData.hospitalizationDuration}
                onChange={(v) => handleChange("hospitalizationDuration", v)}
              />
            </div>
            <TextAreaField
              label="מאיזו סיבה?"
              value={formData.hospitalizationReason}
              onChange={(v) => handleChange("hospitalizationReason", v)}
            />
            <InputField
              label="האם נוטל תרופות באופן קבוע?"
              value={formData.regularMedications}
              onChange={(v) => handleChange("regularMedications", v)}
            />
          </div>
        );

      case 7:
        return (
          <div className="space-y-5">
            <SectionTitle>רקע התפתחותי</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="האם ההיריון היה/הייתה מתוכנן? (כן / לא)"
                value={formData.development.plannedPregnancy}
                onChange={(v) =>
                  handleNested("development", "plannedPregnancy", v)
                }
              />
              <InputField
                label="האם ההיריון היה תקין? (כן / לא)"
                value={formData.development.normalPregnancy}
                onChange={(v) =>
                  handleNested("development", "normalPregnancy", v)
                }
              />
            </div>
            <InputField
              label="פרט על ההיריון"
              value={formData.development.pregnancyDetails}
              onChange={(v) =>
                handleNested("development", "pregnancyDetails", v)
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="האם הלידה הייתה תקינה? (כן / לא)"
                value={formData.development.normalBirth}
                onChange={(v) => handleNested("development", "normalBirth", v)}
              />
              <InputField
                label="משקל הלידה"
                value={formData.development.birthWeight}
                onChange={(v) => handleNested("development", "birthWeight", v)}
              />
            </div>
            <InputField
              label="פרט על הלידה"
              value={formData.development.birthDetails}
              onChange={(v) => handleNested("development", "birthDetails", v)}
            />
            <InputField
              label="האם הופיעו בעיות רפואיות לאחר הלידה?"
              value={formData.development.problemsAfterBirthChild}
              onChange={(v) =>
                handleNested("development", "problemsAfterBirthChild", v)
              }
            />
            <InputField
              label="האם האם סבלה מבעיות רפואיות לאחר הלידה?"
              value={formData.development.problemsAfterBirthMother}
              onChange={(v) =>
                handleNested("development", "problemsAfterBirthMother", v)
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="האם ההתפתחות המוטורית (תנועתית) הייתה תקינה?"
                value={formData.development.normalMotorDev}
                onChange={(v) =>
                  handleNested("development", "normalMotorDev", v)
                }
              />
              <InputField
                label="מתי התחיל ללכת?"
                value={formData.development.walkingAge}
                onChange={(v) => handleNested("development", "walkingAge", v)}
              />
              <InputField
                label="האם ההתפתחות השפתית הייתה תקינה?"
                value={formData.development.normalLanguageDev}
                onChange={(v) =>
                  handleNested("development", "normalLanguageDev", v)
                }
              />
              <InputField
                label="מתי דיבר לראשונה?"
                value={formData.development.firstWordsAge}
                onChange={(v) =>
                  handleNested("development", "firstWordsAge", v)
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="האם היו קשיי שינה בשנה הראשונה?"
                value={formData.development.sleepIssuesFirstYear}
                onChange={(v) =>
                  handleNested("development", "sleepIssuesFirstYear", v)
                }
              />
              <InputField
                label="האם היו קשיי אכילה בשנה הראשונה?"
                value={formData.development.eatingIssuesFirstYear}
                onChange={(v) =>
                  handleNested("development", "eatingIssuesFirstYear", v)
                }
              />
            </div>
            <InputField
              label="באיזה גיל נגמל/ה מחיתולים?"
              value={formData.development.diaperGraduationAge}
              onChange={(v) =>
                handleNested("development", "diaperGraduationAge", v)
              }
            />
          </div>
        );

      case 8:
        return (
          <div className="space-y-5">
            <SectionTitle>הילד/ה היום</SectionTitle>
            <SubTitle>
              האם יש כיום בעיות סביב אוכל / שינה / פחדי לילה / חרדות אחרות /
              אחר?
            </SubTitle>
            <TextAreaField
              label="אם כן, פרט:"
              value={formData.currentProblems.foodSleepFearsDetails}
              onChange={(v) =>
                handleNested("currentProblems", "foodSleepFearsDetails", v)
              }
            />
            <SubTitle>במסגרת הבית:</SubTitle>
            <div className="space-y-3">
              <InputField
                label="האם הילד/ה חסר מנוחה, נמצא בפעילות יתר?"
                value={formData.currentProblems.restlessness}
                onChange={(v) =>
                  handleNested("currentProblems", "restlessness", v)
                }
              />
              <InputField
                label="מתרגש/ת בקלות?"
                value={formData.currentProblems.excitedEasily}
                onChange={(v) =>
                  handleNested("currentProblems", "excitedEasily", v)
                }
              />
              <InputField
                label="מפריע/ה לאחרים?"
                value={formData.currentProblems.disturbsOthers}
                onChange={(v) =>
                  handleNested("currentProblems", "disturbsOthers", v)
                }
              />
              <InputField
                label="האם מתקשה להתמיד ולסיים משימות?"
                value={formData.currentProblems.difficultyCompletingTasks}
                onChange={(v) =>
                  handleNested(
                    "currentProblems",
                    "difficultyCompletingTasks",
                    v,
                  )
                }
              />
              <InputField
                label="האם זקוק/ה לתשומת לב רבה במיוחד?"
                value={formData.currentProblems.needsSpecialAttention}
                onChange={(v) =>
                  handleNested("currentProblems", "needsSpecialAttention", v)
                }
              />
              <InputField
                label="תלותי/ת / עצמאי/ת?"
                value={formData.currentProblems.dependencyVsIndependence}
                onChange={(v) =>
                  handleNested("currentProblems", "dependencyVsIndependence", v)
                }
              />
              <InputField
                label="אחר:"
                value={formData.currentProblems.otherBehavioral}
                onChange={(v) =>
                  handleNested("currentProblems", "otherBehavioral", v)
                }
              />
              <InputField
                label="למי קרוב יותר? לאם, לאב או אחר?"
                value={formData.currentProblems.closerToWho}
                onChange={(v) =>
                  handleNested("currentProblems", "closerToWho", v)
                }
              />
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-5">
            <SectionTitle>תפקוד חברתי</SectionTitle>
            <InputField
              label="האם יש לילדך/ילדתך חברים?"
              value={formData.social.hasFriends}
              onChange={(v) => handleNested("social", "hasFriends", v)}
            />
            <InputField
              label="האם הוא/היא מאד חברותי/ת או שיש לו/לה מספר חברים מועט?"
              value={formData.social.socialLevel}
              onChange={(v) => handleNested("social", "socialLevel", v)}
            />
            <InputField
              label="האם יש לו/לה קשרים חברתיים קרובים ומשמעותיים?"
              value={formData.social.meaningfulConnections}
              onChange={(v) =>
                handleNested("social", "meaningfulConnections", v)
              }
            />
            <InputField
              label="האם יש לו/לה קשרים עם בני המין השני?"
              value={formData.social.oppositeSexConnections}
              onChange={(v) =>
                handleNested("social", "oppositeSexConnections", v)
              }
            />
            <TextAreaField
              label="האם יש לו/לה בעיות חברתיות? פרט:"
              value={formData.social.socialProblemsDetails}
              onChange={(v) =>
                handleNested("social", "socialProblemsDetails", v)
              }
            />
          </div>
        );

      case 10:
        return (
          <div className="space-y-5">
            <SectionTitle>סדר יום אופייני (מקימה עד שינה)</SectionTitle>
            <table
              className="w-full border-collapse border border-gray-300 text-sm"
              dir="rtl"
            >
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 p-2 text-right w-1/4">
                    שעות
                  </th>
                  <th className="border border-gray-300 p-2 text-right">
                    פעילות
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.dailyRoutine.map((row, i) => (
                  <tr key={i}>
                    <td className="border border-gray-300 p-1">
                      <input
                        value={row.time}
                        onChange={(e) =>
                          handleDailyRoutine(i, "time", e.target.value)
                        }
                        className="w-full outline-none p-1 rounded"
                        placeholder="שעה..."
                      />
                    </td>
                    <td className="border border-gray-300 p-1">
                      <input
                        value={row.activity}
                        onChange={(e) =>
                          handleDailyRoutine(i, "activity", e.target.value)
                        }
                        className="w-full outline-none p-1 rounded"
                        placeholder="פעילות..."
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <AddRowButton
              onClick={addDailyRoutineRow}
              label="+ הוסף שורת פעילות"
            />
            <div className="grid grid-cols-2 gap-4 mt-6">
              <InputField
                label="תאריך"
                value={formData.signatureDate}
                onChange={(v) => handleChange("signatureDate", v)}
              />
              <InputField
                label="חתימת ההורים"
                value={formData.parentsSignature}
                onChange={(v) => handleChange("parentsSignature", v)}
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
      ref={formTopRef}
      className="bg-white max-w-5xl mx-auto rounded-2xl shadow-lg p-8"
      dir="rtl"
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">טופס פנייה - שאלון להורים</h2>
          <p className="text-sm text-gray-500 mt-1">תאריך: {formData.date}</p>
        </div>
        <button
          onClick={saveDraft}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
        >
          <span>💾</span> שמור טיוטה
        </button>
      </div>

      {saveStatus && (
        <div
          className={`text-sm mb-4 p-2 rounded ${
            saveStatus.includes("שגיאה")
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {saveStatus}
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span className="font-semibold text-blue-700">{STEPS[step - 1]}</span>
          <span>
            {step} / {STEPS.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(step / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {renderStep()}

      <div className="flex justify-between mt-10">
        <button
          onClick={() => {
            if (step === 1) {
              onCancel();
            } else {
              setStep(step - 1);
              scrollToTop();
            }
          }}
          className="text-gray-500 hover:text-gray-800 transition px-4 py-2 rounded border border-gray-300 hover:border-gray-500"
        >
          {step === 1 ? "ביטול" : "→ הקודם"}
        </button>

        {step < STEPS.length ? (
          <button
            onClick={() => {
              setStep(step + 1);
              saveDraft();
              scrollToTop();
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            המשך ←
          </button>
        ) : (
          <button
            onClick={handleFinalSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            ✓ שלח שאלון סופי
          </button>
        )}
      </div>
    </div>
  );
};

export default ParentQuestionnaire;
