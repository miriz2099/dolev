import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import therapistService from "../services/therapist.service";
import { useAuth } from "../contexts/AuthContext";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]); // מצב לרשימה המסוננת
  const [searchTerm, setSearchTerm] = useState(""); // מצב לטקסט החיפוש
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = await currentUser.getIdToken();
        const data = await therapistService.getMyPatients(token);
        setPatients(data);
        setFilteredPatients(data); // בהתחלה הרשימה המסוננת זהה לרשימה המלאה
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) fetchPatients();
  }, [currentUser]);

  // לוגיקת הסינון - רצה בכל פעם ש-searchTerm או patients משתנים
  useEffect(() => {
    const results = patients.filter(
      (patient) =>
        `${patient.firstName} ${patient.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        patient.idNumber.includes(searchTerm),
    );
    setFilteredPatients(results);
  }, [searchTerm, patients]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-blue-600 font-bold">
        טוען מטופלים...
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-right" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              ניהול מטופלים
            </h1>
            <p className="text-gray-600 mt-1">
              צפייה וניהול תהליכי אבחון עבור המטופלים שלך
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="חפש לפי שם או תעודת זהות..."
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Patients Grid */}
        {filteredPatients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => navigate(`/therapist/child/${patient.id}`)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 
                           hover:shadow-lg hover:border-blue-400 transition-all duration-300 cursor-pointer 
                           group flex flex-col justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl border border-blue-200">
                    {patient.firstName[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">
                      {patient.firstName} {patient.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 font-mono">
                      ת"ז: {patient.idNumber}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-gray-700">בטיפול</span>
                  </div>
                  <span className="text-blue-600 group-hover:translate-x-[-4px] transition-transform flex items-center gap-1">
                    צפה בתיק ←
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl shadow-sm text-center border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-lg italic">
              {searchTerm
                ? `לא נמצאו תוצאות עבור "${searchTerm}"`
                : "אין מטופלים רשומים תחת שמך."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;
