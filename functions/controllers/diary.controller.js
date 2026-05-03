// functions/controllers/diary.controller.js
const { db } = require("../config/firebase");

/**
 * יצירת אירוע חדש ביומן (פגישה/זמינות/הערה)
 */
const createEvent = async (req, res) => {
  try {
    const { title, startTime, endTime, date, type, isRecurring, description } =
      req.body;

    // שליפת ה-UID של המאבחן/ת מהטוקן (שהMiddleware אימת)
    const therapistId = req.user.uid;

    if (!title || !date || !type) {
      return res.status(400).json({
        message: "נא למלא את כל שדות החובה / Please fill required fields",
      });
    }

    const eventData = {
      therapistId,
      title,
      start: `${date}T${startTime}`, // פורמט ISO בסיסי
      end: `${date}T${endTime}`,
      date,
      type, // 'appointment' | 'availability' | 'note'
      isRecurring: isRecurring || false,
      description: description || "",
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("diary_events").add(eventData);

    res.status(201).json({
      message: "האירוע נשמר בהצלחה",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Error in createEvent:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * שליפת כל האירועים של המאבחן/ת המחובר/ת
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

module.exports = {
  createEvent,
  getEvents,
};
