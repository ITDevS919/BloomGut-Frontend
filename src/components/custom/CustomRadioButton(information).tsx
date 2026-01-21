import { Info } from "lucide-react";
import { useState } from "react";

const Radio = ({ checked }) => {
  return (
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center border-2
        ${checked ? "border-[#F09129]" : "border-gray-300"}`}
    >
      <div
        className={`w-3 h-3 rounded-full
          ${checked ? "bg-[#F09129] scale-100" : "bg-transparent scale-0"}`}
      />
    </div>
  );
};

export const FlowOptionCard = ({ 
  option, 
  isSelected, 
  onSelect, 
  onInfoClick,
}) => {
  const [showInfo, setShowInfo] = useState(null);
  return (
    <label
      onClick={() => onSelect(option.id)}
      className={`flex items-center justify-between rounded-[8px] px-5 py-4 cursor-pointer border shadow-[0_4px_12px_rgba(0,0,0,0.08)]
        ${
          isSelected
            ? "bg-orange-50 border-[#F09129]"
            : "bg-white border-gray-200"
        }`}
    >
      <div className="flex items-center gap-4 flex-1">
        <Radio checked={isSelected} />
        
        <div className="flex-1">
          <p className="text-gray-800 mb-1">{option.title}</p>
          <p className="text-sm text-gray-500">{option.description}</p>
        </div>
      </div>

      {/* Information Icon */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (onInfoClick) {
            onInfoClick(option);
          }
        }}
        className="ml-3 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
        aria-label="More information"
      >
        <Info className="w-3.5 h-3.5 text-gray-600" />
      </button>
    </label>
  );
};