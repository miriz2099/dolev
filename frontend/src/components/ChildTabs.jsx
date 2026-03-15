import React from "react";

const ChildTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "info", label: "פרטי הילד", icon: "👤" },
    { id: "forms", label: "אישורים וטפסים", icon: "📝" },
    { id: "reports", label: "צפייה בדוחות", icon: "📊" },
    { id: "messages", label: "הודעות חשובות", icon: "🔔" },
  ];

  return (
    <div className="flex flex-col space-y-2 w-64 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center space-x-3 space-x-reverse p-3 rounded-xl transition-all ${
            activeTab === tab.id
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:bg-blue-50"
          }`}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ChildTabs;
