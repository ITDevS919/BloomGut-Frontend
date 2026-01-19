import { LockKeyhole } from "lucide-react";

const Upgrade = () => {
  return (
    <>
      <div className="bg-[#FBF1C0] rounded-xl p-5 text-center shadow-sm mt-5">
        <div className="text-sm text-left text-gray-500 mb-2">
          In-depth Analysis
        </div>
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full border-2 border-[#FBC52D] flex items-center justify-center">
            <LockKeyhole className="w-8 h-8 text-[#FBC52D]" />
          </div>
        </div>
        <div className="text-lg mb-2 text-gray-500">Upgrade to Unlock</div>
        <div className="text-xs text-gray-500 mb-4">
          Track Bowel health and g et personalized tips
        </div>
        <button className="bg-[#FBC52D] text-white px-6 py-2 rounded-full shadow-md">
          Upgrade Now
        </button>
        <div className="flex justify-between text-xs text-secondary mt-4">
          <div>Free</div>
          <div>Premium Exclusive</div>
        </div>
      </div>
    </>
  );
};

export default Upgrade;
