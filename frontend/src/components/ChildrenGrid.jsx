import React from "react";
import ChildCard from "./ChildCard";

const ChildrenGrid = ({ children }) => {
  if (children.length === 0) {
    return (
      <div className="col-span-full bg-white p-12 rounded-3xl border-2 border-dashed border-gray-200 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-gray-700">
          לא נמצאו ילדים רשומים
        </h2>
        <p className="text-gray-500 mt-2">
          אם לדעתך זו טעות, אנא צור קשר עם המנהל.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {children.map((child) => (
        <ChildCard key={child.id} child={child} />
      ))}
    </div>
  );
};

export default ChildrenGrid;
