// // src/context/AuthContext.jsx
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "../firebase";

// // יצירת הקונטקסט (הערוץ)
// const AuthContext = createContext();

// // הוק מותאם אישית כדי שיהיה קל להשתמש במידע בכל קומפוננטה
// // eslint-disable-next-line react-refresh/only-export-components
// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// // הספק (Provider) שעוטף את האפליקציה ומנהל את המידע
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // המשתמש של פיירבייס (auth)
//   const [userProfile, setUserProfile] = useState(null); // המידע מהדאטה-בייס (role, name)
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // מאזין קבוע לשינויים בסטטוס ההתחברות (פועל אוטומטית כשהמשתמש נכנס/יוצא)
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         // 1. המשתמש מחובר - נשמור אותו
//         setUser(currentUser);

//         // 2. נמשוך את המידע הנוסף שלו (כמו תפקיד) מה-Firestore
//         try {
//           const docRef = doc(db, "users", currentUser.uid);
//           const docSnap = await getDoc(docRef);

//           if (docSnap.exists()) {
//             setUserProfile(docSnap.data());
//           }
//         } catch (error) {
//           console.error("Error fetching user profile:", error);
//         }
//       } else {
//         // המשתמש התנתק
//         setUser(null);
//         setUserProfile(null);
//       }

//       setLoading(false); // סיימנו לטעון
//     });

//     return unsubscribe; // ניקוי הזיכרון כשהקומפוננטה יורדת
//   }, []);

//   const value = {
//     currentUser: user, // שינינו מ-user ל-currentUser
//     userRole: userProfile?.role, // חילוץ ישיר של ה-role
//     userProfile, // כל שאר המידע (שם, טלפון וכו')
//     loading,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {/* אם עדיין טוען - תציג טקסט, אל תשאיר מסך לבן */}
//       {loading ? (
//         <div style={{ textAlign: "center", marginTop: "50px" }}>
//           טוען מערכת...
//         </div>
//       ) : (
//         children
//       )}
//     </AuthContext.Provider>
//   );
// };
// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
// 1. הוספת הייבואים החדשים מ-firebase/auth
import {
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword as firebaseUpdatePassword,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const updatePassword = async (oldPassword, newPassword) => {
    const currentUser = auth.currentUser;

    // בדיקה שהמשתמש קיים ויש לו מייל
    if (!currentUser || !currentUser.email) {
      throw new Error("משתמש לא מחובר או חסר כתובת אימייל");
    }

    try {
      // שימוש מפורש ב-currentUser.email כדי למנוע invalid-credential
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        oldPassword,
      );

      console.log("מנסה לבצע אימות מחדש עבור:", currentUser.email);

      await reauthenticateWithCredential(currentUser, credential);
      await firebaseUpdatePassword(currentUser, newPassword);

      return true;
    } catch (error) {
      console.error("Firebase Error Code:", error.code);
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password"
      ) {
        throw new Error("הסיסמה הנוכחית שהזנת אינה נכונה");
      }
      throw error;
    }
  };
  // 2. פונקציית שינוי סיסמה חדשה
  // const updatePassword = async (oldPassword, newPassword) => {
  //   const currentUser = auth.currentUser;
  //   if (!currentUser) throw new Error("לא נמצא משתמש מחובר");

  //   try {
  //     // א. יצירת ה-Credential (אישור) בעזרת המייל והסיסמה הישנה
  //     const credential = EmailAuthProvider.credential(
  //       currentUser.email,
  //       oldPassword,
  //     );

  //     // ב. ביצוע אימות מחדש - Firebase מוודא שהסיסמה הישנה נכונה
  //     await reauthenticateWithCredential(currentUser, credential);

  //     // ג. רק אם האימות הצליח - משנים את הסיסמה
  //     await firebaseUpdatePassword(currentUser, newPassword);

  //     return true;
  //   } catch (error) {
  //     console.error("Password update error:", error);
  //     // תרגום שגיאות נפוצות
  //     if (error.code === "auth/wrong-password") {
  //       throw new Error("הסיסמה הנוכחית אינה נכונה");
  //     }
  //     if (error.code === "auth/weak-password") {
  //       throw new Error("הסיסמה החדשה חלשה מדי (מינימום 6 תווים)");
  //     }
  //     throw error;
  //   }
  // };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
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
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser: user,
    userRole: userProfile?.role,
    userProfile,
    loading,
    updatePassword, // 3. הוספת הפונקציה ל-value כדי שנוכל לקרוא לה מהפרופיל
  };

  return (
    <AuthContext.Provider value={value}>
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
