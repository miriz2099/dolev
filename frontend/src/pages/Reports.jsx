import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import therapistService from "../services/therapist.service";
import reportService from "../services/report.service";
import ReportForm from "../components/ReportForm";

const Reports = () => {
  const { currentUser } = useAuth();

  // שלב 1: בחירת ילד
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingPatients, setLoadingPatients] = useState(true);

  // שלב 2: רשימת דוחות של הילד
  const [selectedChild, setSelectedChild] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [loadingDiagnoses, setLoadingDiagnoses] = useState(false);

  // שלב 3: כתיבת/עריכת דוח
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);

  // טעינת רשימת מטופלים
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const token = await currentUser.getIdToken();
        const data = await therapistService.getMyPatients(token);
        setPatients(data);
      } catch (err) {
        console.error("Error loading patients:", err);
      } finally {
        setLoadingPatients(false);
      }
    };
    if (currentUser) loadPatients();
  }, [currentUser]);

  // טעינת אבחונים של ילד נבחר
  const loadDiagnoses = async (child) => {
    setSelectedChild(child);
    setSelectedDiagnosis(null);
    try {
      setLoadingDiagnoses(true);
      const token = await currentUser.getIdToken();
      const data = await therapistService.getDiagnoses(child.id, token);
      setDiagnoses(data);
    } catch (err) {
      console.error("Error loading diagnoses:", err);
    } finally {
      setLoadingDiagnoses(false);
    }
  };

  // סינון לפי חיפוש
  const filteredPatients = patients.filter((p) => {
    const fullName = `${p.firstName} ${p.lastName}`;
    return fullName.includes(searchTerm) || p.idNumber?.includes(searchTerm);
  });

  // ===== תצוגת כתיבת דוח =====
  if (selectedDiagnosis) {
    return (
      <div className="p-8 bg-[#F8FAFC] min-h-screen" dir="rtl">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => setSelectedDiagnosis(null)}
            className="text-gray-400 hover:text-blue-600 font-medium flex items-center gap-2 mb-6"
          >
            <span className="text-xl">→</span> חזרה לרשימת אבחונים של{" "}
            {selectedChild.firstName}
          </button>
          <ReportForm
            diagnosisId={selectedDiagnosis.id}
            childData={selectedChild}
            onClose={() => setSelectedDiagnosis(null)}
          />
        </div>
      </div>
    );
  }

  // ===== תצוגת אבחונים של ילד נבחר =====
  if (selectedChild) {
    return (
      <div className="p-8 bg-[#F8FAFC] min-h-screen" dir="rtl">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => {
              setSelectedChild(null);
              setDiagnoses([]);
            }}
            className="text-gray-400 hover:text-blue-600 font-medium flex items-center gap-2 mb-6"
          >
            <span className="text-xl">→</span> חזרה לבחירת ילד
          </button>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              דוחות — {selectedChild.firstName} {selectedChild.lastName}
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              בחרי אבחון כדי לכתוב או לצפות בדוח
            </p>

            {loadingDiagnoses ? (
              <p className="text-center py-10 text-gray-400">טוען אבחונים...</p>
            ) : diagnoses.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">📋</p>
                <p className="text-gray-400 text-lg">
                  אין אבחונים עבור ילד/ה זה
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {diagnoses.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDiagnosis(d)}
                    className="flex justify-between items-center p-5 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition text-right"
                  >
                    <div>
                      <p className="font-bold text-gray-800 text-lg">
                        אבחון מתאריך{" "}
                        {new Date(d.createdAt).toLocaleDateString("he-IL")}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        סטטוס: {d.status || "פעיל"}
                      </p>
                    </div>
                    <span className="text-blue-600 font-bold text-sm">
                      פתיחת דוח ←
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== תצוגת בחירת ילד =====
  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">דוחות</h2>
          <p className="text-gray-400 text-sm mb-6">
            בחרי ילד/ה כדי לצפות בדוחות שלו
          </p>

          {/* חיפוש */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="חפש/י לפי שם או מספר מזהה..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 pr-10 focus:ring-2 focus:ring-blue-500 outline-none text-right"
            />
            <span className="absolute left-3 top-3.5 text-gray-300">🔍</span>
          </div>

          {/* רשימת מטופלים */}
          {loadingPatients ? (
            <p className="text-center py-10 text-gray-400">טוען מטופלים...</p>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">👶</p>
              <p className="text-gray-400 text-lg">
                {searchTerm ? "לא נמצאו תוצאות" : "אין מטופלים רשומים"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredPatients.map((child) => (
                <button
                  key={child.id}
                  onClick={() => loadDiagnoses(child)}
                  className="flex justify-between items-center p-4 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition text-right"
                >
                  <div>
                    <p className="font-bold text-gray-800">
                      {child.firstName} {child.lastName}
                    </p>
                    <p className="text-sm text-gray-400">
                      מזהה: {child.idNumber}
                    </p>
                  </div>
                  <span className="text-blue-600">←</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;