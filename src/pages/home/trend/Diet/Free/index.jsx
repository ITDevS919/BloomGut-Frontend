import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Wheat, Beef, Salad, Milk, MoreHorizontal } from "lucide-react";
import Upgrade from "./Upgrade";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  ChartDataLabels
);

const Free = () => {
  // Dietary breakdown data
  const dietData = [
    {
      label: "Grains",
      percentage: 35,
      color: "#D2B48C", // Tan/brown
      icon: Wheat,
      textColor: "#ffffff", // White text on dark bar
    },
    {
      label: "Protein",
      percentage: 25,
      color: "#C07A2D", // Orange-brown
      icon: Beef,
      textColor: "#ffffff", // White text
    },
    {
      label: "Fruits & Veg",
      displayLabel: "Fruits & Veg", // Will be displayed with non-breaking space
      percentage: 20,
      color: "#7BCFA5", // Light green
      icon: Salad,
      textColor: "#ffffff", // White text
    },
    {
      label: "Dairy",
      percentage: 10,
      color: "#FFE4B5", // Light yellow
      icon: Milk,
      textColor: "#111827", // Dark text on light bar
    },
    {
      label: "Others",
      percentage: 5,
      color: "#E5E7EB", // Very light gray
      icon: MoreHorizontal,
      textColor: "#111827", // Dark text on light bar
    },
  ];

  // Create chart options for each category
  const createChartOptions = (item) => ({
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        anchor: "center",
        align: "center",
        color: item.textColor,
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: (value) => `${value}%`,
      },
    },
    scales: {
      x: {
        display: false,
        grid: { display: false },
      },
      y: {
        display: false,
        min: 0,
        max: 100,
        grid: { display: false },
      },
    },
  });

  // Create chart data for each category
  const createChartData = (item) => ({
    labels: [""],
    datasets: [
      {
        data: [item.percentage],
        backgroundColor: item.color,
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  });

  const dates = ["3/11", "3/12", "3/13", "3/14", "3/15", "3/16"];
  const dietTrendData = {
    labels: dates,
    datasets: [
      {
        label: "Fiber",
        data: [70, 68, 72, 69, 71, 73],
        borderColor: "#22C55E",
        backgroundColor: "#22C55E",
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: "Protein",
        data: [60, 62, 63, 61, 64, 66],
        borderColor: "#3B82F6",
        backgroundColor: "#3B82F6",
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: "Fat",
        data: [45, 46, 47, 46, 48, 49],
        borderColor: "#FACC15",
        backgroundColor: "#FACC15",
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: "Sugar",
        data: [35, 38, 37, 39, 36, 40],
        borderColor: "#EF4444",
        backgroundColor: "#EF4444",
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };
  const dietTrendOptions = {
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
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}`,
        },
      },
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
    },
  };

  const dietBoweldata = {
    labels: dates,
    datasets: [
      {
        label: "Freq",
        data: [60, 65, 68, 70, 75, 78, 85],
        borderColor: "#14B8A6",
        backgroundColor: "#14B8A6",
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 4,
      },
      {
        label: "Consis",
        data: [50, 55, 58, 60, 62, 64, 68],
        borderColor: "#A855F7",
        backgroundColor: "#A855F7",
        tension: 0.4,
        pointRadius: 3,
      },
      {
        label: "Ease",
        data: [40, 43, 46, 48, 52, 55, 60],
        borderColor: "#F59E0B",
        backgroundColor: "#F59E0B",
        tension: 0.4,
        pointRadius: 3,
      },
      {
        label: "Overall",
        data: [30, 33, 35, 37, 40, 43, 48],
        borderColor: "#6B4F4F",
        backgroundColor: "#6B4F4F",
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  }

  const dietBowelOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}`,
        },
      },
    },
    scales: {
      y: {
        display: false, // 🔑 hide numeric axis
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
    },
  }


  return (
    <div className="p-6">
      {/* Score Card */}
      <div className="bg-white rounded-[8px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-[#B5A6D2]">82</div>
            <div className="text-sm text-gray-500">Good</div>
          </div>
          <div className="text-sm text-[#B5A6D2]">+7% vs Last</div>
        </div>

        <div className="mt-4">
          <div className="h-2 bg-green-200 rounded-full relative">
            <div
              className="absolute left-0 top-0 h-2 bg-[#B5A6D2] rounded-full"
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

      {/* Food Type Distribution */}
      <div className="text-primary text-x2 mb-3 mt-8">
        Food Type Distribution
      </div>
      <div className="bg-ivory rounded-[8px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        <div className="flex items-end justify-between gap-3">
          {dietData.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center flex-1 min-w-0"
              >
                {/* Icon in Gray Circle */}
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-3 shrink-0">
                  <Icon className="w-6 h-6 text-gray-600" />
                </div>

                {/* Vertical Bar Chart */}
                <div
                  className="w-full"
                  style={{ height: "128px", position: "relative" }}
                >
                  <Bar
                    data={createChartData(item)}
                    options={createChartOptions(item)}
                  />
                </div>

                {/* Label */}
                <div className="mt-2 text-center w-full">
                  <span
                    className="text-xs text-gray-700"
                    style={{
                      whiteSpace: "nowrap",
                      display: "block",
                    }}
                  >
                    {item.label === "Fruits & Veg"
                      ? "Fruits\u00A0&\u00A0Veg"
                      : item.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-primary text-x2 mb-3 mt-8">Diet & Bowel Trends</div>
      <div className="w-full max-w-sm rounded-[8px] bg-white p-5 shadow-md space-y-4">
        {/* Date pills */}
        <div className="flex gap-2 overflow-x-auto">
          {dates.map((d) => (
            <span
              key={d}
              className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
            >
              {d}
            </span>
          ))}
        </div>

        {/* Title */}
        <div className="flex items-center gap-2">
          <span className="text-lg">🍜</span>
          <h2 className="text-sm font-medium text-gray-800">Diet Trends</h2>
        </div>

        {/* Chart */}
        <div className="h-48 grid grid-cols-[60px_1fr] gap2">
          {/* LEFT LABELS */}
          <div className="flex flex-col justify-between text-xs text-gray-600 pt-2 pb-6">
            <span className="text-green-600">Fiber</span>
            <span className="text-blue-600">Protein</span>
            <span className="text-yellow-600">Fat</span>
            <span className="text-red-600">Sugar</span>
          </div>
          <div className="relatvie">
            <Line data={dietTrendData} options={dietTrendOptions} />
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm rounded-[8px] bg-white p-5 shadow-md space-y-4 mt-8">
        {/* Date pills */}
        <div className="flex gap-2 overflow-x-auto">
          {dates.map((d) => (
            <span
              key={d}
              className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-500"
            >
              {d}
            </span>
          ))}
        </div>

        {/* Title */}
        <div className="flex items-center gap-2">
          <span className="text-xl">💩</span>
          <h2 className="text-sm font-medium">Bowel Trend</h2>
        </div>

        {/* Chart with left labels */}
        <div className="grid grid-cols-[70px_1fr] gap-2 h-48">
          {/* LEFT LABELS */}
          <div className="flex flex-col justify-between pb-6 pt-4 text-sm text-gray-500">
            <span className="text-teal-500">Freq</span>
            <span className="text-purple-500">Consis</span>
            <span className="text-amber-500">Ease</span>
            <span className="text-gray-600">Overall</span>
          </div>

          {/* CHART */}
          <div className="relative">
            <Line data={dietBoweldata} options={dietBowelOptions} />
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 text-xs">
          <Legend color="bg-teal-500" label="Freq" />
          <Legend color="bg-purple-500" label="Consis" />
          <Legend color="bg-amber-400" label="Ease" />
          <Legend color="bg-stone-500" label="Overall" />
        </div>
      </div>

      {/* <Upgrade /> */}
    </div >
  );
};

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  )
}

export default Free;
