import { ChevronLeft, Bell, Pencil } from "lucide-react";
import { CustomButton } from "@/components/custom/CustomButton";
import CustomHeading from "@/components/custom/CustomHeading";
import { useState } from "react";
import { FlowOptionCard } from "@/components/custom/CustomRadioButton(information)";
import { CustomRadioButtonGreen } from "@/components/custom/CustomRadioButton(Green)";
import { CustomRadioButtonRed } from "@/components/custom/CustomRadioButton(Red)";
import { CustomRadioButtonPink } from "@/components/custom/CustomRadioButton(Pink)";
import { MdEditNotifications } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { set } from "react-hook-form";
import { toast } from "sonner";
import useApiClient from "@/hooks/useApiClient";

const EstimatedUrinationTimeOptions = [
  {
    id: "short",
    title: "Short & Strong",
    description: "< 5 sec (~100-150 ml)",
  },
  {
    id: "steady",
    title: "Steady Flow",
    description: "5-15 sec (~200-300 ml)",
  },
  {
    id: "prolonged",
    title: "Prolonged Flow",
    description: "15 sec (Approx.)",
  },
];

const ClarityOptions = [
  {
    id: "clear and transparent",
    title: "Clear and Transparent",
  },
  {
    id: "SlightlyCloudy",
    title: "Slightly Cloudy",
  },
  {
    id: "Noticeably Cloudy",
    title: "Noticeably Cloudy",
  },
];

const OdorOptions = [
  {
    id: "No Odor",
    title: "No Noticeable Odor",
  },
  {
    id: "Odor",
    title: "Has Odor",
  },
];

const UrinationFrequencyOptions = [
  {
    id: "normal",
    title: "Normal(4-6/day)",
  },
  {
    id: "requent",
    title: "requent(≈10/day)",
  },
  {
    id: "very frequent",
    title: "Very Frequent(>10/day)",
  },
  {
    id: "rare",
    title: "Rare(≈4/day)",
  },
];

const NocturnalUrinationOptions = [
  {
    id: "none",
    title: "None(no wake-ups)",
  },
  {
    id: "once",
    title: "Once/night",
  },
  {
    id: "more once",
    title: "≥2 / night",
  },
];

const UrineRecord = () => {
  const navigate = useNavigate();
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

  const [urineStatusValue, setUrineStatusValue] = useState(50);
  const [urineColor, setUrineColor] = useState("Light Yellow");
  const [estimatedUrinationTimeValue, setEstimatedUrinationTimeValue] =
    useState("");
  const [clarityValue, setClarityValue] = useState("");
  const [odorValue, setOdorValue] = useState("");
  const [urinationFrequencyValue, setUrinationFrequencyValue] = useState("");
  const [nocturnalUrinationValue, setNocturnalUrinationValue] = useState("");
  const [showMissingFieldsModal, setShowMissingFieldsModal] = useState("");

  const getStatus = (v) => {
    if (v < 33) return "Transparent";
    else if (v < 55) return "Pale Yellow";
    else if (v < 77) return "Light Yellow";
    else if (v < 88) return "Dark Yellow";
    return "Amber/Brown";
  };

  const validateForm = () => {
    const missingFields = [];

    if (!estimatedUrinationTimeValue) {
      missingFields.push("Estimated Urination Time");
    }
    if (!clarityValue) {
      missingFields.push("Clarity");
    }
    if (!odorValue) {
      missingFields.push("Odor");
    }
    if (!urinationFrequencyValue) {
      missingFields.push("Urination Frequency");
    }
    if (!nocturnalUrinationValue) {
      missingFields.push("Nocturnal Urination");
    }

    return missingFields;
  };

  const handleSave = async () => {
    const missingFields = validateForm();

    if (missingFields.length > 0) {
      setShowMissingFieldsModal(true);
    } else {
      // Proceed with save

      const param = {
        color: urineColor,
        estimatedTime: estimatedUrinationTimeValue,
        clarity: clarityValue,
        odor: odorValue,
        frequency: urinationFrequencyValue,
        nocturnalUrination: nocturnalUrinationValue,
      };

      try {
        const response = await api.put("/record/urine", {
          userId: auth.user.id,
          ...param,
        });

        setUrineStatusValue(50);
        setUrineColor("Light Yellow");
        setEstimatedUrinationTimeValue("");
        setClarityValue("");
        setOdorValue("");
        setUrinationFrequencyValue("");
        setNocturnalUrinationValue("");
        toast.success(response.data.data);
      } catch (error) {
        console.error("Error saving data:", error);
        toast.error("Failed to save urine record. Please try again.");
      }
    }
  };

  const handleViewTrend = () => {
    navigate("/trend-analysis", { state: { trendType: "urine" } });
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
        <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">
          Urine Record
        </h2>
      </div>

      {/* date and view trend button */}
      <div className="flex justify-between mb-5">
        <div>
          <p className="text-xl text-primary font-bold font-base">
            {days[new Date().getDay()]}
          </p>
          <p className="text-base text-primary">
            {months[new Date().getMonth()]} {new Date().getDate()}
          </p>
        </div>
        <CustomButton
          variant="outline"
          className="bg-white"
          onClick={handleViewTrend}
        >
          View Trend
        </CustomButton>
      </div>

      {/* urine status */}
      <CustomHeading label="Urine Status" isRequired />
      <div className="w-full max-w-md mx-auto mb-10">
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={urineStatusValue}
            onChange={(e) => {
              setUrineStatusValue(e.target.value);
              if (e.target.value < 33) setUrineColor("Transparent");
              else if (e.target.value < 55) setUrineColor("Pale Yellow");
              else if (e.target.value < 77) setUrineColor("Light Yellow");
              else if (e.target.value < 88) setUrineColor("Dark Yellow");
              else setUrineColor("Amber/Brown");
              setUrineColor("Deep Yellow");
            }}
            className="w-full h-10 appearance-none bg-linear-to-r from-yellow-50 via-yellow-200 to-yellow-800 rounded-full outline-none"
          />

          <style>
            {`
      input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        height: 40px;
        width: 40px;
        border-radius: 9999px;
        background: white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        border: 1px solid #e5e7eb;
      }`}
          </style>
        </div>

        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Transp</span>
          <span>Pale</span>
          <span>Deep</span>
        </div>

        <p className="mt-3 text-center text-gray-400 text-sm">
          Selected: {getStatus(urineStatusValue)}
        </p>
      </div>

      {/* estimated urination time */}
      <CustomHeading label="Estimated Urination Time" isRequired />
      <div className="mt-4 space-y-3 mb-10">
        {EstimatedUrinationTimeOptions.map((option) => (
          <FlowOptionCard
            key={option.id}
            option={option}
            isSelected={estimatedUrinationTimeValue === option.id}
            onSelect={setEstimatedUrinationTimeValue}
            onInfoClick={(option) => {
              // Show modal or tooltip with more info
            }}
          />
        ))}
      </div>

      {/* clarity and odor */}
      <CustomHeading label="Clarity" isRequired />
      <div className="mt-4 space-y-3 mb-10">
        {ClarityOptions.map((option) => (
          <CustomRadioButtonGreen
            key={option.id}
            option={option}
            isSelected={clarityValue === option.id}
            onSelect={setClarityValue}
            onInfoClick={(option) => {
              // Show modal or tooltip with more info
            }}
          />
        ))}

        <CustomHeading label="Odor" className="mt-10" isRequired />
        {OdorOptions.map((option) => (
          <CustomRadioButtonGreen
            key={option.id}
            option={option}
            isSelected={odorValue === option.id}
            onSelect={setOdorValue}
            onInfoClick={(option) => {
              // Show modal or tooltip with more info
            }}
          />
        ))}
      </div>

      {/* urination frequency */}
      <CustomHeading label="Urination Frequency" isRequired />
      <div className="mt-4 space-y-3 mb-10">
        {UrinationFrequencyOptions.map((option) => (
          <CustomRadioButtonRed
            key={option.id}
            option={option}
            isSelected={urinationFrequencyValue === option.id}
            onSelect={setUrinationFrequencyValue}
            onInfoClick={(option) => {
              // Show modal or tooltip with more info
            }}
          />
        ))}
      </div>

      <CustomHeading label="Nocturnal Urination" isRequired />
      <div className="mt-4 space-y-3 mb-10">
        {NocturnalUrinationOptions.map((option) => (
          <CustomRadioButtonPink
            key={option.id}
            option={option}
            isSelected={nocturnalUrinationValue === option.id}
            onSelect={setNocturnalUrinationValue}
            onInfoClick={(option) => {
              // Show modal or tooltip with more info
            }}
          />
        ))}
      </div>

      <div className="text-gray-400 flex text-center justify-center italic">
        For reference only. Consult a physician if needed.
      </div>
      <button
        onClick={handleSave}
        className="w-[242px] mx-auto transition-all duration-150 active:scale-[0.98] active:shadow-[0_4px_10px_rgba(0,0,0,0.18)] min-h-[48px] flex items-center justify-center text-white text-base rounded-[24px] bg-[#C69C6D] py-3 shadow-[0_4px_10px_rgba(0,0,0,0.18)] mt-5"
      >
        Save
      </button>

      {/* Missing Fields Modal */}
      {showMissingFieldsModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/20"
            onClick={() => setShowMissingFieldsModal(false)}
          />
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
            <div
              className="bg-ivory rounded-[8px] shadow-[0_4px_8px_rgba(0,0,0,0.25)] pb-6 px-6 max-w-xs w-full pointer-events-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon */}
              <div className="flex justify-center -mt-4 mb-4">
                <div className="relative">
                  <MdEditNotifications size={48} color="#000000" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-[20px] font-['Mulish', sans-serif] font-medium text-[#e53935] text-center mb-2">
                Missing fields
              </h3>

              {/* Message */}
              <p className="text-base font-['Mulish', sans-serif] text-[#d32f2f] text-center mb-6">
                Please fill in
              </p>

              {/* Confirm Button */}
              <button
                onClick={() => setShowMissingFieldsModal(false)}
                className="w-[159px] mx-auto transition-all duration-150 active:scale-[0.98] active:shadow-[0_4px_10px_rgba(0,0,0,0.18)] min-h-[48px] flex items-center justify-center text-white text-base rounded-[24px] bg-[#C69C6D] py-3 shadow-[0_4px_10px_rgba(0,0,0,0.18)] mt-5"
              >
                Confirm
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UrineRecord;
