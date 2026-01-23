import { AccordionItem } from "@/components/custom/AccordionItem";
import { CustomButton } from "@/components/custom/CustomButton";
import CustomHeading from "@/components/custom/CustomHeading";
import { DropDownSelectorItem } from "@/components/custom/DropDownSelectorItem";
import { ChevronDown, ChevronLeft, Pencil } from "lucide-react";
import { useState } from "react";
import { FaGlassWhiskey, FaPencilAlt } from "react-icons/fa";
import { FaBottleWater, FaGlassWater, FaMugHot } from "react-icons/fa6";

const WaterRecord = () => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
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
  const commonOptions = [
    { label: "Coffee Cup(250ml)", value: "250ml" },
    { label: "Glass Cup(300ml)", value: "300ml" },
    { label: "Thermos(500ml)", value: "500ml" },
    { label: "Travel Mug(650ml)", value: "650ml" },
    { label: "Mineral Water(600ml)", value: "600ml" },
    { label: "Sport Bottle(750ml)", value: "750ml" },
  ];
  const specialOptions = [
    { label: "Outdoor Bottle(1500ml)", value: "1500ml" },
    { label: "Fitness Bottle(650ml)", value: "650ml" },
    { label: "Stainless Steel Straw Insulated Cup(1000ml)", value: "1000ml" },
  ];
  return (
    <div className="bg-ivory min-h-full p-6 text-secondary flex flex-col">
      {/* header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-[40px] leading-none cursor-pointer " />
        </button>
        <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">Water Record</h2>
      </div>

      {/* date and view trend button */}
      <div className="flex justify-between mb-5 p-4">
        <div>
          <p className="text-xl text-primary font-bold font-base">
            {days[new Date().getDay()]}
          </p>
          <p className="text-base text-primary">
            {months[new Date().getMonth()]} {new Date().getDate()}
          </p>
        </div>
        <CustomButton variant="outline" className="bg-white cursor-pointer">
          View Trend
        </CustomButton>
      </div>

      {/* Header */}
      <CustomHeading label="Water Record" isRequired className="ml-3" />
      <div className="p-2">
        {/* Progress */}
        <div className="space-y-1 text-xs text-gray-600 mt-3">
          <div className="flex justify-between">
            <span>Today</span>
            <span>2000ml</span>
          </div>
          <div className="relative h-6 rounded-full bg-[#e5e5e5] shadow-[0_2px_8px_rgba(0,0,0,0.16)]">
            <div
              className="absolute left-0 top-0 h-6 rounded-full bg-custom-13 text-center text-white text-xs leading-6"
              style={{ width: "32%" }}
            >
              650ml
            </div>
          </div>
        </div>

        {/* Recently Used */}
        <div className="flex items-center justify-between text-sm mt-[44px] mb-[31px]">
          <span className="font-medium">Recently Used</span>
          <button className="bg-white shadow-[0_2px_8px_#afafaf] text-secondary border-custom-16 rounded-[8px] border px-3 py-1 text-xs cursor-pointer">
            Custom Amount
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-3 mb-[45px]">
          <QuickItem icon={<FaMugHot size={32} />} color="#a05a2c" label="Coffee Cup" value="250ml" />
          <QuickItem icon={<FaGlassWater size={32} />} color="#d2d2d2" label="Glass Cup" value="350ml" />
          <QuickItem icon={<FaBottleWater size={32} />} color="#79b6e2" label="Sport Bottle" value="750ml" />
        </div>

        <CustomHeading
          label="Select Container Type"
          isRequired
          className="mt-5 mb-5"
        />
        <DropDownSelectorItem
          title="Common"
          options={commonOptions}
        />

        <CustomHeading label="Special" isRequired className="mt-5 mb-5" />
        <DropDownSelectorItem
          title="Special"
          options={specialOptions}
          variant="special"
        />

        {/* Today's Record */}
        <TodaysRecord />

        <button
          type="button"
          className="w-[242px] mx-auto transition-all duration-150 active:scale-[0.98] active:shadow-[0_4px_10px_rgba(0,0,0,0.18)] min-h-[48px] flex items-center justify-center text-white text-base rounded-[24px] bg-[#C69C6D] py-3 shadow-[0_4px_10px_rgba(0,0,0,0.18)] mt-5"
          onClick={() => alert(`Saved language: ${selected}`)}
        >
          Save
        </button>
      </div>
    </div>
  );
};

function QuickItem({ icon, label, value, active, color }) {
  return (
    <div className="rounded-[12px] border border-custom-10 p-3 text-center text-xs shadow-[0_4px_12px_rgba(0,0,0,0.08)] bg-white">
      <div className="flex items-center justify-center text-xl mt-[17px]" style={{ color: color }}>{icon}</div>
      <p className="text-secondary text-sm mt-[15px] mb-[7px]">{label}</p>
      <p className="text-custom-12 text-sm">{value}</p>
    </div>
  );
}

function CommonCollapse() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});

  const beverages = [
    { id: 1, label: "Coffee Cup", volume: "250ml" },
    { id: 2, label: "Glass Cup", volume: "300ml" },
    { id: 3, label: "Thermos", volume: "500ml" },
    { id: 4, label: "Travel Mug", volume: "650ml" },
    { id: 5, label: "Mineral Water", volume: "600ml" },
    { id: 6, label: "Sport Bottle", volume: "750ml" },
  ];

  const handleCheckboxChange = (id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="rounded-[8px] border border-gray-200 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden mt-3">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm text-primary"
      >
        <span>Common</span>
        <ChevronDown
          className="h-4 w-4 text-gray-500 transition-transform"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-0">
          <div className="grid grid-cols-2 gap-4">
            {beverages.map((beverage) => (
              <label
                key={beverage.id}
                className="flex items-center gap-2 text-sm text-secondary cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedItems[beverage.id] || false}
                  onChange={() => handleCheckboxChange(beverage.id)}
                  className="w-4 h-4 rounded border-2"
                  style={{
                    borderColor: "#A0522D",
                    accentColor: "#A0522D",
                  }}
                />
                <span>
                  {beverage.label} ({beverage.volume})
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SpecialCollapse() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState({
    2: true, // Fitness Bottle is checked by default
  });

  const specialBeverages = [
    { id: 1, label: "Outdoor Bottle", volume: "1500ml" },
    { id: 2, label: "Fitness Bottle", volume: "650ml" },
    { id: 3, label: "Stainless Steel Straw Insulated Cup", volume: "1000ml" },
  ];

  const handleCheckboxChange = (id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="rounded-[8px] border border-gray-200 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden mt-3">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm text-primary"
      >
        <span>Special</span>
        <ChevronDown
          className="h-4 w-4 text-gray-500 transition-transform"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-0">
          <div className="space-y-3">
            {specialBeverages.map((beverage) => {
              const isChecked = selectedItems[beverage.id] || false;
              return (
                <label
                  key={beverage.id}
                  className="flex items-center gap-2 text-sm text-secondary cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(beverage.id)}
                    className="w-4 h-4 rounded border-2"
                    style={{
                      borderColor: "#A0522D",
                      accentColor: "#A0522D",
                    }}
                  />
                  <span>
                    {beverage.label} ({beverage.volume})
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function TodaysRecord() {
  const records = [
    { time: "09:00", volume: "250ml" },
    { time: "12:00", volume: "500ml" },
    { time: "15:00", volume: "750ml" },
  ];

  return (
    <div className="mt-5">
      {/* Header */}
      <div className="flex  mb-3">
        <h3 className="text-base font-medium text-primary">Today's Record</h3>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 transition-colors ml-5"
          aria-label="Edit record"
        >
          <FaPencilAlt className="h-4 w-4" />
        </button>
      </div>

      {/* Record Entries */}
      <div className="space-y-2">
        {records.map((record, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-base text-secondary"
          >
            <span>{record.time}</span>
            <span>{record.volume}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 mt-[28px] mb-[57px] gap-[106px] ">
        <button className="w-[99px] bg-white border border-custom-16 ml-5 rounded-[8px] px- py-1 text-sm text-secondary shadow-[0_2px_6px_#afafaf]">Trend</button>
        <button className="w-[99px] bg-white border border-custom-16 rounded-[8px] px-2 py-1 text-sm text-secondary shadow-[0_2px_6px_#afafaf]">Reminder</button>
      </div>
    </div >
  );
}

export default WaterRecord;
