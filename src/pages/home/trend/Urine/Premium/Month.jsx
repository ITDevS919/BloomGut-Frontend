import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

import { useState } from "react";
import { Line, Scatter } from "react-chartjs-2";
import { Info } from "lucide-react";

const Month = () => {
  const [mode, setMode] = useState("line");
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

  const urine = [
    900, 1300, 800, 1100, 700, 600, 950, 1200, 900, 1100, 700, 1400, 1600, 1500,
    1700, 1800,
  ];
  const intake = [
    1800, 2400, 2100, 2300, 2000, 1900, 2100, 2500, 2300, 2400, 2200, 2600,
    2500, 2450, 2400, 2350,
  ];

  const lineData = {
    labels,
    datasets: [
      {
        label: "Urine (ml)",
        data: urine,
        borderColor: "#FACC15",
        backgroundColor: "#FACC15",
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: "Intake (ml)",
        data: intake,
        borderColor: "#38BDF8",
        backgroundColor: "#38BDF8",
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  const scatterData = {
    datasets: [
      {
        label: "Urine (ml)",
        data: urine.map((y, i) => ({ x: i + 1, y })),
        backgroundColor: "#FACC15",
      },
      {
        label: "Intake (ml)",
        data: intake.map((y, i) => ({ x: i + 1, y })),
        backgroundColor: "#38BDF8",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          font: { size: 11 },
        },
      },
      datalabels: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} ml`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 3500,
        ticks: { stepSize: 900 },
        grid: { color: "#E5E7EB", borderDash: [4, 4] },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="p-6">
      <div className="w-full max-w-sm rounded-[8px] bg-white p-5 shadow-md space-y-4">
        {/* Tabs */}
        <div className="flex gap-3 items-center justify-center">
          <Tab active={mode === "line"} onClick={() => setMode("line")}>
            Double Line
          </Tab>
          <Tab active={mode === "scatter"} onClick={() => setMode("scatter")}>
            Scatter Plot
          </Tab>
        </div>

        {/* Chart */}
        <div className="h-56">
          {mode === "line" ? (
            <Line data={lineData} options={options} />
          ) : (
            <Scatter data={scatterData} options={options} />
          )}
        </div>

        {/* Legend row */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex gap-4">
            <LegendDot color="bg-yellow-400" label="Urine" />
            <LegendDot color="bg-sky-400" label="Water Intake" />
          </div>
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="text-blue-500 text-xs hover:underline"
          >
            {showAnalysis ? "Hide Analysis" : "View Analysis"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Stat title="Avg Urine" value="1606 ml" accent="yellow" />
          <Stat title="Avg Intake" value="1943 ml" accent="blue" />
          <Stat title="Clarity" value="76%" accent="green" />
          <Stat title="Hydration" value="18 Days" accent="indigo" />
        </div>

        {showAnalysis && (
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                <Info className="h-4 w-4 text-blue-500" />
              </div>
              <h2 className="text-base   text-primary">Analysis Results</h2>
            </div>

            {/* Correlation */}
            <div className="space-y-1">
              <h3 className="text-sm   text-secondary">
                Correlation with Changes
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                For every <span className="font-medium">500ml</span> increase in
                water intake, urine clarity improves by{" "}
                <span className="font-medium">12%</span>. Maintain{" "}
                <span className="font-medium">2000–2500ml</span> daily to keep
                clarity &gt; <span className="font-medium">75%</span>.
              </p>
            </div>

            {/* Drinking Time */}
            <div className="space-y-1">
              <h3 className="text-sm   text-secondary">
                Drinking Time Analysis
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Morning intake links strongest to clarity. Drink{" "}
                <span className="font-medium">400–500ml</span> before breakfast
                to improve urine health.
              </p>
            </div>

            {/* Abnormal Days */}
            <div className="space-y-1">
              <h3 className="text-sm   text-secondary">
                Abnormal Days Analysis
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-medium">7 days</span> this month with
                clarity below <span className="font-medium">60%</span>, mostly
                <span className="font-medium"> 5th–10th</span>. Related to lower
                water intake.
              </p>
            </div>

            {/* Personal Tip */}
            <div className="rounded-[8px] bg-blue-50 p-4 text-sm text-gray-700">
              <p className="font-medium text-blue-600 mb-1">Personal Tip</p>
              <p>
                Before <span className="font-medium">9 AM</span>, drink at least
                <span className="font-medium"> 800ml</span> for best urine
                health.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function Tab({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? "rounded-lg bg-white px-4 py-1.5 text-sm font-medium shadow"
          : "rounded-lg px-4 py-1.5 text-sm text-gray-500"
      }
    >
      {children}
    </button>
  );
}

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}

function Stat({ title, value, accent }) {
  const map = {
    yellow: "border-yellow-300",
    blue: "border-blue-300",
    green: "border-green-300",
    indigo: "border-indigo-300",
  };

  return (
    <div className={`rounded-[8px] border-l-4 ${map[accent]} bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-3`}>
      <p className="text-xs text-primary">{title}</p>
      <p className="text-sm   text-secondary">{value}</p>
    </div>
  );
}

export default Month;
