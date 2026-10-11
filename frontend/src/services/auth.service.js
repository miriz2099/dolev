// src/services/auth.service.js
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase.js"; // הייבוא מקובץ הקונפיגורציה שלך

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
