import { Chart as ChartJS, LinearScale, PointElement, Tooltip } from "chart.js";

ChartJS.register(LinearScale, PointElement, Tooltip);
import { Scatter } from "react-chartjs-2";

const Week = () => {
  const xLabels = ["Breakfast", "Lunch", "Dinner"];
  const yLabels = ["Normal", "Undefined", "Constipation"];

  const strength = {
    weak: { color: "#84CC16", r: 4 },
    moderate: { color: "#FACC15", r: 6 },
    modStrong: { color: "#FB923C", r: 8 },
    strong: { color: "#EF4444", r: 10 },
  };

  const data = {
    datasets: [
      {
        label: "Correlation",
        data: [
          { x: 0, y: 0, ...strength.weak },
          { x: 1, y: 0, ...strength.moderate },
          { x: 2, y: 0, ...strength.modStrong },

          { x: 0, y: 1, ...strength.moderate },
          { x: 1, y: 1, ...strength.weak },
          { x: 2, y: 1, ...strength.strong },

          { x: 0, y: 2, ...strength.strong },
          { x: 1, y: 2, ...strength.modStrong },
          { x: 2, y: 2, ...strength.moderate },
        ],
        pointBackgroundColor: (ctx) => ctx.raw.color,
        pointRadius: (ctx) => ctx.raw.r,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: { display: false },
    },
    scales: {
      x: {
        min: -0.5,
        max: 2.5,
        ticks: {
          callback: (v) => xLabels[v],
          font: { size: 11 },
        },
        grid: { color: "#E5E7EB" },
      },
      y: {
        min: -0.5,
        max: 2.5,
        ticks: {
          callback: (v) => yLabels[v],
          font: { size: 11 },
        },
        grid: { color: "#E5E7EB" },
      },
    },
  };
  return (
    <div className="p-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-md space-y-4">
        {/* Header */}
        <div>
          <h2 className="text-sm text-primary">
            Meal–Bowel Correlation
          </h2>
          <p className="text-xs text-gray-500">
            Shows strength of meal–bowel correlations. Larger, darker points =
            stronger.
          </p>
        </div>

        {/* Chart */}
        <div className="h-44">
          <Scatter data={data} options={options} />
        </div>

        {/* Legend */}
        <div className="flex justify-between text-xs text-gray-600">
          <Legend color="bg-lime-500" label="Weak" />
          <Legend color="bg-yellow-400" label="Moderate" />
          <Legend color="bg-orange-400" label="Mod-Strong" />
          <Legend color="bg-red-500" label="Strong" />
        </div>

        {/* High Risk */}
        <div className="rounded-xl bg-red-50 p-4 text-sm">
          <p className="font-medium mb-1 text-primary">High-Risk Period</p>
          <p className="text-secondary">
            Shortened: High-fat dinner links to constipation (70%). Reduce
            fried/red meat; use steaming/boiling.
          </p>
        </div>

        {/* Overall Trend */}
        <div className="rounded-xl bg-green-50 p-4 text-sm space-y-1">
          <p className="font-medium text-primary">Overall Trend</p>
          <p className="text-secondary">
            • Fiber breakfast → smooth stools (75%)
          </p>
          <p className="text-secondary">• Sugary dinner → bloating (60%)</p>
          <p className="text-secondary">• Lunch → mild bowel impact</p>
        </div>
      </div>
      <div className="flex justify-center items-center text-gray-400 italic text-sm mt-3 text-center">
        This analysis is based on recent behavior and health indicators, for
        reference only
      </div>
    </div>
  );
};

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}

export default Week;
