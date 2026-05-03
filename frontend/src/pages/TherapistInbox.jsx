import React, { useState, useEffect } from "react";
import messageService from "../services/message.service";
import FullChatWindow from "../components/FullChatWindow";
import { useAuth } from "../contexts/AuthContext";

const TherapistInbox = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [selectedChildId, setSelectedChildId] = useState(null);

  useEffect(() => {
    if (currentUser) fetchConversations();
  }, [currentUser]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      // קריאה לסרוויס החדש שמחזיר שיחות מקובצות עם שמות ילדים
      // const data = await messageService.getTherapistConversations(token);
      const data = await messageService.getMyInbox(token);
      console.log("Raw conversations data:", data);

      const grouped = data.reduce((acc, current) => {
        if (!acc[current.childId]) acc[current.childId] = current;
        return acc;
      }, {});

      setConversations(Object.values(grouped));
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex h-screen bg-gray-50 font-sans overflow-hidden"
      dir="rtl"
    >
      {/* Sidebar - רשימת מטופלים */}
      <div
        className={`w-full md:w-1/3 border-l bg-white flex flex-col h-full ${selectedChildId ? "hidden md:flex" : "flex"}`}
      >
        <header className="p-6 border-b bg-white shrink-0">
          <h2 className="text-2xl font-bold text-gray-800">הודעות מהורים</h2>
          <p className="text-sm text-gray-500">שיחות פעילות לפי מטופלים</p>
        </header>

        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {loading ? (
            <div className="p-10 text-center text-blue-600 animate-pulse">
              טוען שיחות...
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              אין שיחות פעילות
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.childId}
                onClick={() => setSelectedChildId(conv.childId)}
                className={`p-5 border-b cursor-pointer hover:bg-gray-50 transition-all ${
                  selectedChildId === conv.childId
                    ? "bg-blue-50 border-r-4 border-r-blue-600"
                    : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-900 text-lg">
                    {/* כאן מוצג השם שחילצנו ב-Backend */}
                    {conv.childName || "מטופל ללא שם"}
                  </h4>
                  <span className="text-[10px] text-gray-400">
                    {new Date(conv.createdAt).toLocaleDateString("he-IL")}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate mt-1">
                  {conv.text}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Area - חלון הצ'אט */}
      <div
        className={`flex-1 flex flex-col bg-gray-100 h-full relative ${!selectedChildId ? "hidden md:flex items-center justify-center" : "flex"}`}
      >
        {selectedChildId ? (
          <div className="p-6 flex-1 flex flex-col overflow-hidden">
            <FullChatWindow
              childId={selectedChildId}
              onBack={() => {
                setSelectedChildId(null);
                fetchConversations();
              }}
            />
          </div>
        ) : (
          <div className="text-center animate-fadeIn opacity-40">
            <div className="text-8xl mb-6">💬</div>
            <h3 className="text-xl font-medium text-gray-600">
              בחרי שיחה מהרשימה
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistInbox;
