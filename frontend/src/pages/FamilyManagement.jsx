import React, { useState, useEffect, useMemo } from "react";
import { getFamilies, deleteParent, deleteChild } from "../services/admin.service";

// ניהול הורים ומטופלים (אדמין) - מחיקה מדורגת (cascade).
// קריאת הנתונים נעשית ישירות מול Firestore (כמו StaffManagement),
// אך המחיקה עוברת דרך ה-Backend כדי לבצע את כל המחיקות המקושרות.
const FamilyManagement = () => {
  const [parents, setParents] = useState([]);
  const [childrenByParent, setChildrenByParent] = useState({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // deleteTarget: { type: "parent" | "child", entity }
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      // שליפה דרך ה-Backend (Admin SDK) - מחזיר הורים עם הילדים שלהם
      const families = await getFamilies();

      const grouped = {};
      families.forEach((f) => {
        grouped[f.id] = f.children || [];
      });

      setParents(families);
      setChildrenByParent(grouped);
    } catch (error) {
      console.error("Error fetching families:", error);
      alert(error.message || "שגיאה בטעינת נתוני ההורים והמטופלים");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredParents = useMemo(() => {
    if (!searchQuery) return parents;
    const q = searchQuery.toLowerCase();
    return parents.filter((p) => {
      const fullName = `${p.firstName || ""} ${p.lastName || ""}`.toLowerCase();
      return fullName.includes(q) || p.email?.toLowerCase().includes(q);
    });
  }, [parents, searchQuery]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setProcessing(true);
      if (deleteTarget.type === "parent") {
        await deleteParent(deleteTarget.entity.id);
      } else {
        await deleteChild(deleteTarget.entity.id);
      }
      setDeleteTarget(null);
      await fetchData();
    } catch (error) {
      alert(error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading && parents.length === 0) {
    return (
      <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans" dir="rtl">
        <div className="max-w-5xl mx-auto animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded-2xl w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* כותרת */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            ניהול הורים ומטופלים
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            מחיקת הורה תמחק גם את כל ילדיו והנתונים המקושרים. מחיקת ילד תמחק את כל
            האבחונים והטפסים שלו.
          </p>
        </div>

        {/* חיפוש */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 mb-6">
          <input
            type="text"
            placeholder="🔍 חיפוש הורה לפי שם או אימייל..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
          />
        </div>

        {processing && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 text-blue-700 text-sm font-semibold flex items-center gap-2">
            <span className="animate-spin">⚙️</span> מעבד בקשה...
          </div>
        )}

        {/* רשימת הורים */}
        {filteredParents.length > 0 ? (
          <div className="space-y-4">
            {filteredParents.map((parent) => {
              const kids = childrenByParent[parent.id] || [];
              return (
                <div
                  key={parent.id}
                  className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* שורת ההורה */}
                  <div className="flex items-center justify-between p-5 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                        {parent.firstName?.[0]}
                        {parent.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {parent.firstName} {parent.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{parent.email}</p>
                      </div>
                      <span className="mr-2 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                        {kids.length} ילדים
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setDeleteTarget({ type: "parent", entity: parent })
                      }
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-all text-sm"
                    >
                      🗑️ מחק הורה
                    </button>
                  </div>

                  {/* ילדי ההורה */}
                  {kids.length > 0 ? (
                    <ul className="divide-y divide-gray-50">
                      {kids.map((child) => (
                        <li
                          key={child.id}
                          className="flex items-center justify-between px-5 py-3 pr-16"
                        >
                          <span className="text-gray-700">
                            👤 {child.firstName} {child.lastName}
                            {child.idNumber && (
                              <span className="text-gray-400 text-sm mr-2">
                                (#{child.idNumber})
                              </span>
                            )}
                          </span>
                          <button
                            onClick={() =>
                              setDeleteTarget({ type: "child", entity: child })
                            }
                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-all text-xs"
                          >
                            🗑️ מחק מטופל
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-5 py-3 pr-16 text-sm text-gray-400">
                      אין מטופלים משויכים להורה זה
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
            <span className="text-6xl block mb-4">🔍</span>
            <p className="text-gray-500 text-lg font-semibold">
              {searchQuery ? "לא נמצאו תוצאות לחיפוש" : "אין הורים במערכת"}
            </p>
          </div>
        )}

        {/* מודאל אישור מחיקה */}
        {deleteTarget && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-right"
            dir="rtl"
            onClick={() => !processing && setDeleteTarget(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-red-500 p-6 text-white">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  🗑️{" "}
                  {deleteTarget.type === "parent"
                    ? "מחיקת הורה"
                    : "מחיקת מטופל"}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-gray-700">
                  האם את בטוחה שברצונך למחוק את{" "}
                  <span className="font-bold text-red-600">
                    {deleteTarget.entity.firstName}{" "}
                    {deleteTarget.entity.lastName}
                  </span>
                  ?
                </p>
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-700">
                  <strong>⚠️ אזהרה:</strong>{" "}
                  {deleteTarget.type === "parent"
                    ? "פעולה זו תמחק לצמיתות את ההורה (כולל חשבון ההתחברות), את כל ילדיו, וכל האבחונים, השאלונים, טפסי ההסכמה וההודעות המקושרים. לא ניתן לשחזר."
                    : "פעולה זו תמחק לצמיתות את המטופל וכל האבחונים, השאלונים, טפסי ההסכמה, התורים וההודעות שלו. לא ניתן לשחזר."}
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={confirmDelete}
                    disabled={processing}
                    className="flex-1 py-3 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 transition-all disabled:bg-gray-400"
                  >
                    {processing ? "מוחק..." : "כן, מחק"}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(null)}
                    disabled={processing}
                    className="flex-1 py-3 rounded-lg font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                  >
                    ביטול
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyManagement;
