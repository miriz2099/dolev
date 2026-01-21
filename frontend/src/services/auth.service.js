// src/services/auth.service.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase.js"; // הייבוא מקובץ הקונפיגורציה שלך

/**
 * פונקציה להרשמת משתמש חדש
 * 1. יוצרת משתמש ב-Auth
 * 2. שומרת את פרטי המשתמש ב-Firestore
 */
export const registerUser = async (email, password, userData) => {
  try {
    // A. יצירת המשתמש במערכת האימות (Auth)
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // B. הכנת הנתונים לשמירה ב-DB
    // אנחנו משתמשים ב-UID בתור המפתח של המסמך!
    const userProfile = {
      uid: user.uid,
      email: user.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || "guest", // ברירת מחדל
      phone: userData.phone || "",
      createdAt: new Date().toISOString(),
    };

    // C. שמירה ב-Firestore באוסף 'users'
    await setDoc(doc(db, "users", user.uid), userProfile);

    console.log("User registered and profile created:", user.uid);
    return userProfile;
  } catch (error) {
    console.error("Error in registerUser:", error);
    throw error; // זורקים את השגיאה כדי שה-UI ידע להציג אותה
  }
};

/**
 * פונקציה להתחברות
 * מחזירה גם את המשתמש וגם את הפרופיל שלו מה-DB
 */
export const loginUser = async (email, password) => {
  try {
    // 1. ביצוע לוגין מול Auth
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // 2. משיכת הפרופיל המלא מה-DB (כדי לדעת מה ה-Role שלו)
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data(); // מחזיר את כל האובייקט עם השם והתפקיד
    } else {
      console.error("No such user profile in Firestore!");
      return { uid: user.uid, email: user.email }; // החזרה בסיסית במקרה חירום
    }
  } catch (error) {
    console.error("Error in loginUser:", error);
    throw error;
  }
};

/**
 * יציאה מהמערכת
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
