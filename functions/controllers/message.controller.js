// functions/controllers/message.controller.js
const { db } = require("../config/firebase");

const sendMessage = async (req, res) => {
  try {
    const { receiverId, childId, text } = req.body;
    const senderId = req.user.uid;

    if (!text || !receiverId || !childId) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const messageData = {
      senderId,
      receiverId,
      childId,
      text,

      createdAt: new Date().toISOString(),
      read: false,
    };

    const docRef = await db.collection("messages").add(messageData);
    res.status(201).json({ id: docRef.id, ...messageData });
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
};

const getMyMessagesForChild = async (req, res) => {
  try {
    const { childId } = req.params;
    const myId = req.user.uid;

    // Query 1: הודעות שאני שלחתי בקשר לילד הזה
    const sentSnapshot = await db
      .collection("messages")
      .where("childId", "==", childId)
      .where("senderId", "==", myId)
      .get();

    // Query 2: הודעות שקיבלתי בקשר לילד הזה
    const receivedSnapshot = await db
      .collection("messages")
      .where("childId", "==", childId)
      .where("receiverId", "==", myId)
      .get();

    // מיזוג שתי התוצאות
    const messagesMap = new Map();

    sentSnapshot.forEach((doc) => {
      messagesMap.set(doc.id, { id: doc.id, ...doc.data() });
    });

    receivedSnapshot.forEach((doc) => {
      messagesMap.set(doc.id, { id: doc.id, ...doc.data() });
    });

    // המרה למערך + מיון לפי תאריך עולה (הישנות למעלה, החדשות למטה - כמו WhatsApp)
    const messages = Array.from(messagesMap.values()).sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// מחיקת הודעה (רק אם אני הנמען)
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const myId = req.user.uid;

    const msgRef = db.collection("messages").doc(messageId);
    const doc = await msgRef.get();

    if (!doc.exists)
      return res.status(404).json({ error: "Message not found" });
    if (doc.data().receiverId !== myId && doc.data().senderId !== myId)
      return res.status(403).json({ error: "Unauthorized" });

    await msgRef.delete();
    res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
};

const markMessagesAsRead = async (req, res) => {
  try {
    const { childId } = req.params;
    const myId = req.user.uid;

    const batch = db.batch();
    const messagesSnapshot = await db
      .collection("messages")
      .where("childId", "==", childId)
      .where("receiverId", "==", myId)
      .where("read", "==", false)
      .get();

    messagesSnapshot.forEach((doc) => {
      batch.update(doc.ref, { read: true });
    });

    await batch.commit();
    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update messages status" });
  }
};

// functions/controllers/message.controller.js

const getMyInbox = async (req, res) => {
  try {
    const myId = req.user.uid; // ה-ID של המאבחנת מהטוקן

    // 1. שליפת כל ההודעות שקשורות למאבחנת (או כשולחת או כנמענת)
    // אנחנו שולפים את ההודעות וממיינים לפי תאריך יורד כדי לקבל את האחרונות קודם
    const snapshot = await db
      .collection("messages")
      .orderBy("createdAt", "desc")
      .get();

    const conversationsMap = {};

    snapshot.forEach((doc) => {
      const data = doc.data();

      // סינון: האם אני צד בשיחה הזו?
      if (data.senderId === myId || data.receiverId === myId) {
        // קיבוץ לפי childId: רק ההודעה האחרונה מכל שיחה תיכנס ל-Map
        if (!conversationsMap[data.childId]) {
          conversationsMap[data.childId] = {
            id: doc.id,
            ...data,
            // מונה הודעות שלא נקראו (רק אם אני הנמען והן מסומנות כ-false)
            unreadCount:
              data.read === false && data.receiverId === myId ? 1 : 0,
          };
        } else {
          // אם כבר קיימת הודעה (חדשה יותר), רק נעדכן את מונה ה-unread
          if (data.read === false && data.receiverId === myId) {
            conversationsMap[data.childId].unreadCount++;
          }
        }
      }
    });

    const conversations = Object.values(conversationsMap);

    // 2. הבאת שמות הילדים (Manual Join)
    const results = await Promise.all(
      conversations.map(async (conv) => {
        const childDoc = await db
          .collection("children")
          .doc(conv.childId)
          .get();
        const childData = childDoc.exists ? childDoc.data() : null;
        return {
          ...conv,
          childName: childData
            ? `${childData.firstName} ${childData.lastName}`
            : "מטופל לא נמצא",
        };
      }),
    );

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};
// const getMyInbox = async (req, res) => {
//   try {
//     const therapistId = req.user.uid; // המזהה של המאבחן מהטוקן

//     // 1. שליפת הודעות שנשלחו למאבחן, ממוינות לפי תאריך
//     const snapshot = await db
//       .collection("messages")
//       .where("receiverId", "==", therapistId)
//       .orderBy("createdAt", "desc")
//       .get();

//     if (snapshot.empty) {
//       return res.status(200).json([]);
//     }

//     const messages = [];

//     // 2. לולאה להבאת נתוני הילדים (JOIN ידני)
//     // אנחנו משתמשים ב-Promise.all כדי שזה ירוץ מהר במקביל
//     const messagePromises = snapshot.docs.map(async (doc) => {
//       const msgData = doc.data();
//       let childName = "ילד לא נמצא";

//       if (msgData.childId) {
//         const childDoc = await db
//           .collection("children")
//           .doc(msgData.childId)
//           .get();
//         if (childDoc.exists) {
//           const childData = childDoc.data();
//           childName = `${childData.firstName} ${childData.lastName}`;
//         }
//       }

//       return {
//         id: doc.id,
//         ...msgData,
//         childName, // מוסיפים את השם ששלפנו
//       };
//     });

//     const results = await Promise.all(messagePromises);
//     res.status(200).json(results);
//   } catch (error) {
//     console.error("Error fetching inbox:", error);
//     res.status(500).json({ error: "נכשלה שליפת תיבת ההודעות" });
//   }
// };

module.exports = {
  sendMessage,
  getMyMessagesForChild,
  deleteMessage,
  markMessagesAsRead,
  getMyInbox,
};
