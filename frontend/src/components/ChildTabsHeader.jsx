// import React from "react";

// const ChildTabsHeader = ({ activeTab, setActiveTab }) => {
//   const tabs = [
//     { id: "reports", label: "צפייה בדוחות", icon: "📊" },
//     { id: "forms", label: "אישורים וטפסים", icon: "📝" },

//     { id: "messages", label: "הודעות חשובות", icon: "🔔" },
//     { id: "info", label: "פרטי הילד", icon: "👤" },
//   ];

//   return (
//     <div className="flex justify-start bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-6 w-full">
//       <div className="flex gap-2">
//         {tabs.reverse().map(
//           (
//             tab, // הפיכת הסדר כדי ש"פרטי הילד" יהיה ראשון מימין
//           ) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all whitespace-nowrap ${
//                 activeTab === tab.id
//                   ? "bg-blue-600 text-white shadow-md"
//                   : "text-gray-600 hover:bg-blue-50"
//               }`}
//             >
//               <span>{tab.icon}</span>
//               <span className="font-medium">{tab.label}</span>
//             </button>
//           ),
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChildTabsHeader;

import React from "react";

const ChildTabsHeader = ({ activeTab, setActiveTab, hasUnreadMessages }) => {
  const tabs = [
    { id: "reports", label: "צפייה בדוחות", icon: "📊" },
    { id: "forms", label: "אישורים וטפסים", icon: "📝" },
    { id: "messages", label: "הודעות חשובות", icon: "🔔" },
    { id: "info", label: "פרטי הילד", icon: "👤" },
  ];

  return (
    <div className="flex justify-start bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-6 w-full">
      <div className="flex gap-2">
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

            {/* הוספת העיגול האדום רק לטאב הודעות ובמידה ויש הודעות שלא נקראו */}
            {tab.id === "messages" && hasUnreadMessages && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChildTabsHeader;
