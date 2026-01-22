import { Lock } from "lucide-react";

const Upgrade = () => {
  return (
    <div className="rounded-[8px] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Lock className="h-5 w-5 text-gray-500" />
        <p className="text-gray-600 text-sm">Upgrade to Premium for Analysis</p>
      </div>
      <p className="text-red-500 text-sm pl-7">
        Digestive issues? Analyze yesterday's meals.
      </p>
    </div>
  );
};

export default Upgrade;