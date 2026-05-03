// // functions/controllers/diary.controller.js
// const { db } = require("../config/firebase");

// /**
//  * יצירת אירוע חדש ביומן (פגישה/זמינות/הערה)
//  */
// const createEvent = async (req, res) => {
//   try {
//     const { title, startTime, endTime, date, type, isRecurring, description } =
//       req.body;

//     // שליפת ה-UID של המאבחן/ת מהטוקן (שהMiddleware אימת)
//     const therapistId = req.user.uid;

//     if (!title || !date || !type) {
//       return res.status(400).json({
//         message: "נא למלא את כל שדות החובה / Please fill required fields",
//       });
//     }

//     const eventData = {
//       therapistId,
//       title,
//       start: `${date}T${startTime}`, // פורמט ISO בסיסי
//       end: `${date}T${endTime}`,
//       date,
//       type, // 'appointment' | 'availability' | 'note'
//       isRecurring: isRecurring || false,
//       description: description || "",
//       createdAt: new Date().toISOString(),
//     };

//     const docRef = await db.collection("diary_events").add(eventData);

//     res.status(201).json({
//       message: "האירוע נשמר בהצלחה",
//       id: docRef.id,
//     });
//   } catch (error) {
//     console.error("Error in createEvent:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// /**
//  * שליפת כל האירועים של המאבחן/ת המחובר/ת
//  */
// const getEvents = async (req, res) => {
//   try {
//     const therapistId = req.user.uid;

//     const snapshot = await db
//       .collection("diary_events")
//       .where("therapistId", "==", therapistId)
//       .get();

//     const events = [];
//     snapshot.forEach((doc) => {
//       events.push({ id: doc.id, ...doc.data() });
//     });

//     res.status(200).json(events);
//   } catch (error) {
//     console.error("Error in getEvents:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// module.exports = {
//   createEvent,
//   getEvents,
// };


// functions/controllers/diary.controller.js
const { db } = require("../config/firebase");

/**
 * Helper: בדיקת חפיפה בין שני טווחי זמן
 */
const hasOverlap = (start1, end1, start2, end2) => {
  return new Date(start1) < new Date(end2) && new Date(start2) < new Date(end1);
};

/**
 * Helper: בדיקת קונפליקטים מול אירועים קיימים
 * מחזיר את האירוע המתנגש אם נמצא, אחרת null
 */
const findConflict = async (therapistId, start, end, excludeId = null) => {
  // שולפים את כל האירועים של המאבחן ביום הזה (אופטימיזציה)
  const dayStart = new Date(start);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(start);
  dayEnd.setHours(23, 59, 59, 999);

  const snapshot = await db
    .collection("diary_events")
    .where("therapistId", "==", therapistId)
    .where("start", ">=", dayStart.toISOString())
    .where("start", "<=", dayEnd.toISOString())
    .get();

  for (const doc of snapshot.docs) {
    if (excludeId && doc.id === excludeId) continue;
    const data = doc.data();
    // הערות לא נחשבות לקונפליקט - הן רק תזכורות
    if (data.type === "note") continue;

    if (hasOverlap(start, end, data.start, data.end)) {
      return { id: doc.id, ...data };
    }
  }
  return null;
};

/**
 * יצירת אירוע יחיד (פגישה / זמינות / הערה)
 */
const createEvent = async (req, res) => {
  try {
    const therapistId = req.user.uid;
    const {
      title,
      start,
      end,
      type,
      description,
      isRecurring,
      childId,
    } = req.body;

    // ולידציה בסיסית
    if (!title || !start || !end || !type) {
      return res.status(400).json({
        error: "חסרים שדות חובה: title, start, end, type",
      });
    }

    if (new Date(end) <= new Date(start)) {
      return res.status(400).json({
        error: "שעת הסיום חייבת להיות אחרי שעת ההתחלה",
      });
    }

    // טיפול לפי סוג האירוע
    if (type === "appointment") {
      if (!childId) {
        return res.status(400).json({ error: "חובה לבחור ילד לאבחון" });
      }

      // וידוא שהילד באמת שייך למאבחן (אבטחה)
      const childDoc = await db.collection("children").doc(childId).get();
      if (!childDoc.exists || childDoc.data().therapistId !== therapistId) {
        return res.status(403).json({ error: "אין הרשאה לקבוע אבחון לילד זה" });
      }

      const childData = childDoc.data();

      // בדיקת קונפליקט
      const conflict = await findConflict(therapistId, start, end);
      if (conflict) {
        return res.status(409).json({
          error: "השעה תפוסה - יש כבר אירוע אחר בטווח הזה",
          conflict: { title: conflict.title, start: conflict.start, end: conflict.end },
        });
      }

      const eventData = {
        therapistId,
        type: "appointment",
        title,
        start,
        end,
        description: description || "",
        childId,
        childName: `${childData.firstName} ${childData.lastName}`,
        createdAt: new Date().toISOString(),
      };

      const docRef = await db.collection("diary_events").add(eventData);
      return res.status(201).json({ id: docRef.id, ...eventData });
    }

    if (type === "note") {
      // הערות לא בודקות קונפליקט
      const eventData = {
        therapistId,
        type: "note",
        title,
        start,
        end,
        description: description || "",
        createdAt: new Date().toISOString(),
      };

      const docRef = await db.collection("diary_events").add(eventData);
      return res.status(201).json({ id: docRef.id, ...eventData });
    }

    if (type === "availability") {
      // אם לא חוזר - אירוע יחיד
      if (!isRecurring) {
        const conflict = await findConflict(therapistId, start, end);
        if (conflict) {
          return res.status(409).json({
            error: "השעה תפוסה - יש כבר אירוע אחר בטווח הזה",
            conflict: { title: conflict.title, start: conflict.start, end: conflict.end },
          });
        }

        const eventData = {
          therapistId,
          type: "availability",
          title,
          start,
          end,
          description: description || "",
          isRecurring: false,
          createdAt: new Date().toISOString(),
        };
        const docRef = await db.collection("diary_events").add(eventData);
        return res.status(201).json({ id: docRef.id, ...eventData });
      }

      // אם חוזר - יוצרים סדרה של 8 הופעות (חודשיים = ~8 שבועות)
      const recurrenceGroupId = `rec_${Date.now()}_${therapistId.substring(0, 6)}`;
      const WEEKS_AHEAD = 8;
      const createdEvents = [];
      const conflicts = [];

      for (let i = 0; i < WEEKS_AHEAD; i++) {
        const occStart = new Date(start);
        occStart.setDate(occStart.getDate() + i * 7);
        const occEnd = new Date(end);
        occEnd.setDate(occEnd.getDate() + i * 7);

        const conflict = await findConflict(
          therapistId,
          occStart.toISOString(),
          occEnd.toISOString()
        );
        if (conflict) {
          conflicts.push({
            week: i + 1,
            date: occStart.toISOString(),
            conflictWith: conflict.title,
          });
        }
      }

      // אם יש קונפליקט באחת ההופעות - לא יוצרים שום דבר ומחזירים שגיאה
      if (conflicts.length > 0) {
        return res.status(409).json({
          error: `נמצאו קונפליקטים ב-${conflicts.length} שבועות - הסדרה לא נוצרה`,
          conflicts,
        });
      }

      // אין קונפליקטים - יוצרים את כל הסדרה ב-batch (יעיל יותר)
      const batch = db.batch();
      for (let i = 0; i < WEEKS_AHEAD; i++) {
        const occStart = new Date(start);
        occStart.setDate(occStart.getDate() + i * 7);
        const occEnd = new Date(end);
        occEnd.setDate(occEnd.getDate() + i * 7);

        const docRef = db.collection("diary_events").doc();
        const eventData = {
          therapistId,
          type: "availability",
          title,
          start: occStart.toISOString(),
          end: occEnd.toISOString(),
          description: description || "",
          isRecurring: true,
          recurrenceGroupId,
          createdAt: new Date().toISOString(),
        };
        batch.set(docRef, eventData);
        createdEvents.push({ id: docRef.id, ...eventData });
      }

      await batch.commit();
      return res.status(201).json({
        message: `נוצרה סדרה של ${WEEKS_AHEAD} זמינויות שבועיות`,
        events: createdEvents,
      });
    }

    return res.status(400).json({ error: "סוג אירוע לא חוקי" });
  } catch (error) {
    console.error("Error in createEvent:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * שליפת כל האירועים של המאבחן
 */
const getEvents = async (req, res) => {
  try {
    const therapistId = req.user.uid;
    const snapshot = await db
      .collection("diary_events")
      .where("therapistId", "==", therapistId)
      .get();

    const events = [];
    snapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(events);
  } catch (error) {
    console.error("Error in getEvents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * מחיקת אירוע (יחיד או סדרה שלמה)
 */
const deleteEvent = async (req, res) => {
  try {
    console.log("deleteEvent called with params:", req.params, "query:", req.query); 
    const therapistId = req.user.uid;
    const { eventId } = req.params;
    const { deleteSeries } = req.query; // ?deleteSeries=true

    const eventRef = db.collection("diary_events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ error: "אירוע לא נמצא" });
    }
    if (eventDoc.data().therapistId !== therapistId) {
      return res.status(403).json({ error: "אין הרשאה למחוק אירוע זה" });
    }

    // מחיקת סדרה שלמה
    if (deleteSeries === "true" && eventDoc.data().recurrenceGroupId) {
      const groupId = eventDoc.data().recurrenceGroupId;
      const seriesSnapshot = await db
        .collection("diary_events")
        .where("therapistId", "==", therapistId)
        .where("recurrenceGroupId", "==", groupId)
        .get();

      const batch = db.batch();
      seriesSnapshot.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();

      return res.status(200).json({
        message: `נמחקה סדרה של ${seriesSnapshot.size} אירועים`,
      });
    }

    // מחיקת אירוע יחיד
    await eventRef.delete();
    res.status(200).json({ message: "האירוע נמחק" });
  } catch (error) {
    console.log("deleteEvent called with params:", req.params, "query:", req.query); 
    console.error("Error in deleteEvent:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createEvent,
  getEvents,
  deleteEvent,
};
