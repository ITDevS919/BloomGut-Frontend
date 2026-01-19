import { useState } from "react";
import Week from "./Week";
import DateRangeSelectorLightPurpleUpdate from "@/components/custom/DateRangeSelectorLightPurple(Update)";
import Month from "./Month";
import Year from "./Year";

const Premium = () => {
  const [viewMode, setViewMode] = useState("week");
  return (
    <>
      <DateRangeSelectorLightPurpleUpdate setViewMode={setViewMode} />
      {viewMode === "week" && <Week />}
      {viewMode === "month" && <Month />}
      {viewMode === "year" && <Year />}
    </>
  );
};

export default Premium;
