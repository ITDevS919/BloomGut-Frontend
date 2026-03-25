import { CustomButton } from "@/components/custom/CustomButton";
import CustomHeading from "@/components/custom/CustomHeading";
import { DropDownSelectorItem } from "@/components/custom/DropDownSelectorItem";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { FaBottleWater, FaGlassWater, FaMugHot } from "react-icons/fa6";
import { FaBell } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import useApiClient from "@/hooks/useApiClient";
import { getRecordWaterToday, putRecordWater } from "@/api/http";
import { loadWaterReminders } from "@/utils/waterReminders";
import { useNavigate } from "react-router-dom";

const WaterRecord = () => {
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();
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
  const [selectedCommonValues, setSelectedCommonValues] = useState([]);
  const [selectedSpecialValues, setSelectedSpecialValues] = useState([]);
  const [todayRecords, setTodayRecords] = useState([]);

  const waterReminders = useMemo(() => loadWaterReminders(), []);
  const navigate = useNavigate();

  const fetchTodayRecords = useCallback(async () => {
    if (!auth?.user?.id) return;
    try {
      const referenceDate = new Date().toISOString();
      const timezoneOffsetMinutes = new Date().getTimezoneOffset();
      const res = await getRecordWaterToday(api, {
        params: { userId: auth.user.id, referenceDate, timezoneOffsetMinutes },
      });
      const data = res.data?.data ?? res.data;
      setTodayRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to fetch today's water records:", err);
      setTodayRecords([]);
    }
  }, [api, auth?.user?.id]);

  useEffect(() => {
    fetchTodayRecords();
  }, [fetchTodayRecords]);

  const handleViewTrend = () => {
    // `Trend` page uses `location.state.trendType` (router state), not the query string.
    // Navigate inside the app so the correct trend is rendered.
    navigate("/trend-analysis", { state: { trendType: "water" } });
  };

  const parseMl = (value) => {
    if (!value) return 0;
    const numeric = parseInt(value, 10);
    return Number.isNaN(numeric) ? 0 : numeric;
  };

  const calculateTotalAmount = () => {
    let total = 0;

    selectedCommonValues.forEach((val) => {
      const opt = commonOptions.find((o) => o.value === val);
      if (opt) {
        total += parseMl(opt.value);
      }
    });

    selectedSpecialValues.forEach((val) => {
      const opt = specialOptions.find((o) => o.value === val);
      if (opt) {
        total += parseMl(opt.value);
      }
    });

    return total;
  };

  const handleSave = async () => {
    if (!auth?.user?.id) {
      toast.error("You must be logged in to save water records.");
      return;
    }

    const totalAmount = calculateTotalAmount();

    if (totalAmount <= 0) {
      toast.error("Please select at least one container amount before saving.");
      return;
    }

    const containerType = selectedCommonValues[0] || null;
    const specialContainerType = selectedSpecialValues[0] || null;

    try {
      const response = await putRecordWater(api, {
        userId: auth.user.id,
        containerType,
        specialContainerType,
        amount: totalAmount,
      });

      toast.success(response.data.data);
      fetchTodayRecords();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error saving water record:", error);
      toast.error("Failed to save water record. Please try again.");
    }
  };
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
        <CustomButton variant="outline" className="bg-white cursor-pointer"
          onClick={handleViewTrend}
        >
          View Trend
        </CustomButton>
      </div>

      {/* Header */}
      <CustomHeading label="Water Record" isRequired className="ml-3" />
      <div className="p-2">
        {/* Progress */}
        {(() => {
          const todayTotalMl = todayRecords.reduce((sum, r) => sum + (r.amount || 0), 0);
          const targetMl = 2000;
          const percent = targetMl > 0 ? Math.min(100, Math.round((todayTotalMl / targetMl) * 100)) : 0;
          return (
            <div className="space-y-1 text-xs text-gray-600 mt-3">
              <div className="flex justify-between">
                <span>Today</span>
                <span>{todayTotalMl}ml / {targetMl}ml</span>
              </div>
              <div className="relative h-6 rounded-full bg-[#e5e5e5] shadow-[0_2px_8px_rgba(0,0,0,0.16)]">
                <div
                  className="absolute left-0 top-0 h-6 rounded-full bg-custom-13 text-center text-white text-xs leading-6"
                  style={{ width: `${percent}%` }}
                >
                  {todayTotalMl > 0 ? `${todayTotalMl}ml` : ""}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Recently Used */}
        <div className="flex items-center justify-between text-sm mt-[44px] mb-[31px]">
          <span className="font-medium">Recently Used</span>
          <button
            type="button"
            className="bg-white shadow-[0_2px_8px_#afafaf] text-secondary border-custom-16 rounded-[8px] border px-3 py-1 text-xs cursor-pointer"
            onClick={() => navigate("/custom-volume")}
          >
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
          onChangeSelected={setSelectedCommonValues}
        />

        <CustomHeading label="Special" isRequired className="mt-5 mb-5" />
        <DropDownSelectorItem
          title="Special"
          options={specialOptions}
          variant="special"
          onChangeSelected={setSelectedSpecialValues}
        />

        {/* Today's Record */}
        <TodaysRecord
          waterReminders={waterReminders}
          onViewTrend={handleViewTrend}
          todayRecords={todayRecords}
        />

        <button
          type="button"
          className="w-[242px] mx-auto transition-all duration-150 active:scale-[0.98] active:shadow-[0_4px_10px_rgba(0,0,0,0.18)] min-h-[48px] flex items-center justify-center text-white text-base rounded-[24px] bg-[#C69C6D] py-3 shadow-[0_4px_10px_rgba(0,0,0,0.18)] mt-5"
          onClick={handleSave}
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

function TodaysRecord({ waterReminders, onViewTrend, todayRecords = [] }) {
  const navigate = useNavigate();

  return (
    <div className="mt-5">
      {/* Header */}
      <div className="flex  mb-3">
        <h3 className="text-base font-medium text-primary">Today&apos;s Record</h3>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 transition-colors ml-5"
          aria-label="Add custom volume"
        >
          <FaPencilAlt className="h-4 w-4 cursor-pointer" onClick={() => navigate("/custom-volume?initialVolume=250")} aria-label="Add custom volume" />
        </button>
      </div>

      {/* Record Entries */}
      <div className="space-y-2">
        {todayRecords.length === 0 ? (
          <p className="text-sm text-secondary">No records today. Add water above or tap the pencil for custom amount.</p>
        ) : (
          todayRecords.map((record, index) => (
            <div
              key={`${record.time}-${index}`}
              className="flex items-center justify-between text-base text-secondary"
            >
              <span>{record.time}</span>
              <span>{record.amount}ml</span>
            </div>
          ))
        )}
      </div>

      <div className="mt-[28px] mb-[57px] space-y-3">
        {waterReminders && (
          <div className="rounded-[8px] bg-[#eff6ff] border border-[#79B6E2]/30 px-4 py-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-primary">
              <FaBell className="text-[#79B6E2] shrink-0" />
              <span>
                {waterReminders.enabled
                  ? `Reminders ${waterReminders.reminders.length > 0 ? `• ${waterReminders.reminders.join(", ")}` : "(none set)"}`
                  : "Reminders off"}
              </span>
            </div>
            <button
              type="button"
              className="text-sm font-medium text-[#79B6E2] hover:underline shrink-0"
              onClick={() => navigate("/reminders")}
            >
              Manage
            </button>
          </div>
        )}
        <div className="grid grid-cols-2 gap-[106px]">
          <button
            type="button"
            className="w-[99px] bg-white border border-custom-16 ml-5 rounded-[8px] px-2 py-1 text-sm text-secondary shadow-[0_2px_6px_#afafaf]"
            onClick={onViewTrend}
          >
            Trend
          </button>
          <button
            type="button"
            className="w-[99px] bg-white border border-custom-16 rounded-[8px] px-2 py-1 text-sm text-secondary shadow-[0_2px_6px_#afafaf]"
            onClick={() => navigate("/reminders")}
          >
            Reminders
          </button>
        </div>
      </div>
    </div >
  );
}

export default WaterRecord;
