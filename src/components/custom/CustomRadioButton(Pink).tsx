import { Info } from "lucide-react";
import { useState } from "react";

const Radio = ({ checked }) => {
  return (
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center border-2
        ${checked ? "border-[#6A1B9A]" : "border-gray-300"}`}
    >
      <div
        className={`w-3 h-3 rounded-full
          ${checked ? "bg-[#6A1B9A] scale-100" : "bg-transparent scale-0"}`}
      />
    </div>
  );
};

export const CustomRadioButtonPink = ({ 
  option, 
  isSelected, 
  onSelect, 
}) => {
  const [showInfo, setShowInfo] = useState(null);
  return (
    <label
      onClick={() => onSelect(option.id)}
      className={`flex items-center justify-between rounded-[20px] px-5 py-4 cursor-pointer border shadow-sm
        ${
          isSelected
            ? "bg-pink-50 border-[#6A1B9A]"
            : "bg-white border-gray-200"
        }`}
    >
      <div className="flex items-center gap-4 flex-1">
        <Radio checked={isSelected} />
        
        <div className="flex-1">
          <p className="text-base text-secondary mb-1">{option.title}</p>
          <p className="text-xs text-[#999]">{option.description}</p>
        </div>
      </div>
    </label>
  );
};