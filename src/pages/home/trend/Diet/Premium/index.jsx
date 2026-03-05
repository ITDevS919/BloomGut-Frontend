import { useState } from "react";
import Week from "./Week";
import DateRangeSelectorLightPurpleUpdate from "@/components/custom/DateRangeSelectorLightPurple(Update)";
import Month from "./Month";
import Year from "./Year";

const Premium = () => {
  const [viewMode, setViewMode] = useState("week");
  const [referenceDate, setReferenceDate] = useState(new Date());

  const handleDateChange = (date, mode) => {
    setReferenceDate(date);
    if (mode && mode !== viewMode) {
      setViewMode(mode);
    }
  };

  return (
    <>
      <DateRangeSelectorLightPurpleUpdate
        setViewMode={setViewMode}
        onDateChange={handleDateChange}
      />
      {viewMode === "week" && <Week referenceDate={referenceDate} />}
      {viewMode === "month" && <Month referenceDate={referenceDate} />}
      {viewMode === "year" && <Year referenceDate={referenceDate} />}
    </>
  );
};

export default Premium;
