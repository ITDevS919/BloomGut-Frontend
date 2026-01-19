import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DateRangeSelectorBlue = (props) => {
  const [viewMode, setViewMode] = useState("week"); // "week" or "month"
  const [currentDate, setCurrentDate] = useState(new Date());

  // Format date range based on view mode
  const formatDateRange = (date, mode) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
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
    } else {
      // Month view
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${month} ${year}`;
    }
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="bg-ivory p-4">
      {/* Date Range Selector */}
      <div className="flex items-center justify-center gap-4 mb-4">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
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
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* View Mode Toggle Buttons */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => {
            setViewMode("week");
            props.setViewMode("week");
          }}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
            viewMode === "week"
              ? "bg-[#79B6E2] text-gray-800" // Active: tan/brown background
              : "bg-white text-gray-800" // Inactive: white background
          }`}
        >
          Week
        </button>
        <button
          onClick={() => {
            setViewMode("month");
            props.setViewMode("month");
          }}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
            viewMode === "month"
              ? "bg-[#79B6E2] text-gray-800" // Active: tan/brown background
              : "bg-white text-gray-800" // Inactive: white background
          }`}
        >
          Month
        </button>
      </div>
    </div>
  );
};

export default DateRangeSelectorBlue;
