import { useEffect } from "react";

const DEFAULT_TITLE = "דולב – אבחונים פסיכודידקטיים";

/**
 * מעדכן את כותרת הטאב בדפדפן לפי תוכן העמוד הנוכחי, ומחזיר אותה לכותרת
 * הדיפולטיבית של האתר ביציאה מהעמוד, כדי שהכותרת הישנה לא "תידבק" לעמוד
 * הבא שאינו מגדיר כותרת משלו.
 * @param {string} [title] - חלק הכותרת הספציפי לעמוד (ללא שם האתר)
 */
const usePageTitle = (title) => {
  useEffect(() => {
    if (!title) return;
    document.title = `${title} | דולב`;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title]);
};

export default usePageTitle;
