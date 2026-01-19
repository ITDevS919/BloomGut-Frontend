import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DateRangeSelectorBlueUpdate = (props) => {
  const [viewMode, setViewMode] = useState("week"); // "week", "month", or "year"
  const [currentDate, setCurrentDate] = useState(new Date());

  // Format date range based on view mode
  const formatDateRange = (date, mode) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    if (mode === "week") {
      // Get start and end of week
      const startOfWeek = new Date(date);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day; // Adjust to Monday as start
      startOfWeek.setDate(diff);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const month = months[startOfWeek.getMonth()];
      const startDay = startOfWeek.getDate();
      const endDay = endOfWeek.getDate();
      const year = startOfWeek.getFullYear();

      return `${month} ${startDay}-${endDay}, ${year}`;
    } else if (mode === "month") {
      // Month view
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${month} ${year}`;
    } else {
      // Year view
      return `${date.getFullYear()}`;
    }
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (props.setViewMode) {
      props.setViewMode(mode);
    }
  };

  return (
    <div className="bg-ivory">
      {/* View Mode Toggle Buttons - Top Row */}
      <div className="flex gap-2 justify-center mb-4">
        <button
          onClick={() => {handleViewModeChange("week"); props.setViewMode("week")}}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === "week"
              ? "bg-[#F6C700] text-gray-800" // Active: light brown/beige background
              : "bg-white text-gray-800" // Inactive: white background
          }`}
        >
          Week
        </button>
        <button
          onClick={() => {handleViewModeChange("month"); props.setViewMode("month")}}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === "month"
              ? "bg-[#F6C700] text-gray-800" // Active: light brown/beige background
              : "bg-white text-gray-800" // Inactive: white background
          }`}
        >
          Month
        </button>
        <button
          onClick={() => {handleViewModeChange("year"); props.setViewMode("year")}}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === "year"
              ? "bg-[#F6C700] text-gray-800" // Active: light brown/beige background
              : "bg-white text-gray-800" // Inactive: white background
          }`}
        >
          Year
        </button>
      </div>

      {/* Date Navigation - Bottom Row */}
      <div className="flex items-center justify-center gap-4">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          className="w-8 h-8 rounded-l flex items-center justify-center hover:bg-gray-300 transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* Date Display */}
        <div className="text-base font-medium text-gray-800 min-w-[180px] text-center">
          {formatDateRange(currentDate, viewMode)}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default DateRangeSelectorBlueUpdate;