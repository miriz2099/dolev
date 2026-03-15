import React, { useState, useEffect } from "react";

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

const TextAreaField = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-bold text-gray-700">{label}</label>
    <textarea
      rows={3}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
);

const ParentQuestionnaire = ({ childId, onSave, onCancel }) => {
  const [step, setStep] = useState(1);
  const [saveStatus, setSaveStatus] = useState("");

  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString("he-IL"),

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

    difficultyDescription: "",
    referralGoals: "",
    onsetTime: "",

    assessmentType: "",
    assessmentDate: "",
    assessmentRecommendations: "",
    paraMedicalTreatments: "",

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
    },

    currentProblems: {
      foodSleepFears: "",
      restlessness: "",
      excitedEasily: "",
      disturbsOthers: "",
      difficultyCompletingTasks: "",
      needsSpecialAttention: "",
      dependencyVsIndependence: "",
      otherBehavioral: "",
      closerToWho: "",
    },

    social: {
      hasFriends: "",
      socialLevel: "",
      meaningfulConnections: "",
      oppositeSexConnections: "",
      socialProblemsDetails: "",
    },

    education: {
      firstFrameworkAge: "",
      firstFrameworkType: "",
      prePreSchoolReports: "",
      preSchoolReports: "",
      stayedGrade: "",
      stayedGradeWhich: "",
      stayedGradeReason: "",
      schoolHistory: [
        { grade: "א-ג", school: "", city: "" },
        { grade: "ד-ו", school: "", city: "" },
        { grade: "ז-ט", school: "", city: "" },
      ],
    },

    functioning: {
      studies: "",
      family: "",
      social: "",
      notes: "",
    },

    familyStructure: {
      mother: { age: "", job: "", notes: "" },
      father: { age: "", job: "", notes: "" },
      siblings: [{ name: "", age: "", framework: "", notes: "" }],
    },

    dailyRoutine: [
      { time: "בוקר", activity: "" },
      { time: "צהריים", activity: "" },
      { time: 'אחה"צ', activity: "" },
      { time: "ערב", activity: "" },
    ],

    parentsSignature: "",
  });

  useEffect(() => {
    const savedDraft = localStorage.getItem(`draft_${childId}`);
    if (savedDraft) {
      setFormData(JSON.parse(savedDraft));
    }
  }, [childId]);

  const handleChange = (field, value, section = null) => {
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const saveDraft = () => {
    localStorage.setItem(`draft_${childId}`, JSON.stringify(formData));
    setSaveStatus("הטיוטה נשמרה");
    setTimeout(() => setSaveStatus(""), 2000);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-blue-800">פרטים אישיים</h3>

            <div className="grid grid-cols-3 gap-4">
              <InputField
                label="שם פרטי"
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
                label="מצב משפחתי"
                value={formData.familyStatus}
                onChange={(v) => handleChange("familyStatus", v)}
              />
            </div>

            <TextAreaField
              label="הערות למצב המשפחתי"
              value={formData.familyNotes}
              onChange={(v) => handleChange("familyNotes", v)}
            />

            <div className="grid grid-cols-3 gap-4">
              <InputField
                label="כתובת"
                value={formData.address}
                onChange={(v) => handleChange("address", v)}
              />
              <InputField
                label="טלפון"
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
                label="שפה בבית"
                value={formData.homeLanguage}
                onChange={(v) => handleChange("homeLanguage", v)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-blue-800">סיבת הפנייה</h3>

            <TextAreaField
              label="תיאור הקושי"
              value={formData.difficultyDescription}
              onChange={(v) => handleChange("difficultyDescription", v)}
            />
            <TextAreaField
              label="מטרות הפנייה"
              value={formData.referralGoals}
              onChange={(v) => handleChange("referralGoals", v)}
            />
            <InputField
              label="מתי התחילו הקשיים"
              value={formData.onsetTime}
              onChange={(v) => handleChange("onsetTime", v)}
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="איזה אבחון נעשה"
                value={formData.assessmentType}
                onChange={(v) => handleChange("assessmentType", v)}
              />
              <InputField
                label="תאריך האבחון"
                value={formData.assessmentDate}
                onChange={(v) => handleChange("assessmentDate", v)}
              />
            </div>

            <TextAreaField
              label="המלצות האבחון"
              value={formData.assessmentRecommendations}
              onChange={(v) => handleChange("assessmentRecommendations", v)}
            />
            <TextAreaField
              label="טיפולים פרא רפואיים"
              value={formData.paraMedicalTreatments}
              onChange={(v) => handleChange("paraMedicalTreatments", v)}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-blue-800">רקע התפתחותי</h3>

            <InputField
              label="הריון מתוכנן"
              value={formData.development.plannedPregnancy}
              onChange={(v) =>
                handleChange("plannedPregnancy", v, "development")
              }
            />
            <InputField
              label="הריון תקין"
              value={formData.development.normalPregnancy}
              onChange={(v) =>
                handleChange("normalPregnancy", v, "development")
              }
            />
            <TextAreaField
              label="פרט על ההריון"
              value={formData.development.pregnancyDetails}
              onChange={(v) =>
                handleChange("pregnancyDetails", v, "development")
              }
            />

            <InputField
              label="לידה תקינה"
              value={formData.development.normalBirth}
              onChange={(v) => handleChange("normalBirth", v, "development")}
            />
            <TextAreaField
              label="פרט על הלידה"
              value={formData.development.birthDetails}
              onChange={(v) => handleChange("birthDetails", v, "development")}
            />

            <InputField
              label="משקל לידה"
              value={formData.development.birthWeight}
              onChange={(v) => handleChange("birthWeight", v, "development")}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-blue-800">בריאות</h3>

            <TextAreaField
              label="מצב בריאות כללי"
              value={formData.development.generalHealth}
              onChange={(v) => handleChange("generalHealth", v, "development")}
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="בדיקת ראייה תאריך"
                value={formData.development.visionDate}
                onChange={(v) => handleChange("visionDate", v, "development")}
              />
              <InputField
                label="ממצאי ראייה"
                value={formData.development.visionFindings}
                onChange={(v) =>
                  handleChange("visionFindings", v, "development")
                }
              />

              <InputField
                label="בדיקת שמיעה תאריך"
                value={formData.development.hearingDate}
                onChange={(v) => handleChange("hearingDate", v, "development")}
              />
              <InputField
                label="ממצאי שמיעה"
                value={formData.development.hearingFindings}
                onChange={(v) =>
                  handleChange("hearingFindings", v, "development")
                }
              />
            </div>

            <TextAreaField
              label="מחלות בעבר"
              value={formData.development.pastDiseases}
              onChange={(v) => handleChange("pastDiseases", v, "development")}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-blue-800">מהלך הלימודים</h3>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="גיל יציאה למסגרת ראשונה"
                value={formData.education.firstFrameworkAge}
                onChange={(v) =>
                  handleChange("firstFrameworkAge", v, "education")
                }
              />
              <InputField
                label="איזו מסגרת"
                value={formData.education.firstFrameworkType}
                onChange={(v) =>
                  handleChange("firstFrameworkType", v, "education")
                }
              />
            </div>

            <TextAreaField
              label="דיווחים גן טרום חובה"
              value={formData.education.prePreSchoolReports}
              onChange={(v) =>
                handleChange("prePreSchoolReports", v, "education")
              }
            />
            <TextAreaField
              label="דיווחים גן חובה"
              value={formData.education.preSchoolReports}
              onChange={(v) => handleChange("preSchoolReports", v, "education")}
            />
          </div>
        );

      case 6:
        return (
          <div>
            <h3 className="text-xl font-bold text-blue-800">הערכת תפקוד</h3>
          </div>
        );

      case 7:
        return (
          <div>
            <h3 className="text-xl font-bold text-blue-800">פרטים על המשפחה</h3>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-blue-800">חתימה</h3>

            <InputField
              label="חתימת ההורים"
              value={formData.parentsSignature}
              onChange={(v) => handleChange("parentsSignature", v)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="bg-white max-w-5xl mx-auto rounded-2xl shadow-lg p-8"
      dir="rtl"
    >
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">שאלון להורים</h2>

        <button
          onClick={saveDraft}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          שמור טיוטה
        </button>
      </div>

      {saveStatus && <div className="text-green-600 text-sm">{saveStatus}</div>}

      {renderStep()}

      <div className="flex justify-between mt-10">
        <button
          onClick={step === 1 ? onCancel : () => setStep(step - 1)}
          className="text-gray-500"
        >
          {step === 1 ? "ביטול" : "הקודם"}
        </button>

        {step < 8 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            המשך
          </button>
        ) : (
          <button
            onClick={() => onSave(formData)}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            שלח שאלון
          </button>
        )}
      </div>
    </div>
  );
};

export default ParentQuestionnaire;
