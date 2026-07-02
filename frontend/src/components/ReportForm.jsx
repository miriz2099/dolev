import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import reportService from "../services/report.service";
import { REPORT_STRUCTURE } from "../config/reportStructure";

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

const InputField = ({ label, value, onChange, type = "text" }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-bold text-gray-700">{label}</label>
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, rows = 5 }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-bold text-gray-700">{label}</label>
    <textarea
      rows={rows}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y"
    />
  </div>
);

const ListField = ({ items, onChange }) => {
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
            onChange={(e) => handleChange(index, e.target.value)}
            className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="text-red-400 hover:text-red-600 text-lg px-2"
            title="הסר"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="mt-1 text-sm text-blue-600 border border-blue-300 rounded-lg px-3 py-1 hover:bg-blue-50 transition self-start"
      >
        + הוסף פריט
      </button>
    </div>
  );
};

const ScoresTable = ({ section, data, onChange }) => {
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
                    onChange={(e) =>
                      handleCellChange(row.id, col.id, e.target.value)
                    }
                    className="w-full p-1 text-center outline-none focus:bg-blue-50 rounded"
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

const SectionRenderer = ({ section, data, onChange }) => {
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
        <TextAreaField
          label=""
          value={data || ""}
          onChange={onChange}
          rows={6}
        />
      );

    case "list":
      return (
        <ListField
          items={Array.isArray(data) ? data : [""]}
          onChange={onChange}
        />
      );

    case "scoresTable":
      return (
        <ScoresTable
          section={section}
          data={data || {}}
          onChange={onChange}
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
                data={data?.[sub.id]}
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
  const [status, setStatus] = useState("new"); // new | draft | completed
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [activeSection, setActiveSection] = useState(
    REPORT_STRUCTURE[0]?.id || ""
  );
  const autoSaveTimer = useRef(null);

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
                { headers: { Authorization: `Bearer ${qaToken}` } }
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

  // ---- שמירה אוטומטית (כל 30 שניות) ----
  useEffect(() => {
    if (status === "completed" || loading) return;
    autoSaveTimer.current = setInterval(() => {
      handleSaveDraft(true);
    }, 30000);
    return () => clearInterval(autoSaveTimer.current);
  }, [formData, status, loading]);

  // ---- עדכון שדה בטופס ----
  const updateSection = useCallback((sectionId, value) => {
    setFormData((prev) => ({ ...prev, [sectionId]: value }));
  }, []);

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

  // ---- הגשה סופית ----
  const handleSubmit = async () => {
    if (!window.confirm("האם להגיש את הדוח? לא ניתן לערוך לאחר ההגשה."))
      return;
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

  const isCompleted = status === "completed";

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
              {lastSaved && (
                <span className="text-xs text-gray-400">
                  נשמר: {lastSaved.toLocaleTimeString("he-IL")}
                </span>
              )}
              <span
                className={`text-xs px-3 py-1 rounded-full font-bold ${
                  status === "completed"
                    ? "bg-green-100 text-green-700"
                    : status === "draft"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {status === "completed"
                  ? "הושלם"
                  : status === "draft"
                  ? "טיוטה"
                  : "חדש"}
              </span>
            </div>
          </div>
        </div>

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
              onChange={(val) => updateSection(section.id, val)}
            />
          </div>
        ))}

        {/* כפתורים */}
       {!isCompleted && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 p-3 flex gap-2 justify-center z-50">
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-500 text-sm hover:bg-gray-50 transition"
              >
                חזרה
              </button>
            )}
            <button
              onClick={() => handleSaveDraft(false)}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-yellow-500 text-white text-sm font-bold hover:bg-yellow-600 transition disabled:opacity-50"
            >
              {saving ? "שומר..." : "💾 שמור טיוטה"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50"
            >
              הגש דוח סופי
            </button>
          </div>
        )}

        {isCompleted && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 text-center text-green-700 font-bold">
            הדוח הוגש ואינו ניתן לעריכה
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportForm;