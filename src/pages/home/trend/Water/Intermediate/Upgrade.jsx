import { Lock } from "lucide-react";

const Upgrade = () => {
  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-md mt-5">
      <div className="flex items-center gap-3">
        {/* Lock Icon */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <Lock className="h-5 w-5 text-gray-400" />
        </div>

        {/* Text */}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400">
            Upgrade to Premium for Analysis
          </p>
          <button className="mt-1 text-sm font-medium text-red-500 hover:underline">
            Check causes – Click
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
