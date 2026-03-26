import { Lock } from "lucide-react";
import { FaLock } from "react-icons/fa6";
import { MdLockOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Upgrade = () => {
  const navigate = useNavigate();
  
  const handleUpgradeClick = () => {
    navigate("/setting/upgrade-plan?trendType=bowel&showPremium=true");
  };
  
  return (
    <div className="rounded-[8px] bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-[52px]">
      <div className="flex items-center gap-10">
        {/* Lock Icon */}
        <MdLockOutline className="h-10 w-10 text-gray-200 mt-0.5" />

        {/* Text Content */}
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-1">
            Upgrade to Premium for Analysis
          </p>
          <button 
            className="text-sm text-red-600 hover:underline"
            onClick={handleUpgradeClick}
          >
            Find bowel causes – Click
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
