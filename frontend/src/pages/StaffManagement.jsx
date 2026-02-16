import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  // deleteDoc,
  // doc,
} from "firebase/firestore";

// Components
import AddStaffForm from "../components/AddStaffForm";
import EditStaffForm from "../components/EditStaffForm";

// Services
import {
  createStaffMember,
  deleteStaffMember,
  updateStaffMember,
} from "../services/admin.service";

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // פונקציה למשיכת הנתונים
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "users"),
        where("role", "in", ["therapist", "admin"]),
      );
      const querySnapshot = await getDocs(q);
      const staffList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStaff(staffList);
    } catch (error) {
      console.error("Error fetching staff:", error);
      alert("שגיאה בטעינת נתוני הצוות");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // 1. פונקציית מחיקה דרך ה-Backend
  const handleDelete = async (userId) => {
    if (window.confirm("האם את בטוחה? המשתמש יימחק לצמיתות גם מה-Auth!")) {
      try {
        setLoading(true);
        await deleteStaffMember(userId);
        alert("המשתמש הוסר בהצלחה");
        fetchStaff();
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // 2. פונקציית הוספה דרך ה-Backend
  const handleAddStaff = async (newMemberData) => {
    try {
      setLoading(true);
      await createStaffMember(newMemberData);
      alert(`איש הצוות ${newMemberData.firstName} נוצר בהצלחה!`);
      setIsModalOpen(false);
      await fetchStaff();
    } catch (error) {
      alert(`שגיאה ביצירת משתמש: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 3. פונקציית עדכון דרך ה-Backend
  const handleUpdateStaff = async (updatedData) => {
    try {
      setLoading(true);
      await updateStaffMember(updatedData.id, updatedData);
      alert("הפרטים עודכנו בהצלחה!");
      setEditingMember(null);
      await fetchStaff();
    } catch (error) {
      alert(`שגיאה בעדכון: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && staff.length === 0)
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>טוען נתונים...</p>
    );

  return (
    <div style={{ padding: "20px", direction: "rtl" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>ניהול צוות מאבחנים ומנהלים</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
          }}
        >
          + הוספת איש צוות חדש
        </button>
      </header>

      {loading && (
        <p style={{ color: "blue", fontWeight: "bold" }}>מעבד בקשה...</p>
      )}

      {/* מודאל הוספה */}
      {isModalOpen && (
        <AddStaffForm
          onAdd={handleAddStaff}
          onCancel={() => setIsModalOpen(false)}
        />
      )}

      {/* מודאל עריכה */}
      {editingMember && (
        <EditStaffForm
          member={editingMember}
          onUpdate={handleUpdateStaff}
          onCancel={() => setEditingMember(null)}
        />
      )}

      <table
        border="1"
        style={{
          width: "100%",
          textAlign: "right",
          borderCollapse: "collapse",
          marginTop: "10px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ padding: "12px" }}>שם מלא</th>
            <th>אימייל</th>
            <th>טלפון</th>
            <th>תפקיד</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {staff.length > 0 ? (
            staff.map((member) => (
              <tr key={member.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "10px" }}>
                  {member.firstName} {member.lastName}
                </td>
                <td>{member.email}</td>
                <td>{member.phone}</td>
                <td>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      backgroundColor:
                        member.role === "admin" ? "#e1f5fe" : "#e8f5e9",
                      color: member.role === "admin" ? "#0288d1" : "#2e7d32",
                    }}
                  >
                    {member.role === "admin" ? "מנהל" : "מאבחן"}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => setEditingMember(member)} // פותח את המודאל עם נתוני המשתמש
                    style={{
                      padding: "5px 10px",
                      cursor: "pointer",
                      marginLeft: "5px",
                    }}
                  >
                    ערוך ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    style={{
                      padding: "5px 10px",
                      color: "red",
                      cursor: "pointer",
                    }}
                  >
                    מחק 🗑️
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                לא נמצאו אנשי צוות
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StaffManagement;
