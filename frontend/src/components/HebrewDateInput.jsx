// frontend/src/components/HebrewDateInput.jsx
//
// שדה תאריך (או תאריך+שעה) בעברית - עוטף react-datepicker באותה תצורה
// בדיוק כמו ב-AddChildModal.jsx, כדי שבכל האתר יהיה מראה ופורמט אחיד
// (dd/MM/yyyy) במקום שדה <input type="date"/datetime-local"> הגולמי של הדפדפן.
// הערך נכנס ויוצא כמחרוזת ("YYYY-MM-DD" או "YYYY-MM-DDTHH:mm" עם withTime) -
// פורמט הנתונים שנשמר לא משתנה, רק התצוגה.

import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { he } from "date-fns/locale/he";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker-theme.css";
import { toDate, toYMD, toLocalDateTime } from "../utils/dateFormat";

registerLocale("he", he);

const HebrewDateInput = ({
  value,
  onChange,
  disabled = false,
  maxDate,
  minDate,
  className = "",
  placeholder = "בחר/י תאריך",
  withTime = false,
}) => {
  const handleChange = (date) => {
    if (!date) {
      onChange("");
      return;
    }
    onChange(withTime ? toLocalDateTime(date) : toYMD(date));
  };

  return (
    <DatePicker
      selected={toDate(value)}
      onChange={handleChange}
      disabled={disabled}
      maxDate={maxDate}
      minDate={minDate}
      locale="he"
      calendarStartDay={0}
      showYearDropdown
      showMonthDropdown
      scrollableYearDropdown
      yearDropdownItemNumber={100}
      showTimeSelect={withTime}
      timeFormat="HH:mm"
      timeIntervals={15}
      timeCaption="שעה"
      dateFormat={withTime ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy"}
      placeholderText={placeholder}
      className={className}
      wrapperClassName="w-full"
      popperPlacement="bottom"
      popperProps={{ strategy: "fixed" }}
      portalId="datepicker-portal"
      popperClassName="z-[10001]"
    />
  );
};

export default HebrewDateInput;
