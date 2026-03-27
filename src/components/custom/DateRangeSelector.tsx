import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DateRangeSelector = (props) => {
  const [viewMode, setViewMode] = useState(props.initialViewMode || "week"); // "week" or "month"
  const [currentDate, setCurrentDate] = useState(new Date());

  // Update viewMode when initialViewMode prop changes
  useEffect(() => {
    if (props.initialViewMode && props.initialViewMode !== viewMode) {
      setViewMode(props.initialViewMode);
      if (props.setViewMode) {
        props.setViewMode(props.initialViewMode);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.initialViewMode]);

  // Format date range based on view mode
  const formatDateRange = (date, mode) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const weekMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
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

      const month = weekMonths[startOfWeek.getMonth()];
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
    if (props.onDateChange) {
      props.onDateChange(newDate, viewMode);
    }
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
    if (props.onDateChange) {
      props.onDateChange(newDate, viewMode);
    }
  };

  return (
    <div className="bg-ivory mb-[28px] mt-[31px]">
      {/* Date Range Selector */}
      <div className="flex items-center justify-center gap-4 mb-4">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors bg-[#EDEDEF]"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 cursor-pointer" />
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
          <ChevronRight className="w-5 h-5 text-gray-600 cursor-pointer" />
        </button>
      </div>

      {/* View Mode Radio Buttons */}
      <div className="flex gap-6 justify-center items-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="viewMode"
            value="week"
            checked={viewMode === "week"}
            onChange={() => {
              setViewMode("week");
              if (props.setViewMode) {
                props.setViewMode("week");
              }
              if (props.onDateChange) {
                props.onDateChange(currentDate, "week");
              }
            }}
            className="w-4 h-4 appearance-none border-2 border-white outline-1 outline-gray-300 rounded-sm checked:bg-[#C69C6D] checked:border-white cursor-pointer"
          />
          <span className="text-sm text-primary">Week</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="viewMode"
            value="month"
            checked={viewMode === "month"}
            onChange={() => {
              if (!props.isSubscribed && props.plan !== "premium" && props.plan !== "pro") {
                if (props.onUpgradeRedirect) {
                  props.onUpgradeRedirect();
                }
                return; // stop switching to month
              }

              setViewMode("month");

              if (props.setViewMode) {
                props.setViewMode("month");
              }

              if (props.onDateChange) {
                props.onDateChange(currentDate, "month");
              }
            }}
            className="w-4 h-4 appearance-none border-2 border-white outline-1 outline-gray-300 rounded-sm checked:bg-[#C69C6D] checked:border-white cursor-pointer bg-white"
          />
          <span className="text-sm text-primary">Month</span>
        </label>
      </div>
    </div>
  );
};

export default DateRangeSelector;
