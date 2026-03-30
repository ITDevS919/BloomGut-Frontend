import { LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Upgrade = () => {
  return (
    <div className="mb-[70px] p-4">
      {/* upgrade card */}
      <div className="bg-[#CFE4B8] rounded-[27px] p-4 text-center shadow-[0_2px_4px_rgba(0,0,0,0.08)] mt-5 shadow-md">
        <div className="text-sm text-left text-custom-12 mb-2">
          In-depth Analysis
        </div>
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full border border-[#6AA84F] flex items-center justify-center">
            <LockKeyhole className="w-8 h-8 text-[#6AA84F]" />
          </div>
        </div>
        <div className="text-base text-custom-12 mb-5">Upgrade to Unlock</div>
        <div className="text-xs text-gray-500 mb-5">
          Unlock diet insights & find what affects your gut
        </div>
        <button className="bg-[#6AA84F] text-white px-6 py-2 rounded-full shadow-md cursor-pointer"
          onClick={() =>
            navigate("/setting/upgrade-plan?trendType=diet&showPremium=true")
          }
        >
          Upgrade Now
        </button>
        <div className="flex justify-between text-xs mt-4">
          <div className="text-custom-12">Free</div>
          <div>
            <span style={{ color: '#D38E5A' }}>Premium</span>
            {' '}
            <span style={{ color: '#8E8E8E' }}>Exclusive</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;