import React, { useState, useRef } from "react";

const InputField = ({ label, value, onChange, type = "text", className = "" }) => (
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
    {label && <label className="text-sm font-bold text-gray-700">{label}</label>}
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
  <h3 className="text-xl font-bold text-blue-800 underline mt-2 mb-4">{children}</h3>
);

const RadioRow = ({ name, options, value, onChange, label }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-bold text-gray-700">{label}</label>}
    <div className="flex gap-4 flex-wrap">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-1 cursor-pointer text-sm">
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
  "סיבת ההפניה",
  "הישגים לימודיים",
  "יחסים ותנהגות",
  "בעיות התנהגות",
  "עזרה מיוחדת וסיכום",
];

const FREQ_OPTIONS = ["כלל לא", "במקצת", "הרבה", "הרבה מאד"];
const BEHAVIOR_ITEMS = [
  "נעדר מבי\"ס ללא הצדקה",
  "מאחר לבי\"ס ללא הצדקה",
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

const SchoolQuestionnaire = ({ formId = "default", onSave, onCancel }) => {
  const [step, setStep] = useState(1);
  const [saveStatus, setSaveStatus] = useState("");
  const containerRef = useRef(null);

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString("he-IL"),

    // Step 1 - פרטים אישיים
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

    // Step 2 - סיבת ההפניה
    referralInitiator: "",
    referralReasons: "",
    difficultyDescription: "",

    // Step 3 - הישגים לימודיים
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
    academicLevel: "", // חלשים מאוד / חלשים / למטה מבינוניים / טובים / טובים מאוד / מצוינים
    reading: "",
    writing: "",
    math: "",

    // Step 4 - יחסים
    teacherRelation: "", // עוין / מסויג / תקין / מחפש אהדה / מחפש אהדה בצורה מופרזת
    teacherRelationNotes: "",
    peerRelation: "", // מתבודד / דחוי / מקיים יחסים חברתיים קלושים / מקובל / מקובל מאוד בעל עמדה מנהיג
    peerProblems: "",

    // Step 4b - התנהגות כללית (4 סעיפים בתדירות)
    distractedEasily: "",       // 1
    hardToFocus: "",            // 2
    excessiveMovement: "",      // 3
    leavesSeats: "",            // 4

    // Step 5 - בעיות התנהגות
    behaviorRatings: Object.fromEntries(BEHAVIOR_ITEMS.map((b) => [b, ""])),

    // Step 6 - עזרה מיוחדת וסיכום
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

  const saveDraft = () => {
    try {
      localStorage.setItem(`school_draft_${formId}`, JSON.stringify(formData));
      setSaveStatus("הטיוטה נשמרה");
    } catch {
      setSaveStatus("שגיאה בשמירה");
    }
    setTimeout(() => setSaveStatus(""), 2000);
  };

  const renderStep = () => {
    switch (step) {

      // ─────────────────────────────────────────────────────────────
      case 1:
        return (
          <div className="space-y-5">
            <SectionTitle>פרטים אישיים</SectionTitle>
            <div className="grid grid-cols-3 gap-4">
              <InputField label="שם משפחה" value={formData.lastName} onChange={(v) => handleChange("lastName", v)} />
              <InputField label="שם פרטי" value={formData.firstName} onChange={(v) => handleChange("firstName", v)} />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-gray-700">מין</label>
                <div className="flex gap-4 mt-2">
                  {["ז", "נ"].map((g) => (
                    <label key={g} className="flex items-center gap-1 cursor-pointer text-sm font-medium">
                      <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={() => handleChange("gender", g)} className="w-4 h-4" />
                      {g === "ז" ? "זכר" : "נקבה"}
                    </label>
                  ))}
                </div>
              </div>
              <InputField label="שם האב" value={formData.fatherName} onChange={(v) => handleChange("fatherName", v)} />
              <InputField label="שם האם" value={formData.motherName} onChange={(v) => handleChange("motherName", v)} />
              <InputField label="תאריך לידה" type="date" value={formData.birthDate} onChange={(v) => handleChange("birthDate", v)} />
              <InputField label="ת.ז." value={formData.idNumber} onChange={(v) => handleChange("idNumber", v)} />
              <InputField label="כתובת" value={formData.address} onChange={(v) => handleChange("address", v)} />
              <InputField label="מס' טלפון" value={formData.phone} onChange={(v) => handleChange("phone", v)} />
              <InputField label="בית ספר" value={formData.school} onChange={(v) => handleChange("school", v)} />
              <InputField label="כיתה" value={formData.grade} onChange={(v) => handleChange("grade", v)} />
              <InputField label="שם המחנך" value={formData.teacherName} onChange={(v) => handleChange("teacherName", v)} />
              <InputField label="טלפון מחנך" value={formData.teacherPhone} onChange={(v) => handleChange("teacherPhone", v)} />
            </div>
          </div>
        );

      // ─────────────────────────────────────────────────────────────
      case 2:
        return (
          <div className="space-y-5">
            <SectionTitle>סיבת ההפניה</SectionTitle>
            <InputField label="מי יזם את הפנייה?" value={formData.referralInitiator} onChange={(v) => handleChange("referralInitiator", v)} />
            <TextAreaField label="סיבות הפנייה" value={formData.referralReasons} onChange={(v) => handleChange("referralReasons", v)} rows={3} />
            <TextAreaField
              label="תיאור קשיי התלמיד"
              hint="ציין מתי החלו הקשיים ואת תדירות הופעתם"
              value={formData.difficultyDescription}
              onChange={(v) => handleChange("difficultyDescription", v)}
              rows={5}
            />
          </div>
        );

      // ─────────────────────────────────────────────────────────────
      case 3:
        return (
          <div className="space-y-5">
            <SectionTitle>הישגים לימודיים</SectionTitle>

            <div>
              <p className="text-sm font-bold text-gray-700 mb-2">מהלך לימודים בבית ספר:</p>
              <table className="w-full border-collapse border border-gray-300 text-sm" dir="rtl">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 p-2 text-right">כיתה</th>
                    <th className="border border-gray-300 p-2 text-right">בית ספר</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.schoolHistory.map((row, i) => (
                    <tr key={i}>
                      <td className="border border-gray-300 p-1">
                        <input value={row.grade} onChange={(e) => handleSchoolHistory(i, "grade", e.target.value)} className="w-full outline-none p-1 rounded" />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <input value={row.school} onChange={(e) => handleSchoolHistory(i, "school", e.target.value)} className="w-full outline-none p-1 rounded" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <AddRowButton onClick={addSchoolHistoryRow} label="+ הוסף שורת בית ספר" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField label="האם נשאר כיתה שנה נוספת?" value={formData.stayedGrade} onChange={(v) => handleChange("stayedGrade", v)} />
              <InputField label="באיזו כיתה?" value={formData.stayedGradeWhich} onChange={(v) => handleChange("stayedGradeWhich", v)} />
            </div>
            <InputField label="מה היו הסיבות לכך?" value={formData.stayedGradeReasons} onChange={(v) => handleChange("stayedGradeReasons", v)} />

            <div className="grid grid-cols-3 gap-4">
              <InputField label="ציונים בתעודה - בכיתה" value={formData.reportCardGrade} onChange={(v) => handleChange("reportCardGrade", v)} />
              <InputField label="במחצית" value={formData.reportCardHalf} onChange={(v) => handleChange("reportCardHalf", v)} />
              <InputField label="שנת" value={formData.reportCardYear} onChange={(v) => handleChange("reportCardYear", v)} />
            </div>

            <div>
              <p className="text-sm font-bold text-gray-700 mb-2">ציונים לפי מקצוע:</p>
              <table className="w-full border-collapse border border-gray-300 text-sm" dir="rtl">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 p-2 text-right">מקצוע</th>
                    <th className="border border-gray-300 p-2 text-right w-32">ציון</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.grades.map((row, i) => (
                    <tr key={i}>
                      <td className="border border-gray-300 p-1">
                        <input value={row.subject} onChange={(e) => handleGrade(i, "subject", e.target.value)} className="w-full outline-none p-1 rounded" placeholder="שם המקצוע" />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <input value={row.grade} onChange={(e) => handleGrade(i, "grade", e.target.value)} className="w-full outline-none p-1 rounded" placeholder="ציון" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <AddRowButton onClick={addGradeRow} label="+ הוסף מקצוע" />
            </div>

            <div>
              <p className="text-sm font-bold text-gray-700 mb-2">הערך את הישגיו הלימודיים בהשוואה להישגי הכיתה: <span className="font-normal text-xs text-gray-500">(סמן את התשובה המתאימה)</span></p>
              <div className="flex gap-3 flex-wrap">
                {["חלשים מאוד", "חלשים", "למטה מבינוניים", "טובים", "טובים מאוד", "מצוינים"].map((opt) => (
                  <label key={opt} className="flex items-center gap-1 cursor-pointer text-sm border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition">
                    <input type="radio" name="academicLevel" value={opt} checked={formData.academicLevel === opt} onChange={() => handleChange("academicLevel", opt)} className="w-4 h-4" />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-bold text-gray-700 underline">שליטתו במקצועות היסוד: <span className="font-normal text-xs text-gray-500">(פרט במיוחד לגבי תלמידים בכיתות א'-ד')</span></p>
              <TextAreaField
                label="קריאה"
                hint="רמת הקריאה - מתאים לאיזה כיתה, אוצר מילים, דיוק, קצב קריאה, פענוח, הבנת הנקרא"
                value={formData.reading}
                onChange={(v) => handleChange("reading", v)}
                rows={3}
              />
              <TextAreaField
                label="כתיבה"
                hint="העתקה, כתיבה חופשית, שגיאות כתיב, כתב"
                value={formData.writing}
                onChange={(v) => handleChange("writing", v)}
                rows={3}
              />
              <TextAreaField
                label="חשבון"
                hint="ציין את מידת הבנתו ושליטתו בפעולות החשבון ובפתרון בעיות"
                value={formData.math}
                onChange={(v) => handleChange("math", v)}
                rows={3}
              />
            </div>
          </div>
        );

      // ─────────────────────────────────────────────────────────────
      case 4:
        return (
          <div className="space-y-6">
            <SectionTitle>יחסים והתנהגות</SectionTitle>

            {/* יחס למורים */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-2">מה טיב יחסו של התלמיד אל המורים?</p>
              <div className="flex gap-3 flex-wrap">
                {["עוין", "מסויג", "תקין", "מחפש את אהדתם", "מחפש אהדה בצורה מופרזת"].map((opt) => (
                  <label key={opt} className="flex items-center gap-1 cursor-pointer text-sm border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition">
                    <input type="radio" name="teacherRelation" value={opt} checked={formData.teacherRelation === opt} onChange={() => handleChange("teacherRelation", opt)} className="w-4 h-4" />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <TextAreaField
              label="הערות ליחס למורים"
              hint="למשל: יחס שונה למורים שונים, יחס בלתי יציב, מתחרה עם בני כיתתו על אהדת המורה"
              value={formData.teacherRelationNotes}
              onChange={(v) => handleChange("teacherRelationNotes", v)}
              rows={3}
            />

            {/* יחס לבני כיתה */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-2">מה טיב יחסיו של הילד עם בני כיתתו?</p>
              <div className="flex gap-3 flex-wrap">
                {["מתבודד", "דחוי", "מקיים יחסים חברתיים קלושים", "מקובל", "מקובל מאוד – בעל עמדת מנהיג"].map((opt) => (
                  <label key={opt} className="flex items-center gap-1 cursor-pointer text-sm border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition">
                    <input type="radio" name="peerRelation" value={opt} checked={formData.peerRelation === opt} onChange={() => handleChange("peerRelation", opt)} className="w-4 h-4" />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <TextAreaField
              label="אם קיימות בעיות בחברה, תאר אותן, באילו נסיבות הן מופיעות ומדוע?"
              value={formData.peerProblems}
              onChange={(v) => handleChange("peerProblems", v)}
              rows={3}
            />

            {/* 4 סעיפי תדירות */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-1">הקף את המספר שמתאר באופן הטוב ביותר את התנהגות התלמיד בבית הספר במהלך 6 החודשים האחרונים:</p>
              <p className="text-xs text-gray-500 mb-3">אפשרויות: אף פעם / לעיתים רחוקות – לפעמים – לעיתים קרובות – לעיתים קרובות מאד</p>
              <table className="w-full border-collapse border border-gray-300 text-sm" dir="rtl">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 p-2 text-right">התנהגות</th>
                    {["אף פעם / לעיתים רחוקות", "לפעמים", "לעיתים קרובות", "לעיתים קרובות מאד"].map((h) => (
                      <th key={h} className="border border-gray-300 p-2 text-center text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: "distractedEasily", label: "1. דעתו מוסחת בקלות." },
                    { key: "hardToFocus", label: "2. מתקשה להתרכז במשימות או במשחקים." },
                    { key: "excessiveMovement", label: "3. נע/ה מסתובב או שמטפס באופן מוגזם במצבים בהם הדבר אינו מתאים." },
                    { key: "leavesSeats", label: "4. עוזב את הכסא בכיתה או במצבים אחרים בהם מצופה שימשיך לשבת." },
                  ].map(({ key, label }) => (
                    <tr key={key}>
                      <td className="border border-gray-300 p-2 font-medium">{label}</td>
                      {["אף פעם / לעיתים רחוקות", "לפעמים", "לעיתים קרובות", "לעיתים קרובות מאד"].map((opt) => (
                        <td key={opt} className="border border-gray-300 p-2 text-center">
                          <input
                            type="radio"
                            name={key}
                            value={opt}
                            checked={formData[key] === opt}
                            onChange={() => handleChange(key, opt)}
                            className="w-4 h-4"
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

      // ─────────────────────────────────────────────────────────────
      case 5:
        return (
          <div className="space-y-5">
            <SectionTitle>בעיות התנהגות במסגרת בי"ס</SectionTitle>
            <p className="text-xs text-gray-500">סמן את תדירות הופעת ההתנהגות עבור כל סעיף</p>
            <table className="w-full border-collapse border border-gray-300 text-sm" dir="rtl">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 p-2 text-right">התנהגות</th>
                  {FREQ_OPTIONS.map((h) => (
                    <th key={h} className="border border-gray-300 p-2 text-center text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BEHAVIOR_ITEMS.map((item) => (
                  <tr key={item} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">{item}</td>
                    {FREQ_OPTIONS.map((opt) => (
                      <td key={opt} className="border border-gray-300 p-2 text-center">
                        <input
                          type="radio"
                          name={`behavior_${item}`}
                          value={opt}
                          checked={formData.behaviorRatings[item] === opt}
                          onChange={() => handleBehavior(item, opt)}
                          className="w-4 h-4"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      // ─────────────────────────────────────────────────────────────
      case 6:
        return (
          <div className="space-y-5">
            <SectionTitle>עזרה מיוחדת וסיכום</SectionTitle>

            <p className="text-sm font-bold text-gray-700">האם הילד/ה קיבל/ה במסגרת בי"ס עזרה מיוחדת?</p>
            <div className="grid grid-cols-3 gap-4">
              <InputField label='שעות שילוב' value={formData.integrationHours} onChange={(v) => handleChange("integrationHours", v)} />
              <InputField label='היקף (ש"ש)' value={formData.integrationScope} onChange={(v) => handleChange("integrationScope", v)} />
              <InputField label='כמה שנים' value={formData.integrationYears} onChange={(v) => handleChange("integrationYears", v)} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-700">טיפול רגשי</label>
              <div className="flex gap-4">
                {["כן", "לא"].map((opt) => (
                  <label key={opt} className="flex items-center gap-1 cursor-pointer text-sm">
                    <input type="radio" name="emotionalTreatment" value={opt} checked={formData.emotionalTreatment === opt} onChange={() => handleChange("emotionalTreatment", opt)} className="w-4 h-4" />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <InputField label="איזה טיפול רגשי?" value={formData.emotionalTreatmentDetails} onChange={(v) => handleChange("emotionalTreatmentDetails", v)} />
            <InputField label="עזרה אחרת:" value={formData.otherHelp} onChange={(v) => handleChange("otherHelp", v)} />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-700">האם הילד למד במסגרת חינוך מיוחד?</label>
              <div className="flex gap-4">
                {["כן", "לא"].map((opt) => (
                  <label key={opt} className="flex items-center gap-1 cursor-pointer text-sm">
                    <input type="radio" name="specialEducation" value={opt} checked={formData.specialEducation === opt} onChange={() => handleChange("specialEducation", opt)} className="w-4 h-4" />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <InputField label="שם הגן / כיתה" value={formData.specialEdName} onChange={(v) => handleChange("specialEdName", v)} />

            <TextAreaField label="סכם התרשמותך מהתלמיד/ה:" value={formData.studentSummary} onChange={(v) => handleChange("studentSummary", v)} rows={5} />
            <TextAreaField label="שאלה אבחונית או אחרת הקיימת לגבי התלמיד:" value={formData.diagnosticQuestion} onChange={(v) => handleChange("diagnosticQuestion", v)} rows={3} />
            <InputField label="ההתערבות הטיפולית המבוקשת:" value={formData.requestedIntervention} onChange={(v) => handleChange("requestedIntervention", v)} />

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <InputField label="תאריך" value={formData.signatureDate} onChange={(v) => handleChange("signatureDate", v)} />
              <InputField label="שם המחנך" value={formData.teacherSignatureName} onChange={(v) => handleChange("teacherSignatureName", v)} />
              <InputField label="חתימה" value={formData.teacherSignature} onChange={(v) => handleChange("teacherSignature", v)} />
              <InputField label="חתימת מנהל" value={formData.principalSignature} onChange={(v) => handleChange("principalSignature", v)} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const totalSteps = STEPS.length;

  return (
    <div ref={containerRef} className="bg-white max-w-5xl mx-auto rounded-2xl shadow-lg p-8" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">טופס הפנייה לטיפול/אבחון - שאלון לבית ספר</h2>
          <p className="text-sm text-gray-500 mt-1">תאריך: {formData.date}</p>
        </div>
        <button onClick={saveDraft} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
          שמור טיוטה
        </button>
      </div>

      {saveStatus && <div className="text-green-600 text-sm mb-2">{saveStatus}</div>}

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span className="font-semibold text-blue-700">{STEPS[step - 1]}</span>
          <span>{step} / {totalSteps}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      {renderStep()}

      {/* Navigation */}
      <div className="flex justify-between mt-10">
        <button
          onClick={() => { if (step === 1) { onCancel && onCancel(); } else { setStep(step - 1); scrollToTop(); } }}
          className="text-gray-500 hover:text-gray-800 transition px-4 py-2 rounded border border-gray-300 hover:border-gray-500"
        >
          {step === 1 ? "ביטול" : "→ הקודם"}
        </button>

        {step < totalSteps ? (
          <button
            onClick={() => { setStep(step + 1); scrollToTop(); }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            המשך ←
          </button>
        ) : (
          <button
            onClick={() => onSave && onSave(formData)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            ✓ שלח טופס
          </button>
        )}
      </div>
    </div>
  );
};

export default SchoolQuestionnaire;