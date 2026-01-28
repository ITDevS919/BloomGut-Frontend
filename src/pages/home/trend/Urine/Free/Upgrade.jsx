import { LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Upgrade = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-[#FBF1C0] rounded-[27px] p-5 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-10 mt-5">
        <div className="text-xs text-left text-custom-12 mb-2">
          In-depth Analysis
        </div>
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full border border-[#ffdc6c] flex items-center justify-center bg-white">
            <LockKeyhole className="w-8 h-8 text-[#FBC52D]" />
          </div>
        </div>
        <div className="text-base font-['Aleo'] mb-[14px] text-custom-12">Upgrade to Unlock</div>
        <div className="text-xs text-secondary font-['Noto Sans TC'] mb-5">
          Track Bowel health and get personalized tips
        </div>
        <button className="bg-[#FBC52D] text-white px-6 py-2 rounded-full shadow-md cursor-pointer"
          onClick={() => navigate("/setting/upgrade-plan?plan=standard&trendType=urine")}
        >
          Upgrade Now
        </button>
        <div className="flex justify-between text-xs">
          <div className="text-custom-12">Free</div>
          <div>
            <span style={{ color: '#f6c700' }}>Premium</span>
            {' '}
            <span style={{ color: '#9e9e9e' }}>Exclusive</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Upgrade;
