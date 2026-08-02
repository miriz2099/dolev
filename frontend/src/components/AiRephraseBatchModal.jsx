// frontend/src/components/AiRephraseBatchModal.jsx
//
// מסך סקירה לניסוח מחדש קבוצתי: מציג התקדמות בזמן אמת (NDJSON streaming)
// כשכל בלוק בנפרד מנוסח מחדש בצד השרת, ומאפשרת אישור/דחייה לכל בלוק
// בנפרד לצד כפתור "אשר הכל" יחיד.

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import reportService from "../services/report.service";

const AiRephraseBatchModal = ({ diagnosisId, blocks, onClose, onConfirm }) => {
  const { currentUser } = useAuth();

  const [results, setResults] = useState(() =>
    Object.fromEntries(blocks.map((b) => [b.sectionId, { status: "pending" }])),
  );
  const [fatalError, setFatalError] = useState("");
  const [retryingIds, setRetryingIds] = useState(() => new Set());
  const abortRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;

    const run = async () => {
      try {
        const token = await currentUser.getIdToken();
        await reportService.rephraseBatch(
          diagnosisId,
          blocks.map(({ sectionId, rawText }) => ({ sectionId, rawText })),
          token,
          {
            signal: controller.signal,
            onProgress: (event) => {
              if (event.type === "result") {
                setResults((prev) => ({
                  ...prev,
                  [event.sectionId]: event.error
                    ? { status: "error", error: event.error }
                    : {
                        status: "done",
                        text: event.text,
                        provider: event.provider,
                        model: event.model,
                        accepted: true,
                      },
                }));
              } else if (event.type === "fatal") {
                setFatalError(event.error);
              }
            },
          },
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          setFatalError(err.message || "הניסוח הקבוצתי נכשל. נסי שוב.");
        }
      }
    };

    run();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retryBlock = async (sectionId) => {
    const block = blocks.find((b) => b.sectionId === sectionId);
    if (!block) return;

    setRetryingIds((prev) => new Set(prev).add(sectionId));
    setResults((prev) => ({ ...prev, [sectionId]: { status: "pending" } }));

    try {
      const token = await currentUser.getIdToken();
      const result = await reportService.rephrase(
        diagnosisId,
        sectionId,
        block.rawText,
        token,
      );
      setResults((prev) => ({
        ...prev,
        [sectionId]: {
          status: "done",
          text: result.text,
          provider: result.provider,
          model: result.model,
          accepted: true,
        },
      }));
    } catch (err) {
      setResults((prev) => ({
        ...prev,
        [sectionId]: { status: "error", error: err.message || "הניסוח נכשל" },
      }));
    } finally {
      setRetryingIds((prev) => {
        const next = new Set(prev);
        next.delete(sectionId);
        return next;
      });
    }
  };

  const toggleAccept = (sectionId) => {
    setResults((prev) => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], accepted: !prev[sectionId].accepted },
    }));
  };

  const handleCancel = () => {
    abortRef.current?.abort();
    onClose();
  };

  const handleConfirm = () => {
    const acceptedMap = {};
    blocks.forEach((b) => {
      const r = results[b.sectionId];
      if (r?.status === "done" && r.accepted) acceptedMap[b.sectionId] = r.text;
    });
    onConfirm(acceptedMap);
  };

  const total = blocks.length;
  const doneCount = blocks.filter(
    (b) => results[b.sectionId]?.status && results[b.sectionId].status !== "pending",
  ).length;
  const allResolved = doneCount === total && retryingIds.size === 0;
  const acceptedCount = blocks.filter(
    (b) => results[b.sectionId]?.status === "done" && results[b.sectionId]?.accepted,
  ).length;
  const progressPct = total ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 pb-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-1">ניסוח מחדש קבוצתי</h3>
          <p className="text-gray-500 text-sm mb-4">
            כל בלוק נשלח לניסוח בנפרד. קראי כל הצעה במלואה לפני האישור - ודאי
            שלא נוספו עובדות שלא כתבת.
          </p>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-sm text-gray-500 shrink-0">
              {allResolved
                ? `הושלם (${doneCount}/${total})`
                : `מנסחת בלוק ${Math.min(doneCount + 1, total)} מתוך ${total}...`}
            </span>
          </div>

          {fatalError && (
            <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              {fatalError}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-4">
          {blocks.map((block) => {
            const result = results[block.sectionId] || { status: "pending" };
            const isRetrying = retryingIds.has(block.sectionId);

            return (
              <div
                key={block.sectionId}
                className="rounded-2xl border border-gray-200 p-4 mb-3 last:mb-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">{block.title}</span>
                  {result.status === "pending" && (
                    <span className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="w-3.5 h-3.5 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin" />
                      {isRetrying ? "מנסה שוב..." : "ממתין..."}
                    </span>
                  )}
                  {result.status === "done" && (
                    <span className="text-sm text-green-600 font-medium">✓ הושלם</span>
                  )}
                  {result.status === "error" && (
                    <span className="text-sm text-red-500 font-medium">✗ נכשל</span>
                  )}
                </div>

                {result.status === "done" && (
                  <>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                        <p className="text-gray-500 text-xs font-semibold mb-1">הטקסט שלך</p>
                        <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
                          {block.rawText}
                        </p>
                      </div>
                      <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
                        <p className="text-blue-700 text-xs font-semibold mb-1">ניסוח מוצע</p>
                        <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
                          {result.text}
                        </p>
                      </div>
                    </div>
                    <label className="mt-2 flex items-center gap-2 text-sm text-gray-600 cursor-pointer w-fit">
                      <input
                        type="checkbox"
                        checked={!!result.accepted}
                        onChange={() => toggleAccept(block.sectionId)}
                        className="w-4 h-4 accent-purple-600"
                      />
                      לכלול בעדכון
                      {result.model && (
                        <span className="text-gray-400">· {result.model}</span>
                      )}
                    </label>
                  </>
                )}

                {result.status === "error" && (
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2 flex-1">
                      {result.error}
                    </p>
                    <button
                      type="button"
                      onClick={() => retryBlock(block.sectionId)}
                      disabled={isRetrying}
                      className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 transition disabled:opacity-50"
                    >
                      נסה שוב
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-6 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!allResolved || acceptedCount === 0}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            אשר {acceptedCount} בלוקים
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2 rounded-xl text-gray-500 hover:bg-gray-50 transition"
          >
            ביטול
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiRephraseBatchModal;
