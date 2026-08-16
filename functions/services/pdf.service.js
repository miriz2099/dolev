// // // // functions/services/pdf.service.js
// // // const htmlPdf = require("html-pdf-node");

// // // // העתק של הסטרוקטורה הרשמית שלכן לצורך ניתוח בשרת
// // // const REPORT_STRUCTURE = [
// // //   {
// // //     id: "personalDetails",
// // //     title: "פרטים אישיים",
// // //     type: "infoTable",
// // //     fields: [
// // //       { id: "firstName", label: "שם פרטי" },
// // //       { id: "lastName", label: "שם משפחה" },
// // //       { id: "idNumber", label: "תעודת זהות" },
// // //       { id: "birthDate", label: "תאריך לידה" },
// // //       { id: "birthCountry", label: "ארץ לידה" },
// // //       { id: "homeLanguage", label: "שפה מדוברת בבית" },
// // //       { id: "address", label: "כתובת" },
// // //       { id: "fatherName", label: "שם האב" },
// // //       { id: "motherName", label: "שם האם" },
// // //       { id: "school", label: "בית ספר" },
// // //       { id: "grade", label: "כיתה" },
// // //     ],
// // //   },
// // //   {
// // //     id: "testDetails",
// // //     title: "פרטי המבחן",
// // //     type: "infoTable",
// // //     fields: [
// // //       { id: "firstTestDate", label: "תאריך בחינה ראשון" },
// // //       { id: "ageAtTest", label: "גיל הנבחן בעת הבחינה" },
// // //       { id: "secondTestDate", label: "תאריך בחינה שני" },
// // //       { id: "examinerName", label: "שם הבוחן/ת" },
// // //     ],
// // //   },
// // //   { id: "referralReason", title: "סיבת ההפניה להערכה", type: "narrative" },
// // //   { id: "familyBackground", title: "רקע משפחתי והתפתחותי", type: "narrative" },
// // //   { id: "educationalBackground", title: "רקע חינוכי", type: "narrative" },
// // //   { id: "appearanceBehavior", title: "הופעה והתנהגות", type: "narrative" },
// // //   { id: "assessmentTools", title: "כלי אבחון", type: "list" },
// // //   {
// // //     id: "findings",
// // //     title: "ממצאי האבחון",
// // //     type: "group",
// // //     subsections: [
// // //       { id: "intelligence", title: "משכל", type: "narrative" },
// // //       {
// // //         id: "fluidAbility",
// // //         title: "יכולת פלואידית ותפקודים ניהוליים",
// // //         type: "narrative",
// // //       },
// // //       { id: "crystallizedKnowledge", title: "ידע מגובש", type: "narrative" },
// // //       { id: "auditoryProcessing", title: "עיבוד שמיעתי", type: "narrative" },
// // //       {
// // //         id: "visualProcessing",
// // //         title: "עיבוד חזותי ותפקוד גרפו-מוטורי",
// // //         type: "narrative",
// // //       },
// // //       {
// // //         id: "processingSpeed",
// // //         title: "מהירות עיבוד ותפקודי קשב",
// // //         type: "narrative",
// // //       },
// // //     ],
// // //   },
// // //   {
// // //     id: "memory",
// // //     title: "תפקודי זיכרון",
// // //     type: "group",
// // //     subsections: [
// // //       { id: "shortTermMemory", title: "זיכרון לטווח הקצר", type: "narrative" },
// // //       {
// // //         id: "longTermStorage",
// // //         title: "אחסון ושליפה לטווח הארוך",
// // //         type: "narrative",
// // //       },
// // //     ],
// // //   },
// // //   {
// // //     id: "achievements",
// // //     title: "תחומי הישג",
// // //     type: "group",
// // //     subsections: [
// // //       { id: "reading", title: "קריאה", type: "narrative" },
// // //       { id: "comprehension", title: "הבנת הנקרא והנשמע", type: "narrative" },
// // //       { id: "oralExpression", title: "הבעה בעל פה", type: "narrative" },
// // //       { id: "writing", title: "כתיבה והבעה בכתב", type: "narrative" },
// // //       { id: "math", title: "חשבון", type: "narrative" },
// // //       { id: "english", title: "תפקוד באנגלית", type: "narrative" },
// // //     ],
// // //   },
// // //   { id: "emotionalBehavioral", title: "רגשי-התנהגותי", type: "narrative" },
// // //   {
// // //     id: "summary",
// // //     title: "אינטגרציה וסיכום",
// // //     type: "group",
// // //     subsections: [
// // //       { id: "summaryText", title: "סיכום", type: "narrative" },
// // //       { id: "strengths", title: "תחומי חוזק", type: "list" },
// // //       { id: "difficulties", title: "מוקדי הקושי", type: "list" },
// // //     ],
// // //   },
// // //   {
// // //     id: "recommendations",
// // //     title: "המלצות",
// // //     type: "group",
// // //     subsections: [
// // //       { id: "forParents", title: "להורים", type: "list" },
// // //       { id: "forSchool", title: "לבית הספר", type: "list" },
// // //       { id: "forExams", title: "במבחני בגרות", type: "list" },
// // //     ],
// // //   },
// // //   {
// // //     id: "scores",
// // //     title: "ציוני המבחנים והמצרפים",
// // //     type: "group",
// // //     subsections: [
// // //       {
// // //         id: "subtests",
// // //         title: "תת-מבחנים",
// // //         type: "scoresTable",
// // //         rows: [
// // //           { id: "test1", label: "מבחן 1: הבנה מילולית" },
// // //           { id: "test1d", label: "מבחן 1ד': אנלוגיות מילוליות" },
// // //           { id: "test2", label: "מבחן 2: למידה חזותית-שמיעתית" },
// // //           { id: "test3", label: "מבחן 3: עיבוד מרחבי" },
// // //           { id: "test4", label: "מבחן 4: מיזוג צלילים" },
// // //           { id: "test5", label: "מבחן 5: יצירת כללים" },
// // //           { id: "test6", label: "מבחן 6: התאמה חזותית" },
// // //           { id: "test7", label: "מבחן 7: זכירת מילים" },
// // //           { id: "test8", label: "מבחן 8: ידע כללי" },
// // //           { id: "test9", label: "מבחן 9: שטף סמנטי" },
// // //           { id: "test10", label: "מבחן 10: זיהוי ציורים" },
// // //           { id: "test11", label: "מבחן 11: מילים לא שלמות" },
// // //           { id: "test12", label: "מבחן 12: אנליזה - סינתזה" },
// // //           { id: "test13", label: "מבחן 13: מהירות החלטה" },
// // //           { id: "test14", label: "מבחן 14: זכירת ספרות לאחור" },
// // //           { id: "test15", label: "מבחן 15: זכירת שמות" },
// // //           { id: "test16", label: "מבחן 16: תכנון" },
// // //           { id: "test17", label: "מבחן 17: קשב שמיעתי" },
// // //           { id: "test18", label: "מבחן 18: סדרות מספרים" },
// // //           { id: "test19", label: "מבחן 19: איתור ציורים מהיר" },
// // //           { id: "test20", label: "מבחן 20: זיכרון עבודה שמיעתי" },
// // //           { id: "test21", label: "מבחן 21: שיום תמונות מהיר" },
// // //         ],
// // //       },
// // //       {
// // //         id: "composites",
// // //         title: "מדדים ומצרפים",
// // //         type: "scoresTable",
// // //         rows: [
// // //           { id: "iqShort", label: "מנת משכל כוללת – מדד מקוצר (1-7)" },
// // //           { id: "iqFull", label: "מנת משכל כוללת (1-14)" },
// // //           { id: "cpmAcquired", label: "ידע נרכש (CPM)" },
// // //           { id: "cpmReasoningExt", label: "יכולת חשיבה – מדד מורחב" },
// // //           { id: "cpmReasoningShort", label: "יכולת חשיבה – מדד מקוצר" },
// // //           { id: "cpmCognitiveEff", label: "יעילות קוגניטיבית" },
// // //           { id: "chcCrystallized", label: "ידע מגובש" },
// // //           { id: "chcLongTerm", label: "אחסון ושליפה לטווח ארוך" },
// // //           { id: "chcVisual", label: "עיבוד חזותי" },
// // //           { id: "chcAuditory", label: "עיבוד שמיעתי" },
// // //           { id: "chcFluid", label: "יכולת פלואידית" },
// // //           { id: "chcSpeed", label: "מהירות עיבוד" },
// // //           { id: "chcShortMem", label: "זיכרון לטווח קצר" },
// // //           { id: "chc2018Learning", label: "יעילות בלמידה" },
// // //           { id: "chc2018Retrieval", label: "שטף שליפה" },
// // //           { id: "chcVisualExt", label: "עיבוד חזותי – מורחב" },
// // //           { id: "chcAuditoryExt", label: "עיבוד שמיעתי – מורחב" },
// // //           { id: "chcFluidExt", label: "יכולת פלואידית – מורחב" },
// // //           { id: "chcSpeedExt", label: "מהירות עיבוד – מורחב" },
// // //           { id: "chcShortMemExt", label: "זיכרון לטווח קצר – מורחב" },
// // //         ],
// // //       },
// // //     ],
// // //   },
// // // ];

// // // // עמודות לטבלאות הציונים
// // // const SCORE_COLUMNS = [
// // //   { id: "raw", label: "ציון גלם" },
// // //   { id: "standard", label: "ציון תקן" },
// // //   { id: "percentile", label: "אחוזון" },
// // //   { id: "ci", label: "רווח בר סמך (68%)" },
// // // ];

// // // /**
// // //  * בודק האם יש תוכן אמיתי בסעיף מסוים בהתאם לטיפוס שלו
// // //  */
// // // const sectionHasData = (type, data) => {
// // //   if (!data) return false;
// // //   if (type === "narrative" && typeof data === "string")
// // //     return data.trim() !== "";
// // //   if (type === "list" && Array.isArray(data))
// // //     return data.some((i) => i && i.trim() !== "");
// // //   if (type === "infoTable" && typeof data === "object")
// // //     return Object.values(data).some((v) => v && String(v).trim() !== "");
// // //   if (type === "scoresTable" && typeof data === "object") {
// // //     return Object.values(data).some(
// // //       (row) =>
// // //         row &&
// // //         Object.values(row).some((cell) => cell && String(cell).trim() !== ""),
// // //     );
// // //   }
// // //   return false;
// // // };

// // // /**
// // //  * פונקציה שמייצרת HTML עבור סעיף ספציפי מתוך המבנה המוגדר
// // //  */
// // // const renderSingleSection = (section, sectionData) => {
// // //   if (!sectionHasData(section.type, sectionData)) return "";

// // //   let html = "";

// // //   // 1. נרטיב / טקסט חופשי
// // //   if (section.type === "narrative") {
// // //     html += `<div class="narrative-section"><h3>${section.title}</h3><p>${sectionData.replace(/\n/g, "<br>")}</p></div>`;
// // //   }

// // //   // 2. רשימה (Bullets)
// // //   else if (section.type === "list") {
// // //     html += `<h3>${section.title}</h3><ul>`;
// // //     sectionData.forEach((item, idx) => {
// // //       if (item && item.trim() !== "") {
// // //         html += `<li><strong>${idx + 1}.</strong> ${item}</li>`;
// // //       }
// // //     });
// // //     html += `</ul>`;
// // //   }

// // //   // 3. טבלת מידע (Info Table) כמו פרטים אישיים
// // //   else if (section.type === "infoTable") {
// // //     html += `<h3>${section.title}</h3><table class="info-table">`;
// // //     section.fields.forEach((field) => {
// // //       const val = sectionData[field.id];
// // //       if (val && String(val).trim() !== "") {
// // //         html += `<tr><td class="info-label">${field.label}</td><td class="info-value">${val}</td></tr>`;
// // //       }
// // //     });
// // //     html += `</table>`;
// // //   }

// // //   // 4. טבלת ציונים מובנית (Scores Table)
// // //   else if (section.type === "scoresTable") {
// // //     html += `<h3>${section.title}</h3><table class="scores-table"><thead><tr>`;
// // //     html += `<th style="text-align: right;">מבחן / מדד</th>`;
// // //     SCORE_COLUMNS.forEach((col) => (html += `<th>${col.label}</th>`));
// // //     html += `</tr></thead><tbody>`;

// // //     section.rows.forEach((row) => {
// // //       const rowData = sectionData[row.id];
// // //       const hasRowValues =
// // //         rowData &&
// // //         Object.values(rowData).some((c) => c && String(c).trim() !== "");

// // //       if (hasRowValues) {
// // //         html += `<tr><td style="text-align: right; font-weight: bold; background: #f8f9fa;">${row.label}</td>`;
// // //         SCORE_COLUMNS.forEach((col) => {
// // //           html += `<td>${rowData[col.id] || "-"}</td>`;
// // //         });
// // //         html += `</tr>`;
// // //       }
// // //     });
// // //     html += `</tbody></table>`;
// // //   }

// // //   return html;
// // // };

// // // // CSS משותף לכל מסמכי ה-PDF שהמערכת מייצרת (דוח, שאלונים, טופס הסכמה) -
// // // // כדי שכולם ייראו עקביים ולא נשכפל את הבלוק הזה בכל generator.
// // // const PDF_BASE_STYLE = `
// // //     body { font-family: 'Arial', sans-serif; direction: rtl; text-align: right; padding: 45px; line-height: 1.6; color: #2c3e50; }
// // //     h1 { text-align: center; color: #1a5f7a; margin-bottom: 5px; font-size: 26px; font-weight: bold; }
// // //     .subtitle { text-align: center; color: #7f8c8d; margin-bottom: 35px; font-size: 15px; }
// // //     h2 { color: #1a5f7a; border-bottom: 3px solid #1a5f7a; padding-bottom: 5px; margin-top: 40px; font-size: 22px; font-weight: bold; page-break-after: avoid; }
// // //     h3 { color: #2980b9; font-size: 16px; margin-top: 20px; margin-bottom: 8px; font-weight: bold; page-break-after: avoid; }
// // //     p { font-size: 14px; text-align: justify; margin-bottom: 12px; color: #34495e; }
// // //     ul { font-size: 14px; padding-right: 20px; margin-bottom: 15px; }
// // //     li { margin-bottom: 6px; color: #34495e; }

// // //     table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px; font-size: 13px; page-break-inside: avoid; }
// // //     th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: center; }
// // //     th { background-color: #f1f5f9; color: #1a5f7a; font-weight: bold; }

// // //     .info-table { width: 100%; border: none; }
// // //     .info-table td { border: 1px solid #e2e8f0; padding: 10px; }
// // //     .info-label { width: 30%; background-color: #f8f9fa; font-weight: bold; text-align: right; color: #475569; }
// // //     .info-value { text-align: right; color: #1e293b; }

// // //     .narrative-section { margin-bottom: 20px; }
// // // `;

// // // /**
// // //  * עוטפת body HTML במעטפת <html>/<head>/<style> אחידה לכל מסמכי ה-PDF.
// // //  */
// // // const wrapHtmlDocument = (title, subtitle, bodyHtml) => `
// // //         <html>
// // //         <head>
// // //             <meta charset="utf-8">
// // //             <style>${PDF_BASE_STYLE}</style>
// // //         </head>
// // //         <body>
// // //             <h1>${title}</h1>
// // //             <div class="subtitle">${subtitle}</div>
// // //             ${bodyHtml}
// // //         </body>
// // //         </html>
// // //     `;

// // // /**
// // //  * שורת <tr> יחידה בטבלת מידע (info-table) - מדולגת אם אין ערך, כמו
// // //  * ב-renderSingleSection הקיים.
// // //  */
// // // const infoRow = (label, value) => {
// // //   if (value === undefined || value === null || String(value).trim() === "")
// // //     return "";
// // //   return `<tr><td class="info-label">${label}</td><td class="info-value">${value}</td></tr>`;
// // // };

// // // /**
// // //  * טבלה גנרית (headers + rows) לרשימות כמו מהלך לימודים/אחים/סדר יום.
// // //  */
// // // const dataTable = (headers, rows) => {
// // //   const validRows = (rows || []).filter((row) =>
// // //     row.some((cell) => cell && String(cell).trim() !== ""),
// // //   );
// // //   if (validRows.length === 0) return "";

// // //   let html = `<table><thead><tr>`;
// // //   headers.forEach((h) => (html += `<th>${h}</th>`));
// // //   html += `</tr></thead><tbody>`;
// // //   validRows.forEach((row) => {
// // //     html += `<tr>${row.map((cell) => `<td>${cell || "-"}</td>`).join("")}</tr>`;
// // //   });
// // //   html += `</tbody></table>`;
// // //   return html;
// // // };

// // // /**
// // //  * המייצר הראשי של ה-HTML
// // //  */
// // // const generateReportHTML = (formData) => {
// // //   let htmlContent = "";

// // //   // מעבר על הסטרוקטורה הראשית של הדוח
// // //   REPORT_STRUCTURE.forEach((section) => {
// // //     const sectionData = formData[section.id];
// // //     if (!sectionData) return;

// // //     // מקרה א': קבוצה של תת-סעיפים (Group)
// // //     if (section.type === "group" && section.subsections) {
// // //       let groupHtml = "";

// // //       section.subsections.forEach((sub) => {
// // //         const subData = sectionData[sub.id];
// // //         const subHtml = renderSingleSection(sub, subData);
// // //         if (subHtml) {
// // //           groupHtml += subHtml;
// // //         }
// // //       });

// // //       if (groupHtml) {
// // //         htmlContent += `<h2>${section.title}</h2>` + groupHtml;
// // //       }
// // //     }
// // //     // מקרה ב': סעיף רגיל ברמה העליונה (infoTable, narrative, list)
// // //     else {
// // //       const sectionHtml = renderSingleSection(section, sectionData);
// // //       if (sectionHtml) {
// // //         htmlContent += `<h2>${section.title}</h2>` + sectionHtml;
// // //       }
// // //     }
// // //   });

// // //   return wrapHtmlDocument(
// // //     "חוות דעת פסיכולוגית",
// // //     "מערכת דולב — ניהול והפקת אבחונים",
// // //     htmlContent,
// // //   );
// // // };

// // // const PDF_OPTIONS = {
// // //   format: "A4",
// // //   margin: { top: "25mm", bottom: "25mm", left: "20mm", right: "20mm" },
// // // };

// // // /** ממירה HTML מוכן ל-Buffer של PDF - משותף לכל ה-generators בקובץ */
// // // const htmlToPdfBuffer = async (htmlContent) =>
// // //   await htmlPdf.generatePdf({ content: htmlContent }, PDF_OPTIONS);

// // // /**
// // //  * הפונקציה הציבורית שממירה את ה-HTML ל-PDF Buffer
// // //  */
// // // exports.generatePDFBuffer = async (reportData) => {
// // //   // שולחים לרינדור בדיוק את ה-formData (או את ה-reportData עצמו במידה והוא מגיע שלם)
// // //   const dataToRender = reportData.formData ? reportData.formData : reportData;
// // //   return await htmlToPdfBuffer(generateReportHTML(dataToRender));
// // // };

// // // // ============================================
// // // // שאלון הורים -> PDF
// // // // ============================================
// // // const generateParentQuestionnaireHTML = (doc) => {
// // //   const f = doc.formData || {};
// // //   let html = "";

// // //   html += `<h2>פרטים אישיים</h2><table class="info-table">`;
// // //   html += infoRow(
// // //     "שם הילד/ה",
// // //     `${f.childFirstName || ""} ${f.childLastName || ""}`.trim(),
// // //   );
// // //   html += infoRow("ת.ז", f.idNumber);
// // //   html += infoRow("תאריך לידה", f.birthDate);
// // //   html += infoRow("מין", f.gender);
// // //   html += infoRow("שם האב", f.fatherName);
// // //   html += infoRow("שם האם", f.motherName);
// // //   html += infoRow("מצב משפחתי", f.familyStatus);
// // //   html += infoRow("שפה בבית", f.homeLanguage);
// // //   html += infoRow("כתובת", f.address);
// // //   html += infoRow("הערות למצב המשפחתי", f.familyNotes);
// // //   html += `</table>`;

// // //   html += `<h2>סיבת הפנייה ואבחונים קודמים</h2><table class="info-table">`;
// // //   html += infoRow("תיאור הקושי", f.difficultyDescription);
// // //   html += infoRow("מטרות הפנייה", f.referralGoals);
// // //   html += infoRow("מתי התחילו הקשיים?", f.onsetTime);
// // //   html += infoRow("עבר אבחון בעבר?", f.hadAssessment);
// // //   if (f.hadAssessment === "כן") {
// // //     html += infoRow("סוג אבחון קודם", f.assessmentType);
// // //     html += infoRow("תאריך האבחון", f.assessmentDate);
// // //     html += infoRow("המלצות אבחונים", f.assessmentRecommendations);
// // //   }
// // //   html += infoRow("טיפולים פרא-רפואיים", f.paraMedicalTreatments);
// // //   html += `</table>`;
// // //   if (f.assessmentFiles?.length) {
// // //     html += `<h3>מסמכי אבחון קודם מצורפים</h3><ul>`;
// // //     f.assessmentFiles.forEach((file) => (html += `<li>${file.name}</li>`));
// // //     html += `</ul>`;
// // //   }

// // //   html += `<h2>היסטוריה לימודית</h2><table class="info-table">`;
// // //   html += infoRow("גיל יציאה למסגרת", f.firstFrameworkAge);
// // //   html += infoRow("סוג מסגרת ראשונה", f.firstFrameworkType);
// // //   html += infoRow("דיווח גן חובה", f.preSchoolReports);
// // //   html += infoRow("נשאר כיתה?", f.stayedGrade);
// // //   html += infoRow("סיבה", f.stayedGradeReason);
// // //   html += `</table>`;
// // //   html += dataTable(
// // //     ["כיתה", "בית ספר", "יישוב"],
// // //     f.schoolHistory?.map((s) => [s.grade, s.school, s.city]),
// // //   );

// // //   html += `<h2>הערכת תפקוד כללית</h2><table class="info-table">`;
// // //   html += infoRow("תפקוד לימודי", f.functioning?.studies);
// // //   html += infoRow("תפקוד משפחתי", f.functioning?.family);
// // //   html += infoRow("תפקוד חברתי", f.functioning?.social);
// // //   html += infoRow("הערות תפקוד", f.functioning?.notes);
// // //   html += `</table>`;

// // //   html += `<h2>מבנה המשפחה</h2><table class="info-table">`;
// // //   html += infoRow("שם האם (בטבלה)", f.familyStructure?.motherNameInTable);
// // //   html += infoRow("עיסוק האם", f.familyStructure?.motherJob);
// // //   html += infoRow("שם האב (בטבלה)", f.familyStructure?.fatherNameInTable);
// // //   html += infoRow("עיסוק האב", f.familyStructure?.fatherJob);
// // //   html += `</table>`;
// // //   html += dataTable(
// // //     ["שם", "גיל", "מסגרת", "הערות"],
// // //     f.familyStructure?.siblings?.map((s) => [
// // //       s.name,
// // //       s.age,
// // //       s.framework,
// // //       s.notes,
// // //     ]),
// // //   );

// // //   html += `<h2>בריאות והתפתחות</h2><table class="info-table">`;
// // //   html += infoRow("מצב בריאותי כללי", f.generalHealth);
// // //   html += infoRow("ממצא בדיקת ראייה", f.visionFindings);
// // //   html += infoRow("ממצא בדיקת שמיעה", f.hearingFindings);
// // //   html += infoRow("הריון תקין?", f.development?.normalPregnancy);
// // //   html += infoRow("משקל לידה", f.development?.birthWeight);
// // //   html += infoRow("גיל הליכה", f.development?.walkingAge);
// // //   html += infoRow("גיל דיבור (מילים ראשונות)", f.development?.firstWordsAge);
// // //   html += infoRow(
// // //     "גיל גמילה מחיתולים",
// // //     f.development?.diaperGraduationAge,
// // //   );
// // //   html += `</table>`;

// // //   html += `<h2>התנהגות ותפקוד בבית</h2><table class="info-table">`;
// // //   html += infoRow(
// // //     "בעיות אוכל/שינה/פחדים",
// // //     f.currentProblems?.foodSleepFearsDetails,
// // //   );
// // //   html += infoRow("חוסר מנוחה/פעילות יתר", f.currentProblems?.restlessness);
// // //   html += infoRow("מתרגש בקלות", f.currentProblems?.excitedEasily);
// // //   html += infoRow("מפריע לאחרים", f.currentProblems?.disturbsOthers);
// // //   html += infoRow(
// // //     "תלותי/עצמאי",
// // //     f.currentProblems?.dependencyVsIndependence,
// // //   );
// // //   html += infoRow("למי קרוב יותר?", f.currentProblems?.closerToWho);
// // //   html += `</table>`;

// // //   html += `<h2>סדר יום אופייני</h2>`;
// // //   html += dataTable(
// // //     ["שעה", "פעילות"],
// // //     f.dailyRoutine?.map((r) => [r.time, r.activity]),
// // //   );

// // //   html += `<h2>חתימה</h2><table class="info-table">`;
// // //   html += infoRow("חתימת הורים", f.parentsSignature);
// // //   html += infoRow(
// // //     "הוגש בתאריך",
// // //     doc.submittedAt
// // //       ? new Date(doc.submittedAt).toLocaleString("he-IL")
// // //       : "",
// // //   );
// // //   html += `</table>`;

// // //   return wrapHtmlDocument(
// // //     "שאלון הורים",
// // //     "מערכת דולב — ניהול והפקת אבחונים",
// // //     html,
// // //   );
// // // };

// // // exports.generateParentQuestionnairePDFBuffer = async (doc) =>
// // //   await htmlToPdfBuffer(generateParentQuestionnaireHTML(doc));

// // // // ============================================
// // // // שאלון בית ספר -> PDF
// // // // ============================================
// // // const generateSchoolQuestionnaireHTML = (doc) => {
// // //   const f = doc.formData || {};
// // //   let html = "";

// // //   html += `<h2>פרטי הדיווח והתלמיד</h2><table class="info-table">`;
// // //   html += infoRow(
// // //     "שם התלמיד/ה",
// // //     `${f.firstName || ""} ${f.lastName || ""}`.trim(),
// // //   );
// // //   html += infoRow("תעודת זהות", f.idNumber);
// // //   html += infoRow("תאריך לידה", f.birthDate);
// // //   html += infoRow("כיתה", f.grade);
// // //   html += infoRow("בית ספר", f.school);
// // //   html += infoRow("שם המחנך/ת המדווח", doc.teacherName);
// // //   html += infoRow("מייל המורה", doc.teacherEmail);
// // //   html += infoRow("טלפון המורה", f.teacherPhone);
// // //   html += infoRow(
// // //     "תאריך הגשה",
// // //     doc.submittedAt
// // //       ? new Date(doc.submittedAt).toLocaleDateString("he-IL")
// // //       : "",
// // //   );
// // //   html += `</table>`;

// // //   html += `<h2>סיבת ההפניה</h2><table class="info-table">`;
// // //   html += infoRow("מי יזם את הפנייה?", f.referralInitiator);
// // //   html += infoRow("סיבות הפנייה המרכזיות", f.referralReasons);
// // //   html += infoRow("תיאור קשיי התלמיד", f.difficultyDescription);
// // //   html += `</table>`;

// // //   html += `<h2>הישגים לימודיים ותפקוד</h2>`;
// // //   html += dataTable(
// // //     ["כיתה", "בית ספר"],
// // //     f.schoolHistory
// // //       ?.filter((h) => h.grade || h.school)
// // //       .map((h) => [h.grade, h.school]),
// // //   );
// // //   html += `<table class="info-table">`;
// // //   html += infoRow("רמה אקדמית בהשוואה לכיתה", f.academicLevel);
// // //   html += infoRow("האם נשאר כיתה?", f.stayedGrade);
// // //   html += infoRow(
// // //     "באיזו כיתה ולמה?",
// // //     `${f.stayedGradeWhich || ""} ${f.stayedGradeReasons || ""}`.trim(),
// // //   );
// // //   html += infoRow("קריאה", f.reading);
// // //   html += infoRow("כתיבה", f.writing);
// // //   html += infoRow("חשבון", f.math);
// // //   html += `</table>`;

// // //   html += `<h2>יחסים והתנהגות כללית</h2><table class="info-table">`;
// // //   html += infoRow("טיב היחס אל המורים", f.teacherRelation);
// // //   html += infoRow("הערות ליחס למורים", f.teacherRelationNotes);
// // //   html += infoRow("טיב היחסים עם בני הכיתה", f.peerRelation);
// // //   html += infoRow("בעיות חברתיות", f.peerProblems);
// // //   html += infoRow("1. דעתו מוסחת בקלות", f.distractedEasily);
// // //   html += infoRow("2. מתקשה להתרכז במשימות", f.hardToFocus);
// // //   html += infoRow("3. נע/מסתובב/מטפס באופן מוגזם", f.excessiveMovement);
// // //   html += infoRow("4. עוזב את הכיסא בשיעור", f.leavesSeats);
// // //   html += `</table>`;

// // //   if (f.behaviorRatings && Object.keys(f.behaviorRatings).length > 0) {
// // //     html += `<h2>דירוג בעיות התנהגות מפורטות</h2><table class="info-table">`;
// // //     Object.entries(f.behaviorRatings).forEach(([behavior, rating]) => {
// // //       html += infoRow(behavior, rating);
// // //     });
// // //     html += `</table>`;
// // //   }

// // //   html += `<h2>עזרה מיוחדת, התערבות וסיכום</h2><table class="info-table">`;
// // //   html += infoRow("שעות שילוב", f.integrationHours);
// // //   html += infoRow("היקף (שש)", f.integrationScope);
// // //   html += infoRow("כמה שנים", f.integrationYears);
// // //   html += infoRow(
// // //     "טיפול רגשי",
// // //     `${f.emotionalTreatment || ""} ${f.emotionalTreatmentDetails ? `(${f.emotionalTreatmentDetails})` : ""}`.trim(),
// // //   );
// // //   html += infoRow(
// // //     "חינוך מיוחד",
// // //     `${f.specialEducation || ""} ${f.specialEdName ? `(${f.specialEdName})` : ""}`.trim(),
// // //   );
// // //   html += infoRow("עזרה אחרת", f.otherHelp);
// // //   html += infoRow("סכם התרשמותך מהתלמיד/ה", f.studentSummary);
// // //   html += infoRow("שאלה אבחונית או אחרת", f.diagnosticQuestion);
// // //   html += infoRow("ההתערבות הטיפולית המבוקשת", f.requestedIntervention);
// // //   html += `</table>`;

// // //   html += `<h2>חתימות</h2><table class="info-table">`;
// // //   html += infoRow("חתימת מחנך/ת", f.teacherSignature || doc.teacherName);
// // //   html += infoRow("חתימת הנהלה", f.principalSignature);
// // //   html += infoRow("תאריך חתימה", f.signatureDate || f.date);
// // //   html += `</table>`;

// // //   return wrapHtmlDocument(
// // //     "שאלון בית ספר",
// // //     "מערכת דולב — ניהול והפקת אבחונים",
// // //     html,
// // //   );
// // // };

// // // exports.generateSchoolQuestionnairePDFBuffer = async (doc) =>
// // //   await htmlToPdfBuffer(generateSchoolQuestionnaireHTML(doc));

// // // // ============================================
// // // // טופס הסכמה -> PDF
// // // // ============================================
// // // const CONSENT_DECLARATION_TEXT =
// // //   "ההורים החתומים מטה אישרו את עריכת מבחני האבחון הפסיכולוגי לבן/בת " +
// // //   "המשפחה הרשום/ה מעלה. תוצאות האבחון יישמרו כחומר מקצועי חסוי.";

// // // const formatConsentDate = (iso) => {
// // //   if (!iso) return "—";
// // //   return new Date(iso).toLocaleString("he-IL", {
// // //     day: "numeric",
// // //     month: "long",
// // //     year: "numeric",
// // //     hour: "2-digit",
// // //     minute: "2-digit",
// // //   });
// // // };

// // // const renderConsentParentBlock = (parent, label) => {
// // //   if (!parent) return "";
// // //   let html = `<h3>${label}</h3><table class="info-table">`;
// // //   html += infoRow("שם", parent.name);
// // //   html += infoRow("מייל", parent.email);
// // //   html += infoRow("סטטוס", parent.signed ? "✅ חתם" : "⏳ ממתין");
// // //   if (parent.signed) {
// // //     html += infoRow("תאריך חתימה", formatConsentDate(parent.signedAt));
// // //     html += infoRow("חתימה", parent.signature);
// // //   } else if (parent.role === "external" && parent.inviteSentAt) {
// // //     html += infoRow("הוזמן בתאריך", formatConsentDate(parent.inviteSentAt));
// // //   }
// // //   html += `</table>`;
// // //   return html;
// // // };

// // // const generateConsentFormHTML = (doc) => {
// // //   const childInfo = doc.childInfo || {};
// // //   const parents = doc.parents || [];
// // //   const registered = parents.find((p) => p.role === "registered");
// // //   const external = parents.find((p) => p.role === "external");

// // //   let html = `<h2>פרטי הנבחן/ת</h2><table class="info-table">`;
// // //   html += infoRow("שם הנבחן/ת", childInfo.fullName);
// // //   html += infoRow("מספר מזהה", childInfo.idNumber);
// // //   html += infoRow("תאריך לידה", childInfo.birthDate);
// // //   html += infoRow("בית ספר/גן", childInfo.schoolOrGarden);
// // //   html += infoRow("נוצר בתאריך", formatConsentDate(doc.createdAt));
// // //   html += `</table>`;

// // //   html += `<h2>הצהרת ההסכמה</h2><div class="narrative-section"><p>${CONSENT_DECLARATION_TEXT}</p></div>`;

// // //   html += `<h2>חתימות ההורים</h2>`;
// // //   html += renderConsentParentBlock(registered, "הורה רשום במערכת");
// // //   html += external
// // //     ? renderConsentParentBlock(external, 'הורה שני (הוזמן ע"י המייל)')
// // //     : `<p>לא הוזמן הורה שני לטופס זה.</p>`;

// // //   return wrapHtmlDocument(
// // //     "טופס הסכמה לאבחון",
// // //     "מערכת דולב — ניהול והפקת אבחונים",
// // //     html,
// // //   );
// // // };

// // // exports.generateConsentFormPDFBuffer = async (doc) =>
// // //   await htmlToPdfBuffer(generateConsentFormHTML(doc));


// // // functions/services/pdf.service.js
// // const htmlPdf = require("html-pdf-node");

// // // העתק של הסטרוקטורה הרשמית שלכן לצורך ניתוח בשרת
// // const REPORT_STRUCTURE = [
// //   {
// //     id: "personalDetails",
// //     title: "פרטים אישיים",
// //     type: "infoTable",
// //     fields: [
// //       { id: "firstName", label: "שם פרטי" },
// //       { id: "lastName", label: "שם משפחה" },
// //       { id: "idNumber", label: "תעודת זהות" },
// //       { id: "birthDate", label: "תאריך לידה" },
// //       { id: "birthCountry", label: "ארץ לידה" },
// //       { id: "homeLanguage", label: "שפה מדוברת בבית" },
// //       { id: "address", label: "כתובת" },
// //       { id: "fatherName", label: "שם האב" },
// //       { id: "motherName", label: "שם האם" },
// //       { id: "school", label: "בית ספר" },
// //       { id: "grade", label: "כיתה" },
// //     ],
// //   },
// //   {
// //     id: "testDetails",
// //     title: "פרטי המבחן",
// //     type: "infoTable",
// //     fields: [
// //       { id: "firstTestDate", label: "תאריך בחינה ראשון" },
// //       { id: "ageAtTest", label: "גיל הנבחן בעת הבחינה" },
// //       { id: "secondTestDate", label: "תאריך בחינה שני" },
// //       { id: "examinerName", label: "שם הבוחן/ת" },
// //     ],
// //   },
// //   { id: "referralReason", title: "סיבת ההפניה להערכה", type: "narrative" },
// //   { id: "familyBackground", title: "רקע משפחתי והתפתחותי", type: "narrative" },
// //   { id: "educationalBackground", title: "רקע חינוכי", type: "narrative" },
// //   { id: "appearanceBehavior", title: "הופעה והתנהגות", type: "narrative" },
// //   { id: "assessmentTools", title: "כלי אבחון", type: "list" },
// //   {
// //     id: "findings",
// //     title: "ממצאי האבחון",
// //     type: "group",
// //     subsections: [
// //       { id: "intelligence", title: "משכל", type: "narrative" },
// //       {
// //         id: "fluidAbility",
// //         title: "יכולת פלואידית ותפקודים ניהוליים",
// //         type: "narrative",
// //       },
// //       { id: "crystallizedKnowledge", title: "ידע מגובש", type: "narrative" },
// //       { id: "auditoryProcessing", title: "עיבוד שמיעתי", type: "narrative" },
// //       {
// //         id: "visualProcessing",
// //         title: "עיבוד חזותי ותפקוד גרפו-מוטורי",
// //         type: "narrative",
// //       },
// //       {
// //         id: "processingSpeed",
// //         title: "מהירות עיבוד ותפקודי קשב",
// //         type: "narrative",
// //       },
// //     ],
// //   },
// //   {
// //     id: "memory",
// //     title: "תפקודי זיכרון",
// //     type: "group",
// //     subsections: [
// //       { id: "shortTermMemory", title: "זיכרון לטווח הקצר", type: "narrative" },
// //       {
// //         id: "longTermStorage",
// //         title: "אחסון ושליפה לטווח הארוך",
// //         type: "narrative",
// //       },
// //     ],
// //   },
// //   {
// //     id: "achievements",
// //     title: "תחומי הישג",
// //     type: "group",
// //     subsections: [
// //       { id: "reading", title: "קריאה", type: "narrative" },
// //       { id: "comprehension", title: "הבנת הנקרא והנשמע", type: "narrative" },
// //       { id: "oralExpression", title: "הבעה בעל פה", type: "narrative" },
// //       { id: "writing", title: "כתיבה והבעה בכתב", type: "narrative" },
// //       { id: "math", title: "חשבון", type: "narrative" },
// //       { id: "english", title: "תפקוד באנגלית", type: "narrative" },
// //     ],
// //   },
// //   { id: "emotionalBehavioral", title: "רגשי-התנהגותי", type: "narrative" },
// //   {
// //     id: "summary",
// //     title: "אינטגרציה וסיכום",
// //     type: "group",
// //     subsections: [
// //       { id: "summaryText", title: "סיכום", type: "narrative" },
// //       { id: "strengths", title: "תחומי חוזק", type: "list" },
// //       { id: "difficulties", title: "מוקדי הקושי", type: "list" },
// //     ],
// //   },
// //   {
// //     id: "recommendations",
// //     title: "המלצות",
// //     type: "group",
// //     subsections: [
// //       { id: "forParents", title: "להורים", type: "list" },
// //       { id: "forSchool", title: "לבית הספר", type: "list" },
// //       { id: "forExams", title: "במבחני בגרות", type: "list" },
// //     ],
// //   },
// //   {
// //     id: "scores",
// //     title: "ציוני המבחנים והמצרפים",
// //     type: "group",
// //     subsections: [
// //       {
// //         id: "subtests",
// //         title: "תת-מבחנים",
// //         type: "scoresTable",
// //         rows: [
// //           { id: "test1", label: "מבחן 1: הבנה מילולית" },
// //           { id: "test1d", label: "מבחן 1ד': אנלוגיות מילוליות" },
// //           { id: "test2", label: "מבחן 2: למידה חזותית-שמיעתית" },
// //           { id: "test3", label: "מבחן 3: עיבוד מרחבי" },
// //           { id: "test4", label: "מבחן 4: מיזוג צלילים" },
// //           { id: "test5", label: "מבחן 5: יצירת כללים" },
// //           { id: "test6", label: "מבחן 6: התאמה חזותית" },
// //           { id: "test7", label: "מבחן 7: זכירת מילים" },
// //           { id: "test8", label: "מבחן 8: ידע כללי" },
// //           { id: "test9", label: "מבחן 9: שטף סמנטי" },
// //           { id: "test10", label: "מבחן 10: זיהוי ציורים" },
// //           { id: "test11", label: "מבחן 11: מילים לא שלמות" },
// //           { id: "test12", label: "מבחן 12: אנליזה - סינתזה" },
// //           { id: "test13", label: "מבחן 13: מהירות החלטה" },
// //           { id: "test14", label: "מבחן 14: זכירת ספרות לאחור" },
// //           { id: "test15", label: "מבחן 15: זכירת שמות" },
// //           { id: "test16", label: "מבחן 16: תכנון" },
// //           { id: "test17", label: "מבחן 17: קשב שמיעתי" },
// //           { id: "test18", label: "מבחן 18: סדרות מספרים" },
// //           { id: "test19", label: "מבחן 19: איתור ציורים מהיר" },
// //           { id: "test20", label: "מבחן 20: זיכרון עבודה שמיעתי" },
// //           { id: "test21", label: "מבחן 21: שיום תמונות מהיר" },
// //         ],
// //       },
// //       {
// //         id: "composites",
// //         title: "מדדים ומצרפים",
// //         type: "scoresTable",
// //         rows: [
// //           { id: "iqShort", label: "מנת משכל כוללת – מדד מקוצר (1-7)" },
// //           { id: "iqFull", label: "מנת משכל כוללת (1-14)" },
// //           { id: "cpmAcquired", label: "ידע נרכש (CPM)" },
// //           { id: "cpmReasoningExt", label: "יכולת חשיבה – מדד מורחב" },
// //           { id: "cpmReasoningShort", label: "יכולת חשיבה – מדד מקוצר" },
// //           { id: "cpmCognitiveEff", label: "יעילות קוגניטיבית" },
// //           { id: "chcCrystallized", label: "ידע מגובש" },
// //           { id: "chcLongTerm", label: "אחסון ושליפה לטווח ארוך" },
// //           { id: "chcVisual", label: "עיבוד חזותי" },
// //           { id: "chcAuditory", label: "עיבוד שמיעתי" },
// //           { id: "chcFluid", label: "יכולת פלואידית" },
// //           { id: "chcSpeed", label: "מהירות עיבוד" },
// //           { id: "chcShortMem", label: "זיכרון לטווח קצר" },
// //           { id: "chc2018Learning", label: "יעילות בלמידה" },
// //           { id: "chc2018Retrieval", label: "שטף שליפה" },
// //           { id: "chcVisualExt", label: "עיבוד חזותי – מורחב" },
// //           { id: "chcAuditoryExt", label: "עיבוד שמיעתי – מורחב" },
// //           { id: "chcFluidExt", label: "יכולת פלואידית – מורחב" },
// //           { id: "chcSpeedExt", label: "מהירות עיבוד – מורחב" },
// //           { id: "chcShortMemExt", label: "זיכרון לטווח קצר – מורחב" },
// //         ],
// //       },
// //     ],
// //   },
// // ];

// // // עמודות לטבלאות הציונים
// // const SCORE_COLUMNS = [
// //   { id: "raw", label: "ציון גלם" },
// //   { id: "standard", label: "ציון תקן" },
// //   { id: "percentile", label: "אחוזון" },
// //   { id: "ci", label: "רווח בר סמך (68%)" },
// // ];

// // /**
// //  * בודק האם יש תוכן אמיתי בסעיף מסוים בהתאם לטיפוס שלו
// //  */
// // const sectionHasData = (type, data) => {
// //   if (!data) return false;
// //   if (type === "narrative" && typeof data === "string")
// //     return data.trim() !== "";
// //   if (type === "list" && Array.isArray(data))
// //     return data.some((i) => i && i.trim() !== "");
// //   if (type === "infoTable" && typeof data === "object")
// //     return Object.values(data).some((v) => v && String(v).trim() !== "");
// //   if (type === "scoresTable" && typeof data === "object") {
// //     return Object.values(data).some(
// //       (row) =>
// //         row &&
// //         Object.values(row).some((cell) => cell && String(cell).trim() !== ""),
// //     );
// //   }
// //   return false;
// // };

// // /**
// //  * פונקציה שמייצרת HTML עבור סעיף ספציפי מתוך המבנה המוגדר
// //  */
// // const renderSingleSection = (section, sectionData) => {
// //   if (!sectionHasData(section.type, sectionData)) return "";

// //   let html = "";

// //   // 1. נרטיב / טקסט חופשי
// //   if (section.type === "narrative") {
// //     html += `<div class="narrative-section"><h3>${section.title}</h3><p>${sectionData.replace(/\n/g, "<br>")}</p></div>`;
// //   }

// //   // 2. רשימה (Bullets)
// //   else if (section.type === "list") {
// //     html += `<h3>${section.title}</h3><ul>`;
// //     sectionData.forEach((item, idx) => {
// //       if (item && item.trim() !== "") {
// //         html += `<li><strong>${idx + 1}.</strong> ${item}</li>`;
// //       }
// //     });
// //     html += `</ul>`;
// //   }

// //   // 3. טבלת מידע (Info Table) כמו פרטים אישיים
// //   else if (section.type === "infoTable") {
// //     html += `<h3>${section.title}</h3><table class="info-table">`;
// //     section.fields.forEach((field) => {
// //       const val = sectionData[field.id];
// //       if (val && String(val).trim() !== "") {
// //         html += `<tr><td class="info-label">${field.label}</td><td class="info-value">${val}</td></tr>`;
// //       }
// //     });
// //     html += `</table>`;
// //   }

// //   // 4. טבלת ציונים מובנית (Scores Table)
// //   else if (section.type === "scoresTable") {
// //     html += `<h3>${section.title}</h3><table class="scores-table"><thead><tr>`;
// //     html += `<th style="text-align: right;">מבחן / מדד</th>`;
// //     SCORE_COLUMNS.forEach((col) => (html += `<th>${col.label}</th>`));
// //     html += `</tr></thead><tbody>`;

// //     section.rows.forEach((row) => {
// //       const rowData = sectionData[row.id];
// //       const hasRowValues =
// //         rowData &&
// //         Object.values(rowData).some((c) => c && String(c).trim() !== "");

// //       if (hasRowValues) {
// //         html += `<tr><td style="text-align: right; font-weight: bold; background: #f8f9fa;">${row.label}</td>`;
// //         SCORE_COLUMNS.forEach((col) => {
// //           html += `<td>${rowData[col.id] || "-"}</td>`;
// //         });
// //         html += `</tr>`;
// //       }
// //     });
// //     html += `</tbody></table>`;
// //   }

// //   return html;
// // };

// // // CSS משותף לכל מסמכי ה-PDF שהמערכת מייצרת (דוח, שאלונים, טופס הסכמה) -
// // // כדי שכולם ייראו עקביים ולא נשכפל את הבלוק הזה בכל generator.
// // const PDF_BASE_STYLE = `
// //     body { font-family: 'Arial', sans-serif; direction: rtl; text-align: right; padding: 45px; line-height: 1.6; color: #2c3e50; }
// //     h1 { text-align: center; color: #1a5f7a; margin-bottom: 5px; font-size: 26px; font-weight: bold; }
// //     .subtitle { text-align: center; color: #7f8c8d; margin-bottom: 35px; font-size: 15px; }
// //     h2 { color: #1a5f7a; border-bottom: 3px solid #1a5f7a; padding-bottom: 5px; margin-top: 40px; font-size: 22px; font-weight: bold; page-break-after: avoid; }
// //     h3 { color: #2980b9; font-size: 16px; margin-top: 20px; margin-bottom: 8px; font-weight: bold; page-break-after: avoid; }
// //     p { font-size: 14px; text-align: justify; margin-bottom: 12px; color: #34495e; }
// //     ul { font-size: 14px; padding-right: 20px; margin-bottom: 15px; }
// //     li { margin-bottom: 6px; color: #34495e; }

// //     table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px; font-size: 13px; page-break-inside: avoid; }
// //     th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: center; }
// //     th { background-color: #f1f5f9; color: #1a5f7a; font-weight: bold; }

// //     .info-table { width: 100%; border: none; }
// //     .info-table td { border: 1px solid #e2e8f0; padding: 10px; }
// //     .info-label { width: 30%; background-color: #f8f9fa; font-weight: bold; text-align: right; color: #475569; }
// //     .info-value { text-align: right; color: #1e293b; }

// //     .narrative-section { margin-bottom: 20px; }
// // `;

// // /**
// //  * עוטפת body HTML במעטפת <html>/<head>/<style> אחידה לכל מסמכי ה-PDF.
// //  */
// // const wrapHtmlDocument = (title, subtitle, bodyHtml) => `
// //         <html>
// //         <head>
// //             <meta charset="utf-8">
// //             <style>${PDF_BASE_STYLE}</style>
// //         </head>
// //         <body>
// //             <h1>${title}</h1>
// //             <div class="subtitle">${subtitle}</div>
// //             ${bodyHtml}
// //         </body>
// //         </html>
// //     `;

// // /**
// //  * שורת <tr> יחידה בטבלת מידע (info-table) - מדולגת אם אין ערך, כמו
// //  * ב-renderSingleSection הקיים.
// //  */
// // const infoRow = (label, value) => {
// //   if (value === undefined || value === null || String(value).trim() === "")
// //     return "";
// //   return `<tr><td class="info-label">${label}</td><td class="info-value">${value}</td></tr>`;
// // };

// // /**
// //  * טבלה גנרית (headers + rows) לרשימות כמו מהלך לימודים/אחים/סדר יום.
// //  */
// // const dataTable = (headers, rows) => {
// //   const validRows = (rows || []).filter((row) =>
// //     row.some((cell) => cell && String(cell).trim() !== ""),
// //   );
// //   if (validRows.length === 0) return "";

// //   let html = `<table><thead><tr>`;
// //   headers.forEach((h) => (html += `<th>${h}</th>`));
// //   html += `</tr></thead><tbody>`;
// //   validRows.forEach((row) => {
// //     html += `<tr>${row.map((cell) => `<td>${cell || "-"}</td>`).join("")}</tr>`;
// //   });
// //   html += `</tbody></table>`;
// //   return html;
// // };

// // /**
// //  * המייצר הראשי של ה-HTML
// //  */
// // const generateReportHTML = (formData) => {
// //   let htmlContent = "";

// //   // מעבר על הסטרוקטורה הראשית של הדוח
// //   REPORT_STRUCTURE.forEach((section) => {
// //     const sectionData = formData[section.id];
// //     if (!sectionData) return;

// //     // מקרה א': קבוצה של תת-סעיפים (Group)
// //     if (section.type === "group" && section.subsections) {
// //       let groupHtml = "";

// //       section.subsections.forEach((sub) => {
// //         const subData = sectionData[sub.id];
// //         const subHtml = renderSingleSection(sub, subData);
// //         if (subHtml) {
// //           groupHtml += subHtml;
// //         }
// //       });

// //       if (groupHtml) {
// //         htmlContent += `<h2>${section.title}</h2>` + groupHtml;
// //       }
// //     }
// //     // מקרה ב': סעיף רגיל ברמה העליונה (infoTable, narrative, list)
// //     else {
// //       const sectionHtml = renderSingleSection(section, sectionData);
// //       if (sectionHtml) {
// //         htmlContent += `<h2>${section.title}</h2>` + sectionHtml;
// //       }
// //     }
// //   });

// //   return wrapHtmlDocument(
// //     "חוות דעת פסיכולוגית",
// //     "מערכת דולב — ניהול והפקת אבחונים",
// //     htmlContent,
// //   );
// // };

// // const PDF_OPTIONS = {
// //   format: "A4",
// //   margin: { top: "25mm", bottom: "25mm", left: "20mm", right: "20mm" },
// // };

// // /** ממירה HTML מוכן ל-Buffer של PDF - משותף לכל ה-generators בקובץ */
// // const htmlToPdfBuffer = async (htmlContent) =>
// //   await htmlPdf.generatePdf({ content: htmlContent }, PDF_OPTIONS);

// // /**
// //  * הפונקציה הציבורית שממירה את ה-HTML ל-PDF Buffer
// //  */
// // exports.generatePDFBuffer = async (reportData) => {
// //   // שולחים לרינדור בדיוק את ה-formData (או את ה-reportData עצמו במידה והוא מגיע שלם)
// //   const dataToRender = reportData.formData ? reportData.formData : reportData;
// //   return await htmlToPdfBuffer(generateReportHTML(dataToRender));
// // };

// // // ============================================
// // // שאלון הורים -> PDF
// // // ============================================
// // const generateParentQuestionnaireHTML = (doc) => {
// //   const f = doc.formData || {};
// //   let html = "";

// //   html += `<h2>פרטים אישיים</h2><table class="info-table">`;
// //   html += infoRow(
// //     "שם הילד/ה",
// //     `${f.childFirstName || ""} ${f.childLastName || ""}`.trim(),
// //   );
// //   html += infoRow("ת.ז", f.idNumber);
// //   html += infoRow("תאריך לידה", f.birthDate);
// //   html += infoRow("מין", f.gender);
// //   html += infoRow("ארץ לידה", f.birthCountry);
// //   html += infoRow("תאריך עלייה", f.aliyaDate);
// //   html += infoRow("שם האב", f.fatherName);
// //   html += infoRow("שם האם", f.motherName);
// //   html += infoRow("מצב משפחתי", f.familyStatus);
// //   html += infoRow("שפה בבית", f.homeLanguage);
// //   html += infoRow("טלפון", f.phone);
// //   html += infoRow("בית ספר / גן", f.schoolOrGarden);
// //   html += infoRow("כיתה", f.grade);
// //   html += infoRow("כתובת", f.address);
// //   html += infoRow("הערות למצב המשפחתי", f.familyNotes);
// //   html += `</table>`;

// //   html += `<h2>סיבת הפנייה ואבחונים קודמים</h2><table class="info-table">`;
// //   html += infoRow("תיאור הקושי", f.difficultyDescription);
// //   html += infoRow("מטרות הפנייה", f.referralGoals);
// //   html += infoRow("מתי התחילו הקשיים?", f.onsetTime);
// //   html += infoRow("האם הביע/ה מצוקה בעניין?", f.expressedDistress);
// //   html += infoRow("האם מוכן/ה להיוועץ?", f.willingToConsult);
// //   html += infoRow("עבר אבחון בעבר?", f.hadAssessment);
// //   if (f.hadAssessment === "כן") {
// //     html += infoRow("סוג אבחון קודם", f.assessmentType);
// //     html += infoRow("תאריך האבחון", f.assessmentDate);
// //     html += infoRow("המלצות אבחונים", f.assessmentRecommendations);
// //   }
// //   html += infoRow("טיפולים פרא-רפואיים", f.paraMedicalTreatments);
// //   html += `</table>`;
// //   if (f.assessmentFiles?.length) {
// //     html += `<h3>מסמכי אבחון קודם מצורפים</h3><ul>`;
// //     f.assessmentFiles.forEach((file) => (html += `<li>${file.name}</li>`));
// //     html += `</ul>`;
// //   }

// //   html += `<h2>היסטוריה לימודית</h2><table class="info-table">`;
// //   html += infoRow("גיל יציאה למסגרת", f.firstFrameworkAge);
// //   html += infoRow("סוג מסגרת ראשונה", f.firstFrameworkType);
// //   html += infoRow("דיווח טרום גן חובה", f.prePreSchoolReports);
// //   html += infoRow("דיווח גן חובה", f.preSchoolReports);
// //   html += infoRow("נשאר כיתה?", f.stayedGrade);
// //   html += infoRow("באיזו כיתה?", f.stayedGradeWhich);
// //   html += infoRow("סיבה", f.stayedGradeReason);
// //   html += `</table>`;
// //   html += dataTable(
// //     ["כיתה", "בית ספר", "יישוב"],
// //     f.schoolHistory?.map((s) => [s.grade, s.school, s.city]),
// //   );

// //   html += `<h2>הערכת תפקוד כללית</h2><table class="info-table">`;
// //   html += infoRow("תפקוד לימודי", f.functioning?.studies);
// //   html += infoRow("תפקוד משפחתי", f.functioning?.family);
// //   html += infoRow("תפקוד חברתי", f.functioning?.social);
// //   html += infoRow("הערות תפקוד", f.functioning?.notes);
// //   html += `</table>`;

// //   html += `<h2>מבנה המשפחה</h2><table class="info-table">`;
// //   html += infoRow("שם האם (בטבלה)", f.familyStructure?.motherNameInTable);
// //   html += infoRow("גיל האם", f.familyStructure?.motherAge);
// //   html += infoRow("עיסוק האם", f.familyStructure?.motherJob);
// //   html += infoRow("הערות (אם)", f.familyStructure?.motherNotes);
// //   html += infoRow("שם האב (בטבלה)", f.familyStructure?.fatherNameInTable);
// //   html += infoRow("גיל האב", f.familyStructure?.fatherAge);
// //   html += infoRow("עיסוק האב", f.familyStructure?.fatherJob);
// //   html += infoRow("הערות (אב)", f.familyStructure?.fatherNotes);
// //   html += `</table>`;
// //   html += dataTable(
// //     ["שם", "גיל", "מסגרת", "הערות"],
// //     f.familyStructure?.siblings?.map((s) => [
// //       s.name,
// //       s.age,
// //       s.framework,
// //       s.notes,
// //     ]),
// //   );

// //   html += `<h2>בריאות</h2><table class="info-table">`;
// //   html += infoRow("מצב בריאותי כללי", f.generalHealth);
// //   html += infoRow("בדיקת ראייה - תאריך", f.visionDate);
// //   html += infoRow("ממצא בדיקת ראייה", f.visionFindings);
// //   html += infoRow("בדיקת שמיעה - תאריך", f.hearingDate);
// //   html += infoRow("ממצא בדיקת שמיעה", f.hearingFindings);
// //   html += infoRow("מחלות בעבר/הווה", f.pastDiseases);
// //   html += infoRow("אשפוז?", f.hospitalization);
// //   html += infoRow("באיזה גיל אושפז/ה?", f.hospitalizationAge);
// //   html += infoRow("לכמה זמן אושפז/ה?", f.hospitalizationDuration);
// //   html += infoRow("סיבת האשפוז", f.hospitalizationReason);
// //   html += infoRow("נוטל תרופות באופן קבוע?", f.regularMedications);
// //   html += `</table>`;

// //   html += `<h2>רקע התפתחותי</h2><table class="info-table">`;
// //   html += infoRow("הריון מתוכנן?", f.development?.plannedPregnancy);
// //   html += infoRow("הריון תקין?", f.development?.normalPregnancy);
// //   html += infoRow("פרטי ההריון", f.development?.pregnancyDetails);
// //   html += infoRow("לידה תקינה?", f.development?.normalBirth);
// //   html += infoRow("משקל לידה", f.development?.birthWeight);
// //   html += infoRow("פרטי הלידה", f.development?.birthDetails);
// //   html += infoRow(
// //     "בעיות רפואיות לילד לאחר הלידה",
// //     f.development?.problemsAfterBirthChild,
// //   );
// //   html += infoRow(
// //     "בעיות רפואיות לאם לאחר הלידה",
// //     f.development?.problemsAfterBirthMother,
// //   );
// //   html += infoRow("התפתחות מוטורית תקינה?", f.development?.normalMotorDev);
// //   html += infoRow("גיל הליכה", f.development?.walkingAge);
// //   html += infoRow("התפתחות שפתית תקינה?", f.development?.normalLanguageDev);
// //   html += infoRow("גיל דיבור (מילים ראשונות)", f.development?.firstWordsAge);
// //   html += infoRow(
// //     "קשיי שינה בשנה הראשונה?",
// //     f.development?.sleepIssuesFirstYear,
// //   );
// //   html += infoRow(
// //     "קשיי אכילה בשנה הראשונה?",
// //     f.development?.eatingIssuesFirstYear,
// //   );
// //   html += infoRow(
// //     "גיל גמילה מחיתולים",
// //     f.development?.diaperGraduationAge,
// //   );
// //   html += `</table>`;

// //   html += `<h2>התנהגות ותפקוד בבית</h2><table class="info-table">`;
// //   html += infoRow(
// //     "בעיות אוכל/שינה/פחדים",
// //     f.currentProblems?.foodSleepFearsDetails,
// //   );
// //   html += infoRow("חוסר מנוחה/פעילות יתר", f.currentProblems?.restlessness);
// //   html += infoRow("מתרגש בקלות", f.currentProblems?.excitedEasily);
// //   html += infoRow("מפריע לאחרים", f.currentProblems?.disturbsOthers);
// //   html += infoRow(
// //     "מתקשה להתמיד ולסיים משימות?",
// //     f.currentProblems?.difficultyCompletingTasks,
// //   );
// //   html += infoRow(
// //     "זקוק/ה לתשומת לב רבה במיוחד?",
// //     f.currentProblems?.needsSpecialAttention,
// //   );
// //   html += infoRow(
// //     "תלותי/עצמאי",
// //     f.currentProblems?.dependencyVsIndependence,
// //   );
// //   html += infoRow("אחר", f.currentProblems?.otherBehavioral);
// //   html += infoRow("למי קרוב יותר?", f.currentProblems?.closerToWho);
// //   html += `</table>`;

// //   html += `<h2>תפקוד חברתי</h2><table class="info-table">`;
// //   html += infoRow("יש חברים?", f.social?.hasFriends);
// //   html += infoRow("רמת חברותיות", f.social?.socialLevel);
// //   html += infoRow(
// //     "קשרים חברתיים קרובים ומשמעותיים?",
// //     f.social?.meaningfulConnections,
// //   );
// //   html += infoRow(
// //     "קשרים עם בני המין השני?",
// //     f.social?.oppositeSexConnections,
// //   );
// //   html += infoRow("בעיות חברתיות - פירוט", f.social?.socialProblemsDetails);
// //   html += `</table>`;

// //   html += `<h2>סדר יום אופייני</h2>`;
// //   html += dataTable(
// //     ["שעה", "פעילות"],
// //     f.dailyRoutine?.map((r) => [r.time, r.activity]),
// //   );

// //   html += `<h2>חתימה</h2><table class="info-table">`;
// //   html += infoRow("חתימת הורים", f.parentsSignature);
// //   html += infoRow("תאריך חתימה", f.signatureDate);
// //   html += infoRow(
// //     "הוגש בתאריך",
// //     doc.submittedAt
// //       ? new Date(doc.submittedAt).toLocaleString("he-IL")
// //       : "",
// //   );
// //   html += `</table>`;

// //   return wrapHtmlDocument(
// //     "שאלון הורים",
// //     "מערכת דולב — ניהול והפקת אבחונים",
// //     html,
// //   );
// // };

// // exports.generateParentQuestionnairePDFBuffer = async (doc) =>
// //   await htmlToPdfBuffer(generateParentQuestionnaireHTML(doc));

// // // ============================================
// // // שאלון בית ספר -> PDF
// // // ============================================
// // const generateSchoolQuestionnaireHTML = (doc) => {
// //   const f = doc.formData || {};
// //   let html = "";

// //   html += `<h2>פרטי הדיווח והתלמיד</h2><table class="info-table">`;
// //   html += infoRow(
// //     "שם התלמיד/ה",
// //     `${f.firstName || ""} ${f.lastName || ""}`.trim(),
// //   );
// //   html += infoRow("תעודת זהות", f.idNumber);
// //   html += infoRow("תאריך לידה", f.birthDate);
// //   html += infoRow("כיתה", f.grade);
// //   html += infoRow("בית ספר", f.school);
// //   html += infoRow("שם המחנך/ת המדווח", doc.teacherName);
// //   html += infoRow("מייל המורה", doc.teacherEmail);
// //   html += infoRow("טלפון המורה", f.teacherPhone);
// //   html += infoRow(
// //     "תאריך הגשה",
// //     doc.submittedAt
// //       ? new Date(doc.submittedAt).toLocaleDateString("he-IL")
// //       : "",
// //   );
// //   html += `</table>`;

// //   html += `<h2>סיבת ההפניה</h2><table class="info-table">`;
// //   html += infoRow("מי יזם את הפנייה?", f.referralInitiator);
// //   html += infoRow("סיבות הפנייה המרכזיות", f.referralReasons);
// //   html += infoRow("תיאור קשיי התלמיד", f.difficultyDescription);
// //   html += `</table>`;

// //   html += `<h2>הישגים לימודיים ותפקוד</h2>`;
// //   html += dataTable(
// //     ["כיתה", "בית ספר"],
// //     f.schoolHistory
// //       ?.filter((h) => h.grade || h.school)
// //       .map((h) => [h.grade, h.school]),
// //   );
// //   html += `<table class="info-table">`;
// //   html += infoRow("רמה אקדמית בהשוואה לכיתה", f.academicLevel);
// //   html += infoRow("האם נשאר כיתה?", f.stayedGrade);
// //   html += infoRow(
// //     "באיזו כיתה ולמה?",
// //     `${f.stayedGradeWhich || ""} ${f.stayedGradeReasons || ""}`.trim(),
// //   );
// //   html += infoRow("קריאה", f.reading);
// //   html += infoRow("כתיבה", f.writing);
// //   html += infoRow("חשבון", f.math);
// //   html += `</table>`;

// //   html += `<h2>יחסים והתנהגות כללית</h2><table class="info-table">`;
// //   html += infoRow("טיב היחס אל המורים", f.teacherRelation);
// //   html += infoRow("הערות ליחס למורים", f.teacherRelationNotes);
// //   html += infoRow("טיב היחסים עם בני הכיתה", f.peerRelation);
// //   html += infoRow("בעיות חברתיות", f.peerProblems);
// //   html += infoRow("1. דעתו מוסחת בקלות", f.distractedEasily);
// //   html += infoRow("2. מתקשה להתרכז במשימות", f.hardToFocus);
// //   html += infoRow("3. נע/מסתובב/מטפס באופן מוגזם", f.excessiveMovement);
// //   html += infoRow("4. עוזב את הכיסא בשיעור", f.leavesSeats);
// //   html += `</table>`;

// //   if (f.behaviorRatings && Object.keys(f.behaviorRatings).length > 0) {
// //     html += `<h2>דירוג בעיות התנהגות מפורטות</h2><table class="info-table">`;
// //     Object.entries(f.behaviorRatings).forEach(([behavior, rating]) => {
// //       html += infoRow(behavior, rating);
// //     });
// //     html += `</table>`;
// //   }

// //   html += `<h2>עזרה מיוחדת, התערבות וסיכום</h2><table class="info-table">`;
// //   html += infoRow("שעות שילוב", f.integrationHours);
// //   html += infoRow("היקף (שש)", f.integrationScope);
// //   html += infoRow("כמה שנים", f.integrationYears);
// //   html += infoRow(
// //     "טיפול רגשי",
// //     `${f.emotionalTreatment || ""} ${f.emotionalTreatmentDetails ? `(${f.emotionalTreatmentDetails})` : ""}`.trim(),
// //   );
// //   html += infoRow(
// //     "חינוך מיוחד",
// //     `${f.specialEducation || ""} ${f.specialEdName ? `(${f.specialEdName})` : ""}`.trim(),
// //   );
// //   html += infoRow("עזרה אחרת", f.otherHelp);
// //   html += infoRow("סכם התרשמותך מהתלמיד/ה", f.studentSummary);
// //   html += infoRow("שאלה אבחונית או אחרת", f.diagnosticQuestion);
// //   html += infoRow("ההתערבות הטיפולית המבוקשת", f.requestedIntervention);
// //   html += `</table>`;

// //   html += `<h2>חתימות</h2><table class="info-table">`;
// //   html += infoRow("חתימת מחנך/ת", f.teacherSignature || doc.teacherName);
// //   html += infoRow("חתימת הנהלה", f.principalSignature);
// //   html += infoRow("תאריך חתימה", f.signatureDate || f.date);
// //   html += `</table>`;

// //   return wrapHtmlDocument(
// //     "שאלון בית ספר",
// //     "מערכת דולב — ניהול והפקת אבחונים",
// //     html,
// //   );
// // };

// // exports.generateSchoolQuestionnairePDFBuffer = async (doc) =>
// //   await htmlToPdfBuffer(generateSchoolQuestionnaireHTML(doc));

// // // ============================================
// // // טופס הסכמה -> PDF
// // // ============================================
// // const CONSENT_DECLARATION_TEXT =
// //   "ההורים החתומים מטה אישרו את עריכת מבחני האבחון הפסיכולוגי לבן/בת " +
// //   "המשפחה הרשום/ה מעלה. תוצאות האבחון יישמרו כחומר מקצועי חסוי.";

// // const formatConsentDate = (iso) => {
// //   if (!iso) return "—";
// //   return new Date(iso).toLocaleString("he-IL", {
// //     day: "numeric",
// //     month: "long",
// //     year: "numeric",
// //     hour: "2-digit",
// //     minute: "2-digit",
// //   });
// // };

// // const renderConsentParentBlock = (parent, label) => {
// //   if (!parent) return "";
// //   let html = `<h3>${label}</h3><table class="info-table">`;
// //   html += infoRow("שם", parent.name);
// //   html += infoRow("מייל", parent.email);
// //   html += infoRow("סטטוס", parent.signed ? "✅ חתם" : "⏳ ממתין");
// //   if (parent.signed) {
// //     html += infoRow("תאריך חתימה", formatConsentDate(parent.signedAt));
// //     html += infoRow("חתימה", parent.signature);
// //   } else if (parent.role === "external" && parent.inviteSentAt) {
// //     html += infoRow("הוזמן בתאריך", formatConsentDate(parent.inviteSentAt));
// //   }
// //   html += `</table>`;
// //   return html;
// // };

// // const generateConsentFormHTML = (doc) => {
// //   const childInfo = doc.childInfo || {};
// //   const parents = doc.parents || [];
// //   const registered = parents.find((p) => p.role === "registered");
// //   const external = parents.find((p) => p.role === "external");

// //   let html = `<h2>פרטי הנבחן/ת</h2><table class="info-table">`;
// //   html += infoRow("שם הנבחן/ת", childInfo.fullName);
// //   html += infoRow("מספר מזהה", childInfo.idNumber);
// //   html += infoRow("תאריך לידה", childInfo.birthDate);
// //   html += infoRow("בית ספר/גן", childInfo.schoolOrGarden);
// //   html += infoRow("נוצר בתאריך", formatConsentDate(doc.createdAt));
// //   html += `</table>`;

// //   html += `<h2>הצהרת ההסכמה</h2><div class="narrative-section"><p>${CONSENT_DECLARATION_TEXT}</p></div>`;

// //   html += `<h2>חתימות ההורים</h2>`;
// //   html += renderConsentParentBlock(registered, "הורה רשום במערכת");
// //   html += external
// //     ? renderConsentParentBlock(external, 'הורה שני (הוזמן ע"י המייל)')
// //     : `<p>לא הוזמן הורה שני לטופס זה.</p>`;

// //   return wrapHtmlDocument(
// //     "טופס הסכמה לאבחון",
// //     "מערכת דולב — ניהול והפקת אבחונים",
// //     html,
// //   );
// // };

// // exports.generateConsentFormPDFBuffer = async (doc) =>
// //   await htmlToPdfBuffer(generateConsentFormHTML(doc));

// // functions/services/pdf.service.js
// const htmlPdf = require("html-pdf-node");

// // העתק של הסטרוקטורה הרשמית שלכן לצורך ניתוח בשרת
// const REPORT_STRUCTURE = [
//   {
//     id: "personalDetails",
//     title: "פרטים אישיים",
//     type: "infoTable",
//     fields: [
//       { id: "firstName", label: "שם פרטי" },
//       { id: "lastName", label: "שם משפחה" },
//       { id: "idNumber", label: "תעודת זהות" },
//       { id: "birthDate", label: "תאריך לידה" },
//       { id: "birthCountry", label: "ארץ לידה" },
//       { id: "homeLanguage", label: "שפה מדוברת בבית" },
//       { id: "address", label: "כתובת" },
//       { id: "fatherName", label: "שם האב" },
//       { id: "motherName", label: "שם האם" },
//       { id: "school", label: "בית ספר" },
//       { id: "grade", label: "כיתה" },
//     ],
//   },
//   {
//     id: "testDetails",
//     title: "פרטי המבחן",
//     type: "infoTable",
//     fields: [
//       { id: "firstTestDate", label: "תאריך בחינה ראשון" },
//       { id: "ageAtTest", label: "גיל הנבחן בעת הבחינה" },
//       { id: "secondTestDate", label: "תאריך בחינה שני" },
//       { id: "examinerName", label: "שם הבוחן/ת" },
//     ],
//   },
//   { id: "referralReason", title: "סיבת ההפניה להערכה", type: "narrative" },
//   { id: "familyBackground", title: "רקע משפחתי והתפתחותי", type: "narrative" },
//   { id: "educationalBackground", title: "רקע חינוכי", type: "narrative" },
//   { id: "appearanceBehavior", title: "הופעה והתנהגות", type: "narrative" },
//   { id: "assessmentTools", title: "כלי אבחון", type: "list" },
//   {
//     id: "findings",
//     title: "ממצאי האבחון",
//     type: "group",
//     subsections: [
//       { id: "intelligence", title: "משכל", type: "narrative" },
//       {
//         id: "fluidAbility",
//         title: "יכולת פלואידית ותפקודים ניהוליים",
//         type: "narrative",
//       },
//       { id: "crystallizedKnowledge", title: "ידע מגובש", type: "narrative" },
//       { id: "auditoryProcessing", title: "עיבוד שמיעתי", type: "narrative" },
//       {
//         id: "visualProcessing",
//         title: "עיבוד חזותי ותפקוד גרפו-מוטורי",
//         type: "narrative",
//       },
//       {
//         id: "processingSpeed",
//         title: "מהירות עיבוד ותפקודי קשב",
//         type: "narrative",
//       },
//     ],
//   },
//   {
//     id: "memory",
//     title: "תפקודי זיכרון",
//     type: "group",
//     subsections: [
//       { id: "shortTermMemory", title: "זיכרון לטווח הקצר", type: "narrative" },
//       {
//         id: "longTermStorage",
//         title: "אחסון ושליפה לטווח הארוך",
//         type: "narrative",
//       },
//     ],
//   },
//   {
//     id: "achievements",
//     title: "תחומי הישג",
//     type: "group",
//     subsections: [
//       { id: "reading", title: "קריאה", type: "narrative" },
//       { id: "comprehension", title: "הבנת הנקרא והנשמע", type: "narrative" },
//       { id: "oralExpression", title: "הבעה בעל פה", type: "narrative" },
//       { id: "writing", title: "כתיבה והבעה בכתב", type: "narrative" },
//       { id: "math", title: "חשבון", type: "narrative" },
//       { id: "english", title: "תפקוד באנגלית", type: "narrative" },
//     ],
//   },
//   { id: "emotionalBehavioral", title: "רגשי-התנהגותי", type: "narrative" },
//   {
//     id: "summary",
//     title: "אינטגרציה וסיכום",
//     type: "group",
//     subsections: [
//       { id: "summaryText", title: "סיכום", type: "narrative" },
//       { id: "strengths", title: "תחומי חוזק", type: "list" },
//       { id: "difficulties", title: "מוקדי הקושי", type: "list" },
//     ],
//   },
//   {
//     id: "recommendations",
//     title: "המלצות",
//     type: "group",
//     subsections: [
//       { id: "forParents", title: "להורים", type: "list" },
//       { id: "forSchool", title: "לבית הספר", type: "list" },
//       { id: "forExams", title: "במבחני בגרות", type: "list" },
//     ],
//   },
//   {
//     id: "scores",
//     title: "ציוני המבחנים והמצרפים",
//     type: "group",
//     subsections: [
//       {
//         id: "subtests",
//         title: "תת-מבחנים",
//         type: "scoresTable",
//         rows: [
//           { id: "test1", label: "מבחן 1: הבנה מילולית" },
//           { id: "test1d", label: "מבחן 1ד': אנלוגיות מילוליות" },
//           { id: "test2", label: "מבחן 2: למידה חזותית-שמיעתית" },
//           { id: "test3", label: "מבחן 3: עיבוד מרחבי" },
//           { id: "test4", label: "מבחן 4: מיזוג צלילים" },
//           { id: "test5", label: "מבחן 5: יצירת כללים" },
//           { id: "test6", label: "מבחן 6: התאמה חזותית" },
//           { id: "test7", label: "מבחן 7: זכירת מילים" },
//           { id: "test8", label: "מבחן 8: ידע כללי" },
//           { id: "test9", label: "מבחן 9: שטף סמנטי" },
//           { id: "test10", label: "מבחן 10: זיהוי ציורים" },
//           { id: "test11", label: "מבחן 11: מילים לא שלמות" },
//           { id: "test12", label: "מבחן 12: אנליזה - סינתזה" },
//           { id: "test13", label: "מבחן 13: מהירות החלטה" },
//           { id: "test14", label: "מבחן 14: זכירת ספרות לאחור" },
//           { id: "test15", label: "מבחן 15: זכירת שמות" },
//           { id: "test16", label: "מבחן 16: תכנון" },
//           { id: "test17", label: "מבחן 17: קשב שמיעתי" },
//           { id: "test18", label: "מבחן 18: סדרות מספרים" },
//           { id: "test19", label: "מבחן 19: איתור ציורים מהיר" },
//           { id: "test20", label: "מבחן 20: זיכרון עבודה שמיעתי" },
//           { id: "test21", label: "מבחן 21: שיום תמונות מהיר" },
//         ],
//       },
//       {
//         id: "composites",
//         title: "מדדים ומצרפים",
//         type: "scoresTable",
//         rows: [
//           { id: "iqShort", label: "מנת משכל כוללת – מדד מקוצר (1-7)" },
//           { id: "iqFull", label: "מנת משכל כוללת (1-14)" },
//           { id: "cpmAcquired", label: "ידע נרכש (CPM)" },
//           { id: "cpmReasoningExt", label: "יכולת חשיבה – מדד מורחב" },
//           { id: "cpmReasoningShort", label: "יכולת חשיבה – מדד מקוצר" },
//           { id: "cpmCognitiveEff", label: "יעילות קוגניטיבית" },
//           { id: "chcCrystallized", label: "ידע מגובש" },
//           { id: "chcLongTerm", label: "אחסון ושליפה לטווח ארוך" },
//           { id: "chcVisual", label: "עיבוד חזותי" },
//           { id: "chcAuditory", label: "עיבוד שמיעתי" },
//           { id: "chcFluid", label: "יכולת פלואידית" },
//           { id: "chcSpeed", label: "מהירות עיבוד" },
//           { id: "chcShortMem", label: "זיכרון לטווח קצר" },
//           { id: "chc2018Learning", label: "יעילות בלמידה" },
//           { id: "chc2018Retrieval", label: "שטף שליפה" },
//           { id: "chcVisualExt", label: "עיבוד חזותי – מורחב" },
//           { id: "chcAuditoryExt", label: "עיבוד שמיעתי – מורחב" },
//           { id: "chcFluidExt", label: "יכולת פלואידית – מורחב" },
//           { id: "chcSpeedExt", label: "מהירות עיבוד – מורחב" },
//           { id: "chcShortMemExt", label: "זיכרון לטווח קצר – מורחב" },
//         ],
//       },
//     ],
//   },
// ];

// // עמודות לטבלאות הציונים
// const SCORE_COLUMNS = [
//   { id: "raw", label: "ציון גלם" },
//   { id: "standard", label: "ציון תקן" },
//   { id: "percentile", label: "אחוזון" },
//   { id: "ci", label: "רווח בר סמך (68%)" },
// ];

// /**
//  * בודק האם יש תוכן אמיתי בסעיף מסוים בהתאם לטיפוס שלו
//  */
// const sectionHasData = (type, data) => {
//   if (!data) return false;
//   if (type === "narrative" && typeof data === "string")
//     return data.trim() !== "";
//   if (type === "list" && Array.isArray(data))
//     return data.some((i) => i && i.trim() !== "");
//   if (type === "infoTable" && typeof data === "object")
//     return Object.values(data).some((v) => v && String(v).trim() !== "");
//   if (type === "scoresTable" && typeof data === "object") {
//     return Object.values(data).some(
//       (row) =>
//         row &&
//         Object.values(row).some((cell) => cell && String(cell).trim() !== ""),
//     );
//   }
//   return false;
// };

// /**
//  * פונקציה שמייצרת HTML עבור סעיף ספציפי מתוך המבנה המוגדר
//  */
// const renderSingleSection = (section, sectionData) => {
//   if (!sectionHasData(section.type, sectionData)) return "";

//   let html = "";

//   // 1. נרטיב / טקסט חופשי
//   if (section.type === "narrative") {
//     html += `<div class="narrative-section"><h3>${section.title}</h3><p>${sectionData.replace(/\n/g, "<br>")}</p></div>`;
//   }

//   // 2. רשימה (Bullets)
//   else if (section.type === "list") {
//     html += `<h3>${section.title}</h3><ul>`;
//     sectionData.forEach((item, idx) => {
//       if (item && item.trim() !== "") {
//         html += `<li><strong>${idx + 1}.</strong> ${item}</li>`;
//       }
//     });
//     html += `</ul>`;
//   }

//   // 3. טבלת מידע (Info Table) כמו פרטים אישיים
//   else if (section.type === "infoTable") {
//     html += `<h3>${section.title}</h3><table class="info-table">`;
//     section.fields.forEach((field) => {
//       const val = sectionData[field.id];
//       if (val && String(val).trim() !== "") {
//         html += `<tr><td class="info-label">${field.label}</td><td class="info-value">${val}</td></tr>`;
//       }
//     });
//     html += `</table>`;
//   }

//   // 4. טבלת ציונים מובנית (Scores Table)
//   else if (section.type === "scoresTable") {
//     html += `<h3>${section.title}</h3><table class="scores-table"><thead><tr>`;
//     html += `<th style="text-align: right;">מבחן / מדד</th>`;
//     SCORE_COLUMNS.forEach((col) => (html += `<th>${col.label}</th>`));
//     html += `</tr></thead><tbody>`;

//     section.rows.forEach((row) => {
//       const rowData = sectionData[row.id];
//       const hasRowValues =
//         rowData &&
//         Object.values(rowData).some((c) => c && String(c).trim() !== "");

//       if (hasRowValues) {
//         html += `<tr><td style="text-align: right; font-weight: bold; background: #f8f9fa;">${row.label}</td>`;
//         SCORE_COLUMNS.forEach((col) => {
//           html += `<td>${rowData[col.id] || "-"}</td>`;
//         });
//         html += `</tr>`;
//       }
//     });
//     html += `</tbody></table>`;
//   }

//   return html;
// };

// // CSS משותף לכל מסמכי ה-PDF שהמערכת מייצרת (דוח, שאלונים, טופס הסכמה) -
// // כדי שכולם ייראו עקביים ולא נשכפל את הבלוק הזה בכל generator.
// const PDF_BASE_STYLE = `
//     body { font-family: 'Arial', sans-serif; direction: rtl; text-align: right; padding: 45px; line-height: 1.6; color: #2c3e50; }
//     h1 { text-align: center; color: #1a5f7a; margin-bottom: 5px; font-size: 26px; font-weight: bold; }
//     .subtitle { text-align: center; color: #7f8c8d; margin-bottom: 35px; font-size: 15px; }
//     h2 { color: #1a5f7a; border-bottom: 3px solid #1a5f7a; padding-bottom: 5px; margin-top: 40px; font-size: 22px; font-weight: bold; page-break-after: avoid; }
//     h3 { color: #2980b9; font-size: 16px; margin-top: 20px; margin-bottom: 8px; font-weight: bold; page-break-after: avoid; }
//     p { font-size: 14px; text-align: justify; margin-bottom: 12px; color: #34495e; }
//     ul { font-size: 14px; padding-right: 20px; margin-bottom: 15px; }
//     li { margin-bottom: 6px; color: #34495e; }

//     table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px; font-size: 13px; page-break-inside: avoid; }
//     th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: center; }
//     th { background-color: #f1f5f9; color: #1a5f7a; font-weight: bold; }

//     .info-table { width: 100%; border: none; }
//     .info-table td { border: 1px solid #e2e8f0; padding: 10px; }
//     .info-label { width: 30%; background-color: #f8f9fa; font-weight: bold; text-align: right; color: #475569; }
//     .info-value { text-align: right; color: #1e293b; }

//     .narrative-section { margin-bottom: 20px; }
// `;

// /**
//  * עוטפת body HTML במעטפת <html>/<head>/<style> אחידה לכל מסמכי ה-PDF.
//  */
// const wrapHtmlDocument = (title, subtitle, bodyHtml) => `
//         <html>
//         <head>
//             <meta charset="utf-8">
//             <style>${PDF_BASE_STYLE}</style>
//         </head>
//         <body>
//             <h1>${title}</h1>
//             <div class="subtitle">${subtitle}</div>
//             ${bodyHtml}
//         </body>
//         </html>
//     `;

// /**
//  * שורת <tr> יחידה בטבלת מידע (info-table) - מדולגת אם אין ערך, כמו
//  * ב-renderSingleSection הקיים.
//  */
// const infoRow = (label, value) => {
//   if (value === undefined || value === null || String(value).trim() === "")
//     return "";
//   return `<tr><td class="info-label">${label}</td><td class="info-value">${value}</td></tr>`;
// };

// /**
//  * טבלה גנרית (headers + rows) לרשימות כמו מהלך לימודים/אחים/סדר יום.
//  */
// const dataTable = (headers, rows) => {
//   const validRows = (rows || []).filter((row) =>
//     row.some((cell) => cell && String(cell).trim() !== ""),
//   );
//   if (validRows.length === 0) return "";

//   let html = `<table><thead><tr>`;
//   headers.forEach((h) => (html += `<th>${h}</th>`));
//   html += `</tr></thead><tbody>`;
//   validRows.forEach((row) => {
//     html += `<tr>${row.map((cell) => `<td>${cell || "-"}</td>`).join("")}</tr>`;
//   });
//   html += `</tbody></table>`;
//   return html;
// };

// /**
//  * המייצר הראשי של ה-HTML
//  */
// const generateReportHTML = (formData) => {
//   let htmlContent = "";

//   // מעבר על הסטרוקטורה הראשית של הדוח
//   REPORT_STRUCTURE.forEach((section) => {
//     const sectionData = formData[section.id];
//     if (!sectionData) return;

//     // מקרה א': קבוצה של תת-סעיפים (Group)
//     if (section.type === "group" && section.subsections) {
//       let groupHtml = "";

//       section.subsections.forEach((sub) => {
//         const subData = sectionData[sub.id];
//         const subHtml = renderSingleSection(sub, subData);
//         if (subHtml) {
//           groupHtml += subHtml;
//         }
//       });

//       if (groupHtml) {
//         htmlContent += `<h2>${section.title}</h2>` + groupHtml;
//       }
//     }
//     // מקרה ב': סעיף רגיל ברמה העליונה (infoTable, narrative, list)
//     else {
//       const sectionHtml = renderSingleSection(section, sectionData);
//       if (sectionHtml) {
//         htmlContent += `<h2>${section.title}</h2>` + sectionHtml;
//       }
//     }
//   });

//   return wrapHtmlDocument(
//     "חוות דעת פסיכולוגית",
//     "מערכת דולב — ניהול והפקת אבחונים",
//     htmlContent,
//   );
// };

// const PDF_OPTIONS = {
//   format: "A4",
//   margin: { top: "25mm", bottom: "25mm", left: "20mm", right: "20mm" },
// };

// /** ממירה HTML מוכן ל-Buffer של PDF - משותף לכל ה-generators בקובץ */
// const htmlToPdfBuffer = async (htmlContent) =>
//   await htmlPdf.generatePdf({ content: htmlContent }, PDF_OPTIONS);

// /**
//  * הפונקציה הציבורית שממירה את ה-HTML ל-PDF Buffer
//  */
// exports.generatePDFBuffer = async (reportData) => {
//   // שולחים לרינדור בדיוק את ה-formData (או את ה-reportData עצמו במידה והוא מגיע שלם)
//   const dataToRender = reportData.formData ? reportData.formData : reportData;
//   return await htmlToPdfBuffer(generateReportHTML(dataToRender));
// };

// // ============================================
// // שאלון הורים -> PDF
// // ============================================
// const generateParentQuestionnaireHTML = (doc) => {
//   const f = doc.formData || {};
//   let html = "";

//   html += `<h2>פרטים אישיים</h2><table class="info-table">`;
//   html += infoRow(
//     "שם הילד/ה",
//     `${f.childFirstName || ""} ${f.childLastName || ""}`.trim(),
//   );
//   html += infoRow("ת.ז", f.idNumber);
//   html += infoRow("תאריך לידה", f.birthDate);
//   html += infoRow("מין", f.gender);
//   html += infoRow("ארץ לידה", f.birthCountry);
//   html += infoRow("תאריך עלייה", f.aliyaDate);
//   html += infoRow("שם האב", f.fatherName);
//   html += infoRow("שם האם", f.motherName);
//   html += infoRow("מצב משפחתי", f.familyStatus);
//   html += infoRow("שפה בבית", f.homeLanguage);
//   html += infoRow("טלפון", f.phone);
//   html += infoRow("בית ספר / גן", f.schoolOrGarden);
//   html += infoRow("כיתה", f.grade);
//   html += infoRow("כתובת", f.address);
//   html += infoRow("הערות למצב המשפחתי", f.familyNotes);
//   html += `</table>`;

//   html += `<h2>סיבת הפנייה ואבחונים קודמים</h2><table class="info-table">`;
//   html += infoRow("תיאור הקושי", f.difficultyDescription);
//   html += infoRow("מטרות הפנייה", f.referralGoals);
//   html += infoRow("מתי התחילו הקשיים?", f.onsetTime);
//   html += infoRow("האם הביע/ה מצוקה בעניין?", f.expressedDistress);
//   html += infoRow("האם מוכן/ה להיוועץ?", f.willingToConsult);
//   html += infoRow("עבר אבחון בעבר?", f.hadAssessment);
//   if (f.hadAssessment === "כן") {
//     html += infoRow("סוג אבחון קודם", f.assessmentType);
//     html += infoRow("תאריך האבחון", f.assessmentDate);
//     html += infoRow("המלצות אבחונים", f.assessmentRecommendations);
//   }
//   html += infoRow("טיפולים פרא-רפואיים", f.paraMedicalTreatments);
//   html += `</table>`;
//   if (f.assessmentFiles?.length) {
//     html += `<h3>מסמכי אבחון קודם מצורפים</h3><ul>`;
//     f.assessmentFiles.forEach((file) => (html += `<li>${file.name}</li>`));
//     html += `</ul>`;
//   }

//   html += `<h2>היסטוריה לימודית</h2><table class="info-table">`;
//   html += infoRow("גיל יציאה למסגרת", f.firstFrameworkAge);
//   html += infoRow("סוג מסגרת ראשונה", f.firstFrameworkType);
//   html += infoRow("דיווח טרום גן חובה", f.prePreSchoolReports);
//   html += infoRow("דיווח גן חובה", f.preSchoolReports);
//   html += infoRow("נשאר כיתה?", f.stayedGrade);
//   html += infoRow("באיזו כיתה?", f.stayedGradeWhich);
//   html += infoRow("סיבה", f.stayedGradeReason);
//   html += `</table>`;
//   html += dataTable(
//     ["כיתה", "בית ספר", "יישוב"],
//     f.schoolHistory?.map((s) => [s.grade, s.school, s.city]),
//   );

//   html += `<h2>הערכת תפקוד כללית</h2><table class="info-table">`;
//   html += infoRow("תפקוד לימודי", f.functioning?.studies);
//   html += infoRow("תפקוד משפחתי", f.functioning?.family);
//   html += infoRow("תפקוד חברתי", f.functioning?.social);
//   html += infoRow("הערות תפקוד", f.functioning?.notes);
//   html += `</table>`;

//   html += `<h2>מבנה המשפחה</h2><table class="info-table">`;
//   html += infoRow("שם האם (בטבלה)", f.familyStructure?.motherNameInTable);
//   html += infoRow("גיל האם", f.familyStructure?.motherAge);
//   html += infoRow("עיסוק האם", f.familyStructure?.motherJob);
//   html += infoRow("הערות (אם)", f.familyStructure?.motherNotes);
//   html += infoRow("שם האב (בטבלה)", f.familyStructure?.fatherNameInTable);
//   html += infoRow("גיל האב", f.familyStructure?.fatherAge);
//   html += infoRow("עיסוק האב", f.familyStructure?.fatherJob);
//   html += infoRow("הערות (אב)", f.familyStructure?.fatherNotes);
//   html += `</table>`;
//   html += dataTable(
//     ["שם", "גיל", "מסגרת", "הערות"],
//     f.familyStructure?.siblings?.map((s) => [
//       s.name,
//       s.age,
//       s.framework,
//       s.notes,
//     ]),
//   );

//   html += `<h2>בריאות</h2><table class="info-table">`;
//   html += infoRow("מצב בריאותי כללי", f.generalHealth);
//   html += infoRow("בדיקת ראייה - תאריך", f.visionDate);
//   html += infoRow("ממצא בדיקת ראייה", f.visionFindings);
//   html += infoRow("בדיקת שמיעה - תאריך", f.hearingDate);
//   html += infoRow("ממצא בדיקת שמיעה", f.hearingFindings);
//   html += infoRow("מחלות בעבר/הווה", f.pastDiseases);
//   html += infoRow("אשפוז?", f.hospitalization);
//   html += infoRow("באיזה גיל אושפז/ה?", f.hospitalizationAge);
//   html += infoRow("לכמה זמן אושפז/ה?", f.hospitalizationDuration);
//   html += infoRow("סיבת האשפוז", f.hospitalizationReason);
//   html += infoRow("נוטל תרופות באופן קבוע?", f.regularMedications);
//   html += `</table>`;

//   html += `<h2>רקע התפתחותי</h2><table class="info-table">`;
//   html += infoRow("הריון מתוכנן?", f.development?.plannedPregnancy);
//   html += infoRow("הריון תקין?", f.development?.normalPregnancy);
//   html += infoRow("פרטי ההריון", f.development?.pregnancyDetails);
//   html += infoRow("לידה תקינה?", f.development?.normalBirth);
//   html += infoRow("משקל לידה", f.development?.birthWeight);
//   html += infoRow("פרטי הלידה", f.development?.birthDetails);
//   html += infoRow(
//     "בעיות רפואיות לילד לאחר הלידה",
//     f.development?.problemsAfterBirthChild,
//   );
//   html += infoRow(
//     "בעיות רפואיות לאם לאחר הלידה",
//     f.development?.problemsAfterBirthMother,
//   );
//   html += infoRow("התפתחות מוטורית תקינה?", f.development?.normalMotorDev);
//   html += infoRow("גיל הליכה", f.development?.walkingAge);
//   html += infoRow("התפתחות שפתית תקינה?", f.development?.normalLanguageDev);
//   html += infoRow("גיל דיבור (מילים ראשונות)", f.development?.firstWordsAge);
//   html += infoRow(
//     "קשיי שינה בשנה הראשונה?",
//     f.development?.sleepIssuesFirstYear,
//   );
//   html += infoRow(
//     "קשיי אכילה בשנה הראשונה?",
//     f.development?.eatingIssuesFirstYear,
//   );
//   html += infoRow(
//     "גיל גמילה מחיתולים",
//     f.development?.diaperGraduationAge,
//   );
//   html += `</table>`;

//   html += `<h2>התנהגות ותפקוד בבית</h2><table class="info-table">`;
//   html += infoRow(
//     "בעיות אוכל/שינה/פחדים",
//     f.currentProblems?.foodSleepFearsDetails,
//   );
//   html += infoRow("חוסר מנוחה/פעילות יתר", f.currentProblems?.restlessness);
//   html += infoRow("מתרגש בקלות", f.currentProblems?.excitedEasily);
//   html += infoRow("מפריע לאחרים", f.currentProblems?.disturbsOthers);
//   html += infoRow(
//     "מתקשה להתמיד ולסיים משימות?",
//     f.currentProblems?.difficultyCompletingTasks,
//   );
//   html += infoRow(
//     "זקוק/ה לתשומת לב רבה במיוחד?",
//     f.currentProblems?.needsSpecialAttention,
//   );
//   html += infoRow(
//     "תלותי/עצמאי",
//     f.currentProblems?.dependencyVsIndependence,
//   );
//   html += infoRow("אחר", f.currentProblems?.otherBehavioral);
//   html += infoRow("למי קרוב יותר?", f.currentProblems?.closerToWho);
//   html += `</table>`;

//   html += `<h2>תפקוד חברתי</h2><table class="info-table">`;
//   html += infoRow("יש חברים?", f.social?.hasFriends);
//   html += infoRow("רמת חברותיות", f.social?.socialLevel);
//   html += infoRow(
//     "קשרים חברתיים קרובים ומשמעותיים?",
//     f.social?.meaningfulConnections,
//   );
//   html += infoRow(
//     "קשרים עם בני המין השני?",
//     f.social?.oppositeSexConnections,
//   );
//   html += infoRow("בעיות חברתיות - פירוט", f.social?.socialProblemsDetails);
//   html += `</table>`;

//   html += `<h2>סדר יום אופייני</h2>`;
//   html += dataTable(
//     ["שעה", "פעילות"],
//     f.dailyRoutine?.map((r) => [r.time, r.activity]),
//   );

//   html += `<h2>חתימה</h2><table class="info-table">`;
//   html += infoRow("חתימת הורים", f.parentsSignature);
//   html += infoRow("תאריך חתימה", f.signatureDate);
//   html += infoRow(
//     "הוגש בתאריך",
//     doc.submittedAt
//       ? new Date(doc.submittedAt).toLocaleString("he-IL")
//       : "",
//   );
//   html += `</table>`;

//   return wrapHtmlDocument(
//     "שאלון הורים",
//     "מערכת דולב — ניהול והפקת אבחונים",
//     html,
//   );
// };

// exports.generateParentQuestionnairePDFBuffer = async (doc) =>
//   await htmlToPdfBuffer(generateParentQuestionnaireHTML(doc));

// // ============================================
// // שאלון בית ספר -> PDF
// // ============================================
// const generateSchoolQuestionnaireHTML = (doc) => {
//   const f = doc.formData || {};
//   let html = "";

//   html += `<h2>פרטי הדיווח והתלמיד</h2><table class="info-table">`;
//   html += infoRow(
//     "שם התלמיד/ה",
//     `${f.firstName || ""} ${f.lastName || ""}`.trim(),
//   );
//   html += infoRow("תעודת זהות", f.idNumber);
//   html += infoRow("תאריך לידה", f.birthDate);
//   html += infoRow(
//     "מין",
//     f.gender === "ז" ? "זכר" : f.gender === "נ" ? "נקבה" : f.gender,
//   );
//   html += infoRow("שם האב", f.fatherName);
//   html += infoRow("שם האם", f.motherName);
//   html += infoRow("כתובת", f.address);
//   html += infoRow("טלפון", f.phone);
//   html += infoRow("כיתה", f.grade);
//   html += infoRow("בית ספר", f.school);
//   html += infoRow("שם המחנך/ת המדווח", doc.teacherName);
//   html += infoRow("מייל המורה", doc.teacherEmail);
//   html += infoRow("טלפון המורה", f.teacherPhone);
//   html += infoRow(
//     "תאריך הגשה",
//     doc.submittedAt
//       ? new Date(doc.submittedAt).toLocaleDateString("he-IL")
//       : "",
//   );
//   html += `</table>`;

//   html += `<h2>סיבת ההפניה</h2><table class="info-table">`;
//   html += infoRow("מי יזם את הפנייה?", f.referralInitiator);
//   html += infoRow("סיבות הפנייה המרכזיות", f.referralReasons);
//   html += infoRow("תיאור קשיי התלמיד", f.difficultyDescription);
//   html += `</table>`;

//   html += `<h2>הישגים לימודיים ותפקוד</h2>`;
//   html += dataTable(
//     ["כיתה", "בית ספר"],
//     f.schoolHistory
//       ?.filter((h) => h.grade || h.school)
//       .map((h) => [h.grade, h.school]),
//   );
//   html += `<table class="info-table">`;
//   html += infoRow("רמה אקדמית בהשוואה לכיתה", f.academicLevel);
//   html += infoRow("האם נשאר כיתה?", f.stayedGrade);
//   html += infoRow(
//     "באיזו כיתה ולמה?",
//     `${f.stayedGradeWhich || ""} ${f.stayedGradeReasons || ""}`.trim(),
//   );
//   html += infoRow("ציונים בתעודה - כיתה", f.reportCardGrade);
//   html += infoRow("ציונים בתעודה - מחצית", f.reportCardHalf);
//   html += infoRow("ציונים בתעודה - שנה", f.reportCardYear);
//   html += `</table>`;
//   html += dataTable(
//     ["מקצוע", "ציון"],
//     f.grades
//       ?.filter((g) => g.subject || g.grade)
//       .map((g) => [g.subject, g.grade]),
//   );
//   html += `<table class="info-table">`;
//   html += infoRow("קריאה", f.reading);
//   html += infoRow("כתיבה", f.writing);
//   html += infoRow("חשבון", f.math);
//   html += `</table>`;

//   html += `<h2>יחסים והתנהגות כללית</h2><table class="info-table">`;
//   html += infoRow("טיב היחס אל המורים", f.teacherRelation);
//   html += infoRow("הערות ליחס למורים", f.teacherRelationNotes);
//   html += infoRow("טיב היחסים עם בני הכיתה", f.peerRelation);
//   html += infoRow("בעיות חברתיות", f.peerProblems);
//   html += infoRow("1. דעתו מוסחת בקלות", f.distractedEasily);
//   html += infoRow("2. מתקשה להתרכז במשימות", f.hardToFocus);
//   html += infoRow("3. נע/מסתובב/מטפס באופן מוגזם", f.excessiveMovement);
//   html += infoRow("4. עוזב את הכיסא בשיעור", f.leavesSeats);
//   html += `</table>`;

//   if (f.behaviorRatings && Object.keys(f.behaviorRatings).length > 0) {
//     html += `<h2>דירוג בעיות התנהגות מפורטות</h2><table class="info-table">`;
//     Object.entries(f.behaviorRatings).forEach(([behavior, rating]) => {
//       html += infoRow(behavior, rating);
//     });
//     html += `</table>`;
//   }

//   html += `<h2>עזרה מיוחדת, התערבות וסיכום</h2><table class="info-table">`;
//   html += infoRow("שעות שילוב", f.integrationHours);
//   html += infoRow("היקף (שש)", f.integrationScope);
//   html += infoRow("כמה שנים", f.integrationYears);
//   html += infoRow(
//     "טיפול רגשי",
//     `${f.emotionalTreatment || ""} ${f.emotionalTreatmentDetails ? `(${f.emotionalTreatmentDetails})` : ""}`.trim(),
//   );
//   html += infoRow(
//     "חינוך מיוחד",
//     `${f.specialEducation || ""} ${f.specialEdName ? `(${f.specialEdName})` : ""}`.trim(),
//   );
//   html += infoRow("עזרה אחרת", f.otherHelp);
//   html += infoRow("סכם התרשמותך מהתלמיד/ה", f.studentSummary);
//   html += infoRow("שאלה אבחונית או אחרת", f.diagnosticQuestion);
//   html += infoRow("ההתערבות הטיפולית המבוקשת", f.requestedIntervention);
//   html += `</table>`;

//   html += `<h2>חתימות</h2><table class="info-table">`;
//   html += infoRow("שם המחנך/ת (חתימה)", f.teacherSignatureName);
//   html += infoRow("חתימת מחנך/ת", f.teacherSignature || doc.teacherName);
//   html += infoRow("חתימת הנהלה", f.principalSignature);
//   html += infoRow("תאריך חתימה", f.signatureDate || f.date);
//   html += `</table>`;

//   return wrapHtmlDocument(
//     "שאלון בית ספר",
//     "מערכת דולב — ניהול והפקת אבחונים",
//     html,
//   );
// };

// exports.generateSchoolQuestionnairePDFBuffer = async (doc) =>
//   await htmlToPdfBuffer(generateSchoolQuestionnaireHTML(doc));

// // ============================================
// // טופס הסכמה -> PDF
// // ============================================
// const CONSENT_DECLARATION_TEXT =
//   "ההורים החתומים מטה אישרו את עריכת מבחני האבחון הפסיכולוגי לבן/בת " +
//   "המשפחה הרשום/ה מעלה. תוצאות האבחון יישמרו כחומר מקצועי חסוי.";

// const formatConsentDate = (iso) => {
//   if (!iso) return "—";
//   return new Date(iso).toLocaleString("he-IL", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// const renderConsentParentBlock = (parent, label) => {
//   if (!parent) return "";
//   let html = `<h3>${label}</h3><table class="info-table">`;
//   html += infoRow("שם", parent.name);
//   html += infoRow("מייל", parent.email);
//   html += infoRow("סטטוס", parent.signed ? "✅ חתם" : "⏳ ממתין");
//   if (parent.signed) {
//     html += infoRow("תאריך חתימה", formatConsentDate(parent.signedAt));
//     html += infoRow("חתימה", parent.signature);
//   } else if (parent.role === "external" && parent.inviteSentAt) {
//     html += infoRow("הוזמן בתאריך", formatConsentDate(parent.inviteSentAt));
//   }
//   html += `</table>`;
//   return html;
// };

// const generateConsentFormHTML = (doc) => {
//   const childInfo = doc.childInfo || {};
//   const parents = doc.parents || [];
//   const registered = parents.find((p) => p.role === "registered");
//   const external = parents.find((p) => p.role === "external");

//   let html = `<h2>פרטי הנבחן/ת</h2><table class="info-table">`;
//   html += infoRow("שם הנבחן/ת", childInfo.fullName);
//   html += infoRow("מספר מזהה", childInfo.idNumber);
//   html += infoRow("תאריך לידה", childInfo.birthDate);
//   html += infoRow("בית ספר/גן", childInfo.schoolOrGarden);
//   html += infoRow("נוצר בתאריך", formatConsentDate(doc.createdAt));
//   html += `</table>`;

//   html += `<h2>הצהרת ההסכמה</h2><div class="narrative-section"><p>${CONSENT_DECLARATION_TEXT}</p></div>`;

//   html += `<h2>חתימות ההורים</h2>`;
//   html += renderConsentParentBlock(registered, "הורה רשום במערכת");
//   html += external
//     ? renderConsentParentBlock(external, 'הורה שני (הוזמן ע"י המייל)')
//     : `<p>לא הוזמן הורה שני לטופס זה.</p>`;

//   return wrapHtmlDocument(
//     "טופס הסכמה לאבחון",
//     "מערכת דולב — ניהול והפקת אבחונים",
//     html,
//   );
// };

// exports.generateConsentFormPDFBuffer = async (doc) =>
//   await htmlToPdfBuffer(generateConsentFormHTML(doc));

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

// CSS משותף לכל מסמכי ה-PDF שהמערכת מייצרת (דוח, שאלונים, טופס הסכמה) -
// כדי שכולם ייראו עקביים ולא נשכפל את הבלוק הזה בכל generator.
const PDF_BASE_STYLE = `
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
`;

/**
 * עוטפת body HTML במעטפת <html>/<head>/<style> אחידה לכל מסמכי ה-PDF.
 */
const wrapHtmlDocument = (title, subtitle, bodyHtml) => `
        <html>
        <head>
            <meta charset="utf-8">
            <style>${PDF_BASE_STYLE}</style>
        </head>
        <body>
            <h1>${title}</h1>
            <div class="subtitle">${subtitle}</div>
            ${bodyHtml}
        </body>
        </html>
    `;

/**
 * שורת <tr> יחידה בטבלת מידע (info-table) - מדולגת אם אין ערך, כמו
 * ב-renderSingleSection הקיים.
 */
const infoRow = (label, value) => {
  if (value === undefined || value === null || String(value).trim() === "")
    return "";
  return `<tr><td class="info-label">${label}</td><td class="info-value">${value}</td></tr>`;
};

/**
 * טבלה גנרית (headers + rows) לרשימות כמו מהלך לימודים/אחים/סדר יום.
 */
const dataTable = (headers, rows) => {
  const validRows = (rows || []).filter((row) =>
    row.some((cell) => cell && String(cell).trim() !== ""),
  );
  if (validRows.length === 0) return "";

  let html = `<table><thead><tr>`;
  headers.forEach((h) => (html += `<th>${h}</th>`));
  html += `</tr></thead><tbody>`;
  validRows.forEach((row) => {
    html += `<tr>${row.map((cell) => `<td>${cell || "-"}</td>`).join("")}</tr>`;
  });
  html += `</tbody></table>`;
  return html;
};

/**
 * המייצר הראשי של ה-HTML
 */
const generateReportHTML = (formData) => {
  let htmlContent = "";

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

  return wrapHtmlDocument(
    "חוות דעת פסיכולוגית",
    "מערכת דולב — ניהול והפקת אבחונים",
    htmlContent,
  );
};

const PDF_OPTIONS = {
  format: "A4",
  margin: { top: "25mm", bottom: "25mm", left: "20mm", right: "20mm" },
};

/** ממירה HTML מוכן ל-Buffer של PDF - משותף לכל ה-generators בקובץ */
const htmlToPdfBuffer = async (htmlContent) =>
  await htmlPdf.generatePdf({ content: htmlContent }, PDF_OPTIONS);

/**
 * הפונקציה הציבורית שממירה את ה-HTML ל-PDF Buffer
 */
exports.generatePDFBuffer = async (reportData) => {
  // שולחים לרינדור בדיוק את ה-formData (או את ה-reportData עצמו במידה והוא מגיע שלם)
  const dataToRender = reportData.formData ? reportData.formData : reportData;
  return await htmlToPdfBuffer(generateReportHTML(dataToRender));
};

// ============================================
// שאלון הורים -> PDF
// ============================================
const generateParentQuestionnaireHTML = (doc) => {
  const f = doc.formData || {};
  let html = "";

  html += `<h2>פרטים אישיים</h2><table class="info-table">`;
  html += infoRow(
    "שם הילד/ה",
    `${f.childFirstName || ""} ${f.childLastName || ""}`.trim(),
  );
  html += infoRow("ת.ז", f.idNumber);
  html += infoRow("תאריך לידה", f.birthDate);
  html += infoRow("מין", f.gender);
  html += infoRow("ארץ לידה", f.birthCountry);
  html += infoRow("תאריך עלייה", f.aliyaDate);
  html += infoRow("שם האב", f.fatherName);
  html += infoRow("שם האם", f.motherName);
  html += infoRow("מצב משפחתי", f.familyStatus);
  html += infoRow("שפה בבית", f.homeLanguage);
  html += infoRow("טלפון", f.phone);
  html += infoRow("בית ספר / גן", f.schoolOrGarden);
  html += infoRow("כיתה", f.grade);
  html += infoRow("כתובת", f.address);
  html += infoRow("הערות למצב המשפחתי", f.familyNotes);
  html += `</table>`;

  html += `<h2>סיבת הפנייה ואבחונים קודמים</h2><table class="info-table">`;
  html += infoRow("תיאור הקושי", f.difficultyDescription);
  html += infoRow("מטרות הפנייה", f.referralGoals);
  html += infoRow("מתי התחילו הקשיים?", f.onsetTime);
  html += infoRow("האם הביע/ה מצוקה בעניין?", f.expressedDistress);
  html += infoRow("האם מוכן/ה להיוועץ?", f.willingToConsult);
  html += infoRow("עבר אבחון בעבר?", f.hadAssessment);
  if (f.hadAssessment === "כן") {
    html += infoRow("סוג אבחון קודם", f.assessmentType);
    html += infoRow("תאריך האבחון", f.assessmentDate);
    html += infoRow("המלצות אבחונים", f.assessmentRecommendations);
  }
  html += infoRow("טיפולים פרא-רפואיים", f.paraMedicalTreatments);
  html += `</table>`;
  if (f.assessmentFiles?.length) {
    html += `<h3>מסמכי אבחון קודם מצורפים</h3><ul>`;
    f.assessmentFiles.forEach((file) => (html += `<li>${file.name}</li>`));
    html += `</ul>`;
  }

  html += `<h2>היסטוריה לימודית</h2><table class="info-table">`;
  html += infoRow("גיל יציאה למסגרת", f.firstFrameworkAge);
  html += infoRow("סוג מסגרת ראשונה", f.firstFrameworkType);
  html += infoRow("דיווח טרום גן חובה", f.prePreSchoolReports);
  html += infoRow("דיווח גן חובה", f.preSchoolReports);
  html += infoRow("נשאר כיתה?", f.stayedGrade);
  html += infoRow("באיזו כיתה?", f.stayedGradeWhich);
  html += infoRow("סיבה", f.stayedGradeReason);
  html += `</table>`;
  html += dataTable(
    ["כיתה", "בית ספר", "יישוב"],
    f.schoolHistory?.map((s) => [s.grade, s.school, s.city]),
  );

  html += `<h2>הערכת תפקוד כללית</h2><table class="info-table">`;
  html += infoRow("תפקוד לימודי", f.functioning?.studies);
  html += infoRow("תפקוד משפחתי", f.functioning?.family);
  html += infoRow("תפקוד חברתי", f.functioning?.social);
  html += infoRow("הערות תפקוד", f.functioning?.notes);
  html += `</table>`;

  html += `<h2>מבנה המשפחה</h2><table class="info-table">`;
  html += infoRow("שם האם (בטבלה)", f.familyStructure?.motherNameInTable);
  html += infoRow("גיל האם", f.familyStructure?.motherAge);
  html += infoRow("עיסוק האם", f.familyStructure?.motherJob);
  html += infoRow("הערות (אם)", f.familyStructure?.motherNotes);
  html += infoRow("שם האב (בטבלה)", f.familyStructure?.fatherNameInTable);
  html += infoRow("גיל האב", f.familyStructure?.fatherAge);
  html += infoRow("עיסוק האב", f.familyStructure?.fatherJob);
  html += infoRow("הערות (אב)", f.familyStructure?.fatherNotes);
  html += `</table>`;
  html += dataTable(
    ["שם", "גיל", "מסגרת", "הערות"],
    f.familyStructure?.siblings?.map((s) => [
      s.name,
      s.age,
      s.framework,
      s.notes,
    ]),
  );

  html += `<h2>בריאות</h2><table class="info-table">`;
  html += infoRow("מצב בריאותי כללי", f.generalHealth);
  html += infoRow("בדיקת ראייה - תאריך", f.visionDate);
  html += infoRow("ממצא בדיקת ראייה", f.visionFindings);
  html += infoRow("בדיקת שמיעה - תאריך", f.hearingDate);
  html += infoRow("ממצא בדיקת שמיעה", f.hearingFindings);
  html += infoRow("מחלות בעבר/הווה", f.pastDiseases);
  html += infoRow("אשפוז?", f.hospitalization);
  html += infoRow("באיזה גיל אושפז/ה?", f.hospitalizationAge);
  html += infoRow("לכמה זמן אושפז/ה?", f.hospitalizationDuration);
  html += infoRow("סיבת האשפוז", f.hospitalizationReason);
  html += infoRow("נוטל תרופות באופן קבוע?", f.regularMedications);
  html += `</table>`;

  html += `<h2>רקע התפתחותי</h2><table class="info-table">`;
  html += infoRow("הריון מתוכנן?", f.development?.plannedPregnancy);
  html += infoRow("הריון תקין?", f.development?.normalPregnancy);
  html += infoRow("פרטי ההריון", f.development?.pregnancyDetails);
  html += infoRow("לידה תקינה?", f.development?.normalBirth);
  html += infoRow("משקל לידה", f.development?.birthWeight);
  html += infoRow("פרטי הלידה", f.development?.birthDetails);
  html += infoRow(
    "בעיות רפואיות לילד לאחר הלידה",
    f.development?.problemsAfterBirthChild,
  );
  html += infoRow(
    "בעיות רפואיות לאם לאחר הלידה",
    f.development?.problemsAfterBirthMother,
  );
  html += infoRow("התפתחות מוטורית תקינה?", f.development?.normalMotorDev);
  html += infoRow("גיל הליכה", f.development?.walkingAge);
  html += infoRow("התפתחות שפתית תקינה?", f.development?.normalLanguageDev);
  html += infoRow("גיל דיבור (מילים ראשונות)", f.development?.firstWordsAge);
  html += infoRow(
    "קשיי שינה בשנה הראשונה?",
    f.development?.sleepIssuesFirstYear,
  );
  html += infoRow(
    "קשיי אכילה בשנה הראשונה?",
    f.development?.eatingIssuesFirstYear,
  );
  html += infoRow(
    "גיל גמילה מחיתולים",
    f.development?.diaperGraduationAge,
  );
  html += `</table>`;

  html += `<h2>התנהגות ותפקוד בבית</h2><table class="info-table">`;
  html += infoRow(
    "בעיות אוכל/שינה/פחדים",
    f.currentProblems?.foodSleepFearsDetails,
  );
  html += infoRow("חוסר מנוחה/פעילות יתר", f.currentProblems?.restlessness);
  html += infoRow("מתרגש בקלות", f.currentProblems?.excitedEasily);
  html += infoRow("מפריע לאחרים", f.currentProblems?.disturbsOthers);
  html += infoRow(
    "מתקשה להתמיד ולסיים משימות?",
    f.currentProblems?.difficultyCompletingTasks,
  );
  html += infoRow(
    "זקוק/ה לתשומת לב רבה במיוחד?",
    f.currentProblems?.needsSpecialAttention,
  );
  html += infoRow(
    "תלותי/עצמאי",
    f.currentProblems?.dependencyVsIndependence,
  );
  html += infoRow("אחר", f.currentProblems?.otherBehavioral);
  html += infoRow("למי קרוב יותר?", f.currentProblems?.closerToWho);
  html += `</table>`;

  html += `<h2>תפקוד חברתי</h2><table class="info-table">`;
  html += infoRow("יש חברים?", f.social?.hasFriends);
  html += infoRow("רמת חברותיות", f.social?.socialLevel);
  html += infoRow(
    "קשרים חברתיים קרובים ומשמעותיים?",
    f.social?.meaningfulConnections,
  );
  html += infoRow(
    "קשרים עם בני המין השני?",
    f.social?.oppositeSexConnections,
  );
  html += infoRow("בעיות חברתיות - פירוט", f.social?.socialProblemsDetails);
  html += `</table>`;

  html += `<h2>סדר יום אופייני</h2>`;
  html += dataTable(
    ["שעה", "פעילות"],
    f.dailyRoutine?.map((r) => [r.time, r.activity]),
  );

  html += `<h2>חתימה</h2><table class="info-table">`;
  html += infoRow("חתימת הורים", f.parentsSignature);
  html += infoRow("תאריך חתימה", f.signatureDate);
  html += infoRow(
    "הוגש בתאריך",
    doc.submittedAt
      ? new Date(doc.submittedAt).toLocaleString("he-IL")
      : "",
  );
  html += `</table>`;

  return wrapHtmlDocument(
    "שאלון הורים",
    "מערכת דולב — ניהול והפקת אבחונים",
    html,
  );
};

exports.generateParentQuestionnairePDFBuffer = async (doc) =>
  await htmlToPdfBuffer(generateParentQuestionnaireHTML(doc));

// ============================================
// שאלון בית ספר -> PDF
// ============================================
const generateSchoolQuestionnaireHTML = (doc) => {
  const f = doc.formData || {};
  let html = "";

  html += `<h2>פרטי הדיווח והתלמיד</h2><table class="info-table">`;
  html += infoRow(
    "שם התלמיד/ה",
    `${f.firstName || ""} ${f.lastName || ""}`.trim(),
  );
  html += infoRow("תעודת זהות", f.idNumber);
  html += infoRow("תאריך לידה", f.birthDate);
  html += infoRow(
    "מין",
    f.gender === "ז" ? "זכר" : f.gender === "נ" ? "נקבה" : f.gender,
  );
  html += infoRow("שם האב", f.fatherName);
  html += infoRow("שם האם", f.motherName);
  html += infoRow("כתובת", f.address);
  html += infoRow("טלפון", f.phone);
  html += infoRow("כיתה", f.grade);
  html += infoRow("בית ספר", f.school);
  html += infoRow("שם המחנך/ת המדווח", doc.teacherName);
  html += infoRow("מייל המורה", doc.teacherEmail);
  html += infoRow("טלפון המורה", f.teacherPhone);
  html += infoRow(
    "תאריך הגשה",
    doc.submittedAt
      ? new Date(doc.submittedAt).toLocaleDateString("he-IL")
      : "",
  );
  html += `</table>`;

  html += `<h2>סיבת ההפניה</h2><table class="info-table">`;
  html += infoRow("מי יזם את הפנייה?", f.referralInitiator);
  html += infoRow("סיבות הפנייה המרכזיות", f.referralReasons);
  html += infoRow("תיאור קשיי התלמיד", f.difficultyDescription);
  html += `</table>`;

  html += `<h2>הישגים לימודיים ותפקוד</h2>`;
  html += dataTable(
    ["כיתה", "בית ספר"],
    f.schoolHistory
      ?.filter((h) => h.grade || h.school)
      .map((h) => [h.grade, h.school]),
  );
  html += `<table class="info-table">`;
  html += infoRow("רמה אקדמית בהשוואה לכיתה", f.academicLevel);
  html += infoRow("האם נשאר כיתה?", f.stayedGrade);
  html += infoRow(
    "באיזו כיתה ולמה?",
    `${f.stayedGradeWhich || ""} ${f.stayedGradeReasons || ""}`.trim(),
  );
  html += infoRow("ציונים בתעודה - כיתה", f.reportCardGrade);
  html += infoRow("ציונים בתעודה - מחצית", f.reportCardHalf);
  html += infoRow("ציונים בתעודה - שנה", f.reportCardYear);
  html += `</table>`;
  html += dataTable(
    ["מקצוע", "ציון"],
    f.grades
      ?.filter((g) => g.subject || g.grade)
      .map((g) => [g.subject, g.grade]),
  );
  html += `<table class="info-table">`;
  html += infoRow("קריאה", f.reading);
  html += infoRow("כתיבה", f.writing);
  html += infoRow("חשבון", f.math);
  html += `</table>`;

  html += `<h2>יחסים והתנהגות כללית</h2><table class="info-table">`;
  html += infoRow("טיב היחס אל המורים", f.teacherRelation);
  html += infoRow("הערות ליחס למורים", f.teacherRelationNotes);
  html += infoRow("טיב היחסים עם בני הכיתה", f.peerRelation);
  html += infoRow("בעיות חברתיות", f.peerProblems);
  html += infoRow("1. דעתו מוסחת בקלות", f.distractedEasily);
  html += infoRow("2. מתקשה להתרכז במשימות", f.hardToFocus);
  html += infoRow("3. נע/מסתובב/מטפס באופן מוגזם", f.excessiveMovement);
  html += infoRow("4. עוזב את הכיסא בשיעור", f.leavesSeats);
  html += `</table>`;

  if (f.behaviorRatings && Object.keys(f.behaviorRatings).length > 0) {
    html += `<h2>דירוג בעיות התנהגות מפורטות</h2><table class="info-table">`;
    Object.entries(f.behaviorRatings).forEach(([behavior, rating]) => {
      html += infoRow(behavior, rating);
    });
    html += `</table>`;
  }

  html += `<h2>עזרה מיוחדת, התערבות וסיכום</h2><table class="info-table">`;
  html += infoRow("שעות שילוב", f.integrationHours);
  html += infoRow("היקף (שש)", f.integrationScope);
  html += infoRow("כמה שנים", f.integrationYears);
  html += infoRow(
    "טיפול רגשי",
    `${f.emotionalTreatment || ""} ${f.emotionalTreatmentDetails ? `(${f.emotionalTreatmentDetails})` : ""}`.trim(),
  );
  html += infoRow(
    "חינוך מיוחד",
    `${f.specialEducation || ""} ${f.specialEdName ? `(${f.specialEdName})` : ""}`.trim(),
  );
  html += infoRow("עזרה אחרת", f.otherHelp);
  html += infoRow("סכם התרשמותך מהתלמיד/ה", f.studentSummary);
  html += infoRow("שאלה אבחונית או אחרת", f.diagnosticQuestion);
  html += infoRow("ההתערבות הטיפולית המבוקשת", f.requestedIntervention);
  html += `</table>`;

  html += `<h2>חתימות</h2><table class="info-table">`;
  html += infoRow("שם המחנך/ת (חתימה)", f.teacherSignatureName);
  html += infoRow("חתימת מחנך/ת", f.teacherSignature || doc.teacherName);
  html += infoRow("חתימת הנהלה", f.principalSignature);
  html += infoRow("תאריך חתימה", f.signatureDate || f.date);
  html += `</table>`;

  return wrapHtmlDocument(
    "שאלון בית ספר",
    "מערכת דולב — ניהול והפקת אבחונים",
    html,
  );
};

exports.generateSchoolQuestionnairePDFBuffer = async (doc) =>
  await htmlToPdfBuffer(generateSchoolQuestionnaireHTML(doc));

// ============================================
// טופס הסכמה -> PDF
// עיצוב מכתב רשמי ונקי, נאמן לתבנית המקורית (לא לעיצוב
// ה"אפליקטיבי" של השאלונים/הדוח - לכן יש לו CSS ועטיפה משלו).
// ============================================
const CONSENT_DECLARATION_TEXT =
  "אנו החתומים מטה מאשרים בזאת עריכת מבחני אבחון פסיכולוגי לבני/בתנו " +
  "הרשום/ה מעלה. תוצאות האבחון יישמרו כחומר מקצועי חסוי.";

const formatConsentDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatConsentDateShort = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const CONSENT_PDF_STYLE = `
    body { font-family: 'Arial', sans-serif; direction: rtl; text-align: right; padding: 60px 55px; line-height: 1.9; color: #1a1a1a; }
    .consent-date { text-align: right; font-size: 13px; color: #444; margin-bottom: 30px; }
    h1 { text-align: center; text-decoration: underline; font-size: 20px; font-weight: bold; margin: 0 0 40px; }
    .consent-field { text-align: right; font-size: 15px; margin-bottom: 10px; }
    .consent-field .value { border-bottom: 1px solid #888; padding: 0 4px; }
    .consent-declaration { text-align: justify; font-size: 15px; margin: 30px 0 40px; }
    .consent-parent { margin-bottom: 26px; padding-bottom: 20px; border-bottom: 1px solid #ddd; }
    .consent-parent:last-child { border-bottom: none; }
    .consent-parent-label { text-align: right; font-size: 12px; color: #777; margin-bottom: 6px; }
    .consent-parent-line { text-align: right; font-size: 15px; margin-bottom: 4px; }
    .consent-parent-line .value { border-bottom: 1px solid #888; padding: 0 4px; }
    .consent-pending { text-align: right; font-size: 14px; color: #b45309; }
`;

const wrapConsentFormDocument = (bodyHtml) => `
        <html>
        <head>
            <meta charset="utf-8">
            <style>${CONSENT_PDF_STYLE}</style>
        </head>
        <body>${bodyHtml}</body>
        </html>
    `;

const renderConsentParentLine = (parent, label) => {
  if (!parent) return "";
  let html = `<div class="consent-parent">`;
  html += `<div class="consent-parent-label">${label}</div>`;
  html += `<div class="consent-parent-line">שם: <span class="value">${parent.name || ""}</span></div>`;
  if (parent.signed) {
    html += `<div class="consent-parent-line">חתימה: <span class="value">${parent.signature || ""}</span></div>`;
    html += `<div class="consent-parent-line">נחתם בתאריך: <span class="value">${formatConsentDate(parent.signedAt)}</span></div>`;
  } else {
    const invited =
      parent.role === "external" && parent.inviteSentAt
        ? ` (הוזמן/ה בתאריך ${formatConsentDateShort(parent.inviteSentAt)})`
        : "";
    html += `<div class="consent-parent-line consent-pending">טרם נחתם${invited}</div>`;
  }
  html += `</div>`;
  return html;
};

const generateConsentFormHTML = (doc) => {
  const childInfo = doc.childInfo || {};
  const parents = doc.parents || [];
  const registered = parents.find((p) => p.role === "registered");
  const external = parents.find((p) => p.role === "external");

  let html = `<div class="consent-date">${formatConsentDateShort(doc.createdAt)}</div>`;
  html += `<h1>הסכמת ההורים לעריכת אבחון פסיכולוגי</h1>`;

  html += `<div class="consent-field">שם הנבחן/ת: <span class="value">${childInfo.fullName || ""}</span></div>`;
  html += `<div class="consent-field">תאריך לידה: <span class="value">${childInfo.birthDate || ""}</span></div>`;
  html += `<div class="consent-field">תעודת זהות: <span class="value">${childInfo.idNumber || ""}</span></div>`;
  html += `<div class="consent-field">שם ביה"ס/הגן: <span class="value">${childInfo.schoolOrGarden || ""}</span></div>`;

  html += `<p class="consent-declaration">${CONSENT_DECLARATION_TEXT}</p>`;

  html += renderConsentParentLine(registered, "הורה 1 (רשום/ה במערכת)");
  html += external
    ? renderConsentParentLine(external, 'הורה 2 (הוזמן/ה באמצעות מייל)')
    : `<p class="consent-pending">לא הוזמן הורה שני לטופס זה.</p>`;

  return wrapConsentFormDocument(html);
};

exports.generateConsentFormPDFBuffer = async (doc) =>
  await htmlToPdfBuffer(generateConsentFormHTML(doc));