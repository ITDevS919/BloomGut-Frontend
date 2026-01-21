import { CustomButton } from "@/components/custom/CustomButton";
import CustomHeading from "@/components/custom/CustomHeading";
import { ChevronDown, ChevronLeft, Pencil } from "lucide-react";
import { useState } from "react";

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
          <ChevronLeft className="text-primary text-[40px] leading-none" />
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
        <CustomButton variant="outline" className="bg-white">
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
          <div className="relative h-6 rounded-full bg-gray-200">
            <div
              className="absolute left-0 top-0 h-6 rounded-full bg-blue-400 text-center text-white text-xs leading-6"
              style={{ width: "32%" }}
            >
              650ml
            </div>
          </div>
        </div>

        {/* Recently Used */}
        <div className="flex items-center justify-between text-sm mt-5">
          <span className="font-medium">Recently Used</span>
          <button className="shadow-[0_4px_12px_rgba(0,0,0,0.08)] border-gray-400 rounded-[8px] border px-3 py-1 text-xs">
            Custom Amount
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-3">
          <QuickItem icon="☕" label="Coffee Cup" value="250ml" />
          <QuickItem icon="🥛" label="Glass Cup" value="350ml" />
          <QuickItem icon="🧴" label="Sport Bottle" value="750ml" />
        </div>

        <CustomHeading
          label="Select Container Type"
          isRequired
          className="mt-5"
        />
        <CommonCollapse />

        <CustomHeading label="Special" isRequired className="mt-5" />
        <SpecialCollapse />

        {/* Today's Record */}
        <TodaysRecord />

        <button
          type="button"
          className="w-10/12 mx-auto flex items-center justify-center text-white text-lg font-medium rounded-[8px] bg-[#C69C6D] py-3 shadow-[0_4px_12px_rgba(0,0,0,0.08)] mt-5"
          onClick={() => alert(`Saved language: ${selected}`)}
        >
          Save
        </button>
      </div>
    </div>
  );
};

function QuickItem({ icon, label, value, active }) {
  return (
    <div className="rounded-[8px] border p-3 text-center text-xs shadow-[0_4px_12px_rgba(0,0,0,0.08)] border-gray-400">
      <div className="text-xl">{icon}</div>
      <p className="mt-1 font-medium">{label}</p>
      <p className="text-gray-500">{value}</p>
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
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-primary">Today's Record</h3>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Edit record"
        >
          <Pencil className="h-4 w-4" />
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
    </div>
  );
}

export default WaterRecord;
