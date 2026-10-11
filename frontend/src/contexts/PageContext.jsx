import React, { createContext, useContext, useState, useCallback } from "react";

const PageContext = createContext(null);

/**
 * הקשר ניווט גלובלי - "על איזה ילד/אבחון מדובר כרגע ומאיפה הגענו".
 * משמש את ה-Slider כדי להציג שורת הקשר קטנה מתחת לפריט התפריט הפעיל
 * (בלי לשנות את מבנה התפריט/הצבעים הקיימים), ולדעת לסמן כפעיל את פריט
 * התפריט הנכון כשעמוד אחד (כמו "ניהול אבחון") נגיש משני מסלולי ניווט
 * שונים (למשל "ניהול מטופלים" מול "ניהול הורים ומטופלים").
 */
export const PageProvider = ({ children }) => {
  const [navContext, setNavContextState] = useState(null);

  const setNavContext = useCallback((ctx) => setNavContextState(ctx), []);
  const clearNavContext = useCallback(() => setNavContextState(null), []);

  return (
    <PageContext.Provider
      value={{ navContext, setNavContext, clearNavContext }}
    >
      {children}
    </PageContext.Provider>
  );
};

export const usePageContext = () => {
  const ctx = useContext(PageContext);
  if (!ctx) {
    return {
      navContext: null,
      setNavContext: () => {},
      clearNavContext: () => {},
    };
  }
  return ctx;
};
