import React from "react";

/**
 * פירורי לחם - לא תלויים ב-URL (חלק מהניווט באתר הוא מצב מקומי, לא
 * נתיב), אלא מקבלים מערך פריטים עם onClick אופציונלי. פריטים בלי label
 * מדלגים (כדי לא להציג מקטע ריק/undefined), והפריט האחרון מוצג כ"המיקום
 * הנוכחי" - בלי קליק.
 * @param {{ label: string, onClick?: () => void }[]} items
 */
const Breadcrumbs = ({ items = [] }) => {
  const visibleItems = items.filter((item) => item && item.label);
  if (visibleItems.length === 0) return null;

  return (
    <nav
      className="flex items-center gap-2 text-sm text-gray-400 mb-4 flex-wrap"
      dir="rtl"
    >
      {visibleItems.map((item, index) => {
        const isLast = index === visibleItems.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && <span className="text-gray-300">‹</span>}
            {isLast || !item.onClick ? (
              <span
                className={
                  isLast ? "text-gray-600 font-bold" : "text-gray-400"
                }
              >
                {item.label}
              </span>
            ) : (
              <button
                type="button"
                onClick={item.onClick}
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
