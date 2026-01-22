import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DateRangeSelectorYellowUpdate = (props) => {
  const [viewMode, setViewMode] = useState("week"); // "week", "month", or "year"
  const [currentDate, setCurrentDate] = useState(new Date());

  // Format date range based on view mode
  const formatDateRange = (date, mode) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];

    const weekMonths = [
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

      return `${month} ${startDay}, ${year} - ${month} ${endDay}, ${year}`;
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
      <div className="flex gap-10 justify-center mb-4">
        <button
          onClick={() => { handleViewModeChange("week"); props.setViewMode("week") }}
          className={`px-6 py-1 rounded-lg text-lg transition-colors ${viewMode === "week"
            ? "bg-[#FFD43B] text-primary" // Active: light brown/beige background
            : "bg-white border border-[#fbdc5f] text-primary" // Inactive: white background
            }`}
        >
          Week
        </button>
        <button
          onClick={() => { handleViewModeChange("month"); props.setViewMode("month") }}
          className={`px-6 py-2 rounded-lg text-lg transition-colors ${viewMode === "month"
            ? "bg-[#FFD43B] text-primary" // Active: light brown/beige background
            : "bg-white border border-[#fbdc5f] text-primary" // Inactive: white background
            }`}
        >
          Month
        </button>
        <button
          onClick={() => { handleViewModeChange("year"); props.setViewMode("year") }}
          className={`px-6 py-2 rounded-lg text-lg transition-colors ${viewMode === "year"
            ? "bg-[#FFD43B] text-primary" // Active: light brown/beige background
            : "bg-white border border-[#fbdc5f] text-primary" // Inactive: white background
            }`}
        >
          Year
        </button>
      </div>

      {/* Date Navigation - Bottom Row */}
      <div className="flex items-center justify-center mt-[32px] pl-[15px] pr-[15px]">
        {/* Previous Button */}
        {viewMode === "year" ? (
          <div className="rounded-[12px] bg-[rgb(0,0,0,0.05)] p-4 w-full">
            <div className="text-left">
              <div className="text-base font-medium text-primary mb-[7px] font-['Noto Sans TC']">
                {currentDate.getFullYear()} Health Analysis
              </div>
              <div className="text-sm text-secondary font-['Noto Sans TC']">
                Annual Bowel & Food Report
              </div>
            </div>
          </div>
        ) : (
          <><button
            onClick={handlePrevious}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors bg-[#EDEDEF]"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

            {/* Date Display */}
            <div className="text-base text-primary min-w-[180px] text-center">
              {formatDateRange(currentDate, viewMode)}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors bg-[#EDEDEF]"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </>)}
      </div>
    </div>
  );
};

export default DateRangeSelectorYellowUpdate;