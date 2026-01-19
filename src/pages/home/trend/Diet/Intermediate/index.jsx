import DateRangeSelectorLightPurple from "@/components/custom/DateRangeSelectorLightPurple";
import { useState } from "react";
import Week from "./Week";
import Month from "./Month";

const Intermediate = () => {
  const [viewMode, setViewMode] = useState("week");
  return (
    <>
      <DateRangeSelectorLightPurple setViewMode={setViewMode} />
      {viewMode === "week" && <Week />}
      {viewMode === "month" && <Month />}
    </>
  );
};

export default Intermediate;
