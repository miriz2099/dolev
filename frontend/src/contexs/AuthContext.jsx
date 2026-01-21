// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

// יצירת הקונטקסט (הערוץ)
const AuthContext = createContext();

// הוק מותאם אישית כדי שיהיה קל להשתמש במידע בכל קומפוננטה
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

// הספק (Provider) שעוטף את האפליקציה ומנהל את המידע
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // המשתמש של פיירבייס (auth)
  const [userProfile, setUserProfile] = useState(null); // המידע מהדאטה-בייס (role, name)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // מאזין קבוע לשינויים בסטטוס ההתחברות (פועל אוטומטית כשהמשתמש נכנס/יוצא)
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // 1. המשתמש מחובר - נשמור אותו
        setUser(currentUser);

        // 2. נמשוך את המידע הנוסף שלו (כמו תפקיד) מה-Firestore
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        // המשתמש התנתק
        setUser(null);
        setUserProfile(null);
      }

      setLoading(false); // סיימנו לטעון
    });

    return unsubscribe; // ניקוי הזיכרון כשהקומפוננטה יורדת
  }, []);

  const value = {
    user,
    userProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* אם עדיין טוען - תציג טקסט, אל תשאיר מסך לבן */}
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          טוען מערכת...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
