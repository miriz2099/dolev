// frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 1. הגדרת המשתנים מתוך קובץ ה-.env שלנו
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// 2. אתחול האפליקציה
const app = initializeApp(firebaseConfig);

// 3. ייצוא השירותים לשימוש בכל הפרויקט
export const auth = getAuth(app); // לניהול משתמשים
export const db = getFirestore(app); // למסד הנתונים
export const storage = getStorage(app); // לשמירת קבצים

export default app;
