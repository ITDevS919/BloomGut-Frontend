import { LockKeyhole } from "lucide-react";

const Upgrade = () => {
  return (
    <>
      <div className="bg-[#E8F5EF] rounded-[8px] p-5 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)] mt-5">
        <div className="text-sm text-left text-gray-500 mb-2">
          In-depth Analysis
        </div>
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full border-2 border-[#28B070] flex items-center justify-center">
            <LockKeyhole className="w-8 h-8 text-[#28B070]" />
          </div>
        </div>
        <div className="text-lg mb-2 text-gray-500">Upgrade to Unlock</div>
        <div className="text-xs text-gray-500 mb-4">
          Track Bowel health and g et personalized tips
        </div>
        <button className="bg-[#28B070] text-white px-6 py-2 rounded-full shadow-md">
          Upgrade Now
        </button>
        <div className="flex justify-between text-xs mt-4">
          <div className="text-secondary">Free</div>
          <div>
            <span style={{ color: '#D38E5A' }}>Premium</span>
            {' '}
            <span style={{ color: '#8E8E8E' }}>Exclusive</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Upgrade;
