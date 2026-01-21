import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Sun, AlertTriangle, Moon, Clock } from "lucide-react";

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const Month = () => {
  const labels = ["Week 1", "Week 2", "Week 3", "Week 4"];

  const data = {
    labels,
    datasets: [
      {
        type: "bar",
        label: "Morning",
        data: [260, 250, 230, 240],
        backgroundColor: "#BFEAF5",
        borderRadius: 6,
      },
      {
        type: "bar",
        label: "Noon",
        data: [230, 240, 210, 230],
        backgroundColor: "#9DD6E6",
        borderRadius: 6,
      },
      {
        type: "bar",
        label: "Afternoon",
        data: [200, 180, 260, 250],
        backgroundColor: "#6FAFC8",
        borderRadius: 6,
      },
      {
        type: "bar",
        label: "Evening",
        data: [170, 150, 180, 170],
        backgroundColor: "#2E5578",
        borderRadius: 6,
      },
      {
        type: "line",
        label: "Monthly Trend",
        data: [270, 260, 255, 265],
        borderColor: "#60C7F2",
        backgroundColor: "#60C7F2",
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#8FD3F4",
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

      datalabels: {
        display: false,
        color: "#6B7280",
        font: {
          size: 10,
          weight: "600",
        },

        // Default for bars
        anchor: "end",
        align: "top",
        offset: 4,

        formatter: (value) => value,
      },
    },

    scales: {
      y: {
        min: 0,
        max: 360,
        ticks: { stepSize: 90 },
      },
    },
  };
  return (
    <div className="p-6">
      <div className="w-full max-w-md rounded-[8px] bg-white p-5 shadow-md">
      {/* Header */}
      <h2 className="text-center text-base text-primary">
        Weekly Intake Analysis
      </h2>
      <p className="mb-4 text-center text-xs text-gray-400">Monthly Trend</p>

      {/* Chart */}
      <div className="h-60">
        <Bar data={data} options={options} />
      </div>

      {/* Icons */}
      <div className="mt-4 flex justify-center gap-4">
        <IconBtn icon={Sun} />
        <IconBtn icon={AlertTriangle} />
        <IconBtn icon={Moon} />
        <IconBtn icon={Clock} />
      </div>

      {/* Footer */}
      <p className="mt-3 text-center text-xs text-gray-400">
          Tap icons for details
        </p>
      </div>
    </div>
  );
};

function IconBtn({ icon: Icon }) {
  return (
    <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
      <Icon className="h-4 w-4 text-gray-600" />
    </button>
  );
}

export default Month;
