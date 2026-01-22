import { Lock } from "lucide-react";
import { FaLock } from "react-icons/fa6";
import { MdLock, MdLockOutline } from "react-icons/md";

const Upgrade = () => {
  return (
    <div className="rounded-[8px] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.16)] mb-[33px]">
      <div className="flex items-center gap-10">
        {/* Lock Icon */}
        <MdLock className="h-10 w-10 text-gray-200 mt-0.5" />

        {/* Text Content */}
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-1">
            Upgrade to Premium for Analysis
          </p>
          <button className="text-sm text-red-600 hover:underline">
            Urine still yellow? Check diet
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
