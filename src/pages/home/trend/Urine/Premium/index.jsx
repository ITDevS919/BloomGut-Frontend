import DateRangeSelectorYellowUpdate from "@/components/custom/DateRangeSelectorYellow(Update)";
import { useState } from "react";
import Week from "./Week";
import Month from "./Month";
import Year from "./Year";

const Premium = () => {
  const [viewMode, setViewMode] = useState("week");
  return (
    <>
      <DateRangeSelectorYellowUpdate setViewMode={setViewMode} />
      {viewMode === "week" && <Week />}
      {viewMode === "month" && <Month />}
      {viewMode === "year" && <Year />}
    </>
  );
};

export default Premium;
