import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { AlertTriangle } from "lucide-react";
import Upgrade from "./Upgrade";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels
);

const Week = ({ showUpgrade = true }) => {
  // Water intake data
  const timePeriods = [
    { label: "Morning (6-12)", value: 205, percentage: 31, color: "#F87171" }, // Red
    { label: "Noon (12-15)", value: 750, percentage: 125, color: "#9ED5E1" }, // Light blue
    {
      label: "Afternoon (15-18)",
      value: 150,
      percentage: 30,
      color: "#F87171",
    }, // Red
    { label: "Evening (18-22)", value: 450, percentage: 150, color: "#7BCFA5" }, // Green
  ];

  const data = {
    labels: timePeriods.map((t) => t.label),
    datasets: [
      {
        data: timePeriods.map((t) => t.value),
        backgroundColor: timePeriods.map((t) => t.color),
        borderRadius: 6,
        barThickness: 18,
      },
    ],
  };

  const options = {
    indexAxis: "y", // Horizontal bars
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        anchor: "inner",
        align: "end",
        offset: 8,
        color: "#111827",
        font: {
          weight: "600",
          size: 12,
        },
        formatter: (value, context) => {
          const period = timePeriods[context.dataIndex];
          return `${period.value}ml (${period.percentage}%)`;
        },
      },
    },
    scales: {
      x: {
        min: 0,
        max: 1000,
        ticks: {
          stepSize: 200,
          color: "#6b7280",
          font: {
            size: 11,
          },
        },
        grid: {
          color: "#E5E7EB",
          borderDash: [4, 4],
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div className="pl-[15px] pr-[15px] mt-[44px]">
      <div className="text-base font-medium mb-[20px] text-primary">
        Water Drinking Time
      </div>
      <div className="w-full max-w-md rounded-[27px] bg-white p-5 shadow-md mb-[68px]">
        {/* Info Block */}
        <div className="mb-4 rounded-[12px] bg-[#eff6ff] px-4 py-3 text-sm text-custom-12">
          Chart shows intake by time period to check balance. Concentrated
          drinking may cause constipation or night urination.
        </div>

        {/* Chart */}
        <div className="mb-4 h-48">
          <Bar data={data} options={options} />
        </div>

        {/* Alert and Tip Section */}
        <div className="mt-5 space-y-3 rounded-[8px] bg-yellow-50 p-4">
          {/* Period with Rate */}
          <div className="flex items-center gap-2 text-sm text-gray-700 mb-[12px]">
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="text-secondary">Afternoon (15-18)</span>
            <span className="ml-auto text-[9px] text-primary">Rate: 30%</span>
          </div>

          {/* Warning */}
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="w-5 h-5 text-[#ffc92b]" />
            <span className="text-[#f57c00] text-xs">
              Constipation may link to low afternoon intake.
            </span>
          </div>

          {/* Tip */}
          <div className="rounded-[8px] bg-[#fdfdfd] px-3 py-2 text-xs text-custom-19">
            <span className="font-medium">Tip:</span> Set reminders, drink
            100ml/hr in afternoon.
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <StatCard title="Weekly Intake" value="1600ml" sub="Below Std." />
          <StatCard2 title="Balance" value="Low" sub="M & PM Low" />
        </div>

        {/* Footer Text */}
        <p className="mt-[22px] italic text-center text-xs text-custom-12">
          Tap period for tips & impacts.
        </p>
      </div>
      {showUpgrade && <Upgrade />}
    </div>
  );
};

function StatCard({ title, value, sub }) {
  return (
    <div className="rounded-[10px] shadow-[2px_0_10px_rgba(0,0,0,0.15)] bg-white p-3 text-center">
      <p className="text-xs text-secondary mb-1">{title}</p>
      <p className="text-sm text-primary mb-1">{value}</p>
      <p className="text-xs text-[#3c74ed]">{sub}</p>
    </div>
  );
}

function StatCard2({ title, value, sub }) {
  return (
    <div className="rounded-[10px] shadow-[2px_0_10px_rgba(0,0,0,0.15)] bg-white p-3 text-center">
      <p className="text-xs text-secondary mb-1">{title}</p>
      <p className="text-sm text-[#3c74ed] mb-1">{value}</p>
      <p className="text-xs text-secondary">{sub}</p>
    </div>
  );
}

export default Week;
