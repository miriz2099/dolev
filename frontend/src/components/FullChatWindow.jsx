// // import React, { useState, useEffect, useRef } from "react";
// // import messageService from "../services/message.service";
// // import { useAuth } from "../contexts/AuthContext";

// // const FullChatWindow = ({ childId, onBack }) => {
// //   const [messages, setMessages] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [inputText, setInputText] = useState("");
// //   const { currentUser } = useAuth();
// //   const messagesEndRef = useRef(null);

// //   const scrollToBottom = () => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   };

// //   useEffect(() => {
// //     fetchChatHistory();
// //     markAsRead();
// //   }, [childId]);

// //   useEffect(scrollToBottom, [messages]);

// //   const fetchChatHistory = async () => {
// //     try {
// //       setLoading(true);
// //       const token = await currentUser.getIdToken();
// //       const data = await messageService.getChildMessages(childId, token);
// //       setMessages(data);
// //     } catch (err) {
// //       console.error("Error fetching chat:", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const markAsRead = async () => {
// //     try {
// //       const token = await currentUser.getIdToken();
// //       await messageService.markMessagesAsRead(childId, token);
// //     } catch (err) {
// //       console.error("Failed to mark as read", err);
// //     }
// //   };
// //   const handleDeleteMessage = async (messageId) => {
// //     if (!window.confirm("האם למחוק את ההודעה לצמיתות?")) return;

// //     try {
// //       const token = await currentUser.getIdToken();
// //       // קריאה לסרוויס הקיים
// //       await messageService.deleteMessage(messageId, token);

// //       // עדכון הסטייט המקומי כדי שההודעה תיעלם מיד
// //       setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
// //     } catch (err) {
// //       console.error("Failed to delete message:", err);
// //       alert("שגיאה במחיקת ההודעה");
// //     }
// //   };

// //   const handleSend = async (e) => {
// //     e.preventDefault();
// //     if (!inputText.trim()) return;

// //     const textToSend = inputText;
// //     setInputText("");

// //     const tempMsg = {
// //       id: Date.now(),
// //       text: textToSend,
// //       senderId: currentUser.uid,
// //       createdAt: new Date().toISOString(),
// //       sending: true,
// //     };
// //     setMessages((prev) => [...prev, tempMsg]);

// //     try {
// //       const token = await currentUser.getIdToken();
// //       const receiverId = messages.find(
// //         (m) => m.senderId !== currentUser.uid,
// //       )?.senderId;

// //       await messageService.sendMessage(
// //         {
// //           childId,
// //           text: textToSend,
// //           receiverId: receiverId,
// //         },
// //         token,
// //       );

// //       fetchChatHistory();
// //     } catch (err) {
// //       alert("שגיאה בשליחת ההודעה");
// //       setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
// //     }
// //   };

// //   return (
// //     /* שינוי 1: הוספת rounded-3xl למסגרת החיצונית ו-overflow-hidden כדי שהפינות יהיו עגולות באמת */
// //     <div className="flex flex-col h-full bg-white shadow-lg border border-gray-200 rounded-3xl overflow-hidden">
// //       {/* Header */}
// //       <div className="p-4 border-b flex justify-between h-[60px] items-center bg-gray-50">
// //         <button onClick={onBack} className="md:hidden text-blue-600 font-bold">
// //           חזור
// //         </button>
// //         <h3 className="text-lg font-bold text-gray-800">שיחה מלאה</h3>
// //         <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
// //           {childId.substring(0, 2).toUpperCase()}
// //         </div>
// //       </div>

// //       {/* Messages Area */}
// //       {/* שינוי 2: החלפת bg-[#f0f2f5] ב-bg-white (רקע לבן) והסרת ה-h-[100px] המיותרת */}
// //       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
// //         {loading ? (
// //           <p className="text-center text-gray-400">טוען היסטוריה...</p>
// //         ) : (
// //           messages.map((msg) => {
// //             const isMe = msg.senderId === currentUser.uid;
// //             return (
// //               <div
// //                 key={msg.id}
// //                 className={`flex ${isMe ? "justify-start" : "justify-end"}`}
// //               >
// //                 <div
// //                   className={`max-w-[70%] p-3 rounded-xl shadow-sm ${
// //                     isMe
// //                       ? "bg-blue-600 text-white rounded-br-none"
// //                       : "bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200"
// //                   }`}
// //                 >
// //                   <p className="text-sm">{msg.text}</p>
// //                   <span
// //                     className={`text-[10px] block mt-1 ${isMe ? "text-blue-100" : "text-gray-400"}`}
// //                   >
// //                     {new Date(msg.createdAt).toLocaleTimeString("he-IL", {
// //                       hour: "2-digit",
// //                       minute: "2-digit",
// //                     })}
// //                   </span>
// //                 </div>
// //               </div>
// //             );
// //           })
// //         )}
// //         <div ref={messagesEndRef} />
// //       </div>

// //       {/* Input Area */}
// //       <div className="p-4 bg-gray-50 border-t">
// //         <form onSubmit={handleSend} className="flex gap-2">
// //           <input
// //             value={inputText}
// //             onChange={(e) => setInputText(e.target.value)}
// //             placeholder="הקלידו תשובה..."
// //             className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
// //           />
// //           <button
// //             type="submit"
// //             className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shrink-0"
// //           >
// //             <svg
// //               xmlns="http://www.w3.org/2000/svg"
// //               className="h-6 w-6 transform rotate-180"
// //               fill="none"
// //               viewBox="0 0 24 24"
// //               stroke="currentColor"
// //             >
// //               <path
// //                 strokeLinecap="round"
// //                 strokeLinejoin="round"
// //                 strokeWidth={2}
// //                 d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
// //               />
// //             </svg>
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default FullChatWindow;

// // // import React, { useState, useEffect, useRef } from "react";
// // // import messageService from "../services/message.service";
// // // import { useAuth } from "../contexts/AuthContext";

// // // const FullChatWindow = ({ childId, onBack }) => {
// // //   const [messages, setMessages] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [inputText, setInputText] = useState("");
// // //   const { currentUser } = useAuth();
// // //   const messagesEndRef = useRef(null);

// // //   const scrollToBottom = () => {
// // //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// // //   };

// // //   useEffect(() => {
// // //     if (childId) {
// // //       fetchChatHistory();
// // //       markAsRead();
// // //     }
// // //   }, [childId]);

// // //   useEffect(scrollToBottom, [messages]);

// // //   const fetchChatHistory = async () => {
// // //     try {
// // //       setLoading(true);
// // //       const token = await currentUser.getIdToken();
// // //       const data = await messageService.getChildMessages(childId, token);
// // //       setMessages(data);
// // //     } catch (err) {
// // //       console.error("Error fetching chat:", err);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const markAsRead = async () => {
// // //     try {
// // //       const token = await currentUser.getIdToken();
// // //       await messageService.markMessagesAsRead(childId, token);
// // //     } catch (err) {
// // //       console.error("Failed to mark as read", err);
// // //     }
// // //   };

// // //   const handleDeleteMessage = async (messageId) => {
// // //     if (!window.confirm("האם למחוק את ההודעה לצמיתות?")) return;

// // //     try {
// // //       const token = await currentUser.getIdToken();
// // //       await messageService.deleteMessage(messageId, token);
// // //       setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
// // //     } catch (err) {
// // //       console.error("Failed to delete message:", err);
// // //       alert("שגיאה במחיקת ההודעה");
// // //     }
// // //   };

// // //   const handleSend = async (e) => {
// // //     e.preventDefault();
// // //     if (!inputText.trim()) return;

// // //     const textToSend = inputText;
// // //     setInputText("");

// // //     const tempMsg = {
// // //       id: "temp-" + Date.now(),
// // //       text: textToSend,
// // //       senderId: currentUser.uid,
// // //       createdAt: new Date().toISOString(),
// // //       sending: true,
// // //     };
// // //     setMessages((prev) => [...prev, tempMsg]);

// // //     try {
// // //       const token = await currentUser.getIdToken();
// // //       const receiverId = messages.find(
// // //         (m) => m.senderId !== currentUser.uid,
// // //       )?.senderId;

// // //       await messageService.sendMessage(
// // //         {
// // //           childId,
// // //           text: textToSend,
// // //           receiverId: receiverId,
// // //         },
// // //         token,
// // //       );
// // //       fetchChatHistory();
// // //     } catch (err) {
// // //       alert("שגיאה בשליחה");
// // //       setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
// // //     }
// // //   };

// // //   return (
// // //     <div className="flex flex-col h-full bg-white shadow-lg border border-gray-200 rounded-3xl overflow-hidden">
// // //       {/* Header */}
// // //       <div className="p-4 border-b flex justify-between h-[60px] items-center bg-gray-50 shrink-0">
// // //         <button onClick={onBack} className="md:hidden text-blue-600 font-bold">
// // //           חזור
// // //         </button>
// // //         <h3 className="text-lg font-bold text-gray-800">שיחה מלאה</h3>
// // //         {/* <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
// // //           {childId.substring(0, 2).toUpperCase()}
// // //         </div> */}
// // //       </div>
// // //       Messages Area
// // //       <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white custom-scrollbar">
// // //         {loading ? (
// // //           <p className="text-center text-gray-400">טוען היסטוריה...</p>
// // //         ) : (
// // //           messages.map((msg) => {
// // //             const isMe = msg.senderId === currentUser.uid;
// // //             return (
// // //               <div
// // //                 key={msg.id}
// // //                 className={`flex w-full group relative ${isMe ? "justify-start" : "justify-end"}`}
// // //               >
// // //                 <button
// // //                   onClick={() => handleDeleteMessage(msg.id)}
// // //                   className={`absolute -top-2 ${isMe ? "-left-2" : "-right-2"}
// // //                     bg-white text-red-500 border border-red-100 rounded-full p-1
// // //                     opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10`}
// // //                   title="מחק הודעה"
// // //                 >
// // //                   <svg
// // //                     xmlns="http://www.w3.org/2000/svg"
// // //                     className="h-3 w-3"
// // //                     fill="none"
// // //                     viewBox="0 0 24 24"
// // //                     stroke="currentColor"
// // //                   >
// // //                     <path
// // //                       strokeLinecap="round"
// // //                       strokeLinejoin="round"
// // //                       strokeWidth={2}
// // //                       d="M6 18L18 6M6 6l12 12"
// // //                     />
// // //                   </svg>
// // //                 </button>

// // //                 <div
// // //                   className={`max-w-[80%] md:max-w-[60%] p-4 rounded-2xl shadow-sm transition-all ${
// // //                     isMe
// // //                       ? "bg-blue-600 text-white rounded-br-none ml-4"
// // //                       : "bg-gray-100 text-gray-800 border border-gray-200 rounded-bl-none mr-4"
// // //                   }`}
// // //                 >
// // //                   <p className="text-sm leading-relaxed whitespace-pre-wrap">
// // //                     {msg.text}
// // //                   </p>
// // //                   <div
// // //                     className={`text-[10px] mt-2 flex items-center gap-1 ${isMe ? "text-blue-100" : "text-gray-400"}`}
// // //                   >
// // //                     <span>
// // //                       {new Date(msg.createdAt).toLocaleTimeString("he-IL", {
// // //                         hour: "2-digit",
// // //                         minute: "2-digit",
// // //                       })}
// // //                     </span>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             );
// // //           })
// // //         )}
// // //         <div ref={messagesEndRef} />
// // //       </div>
// // //       {/* Messages Area */}
// // //       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
// // //         {loading ? (
// // //           <p className="text-center text-gray-400">טוען היסטוריה...</p>
// // //         ) : (
// // //           messages.map((msg) => {
// // //             const isMe = msg.senderId === currentUser.uid;
// // //             return (
// // //               /* עטיפת השורה - flex-col עוזר בניהול המיקום של הבועה */
// // //               <div
// // //                 key={msg.id}
// // //                 className={`flex w-full ${isMe ? "justify-start" : "justify-end"}`}
// // //               >
// // //                 {/* הדיב שעוטף את הבועה הופך ל-relative כדי שה-X ייצמד אליו */}
// // //                 <div className="relative group max-w-[80%] md:max-w-[60%]">
// // //                   {/* כפתור ה-X - כעת הוא צמוד לבועה בזכות ה-relative של הדיב העוטף */}
// // //                   <button
// // //                     onClick={() => handleDeleteMessage(msg.id)}
// // //                     className={`absolute -top-2 ${isMe ? "-left-2" : "-right-2"}
// // //                 bg-white text-red-500 border border-red-100 rounded-full p-1
// // //                 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10`}
// // //                     title="מחק הודעה"
// // //                   >
// // //                     <svg
// // //                       xmlns="http://www.w3.org/2000/svg"
// // //                       className="h-3 w-3"
// // //                       fill="none"
// // //                       viewBox="0 0 24 24"
// // //                       stroke="currentColor"
// // //                     >
// // //                       <path
// // //                         strokeLinecap="round"
// // //                         strokeLinejoin="round"
// // //                         strokeWidth={2}
// // //                         d="M6 18L18 6M6 6l12 12"
// // //                       />
// // //                     </svg>
// // //                   </button>

// // //                   {/* בועת ההודעה עצמה */}
// // //                   <div
// // //                     className={`p-4 rounded-2xl shadow-sm transition-all ${
// // //                       isMe
// // //                         ? "bg-blue-600 text-white rounded-br-none"
// // //                         : "bg-gray-100 text-gray-800 border border-gray-200 rounded-bl-none"
// // //                     }`}
// // //                   >
// // //                     <p className="text-sm leading-relaxed whitespace-pre-wrap">
// // //                       {msg.text}
// // //                     </p>
// // //                     <div
// // //                       className={`text-[10px] mt-2 flex items-center gap-1 ${isMe ? "text-blue-100" : "text-gray-400"}`}
// // //                     >
// // //                       <span>
// // //                         {new Date(msg.createdAt).toLocaleTimeString("he-IL", {
// // //                           hour: "2-digit",
// // //                           minute: "2-digit",
// // //                         })}
// // //                       </span>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             );
// // //           })
// // //         )}
// // //         <div ref={messagesEndRef} />
// // //       </div>
// // //       {/* Input Area */}
// // //       <div className="p-4 bg-gray-50 border-t shrink-0">
// // //         <form onSubmit={handleSend} className="flex gap-2">
// // //           <input
// // //             value={inputText}
// // //             onChange={(e) => setInputText(e.target.value)}
// // //             placeholder="הקלידו תשובה..."
// // //             className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
// // //             autoComplete="off"
// // //           />
// // //           <button
// // //             type="submit"
// // //             className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-md"
// // //           >
// // //             <svg
// // //               xmlns="http://www.w3.org/2000/svg"
// // //               className="h-5 w-5 transform rotate-180"
// // //               fill="none"
// // //               viewBox="0 0 24 24"
// // //               stroke="currentColor"
// // //             >
// // //               <path
// // //                 strokeLinecap="round"
// // //                 strokeLinejoin="round"
// // //                 strokeWidth={2}
// // //                 d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
// // //               />
// // //             </svg>
// // //           </button>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default FullChatWindow;

// import React, { useState, useEffect, useRef } from "react";
// import messageService from "../services/message.service";
// import { useAuth } from "../contexts/AuthContext";

// const FullChatWindow = ({ childId, onBack }) => {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [inputText, setInputText] = useState("");
//   const { currentUser } = useAuth();
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     if (childId) {
//       fetchChatHistory();
//       markAsRead();
//     }
//   }, [childId]);

//   useEffect(scrollToBottom, [messages]);

//   const fetchChatHistory = async () => {
//     try {
//       setLoading(true);
//       const token = await currentUser.getIdToken();
//       const data = await messageService.getChildMessages(childId, token);
//       setMessages(data);
//     } catch (err) {
//       console.error("Error fetching chat:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markAsRead = async () => {
//     try {
//       const token = await currentUser.getIdToken();
//       await messageService.markMessagesAsRead(childId, token);
//     } catch (err) {
//       console.error("Failed to mark as read", err);
//     }
//   };

//   const handleDeleteMessage = async (messageId) => {
//     if (!window.confirm("האם למחוק את ההודעה לצמיתות?")) return;

//     try {
//       const token = await currentUser.getIdToken();
//       await messageService.deleteMessage(messageId, token);
//       setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
//     } catch (err) {
//       console.error("Failed to delete message:", err);
//       alert("שגיאה במחיקת ההודעה");
//     }
//   };

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!inputText.trim()) return;

//     const textToSend = inputText;
//     setInputText("");

//     const tempMsg = {
//       id: "temp-" + Date.now(),
//       text: textToSend,
//       senderId: currentUser.uid,
//       createdAt: new Date().toISOString(),
//       sending: true,
//     };
//     setMessages((prev) => [...prev, tempMsg]);

//     try {
//       const token = await currentUser.getIdToken();
//       const receiverId = messages.find(
//         (m) => m.senderId !== currentUser.uid,
//       )?.senderId;

//       await messageService.sendMessage(
//         {
//           childId,
//           text: textToSend,
//           receiverId: receiverId,
//         },
//         token,
//       );
//       fetchChatHistory();
//     } catch (err) {
//       alert("שגיאה בשליחה");
//       setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
//     }
//   };

//   return (
//     <div className="flex flex-col h-full bg-white shadow-lg border border-gray-200 rounded-3xl overflow-hidden">
//       {/* Header */}
//       <div className="p-4 border-b flex justify-between h-[60px] items-center bg-gray-50 shrink-0">
//         <button onClick={onBack} className="md:hidden text-blue-600 font-bold">
//           חזור
//         </button>
//         <h3 className="text-lg font-bold text-gray-800">שיחה מלאה</h3>
//         <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
//           {childId.substring(0, 2).toUpperCase()}
//         </div>
//       </div>

//       {/* Messages Area */}
//       <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white custom-scrollbar">
//         {loading ? (
//           <p className="text-center text-gray-400">טוען היסטוריה...</p>
//         ) : (
//           messages.map((msg) => {
//             const isMe = msg.senderId === currentUser.uid;
//             return (
//               <div
//                 key={msg.id}
//                 className={`flex w-full group relative ${isMe ? "justify-start" : "justify-end"}`}
//               >
//                 {/* כפתור איקס (X) - זהה לחלוטין לעיצוב של ההורה */}
//                 <button
//                   onClick={() => handleDeleteMessage(msg.id)}
//                   className={`absolute -top-2 ${isMe ? "-left-2" : "-right-2"}
//                     bg-white text-red-500 border border-red-100 rounded-full p-1
//                     opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10`}
//                   title="מחק הודעה"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-3 w-3"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 </button>

//                 <div
//                   className={`max-w-[80%] md:max-w-[60%] p-4 rounded-2xl shadow-sm transition-all ${
//                     isMe
//                       ? "bg-blue-600 text-white rounded-br-none ml-4"
//                       : "bg-gray-100 text-gray-800 border border-gray-200 rounded-bl-none mr-4"
//                   }`}
//                 >
//                   <p className="text-sm leading-relaxed whitespace-pre-wrap">
//                     {msg.text}
//                   </p>
//                   <div
//                     className={`text-[10px] mt-2 flex items-center gap-1 ${isMe ? "text-blue-100" : "text-gray-400"}`}
//                   >
//                     <span>
//                       {new Date(msg.createdAt).toLocaleTimeString("he-IL", {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input Area */}
//       <div className="p-4 bg-gray-50 border-t shrink-0">
//         <form onSubmit={handleSend} className="flex gap-2">
//           <input
//             value={inputText}
//             onChange={(e) => setInputText(e.target.value)}
//             placeholder="הקלידו תשובה..."
//             className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//             autoComplete="off"
//           />
//           <button
//             type="submit"
//             className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-md"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 transform rotate-180"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
//               />
//             </svg>
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FullChatWindow;

import React, { useState, useEffect, useRef } from "react";
import messageService from "../services/message.service";
import { useAuth } from "../contexts/AuthContext";

const FullChatWindow = ({ childId, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (childId) {
      fetchChatHistory();
      markAsRead();
    }
  }, [childId]);

  useEffect(scrollToBottom, [messages]);

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      const data = await messageService.getChildMessages(childId, token);
      setMessages(data);
    } catch (err) {
      console.error("Error fetching chat history:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      const token = await currentUser.getIdToken();
      await messageService.markMessagesAsRead(childId, token);
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("האם למחוק את ההודעה לצמיתות?")) return;
    try {
      const token = await currentUser.getIdToken();
      await messageService.deleteMessage(messageId, token);
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (err) {
      alert("מחיקת ההודעה נכשלה");
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText;
    setInputText("");

    const tempMsg = {
      id: "temp-" + Date.now(),
      text: textToSend,
      senderId: currentUser.uid,
      createdAt: new Date().toISOString(),
      sending: true,
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const token = await currentUser.getIdToken();
      const lastReceivedMsg = messages.find(
        (m) => m.senderId !== currentUser.uid,
      );

      await messageService.sendMessage(
        {
          childId,
          text: textToSend,
          receiverId: lastReceivedMsg ? lastReceivedMsg.senderId : null,
        },
        token,
      );

      fetchChatHistory();
    } catch (err) {
      alert("שגיאה בשליחה");
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
    }
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-lg border border-gray-200 rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex justify-between h-[60px] items-center bg-gray-50 shrink-0">
        <button onClick={onBack} className="md:hidden text-blue-600 font-bold">
          חזור
        </button>
        <h3 className="text-lg font-bold text-gray-800">שיחה מלאה</h3>
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
          {childId.substring(0, 2).toUpperCase()}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white custom-scrollbar">
        {loading ? (
          <p className="text-center text-gray-400">טוען היסטוריה...</p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser.uid;
            return (
              <div
                key={msg.id}
                className={`flex w-full ${isMe ? "justify-start" : "justify-end"}`}
              >
                {/* Container relative להצמדת האיקס לבועה */}
                <div className="relative group max-w-[80%] md:max-w-[60%]">
                  <button
                    onClick={() => handleDeleteMessage(msg.id)}
                    className={`absolute -top-2 ${isMe ? "-left-2" : "-right-2"} 
                      bg-white text-red-500 border border-red-100 rounded-full p-1 
                      opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  <div
                    className={`p-4 rounded-2xl shadow-sm ${
                      isMe
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <div
                      className={`text-[10px] mt-2 ${isMe ? "text-blue-100" : "text-gray-400"}`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString("he-IL", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-50 border-t shrink-0">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="הקלידו תשובה..."
            className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 transform rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default FullChatWindow;
