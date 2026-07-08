// functions/services/pdf.service.js
const htmlPdf = require("html-pdf-node");

// העתק של הסטרוקטורה הרשמית שלכן לצורך ניתוח בשרת
const REPORT_STRUCTURE = [
  {
    id: "personalDetails",
    title: "פרטים אישיים",
    type: "infoTable",
    fields: [
      { id: "firstName", label: "שם פרטי" },
      { id: "lastName", label: "שם משפחה" },
      { id: "idNumber", label: "תעודת זהות" },
      { id: "birthDate", label: "תאריך לידה" },
      { id: "birthCountry", label: "ארץ לידה" },
      { id: "homeLanguage", label: "שפה מדוברת בבית" },
      { id: "address", label: "כתובת" },
      { id: "fatherName", label: "שם האב" },
      { id: "motherName", label: "שם האם" },
      { id: "school", label: "בית ספר" },
      { id: "grade", label: "כיתה" },
    ],
  },
  {
    id: "testDetails",
    title: "פרטי המבחן",
    type: "infoTable",
    fields: [
      { id: "firstTestDate", label: "תאריך בחינה ראשון" },
      { id: "ageAtTest", label: "גיל הנבחן בעת הבחינה" },
      { id: "secondTestDate", label: "תאריך בחינה שני" },
      { id: "examinerName", label: "שם הבוחן/ת" },
    ],
  },
  { id: "referralReason", title: "סיבת ההפניה להערכה", type: "narrative" },
  { id: "familyBackground", title: "רקע משפחתי והתפתחותי", type: "narrative" },
  { id: "educationalBackground", title: "רקע חינוכי", type: "narrative" },
  { id: "appearanceBehavior", title: "הופעה והתנהגות", type: "narrative" },
  { id: "assessmentTools", title: "כלי אבחון", type: "list" },
  {
    id: "findings",
    title: "ממצאי האבחון",
    type: "group",
    subsections: [
      { id: "intelligence", title: "משכל", type: "narrative" },
      {
        id: "fluidAbility",
        title: "יכולת פלואידית ותפקודים ניהוליים",
        type: "narrative",
      },
      { id: "crystallizedKnowledge", title: "ידע מגובש", type: "narrative" },
      { id: "auditoryProcessing", title: "עיבוד שמיעתי", type: "narrative" },
      {
        id: "visualProcessing",
        title: "עיבוד חזותי ותפקוד גרפו-מוטורי",
        type: "narrative",
      },
      {
        id: "processingSpeed",
        title: "מהירות עיבוד ותפקודי קשב",
        type: "narrative",
      },
    ],
  },
  {
    id: "memory",
    title: "תפקודי זיכרון",
    type: "group",
    subsections: [
      { id: "shortTermMemory", title: "זיכרון לטווח הקצר", type: "narrative" },
      {
        id: "longTermStorage",
        title: "אחסון ושליפה לטווח הארוך",
        type: "narrative",
      },
    ],
  },
  {
    id: "achievements",
    title: "תחומי הישג",
    type: "group",
    subsections: [
      { id: "reading", title: "קריאה", type: "narrative" },
      { id: "comprehension", title: "הבנת הנקרא והנשמע", type: "narrative" },
      { id: "oralExpression", title: "הבעה בעל פה", type: "narrative" },
      { id: "writing", title: "כתיבה והבעה בכתב", type: "narrative" },
      { id: "math", title: "חשבון", type: "narrative" },
      { id: "english", title: "תפקוד באנגלית", type: "narrative" },
    ],
  },
  { id: "emotionalBehavioral", title: "רגשי-התנהגותי", type: "narrative" },
  {
    id: "summary",
    title: "אינטגרציה וסיכום",
    type: "group",
    subsections: [
      { id: "summaryText", title: "סיכום", type: "narrative" },
      { id: "strengths", title: "תחומי חוזק", type: "list" },
      { id: "difficulties", title: "מוקדי הקושי", type: "list" },
    ],
  },
  {
    id: "recommendations",
    title: "המלצות",
    type: "group",
    subsections: [
      { id: "forParents", title: "להורים", type: "list" },
      { id: "forSchool", title: "לבית הספר", type: "list" },
      { id: "forExams", title: "במבחני בגרות", type: "list" },
    ],
  },
  {
    id: "scores",
    title: "ציוני המבחנים והמצרפים",
    type: "group",
    subsections: [
      {
        id: "subtests",
        title: "תת-מבחנים",
        type: "scoresTable",
        rows: [
          { id: "test1", label: "מבחן 1: הבנה מילולית" },
          { id: "test1d", label: "מבחן 1ד': אנלוגיות מילוליות" },
          { id: "test2", label: "מבחן 2: למידה חזותית-שמיעתית" },
          { id: "test3", label: "מבחן 3: עיבוד מרחבי" },
          { id: "test4", label: "מבחן 4: מיזוג צלילים" },
          { id: "test5", label: "מבחן 5: יצירת כללים" },
          { id: "test6", label: "מבחן 6: התאמה חזותית" },
          { id: "test7", label: "מבחן 7: זכירת מילים" },
          { id: "test8", label: "מבחן 8: ידע כללי" },
          { id: "test9", label: "מבחן 9: שטף סמנטי" },
          { id: "test10", label: "מבחן 10: זיהוי ציורים" },
          { id: "test11", label: "מבחן 11: מילים לא שלמות" },
          { id: "test12", label: "מבחן 12: אנליזה - סינתזה" },
          { id: "test13", label: "מבחן 13: מהירות החלטה" },
          { id: "test14", label: "מבחן 14: זכירת ספרות לאחור" },
          { id: "test15", label: "מבחן 15: זכירת שמות" },
          { id: "test16", label: "מבחן 16: תכנון" },
          { id: "test17", label: "מבחן 17: קשב שמיעתי" },
          { id: "test18", label: "מבחן 18: סדרות מספרים" },
          { id: "test19", label: "מבחן 19: איתור ציורים מהיר" },
          { id: "test20", label: "מבחן 20: זיכרון עבודה שמיעתי" },
          { id: "test21", label: "מבחן 21: שיום תמונות מהיר" },
        ],
      },
      {
        id: "composites",
        title: "מדדים ומצרפים",
        type: "scoresTable",
        rows: [
          { id: "iqShort", label: "מנת משכל כוללת – מדד מקוצר (1-7)" },
          { id: "iqFull", label: "מנת משכל כוללת (1-14)" },
          { id: "cpmAcquired", label: "ידע נרכש (CPM)" },
          { id: "cpmReasoningExt", label: "יכולת חשיבה – מדד מורחב" },
          { id: "cpmReasoningShort", label: "יכולת חשיבה – מדד מקוצר" },
          { id: "cpmCognitiveEff", label: "יעילות קוגניטיבית" },
          { id: "chcCrystallized", label: "ידע מגובש" },
          { id: "chcLongTerm", label: "אחסון ושליפה לטווח ארוך" },
          { id: "chcVisual", label: "עיבוד חזותי" },
          { id: "chcAuditory", label: "עיבוד שמיעתי" },
          { id: "chcFluid", label: "יכולת פלואידית" },
          { id: "chcSpeed", label: "מהירות עיבוד" },
          { id: "chcShortMem", label: "זיכרון לטווח קצר" },
          { id: "chc2018Learning", label: "יעילות בלמידה" },
          { id: "chc2018Retrieval", label: "שטף שליפה" },
          { id: "chcVisualExt", label: "עיבוד חזותי – מורחב" },
          { id: "chcAuditoryExt", label: "עיבוד שמיעתי – מורחב" },
          { id: "chcFluidExt", label: "יכולת פלואידית – מורחב" },
          { id: "chcSpeedExt", label: "מהירות עיבוד – מורחב" },
          { id: "chcShortMemExt", label: "זיכרון לטווח קצר – מורחב" },
        ],
      },
    ],
  },
];

// עמודות לטבלאות הציונים
const SCORE_COLUMNS = [
  { id: "raw", label: "ציון גלם" },
  { id: "standard", label: "ציון תקן" },
  { id: "percentile", label: "אחוזון" },
  { id: "ci", label: "רווח בר סמך (68%)" },
];

/**
 * בודק האם יש תוכן אמיתי בסעיף מסוים בהתאם לטיפוס שלו
 */
const sectionHasData = (type, data) => {
  if (!data) return false;
  if (type === "narrative" && typeof data === "string")
    return data.trim() !== "";
  if (type === "list" && Array.isArray(data))
    return data.some((i) => i && i.trim() !== "");
  if (type === "infoTable" && typeof data === "object")
    return Object.values(data).some((v) => v && String(v).trim() !== "");
  if (type === "scoresTable" && typeof data === "object") {
    return Object.values(data).some(
      (row) =>
        row &&
        Object.values(row).some((cell) => cell && String(cell).trim() !== ""),
    );
  }
  return false;
};

/**
 * פונקציה שמייצרת HTML עבור סעיף ספציפי מתוך המבנה המוגדר
 */
const renderSingleSection = (section, sectionData) => {
  if (!sectionHasData(section.type, sectionData)) return "";

  let html = "";

  // 1. נרטיב / טקסט חופשי
  if (section.type === "narrative") {
    html += `<div class="narrative-section"><h3>${section.title}</h3><p>${sectionData.replace(/\n/g, "<br>")}</p></div>`;
  }

  // 2. רשימה (Bullets)
  else if (section.type === "list") {
    html += `<h3>${section.title}</h3><ul>`;
    sectionData.forEach((item, idx) => {
      if (item && item.trim() !== "") {
        html += `<li><strong>${idx + 1}.</strong> ${item}</li>`;
      }
    });
    html += `</ul>`;
  }

  // 3. טבלת מידע (Info Table) כמו פרטים אישיים
  else if (section.type === "infoTable") {
    html += `<h3>${section.title}</h3><table class="info-table">`;
    section.fields.forEach((field) => {
      const val = sectionData[field.id];
      if (val && String(val).trim() !== "") {
        html += `<tr><td class="info-label">${field.label}</td><td class="info-value">${val}</td></tr>`;
      }
    });
    html += `</table>`;
  }

  // 4. טבלת ציונים מובנית (Scores Table)
  else if (section.type === "scoresTable") {
    html += `<h3>${section.title}</h3><table class="scores-table"><thead><tr>`;
    html += `<th style="text-align: right;">מבחן / מדד</th>`;
    SCORE_COLUMNS.forEach((col) => (html += `<th>${col.label}</th>`));
    html += `</tr></thead><tbody>`;

    section.rows.forEach((row) => {
      const rowData = sectionData[row.id];
      const hasRowValues =
        rowData &&
        Object.values(rowData).some((c) => c && String(c).trim() !== "");

      if (hasRowValues) {
        html += `<tr><td style="text-align: right; font-weight: bold; background: #f8f9fa;">${row.label}</td>`;
        SCORE_COLUMNS.forEach((col) => {
          html += `<td>${rowData[col.id] || "-"}</td>`;
        });
        html += `</tr>`;
      }
    });
    html += `</tbody></table>`;
  }

  return html;
};

/**
 * המייצר הראשי של ה-HTML
 */
const generateReportHTML = (formData) => {
  let htmlContent = `
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: 'Arial', sans-serif; direction: rtl; text-align: right; padding: 45px; line-height: 1.6; color: #2c3e50; }
                h1 { text-align: center; color: #1a5f7a; margin-bottom: 5px; font-size: 26px; font-weight: bold; }
                .subtitle { text-align: center; color: #7f8c8d; margin-bottom: 35px; font-size: 15px; }
                h2 { color: #1a5f7a; border-bottom: 3px solid #1a5f7a; padding-bottom: 5px; margin-top: 40px; font-size: 22px; font-weight: bold; page-break-after: avoid; }
                h3 { color: #2980b9; font-size: 16px; margin-top: 20px; margin-bottom: 8px; font-weight: bold; page-break-after: avoid; }
                p { font-size: 14px; text-align: justify; margin-bottom: 12px; color: #34495e; }
                ul { font-size: 14px; padding-right: 20px; margin-bottom: 15px; }
                li { margin-bottom: 6px; color: #34495e; }
                
                table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px; font-size: 13px; page-break-inside: avoid; }
                th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: center; }
                th { background-color: #f1f5f9; color: #1a5f7a; font-weight: bold; }
                
                .info-table { width: 100%; border: none; }
                .info-table td { border: 1px solid #e2e8f0; padding: 10px; }
                .info-label { width: 30%; background-color: #f8f9fa; font-weight: bold; text-align: right; color: #475569; }
                .info-value { text-align: right; color: #1e293b; }
                
                .narrative-section { margin-bottom: 20px; }
            </style>
        </head>
        <body>
            <h1>חוות דעת פסיכולוגית</h1>
            <div class="subtitle">מערכת דולב — ניהול והפקת אבחונים</div>
    `;

  // מעבר על הסטרוקטורה הראשית של הדוח
  REPORT_STRUCTURE.forEach((section) => {
    const sectionData = formData[section.id];
    if (!sectionData) return;

    // מקרה א': קבוצה של תת-סעיפים (Group)
    if (section.type === "group" && section.subsections) {
      let groupHtml = "";

      section.subsections.forEach((sub) => {
        const subData = sectionData[sub.id];
        const subHtml = renderSingleSection(sub, subData);
        if (subHtml) {
          groupHtml += subHtml;
        }
      });

      if (groupHtml) {
        htmlContent += `<h2>${section.title}</h2>` + groupHtml;
      }
    }
    // מקרה ב': סעיף רגיל ברמה העליונה (infoTable, narrative, list)
    else {
      const sectionHtml = renderSingleSection(section, sectionData);
      if (sectionHtml) {
        htmlContent += `<h2>${section.title}</h2>` + sectionHtml;
      }
    }
  });

  htmlContent += `
        </body>
        </html>
    `;

  return htmlContent;
};

/**
 * הפונקציה הציבורית שממירה את ה-HTML ל-PDF Buffer
 */
exports.generatePDFBuffer = async (reportData) => {
  // שולחים לרינדור בדיוק את ה-formData (או את ה-reportData עצמו במידה והוא מגיע שלם)
  const dataToRender = reportData.formData ? reportData.formData : reportData;
  const htmlContent = generateReportHTML(dataToRender);

  const options = {
    format: "A4",
    margin: { top: "25mm", bottom: "25mm", left: "20mm", right: "20mm" },
  };
  const file = { content: htmlContent };

  return await htmlPdf.generatePdf(file, options);
};
