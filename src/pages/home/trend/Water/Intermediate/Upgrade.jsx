import { Lock, LockKeyhole } from "lucide-react";

const Upgrade = () => {
  return (
    <div className="w-full rounded-[8px] bg-white p-6 shadow-md mt-5 mb-[47px]">
      <div className="flex items-center gap-3">
        {/* Lock Icon */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full">
          <LockKeyhole className="h-9 w-9 text-gray-400" />
        </div>

        {/* Text */}
        <div className="flex-1 text-center">
          <p className="text-sm font-medium text-custom-12">
            Upgrade to Premium for Analysis
          </p>
          <button className="mt-1 text-xs font-medium text-[#dc2626] hover:underline">
            Check causes – Click
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
