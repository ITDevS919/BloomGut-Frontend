import { Smile } from "lucide-react";
import Upgrade from "./Upgrade";
import { FaSmile } from "react-icons/fa";

const Free = () => {
  const days = [
    { day: "Mon", status: "clear" },
    { day: "Tue", status: "clear" },
    { day: "Wed", status: "yellow" },
    { day: "Thu", status: "clear" },
    { day: "Fri", status: "yellow" },
    { day: "Sat", status: "clear" },
    { day: "Sun", status: "abnormal" },
  ];

  const colors = {
    clear: "bg-green-400",
    yellow: "bg-yellow-400",
    abnormal: "bg-red-400",
  };

  return (
    <div className="pl-[15px] pr-[15px]">
      {/* Score Card */}
      <div className="bg-white rounded-[27px] p-[32px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] mb-[28px]">
        <div className="flex items-center justify-between">
          <div className="pl-[50px]">
            <div className="text-3xl font-medium text-[#F09129]">75</div>
            <div className="text-sm text-[#F09129]">Good</div>
          </div>
          <div className="text-sm pr-[50px] text-[#F09129]">+5% vs Last</div>
        </div>

        <div className="mt-4">
          <div className="h-2 bg-green-200 rounded-full relative">
            <div
              className="absolute left-0 top-0 h-2 bg-[#F09129] rounded-full"
              style={{ width: "45%" }}
            />
            <div
              className="absolute left-[45%] top-0 h-2 bg-[#fbc02d] rounded-full"
              style={{ width: "30%" }}
            />
            <div
              className="absolute left-[75%] top-0 h-2 bg-[#f66b6b] rounded-full"
              style={{ width: "25%" }}
            />
            <div className="absolute left-[44%] -top-2 w-3 h-3 rounded-full bg-white border-2 border-emerald-300" />
          </div>
        </div>
      </div>

      <div className="text-primary font-medium mb-5 pl-[15px]">Weekly Urine Report</div>
      <div className="w-full max-w-sm rounded-[20px] bg-white p-[24px] shadow-[2px_0_10px_rgba(3,3,3,0.1)] space-y-4">
        {/* Status dots */}
        <div className="flex justify-between">
          {days.map((d) => (
            <div key={d.day} className="flex flex-col items-center gap-1">
              <span className={`h-8 w-8 rounded-full ${colors[d.status]}`} />
              <span className="text-xs text-secondary">{d.day}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 text-xs text-gray-600">
          <LegendDot color="bg-green-400" label="Clear" />
          <LegendDot color="bg-yellow-400" label="Yellowish" />
          <LegendDot color="bg-red-400" label="Abnormal" />
        </div>

        {/* Summary */}
        <div className="space-y-1 text-sm mb-5">
          <div className="flex items-center gap-1">
            <FaSmile className="w-4 h-4 text-[#f09129]" />
            <span className="text-[15px] font-medium text-primary"><span className="text-[15px] text-primary">Clarity:</span> Normal</span>
          </div>
          <p className="text-primary text-[15px] pl-[20px]">
            Weekly Clarity Rate: 57%
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-[#fcc730]"
            style={{ width: "57%" }}
          />
        </div>

        {/* Counts */}
        <div className="flex justify-between text-[15px] text-primary text-center pl-[20px] pr-[20px] mb-5">
          <span className="text-[15px] text-primary">
            Clear
            <br /><span className="text-[#3fb96e]">4 Days</span>
          </span>
          <span className="text-[15px] text-primary">
            Yellowish
            <br /><span className="text-[#fbc02d]">2 Days</span>
          </span>
          <span className="text-[15px] text-primary">
            Abnormal
            <br /><span className="text-[#f66b6b]">1 Day</span>
          </span>
        </div>

        {/* Tips */}
        <div className="rounded-[8px] bg-green-50 p-4 text-xs text-gray-700">
          <p className="mb-[6px] font-medium text-primary">Health Tips</p>
          <ul className="text-secondary text-xs">
            <li>Urine clarity needs improvement</li>
            <li>Drink &gt;2500ml water daily</li>
            <li>Limit caffeine, alcohol</li>
            <li>Drink 300–500ml water after waking</li>
          </ul>
        </div>
      </div>

      <Upgrade />
    </div>
  );
};

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}

export default Free;
