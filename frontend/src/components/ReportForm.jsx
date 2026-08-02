// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import reportService from "../services/report.service";
// import { REPORT_STRUCTURE } from "../config/reportStructure";
// import AiRephraseField from "./AiRephraseField";

// // ======================== Sub-components ========================

// const SectionTitle = ({ children }) => (
//   <h3 className="text-xl font-bold text-blue-800 underline mt-6 mb-3">
//     {children}
//   </h3>
// );

// const SubSectionTitle = ({ children }) => (
//   <h4 className="text-base font-bold text-blue-700 underline mt-4 mb-2">
//     {children}
//   </h4>
// );

// const InputField = ({ label, value, onChange, type = "text" }) => (
//   <div className="flex flex-col gap-1">
//     <label className="text-sm font-bold text-gray-700">{label}</label>
//     <input
//       type={type}
//       value={value || ""}
//       onChange={(e) => onChange(e.target.value)}
//       className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//     />
//   </div>
// );

// const TextAreaField = ({ label, value, onChange, rows = 5 }) => (
//   <div className="flex flex-col gap-1">
//     <label className="text-sm font-bold text-gray-700">{label}</label>
//     <textarea
//       rows={rows}
//       value={value || ""}
//       onChange={(e) => onChange(e.target.value)}
//       className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y"
//     />
//   </div>
// );

// const ListField = ({ items, onChange }) => {
//   const handleChange = (index, value) => {
//     const updated = [...items];
//     updated[index] = value;
//     onChange(updated);
//   };

//   const addItem = () => onChange([...items, ""]);

//   const removeItem = (index) => {
//     const updated = items.filter((_, i) => i !== index);
//     onChange(updated);
//   };

//   return (
//     <div className="flex flex-col gap-2">
//       {items.map((item, index) => (
//         <div key={index} className="flex gap-2 items-center">
//           <span className="text-gray-400 text-sm">{index + 1}.</span>
//           <input
//             type="text"
//             value={item}
//             onChange={(e) => handleChange(index, e.target.value)}
//             className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//           />
//           <button
//             type="button"
//             onClick={() => removeItem(index)}
//             className="text-red-400 hover:text-red-600 text-lg px-2"
//             title="הסר"
//           >
//             ✕
//           </button>
//         </div>
//       ))}
//       <button
//         type="button"
//         onClick={addItem}
//         className="mt-1 text-sm text-blue-600 border border-blue-300 rounded-lg px-3 py-1 hover:bg-blue-50 transition self-start"
//       >
//         + הוסף פריט
//       </button>
//     </div>
//   );
// };

// const ScoresTable = ({ section, data, onChange }) => {
//   const columns = section.columns || [];
//   const rows = section.rows || [];

//   const handleCellChange = (rowId, colId, value) => {
//     const updated = { ...data };
//     if (!updated[rowId]) updated[rowId] = {};
//     updated[rowId][colId] = value;
//     onChange(updated);
//   };

//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full border-collapse text-sm">
//         <thead>
//           <tr className="bg-blue-50">
//             <th className="border border-gray-300 p-2 text-right font-bold text-blue-800 min-w-[200px]">
//               מבחן
//             </th>
//             {columns.map((col) => (
//               <th
//                 key={col.id}
//                 className="border border-gray-300 p-2 text-center font-bold text-blue-800 min-w-[100px]"
//               >
//                 {col.label}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map((row) => (
//             <tr key={row.id} className="hover:bg-gray-50">
//               <td className="border border-gray-300 p-2 font-medium text-gray-700">
//                 {row.label}
//               </td>
//               {columns.map((col) => (
//                 <td key={col.id} className="border border-gray-300 p-1">
//                   <input
//                     type="text"
//                     value={data?.[row.id]?.[col.id] || ""}
//                     onChange={(e) =>
//                       handleCellChange(row.id, col.id, e.target.value)
//                     }
//                     className="w-full p-1 text-center outline-none focus:bg-blue-50 rounded"
//                   />
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// // ======================== Section Renderer ========================

// const SectionRenderer = ({
//   section,
//   data,
//   onChange,
//   diagnosisId,
//   isCompleted,
// }) => {
//   switch (section.type) {
//     case "infoTable":
//       return (
//         <div className="grid grid-cols-2 gap-4">
//           {section.fields.map((field) => (
//             <InputField
//               key={field.id}
//               label={field.label}
//               type={field.type || "text"}
//               value={data?.[field.id] || ""}
//               onChange={(val) => {
//                 const updated = { ...data, [field.id]: val };
//                 onChange(updated);
//               }}
//             />
//           ))}
//         </div>
//       );

//     case "narrative":
//       return (
//         <AiRephraseField
//           diagnosisId={diagnosisId}
//           sectionId={section.id}
//           value={data || ""}
//           onChange={onChange}
//           rows={6}
//           disabled={isCompleted}
//         />
//       );

//     case "list":
//       return (
//         <ListField
//           items={Array.isArray(data) ? data : [""]}
//           onChange={onChange}
//         />
//       );

//     case "scoresTable":
//       return (
//         <ScoresTable section={section} data={data || {}} onChange={onChange} />
//       );

//     case "group":
//       return (
//         <div>
//           {section.subsections.map((sub) => (
//             <div key={sub.id}>
//               <SubSectionTitle>{sub.title}</SubSectionTitle>
//               <SectionRenderer
//                 section={sub}
//                 diagnosisId={diagnosisId}
//                 isCompleted={isCompleted}
//                 data={data?.[sub.id]}
//                 onChange={(val) => {
//                   const updated = { ...(data || {}), [sub.id]: val };
//                   onChange(updated);
//                 }}
//               />
//             </div>
//           ))}
//         </div>
//       );

//     default:
//       return null;
//   }
// };

// // ======================== Navigation Sidebar ========================

// const SectionNav = ({ sections, activeSection, onSelect }) => (
//   <div className="w-48 shrink-0 sticky top-4 self-start hidden lg:block">
//     <div className="bg-white rounded-xl shadow p-3 max-h-[80vh] overflow-y-auto">
//       <h4 className="text-sm font-bold text-gray-500 mb-2">ניווט מהיר</h4>
//       <ul className="flex flex-col gap-1">
//         {sections.map((s) => (
//           <li key={s.id}>
//             <button
//               onClick={() => onSelect(s.id)}
//               className={`w-full text-right text-sm px-2 py-1.5 rounded-lg transition ${
//                 activeSection === s.id
//                   ? "bg-blue-100 text-blue-800 font-bold"
//                   : "text-gray-600 hover:bg-gray-100"
//               }`}
//             >
//               {s.title}
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   </div>
// );

// // ======================== Main Component ========================

// const ReportForm = ({ diagnosisId, childData, onClose }) => {
//   const { currentUser } = useAuth();
//   const [formData, setFormData] = useState({});
//   const [status, setStatus] = useState("new"); // new | draft | completed
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [lastSaved, setLastSaved] = useState(null);
//   const [activeSection, setActiveSection] = useState(
//     REPORT_STRUCTURE[0]?.id || "",
//   );
//   const autoSaveTimer = useRef(null);

//   // ---- טעינת דוח קיים (אם יש) ----
//   useEffect(() => {
//     const loadReport = async () => {
//       try {
//         setLoading(true);
//         const token = await currentUser.getIdToken();
//         const report = await reportService.getByDiagnosis(diagnosisId, token);
//         if (report) {
//           setFormData(report.formData || {});
//           setStatus(report.status || "draft");
//         } else {
//           // מילוי אוטומטי מפרטי הילד
//           if (childData) {
//             const preFilled = {
//               personalDetails: {
//                 firstName: childData.firstName || "",
//                 lastName: childData.lastName || "",
//                 birthDate: childData.birthDate || "",
//               },
//             };

//             // משיכת נתונים משאלון ההורים
//             try {
//               const qaToken = await currentUser.getIdToken();
//               const qaRes = await fetch(
//                 `${import.meta.env.VITE_API_URL}/diagnoses/${diagnosisId}/parent-answers`,
//                 { headers: { Authorization: `Bearer ${qaToken}` } },
//               );
//               if (qaRes.ok) {
//                 const qa = await qaRes.json();
//                 if (qa?.formData) {
//                   preFilled.personalDetails = {
//                     ...preFilled.personalDetails,
//                     address: qa.formData.address || "",
//                     school: qa.formData.schoolOrGarden || "",
//                     grade: qa.formData.grade || "",
//                     homeLanguage: qa.formData.homeLanguage || "",
//                     birthCountry: qa.formData.birthCountry || "",
//                     fatherName: qa.formData.fatherName || "",
//                     motherName: qa.formData.motherName || "",
//                   };
//                 }
//               }
//             } catch (e) {
//               console.log("No parent questionnaire found");
//             }

//             setFormData(preFilled);
//           }
//         }
//       } catch (err) {
//         console.error("Error loading report:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (currentUser && diagnosisId) loadReport();
//   }, [currentUser, diagnosisId, childData]);

//   // ---- שמירה אוטומטית (כל 30 שניות) ----
//   useEffect(() => {
//     if (status === "completed" || loading) return;
//     autoSaveTimer.current = setInterval(() => {
//       handleSaveDraft(true);
//     }, 30000);
//     return () => clearInterval(autoSaveTimer.current);
//   }, [formData, status, loading]);

//   // ---- עדכון שדה בטופס ----
//   const updateSection = useCallback((sectionId, value) => {
//     setFormData((prev) => ({ ...prev, [sectionId]: value }));
//   }, []);

//   // ---- שמירת טיוטה ----
//   const handleSaveDraft = async (silent = false) => {
//     try {
//       if (!silent) setSaving(true);
//       const token = await currentUser.getIdToken();
//       await reportService.saveDraft(diagnosisId, formData, token);
//       setStatus("draft");
//       setLastSaved(new Date());
//     } catch (err) {
//       console.error("Error saving draft:", err);
//       if (!silent) alert("שגיאה בשמירת הטיוטה");
//     } finally {
//       if (!silent) setSaving(false);
//     }
//   };

//   // ---- הגשה סופית ----
//   const handleSubmit = async () => {
//     if (!window.confirm("האם להגיש את הדוח? לא ניתן לערוך לאחר ההגשה.")) return;
//     try {
//       setSaving(true);
//       const token = await currentUser.getIdToken();
//       await reportService.submit(diagnosisId, formData, token);
//       setStatus("completed");
//       alert("הדוח הוגש בהצלחה!");
//       if (onClose) onClose();
//     } catch (err) {
//       console.error("Error submitting report:", err);
//       alert("שגיאה בהגשת הדוח");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ---- יצוא דוח ל-PDF באמצעות הסרביס ----
//   const handleExportPDF = async () => {
//     try {
//       setSaving(true);
//       const token = await currentUser.getIdToken();

//       // קריאה ישירות לסרביס המעודכן שלנו
//       const blob = await reportService.exportPDF(diagnosisId, token);

//       // יצירת לינק זמני להורדה בדפדפן
//       const link = document.createElement("a");
//       link.href = window.URL.createObjectURL(blob);
//       link.download = `Report_${childData?.firstName || "Child"}.pdf`;
//       link.click();
//       window.URL.revokeObjectURL(link.href);
//     } catch (err) {
//       console.error("Error exporting PDF:", err);
//       alert("שגיאה בהפקת קובץ PDF");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ---- פתיחה מחדש לעריכה באמצעות הסרביס ----
//   const handleUnlockReport = async () => {
//     if (!window.confirm("האם את בטוחה שברצונך לפתוח את הדוח מחדש לעריכה?"))
//       return;
//     try {
//       setSaving(true);
//       const token = await currentUser.getIdToken();

//       // קריאה לסרביס
//       await reportService.unlock(diagnosisId, token);

//       setStatus("draft"); // החזרת מצב הטופס באפליקציה לטיוטה פתוחה
//       alert("הדוח נפתח מחדש לעריכה בהצלחה");
//     } catch (err) {
//       console.error("Error unlocking report:", err);
//       alert(err.message || "שגיאה בפתיחת הדוח לעריכה");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ---- גלילה למקטע ----
//   const scrollToSection = (sectionId) => {
//     setActiveSection(sectionId);
//     const el = document.getElementById(`section-${sectionId}`);
//     if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
//       </div>
//     );
//   }

//   const isCompleted = status === "completed";

//   return (
//     <div className="flex gap-6" dir="rtl">
//       {/* ניווט צדדי */}
//       <SectionNav
//         sections={REPORT_STRUCTURE}
//         activeSection={activeSection}
//         onSelect={scrollToSection}
//       />

//       {/* גוף הטופס */}
//       <div className="flex-1 max-w-4xl">
//         {/* כותרת + סטטוס */}
//         <div className="bg-white rounded-xl shadow p-6 mb-6">
//           <div className="flex justify-between items-center">
//             <div>
//               <h2 className="text-2xl font-bold text-blue-900">
//                 חוות דעת פסיכולוגית
//               </h2>
//               {childData && (
//                 <p className="text-gray-500 mt-1">
//                   {childData.firstName} {childData.lastName}
//                 </p>
//               )}
//             </div>
//             <div className="flex items-center gap-3">
//               {lastSaved && (
//                 <span className="text-xs text-gray-400">
//                   נשמר: {lastSaved.toLocaleTimeString("he-IL")}
//                 </span>
//               )}
//               <span
//                 className={`text-xs px-3 py-1 rounded-full font-bold ${
//                   status === "completed"
//                     ? "bg-green-100 text-green-700"
//                     : status === "draft"
//                       ? "bg-yellow-100 text-yellow-700"
//                       : "bg-gray-100 text-gray-500"
//                 }`}
//               >
//                 {status === "completed"
//                   ? "הושלם"
//                   : status === "draft"
//                     ? "טיוטה"
//                     : "חדש"}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* מקטעי הטופס */}
//         {REPORT_STRUCTURE.map((section) => (
//           <div
//             key={section.id}
//             id={`section-${section.id}`}
//             className="bg-white rounded-xl shadow p-6 mb-4"
//           >
//             <SectionTitle>{section.title}</SectionTitle>
//             <SectionRenderer
//               section={section}
//               data={formData[section.id]}
//               diagnosisId={diagnosisId}
//               isCompleted={isCompleted}
//               onChange={(val) => updateSection(section.id, val)}
//             />
//           </div>
//         ))}

//         {/* כפתורים */}
//         {/* כפתורים כאשר הדוח עדיין בעריכה */}
//         {!isCompleted && (
//           <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 p-3 flex gap-2 justify-center z-50">
//             {onClose && (
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-4 py-2 rounded-lg border border-gray-300 text-gray-500 text-sm hover:bg-gray-50 transition"
//               >
//                 חזרה
//               </button>
//             )}
//             <button
//               type="button"
//               onClick={() => handleSaveDraft(false)}
//               disabled={saving}
//               className="px-4 py-2 rounded-lg bg-yellow-500 text-white text-sm font-bold hover:bg-yellow-600 transition disabled:opacity-50"
//             >
//               {saving ? "שומר..." : "💾 שמור טיוטה"}
//             </button>
//             <button
//               type="button"
//               onClick={handleSubmit}
//               disabled={saving}
//               className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50"
//             >
//               הגש דוח סופי
//             </button>
//           </div>
//         )}

//         {/* כפתורים וסטטוס כאשר הדוח כבר הוגש והושלם */}
//         {isCompleted && (
//           <div className="bg-white rounded-xl shadow p-6 mb-8 border border-green-200">
//             <div className="bg-green-50 rounded-xl p-4 mb-4 text-center text-green-700 font-bold">
//               ✓ הדוח הוגש בהצלחה ומאובטח במערכת
//             </div>

//             <div className="flex gap-4 justify-center">
//               <button
//                 type="button"
//                 onClick={handleUnlockReport}
//                 disabled={saving}
//                 className="px-5 py-2.5 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition shadow-sm flex items-center gap-2 disabled:opacity-50"
//               >
//                 🔓 פתיחה מחדש לעריכה
//               </button>

//               <button
//                 type="button"
//                 onClick={handleExportPDF}
//                 disabled={saving}
//                 className="px-5 py-2.5 rounded-lg bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition shadow-sm flex items-center gap-2 disabled:opacity-50"
//               >
//                 📄 יצוא לקובץ PDF
//               </button>

//               {onClose && (
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
//                 >
//                   סגור וצא
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReportForm;
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import reportService from "../services/report.service";
import { REPORT_STRUCTURE, getNarrativeBlocks } from "../config/reportStructure";
import AiRephraseField, { MIN_CHARS } from "./AiRephraseField";
import AiRephraseBatchModal from "./AiRephraseBatchModal";
import PlausibilityReviewModal from "./PlausibilityReviewModal";

// ======================== Sub-components ========================

const SectionTitle = ({ children }) => (
  <h3 className="text-xl font-bold text-blue-800 underline mt-6 mb-3">
    {children}
  </h3>
);

const SubSectionTitle = ({ children }) => (
  <h4 className="text-base font-bold text-blue-700 underline mt-4 mb-2">
    {children}
  </h4>
);

// מחלקות אחידות למצב נעול - משמשות בכל סוגי השדות
const LOCKED_INPUT = "bg-gray-50 text-gray-600 cursor-not-allowed";

const InputField = ({ label, value, onChange, type = "text", disabled }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-bold text-gray-700">{label}</label>
    <input
      type={type}
      value={value || ""}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`border border-gray-300 p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
        disabled ? LOCKED_INPUT : ""
      }`}
    />
  </div>
);

const ListField = ({ items, onChange, disabled }) => {
  const handleChange = (index, value) => {
    const updated = [...items];
    updated[index] = value;
    onChange(updated);
  };

  const addItem = () => onChange([...items, ""]);

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2 items-center">
          <span className="text-gray-400 text-sm">{index + 1}.</span>
          <input
            type="text"
            value={item}
            disabled={disabled}
            onChange={(e) => handleChange(index, e.target.value)}
            className={`flex-1 border border-gray-300 p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
              disabled ? LOCKED_INPUT : ""
            }`}
          />
          {/* כפתורי עריכה מוסתרים לגמרי בדוח נעול */}
          {!disabled && (
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-red-400 hover:text-red-600 text-lg px-2"
              title="הסר"
            >
              ✕
            </button>
          )}
        </div>
      ))}
      {!disabled && (
        <button
          type="button"
          onClick={addItem}
          className="mt-1 text-sm text-blue-600 border border-blue-300 rounded-lg px-3 py-1 hover:bg-blue-50 transition self-start"
        >
          + הוסף פריט
        </button>
      )}
    </div>
  );
};

const ScoresTable = ({ section, data, onChange, disabled }) => {
  const columns = section.columns || [];
  const rows = section.rows || [];

  const handleCellChange = (rowId, colId, value) => {
    const updated = { ...data };
    if (!updated[rowId]) updated[rowId] = {};
    updated[rowId][colId] = value;
    onChange(updated);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-blue-50">
            <th className="border border-gray-300 p-2 text-right font-bold text-blue-800 min-w-[200px]">
              מבחן
            </th>
            {columns.map((col) => (
              <th
                key={col.id}
                className="border border-gray-300 p-2 text-center font-bold text-blue-800 min-w-[100px]"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2 font-medium text-gray-700">
                {row.label}
              </td>
              {columns.map((col) => (
                <td key={col.id} className="border border-gray-300 p-1">
                  <input
                    type="text"
                    value={data?.[row.id]?.[col.id] || ""}
                    disabled={disabled}
                    onChange={(e) =>
                      handleCellChange(row.id, col.id, e.target.value)
                    }
                    className={`w-full p-1 text-center outline-none rounded ${
                      disabled
                        ? "bg-gray-50 text-gray-600 cursor-not-allowed"
                        : "focus:bg-blue-50"
                    }`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ======================== Section Renderer ========================

const SectionRenderer = ({
  section,
  data,
  onChange,
  diagnosisId,
  isCompleted,
  selectMode,
  selectedIds,
  eligibleIds,
  onToggleSelect,
  plausibilityIssues,
  onAcknowledgeWarning,
}) => {
  switch (section.type) {
    case "infoTable":
      return (
        <div className="grid grid-cols-2 gap-4">
          {section.fields.map((field) => (
            <InputField
              key={field.id}
              label={field.label}
              type={field.type || "text"}
              value={data?.[field.id] || ""}
              disabled={isCompleted}
              onChange={(val) => {
                const updated = { ...data, [field.id]: val };
                onChange(updated);
              }}
            />
          ))}
        </div>
      );

    case "narrative":
      return (
        <div className="flex items-start gap-3">
          {selectMode && (
            <input
              type="checkbox"
              checked={selectedIds?.has(section.id) || false}
              onChange={() => onToggleSelect(section.id)}
              disabled={!eligibleIds?.has(section.id)}
              title={
                eligibleIds?.has(section.id)
                  ? "בחר/י בלוק זה לניסוח קבוצתי"
                  : `יש לכתוב לפחות ${MIN_CHARS} תווים כדי לבחור`
              }
              className="mt-3 w-5 h-5 accent-purple-600 shrink-0 disabled:opacity-30"
            />
          )}
          <div className="flex-1 min-w-0">
            <AiRephraseField
              diagnosisId={diagnosisId}
              sectionId={section.id}
              value={data || ""}
              onChange={onChange}
              rows={6}
              disabled={isCompleted}
              warning={plausibilityIssues?.[section.id] || null}
              onAcknowledgeWarning={
                onAcknowledgeWarning ? () => onAcknowledgeWarning(section.id) : undefined
              }
            />
          </div>
        </div>
      );

    case "list":
      return (
        <ListField
          items={Array.isArray(data) ? data : [""]}
          onChange={onChange}
          disabled={isCompleted}
        />
      );

    case "scoresTable":
      return (
        <ScoresTable
          section={section}
          data={data || {}}
          onChange={onChange}
          disabled={isCompleted}
        />
      );

    case "group":
      return (
        <div>
          {section.subsections.map((sub) => (
            <div key={sub.id}>
              <SubSectionTitle>{sub.title}</SubSectionTitle>
              <SectionRenderer
                section={sub}
                diagnosisId={diagnosisId}
                isCompleted={isCompleted}
                data={data?.[sub.id]}
                selectMode={selectMode}
                selectedIds={selectedIds}
                eligibleIds={eligibleIds}
                onToggleSelect={onToggleSelect}
                plausibilityIssues={plausibilityIssues}
                onAcknowledgeWarning={onAcknowledgeWarning}
                onChange={(val) => {
                  const updated = { ...(data || {}), [sub.id]: val };
                  onChange(updated);
                }}
              />
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
};

// ======================== Navigation Sidebar ========================

const SectionNav = ({ sections, activeSection, onSelect }) => (
  <div className="w-48 shrink-0 sticky top-4 self-start hidden lg:block">
    <div className="bg-white rounded-xl shadow p-3 max-h-[80vh] overflow-y-auto">
      <h4 className="text-sm font-bold text-gray-500 mb-2">ניווט מהיר</h4>
      <ul className="flex flex-col gap-1">
        {sections.map((s) => (
          <li key={s.id}>
            <button
              onClick={() => onSelect(s.id)}
              className={`w-full text-right text-sm px-2 py-1.5 rounded-lg transition ${
                activeSection === s.id
                  ? "bg-blue-100 text-blue-800 font-bold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {s.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// ======================== Main Component ========================

const ReportForm = ({ diagnosisId, childData, onClose }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState("new"); // new | draft | in_progress | completed
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [activeSection, setActiveSection] = useState(
    REPORT_STRUCTURE[0]?.id || "",
  );
  const autoSaveTimer = useRef(null);

  // ---- ניסוח מחדש קבוצתי: בחירת בלוקים ----
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [batchModalOpen, setBatchModalOpen] = useState(false);

  // ---- בדיקת סבירות תוכן לפני הגשה ----
  const [plausibilityIssues, setPlausibilityIssues] = useState({}); // { [sectionId]: reason }
  const [acknowledgedIds, setAcknowledgedIds] = useState(() => new Set());
  const [plausibilityModalOpen, setPlausibilityModalOpen] = useState(false);
  const [checkingPlausibility, setCheckingPlausibility] = useState(false);

  const narrativeBlocks = useMemo(() => getNarrativeBlocks(), []);

  // ---- טעינת דוח קיים (אם יש) ----
  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        const token = await currentUser.getIdToken();
        const report = await reportService.getByDiagnosis(diagnosisId, token);
        if (report) {
          setFormData(report.formData || {});
          setStatus(report.status || "draft");
        } else {
          // מילוי אוטומטי מפרטי הילד
          if (childData) {
            const preFilled = {
              personalDetails: {
                firstName: childData.firstName || "",
                lastName: childData.lastName || "",
                birthDate: childData.birthDate || "",
              },
            };

            // משיכת נתונים משאלון ההורים
            try {
              const qaToken = await currentUser.getIdToken();
              const qaRes = await fetch(
                `${import.meta.env.VITE_API_URL}/diagnoses/${diagnosisId}/parent-answers`,
                { headers: { Authorization: `Bearer ${qaToken}` } },
              );
              if (qaRes.ok) {
                const qa = await qaRes.json();
                if (qa?.formData) {
                  preFilled.personalDetails = {
                    ...preFilled.personalDetails,
                    address: qa.formData.address || "",
                    school: qa.formData.schoolOrGarden || "",
                    grade: qa.formData.grade || "",
                    homeLanguage: qa.formData.homeLanguage || "",
                    birthCountry: qa.formData.birthCountry || "",
                    fatherName: qa.formData.fatherName || "",
                    motherName: qa.formData.motherName || "",
                  };
                }
              }
            } catch (e) {
              console.log("No parent questionnaire found");
            }

            setFormData(preFilled);
          }
        }
      } catch (err) {
        console.error("Error loading report:", err);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser && diagnosisId) loadReport();
  }, [currentUser, diagnosisId, childData]);

  const isCompleted = status === "completed";

  // ---- שמירה אוטומטית (כל 30 שניות) ----
  useEffect(() => {
    if (isCompleted || loading) return;
    autoSaveTimer.current = setInterval(() => {
      handleSaveDraft(true);
    }, 30000);
    return () => clearInterval(autoSaveTimer.current);
  }, [formData, isCompleted, loading]);

  // ---- עדכון שדה בטופס ----
  const updateSection = useCallback((sectionId, value) => {
    setFormData((prev) => ({ ...prev, [sectionId]: value }));
  }, []);

  // ---- ניסוח מחדש קבוצתי: עזרים לבחירת בלוקים ----
  const getBlockText = useCallback(
    (block) =>
      (block.subId ? formData[block.topLevelId]?.[block.subId] : formData[block.topLevelId]) ||
      "",
    [formData],
  );

  const eligibleBlocks = useMemo(
    () => narrativeBlocks.filter((b) => getBlockText(b).trim().length >= MIN_CHARS),
    [narrativeBlocks, getBlockText],
  );
  const eligibleIds = useMemo(
    () => new Set(eligibleBlocks.map((b) => b.sectionId)),
    [eligibleBlocks],
  );

  const toggleSelectMode = () => {
    setSelectMode((prev) => !prev);
    setSelectedIds(new Set());
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.size === eligibleBlocks.length
        ? new Set()
        : new Set(eligibleBlocks.map((b) => b.sectionId)),
    );
  };

  const toggleSelectBlock = (sectionId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  // מקבלת מפה { sectionId: newText } מהמאבחנת (רק בלוקים שאושרו במסך
  // הסקירה הקבוצתית) וכותבת אותה בחזרה ל-formData - כולל בלוקים
  // מקוננים בתוך group (topLevelId/subId, ראה getNarrativeBlocks).
  const applyBatchResults = (acceptedMap) => {
    setFormData((prev) => {
      const next = { ...prev };
      narrativeBlocks.forEach((block) => {
        if (!(block.sectionId in acceptedMap)) return;
        const value = acceptedMap[block.sectionId];
        if (block.subId) {
          next[block.topLevelId] = { ...(next[block.topLevelId] || {}), [block.subId]: value };
        } else {
          next[block.topLevelId] = value;
        }
      });
      return next;
    });
    setBatchModalOpen(false);
    setSelectMode(false);
    setSelectedIds(new Set());
  };

  const selectedBlocksForModal = useMemo(
    () =>
      narrativeBlocks
        .filter((b) => selectedIds.has(b.sectionId))
        .map((b) => ({ sectionId: b.sectionId, title: b.title, rawText: getBlockText(b) })),
    [narrativeBlocks, selectedIds, getBlockText],
  );

  // ---- אישור אזהרת סבירות ישירות מהשדה: מבטלת את הסימון האדום מיידית ----
  const acknowledgePlausibilityWarning = (sectionId) => {
    setAcknowledgedIds((prev) => new Set(prev).add(sectionId));
    setPlausibilityIssues((prev) => {
      const next = { ...prev };
      delete next[sectionId];
      return next;
    });
  };

  // ---- toggle של checkbox בודד במודל הסקירה (בלי למחוק את השורה) ----
  const togglePlausibilityAcknowledge = (sectionId) => {
    setAcknowledgedIds((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  // ---- "אשר הכל והמשך" במודל: מאשרת הכל וממשיכה ישר להגשה ----
  const acknowledgeAllAndContinueSubmit = async () => {
    setAcknowledgedIds(new Set(Object.keys(plausibilityIssues)));
    setPlausibilityModalOpen(false);
    await proceedToSubmit();
  };

  // ---- "המשך להגשה" במודל (אחרי שכל הבלוקים אושרו ידנית) ----
  const continueSubmitFromModal = async () => {
    setPlausibilityModalOpen(false);
    await proceedToSubmit();
  };

  const plausibilityIssuesForModal = useMemo(
    () =>
      narrativeBlocks
        .filter((b) => b.sectionId in plausibilityIssues)
        .map((b) => ({
          sectionId: b.sectionId,
          title: b.title,
          rawText: getBlockText(b),
          reason: plausibilityIssues[b.sectionId],
        })),
    [narrativeBlocks, plausibilityIssues, getBlockText],
  );

  // ---- שמירת טיוטה ----
  const handleSaveDraft = async (silent = false) => {
    try {
      if (!silent) setSaving(true);
      const token = await currentUser.getIdToken();
      await reportService.saveDraft(diagnosisId, formData, token);
      setStatus("draft");
      setLastSaved(new Date());
    } catch (err) {
      console.error("Error saving draft:", err);
      if (!silent) alert("שגיאה בשמירת הטיוטה");
    } finally {
      if (!silent) setSaving(false);
    }
  };

  // ---- ההגשה בפועל (אחרי שבדיקת הסבירות עברה / אושרה) ----
  const proceedToSubmit = async () => {
    if (!window.confirm("האם להגיש את הדוח? לא ניתן לערוך לאחר ההגשה.")) return;
    try {
      setSaving(true);
      const token = await currentUser.getIdToken();
      await reportService.submit(diagnosisId, formData, token);
      setStatus("completed");
      alert("הדוח הוגש בהצלחה!");
      if (onClose) onClose();
    } catch (err) {
      console.error("Error submitting report:", err);
      alert("שגיאה בהגשת הדוח");
    } finally {
      setSaving(false);
    }
  };

  // ---- בדיקת סבירות תוכן (התאמה נושאית לבלוק) לפני הגשה ----
  const handleSubmit = async () => {
    const blocksToCheck = narrativeBlocks
      .map((block) => ({ ...block, rawText: getBlockText(block) }))
      .filter((block) => block.rawText.trim().length > 0);

    if (blocksToCheck.length === 0) {
      await proceedToSubmit();
      return;
    }

    setCheckingPlausibility(true);
    const foundIssues = {};
    try {
      const token = await currentUser.getIdToken();
      await reportService.checkPlausibility(
        diagnosisId,
        blocksToCheck.map(({ sectionId, title, rawText }) => ({ sectionId, title, rawText })),
        token,
        {
          onProgress: (event) => {
            if (event.type === "result" && event.reasonable === false) {
              foundIssues[event.sectionId] = event.reason || "";
            }
          },
        },
      );
    } catch (err) {
      // Fail-open גם בצד הלקוח: אם בדיקת הסבירות עצמה נכשלה (רשת/שרת),
      // לא חוסמים הגשה - פשוט ממשיכים כאילו לא נמצאו בעיות.
      console.error("Error checking plausibility:", err);
      setCheckingPlausibility(false);
      await proceedToSubmit();
      return;
    }
    setCheckingPlausibility(false);

    if (Object.keys(foundIssues).length === 0) {
      await proceedToSubmit();
      return;
    }

    setPlausibilityIssues(foundIssues);
    setAcknowledgedIds(new Set());
    setPlausibilityModalOpen(true);
  };

  // ---- יצוא דוח ל-PDF באמצעות הסרביס ----
  const handleExportPDF = async () => {
    try {
      setSaving(true);
      const token = await currentUser.getIdToken();

      // קריאה ישירות לסרביס המעודכן שלנו
      const blob = await reportService.exportPDF(diagnosisId, token);

      // יצירת לינק זמני להורדה בדפדפן
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `Report_${childData?.firstName || "Child"}.pdf`;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Error exporting PDF:", err);
      alert("שגיאה בהפקת קובץ PDF");
    } finally {
      setSaving(false);
    }
  };

  // ---- פתיחה מחדש לעריכה באמצעות הסרביס ----
  const handleUnlockReport = async () => {
    if (!window.confirm("האם את בטוחה שברצונך לפתוח את הדוח מחדש לעריכה?"))
      return;
    try {
      setSaving(true);
      const token = await currentUser.getIdToken();

      // קריאה לסרביס
      await reportService.unlock(diagnosisId, token);

      setStatus("draft"); // החזרת מצב הטופס באפליקציה לטיוטה פתוחה
      alert("הדוח נפתח מחדש לעריכה בהצלחה");
    } catch (err) {
      console.error("Error unlocking report:", err);
      alert(err.message || "שגיאה בפתיחת הדוח לעריכה");
    } finally {
      setSaving(false);
    }
  };

  // ---- גלילה למקטע ----
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const el = document.getElementById(`section-${sectionId}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // "חדש" רק אם אין דוח כלל; כל סטטוס אחר שאינו completed הוא טיוטה פתוחה
  const isNew = status === "new";

  return (
    <div className="flex gap-6" dir="rtl">
      {/* ניווט צדדי */}
      <SectionNav
        sections={REPORT_STRUCTURE}
        activeSection={activeSection}
        onSelect={scrollToSection}
      />

      {/* גוף הטופס */}
      <div className="flex-1 max-w-4xl">
        {/* כותרת + סטטוס */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-blue-900">
                חוות דעת פסיכולוגית
              </h2>
              {childData && (
                <p className="text-gray-500 mt-1">
                  {childData.firstName} {childData.lastName}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {lastSaved && !isCompleted && (
                <span className="text-xs text-gray-400">
                  נשמר: {lastSaved.toLocaleTimeString("he-IL")}
                </span>
              )}
              <span
                className={`text-xs px-3 py-1 rounded-full font-bold ${
                  isCompleted
                    ? "bg-green-100 text-green-700"
                    : isNew
                      ? "bg-gray-100 text-gray-500"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {isCompleted ? "הושלם" : isNew ? "חדש" : "טיוטה"}
              </span>
            </div>
          </div>

          {/* הודעת מצב קריאה בלבד - מוצגת מעל הטופס כדי שלא תוחמץ */}
          {isCompleted && (
            <div className="mt-4 rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-600">
              🔒 הדוח הוגש והוא במצב קריאה בלבד. כדי לשנות תוכן יש לפתוח אותו
              מחדש לעריכה בתחתית העמוד.
            </div>
          )}
        </div>

        {/* סרגל ניסוח מחדש קבוצתי */}
        {!isCompleted && (
          <div className="bg-white rounded-xl shadow p-4 mb-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={toggleSelectMode}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                selectMode
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "border border-purple-300 text-purple-700 hover:bg-purple-50"
              }`}
            >
              {selectMode ? "✕ בטל בחירה" : "☑ בחירת בלוקים לניסוח מחדש"}
            </button>

            {selectMode && (
              <>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      eligibleBlocks.length > 0 && selectedIds.size === eligibleBlocks.length
                    }
                    onChange={toggleSelectAll}
                    disabled={eligibleBlocks.length === 0}
                    className="w-4 h-4 accent-purple-600"
                  />
                  בחר את כל הדוח
                </label>

                <span className="text-sm text-gray-500">נבחרו {selectedIds.size} בלוקים</span>

                <button
                  type="button"
                  onClick={() => setBatchModalOpen(true)}
                  disabled={selectedIds.size === 0}
                  className="mr-auto px-4 py-2 rounded-xl text-sm font-semibold bg-purple-500 text-white hover:bg-purple-600 transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  ✨ נסח מחדש {selectedIds.size} בלוקים נבחרים
                </button>
              </>
            )}
          </div>
        )}

        {/* מקטעי הטופס */}
        {REPORT_STRUCTURE.map((section) => (
          <div
            key={section.id}
            id={`section-${section.id}`}
            className="bg-white rounded-xl shadow p-6 mb-4"
          >
            <SectionTitle>{section.title}</SectionTitle>
            <SectionRenderer
              section={section}
              data={formData[section.id]}
              diagnosisId={diagnosisId}
              isCompleted={isCompleted}
              selectMode={selectMode}
              selectedIds={selectedIds}
              eligibleIds={eligibleIds}
              onToggleSelect={toggleSelectBlock}
              plausibilityIssues={plausibilityIssues}
              onAcknowledgeWarning={acknowledgePlausibilityWarning}
              onChange={(val) => updateSection(section.id, val)}
            />
          </div>
        ))}

        {batchModalOpen && (
          <AiRephraseBatchModal
            diagnosisId={diagnosisId}
            blocks={selectedBlocksForModal}
            onClose={() => setBatchModalOpen(false)}
            onConfirm={applyBatchResults}
          />
        )}

        {plausibilityModalOpen && (
          <PlausibilityReviewModal
            issues={plausibilityIssuesForModal}
            acknowledgedIds={acknowledgedIds}
            onAcknowledge={togglePlausibilityAcknowledge}
            onAcknowledgeAll={acknowledgeAllAndContinueSubmit}
            onCancel={() => setPlausibilityModalOpen(false)}
            onContinue={continueSubmitFromModal}
          />
        )}

        {/* כפתורים כאשר הדוח עדיין בעריכה */}
        {!isCompleted && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 p-3 flex gap-2 justify-center z-50">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-500 text-sm hover:bg-gray-50 transition"
              >
                חזרה
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSaveDraft(false)}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-yellow-500 text-white text-sm font-bold hover:bg-yellow-600 transition disabled:opacity-50"
            >
              {saving ? "שומר..." : "💾 שמור טיוטה"}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving || checkingPlausibility}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {checkingPlausibility ? "בודקת תוכן..." : "הגש דוח סופי"}
            </button>
          </div>
        )}

        {/* כפתורים וסטטוס כאשר הדוח כבר הוגש והושלם */}
        {isCompleted && (
          <div className="bg-white rounded-xl shadow p-6 mb-8 border border-green-200">
            <div className="bg-green-50 rounded-xl p-4 mb-4 text-center text-green-700 font-bold">
              ✓ הדוח הוגש בהצלחה ומאובטח במערכת
            </div>

            <div className="flex gap-4 justify-center">
              <button
                type="button"
                onClick={handleUnlockReport}
                disabled={saving}
                className="px-5 py-2.5 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                🔓 פתיחה מחדש לעריכה
              </button>

              <button
                type="button"
                onClick={handleExportPDF}
                disabled={saving}
                className="px-5 py-2.5 rounded-lg bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                📄 יצוא לקובץ PDF
              </button>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
                >
                  סגור וצא
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportForm;
