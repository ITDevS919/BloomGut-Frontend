import { useState } from "react";
import Free from "../Free";
import DateRangeSelectorBlueUpdate from "@/components/custom/DateRangeSelectorBlue(Update)";
import Week from "./Week";
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
    <main>
      <DateRangeSelectorBlueUpdate
        setViewMode={setViewMode}
        onDateChange={handleDateChange}
      />
      {/* <Free /> */}
      {viewMode === "week" && <Week referenceDate={referenceDate} />}
      {viewMode === "month" && <Month referenceDate={referenceDate} />}
      {viewMode === "year" && <Year referenceDate={referenceDate} />}
    </main>
  );
};

export default Premium;
