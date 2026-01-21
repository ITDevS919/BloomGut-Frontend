import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);
import { Radar } from "react-chartjs-2";
import { useState } from "react";

const Year = () => {
  const [showAnalysis, setShowAnalysis] = useState(false);

  const data = {
    labels: [
      "High Protein Foods",
      "Caffeinated Drinks",
      "Sugary Drinks",
      "Salty Foods",
      "Spicy Foods",
      "Processed Foods",
      "Vegetables and Fruits",
    ],
    datasets: [
      {
        label: "Dark Yellow",
        data: [70, 55, 40, 60, 75, 50, 45],
        borderColor: "#F59E0B",
        backgroundColor: "rgba(245, 158, 11, 0.25)",
        pointBackgroundColor: "#F59E0B",
        pointRadius: 4,
      },
      {
        label: "Urine Odor",
        data: [55, 45, 50, 65, 80, 60, 40],
        borderColor: "#EF4444",
        backgroundColor: "rgba(239, 68, 68, 0.25)",
        pointBackgroundColor: "#EF4444",
        pointRadius: 4,
      },
      {
        label: "Frequent",
        data: [40, 70, 65, 55, 45, 35, 60],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.25)",
        pointBackgroundColor: "#3B82F6",
        pointRadius: 4,
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
          pointStyle: "rect",
          boxWidth: 12,
          font: { size: 11 },
        },
      },
      datalabels: { display: false },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          display: false,
        },
        grid: {
          color: "#E5E7EB",
        },
        angleLines: {
          color: "#D1D5DB",
        },
        pointLabels: {
          font: {
            size: 11,
          },
          color: "#6B7280",
        },
      },
    },
  };

  const items = [
    { title: "High Protein", yellow: 85, odor: 70 },
    { title: "Sugary Drinks", yellow: 60, odor: 30 },
    { title: "Alcohol", yellow: 80, odor: 85 },
    { title: "Spicy Foods", yellow: 70, odor: 80 },
    { title: "Processed", yellow: 65, odor: 75 },
    { title: "Fruits & Veg", yellow: 85, odor: 15 },
  ];

  return (
    <div className="p-6">
      <div className="w-full max-w-sm rounded-[8px] bg-white p-5 shadow-md">
        <div className="h-64">
          <Radar data={data} options={options} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-5">
        <div className="text-x2 text-primary">
          Foods Affecting Urine
        </div>

        <button className="text-sm text-blue-500 hover:underline">
          View Analysis
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 max-w-sm mt-3">
        {items.map((item) => (
          <div key={item.title} className="rounded-[8px] bg-white p-2 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            <p className="mb-3 text-sm font-medium text-primary">
              {item.title}
            </p>

            <div className="grid grid-cols-2 gap-2">
              <Badge
                bg="bg-yellow-100"
                text="text-yellow-700"
                label={`Yellow ${item.yellow}%`}
              />
              <Badge
                bg="bg-pink-100"
                text="text-pink-600"
                label={`Odor ${item.odor}%`}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="text-gray-400 italic text-sm mt-3 flex justify-center items-center">
        For reference only. Consult a doctor if needed.
      </div>
    </div>
  );
};

function Badge({ bg, text, label }) {
  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-medium ${bg} ${text}`}
    >
      {label}
    </span>
  );
}

export default Year;
