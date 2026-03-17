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

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  ChartDataLabels,
  ArcElement
);

export const WaterBarChart = ({ data, options, plugins, loading, Loader }) => (
  <div className="relative">
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center bg-white/60">
        <Loader />
      </div>
    )}
    <Bar data={data} options={options} plugins={plugins} />
  </div>
);

export const WaterCircleStat = ({ value, label, color }) => {
  const donutPercent = Math.max(0, Math.min(100, Math.round(value)));
  const data = {
    datasets: [
      {
        data: [donutPercent, 100 - donutPercent],
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

