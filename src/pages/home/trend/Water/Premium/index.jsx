import { useState } from "react";
import Free from "../Free";
import DateRangeSelectorBlueUpdate from "@/components/custom/DateRangeSelectorBlue(Update)";
import Week from "./Week";
import Month from "./Month";
import Year from "./Year";

const Premium = () => {
  const [viewMode, setViewMode] = useState("week");

  return (
    <>
      <DateRangeSelectorBlueUpdate setViewMode={setViewMode} />
      {/* <Free /> */}
      {viewMode === "week" && <Week />}
      {viewMode === "month" && <Month />}
      {viewMode === "year" && <Year />}
    </>
  );
};

export default Premium;
