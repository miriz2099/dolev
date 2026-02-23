import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const API_URL = import.meta.env.VITE_API_URL;

const AddChildModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    birthDate: "",
    parentId: "",
    therapistId: "",
  });

  // States לרשימות שיגיעו מה-DB
  const [parents, setParents] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingLists, setLoadingLists] = useState(false);

  // שליפת הורים ומטפלים מה-Firestore
  useEffect(() => {
    if (isOpen) {
      const fetchLists = async () => {
        setLoadingLists(true);
        try {
          const usersRef = collection(db, "users");

          // שליפת כל המשתמשים
          const snapshot = await getDocs(usersRef);
          const allUsers = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // סינון לפי תפקידים (role)
          setParents(allUsers.filter((u) => u.role === "patient"));
          setTherapists(
            allUsers.filter(
              (u) => u.role === "therapist" || u.role === "admin",
            ),
          );
        } catch (error) {
          console.error("Error fetching users list:", error);
        } finally {
          setLoadingLists(false);
        }
      };
      fetchLists();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.parentId || !formData.therapistId) {
      alert("יש לבחור הורה ומטפל מהרשימה");
      return;
    }

    setIsSubmitting(true);
    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();

      const response = await fetch(
        `${API_URL}/children/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        alert("המטופל נוסף בהצלחה!");
        setFormData({
          firstName: "",
          lastName: "",
          idNumber: "",
          birthDate: "",
          parentId: "",
          therapistId: "",
        });
        onClose();
      } else {
        const errorData = await response.json();
        alert(`שגיאה: ${errorData.error}`);
      }
    } catch (error) {
      alert("שגיאה בחיבור לשרת");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-right"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative">
        <div className="bg-purple-600 p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">הוספת מטופל חדש (ילד)</h2>
          <button onClick={onClose} className="text-white text-3xl">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* פרטי הילד */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                שם פרטי הילד
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                שם משפחה הילד
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                ת.ז. ילד
              </label>
              <input
                type="text"
                maxLength="9"
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                value={formData.idNumber}
                onChange={(e) =>
                  setFormData({ ...formData, idNumber: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                תאריך לידה
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({ ...formData, birthDate: e.target.value })
                }
                required
              />
            </div>
          </div>

          <hr className="my-2" />

          {/* בחירת הורה מרשימה */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              בחירת הורה
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
              value={formData.parentId}
              onChange={(e) =>
                setFormData({ ...formData, parentId: e.target.value })
              }
              required
            >
              <option value="">-- בחרי הורה מהרשימה --</option>
              {parents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} ({p.phone})
                </option>
              ))}
            </select>
          </div>

          {/* בחירת מטפל מרשימה */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              בחירת מטפל
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
              value={formData.therapistId}
              onChange={(e) =>
                setFormData({ ...formData, therapistId: e.target.value })
              }
              required
            >
              <option value="">-- בחרי מטפל מהרשימה --</option>
              {therapists.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.firstName} {t.lastName}
                </option>
              ))}
            </select>
            {loadingLists && (
              <p className="text-xs text-blue-500 mt-1 italic">
                טוען רשימות...
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || loadingLists}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all mt-4 ${
              isSubmitting
                ? "bg-gray-400"
                : "bg-purple-600 hover:bg-purple-700 shadow-lg active:scale-95"
            }`}
          >
            {isSubmitting ? "שומר..." : "הוסף מטופל למערכת"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddChildModal;
