import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import ChildrenGrid from "../components/ChildrenGrid"; // וודאי נתיב נכון

const API_URL = import.meta.env.VITE_API_URL;

const AllParentChildren = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchChildren = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);
        const idToken = await currentUser.getIdToken();

        const response = await fetch(`${API_URL}/children/myChildren`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`שגיאה בשרת: ${response.status}`);
        }

        const data = await response.json();
        setChildren(data);
      } catch (err) {
        console.error("Failed to fetch children:", err);
        setError("לא הצלחנו לטעון את נתוני הילדים.");
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [currentUser]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen" dir="rtl">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-gray-800">הילדים שלי</h1>
        <p className="text-gray-500 mt-2">רשימת הילדים הרשומים תחת חשבונך</p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center p-10 text-red-500 font-bold">{error}</div>
      ) : (
        <ChildrenGrid children={children} />
      )}
    </div>
  );
};

export default AllParentChildren;
