// import React from "react";

// const ChildTabsHeader = ({ activeTab, setActiveTab }) => {
//   const tabs = [
//     { id: "info", label: "פרטי הילד", icon: "👤" },
//     { id: "forms", label: "אישורים וטפסים", icon: "📝" },
//     { id: "reports", label: "צפייה בדוחות", icon: "📊" },
//     { id: "messages", label: "הודעות חשובות", icon: "🔔" },
//   ];

//   return (
//     <div className="flex flex-row-reverse bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-x-auto">
//       {tabs.map((tab) => (
//         <button
//           key={tab.id}
//           onClick={() => setActiveTab(tab.id)}
//           className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all whitespace-nowrap ${
//             activeTab === tab.id
//               ? "bg-blue-600 text-white shadow-md"
//               : "text-gray-600 hover:bg-blue-50"
//           }`}
//         >
//           <span>{tab.icon}</span>
//           <span className="font-medium">{tab.label}</span>
//         </button>
//       ))}
//     </div>
//   );
// };

// export default ChildTabsHeader;
import React from "react";

const ChildTabsHeader = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "reports", label: "צפייה בדוחות", icon: "📊" },
    { id: "forms", label: "אישורים וטפסים", icon: "📝" },

    { id: "messages", label: "הודעות חשובות", icon: "🔔" },
    { id: "info", label: "פרטי הילד", icon: "👤" },
  ];

  return (
    <div className="flex justify-start bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-6 w-full">
      <div className="flex gap-2">
        {tabs.reverse().map(
          (
            tab, // הפיכת הסדר כדי ש"פרטי הילד" יהיה ראשון מימין
          ) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-blue-50"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ),
        )}
      </div>
    </div>
  );
};

export default ChildTabsHeader;
