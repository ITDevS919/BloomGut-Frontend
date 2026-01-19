import Upgrade from "./Upgrade";

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
    <div className="p-6">
      {/* Score Card */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-[#F09129]">78</div>
            <div className="text-sm text-gray-500">Good</div>
          </div>
          <div className="text-sm text-[#F09129]">+5% vs Last</div>
        </div>

        <div className="mt-4">
          <div className="h-2 bg-green-200 rounded-full relative">
            <div
              className="absolute left-0 top-0 h-2 bg-[#F09129] rounded-full"
              style={{ width: "45%" }}
            />
            <div
              className="absolute left-[45%] top-0 h-2 bg-yellow-300 rounded-full"
              style={{ width: "30%" }}
            />
            <div
              className="absolute left-[75%] top-0 h-2 bg-rose-300 rounded-full"
              style={{ width: "25%" }}
            />
            <div className="absolute left-[44%] -top-2 w-3 h-3 rounded-full bg-white border-2 border-emerald-300" />
          </div>
        </div>
      </div>

      <div className="text-primary text-x2 mb-3 mt-10">Weekly Urine Report</div>
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-md space-y-4">
        {/* Status dots */}
        <div className="flex justify-between">
          {days.map((d) => (
            <div key={d.day} className="flex flex-col items-center gap-1">
              <span className={`h-8 w-8 rounded-full ${colors[d.status]}`} />
              <span className="text-xs text-gray-500">{d.day}</span>
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
        <div className="space-y-1 text-sm">
          <p>
            😊 <span className="font-medium">Clarity:</span> Normal
          </p>
          <p className="text-gray-500">
            Weekly Clarity Rate: <span className="font-medium">57%</span>
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-yellow-400"
            style={{ width: "57%" }}
          />
        </div>

        {/* Counts */}
        <div className="flex justify-between text-xs">
          <span className="text-green-500">
            Clear
            <br />4 Days
          </span>
          <span className="text-yellow-500">
            Yellowish
            <br />2 Days
          </span>
          <span className="text-red-500">
            Abnormal
            <br />1 Day
          </span>
        </div>

        {/* Tips */}
        <div className="rounded-xl bg-green-50 p-4 text-xs text-gray-700">
          <p className="mb-1 font-medium text-gray-800">Health Tips</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Urine clarity needs improvement</li>
            <li>Drink &gt;2500ml water daily</li>
            <li>Limit caffeine, alcohol</li>
            <li>Drink 300–500ml water after waking</li>
          </ul>
        </div>
      </div>

      {/* <Upgrade /> */}
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
