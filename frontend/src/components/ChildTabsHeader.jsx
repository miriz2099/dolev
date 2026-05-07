// import React from "react";

// const ChildTabsHeader = ({ activeTab, setActiveTab, hasUnreadMessages }) => {
//   const tabs = [
//     { id: "assessments", label: "אבחונים", icon: "🧪" }
//     { id: "reports", label: "צפייה בדוחות", icon: "📊" },
//     { id: "forms", label: "אישורים וטפסים", icon: "📝" },
//     { id: "messages", label: "הודעות חשובות", icon: "🔔" },
//     { id: "info", label: "פרטי הילד", icon: "👤" },
//   ];

//   return (
//     <div className="flex justify-start bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-6 w-full">
//       <div className="flex gap-2">
//         {[...tabs].reverse().map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`relative flex items-center gap-2 px-6 py-3 rounded-xl transition-all whitespace-nowrap ${
//               activeTab === tab.id
//                 ? "bg-blue-600 text-white shadow-md"
//                 : "text-gray-600 hover:bg-blue-50"
//             }`}
//           >
//             <span>{tab.icon}</span>
//             <span className="font-medium">{tab.label}</span>

//             {/* הוספת העיגול האדום רק לטאב הודעות ובמידה ויש הודעות שלא נקראו */}
//             {tab.id === "messages" && hasUnreadMessages && (
//               <span className="absolute -top-1 -right-1 flex h-3 w-3">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//                 <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
//               </span>
//             )}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ChildTabsHeader;

import React from "react";

const ChildTabsHeader = ({
  activeTab,
  setActiveTab,
  hasUnreadMessages,
  pendingAssessmentsCount = 0,
}) => {
  // הסדר ב-array הוא הסדר ההגיוני - ה-reverse למטה הופך אותו לתצוגה RTL
  // מימין לשמאל בעברית: פרטי הילד → הודעות → אבחונים → אישורים וטפסים → דוחות
  const tabs = [
    { id: "reports", label: "צפייה בדוחות", icon: "📊" },

    { id: "assessments", label: "אבחונים", icon: "🧪" },
    { id: "messages", label: "הודעות חשובות", icon: "🔔" },
    { id: "forms", label: "אישורים וטפסים", icon: "📝" },

    { id: "info", label: "פרטי הילד", icon: "👤" },
  ];

  return (
    <div className="flex justify-start bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-6 w-full">
      <div className="flex gap-2 flex-wrap">
        {[...tabs].reverse().map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 px-6 py-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-blue-50"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="font-medium">{tab.label}</span>

            {/* Badge להודעות שלא נקראו */}
            {tab.id === "messages" && hasUnreadMessages && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
              </span>
            )}

            {/* Badge לאבחונים שעדיין ממתינים לתיאום */}
            {tab.id === "assessments" && pendingAssessmentsCount > 0 && (
              <span
                className={`absolute -top-2 -right-2 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full text-[11px] font-bold border-2 border-white shadow-sm ${
                  activeTab === tab.id
                    ? "bg-amber-300 text-amber-900"
                    : "bg-amber-500 text-white"
                }`}
              >
                {pendingAssessmentsCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChildTabsHeader;
