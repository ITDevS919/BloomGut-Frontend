import DateRangeSelectorLightPurple from "@/components/custom/DateRangeSelectorLightPurple";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Week from "./Week";
import Month from "./Month";

const Intermediate = () => {
  const location = useLocation();
  const [viewMode, setViewMode] = useState(location.state?.viewMode || "week");
  const [referenceDate, setReferenceDate] = useState(new Date());

  useEffect(() => {
    // Update viewMode if it's passed via navigation state
    if (location.state?.viewMode) {
      setViewMode(location.state.viewMode);
    }
  }, [location.state]);

  const handleDateChange = (date, mode) => {
    setReferenceDate(date);
    if (mode && mode !== viewMode) {
      setViewMode(mode);
    }
  };

  return (
    <main>
      <DateRangeSelectorLightPurple
        setViewMode={setViewMode}
        initialViewMode={viewMode}
        onDateChange={handleDateChange}
      />
      {viewMode === "week" && <Week referenceDate={referenceDate} />}
      {viewMode === "month" && <Month referenceDate={referenceDate} />}
    </main>
  );
};

export default Intermediate;
