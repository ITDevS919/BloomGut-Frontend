import { ChevronLeft } from "lucide-react";
import { CustomButton } from "@/components/custom/CustomButton";
import CustomHeading from "@/components/custom/CustomHeading";
import { useState } from "react";
import { FlowOptionCard } from "@/components/custom/CustomRadioButton(information)";
import { CustomRadioButtonGreen } from "@/components/custom/CustomRadioButton(Green)";
import { CustomRadioButtonRed } from "@/components/custom/CustomRadioButton(Red)";
import { CustomRadioButtonPink } from "@/components/custom/CustomRadioButton(Pink)";

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
  const [estimatedUrinationTimeValue, setEstimatedUrinationTimeValue] =
    useState("steady");
  const [clarityValue, setClarityValue] = useState("clear and transparent");
  const [odorValue, setOdorValue] = useState("No Odor");
  const [urinationFrequencyValue, setUrinationFrequencyValue] =
    useState("normal");
  const [nocturnalUrinationValue, setNocturnalUrinationValue] =
    useState("none");

  const getStatus = (v) => {
    if (v < 33) return "Transparent (Over Hydrated)";
    if (v < 66) return "Light Yellow (Well Hydrated)";
    return "Deep Yellow (Dehydrated)";
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
          <ChevronLeft className="text-primary text-xl leading-none" />
        </button>
        <h2 className="text-xl font-semibold">Urine Record</h2>
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
        <CustomButton variant="outline" className="bg-white">
          View Trend
        </CustomButton>
      </div>

      {/* urine status */}
      <CustomHeading label="Urine Status" isRequired />
      <div class="w-full max-w-md mx-auto mb-10">
        <div class="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={urineStatusValue}
            onChange={(e) => setUrineStatusValue(e.target.value)}
            class="w-full h-10 appearance-none bg-gradient-to-r from-yellow-50 via-yellow-200 to-yellow-400 rounded-full outline-none"
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

        <div class="flex justify-between mt-2 text-sm text-gray-600">
          <span>Transp</span>
          <span>Pale</span>
          <span>Deep</span>
        </div>

        <p class="mt-3 text-center text-gray-400 text-sm">
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
              console.log("Info for:", option);
            }}
          />
        ))}
      </div>

      {/* clarity and odor */}
      <CustomHeading label="Clarity and Odor" isRequired />
      <div className="mt-4 space-y-3 mb-10">
        {ClarityOptions.map((option) => (
          <CustomRadioButtonGreen
            key={option.id}
            option={option}
            isSelected={clarityValue === option.id}
            onSelect={setClarityValue}
            onInfoClick={(option) => {
              // Show modal or tooltip with more info
              console.log("Info for:", option);
            }}
          />
        ))}

        {OdorOptions.map((option) => (
          <CustomRadioButtonGreen
            key={option.id}
            option={option}
            isSelected={odorValue === option.id}
            onSelect={setOdorValue}
            onInfoClick={(option) => {
              // Show modal or tooltip with more info
              console.log("Info for:", option);
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
              console.log("Info for:", option);
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
              console.log("Info for:", option);
            }}
          />
        ))}
      </div>

      <div className="text-gray-400 flex text-center justify-center italic">
        For reference only. Consult a physician if needed.
      </div>
      <button className="px-6 py-2 rounded-lg bg-[#C69C6D] text-white shadow-sm w-1/2 text-center mx-auto mt-5">
        Save
      </button>
    </div>
  );
};

export default UrineRecord;
