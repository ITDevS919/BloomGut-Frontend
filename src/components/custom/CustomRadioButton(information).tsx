import { Info } from "lucide-react";
import { useState, useRef, useEffect } from "react";

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
  tooltipText,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const infoButtonRef = useRef(null);
  const tooltipRef = useRef(null);

  // Default tooltip text if not provided
  const defaultTooltipText = "Measure urination time if <15 sec.";
  const displayText = tooltipText || defaultTooltipText;

  // Handle click outside to close tooltip
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target) &&
        infoButtonRef.current &&
        !infoButtonRef.current.contains(event.target)
      ) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip]);

  // const handleInfoClick = (e) => {
  //   e.stopPropagation();
  //   if (infoButtonRef.current) {
  //     const rect = infoButtonRef.current.getBoundingClientRect();
  //     setTooltipPosition({
  //       x: rect.left + rect.width / 2,
  //       y: rect.top,
  //     });
  //     setShowTooltip(!showTooltip);
  //   }
  //   if (onInfoClick) {
  //     onInfoClick(option);
  //   }
  // };

  const handleInfoHover = (e) => {
    if (infoButtonRef.current) {
      const rect = infoButtonRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2 - 50 ,
        y: rect.top,
      });
      setShowTooltip(true);
    }
  };

  const handleInfoLeave = () => {
    setShowTooltip(false);
  };

  return (
    <>
      <label
        onClick={() => onSelect(option.id)}
        className={`flex items-center justify-between rounded-[24px] px-5 py-4 cursor-pointer border shadow-sm
          ${
            isSelected
              ? "bg-orange-50 border-[#F09129]"
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

        {/* Information Icon */}
        <button
          ref={infoButtonRef}
          type="button"
          // onClick={handleInfoClick}
          onMouseEnter={handleInfoHover}
          onMouseLeave={handleInfoLeave}
          className="ml-3 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors cursor-pointer relative"
          aria-label="More information"
        >
          <Info className="w-3.5 h-3.5 text-custom-12" />
        </button>
      </label>

      {/* Tooltip */}
      {showTooltip && (
        <div
          ref={tooltipRef}
          className="fixed z-50 bg-white rounded-[24px] shadow-[0_2px_6px_#afafaf] px-4 py-3"
          style={{
            width: '148px',
            border: '1px solid #fff',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
            marginTop: '-8px',
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={handleInfoLeave}
        >
          <p className="text-xs text-[#afafaf] text-center leading-relaxed">
            {displayText}
          </p>
        </div>
      )}
    </>
  );
};