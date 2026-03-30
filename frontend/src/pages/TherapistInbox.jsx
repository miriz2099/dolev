import React, { useState, useEffect } from "react";
import messageService from "../services/message.service";
import MessageCard from "../components/MessageCard";
import GenericMessageModal from "../components/GenericMessageModal";
import { useAuth } from "../contexts/AuthContext";

const TherapistInbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchMessages();
    }
  }, [currentUser]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      // קריאה לפונקציה החדשה בסרביס המאוחד
      const data = await messageService.getMyInbox(token);
      setMessages(data);
    } catch (err) {
      console.error("Error fetching inbox:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (msg) => {
    setSelectedMsg(msg);
    setIsModalOpen(true);
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("האם את בטוחה שברצונך למחוק את ההודעה?")) return;
    try {
      const token = await currentUser.getIdToken();
      await messageService.deleteMessage(messageId, token);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (err) {
      alert("מחיקת ההודעה נכשלה");
    }
  };

  const onSendReply = async (text) => {
    try {
      const token = await currentUser.getIdToken();
      const payload = {
        receiverId: selectedMsg.senderId, // השולח המקורי הופך למקבל
        childId: selectedMsg.childId,
        text: text,
      };
      await messageService.sendMessage(payload, token);
      alert("התשובה נשלחה בהצלחה");
      setIsModalOpen(false);
      fetchMessages();
    } catch (err) {
      alert("שגיאה בשליחה");
    }
  };
  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800">
            מרכז פניות והודעות
          </h2>
          <p className="text-gray-500 mt-2">
            כאן תוכלי לראות את כל ההודעות שנשלחו אלייך מהורים.
          </p>
        </header>

        {loading ? (
          <div className="text-center p-20 animate-pulse font-bold text-blue-600">
            טוען הודעות...
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white p-16 rounded-3xl text-center border-2 border-dashed border-gray-100 shadow-sm">
            <div className="text-5xl mb-4">📩</div>
            <p className="text-gray-500 text-lg">אין הודעות חדשות בתיבה.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {messages.map((msg) => (
              <MessageCard
                key={msg.id}
                msg={msg}
                onReply={handleReply}
                onDelete={handleDeleteMessage} // העברה נכונה של הפונקציה
              />
            ))}
          </div>
        )}

        <GenericMessageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSend={onSendReply}
          title={
            selectedMsg ? `מענה להורה של ${selectedMsg.childName}` : "השב להורה"
          }
        />
      </div>
    </div>
  );
};

export default TherapistInbox;
