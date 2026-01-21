import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { Line } from "react-chartjs-2";
import { Droplet } from "lucide-react";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  annotationPlugin
);

const Year = () => {
  const labels = Array.from({ length: 12 }, (_, i) => i + 1);

  const data = {
    labels,
    datasets: [
      {
        label: "Daily Avg",
        data: [
          2200, 2350, 2280, 2450, 2200, 1850, 2000, 2250, 2400, 2500, 2350,
          2220,
        ],
        borderColor: "#4DD0F1",
        backgroundColor: "#4DD0F1",
        yAxisID: "y",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Regularity",
        data: [85, 88, 86, 90, 84, 78, 82, 86, 90, 94, 92, 89],
        borderColor: "#4C78A8",
        backgroundColor: "#4C78A8",
        yAxisID: "y1",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
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
          font: { size: 12 },
        },
      },
      datalabels: { display: false },
      //   annotation: {
      //     annotations: {
      //       currentWeek: {
      //         type: "line",
      //         xMin: 6,
      //         xMax: 6,
      //         borderColor: "#D1D5DB",
      //         borderWidth: 2,
      //       },
      //     },
      //   },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            ctx.dataset.label === "Daily Avg" ? `${ctx.raw} ml` : `${ctx.raw}%`,
        },
      },
    },
    scales: {
      y: {
        position: "left",
        min: 1200,
        max: 2800,
        ticks: {
          stepSize: 400,
        },
        grid: {
          color: "#E5E7EB",
          borderDash: [4, 4],
        },
      },
      y1: {
        position: "right",
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="p-6">
      <div className="w-full max-w-md rounded-[8px] bg-white p-6 shadow-md">
        {/* Header */}
        <h2 className="text-center text-lg text-primary">
          Annual Water Drinking
        </h2>
        <p className="mb-4 text-center text-sm text-gray-400">
          Yearly Intake & Regularity
        </p>

        {/* Chart */}
        <div className="relative h-72">
          <Line data={data} options={options} />

          {/* Tip icon */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 shadow-md">
              <Droplet className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-4 text-center text-sm text-gray-400">
          Tap curve for monthly, icon for tips
        </p>
      </div>
    </div>
  );
};

export default Year;
