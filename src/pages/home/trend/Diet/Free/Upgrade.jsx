import { LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Upgrade = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-[#E8F5EF] rounded-[27px] p-5 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)] mt-5 mb-[49px]">
        <div className="text-xs text-left text-secondary mb-2">
          In-depth Analysis
        </div>
        <div className="flex justify-center mb-2">
          <div className="w-16 h-16 rounded-full border border-[#b8dacf] flex items-center justify-center bg-[#e2f1db]">
            <LockKeyhole className="w-8 h-8 text-[#28B070]" />
          </div>
        </div>
        <div className="text-base font-medium mb-2 font-['Mulish'] text-custom-12">Upgrade to Unlock</div>
        <div className="text-xs text-secondary mb-4">
          Track Bowel health and g et personalized tips
        </div>
        <button className="bg-[#28B070] text-white px-6 py-2 rounded-[22px] font-['Mulish'] border border-white shadow-md cursor-pointer"
          onClick={() => navigate("/setting/upgrade-plan")}
        >
          Upgrade Now
        </button>
        <div className="flex justify-between text-xs mt-4">
          <div className="text-custom-12">Free</div>
          <div>
            <span style={{ color: '#28B070' }}>Premium</span>
            {' '}
            <span style={{ color: '#9e9e9e' }}>Exclusive</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Upgrade;
