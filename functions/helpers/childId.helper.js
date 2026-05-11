const { db } = require("../config/firebase");

/**
 * יצירת מזהה ייחודי לילד בפורמט DLV-XXXX
 *
 * משתמש ב-Firestore Transaction על מסמך counter ייעודי
 * כדי למנוע race conditions (אם 2 ילדים נוצרים בו זמנית).
 *
 * הפורמט:
 * - מתחיל מ-DLV-1000
 * - 4 ספרות עד 9999, ואז 5+ ספרות אוטומטית
 * - דוגמה: DLV-1000, DLV-1001, ..., DLV-9999, DLV-10000
 */
const generateChildId = async () => {
  const counterRef = db.collection("counters").doc("children");

  const newId = await db.runTransaction(async (transaction) => {
    const counterDoc = await transaction.get(counterRef);

    let nextNumber;
    if (!counterDoc.exists) {
      // המסמך לא קיים - מתחילים מ-1000
      nextNumber = 1000;
      transaction.set(counterRef, {
        currentValue: nextNumber,
        updatedAt: new Date().toISOString(),
      });
    } else {
      const currentValue = counterDoc.data().currentValue || 999;
      nextNumber = currentValue + 1;
      transaction.update(counterRef, {
        currentValue: nextNumber,
        updatedAt: new Date().toISOString(),
      });
    }

    // ריפוד ב-0 לפחות 4 ספרות
    const padded = String(nextNumber).padStart(4, "0");
    return `DLV-${padded}`;
  });

  return newId;
};

module.exports = { generateChildId };
