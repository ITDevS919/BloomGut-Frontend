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
  TrendingDown,
} from "lucide-react";
import Free from "../Free";
import { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { MdErrorOutline, MdOutlineErrorOutline } from "react-icons/md";
import Upgrade from "./Upgrade";

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
        ticks: { font: { size: 11 }, },
      },
      y: {
        min: 0,
        max: 3600,
        ticks: {
          stepSize: 900,
          font: { size: 11 },
        },
        grid: {
          color: "white",
          borderDash: [4, 4],
        },
      },
    },
  };
  return (
    <>
      <Free />
      <div className="pl-[15px] pr-[15px] mt-[29px]">
        <div className="w-full max-w-md rounded-[20px] bg-white p-5 shadow-md space-y-5">
          {/* Header */}
          <h2 className="text-base font-medium text-primary">Urine Trend Analysis</h2>

          {/* Chart */}
          <div className="h-56">
            <Line data={data} options={options} />
          </div>

          {/* Legend */}
          <div className="flex gap-4 text-xs text-primary items-center justify-center mb-9">
            <LegendDot color="bg-yellow-300" label="Low <1200ml" />
            <LegendDot color="bg-green-300" label="Normal" />
            <LegendDot color="bg-red-300" label="High >2400ml" />
          </div>

          {/* Monthly Header */}
          <div className="flex justify-between items-center">
            <h3 className="text-base text-primary">Monthly</h3>
            <button className="text-xs text-[#3b82f6]" onClick={() => setShowAnalysis(!showAnalysis)}>
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
              icon={<FaExclamationTriangle className="h-4 w-4 text-[#f09129]" />}
              title="Abnormal"
              value="9 Day"
              sub="Low 2 | High 7"
            />

            <StatCard
              icon={<TrendingUp className="h-4 w-4 text-[#f15a5a]" />}
              title="Highest Day"
              value="May 31"
              sub="2755 ml"
            />

            <StatCard
              icon={<TrendingDown className="h-4 w-4 text-yellow-500" />}
              title="Lowest Day"
              value="May 8"
              sub="1101 ml"
            />
          </div>
        </div>
      </div>

      {showAnalysis && (
        <>
          <div className="pl-[15px] pr-[15px] mt-[20px]">
            <div className="w-full max-w-sm rounded-[12px] bg-white p-5 shadow-md space-y-5">
              {/* Header */}
              <div className="flex items-center gap-2 mb-[13px]">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                  <MdErrorOutline className="h-4 w-4" />
                </div>
                <h2 className="text-base font-medium text-primary">
                  Trends & Tips
                </h2>
              </div>

              {/* Monthly Notes */}
              <div className="mb-[30px]">
                <h3 className="mb-4 text-sm font-medium text-primary">
                  Monthly Notes
                </h3>

                <div className="rounded-[8px] bg-blue-50 p-4 text-sm text-secondary">
                  <ul className="list-disc space-y-2 pl-4 text-secondary">
                    <li>5/1–5/7: volume normal.</li>
                    <li>5/8–5/12: urine drop, likely low intake.</li>
                    <li>5/13–5/18: back to normal.</li>
                    <li>5/25–5/31: spike, likely habit/diet change.</li>
                  </ul>
                </div>
              </div>

              {/* Health Status Assessment */}
              <div className="space-y-2 mb-[10px]">
                <h3 className="text-sm font-medium text-primary">
                  Health Status Assessment
                </h3>

                {/* Hydration Balance */}
                <div className="flex items-center gap-3 text-sm mb-[11px]">
                  <span className="text-secondary font-['Roboto'] whitespace-nowrap">Hydration Balance:</span>
                  <div className="flex-1 h-2 rounded-full bg-gray-200 relative">
                    <div
                      className="h-2 rounded-full bg-blue-300"
                      style={{ width: "71%" }}
                    />
                  </div>
                  <span className="text-[#3b82f6] font-medium whitespace-nowrap">71%</span>
                </div>

                <p className="text-sm text-secondary font-['Aleo']">
                  Urine Normal Rate: <span className="font-medium">71%</span>
                </p>

                <p className="text-sm text-secondary">+8% vs last month</p>
              </div>

              {/* Personalized Suggestions */}
              <div>
                <div className="rounded-[8px] bg-green-50 p-4 text-sm text-gray-700">
                  <h3 className="mb-2 text-sm font-medium text-secondary">
                    Personalized Suggestions
                  </h3>
                  <ul className="list-disc space-y-2 pl-4 text-secondary">
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

      <div className="text-center text-sm text-custom-12 italic mt-[28px] mb-[28px]">For reference only. Consult a doctor if needed.</div>
      <div className="pl-[15px] pr-[15px]">
        <Upgrade />
      </div>
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
    <div className="rounded-[10px] bg-white shadow-md p-3 space-y-1">
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        {icon}
        {title}
      </div>
      <p className="text-base font-medium text-primary">{value}</p>
      <p className="text-xs text-custom-12">{sub}</p>
    </div>
  );
}

export default Month;
