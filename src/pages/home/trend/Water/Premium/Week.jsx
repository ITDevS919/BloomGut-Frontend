import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { MessageCircle } from "lucide-react";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Week = () => {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Morning",
        data: [200, 220, 250, 240, 260, 210, 200],
        backgroundColor: "#CFEFF7",
      },
      {
        label: "Noon",
        data: [250, 260, 280, 270, 290, 250, 240],
        backgroundColor: "#A7D8EC",
      },
      {
        label: "Afternoon",
        data: [220, 230, 240, 250, 260, 220, 210],
        backgroundColor: "#79B9E3",
      },
      {
        label: "Evening",
        data: [200, 210, 220, 230, 240, 200, 190],
        backgroundColor: "#3E5C84",
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
          pointStyle: "circle",
          boxWidth: 8,
          font: { size: 11 },
        },
      },
      datalabels: { display: false },
    },
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: {
        stacked: true,
        min: 0,
        max: 1200,
        ticks: { stepSize: 300 },
        grid: { color: "#E5E7EB", borderDash: [4, 4] },
      },
    },
  };

  return (
    <div className="p-6">
      <div className="w-full max-w-md rounded-[8px] bg-white p-5 shadow-md">
        {/* Header */}
        <h2 className="text-center text-base text-primary">
          Daily Intake
        </h2>
        <p className="mb-4 text-center text-xs text-gray-400">Weekly Tracker</p>

        {/* Chart wrapper (IMPORTANT) */}
        <div className="relative h-60">
          <Bar data={data} options={options} />

          {/* Message icon overlay */}
          <button
            className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50"
            aria-label="Tips"
          >
            <MessageCircle className="h-5 w-5 text-blue-500" />
          </button>
        </div>

        {/* Footer text */}
        <p className="mt-3 text-center text-xs text-gray-400">
          Tap icon for tips
        </p>
      </div>
    </div>
  );
};

export default Week;
