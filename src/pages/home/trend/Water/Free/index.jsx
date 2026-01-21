import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Upgrade from "../Upgrade";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  ChartDataLabels
);
ChartJS.register(ArcElement);

const goalLine = {
  id: "goalLine",
  afterDatasetsDraw(chart) {
    const {
      ctx,
      chartArea: { left, right },
      scales: { y },
    } = chart;

    const goal = 2000;
    const yPos = y.getPixelForValue(goal);

    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(left, yPos);
    ctx.lineTo(right, yPos);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.fillStyle = "#f59e0b";
    ctx.font = "12px sans-serif";
    ctx.fillText("Goal: 2000ml", left + 6, yPos - 6);
    ctx.restore();
  },
};

const options = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
    datalabels: {
      anchor: "end",
      align: "end",
      offset: 4,
      color: "#111827",
      font: {
        weight: "600",
        size: 12,
      },
      formatter: (value) => value,
    },
  },
  scales: {
    x: { grid: { display: false } },
    y: { display: false, suggestedMax: 2600 },
  },
};

const data = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      data: [1600, 1850, 2100, 2300, 2200, 2450, 1900],
      backgroundColor: [
        "#bae6fd",
        "#3b82f6",
        "#2563eb",
        "#1d4ed8",
        "#2563eb",
        "#1e40af",
        "#bae6fd",
      ],
      borderRadius: 10,
    },
  ],
};

const CircleStat = ({ value, label, color }) => {
  const data = {
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: [color, "#e5e7eb"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "80%",
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
      datalabels: { display: false },
    },
  };

  return (
    <div className="relative w-24 h-24">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xl font-bold" style={{ color }}>
          {value}%
        </span>
        <span className="text-sm font-medium" style={{ color }}>
          {label}
        </span>
      </div>
    </div>
  );
};

const Free = () => {
  return (
    <div className="p-6">
      <div className="bg-white rounded-[8px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-[#4682B4]">78</div>
            <div className="text-sm text-gray-500">Good</div>
          </div>
          <div className="text-sm text-[#4682B4]">+5% vs Last</div>
        </div>

        <div className="mt-4">
          <div className="h-2 bg-green-200 rounded-full relative">
            <div
              className="absolute left-0 top-0 h-2 bg-[#4682B4] rounded-full"
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

      {/* daily types */}
      <div className="text-x2 mt-5 mb-3 text-primary">
        Daily Types(ml)
      </div>
      <div className="bg-white rounded-[8px] shadow p-6">
        <Bar data={data} options={options} plugins={[goalLine]} />
      </div>

      <div className="text-x2 mt-5 mb-3 text-primary">
        Daily Intake Rate
      </div>
      <div className="bg-white rounded-[8px] shadow p-6 flex gap-8 justify-center">
        <CircleStat value={80} label="Avg" color="#1d4ed8" />
        <CircleStat value={100} label="Max" color="#1d4ed8" />
        <CircleStat value={65} label="Min" color="#7dd3fc" />
      </div>

      {/* <Upgrade /> */}
    </div>
  );
};

export default Free;
