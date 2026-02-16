import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

const ApproveUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    setLoading(true);
    const q = query(collection(db, "users"), where("status", "==", "pending"));
    const querySnapshot = await getDocs(q);
    setPendingUsers(
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await updateDoc(doc(db, "users", userId), { status: "approved" });
      alert("המשתמש אושר בהצלחה!");
      fetchPending();
    } catch (error) {
      alert("שגיאה באישור");
    }
  };

  const handleReject = async (userId) => {
    if (window.confirm("האם למחוק את בקשת ההרשמה?")) {
      try {
        await deleteDoc(doc(db, "users", userId));
        fetchPending();
      } catch (error) {
        alert("שגיאה בדחייה");
      }
    }
  };

  return (
    <div style={{ padding: "20px", direction: "rtl" }}>
      <h2>בקשות הצטרפות ממתינות</h2>
      {loading ? (
        <p>טוען...</p>
      ) : (
        <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={{ padding: "10px" }}>שם</th>
              <th>אימייל</th>
              <th>תפקיד מבוקש</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map((user) => (
              <tr key={user.id}>
                <td style={{ padding: "10px" }}>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>
                <td>{user.role === "patient" ? "הורה/לקוח" : "מאבחן"}</td>
                <td>
                  <button
                    onClick={() => handleApprove(user.id)}
                    style={{ color: "green" }}
                  >
                    אשר ✅
                  </button>
                  <button
                    onClick={() => handleReject(user.id)}
                    style={{ color: "red", marginRight: "10px" }}
                  >
                    דחה ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApproveUsers;
