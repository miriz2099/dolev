import React, { useState, useEffect, useMemo } from "react";
import { getAuth } from "firebase/auth";
import childService from "../services/child.service";
import HebrewDateInput from "./HebrewDateInput";
import { formatTime, toYMD } from "../utils/dateFormat";

import { storage } from "../firebase"; // הייצוא שיצרנו בשלב הקודם
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const API_URL = import.meta.env.VITE_API_URL;

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  className = "",
  wide = false,
  maxDate,
  error = false,
}) => (
  <div
    className={`flex flex-col gap-1 ${wide ? "col-span-2" : ""} ${className}`}
    data-missing={error ? "true" : undefined}
  >
    <label
      className={`text-sm font-bold ${error ? "text-red-700" : "text-gray-700"}`}
    >
      {label}
    </label>
    {type === "date" ? (
      <HebrewDateInput
        value={value}
        onChange={onChange}
        maxDate={maxDate}
        className={`border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full ${
          error ? "border-red-500 bg-red-50" : "border-gray-300"
        }`}
      />
    ) : (
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
          error ? "border-red-500 bg-red-50" : "border-gray-300"
        }`}
      />
    )}
    {error && <span className="text-xs text-red-600">שדה חובה</span>}
  </div>
);

const TextAreaField = ({ label, value, onChange, rows = 3, error = false }) => (
  <div
    className="flex flex-col gap-1"
    data-missing={error ? "true" : undefined}
  >
    <label
      className={`text-sm font-bold ${error ? "text-red-700" : "text-gray-700"}`}
    >
      {label}
    </label>
    <textarea
      rows={rows}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={`border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
        error ? "border-red-500 bg-red-50" : "border-gray-300"
      }`}
    />
    {error && <span className="text-xs text-red-600">שדה חובה</span>}
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

const ParentQuestionnaire = ({
  childId = "default",
  diagnosisId,
  onSave,
  onCancel,
  onStepChange,
}) => {
  const formTopRef = React.useRef(null);

  const [step, setStep] = useState(1);
  const [saveStatus, setSaveStatus] = useState("");
  const [showMissing, setShowMissing] = useState(false);

  // 🆕 מדווח להורה/לעמוד האב על השלב הנוכחי (לסרגל הקשר דביק) - לא משפיע
  // על שום לוגיקה פנימית של השאלון עצמו
  useEffect(() => {
    onStepChange?.({ step, totalSteps: STEPS.length, stepLabel: STEPS[step - 1] });
  }, [step, onStepChange]);
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
    assessmentFiles: [],
    assessments: [{ type: "", date: "", recommendations: "" }],
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
    functioning: {
      studies: "",
      family: "",
      social: "",
      notes: "",
      studiesDetails: "",
      familyDetails: "",
      socialDetails: "",
    },

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
    signatureDate: toYMD(new Date()),
  });

  const scrollToTop = () => {
    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // כש-showMissing פעיל, אחרי כל מעבר שלב גוללים לשדה החסר הראשון בעמוד
  // הנוכחי (ושמים עליו פוקוס); אם אין שדה חסר בעמוד הזה, גוללים לראש הטופס
  useEffect(() => {
    if (!showMissing) return;

    const timer = setTimeout(() => {
      const el = document.querySelector('[data-missing="true"]');
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        const focusable = el.matches("input, textarea, select")
          ? el
          : el.querySelector("input, textarea, select");
        if (focusable) focusable.focus();
      } else {
        scrollToTop();
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [step, showMissing]);

  // const handleFileUpload = async (e) => {
  //   const files = Array.from(e.target.files);
  //   setSaveStatus("מעלה קבצים...");

  //   // כאן מומלץ להשתמש ב-Firebase Storage דרך ה-serviceAccountKey או ישירות מהקליינט
  //   // לעת עתה, נשמור אותם ב-state המקומי (לפני השליחה לשרת)
  //   try {
  //     // במידה ויש לך כבר לוגיקת העלאה ב-childService, השתמשי בה כאן
  //     setFormData((prev) => ({
  //       ...prev,
  //       assessmentFiles: [...(prev.assessmentFiles || []), ...files],
  //     }));
  //     setSaveStatus("קבצים הועלו בהצלחה");
  //   } catch (error) {
  //     setSaveStatus("שגיאה בהעלאת קבצים");
  //   }
  // };
  // const handleFileUpload = async (e) => {
  //   const files = Array.from(e.target.files);
  //   if (files.length === 0) return;

  //   setSaveStatus("מעלה קבצים לשרת...");

  //   try {
  //     const uploadPromises = files.map(async (file) => {
  //       // יצירת נתיב ייחודי לקובץ: questionnaires / מזהה ילד / שם הקובץ
  //       // שימוש ב-Date.now() מונע דריסה של קבצים עם שם זהה
  //       const fileRef = ref(
  //         storage,
  //         `questionnaires/${childId}/${Date.now()}_${file.name}`,
  //       );

  //       // העלאת הקובץ
  //       const snapshot = await uploadBytes(fileRef, file);

  //       // קבלת הקישור הציבורי (המאובטח) לצפייה בקובץ
  //       const downloadURL = await getDownloadURL(snapshot.ref);

  //       return {
  //         name: file.name,
  //         url: downloadURL,
  //         path: snapshot.ref.fullPath, // נשמור גם את הנתיב למקרה שנרצה למחוק בעתיד
  //       };
  //     });

  //     const uploadedFilesInfo = await Promise.all(uploadPromises);

  //     // עדכון ה-State עם הקישורים שהתקבלו מהשרת
  //     setFormData((prev) => ({
  //       ...prev,
  //       assessmentFiles: [
  //         ...(prev.assessmentFiles || []),
  //         ...uploadedFilesInfo,
  //       ],
  //     }));

  //     setSaveStatus("הקבצים הועלו ונשמרו בהצלחה");

  //     // טיפ מהארכיטקט: אחרי העלאת קובץ מוצלחת, כדאי לשמור טיוטה אוטומטית
  //     saveDraft();
  //   } catch (error) {
  //     console.error("Upload error:", error);
  //     setSaveStatus("שגיאה בהעלאת הקבצים, נסה שוב");
  //   }
  // };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setSaveStatus("מעלה קבצים...");

    try {
      const uploadPromises = files.map(async (file) => {
        const fileRef = ref(
          storage,
          `questionnaires/${childId}/${Date.now()}_${file.name}`,
        );
        const snapshot = await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        return {
          name: file.name,
          url: downloadURL,
          path: snapshot.ref.fullPath,
        };
      });

      const newFiles = await Promise.all(uploadPromises);

      // עדכון ה-State בצורה בטוחה
      setFormData((prev) => {
        const updatedFiles = [...(prev.assessmentFiles || []), ...newFiles];
        const newFormData = { ...prev, assessmentFiles: updatedFiles };

        // צעד קריטי: שליחת הטיוטה *מיד* אחרי שהקבצים התווספו ל-State
        // אנחנו מעבירים את ה-formData החדש ישירות לפונקציית השמירה
        saveDraft(newFormData);

        return newFormData;
      });

      setSaveStatus("הקבצים הועלו ונשמרו בטיוטה");
    } catch (error) {
      console.error("Upload error:", error);
      setSaveStatus("שגיאה בהעלאה");
    }
  };

  useEffect(() => {
    const loadDraft = async () => {
      if (!diagnosisId) return;

      try {
        setSaveStatus("טוען טיוטה...");
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();

        const response = await fetch(
          `${API_URL}/questionnaires/draft/${diagnosisId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          const loaded = data.formData || {};
          const assessments =
            Array.isArray(loaded.assessments) && loaded.assessments.length > 0
              ? loaded.assessments
              : loaded.assessmentType ||
                  loaded.assessmentDate ||
                  loaded.assessmentRecommendations
                ? [
                    {
                      type: loaded.assessmentType || "",
                      date: loaded.assessmentDate || "",
                      recommendations: loaded.assessmentRecommendations || "",
                    },
                  ]
                : [{ type: "", date: "", recommendations: "" }];
          setFormData({ ...loaded, assessments });
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
  }, [diagnosisId]);

  const saveDraft = async () => {
    if (!diagnosisId) return;

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
          diagnosisId: diagnosisId,
          formData: formData,
        }),
      });

      if (response.ok) {
        setSaveStatus("טיוטה נשמרה ב-" + formatTime(new Date()));
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
    if (!validation.isValid) {
      setShowMissing(true);
      setSaveStatus("");
      scrollToTop();
      return; // עוצר את השליחה
    }
    try {
      setSaveStatus("שולח שאלון סופי ונעל עריכה...");

      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();

      // קריאה לפונקציה המאוחדת בסרביס
      // הפונקציה הזו בבאקנד תדאג גם לשמור את השאלון וגם לעדכן את הסטטוס ל"נשלח"
      await childService.submitParentQuestionnaire(
        diagnosisId,
        formData,
        token,
      );

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

  const handleAssessment = (index, field, value) => {
    const updated = [...formData.assessments];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, assessments: updated }));
  };

  const addAssessmentRow = () =>
    setFormData((prev) => ({
      ...prev,
      assessments: [
        ...prev.assessments,
        { type: "", date: "", recommendations: "" },
      ],
    }));

  const removeAssessmentRow = (index) => {
    const assessment = formData.assessments[index];
    const hasValue =
      assessment.type || assessment.date || assessment.recommendations;
    if (hasValue && !window.confirm("למחוק את פרטי האבחון?")) return;

    setFormData((prev) => ({
      ...prev,
      assessments: prev.assessments.filter((_, i) => i !== index),
    }));
  };

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
                label="שם פרטי של הילד/ה *"
                value={formData.childFirstName}
                onChange={(v) => handleChange("childFirstName", v)}
                error={isMissing("childFirstName")}
              />
              <InputField
                label="שם משפחה *"
                value={formData.childLastName}
                onChange={(v) => handleChange("childLastName", v)}
                error={isMissing("childLastName")}
              />

              <div
                className="flex flex-col gap-1"
                data-missing={isMissing("gender") ? "true" : undefined}
              >
                <label
                  className={`text-sm font-bold ${isMissing("gender") ? "text-red-700" : "text-gray-700"}`}
                >
                  מגדר *
                </label>
                <select
                  value={formData.gender || ""}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className={`border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white ${
                    isMissing("gender")
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">בחר/י מגדר</option>
                  <option value="בן">בן</option>
                  <option value="בת">בת</option>
                </select>
                {isMissing("gender") && (
                  <span className="text-xs text-red-600">שדה חובה</span>
                )}
              </div>
              <InputField
                label="ת.ז *"
                value={formData.idNumber}
                onChange={(v) => handleChange("idNumber", v)}
                error={isMissing("idNumber")}
              />
              <InputField
                label="תאריך לידה *"
                type="date"
                value={formData.birthDate}
                onChange={(v) => handleChange("birthDate", v)}
                maxDate={new Date()}
                error={isMissing("birthDate")}
              />
              <InputField
                label="ארץ לידה *"
                value={formData.birthCountry}
                onChange={(v) => handleChange("birthCountry", v)}
                error={isMissing("birthCountry")}
              />
              <InputField
                label="תאריך עלייה"
                value={formData.aliyaDate}
                onChange={(v) => handleChange("aliyaDate", v)}
              />
              <InputField
                label="שם האב *"
                value={formData.fatherName}
                onChange={(v) => handleChange("fatherName", v)}
                error={isMissing("fatherName")}
              />
              <InputField
                label="שם האם *"
                value={formData.motherName}
                onChange={(v) => handleChange("motherName", v)}
                error={isMissing("motherName")}
              />
              <InputField
                label="מצב משפחתי (הורים) *"
                value={formData.familyStatus}
                onChange={(v) => handleChange("familyStatus", v)}
                error={isMissing("familyStatus")}
              />
            </div>
            <TextAreaField
              label="הערות למצב המשפחתי"
              value={formData.familyNotes}
              onChange={(v) => handleChange("familyNotes", v)}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="כתובת *"
                value={formData.address}
                onChange={(v) => handleChange("address", v)}
                error={isMissing("address")}
              />
              <InputField
                label="מספר טלפון *"
                value={formData.phone}
                onChange={(v) => handleChange("phone", v)}
                error={isMissing("phone")}
              />
              <InputField
                label="בית ספר/גן *"
                value={formData.schoolOrGarden}
                onChange={(v) => handleChange("schoolOrGarden", v)}
                error={isMissing("schoolOrGarden")}
              />
              <InputField
                label="כיתה *"
                value={formData.grade}
                onChange={(v) => handleChange("grade", v)}
                error={isMissing("grade")}
              />
              <InputField
                label="שפה מדוברת בבית *"
                value={formData.homeLanguage}
                onChange={(v) => handleChange("homeLanguage", v)}
                error={isMissing("homeLanguage")}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <SectionTitle>סיבת הפנייה</SectionTitle>
            <TextAreaField
              label="תיאור הקושי *"
              value={formData.difficultyDescription}
              onChange={(v) => handleChange("difficultyDescription", v)}
              rows={4}
              error={isMissing("difficultyDescription")}
            />
            <TextAreaField
              label="מטרות הפנייה *"
              value={formData.referralGoals}
              onChange={(v) => handleChange("referralGoals", v)}
              rows={4}
              error={isMissing("referralGoals")}
            />
            <InputField
              label="מתי התחילו הקשיים? *"
              value={formData.onsetTime}
              onChange={(v) => handleChange("onsetTime", v)}
              error={isMissing("onsetTime")}
            />

            <div
              className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3"
              data-missing={isMissing("hadAssessment") ? "true" : undefined}
            >
              <p
                className={`font-bold text-sm ${isMissing("hadAssessment") ? "text-red-700" : "text-gray-700"}`}
              >
                האם הילד/ה עבר/ה אבחון פסיכולוגי, או אחר (כגון: נוירולוגי / ר.
                בעיסוק / ק. תקשורת)? *
              </p>
              {isMissing("hadAssessment") && (
                <span className="text-xs text-red-600">שדה חובה</span>
              )}

              {/* בחירת כן/לא */}
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hadAssessment"
                    value="כן"
                    checked={formData.hadAssessment === "כן"}
                    onChange={(e) =>
                      handleChange("hadAssessment", e.target.value)
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>כן</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hadAssessment"
                    value="לא"
                    checked={formData.hadAssessment === "לא"}
                    onChange={(e) =>
                      handleChange("hadAssessment", e.target.value)
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>לא</span>
                </label>
              </div>

              {/* הצגת השדות הנוספים רק אם סומן "כן" */}
              {formData.hadAssessment === "כן" && (
                <div className="space-y-4 border-t pt-4 animate-in fade-in duration-500">
                  <div className="space-y-4">
                    {formData.assessments.map((assessment, i) => (
                      <div
                        key={i}
                        className="border border-gray-200 rounded-lg p-3 bg-white space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-gray-500">
                            אבחון {i + 1}
                          </p>
                          {formData.assessments.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeAssessmentRow(i)}
                              title="הסרת אבחון"
                              aria-label="הסרת אבחון"
                              className="w-5 h-5 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <InputField
                            label="איזה אבחון *"
                            value={assessment.type}
                            onChange={(v) => handleAssessment(i, "type", v)}
                            error={isMissing(`assessments.${i}.type`)}
                          />
                          <InputField
                            label="תאריך האבחון *"
                            type="date"
                            value={assessment.date}
                            onChange={(v) => handleAssessment(i, "date", v)}
                            maxDate={new Date()}
                            error={isMissing(`assessments.${i}.date`)}
                          />
                        </div>
                        <TextAreaField
                          label="מה היו המלצות האבחון? *"
                          value={assessment.recommendations}
                          onChange={(v) =>
                            handleAssessment(i, "recommendations", v)
                          }
                          error={isMissing(`assessments.${i}.recommendations`)}
                        />
                      </div>
                    ))}
                    <AddRowButton
                      onClick={addAssessmentRow}
                      label="+ הוסף אבחון נוסף"
                    />
                  </div>

                  {/* העלאת קבצים */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">
                      צרף/י את תוצאות האבחון (PDF/תמונה)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e)} // פונקציה שנכתוב מיד
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {/* רשימת קבצים שכבר הועלו */}
                    {formData.assessmentFiles &&
                      formData.assessmentFiles.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs font-bold text-blue-800">
                            קבצים שצורפו:
                          </p>
                          {formData.assessmentFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-blue-50 p-2 rounded-lg border border-blue-100"
                            >
                              <span className="text-sm truncate max-w-[200px]">
                                {file.name}
                              </span>
                              <div className="flex gap-2">
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-600 text-xs underline"
                                >
                                  צפייה
                                </a>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedFiles =
                                      formData.assessmentFiles.filter(
                                        (_, i) => i !== index,
                                      );
                                    handleChange(
                                      "assessmentFiles",
                                      updatedFiles,
                                    );
                                  }}
                                  className="text-red-500 text-xs"
                                >
                                  ❌ הסר
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
            <TextAreaField
              label="האם הילד/ה היה/הייתה בטיפול פרא רפואי כגון ריפוי בעיסוק, קלינאית תקשורת, פיזיותרפיה או אחר? *"
              value={formData.paraMedicalTreatments}
              onChange={(v) => handleChange("paraMedicalTreatments", v)}
              error={isMissing("paraMedicalTreatments")}
            />
            <InputField
              label="האם הילד/ה דיבר/ה על מצוקת חששות, חרדות, פחדים? *"
              value={formData.expressedDistress}
              onChange={(v) => handleChange("expressedDistress", v)}
              error={isMissing("expressedDistress")}
            />
            <InputField
              label="האם הילד הביע רצון או נכונות להתייעץ עם איש מקצוע? *"
              value={formData.willingToConsult}
              onChange={(v) => handleChange("willingToConsult", v)}
              error={isMissing("willingToConsult")}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <SectionTitle>מהלך הלימודים</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label='באיזה גיל יצא/ה לראשונה למסגרת לימודית (מעון/גן/בי"ס)? *'
                value={formData.firstFrameworkAge}
                onChange={(v) => handleChange("firstFrameworkAge", v)}
                error={isMissing("firstFrameworkAge")}
              />
              <InputField
                label="לאיזו מסגרת? *"
                value={formData.firstFrameworkType}
                onChange={(v) => handleChange("firstFrameworkType", v)}
                error={isMissing("firstFrameworkType")}
              />
            </div>
            <TextAreaField
              label="האם הילד/ה ביקר/ה בגן טרום חובה? אם כן מה היו הדיווחים על תפקודו/ה שם? *"
              value={formData.prePreSchoolReports}
              onChange={(v) => handleChange("prePreSchoolReports", v)}
              error={isMissing("prePreSchoolReports")}
            />
            <TextAreaField
              label="מה היו הדיווחים על התפקוד בגן-חובה? אם נשאר/ה שנה נוספת בגן חובה - מה הייתה הסיבה לכך? *"
              value={formData.preSchoolReports}
              onChange={(v) => handleChange("preSchoolReports", v)}
              error={isMissing("preSchoolReports")}
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
            <div className="overflow-x-auto">
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
                    <th className="border border-gray-300 p-2 text-right w-1/3">
                      פירוט מילולי
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: "studies", label: "בלימודים" },
                    { key: "family", label: "במשפחה" },
                    { key: "social", label: "בחברה" },
                  ].map(({ key, label }) => (
                    <tr
                      key={key}
                      data-missing={
                        isMissing(`functioning.${key}`) ? "true" : undefined
                      }
                    >
                      <td
                        className={`border border-gray-300 p-2 font-bold ${
                          isMissing(`functioning.${key}`)
                            ? "text-red-700 bg-red-50"
                            : ""
                        }`}
                      >
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
                            onChange={() =>
                              handleNested("functioning", key, opt)
                            }
                            className="w-4 h-4"
                          />
                        </td>
                      ))}
                      <td className="border border-gray-300 p-1">
                        <textarea
                          rows={2}
                          value={formData.functioning[`${key}Details`] || ""}
                          onChange={(e) =>
                            handleNested(
                              "functioning",
                              `${key}Details`,
                              e.target.value,
                            )
                          }
                          placeholder="אפשר לפרט כאן (לא חובה)"
                          className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                  <th className="border border-gray-300 p-2 text-right">
                    שם *
                  </th>
                  <th className="border border-gray-300 p-2 text-right">
                    גיל *
                  </th>
                  <th className="border border-gray-300 p-2 text-right">
                    עיסוק *
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
                      data-missing={
                        isMissing("familyStructure.motherNameInTable")
                          ? "true"
                          : undefined
                      }
                      className={`w-full outline-none p-1 rounded ${
                        isMissing("familyStructure.motherNameInTable")
                          ? "border border-red-500 bg-red-50"
                          : ""
                      }`}
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
                      data-missing={
                        isMissing("familyStructure.motherAge")
                          ? "true"
                          : undefined
                      }
                      className={`w-full outline-none p-1 rounded ${
                        isMissing("familyStructure.motherAge")
                          ? "border border-red-500 bg-red-50"
                          : ""
                      }`}
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
                      data-missing={
                        isMissing("familyStructure.motherJob")
                          ? "true"
                          : undefined
                      }
                      className={`w-full outline-none p-1 rounded ${
                        isMissing("familyStructure.motherJob")
                          ? "border border-red-500 bg-red-50"
                          : ""
                      }`}
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
                      data-missing={
                        isMissing("familyStructure.fatherNameInTable")
                          ? "true"
                          : undefined
                      }
                      className={`w-full outline-none p-1 rounded ${
                        isMissing("familyStructure.fatherNameInTable")
                          ? "border border-red-500 bg-red-50"
                          : ""
                      }`}
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
                      data-missing={
                        isMissing("familyStructure.fatherAge")
                          ? "true"
                          : undefined
                      }
                      className={`w-full outline-none p-1 rounded ${
                        isMissing("familyStructure.fatherAge")
                          ? "border border-red-500 bg-red-50"
                          : ""
                      }`}
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
                      data-missing={
                        isMissing("familyStructure.fatherJob")
                          ? "true"
                          : undefined
                      }
                      className={`w-full outline-none p-1 rounded ${
                        isMissing("familyStructure.fatherJob")
                          ? "border border-red-500 bg-red-50"
                          : ""
                      }`}
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

            <p className="text-sm font-bold text-gray-700 mt-4">אחים/אחיות:</p>
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
              label="מה מצב בריאותו/ה הכללי של הילד/ה? *"
              value={formData.generalHealth}
              onChange={(v) => handleChange("generalHealth", v)}
              error={isMissing("generalHealth")}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="בדיקת ראייה - תאריך"
                type="date"
                value={formData.visionDate}
                onChange={(v) => handleChange("visionDate", v)}
                maxDate={new Date()}
              />
              <InputField
                label="ממצאים"
                value={formData.visionFindings}
                onChange={(v) => handleChange("visionFindings", v)}
              />
              <InputField
                label="בדיקת שמיעה - תאריך"
                type="date"
                value={formData.hearingDate}
                onChange={(v) => handleChange("hearingDate", v)}
                maxDate={new Date()}
              />
              <InputField
                label="ממצאים"
                value={formData.hearingFindings}
                onChange={(v) => handleChange("hearingFindings", v)}
              />
            </div>
            <TextAreaField
              label="האם הילד/ה סובל או סבל בעבר ממחלה? *"
              value={formData.pastDiseases}
              onChange={(v) => handleChange("pastDiseases", v)}
              error={isMissing("pastDiseases")}
            />
            <div className="grid grid-cols-3 gap-4">
              <InputField
                label="אשפוז? *"
                value={formData.hospitalization}
                onChange={(v) => handleChange("hospitalization", v)}
                error={isMissing("hospitalization")}
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
              label="האם נוטל תרופות באופן קבוע? *"
              value={formData.regularMedications}
              onChange={(v) => handleChange("regularMedications", v)}
              error={isMissing("regularMedications")}
            />
          </div>
        );

      case 7:
        return (
          <div className="space-y-5">
            <SectionTitle>רקע התפתחותי</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="האם ההיריון היה/הייתה מתוכנן? (כן / לא) *"
                value={formData.development.plannedPregnancy}
                onChange={(v) =>
                  handleNested("development", "plannedPregnancy", v)
                }
                error={isMissing("development.plannedPregnancy")}
              />
              <InputField
                label="האם ההיריון היה תקין? (כן / לא) *"
                value={formData.development.normalPregnancy}
                onChange={(v) =>
                  handleNested("development", "normalPregnancy", v)
                }
                error={isMissing("development.normalPregnancy")}
              />
            </div>
            <InputField
              label="פרט על ההיריון *"
              value={formData.development.pregnancyDetails}
              onChange={(v) =>
                handleNested("development", "pregnancyDetails", v)
              }
              error={isMissing("development.pregnancyDetails")}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="האם הלידה הייתה תקינה? (כן / לא) *"
                value={formData.development.normalBirth}
                onChange={(v) => handleNested("development", "normalBirth", v)}
                error={isMissing("development.normalBirth")}
              />
              <InputField
                label="משקל הלידה *"
                value={formData.development.birthWeight}
                onChange={(v) => handleNested("development", "birthWeight", v)}
                error={isMissing("development.birthWeight")}
              />
            </div>
            <InputField
              label="פרט על הלידה *"
              value={formData.development.birthDetails}
              onChange={(v) => handleNested("development", "birthDetails", v)}
              error={isMissing("development.birthDetails")}
            />
            <InputField
              label="האם הופיעו בעיות רפואיות לאחר הלידה? *"
              value={formData.development.problemsAfterBirthChild}
              onChange={(v) =>
                handleNested("development", "problemsAfterBirthChild", v)
              }
              error={isMissing("development.problemsAfterBirthChild")}
            />
            <InputField
              label="האם האם סבלה מבעיות רפואיות לאחר הלידה? *"
              value={formData.development.problemsAfterBirthMother}
              onChange={(v) =>
                handleNested("development", "problemsAfterBirthMother", v)
              }
              error={isMissing("development.problemsAfterBirthMother")}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="האם ההתפתחות המוטורית (תנועתית) הייתה תקינה? *"
                value={formData.development.normalMotorDev}
                onChange={(v) =>
                  handleNested("development", "normalMotorDev", v)
                }
                error={isMissing("development.normalMotorDev")}
              />
              <InputField
                label="מתי התחיל/ה ללכת? *"
                value={formData.development.walkingAge}
                onChange={(v) => handleNested("development", "walkingAge", v)}
                error={isMissing("development.walkingAge")}
              />
              <InputField
                label="האם ההתפתחות השפתית הייתה תקינה? *"
                value={formData.development.normalLanguageDev}
                onChange={(v) =>
                  handleNested("development", "normalLanguageDev", v)
                }
                error={isMissing("development.normalLanguageDev")}
              />
              <InputField
                label="מתי דיבר/ה לראשונה? *"
                value={formData.development.firstWordsAge}
                onChange={(v) =>
                  handleNested("development", "firstWordsAge", v)
                }
                error={isMissing("development.firstWordsAge")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="האם היו קשיי שינה בשנה הראשונה? *"
                value={formData.development.sleepIssuesFirstYear}
                onChange={(v) =>
                  handleNested("development", "sleepIssuesFirstYear", v)
                }
                error={isMissing("development.sleepIssuesFirstYear")}
              />
              <InputField
                label="האם היו קשיי אכילה בשנה הראשונה? *"
                value={formData.development.eatingIssuesFirstYear}
                onChange={(v) =>
                  handleNested("development", "eatingIssuesFirstYear", v)
                }
                error={isMissing("development.eatingIssuesFirstYear")}
              />
            </div>
            <InputField
              label="באיזה גיל נגמל/ה מחיתולים? *"
              value={formData.development.diaperGraduationAge}
              onChange={(v) =>
                handleNested("development", "diaperGraduationAge", v)
              }
              error={isMissing("development.diaperGraduationAge")}
            />
          </div>
        );

      case 8:
        return (
          <div className="space-y-5">
            <SectionTitle>הילד/ה היום</SectionTitle>
            <SubTitle>
              האם יש כיום בעיות סביב אוכל / שינה / פחדי לילה / חרדות אחרות /
              אחר? *
            </SubTitle>
            <TextAreaField
              label="אם כן, פרט/י:"
              value={formData.currentProblems.foodSleepFearsDetails}
              onChange={(v) =>
                handleNested("currentProblems", "foodSleepFearsDetails", v)
              }
              error={isMissing("currentProblems.foodSleepFearsDetails")}
            />
            <SubTitle>במסגרת הבית:</SubTitle>
            <div className="space-y-3">
              <InputField
                label="האם הילד/ה חסר מנוחה, נמצא בפעילות יתר? *"
                value={formData.currentProblems.restlessness}
                onChange={(v) =>
                  handleNested("currentProblems", "restlessness", v)
                }
                error={isMissing("currentProblems.restlessness")}
              />
              <InputField
                label="מתרגש/ת בקלות? *"
                value={formData.currentProblems.excitedEasily}
                onChange={(v) =>
                  handleNested("currentProblems", "excitedEasily", v)
                }
                error={isMissing("currentProblems.excitedEasily")}
              />
              <InputField
                label="מפריע/ה לאחרים? *"
                value={formData.currentProblems.disturbsOthers}
                onChange={(v) =>
                  handleNested("currentProblems", "disturbsOthers", v)
                }
                error={isMissing("currentProblems.disturbsOthers")}
              />
              <InputField
                label="האם מתקשה להתמיד ולסיים משימות? *"
                value={formData.currentProblems.difficultyCompletingTasks}
                onChange={(v) =>
                  handleNested(
                    "currentProblems",
                    "difficultyCompletingTasks",
                    v,
                  )
                }
                error={isMissing("currentProblems.difficultyCompletingTasks")}
              />
              <InputField
                label="האם זקוק/ה לתשומת לב רבה במיוחד? *"
                value={formData.currentProblems.needsSpecialAttention}
                onChange={(v) =>
                  handleNested("currentProblems", "needsSpecialAttention", v)
                }
                error={isMissing("currentProblems.needsSpecialAttention")}
              />
              <InputField
                label="תלותי/ת / עצמאי/ת? *"
                value={formData.currentProblems.dependencyVsIndependence}
                onChange={(v) =>
                  handleNested("currentProblems", "dependencyVsIndependence", v)
                }
                error={isMissing("currentProblems.dependencyVsIndependence")}
              />
              <InputField
                label="אחר:"
                value={formData.currentProblems.otherBehavioral}
                onChange={(v) =>
                  handleNested("currentProblems", "otherBehavioral", v)
                }
              />
              <InputField
                label="למי קרוב/ה יותר? לאם, לאב או אחר? *"
                value={formData.currentProblems.closerToWho}
                onChange={(v) =>
                  handleNested("currentProblems", "closerToWho", v)
                }
                error={isMissing("currentProblems.closerToWho")}
              />
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-5">
            <SectionTitle>תפקוד חברתי</SectionTitle>
            <InputField
              label="האם יש לילדך/ילדתך חברים? *"
              value={formData.social.hasFriends}
              onChange={(v) => handleNested("social", "hasFriends", v)}
              error={isMissing("social.hasFriends")}
            />
            <InputField
              label="האם הוא/היא מאד חברותי/ת או שיש לו/לה מספר חברים מועט? *"
              value={formData.social.socialLevel}
              onChange={(v) => handleNested("social", "socialLevel", v)}
              error={isMissing("social.socialLevel")}
            />
            <InputField
              label="האם יש לו/לה קשרים חברתיים קרובים ומשמעותיים? *"
              value={formData.social.meaningfulConnections}
              onChange={(v) =>
                handleNested("social", "meaningfulConnections", v)
              }
              error={isMissing("social.meaningfulConnections")}
            />
            <InputField
              label="האם יש לו/לה קשרים עם בני המין השני? *"
              value={formData.social.oppositeSexConnections}
              onChange={(v) =>
                handleNested("social", "oppositeSexConnections", v)
              }
              error={isMissing("social.oppositeSexConnections")}
            />
            <TextAreaField
              label="האם יש לו/לה בעיות חברתיות? פרט: *"
              value={formData.social.socialProblemsDetails}
              onChange={(v) =>
                handleNested("social", "socialProblemsDetails", v)
              }
              error={isMissing("social.socialProblemsDetails")}
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
                label="תאריך *"
                type="date"
                value={formData.signatureDate}
                onChange={(v) => handleChange("signatureDate", v)}
                maxDate={new Date()}
                error={isMissing("signatureDate")}
              />
              <InputField
                label="ההורה הממלא *"
                value={formData.parentsSignature}
                onChange={(v) => handleChange("parentsSignature", v)}
                error={isMissing("parentsSignature")}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const validateAllSteps = () => {
    const missingFields = [];
    const missingByStep = [];
    const missingKeys = new Set();
    let currentStep = 1;
    const add = (label, key) => {
      missingFields.push(label);
      missingByStep.push({ step: currentStep, label, key });
      missingKeys.add(key);
    };

    // --- שלב 1: פרטים אישיים ---
    currentStep = 1;
    if (!formData.childFirstName) add("שם פרטי של הילד/ה", "childFirstName");
    if (!formData.childLastName) add("שם משפחה", "childLastName");
    if (!formData.gender) add("מגדר", "gender");
    if (!formData.idNumber) add("ת.ז", "idNumber");
    if (!formData.birthDate) add("תאריך לידה", "birthDate");
    if (!formData.birthCountry) add("ארץ לידה", "birthCountry");
    if (!formData.fatherName) add("שם האב", "fatherName");
    if (!formData.motherName) add("שם האם", "motherName");
    if (!formData.familyStatus) add("מצב משפחתי", "familyStatus");
    if (!formData.address) add("כתובת", "address");
    if (!formData.phone) add("מספר טלפון", "phone");
    if (!formData.schoolOrGarden) add("בית ספר/גן", "schoolOrGarden");
    if (!formData.grade) add("כיתה", "grade");
    if (!formData.homeLanguage) add("שפה מדוברת בבית", "homeLanguage");

    // --- שלב 2: סיבת הפנייה ---
    currentStep = 2;
    if (!formData.difficultyDescription)
      add("תיאור הקושי", "difficultyDescription");
    if (!formData.referralGoals) add("מטרות הפנייה", "referralGoals");
    if (!formData.onsetTime) add("מתי התחילו הקשיים", "onsetTime");
    if (!formData.hadAssessment) add("האם עבר אבחון בעבר", "hadAssessment");
    if (formData.hadAssessment === "כן") {
      const assessments = formData.assessments || [];
      if (assessments.length === 0) {
        add("פרטי האבחון שעבר", "assessments");
      } else {
        assessments.forEach((a, i) => {
          if (!a.type) add(`סוג האבחון ${i + 1} שעבר`, `assessments.${i}.type`);
          if (!a.date)
            add(`תאריך האבחון ${i + 1} שעבר`, `assessments.${i}.date`);
          if (!a.recommendations)
            add(`המלצות האבחון ${i + 1}`, `assessments.${i}.recommendations`);
        });
      }
    }
    if (!formData.paraMedicalTreatments)
      add("טיפולים פרא-רפואיים", "paraMedicalTreatments");
    if (!formData.expressedDistress)
      add("ביטוי מצוקה של הילד/ה", "expressedDistress");
    if (!formData.willingToConsult) add("נכונות להתייעץ", "willingToConsult");

    // --- שלב 3: מהלך הלימודים ---
    currentStep = 3;
    if (!formData.firstFrameworkAge)
      add("גיל יציאה למסגרת", "firstFrameworkAge");
    if (!formData.firstFrameworkType)
      add("סוג מסגרת ראשונה", "firstFrameworkType");
    if (!formData.prePreSchoolReports)
      add("דיווחים מגן טרום חובה", "prePreSchoolReports");
    if (!formData.preSchoolReports) add("דיווחים מגן חובה", "preSchoolReports");

    // --- שלב 4: הערכת תפקוד ---
    currentStep = 4;
    const func = formData.functioning;
    if (!func.studies) add("הערכת תפקוד בלימודים", "functioning.studies");
    if (!func.family) add("הערכת תפקוד במשפחה", "functioning.family");
    if (!func.social) add("הערכת תפקוד בחברה", "functioning.social");

    // --- שלב 5: פרטים על המשפחה ---
    currentStep = 5;
    const fam = formData.familyStructure;
    // וולידציה לאם
    if (!fam.motherNameInTable)
      add("שם האם בטבלת משפחה", "familyStructure.motherNameInTable");
    if (!fam.motherAge) add("גיל האם", "familyStructure.motherAge");
    if (!fam.motherJob) add("עיסוק האם", "familyStructure.motherJob");

    // וולידציה לאב
    if (!fam.fatherNameInTable)
      add("שם האב בטבלת משפחה", "familyStructure.fatherNameInTable");
    if (!fam.fatherAge) add("גיל האב", "familyStructure.fatherAge");
    if (!fam.fatherJob) add("עיסוק האב", "familyStructure.fatherJob");

    // --- שלב 6: בריאות ---
    currentStep = 6;
    if (!formData.generalHealth) add("מצב בריאות כללי", "generalHealth");
    if (!formData.pastDiseases) add("מחלות עבר", "pastDiseases");
    if (!formData.hospitalization) add("אשפוזים", "hospitalization");
    if (!formData.regularMedications)
      add("תרופות קבועות", "regularMedications");

    // --- שלב 7: רקע התפתחותי (שדות נסטד) ---
    currentStep = 7;
    const dev = formData.development;
    if (!dev.plannedPregnancy)
      add("האם ההריון היה מתוכנן", "development.plannedPregnancy");
    if (!dev.normalPregnancy)
      add("האם ההריון היה תקין", "development.normalPregnancy");
    if (!dev.pregnancyDetails)
      add("פרטי הריון", "development.pregnancyDetails");
    if (!dev.normalBirth)
      add("האם הלידה הייתה תקינה", "development.normalBirth");
    if (!dev.birthWeight) add("משקל לידה", "development.birthWeight");
    if (!dev.birthDetails) add("פרטי לידה", "development.birthDetails");
    if (!dev.problemsAfterBirthChild)
      add(
        "בעיות רפואיות לילד/ה לאחר הלידה",
        "development.problemsAfterBirthChild",
      );
    if (!dev.problemsAfterBirthMother)
      add(
        "בעיות רפואיות לאם לאחר הלידה",
        "development.problemsAfterBirthMother",
      );
    if (!dev.normalMotorDev)
      add("התפתחות מוטורית תקינה", "development.normalMotorDev");
    if (!dev.walkingAge) add("גיל הליכה", "development.walkingAge");
    if (!dev.normalLanguageDev)
      add("התפתחות שפתית תקינה", "development.normalLanguageDev");
    if (!dev.firstWordsAge)
      add("גיל דיבור מילים ראשונות", "development.firstWordsAge");
    if (!dev.sleepIssuesFirstYear)
      add("קשיי שינה שנה ראשונה", "development.sleepIssuesFirstYear");
    if (!dev.eatingIssuesFirstYear)
      add("קשיי אכילה שנה ראשונה", "development.eatingIssuesFirstYear");
    if (!dev.diaperGraduationAge)
      add("גיל גמילה מחיתולים", "development.diaperGraduationAge");

    // --- שלב 8: הילד/ה היום ---
    currentStep = 8;
    const curr = formData.currentProblems;
    if (!curr.foodSleepFearsDetails)
      add(
        "פירוט בעיות סביב אוכל/שינה/פחדים",
        "currentProblems.foodSleepFearsDetails",
      );
    if (!curr.restlessness)
      add("חוסר מנוחה/פעילות יתר", "currentProblems.restlessness");
    if (!curr.excitedEasily)
      add("התרגשות בקלות", "currentProblems.excitedEasily");
    if (!curr.disturbsOthers)
      add("הפרעה לאחרים", "currentProblems.disturbsOthers");
    if (!curr.difficultyCompletingTasks)
      add(
        "קושי בהתמדה וסיום משימות",
        "currentProblems.difficultyCompletingTasks",
      );
    if (!curr.needsSpecialAttention)
      add("צורך בתשומת לב מיוחדת", "currentProblems.needsSpecialAttention");
    if (!curr.dependencyVsIndependence)
      add("תלותיות מול עצמאות", "currentProblems.dependencyVsIndependence");
    if (!curr.closerToWho)
      add("למי הילד/ה קרוב/ה יותר", "currentProblems.closerToWho");

    // --- שלב 9: תפקוד חברתי ---
    currentStep = 9;
    const soc = formData.social;
    if (!soc.hasFriends) add("האם יש לילד/ה חברים", "social.hasFriends");
    if (!soc.socialLevel) add("רמת חברתיות", "social.socialLevel");
    if (!soc.meaningfulConnections)
      add("קשרים משמעותיים", "social.meaningfulConnections");
    if (!soc.oppositeSexConnections)
      add("קשרים עם בני המין השני", "social.oppositeSexConnections");
    if (!soc.socialProblemsDetails)
      add("פירוט בעיות חברתיות", "social.socialProblemsDetails");

    // --- שלב 10: סדר יום וחתימה ---
    currentStep = 10;
    if (!formData.parentsSignature) add("חתימת ההורים", "parentsSignature");
    if (!formData.signatureDate) add("תאריך חתימה", "signatureDate");

    return {
      isValid: missingFields.length === 0,
      missingFields,
      missingByStep,
      missingKeys,
    };
  };

  const validation = useMemo(() => validateAllSteps(), [formData]);
  const isMissing = (key) => showMissing && validation.missingKeys.has(key);
  const currentStepMissingCount = validation.missingByStep.filter(
    (m) => m.step === step,
  ).length;
  const missingStepsCount = new Set(validation.missingByStep.map((m) => m.step))
    .size;

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

      {showMissing &&
        (validation.missingKeys.size > 0 ? (
          <div
            className="bg-red-50 border border-red-300 rounded-xl p-4 mb-4"
            role="alert"
          >
            <p className="font-bold text-red-700">
              לא ניתן לשלוח עדיין: חסרים {validation.missingFields.length} שדות
              חובה ב-{missingStepsCount} עמודים
            </p>
            <p className="text-xs text-red-600 mt-1 mb-3">
              לחצו על עמוד אדום כדי לעבור אליו. השדות החסרים מסומנים בו באדום.
            </p>
            <div className="flex flex-wrap gap-2">
              {STEPS.map((stepLabel, idx) => {
                const stepNum = idx + 1;
                const countInStep = validation.missingByStep.filter(
                  (m) => m.step === stepNum,
                ).length;
                const isComplete = countInStep === 0;
                const isCurrent = stepNum === step;

                return (
                  <button
                    key={stepNum}
                    type="button"
                    onClick={() => setStep(stepNum)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                      isComplete
                        ? "bg-green-100 border-green-300 text-green-700"
                        : isCurrent
                          ? "bg-red-600 border-red-600 text-white"
                          : "border-red-400 text-red-700 hover:bg-red-100"
                    }`}
                  >
                    {stepNum}. {stepLabel}
                    {isComplete ? " ✓" : ` · ${countInStep}`}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-300 rounded-xl p-3 mb-4 text-green-700 text-sm">
            כל שדות החובה מולאו, אפשר לשלוח את השאלון.
          </div>
        ))}

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

      {showMissing && currentStepMissingCount > 0 && (
        <p className="text-sm text-red-700 mb-4">
          בעמוד זה חסרים {currentStepMissingCount} שדות. הם מסומנים באדום.
        </p>
      )}

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
