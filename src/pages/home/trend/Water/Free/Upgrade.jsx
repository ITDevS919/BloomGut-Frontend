import { LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Upgrade = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* upgrade card */}
      <div className="bg-[#E8F4FF] rounded-[27px] p-5 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)] mt-[66px] mb-[60px]">
        <div className="text-xs text-left text-custom-12 mb-2">
          In-depth Analysis
        </div>
        <div className="flex justify-center mb-[10px]">
          <div className="w-16 h-16 rounded-full border-2 border-[#2196f3] flex items-center justify-center">
            <LockKeyhole className="w-8 h-8 text-[#2196f3]" />
          </div>
        </div>
        <div className="text-base text-custom-12 font-['Mulish'] mb-5">Upgrade to Unlock</div>
        <div className="text-xs text-secondary mb-[21px]">
          Track Bowel health and g et personalized tips
        </div>
        <button className="bg-[#3788C1] font-['Mulish'] text-white px-6 py-2 rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.08)] cursor-pointer"
          onClick={() =>
            navigate("/setting/upgrade-plan?trendType=water")
          }
        >
          Upgrade Now
        </button>
        <div className="flex justify-between text-xs mt-4">
          <div className="text-custom-12">Free</div>
          <div>
            <span style={{ color: '#2196f3' }}>Premium</span>
            {' '}
            <span style={{ color: '#9e9e9e' }}>Exclusive</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Upgrade