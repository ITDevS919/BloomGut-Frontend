import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaCloudDownloadAlt } from "react-icons/fa";

const CheckUpdate = () => {
  const [autoUpdate, setAutoUpdate] = useState(false);

  return (
    <div className="bg-ivory min-h-full p-6 text-primary font-['Noto_Sans_TC', sans-serif]">
      <div className="flex items-center gap-4 mb-[61px]">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-[40px] leading-none cursor-pointer " />
        </button>
        <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">Check for</h2>
      </div>

      <div className="font-['Roboto', sans-serif]">
        <div className="bg-white rounded-[8px] p-4 mb-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-start gap-3">
          <FaCloudDownloadAlt className="w-10 h-15 rounded-[8px] flex items-center justify-center text-[#027aff]" />
          <div className="flex flex-col ml-[15px]">
            <div className="text-sm text-primary">Current Version:</div>
            <div className="text-sm text-primary">BloomGut Health Assistant</div>
            <div className="text-xs text-custom-12">Update Date: March 10, 2025</div>
          </div>
        </div>

        <div className="bg-white rounded-[8px] p-4 mb-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-between text-primary">
          <div className="text-sm text-primary">Update History</div>
          <ChevronRight className="text-primary w-[16px] h-[16px]" />
        </div>

        <div className="bg-white rounded-[8px] p-3 mb-[165px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-between text-primary">
          <div className="text-sm text-primary">Auto Update</div>
          <label className="relative inline-flex items-center">
            <button
              onClick={() => {
                setAutoUpdate((s) => !s)
              }}
              aria-pressed={autoUpdate}
              className="w-12 h-7 flex items-center p-1 rounded-full transition-colors bg-custom-8"
            >
              <div
                className={`w-5 h-5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] transform transition-transform ${autoUpdate ? "translate-x-5 bg-[#C69C6D]" : "translate-x-0 bg-[#C69C6D]"
                  }`}
              />
            </button>
          </label>
        </div>

        <div className="mb-[10px]">
          <button className="w-[242px] mx-auto flex items-center justify-center bg-[#C69C6D] text-white py-3 rounded-[8px] shadow-[0_6px_12px_rgba(0,0,0,0.15)]">Check Updates</button>
          <div className="text-xs text-custom-12 mt-[10px] text-center">Last Checked: April 29, 2025, 08:00 AM</div>
        </div>
      </div>
    </div>
  );
};

export default CheckUpdate;
