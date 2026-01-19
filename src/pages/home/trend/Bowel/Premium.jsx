import { useState } from "react";
import DateRangeSelectorUpdate from "@/components/custom/DateRangeSelector(Update)";
import PremiumWeek from "./PremiumWeek";
import PremiumMonth from "./PremiumMonth";
import PremiumYear from "./PreimumYear";

const Premium = () => {
  const [viewMode, setViewMode] = useState("week");
  return (
    <>
      <DateRangeSelectorUpdate setViewMode={setViewMode} />
      {viewMode === "week" && <PremiumWeek />}
      {viewMode === "month" && <PremiumMonth />}
      {viewMode === "year" && <PremiumYear />}
    </>
  );
};

export default Premium;
