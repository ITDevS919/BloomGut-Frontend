import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DateRangeSelectorBlue from "@/components/custom/DateRangeSelectorBlue";
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
    <>
      <DateRangeSelectorBlue
        setViewMode={setViewMode}
        initialViewMode={viewMode}
        onDateChange={handleDateChange}
      />
      {viewMode === "week" && (
        <Week showUpgrade={false} referenceDate={referenceDate} />
      )}
      {viewMode === "month" && (
        <Month showUpgrade={false} referenceDate={referenceDate} />
      )}
    </>
  );
};

export default Intermediate;
