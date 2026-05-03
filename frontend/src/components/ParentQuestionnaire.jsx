import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import childService from "../services/child.service";

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
    assessmentFiles: [],
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
    const validation = validateAllSteps();

    if (!validation.isValid) {
      setSaveStatus(
        `לא ניתן לשלוח: חסרים שדות חובה (${validation.missingFields.join(", ")})`,
      );
      scrollToTop();
      return; // עוצר את השליחה
    }
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
                label="שם פרטי של הילד/ה *"
                value={formData.childFirstName}
                onChange={(v) => handleChange("childFirstName", v)}
              />
              <InputField
                label="שם משפחה *"
                value={formData.childLastName}
                onChange={(v) => handleChange("childLastName", v)}
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-gray-700">
                  מגדר *
                </label>
                <select
                  value={formData.gender || ""}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="">בחר/י מגדר</option>
                  <option value="בן">בן</option>
                  <option value="בת">בת</option>
                </select>
              </div>
              <InputField
                label="ת.ז *"
                value={formData.idNumber}
                onChange={(v) => handleChange("idNumber", v)}
              />
              <InputField
                label="תאריך לידה *"
                type="date"
                value={formData.birthDate}
                onChange={(v) => handleChange("birthDate", v)}
              />
              <InputField
                label="ארץ לידה *"
                value={formData.birthCountry}
                onChange={(v) => handleChange("birthCountry", v)}
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
              />
              <InputField
                label="שם האם *"
                value={formData.motherName}
                onChange={(v) => handleChange("motherName", v)}
              />
              <InputField
                label="מצב משפחתי (הורים) *"
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
                label="כתובת *"
                value={formData.address}
                onChange={(v) => handleChange("address", v)}
              />
              <InputField
                label="מספר טלפון *"
                value={formData.phone}
                onChange={(v) => handleChange("phone", v)}
              />
              <InputField
                label="בית ספר/גן *"
                value={formData.schoolOrGarden}
                onChange={(v) => handleChange("schoolOrGarden", v)}
              />
              <InputField
                label="כיתה *"
                value={formData.grade}
                onChange={(v) => handleChange("grade", v)}
              />
              <InputField
                label="שפה מדוברת בבית *"
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
              label="תיאור הקושי *"
              value={formData.difficultyDescription}
              onChange={(v) => handleChange("difficultyDescription", v)}
              rows={4}
            />
            <TextAreaField
              label="מטרות הפנייה *"
              value={formData.referralGoals}
              onChange={(v) => handleChange("referralGoals", v)}
              rows={4}
            />
            <InputField
              label="מתי התחילו הקשיים? *"
              value={formData.onsetTime}
              onChange={(v) => handleChange("onsetTime", v)}
            />

            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
              <p className="font-bold text-gray-700 text-sm">
                האם הילד/ה עבר/ה אבחון פסיכולוגי, או אחר (כגון: נוירולוגי / ר.
                בעיסוק / ק. תקשורת)? *
              </p>

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
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="איזה אבחון/ים *"
                      value={formData.assessmentType}
                      onChange={(v) => handleChange("assessmentType", v)}
                    />
                    <InputField
                      label="תאריך האבחון *"
                      type="date"
                      value={formData.assessmentDate}
                      onChange={(v) => handleChange("assessmentDate", v)}
                    />
                  </div>

                  <TextAreaField
                    label="מה היו המלצות האבחון/ים? *"
                    value={formData.assessmentRecommendations}
                    onChange={(v) =>
                      handleChange("assessmentRecommendations", v)
                    }
                  />

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
            />
            <InputField
              label="האם הילד/ה דיבר/ה על מצוקת חששות, חרדות, פחדים? *"
              value={formData.expressedDistress}
              onChange={(v) => handleChange("expressedDistress", v)}
            />
            <InputField
              label="האם הילד הביע רצון או נכונות להתייעץ עם איש מקצוע? *"
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
                label='באיזה גיל יצא/ה לראשונה למסגרת לימודית (מעון/גן/בי"ס)? *'
                value={formData.firstFrameworkAge}
                onChange={(v) => handleChange("firstFrameworkAge", v)}
              />
              <InputField
                label="לאיזו מסגרת? *"
                value={formData.firstFrameworkType}
                onChange={(v) => handleChange("firstFrameworkType", v)}
              />
            </div>
            <TextAreaField
              label="האם הילד/ה ביקר/ה בגן טרום חובה? אם כן מה היו הדיווחים על תפקודו/ה שם? *"
              value={formData.prePreSchoolReports}
              onChange={(v) => handleChange("prePreSchoolReports", v)}
            />
            <TextAreaField
              label="מה היו הדיווחים על התפקוד בגן-חובה? אם נשאר/ה שנה נוספת בגן חובה - מה הייתה הסיבה לכך? *"
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

            <p className="text-sm font-bold text-gray-700 mt-4">אחים\אחיות:</p>
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
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="בדיקת ראייה - תאריך *"
                value={formData.visionDate}
                onChange={(v) => handleChange("visionDate", v)}
              />
              <InputField
                label="ממצאים"
                value={formData.visionFindings}
                onChange={(v) => handleChange("visionFindings", v)}
              />
              <InputField
                label="בדיקת שמיעה - תאריך *"
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
              label="האם הילד/ה סובל או סבל בעבר ממחלה? *"
              value={formData.pastDiseases}
              onChange={(v) => handleChange("pastDiseases", v)}
            />
            <div className="grid grid-cols-3 gap-4">
              <InputField
                label="אשפוז? *"
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
              label="האם נוטל תרופות באופן קבוע? *"
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
                label="האם ההיריון היה/הייתה מתוכנן? (כן / לא) *"
                value={formData.development.plannedPregnancy}
                onChange={(v) =>
                  handleNested("development", "plannedPregnancy", v)
                }
              />
              <InputField
                label="האם ההיריון היה תקין? (כן / לא) *"
                value={formData.development.normalPregnancy}
                onChange={(v) =>
                  handleNested("development", "normalPregnancy", v)
                }
              />
            </div>
            <InputField
              label="פרט על ההיריון *"
              value={formData.development.pregnancyDetails}
              onChange={(v) =>
                handleNested("development", "pregnancyDetails", v)
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="האם הלידה הייתה תקינה? (כן / לא) *"
                value={formData.development.normalBirth}
                onChange={(v) => handleNested("development", "normalBirth", v)}
              />
              <InputField
                label="משקל הלידה *"
                value={formData.development.birthWeight}
                onChange={(v) => handleNested("development", "birthWeight", v)}
              />
            </div>
            <InputField
              label="פרט על הלידה *"
              value={formData.development.birthDetails}
              onChange={(v) => handleNested("development", "birthDetails", v)}
            />
            <InputField
              label="האם הופיעו בעיות רפואיות לאחר הלידה? *"
              value={formData.development.problemsAfterBirthChild}
              onChange={(v) =>
                handleNested("development", "problemsAfterBirthChild", v)
              }
            />
            <InputField
              label="האם האם סבלה מבעיות רפואיות לאחר הלידה? *"
              value={formData.development.problemsAfterBirthMother}
              onChange={(v) =>
                handleNested("development", "problemsAfterBirthMother", v)
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="האם ההתפתחות המוטורית (תנועתית) הייתה תקינה? *"
                value={formData.development.normalMotorDev}
                onChange={(v) =>
                  handleNested("development", "normalMotorDev", v)
                }
              />
              <InputField
                label="מתי התחיל/ה ללכת? *"
                value={formData.development.walkingAge}
                onChange={(v) => handleNested("development", "walkingAge", v)}
              />
              <InputField
                label="האם ההתפתחות השפתית הייתה תקינה? *"
                value={formData.development.normalLanguageDev}
                onChange={(v) =>
                  handleNested("development", "normalLanguageDev", v)
                }
              />
              <InputField
                label="מתי דיבר/ה לראשונה? *"
                value={formData.development.firstWordsAge}
                onChange={(v) =>
                  handleNested("development", "firstWordsAge", v)
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="האם היו קשיי שינה בשנה הראשונה? *"
                value={formData.development.sleepIssuesFirstYear}
                onChange={(v) =>
                  handleNested("development", "sleepIssuesFirstYear", v)
                }
              />
              <InputField
                label="האם היו קשיי אכילה בשנה הראשונה? *"
                value={formData.development.eatingIssuesFirstYear}
                onChange={(v) =>
                  handleNested("development", "eatingIssuesFirstYear", v)
                }
              />
            </div>
            <InputField
              label="באיזה גיל נגמל/ה מחיתולים? *"
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
              אחר? *
            </SubTitle>
            <TextAreaField
              label="אם כן, פרט/י:"
              value={formData.currentProblems.foodSleepFearsDetails}
              onChange={(v) =>
                handleNested("currentProblems", "foodSleepFearsDetails", v)
              }
            />
            <SubTitle>במסגרת הבית:</SubTitle>
            <div className="space-y-3">
              <InputField
                label="האם הילד/ה חסר מנוחה, נמצא בפעילות יתר? *"
                value={formData.currentProblems.restlessness}
                onChange={(v) =>
                  handleNested("currentProblems", "restlessness", v)
                }
              />
              <InputField
                label="מתרגש/ת בקלות? *"
                value={formData.currentProblems.excitedEasily}
                onChange={(v) =>
                  handleNested("currentProblems", "excitedEasily", v)
                }
              />
              <InputField
                label="מפריע/ה לאחרים? *"
                value={formData.currentProblems.disturbsOthers}
                onChange={(v) =>
                  handleNested("currentProblems", "disturbsOthers", v)
                }
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
              />
              <InputField
                label="האם זקוק/ה לתשומת לב רבה במיוחד? *"
                value={formData.currentProblems.needsSpecialAttention}
                onChange={(v) =>
                  handleNested("currentProblems", "needsSpecialAttention", v)
                }
              />
              <InputField
                label="תלותי/ת / עצמאי/ת? *"
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
                label="למי קרוב/ה יותר? לאם, לאב או אחר? *"
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
              label="האם יש לילדך/ילדתך חברים? *"
              value={formData.social.hasFriends}
              onChange={(v) => handleNested("social", "hasFriends", v)}
            />
            <InputField
              label="האם הוא/היא מאד חברותי/ת או שיש לו/לה מספר חברים מועט? *"
              value={formData.social.socialLevel}
              onChange={(v) => handleNested("social", "socialLevel", v)}
            />
            <InputField
              label="האם יש לו/לה קשרים חברתיים קרובים ומשמעותיים? *"
              value={formData.social.meaningfulConnections}
              onChange={(v) =>
                handleNested("social", "meaningfulConnections", v)
              }
            />
            <InputField
              label="האם יש לו/לה קשרים עם בני המין השני? *"
              value={formData.social.oppositeSexConnections}
              onChange={(v) =>
                handleNested("social", "oppositeSexConnections", v)
              }
            />
            <TextAreaField
              label="האם יש לו/לה בעיות חברתיות? פרט: *"
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
                label="תאריך *"
                value={formData.signatureDate}
                onChange={(v) => handleChange("signatureDate", v)}
              />
              <InputField
                label="חתימת ההורים *"
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

  const validateAllSteps = () => {
    const missingFields = [];

    // --- שלב 1: פרטים אישיים ---
    if (!formData.childFirstName) missingFields.push("שם פרטי של הילד/ה");
    if (!formData.childLastName) missingFields.push("שם משפחה");
    if (!formData.gender) missingFields.push("מגדר");
    if (!formData.idNumber) missingFields.push("ת.ז");
    if (!formData.birthDate) missingFields.push("תאריך לידה");
    if (!formData.birthCountry) missingFields.push("ארץ לידה");
    if (!formData.fatherName) missingFields.push("שם האב");
    if (!formData.motherName) missingFields.push("שם האם");
    if (!formData.familyStatus) missingFields.push("מצב משפחתי");
    if (!formData.address) missingFields.push("כתובת");
    if (!formData.phone) missingFields.push("מספר טלפון");
    if (!formData.schoolOrGarden) missingFields.push("בית ספר/גן");
    if (!formData.grade) missingFields.push("כיתה");
    if (!formData.homeLanguage) missingFields.push("שפה מדוברת בבית");

    // --- שלב 2: סיבת הפנייה ---
    if (!formData.difficultyDescription) missingFields.push("תיאור הקושי");
    if (!formData.referralGoals) missingFields.push("מטרות הפנייה");
    if (!formData.onsetTime) missingFields.push("מתי התחילו הקשיים");
    if (!formData.hadAssessment) missingFields.push("האם עבר אבחון בעבר");
    if (formData.hadAssessment === "כן") {
      if (!formData.assessmentType) missingFields.push("סוג האבחון שעבר");
      if (!formData.assessmentDate) missingFields.push("תאריך האבחון שעבר");
      if (!formData.assessmentRecommendations)
        missingFields.push("המלצות האבחון");
    }
    if (!formData.paraMedicalTreatments)
      missingFields.push("טיפולים פרא-רפואיים");
    if (!formData.expressedDistress)
      missingFields.push("ביטוי מצוקה של הילד/ה");
    if (!formData.willingToConsult) missingFields.push("נכונות להתייעץ");

    // --- שלב 3: מהלך הלימודים ---
    if (!formData.firstFrameworkAge) missingFields.push("גיל יציאה למסגרת");
    if (!formData.firstFrameworkType) missingFields.push("סוג מסגרת ראשונה");
    if (!formData.prePreSchoolReports)
      missingFields.push("דיווחים מגן טרום חובה");
    if (!formData.preSchoolReports) missingFields.push("דיווחים מגן חובה");

    // --- שלב 4: הערכת תפקוד ---
    const func = formData.functioning;
    if (!func.studies) missingFields.push("הערכת תפקוד בלימודים");
    if (!func.family) missingFields.push("הערכת תפקוד במשפחה");
    if (!func.social) missingFields.push("הערכת תפקוד בחברה");

    // --- שלב 5: פרטים על המשפחה ---
    const fam = formData.familyStructure;
    // וולידציה לאם
    if (!fam.motherNameInTable) missingFields.push("שם האם בטבלת משפחה");
    if (!fam.motherAge) missingFields.push("גיל האם");
    if (!fam.motherJob) missingFields.push("עיסוק האם");

    // וולידציה לאב
    if (!fam.fatherNameInTable) missingFields.push("שם האב בטבלת משפחה");
    if (!fam.fatherAge) missingFields.push("גיל האב");
    if (!fam.fatherJob) missingFields.push("עיסוק האב");

    // בדיקה אופציונלית: אם יש אחים ברשימה, לוודא שלפחות לראשון יש שם
    if (
      fam.siblings.length > 0 &&
      fam.siblings[0].name &&
      !fam.siblings[0].age
    ) {
      missingFields.push("גיל האח/אחות הראשון/ה");
    }

    // --- שלב 6: בריאות ---
    if (!formData.generalHealth) missingFields.push("מצב בריאות כללי");
    if (!formData.visionDate) missingFields.push("תאריך בדיקת ראייה");
    if (!formData.hearingDate) missingFields.push("תאריך בדיקת שמיעה");
    if (!formData.pastDiseases) missingFields.push("מחלות עבר");
    if (!formData.hospitalization) missingFields.push("אשפוזים");
    if (!formData.regularMedications) missingFields.push("תרופות קבועות");

    // --- שלב 7: רקע התפתחותי (שדות נסטד) ---
    const dev = formData.development;
    if (!dev.plannedPregnancy) missingFields.push("האם ההריון היה מתוכנן");
    if (!dev.normalPregnancy) missingFields.push("האם ההריון היה תקין");
    if (!dev.pregnancyDetails) missingFields.push("פרטי הריון");
    if (!dev.normalBirth) missingFields.push("האם הלידה הייתה תקינה");
    if (!dev.birthWeight) missingFields.push("משקל לידה");
    if (!dev.birthDetails) missingFields.push("פרטי לידה");
    if (!dev.problemsAfterBirthChild)
      missingFields.push("בעיות רפואיות לילד/ה לאחר הלידה");
    if (!dev.problemsAfterBirthMother)
      missingFields.push("בעיות רפואיות לאם לאחר הלידה");
    if (!dev.normalMotorDev) missingFields.push("התפתחות מוטורית תקינה");
    if (!dev.walkingAge) missingFields.push("גיל הליכה");
    if (!dev.normalLanguageDev) missingFields.push("התפתחות שפתית תקינה");
    if (!dev.firstWordsAge) missingFields.push("גיל דיבור מילים ראשונות");
    if (!dev.sleepIssuesFirstYear) missingFields.push("קשיי שינה שנה ראשונה");
    if (!dev.eatingIssuesFirstYear) missingFields.push("קשיי אכילה שנה ראשונה");
    if (!dev.diaperGraduationAge) missingFields.push("גיל גמילה מחיתולים");

    // --- שלב 8: הילד/ה היום ---
    const curr = formData.currentProblems;
    if (!curr.foodSleepFearsDetails)
      missingFields.push("פירוט בעיות סביב אוכל/שינה/פחדים");
    if (!curr.restlessness) missingFields.push("חוסר מנוחה/פעילות יתר");
    if (!curr.excitedEasily) missingFields.push("התרגשות בקלות");
    if (!curr.disturbsOthers) missingFields.push("הפרעה לאחרים");
    if (!curr.difficultyCompletingTasks)
      missingFields.push("קושי בהתמדה וסיום משימות");
    if (!curr.needsSpecialAttention)
      missingFields.push("צורך בתשומת לב מיוחדת");
    if (!curr.dependencyVsIndependence)
      missingFields.push("תלותיות מול עצמאות");
    if (!curr.closerToWho) missingFields.push("למי הילד/ה קרוב/ה יותר");

    // --- שלב 9: תפקוד חברתי ---
    const soc = formData.social;
    if (!soc.hasFriends) missingFields.push("האם יש לילד/ה חברים");
    if (!soc.socialLevel) missingFields.push("רמת חברתיות");
    if (!soc.meaningfulConnections) missingFields.push("קשרים משמעותיים");
    if (!soc.oppositeSexConnections)
      missingFields.push("קשרים עם בני המין השני");
    if (!soc.socialProblemsDetails) missingFields.push("פירוט בעיות חברתיות");

    // --- שלב 10: סדר יום וחתימה ---
    if (!formData.parentsSignature) missingFields.push("חתימת ההורים");
    if (!formData.signatureDate) missingFields.push("תאריך חתימה");

    return {
      isValid: missingFields.length === 0,
      missingFields: missingFields,
    };
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
