import { useState, useEffect } from "react";
import { ChevronLeft, Lock, LockKeyhole } from "lucide-react";
import { Search, Mic } from "lucide-react";
import { CustomCheckbox } from "@/components/custom/CustomCheckbox";
import CustomHeading from "@/components/custom/CustomHeading";
import { CustomButton } from "@/components/custom/CustomButton";
import { MdHttps } from "react-icons/md";

const DietRecord = (props) => {
  const [searchValue, setSearchValue] = useState("");
  const [state, setState] = useState("idle");

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

      {/* Search Bar */}
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

      <div className="flex flex-col gap-4 text-primary font-medium mb-3">
        Nutrition Label
      </div>
      <div className="bg-white rounded-[27px] shadow-[0_2px_4px_rgba(0,0,0,0.15)] p-6 text-custom-12 mb-[28px]">
        No data yet, record your first meal
      </div>

      <div className="flex flex-col gap-4 text-primary font-medium mb-3">
        Gut Impact Analysis
      </div>
      <div className="bg-white rounded-[27px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] p-6 text-custom-12 text-sm mb-[28px]">
        No records yet, start your log
        <div className="flex items-center space-x-4 text-xs text-gray-600 mt-3">
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 bg-green-400"></span>
            <span>Gut-Friendly</span>
          </div>

          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 bg-yellow-400"></span>
            <span>Neutral</span>
          </div>

          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 bg-red-400"></span>
            <span>May Irritate</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 text-primary  mb-3 ">
        <CustomHeading label="Daily Progress" isRequired />
        <div className="flex flex-col gap-2">
          <CustomCheckbox label="Breakfast" />
          <CustomCheckbox label="Lunch" />
          <CustomCheckbox label="Dinner" />
        </div>
      </div>

      <div className="flex flex-col gap-4 text-primary font-medium mt-5">
        Gut Calendar View
      </div>

      <div className="mb-[40px] mt-[40px] text-sm text-custom-12">No records found</div>

      <div className="text-primary mt-5 mb-[63px]">
        <div className="font-medium">Gut Trends</div>
        <div className="flex justify-center bg-white rounded-[27px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-6 mt-3">
          <div className="bg-gray-200 rounded-[24px] h-12 w-56 text-center flex items-center justify-center text-sm">
            Unlocks in 3 days &nbsp;&nbsp;&nbsp;&nbsp;
            <MdHttps className="text-[#7f7f7f] w-[24px] h-[24px]" />
          </div>
        </div>
      </div>

      <button className="w-[242px] mx-auto transition-all duration-150 active:scale-[0.98] active:shadow-[0_4px_10px_rgba(0,0,0,0.18)] min-h-[48px] flex items-center justify-center text-white text-base rounded-[24px] bg-[#C69C6D] py-3 shadow-[0_4px_10px_rgba(0,0,0,0.18)] mt-5">Save Record</button>
    </div>
  );
};

export default DietRecord;
