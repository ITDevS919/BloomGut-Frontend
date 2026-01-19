import { useState } from "react";
import DateRangeSelectorBlue from "@/components/custom/DateRangeSelectorBlue";
import Free from "../Free";
import Week from "./Week";
import Month from "./Month";

const Intermediate = () => {
  const [viewMode, setViewMode] = useState("week");

  return (
    <>
      <DateRangeSelectorBlue setViewMode={setViewMode} />
      <Free />
      {viewMode === "week" && <Week />}
      {viewMode === "month" && <Month />}
    </>
  );
};

export default Intermediate;
