import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
);
import { Line } from "react-chartjs-2";
import {
  TrendingUp,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Info,
} from "lucide-react";
import Free from "../Free";
import { useState } from "react";

const Month = () => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const labels = [
    "1st",
    "3rd",
    "5th",
    "7th",
    "9th",
    "11th",
    "13th",
    "15th",
    "17th",
    "19th",
    "21st",
    "23rd",
    "25th",
    "27th",
    "29th",
    "31st",
  ];

  const values = [
    2300, 1900, 2100, 1800, 1200, 1100, 1300, 1600, 1500, 1800, 2000, 1850,
    2100, 3000, 3300, 3600,
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Urine Volume",
        data: values,
        borderColor: "#FACC15",
        backgroundColor: "rgba(250, 204, 21, 0.35)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw} ml`,
        },
      },
      datalabels: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
      y: {
        min: 0,
        max: 3600,
        ticks: {
          stepSize: 600,
          font: { size: 11 },
        },
        grid: {
          color: "#E5E7EB",
          borderDash: [4, 4],
        },
      },
    },
  };
  return (
    <>
      <Free />
      <div className="p-6">
        <div className="w-full max-w-md rounded-[8px] bg-white p-5 shadow-md space-y-5">
          {/* Header */}
          <h2 className="text-lg text-primary">Urine Trend Analysis</h2>

          {/* Chart */}
          <div className="h-56">
            <Line data={data} options={options} />
          </div>

          {/* Legend */}
          <div className="flex gap-4 text-xs text-gray-600">
            <LegendDot color="bg-yellow-300" label="Low <1200ml" />
            <LegendDot color="bg-green-300" label="Normal" />
            <LegendDot color="bg-red-300" label="High >2400ml" />
          </div>

          {/* Monthly Header */}
          <div className="flex justify-between items-center">
            <h3 className="text-sm text-primary">Monthly</h3>
            <button className="text-xs text-blue-500 hover:underline" onClick={() => setShowAnalysis(!showAnalysis)}>
              {showAnalysis ? "Hide Analysis" : "View Analysis"}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={<TrendingUp className="h-4 w-4 text-blue-500" />}
              title="Avg Volume"
              value="1823 ml"
              sub="Within Normal Range"
            />

            <StatCard
              icon={<AlertTriangle className="h-4 w-4 text-orange-500" />}
              title="Abnormal"
              value="9 Day"
              sub="Low 2 | High 7"
            />

            <StatCard
              icon={<ArrowUp className="h-4 w-4 text-red-500" />}
              title="Highest Day"
              value="May 31"
              sub="2755 ml"
            />

            <StatCard
              icon={<ArrowDown className="h-4 w-4 text-yellow-500" />}
              title="Lowest Day"
              value="May 8"
              sub="1101 ml"
            />
          </div>
        </div>
      </div>

      {showAnalysis && (
        <>
          <div className="p-6">
            <div className="w-full max-w-sm rounded-[8px] bg-white p-5 shadow-md space-y-5">
              {/* Header */}
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                  <Info className="h-4 w-4 text-blue-500" />
                </div>
                <h2 className="text-base font-semibold text-gray-800">
                  Trends & Tips
                </h2>
              </div>

              {/* Monthly Notes */}
              <div>
                <h3 className="mb-2 text-sm font-medium text-primary">
                  Monthly Notes
                </h3>

                <div className="rounded-[8px] bg-blue-50 p-4 text-sm text-secondary">
                  <ul className="list-disc space-y-2 pl-4">
                    <li>5/1–5/7: volume normal.</li>
                    <li>5/8–5/12: urine drop, likely low intake.</li>
                    <li>5/13–5/18: back to normal.</li>
                    <li>5/25–5/31: spike, likely habit/diet change.</li>
                  </ul>
                </div>
              </div>

              {/* Health Status Assessment */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Health Status Assessment
                </h3>

                {/* Hydration Balance */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Hydration Balance:</span>
                  <span className="font-medium text-blue-500">71%</span>
                </div>

                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-400"
                    style={{ width: "71%" }}
                  />
                </div>

                <p className="text-sm text-gray-600">
                  Urine Normal Rate: <span className="font-medium">71%</span>
                </p>

                <p className="text-sm text-green-600">+8% vs last month</p>
              </div>

              {/* Personalized Suggestions */}
              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-700">
                  Personalized Suggestions
                </h3>

                <div className="rounded-[8px] bg-green-50 p-4 text-sm text-gray-700">
                  <ul className="list-disc space-y-2 pl-4">
                    <li>Daily target: 1800–2400 ml</li>
                    <li>Drink 300 ml after waking and before meals.</li>
                    <li>Avoid large amounts within 10 min before bed.</li>
                    <li>Increase intake during exercise or heat.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>)}
    </>
  );
};

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`h-3 w-3 rounded ${color}`} />
      <span>{label}</span>
    </div>
  );
}

function StatCard({ icon, title, value, sub }) {
  return (
    <div className="rounded-[8px] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-3 space-y-1">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {icon}
        {title}
      </div>
      <p className="text-lg text-primary">{value}</p>
      <p className="text-xs text-gray-500">{sub}</p>
    </div>
  );
}

export default Month;
