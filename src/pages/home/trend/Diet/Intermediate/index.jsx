import DateRangeSelectorLightPurple from "@/components/custom/DateRangeSelectorLightPurple";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Week from "./Week";
import Month from "./Month";

const Intermediate = () => {
  const location = useLocation();
  const [viewMode, setViewMode] = useState(location.state?.viewMode || "week");

  useEffect(() => {
    // Update viewMode if it's passed via navigation state
    if (location.state?.viewMode) {
      setViewMode(location.state.viewMode);
    }
  }, [location.state]);

  return (
    <>
      <DateRangeSelectorLightPurple setViewMode={setViewMode} initialViewMode={viewMode} />
      {viewMode === "week" && <Week />}
      {viewMode === "month" && <Month />}
    </>
  );
};

export default Intermediate;
