// frontend/src/components/SignatureInput.jsx
//
// שדה חתימה: ציור חופשי (עכבר/אצבע/עט) או העלאת תמונה של חתימה. הערך
// (value) הוא data URL (PNG מהציור, JPEG מהעלאה) או מחרוזת ריקה.

import React, { useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";

const MAX_EXPORT_WIDTH = 600;
const MAX_UPLOAD_DATA_URL_LENGTH = 80000;
const UPLOAD_QUALITIES = [0.8, 0.7, 0.6, 0.5];
const READ_ERROR_MESSAGE = "לא ניתן לקרוא את התמונה. נסו קובץ PNG או JPG";

const SignatureInput = ({ value, onChange }) => {
  const [tab, setTab] = useState("draw"); // "draw" | "upload"
  const [uploadError, setUploadError] = useState("");
  const canvasRef = useRef(null);
  const padRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- לשונית ציור: אתחול/פירוק signature_pad בכל כניסה/יציאה מהלשונית ---
  useEffect(() => {
    if (tab !== "draw") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pad = new SignaturePad(canvas, {
      penColor: "black",
      backgroundColor: "rgb(255,255,255)",
    });
    padRef.current = pad;

    // טיפול ב-devicePixelRatio ובשינוי גודל חלון, לפי תיעוד signature_pad -
    // שינוי גודל הקנבס מוחק את הציור הקיים, ולכן מאפסים גם את הערך למעלה.
    const resizeCanvas = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d").scale(ratio, ratio);
      pad.clear();
      onChange("");
    };

    const handleEndStroke = () => {
      if (pad.isEmpty()) {
        onChange("");
        return;
      }
      const scale = Math.min(1, MAX_EXPORT_WIDTH / canvas.width);
      const outW = Math.max(1, Math.round(canvas.width * scale));
      const outH = Math.max(1, Math.round(canvas.height * scale));
      const temp = document.createElement("canvas");
      temp.width = outW;
      temp.height = outH;
      const ctx = temp.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, outW, outH);
      ctx.drawImage(canvas, 0, 0, outW, outH);
      onChange(temp.toDataURL("image/png"));
    };

    window.addEventListener("resize", resizeCanvas);
    pad.addEventListener("endStroke", handleEndStroke);
    resizeCanvas();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      pad.removeEventListener("endStroke", handleEndStroke);
      pad.off();
      padRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handleClearDrawing = () => {
    padRef.current?.clear();
    onChange("");
  };

  // --- לשונית העלאת תמונה ---
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // מאפשר לבחור שוב את אותו קובץ אחרי שגיאה/החלפה
    if (!file) return;

    setUploadError("");

    const reader = new FileReader();
    reader.onerror = () => setUploadError(READ_ERROR_MESSAGE);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => setUploadError(READ_ERROR_MESSAGE);
      img.onload = () => {
        const scale = Math.min(1, MAX_EXPORT_WIDTH / img.width);
        const outW = Math.max(1, Math.round(img.width * scale));
        const outH = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = outW;
        canvas.height = outH;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, outW, outH);
        ctx.drawImage(img, 0, 0, outW, outH);

        let dataUrl = canvas.toDataURL("image/jpeg", UPLOAD_QUALITIES[0]);
        for (
          let i = 1;
          i < UPLOAD_QUALITIES.length &&
          dataUrl.length > MAX_UPLOAD_DATA_URL_LENGTH;
          i++
        ) {
          dataUrl = canvas.toDataURL("image/jpeg", UPLOAD_QUALITIES[i]);
        }

        if (dataUrl.length > MAX_UPLOAD_DATA_URL_LENGTH) {
          setUploadError("התמונה גדולה מדי. נסו תמונה קטנה או פשוטה יותר");
          return;
        }

        onChange(dataUrl);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSwitchTab = (nextTab) => {
    if (nextTab === tab) return;
    setTab(nextTab);
    setUploadError("");
    onChange("");
  };

  return (
    <div dir="rtl" className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleSwitchTab("draw")}
          className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition ${
            tab === "draw"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
          }`}
        >
          ✍️ ציור חתימה
        </button>
        <button
          type="button"
          onClick={() => handleSwitchTab("upload")}
          className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition ${
            tab === "upload"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
          }`}
        >
          📎 העלאת תמונה
        </button>
      </div>

      {tab === "draw" ? (
        <div className="flex flex-col gap-2">
          <canvas
            ref={canvasRef}
            style={{ touchAction: "none" }}
            className="w-full h-[180px] border border-gray-300 rounded-xl bg-white"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              ציירו את החתימה באמצעות עכבר, אצבע או עט אלקטרוני
            </span>
            <button
              type="button"
              onClick={handleClearDrawing}
              className="text-sm text-gray-500 hover:text-red-600 transition"
            >
              ניקוי
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {value ? (
            <div className="flex flex-col items-center gap-2 border border-gray-300 rounded-xl bg-white p-3">
              <img
                src={value}
                alt="תצוגה מקדימה של החתימה"
                className="max-h-32 max-w-full"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-blue-600 hover:underline"
              >
                החלפת תמונה
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-gray-300 rounded-xl bg-white p-6 text-sm text-gray-500 hover:bg-gray-50 transition"
            >
              📎 לחצו להעלאת תמונה של חתימה (PNG/JPG)
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {uploadError && (
            <p className="text-sm text-red-600">{uploadError}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SignatureInput;
