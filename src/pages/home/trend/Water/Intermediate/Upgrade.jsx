import { LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Upgrade = () => {
  return (
    <div className="mb-[70px]">
      {/* upgrade card */}
      <div className="bg-[#D6EAF8] rounded-[27px] p-4 text-center mt-5 shadow-md">
        <div className="text-sm text-left text-custom-12 mb-2">
          In-depth Analysis
        </div>
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full border border-custom-13 flex items-center justify-center">
            <LockKeyhole className="w-8 h-8 text-custom-13" />
          </div>
        </div>
        <div className="text-base text-custom-12 mb-5">Upgrade to Unlock</div>
        <div className="text-xs text-gray-500 mb-5">
          Unlock water insights & find what affects your gut
        </div>
        <button className="bg-custom-13 text-white px-6 py-2 rounded-full shadow-md cursor-pointer"
          onClick={() =>
            navigate("/setting/upgrade-plan?trendType=water&showPremium=true")
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