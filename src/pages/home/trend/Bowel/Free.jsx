// src/pages/home/trend/Bowel/Free.jsx
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Type1Image from "@/assets/Images/stool-types/Type 1.png";
import Type2Image from "@/assets/Images/stool-types/Type 2.png";
import Type3Image from "@/assets/Images/stool-types/Type 3.png";
import Type4Image from "@/assets/Images/stool-types/Type 4.png";
import Type5Image from "@/assets/Images/stool-types/Type 5.png";
import Upgrade from "./Upgrade";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

const Free = () => {
  // Daily bowel count data
  const dailyData = [1, 2, 3, 1, 2, 0, 1];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Function to get color based on value
  const getPointColor = (value) => {
    if (value === 0) return "#ef4444"; // Red
    if (value === 3) return "#f59e0b"; // Gold/Orange
    return "#10b981"; // Green (for 1-2)
  };

  const dailyTypeStoolData = [
    { type: 1, percentage: 15, image: Type1Image, color: "#86efac" },
    { type: 2, percentage: 30, image: Type2Image, color: "#fde68a" },
    { type: 3, percentage: 100, image: Type3Image, color: "#eab308" },
    { type: 4, percentage: 20, image: Type4Image, color: "#92400e" },
    { type: 5, percentage: 0, image: Type5Image, color: "#e7e5e4" },
  ];

  const dailyTypeChartData = {
    labels: dailyTypeStoolData.map((item) => `Type ${item.type}`),
    datasets: [
      {
        data: dailyTypeStoolData.map((item) => item.percentage),
        backgroundColor: dailyTypeStoolData.map((item) => item.color),
        borderRadius: 8,
      },
    ],
  };

  const dailyTypeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 10,
        right: 0,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        anchor: (context) => {
          const value = context.dataset.data[context.dataIndex];
          return value >= 0 ? "center" : "end";
        },
        align: (context) => {
          const value = context.dataset.data[context.dataIndex];
          return value >= 0 ? "center" : "end";
        },
        offset: (context) => {
          const value = context.dataset.data[context.dataIndex];
          return value >= 0 ? -8 : 4;
        },
        color: (context) => {
          const value = context.dataset.data[context.dataIndex];
          return value >= 0 ? "#ffffff" : "#111827";
        },
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: (value) => `${value}%`,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          display: true,
          color: "#6b7280",
          font: {
            size: 12,
            weight: "medium",
          },
        },
      },
      y: {
        display: false,
        max: 100,
      },
    },
  };

  const dailyBowelChartData = {
    labels: days,
    datasets: [
      {
        data: dailyData,
        borderColor: "#6b7280", // Dark gray for dotted line
        backgroundColor: "transparent",
        borderWidth: 2,
        borderDash: [5, 5], // Dotted line
        pointRadius: 16, // Size of circles
        pointBackgroundColor: dailyData.map(getPointColor),
        pointBorderColor: dailyData.map(getPointColor),
        pointBorderWidth: 0,
        pointHoverRadius: 18,
        tension: 0.4, // Smooth curve
      },
    ],
  };

  const dailyBowelChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        anchor: "center",
        align: "center",
        color: "#ffffff", // White text inside circles
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: (value) => value,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          display: true,
          color: "#6b7280",
          font: {
            size: 12,
            weight: "medium",
          },
          padding: 10,
        },
      },
      y: {
        display: false, // Hide Y-axis
        grid: { display: false },
        border: { display: false },
      },
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      },
    },
  };

  const score = 78;
  const status = "Good";
  const change = "+5% vs Last";
  const scorePosition = 45; // Position of indicator (percentage)

  return (
    <div className="p-4">
      {/* Score Card */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-emerald-600">{score}</div>
            <div className="text-sm text-gray-500">{status}</div>
          </div>
          <div className="text-sm text-emerald-600 font-medium">{change}</div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded-full relative overflow-hidden">
            {/* Green/Teal segment */}
            <div
              className="absolute left-0 top-0 h-2 bg-teal-500 rounded-full"
              style={{ width: "45%" }}
            />
            {/* Gold/Orange segment */}
            <div
              className="absolute left-[45%] top-0 h-2 bg-amber-400 rounded-full"
              style={{ width: "30%" }}
            />
            {/* Red segment */}
            <div
              className="absolute left-[75%] top-0 h-2 bg-red-400 rounded-full"
              style={{ width: "25%" }}
            />
            {/* White circular indicator */}
            <div
              className="absolute -top-2 w-3 h-3 rounded-full bg-white border-2 border-gray-300 shadow-sm"
              style={{
                left: `${scorePosition}%`,
                transform: "translateX(-50%)",
              }}
            />
          </div>
        </div>
      </div>
      {/* Stool Type Cards */}
      <div className="text-x2 font-medium mb-3 text-primary">Daily Types</div>
      <div className="bg-white rounded-xl p-6 shadow-sm mb-5">
        <div className="flex items-center justify-between gap-4">
          {dailyTypeStoolData.map((item) => (
            <div key={item.type} className="flex flex-col items-center flex-1">
              {/* Circular Icon */}
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm border border-gray-100">
                <img
                  src={item.image}
                  alt={`Type ${item.type}`}
                  className="w-12 h-12"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="h-40">
          <Bar data={dailyTypeChartData} options={dailyTypeChartOptions} />
        </div>
      </div>

      {/* Daily Bowel Count */}
      <div className="text-x2 font-medium mb-3 text-primary">
        Daily Bowel Count
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="h-50">
          <Line data={dailyBowelChartData} options={dailyBowelChartOptions} />
        </div>
      </div>

      {/* <Upgrade /> */}
    </div>
  );
};

export default Free;
