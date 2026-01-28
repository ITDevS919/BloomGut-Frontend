import { useState, useEffect } from "react";
import { ChevronLeft, Lock, LockKeyhole, ChevronRight } from "lucide-react";
import { Search, Mic } from "lucide-react";
import { CustomCheckbox } from "@/components/custom/CustomCheckbox";
import CustomHeading from "@/components/custom/CustomHeading";
import { CustomButton } from "@/components/custom/CustomButton";
import { MdAccessibilityNew, MdHttps } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaAccessibleIcon, FaUtensils } from "react-icons/fa6";
import { FaGlassWhiskey } from "react-icons/fa";
import { CustomCheckboxWater } from "@/components/custom/CustomCheckbox(Water)";

const DietRecord = (props) => {
  const navigate = useNavigate();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const [searchValue, setSearchValue] = useState("");
  const [state, setState] = useState("idle");
  const [clickedNutritionLabel, setClickedNutritionLabel] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Sample data for color-coded dates (you can replace this with actual data)
  const dateColors = {
    1: "green",
    4: "green",
    11: "green",
    5: "yellow",
    6: "yellow",
    10: "yellow",
    7: "red",
    9: "red",
    2: "grey",
    3: "grey",
    8: "grey",
    12: "pink"
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const calendarDays = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }

    return calendarDays;
  };

  const getDateColor = (day) => {
    return dateColors[day] || null;
  };

  const getColorClass = (color) => {
    const colorMap = {
      green: "bg-[#66BB6A]",
      yellow: "bg-[#FFEB3B]",
      red: "bg-[#EF5350]",
      grey: "bg-[#BDBDBD]",
      pink: "bg-[#F8C8C8]"
    };
    return colorMap[color] || "";
  };

  useEffect(() => {
    setSearchValue(props.recordResult);
  }, [props.recordResult]);

  const handleSearch = (value) => {
    console.log("Searching for:", value);
    // Handle search logic here
  };

  const handleVoiceInput = () => {
    // Trigger your existing voice recognition
    props.setRecordUI("food record");
  };

  const handleViewTrend = () => {
    navigate("/trend-analysis", { state: { trendType: "diet" } });
  };

  return (
    <div className="bg-ivory min-h-full p-6 text-primary flex flex-col">
      <div className="flex items-center gap-4 mb-[27px]">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-[40px] leading-none cursor-pointer " />
        </button>
        <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">Diet Record</h2>
      </div>

      {!clickedNutritionLabel && <>
        <div className="flex justify-between mb-10">
          <div>
            <p className="text-[20px] text-primary font-bold font-base">
              {days[new Date().getDay()]}
            </p>
            <p className="text-[20px] text-primary">
              {months[new Date().getMonth()]} {new Date().getDate()}
            </p>
          </div>
          <CustomButton variant="outline" className="bg-white" onClick={handleViewTrend}>
            View Trend
          </CustomButton>
        </div>
      </>}
      <>
        {/* Search Bar */}
        {clickedNutritionLabel && <>

          <div className="flex justify-center">
            <div className="relative flex items-center bg-white rounded-full shadow-md overflow-hidden w-full max-w-md mb-5">
              {/* Magnifying Glass Icon */}
              <div className="pl-4 pr-3 flex items-center">
                <Search className="w-5 h-5" style={{ color: "#a78bfa" }} />
              </div>

              {/* Vertical Separator */}
              <div className="h-6 w-px bg-gray-300"></div>

              {/* Input Field */}
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Enter food (e.g., chicken rice)"
                className="flex-1 px-4 py-4 text-sm outline-none placeholder:text-custom-12 text-gray-700 bg-transparent"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch(searchValue);
                  }
                }}
              />

              {/* Microphone Icon */}
              <button
                type="button"
                onClick={handleVoiceInput}
                className="pr-4 pl-3 flex items-center hover:opacity-70 transition-opacity"
                aria-label="Voice input"
              >
                <Mic className="w-5 h-5" style={{ color: "#a78bfa" }} />
              </button>
            </div>

          </div>
          {!searchValue && (
            <div className="text-secondary text-center text-sm mb-[11px]">
              💡 You can enter a full sentence like: 'I had     eggs and vegetables for breakfas
            </div>
          )}

          <div className="text-custom-12 text-center text-xs mb-[46px]">
            Nutrition label generated automatically
          </div>

        </>}


      </>
      <div className="flex flex-col gap-4 text-primary font-medium mb-3">
        Nutrition Label
      </div>
      <div className={`bg-white rounded-[27px] shadow-[0_2px_4px_rgba(0,0,0,0.15)] p-6 text-custom-12 ${searchValue ? "mb-[10px]" : "mb-[28px]"}`}
        onClick={() => setClickedNutritionLabel(true)}
      >
        No data yet, record your first meal
      </div>
      {searchValue &&
        <div className="text-xs text-custom-12 text-center mb-[28px] italic">
          This label is estimated by the system based on the default word bank, not the actual query result
        </div>
      }

      <div className="flex flex-col gap-4 text-primary font-medium mb-3">
        Gut Impact Analysis
      </div>
      <div className="bg-white rounded-[27px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] p-6 text-custom-12 text-sm mb-[28px]">
        No records yet, start your log
        <div className="flex items-center space-x-4 text-xs text-custom-12 mt-3">

        </div>
      </div>

      {searchValue &&
        <>
          <div className="flex items-center gap-2 text-primary font-medium mb-3">
            How to Eat
            <FaUtensils color="#6aa84f" />
          </div>
          <div className="bg-white rounded-[27px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] p-6 text-custom-12 text-sm mb-[28px]">
            <div className="flex items-center space-x-4 text-xs text-custom-12">
              Eat high-fiber veggies & quality protein
              <br />
              Limit sodium & refined carbs
            </div>
          </div>
        </>
      }

      {searchValue &&
        <>
          <div className="flex items-center gap-2 text-primary font-medium mb-3">
            How to Drink
            <FaGlassWhiskey color="#6fa8dc" />
          </div>
          <div className="bg-white rounded-[27px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] p-6 text-custom-12 text-sm mb-[28px]">
            <div className="flex items-center space-x-4 text-xs text-custom-12">
              Drink 300ml water before 10 AM
              <br />
              Sip 2-3 times to prevent bloatingf
            </div>
          </div>
        </>
      }

      {searchValue &&
        <>
          <div className="flex items-center gap-2 text-primary font-medium mb-3">
            How to Relax
            <MdAccessibilityNew size={24} color="#e69138" />
          </div>
          <div className="bg-white rounded-[27px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] p-6 text-custom-12 text-sm mb-[28px]">
            <div className="flex items-center space-x-4 text-xs text-custom-12">
              Drink 300ml water before 10 AM
              <br />
              Sip 2-3 times to prevent bloatingf
            </div>
          </div>
        </>
      }



      <div className="flex flex-col gap-4 text-primary  mb-3 ">
        <CustomHeading label="Daily Progress" isRequired />
        {!clickedNutritionLabel ?
          <>
            <div className="bg-white rounded-[27px] shadow-[0_2px_4px_rgba(0,0,0,0.15)] p-6 text-custom-12 mb-[28px] text-sm">
              Complete your food and symptoms log to see progress
            </div>
          </> : <>
            <div className="flex flex-col gap-2">
              <CustomCheckboxWater label="Breakfast" borderColor="#b3a2d0" checkColor="#b3a2d0" />
              <CustomCheckboxWater label="Lunch" borderColor="#b3a2d0" checkColor="#b3a2d0" />
              <CustomCheckboxWater label="Dinner" borderColor="#b3a2d0" checkColor="#b3a2d0" />
            </div>
          </>}
      </div>

      <div className="flex flex-col gap-4 text-primary font-medium mb-4 mt-5">
        Gut Impact Records
      </div>

      {!clickedNutritionLabel ?
        <>
          <div className="bg-white rounded-[27px] shadow-[0_2px_4px_rgba(0,0,0,0.15)] p-6 text-custom-12 mb-[28px] text-sm">
            No records found
          </div>
        </> :
        <>
          {searchValue ? (
            <div className="rounded-[27px]  p-2 mb-[28px]">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-5 h-5 text-primary" />
                </button>
                <h3 className="text-lg font-medium text-primary">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-5 h-5 text-primary" />
                </button>
              </div>

              {/* Days of Week Header */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-xs text-gray-600 font-medium py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {renderCalendar().map((day, index) => {
                  const color = day ? getDateColor(day) : null;
                  return (
                    <div
                      key={index}
                      className={`aspect-square flex items-center justify-center text-sm ${day ? "cursor-pointer hover:bg-gray-50 rounded-full" : ""
                        }`}
                    >
                      {day && (
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${color ? getColorClass(color) + " text-white" : "text-secondary"
                            }`}
                        >
                          {day}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-[#030303]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#66BB6A]"></div>
                  <span>Beneficial</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FFEB3B]"></div>
                  <span>Neutral</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#EF5350]"></div>
                  <span>Irritating</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#BDBDBD]"></div>
                  <span>Unrecorded</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#F8C8C8]"></div>
                  <span>Incomplete</span>
                </div>
              </div>

              {/* Instruction Text */}
              <p className="text-xs text-gray-400 text-center mt-4 text-custom-12">
                Click on calendar date/expand for details
              </p>
            </div>
          ) : (
            <div className="mb-[40px] mt-[40px] text-sm text-custom-12">No records found</div>
          )}
        </>}

      <div className="text-primary mt-5 mb-[63px]">
        <div className="font-medium">Gut Trends</div>
        <div className="flex justify-center bg-white rounded-[27px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-6 mt-3">
          <div className="bg-gray-200 rounded-[24px] h-12 w-56 text-center flex items-center justify-center text-sm">
            Unlocks in 3 days &nbsp;&nbsp;&nbsp;&nbsp;
            <MdHttps className="text-[#7f7f7f] w-[24px] h-[24px]" />
          </div>
        </div>
      </div>

      <button className="w-[242px] mx-auto transition-all duration-150 active:scale-[0.98] active:shadow-[0_4px_10px_rgba(0,0,0,0.18)] min-h-[48px] flex items-center justify-center text-white text-base rounded-[24px] bg-[#C69C6D] py-3 shadow-[0_4px_10px_rgba(0,0,0,0.18)] mt-5">Save</button>
    </div>
  );
};

export default DietRecord;
