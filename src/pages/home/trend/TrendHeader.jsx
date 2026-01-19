import { Activity, ChevronLeft, Coffee, Droplet, Heart } from "lucide-react";
import Bowel from "./Bowel";
import Water from "./Water";
import Urine from "./Urine";
import Diet from "./Diet";

const TrendHeader = (props) => {
  return (
    <div className="bg-ivory p-6 text-secondary">
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-xl leading-none" />
        </button>
        <h2 className="text-xl font-semibold">Health Trends</h2>
      </div>

      <div className="flex justify-end mt-5">
        <button className="bg-[#E2F1DB] text-[#4F7E4E] text-sm px-6 py-1 rounded-2xl shadow-sm">
          Free/7 Days
        </button>
      </div>

      <div className="max-w-md mx-auto space-y-6 mt-10">
        {/* icons row */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex flex-col items-center text-xs text-gray-500">
            <Activity
              className="w-6 h-6 text-amber-400"
              onClick={() => props.setTrendType(<Bowel />)}
            />
            <div className="mt-2">Bowel Trend</div>
          </div>
          <div className="flex flex-col items-center text-xs text-gray-500">
            <Coffee
              className="w-6 h-6 text-amber-400"
              onClick={() => props.setTrendType(<Diet />)}
            />
            <div className="mt-2">Diet Trend</div>
          </div>
          <div className="flex flex-col items-center text-xs text-gray-500">
            <Droplet
              className="w-6 h-6 text-amber-400"
              onClick={() => props.setTrendType(<Water />)}
            />
            <div className="mt-2">Water Trend</div>
          </div>
          <div className="flex flex-col items-center text-xs text-gray-500">
            <Heart
              className="w-6 h-6 text-amber-400"
              onClick={() => props.setTrendType(<Urine />)}
            />
            <div className="mt-2">Urine Trend</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendHeader;
