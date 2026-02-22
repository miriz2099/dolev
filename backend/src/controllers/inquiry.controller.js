// // backend/src/controllers/inquiry.controller.js
// const { db } = require("../config/firebase");

// const updateOrDeleteInquiry = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const inquiryRef = db.collection("inquiries").doc(id);
//     const doc = await inquiryRef.get();

//     if (!doc.exists) {
//       return res.status(404).json({ error: "Inquiry not found" });
//     }

//     if (status === "completed") {
//       // האדמין סימן כ'הסתיים' -> מוחקים מהמערכת
//       await inquiryRef.delete();
//       return res.status(200).json({ message: "Inquiry completed and removed" });
//     }

//     // עדכון סטטוס רגיל (למשל ל-'in-progress')
//     await inquiryRef.update({ status });
//     res.status(200).json({ message: "Status updated successfully" });
//   } catch (error) {
//     console.error("Error in updateOrDeleteInquiry:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// module.exports = { updateOrDeleteInquiry };
// backend/src/controllers/inquiryController.js
const { db } = require("../config/firebase"); // ודאי שהנתיב ל-config נכון אצלך

const updateAndCheckInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const inquiryRef = db.collection("inquiries").doc(id);
    const docSnap = await inquiryRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Inquiry not found" });
    }

    if (status === "completed") {
      // אם סטטוס "הסתיים" - מוחקים את הפנייה
      await inquiryRef.delete();
      return res.status(200).json({ message: "Inquiry completed and deleted" });
    }

    // אחרת - רק מעדכנים סטטוס
    await inquiryRef.update({ status });
    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error in updateAndCheckInquiry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// הנה החלק הקריטי - הייצוא חייב להיות בדיוק כך:
module.exports = {
  updateAndCheckInquiry,
};
