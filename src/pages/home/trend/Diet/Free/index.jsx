import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Wheat, Beef, Salad, Milk, MoreHorizontal, UtensilsCrossed } from "lucide-react";
import Upgrade from "./Upgrade";
import { useState } from "react";
import GrainsImage from "@/assets/Images/diet-types/Grains.png";
import ProteinImage from "@/assets/Images/diet-types/Protein.png";
import FruitsVegImage from "@/assets/Images/diet-types/Fruits.png";
import DairyImage from "@/assets/Images/diet-types/Dairy.png";
import OtherImage from "@/assets/Images/diet-types/Others.png";
import { MdRamenDining } from "react-icons/md";
import { FaPoo } from "react-icons/fa6";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  ChartDataLabels
);

const Free = () => {
  const [selectedDate, setSelectedDate] = useState("3/16");

  // Dietary breakdown data
  const dailyTypeValues = [35, 25, 20, 10, 5];
  const dailyTypeLabels = [
    {
      color: '#d0ab7f',
      label: 'Grains'
    },
    {
      color: '#ce8540',
      label: 'Protein'
    },
    {
      color: '#8cbf86',
      label: 'Fruits & Veg'
    },
    {
      color: '#edd169',
      label: 'Dairy'
    },
    {
      color: '#94a3b8',
      label: 'Other'
    }
  ];
  const dailyTypeColors = [
    "#d0ab7f", // green
    "#ce8540", // tan
    "#8cbf86", // yellow
    "#edd169", // brown
    "#94a3b8", // gray
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

  const dates = ["3/10", "3/11", "3/12", "3/13", "3/14", "3/15", "3/16"];
  const chartDates = ["3/11", "3/12", "3/13", "3/14", "3/15", "3/16"];
  const dietTrendData = {
    labels: chartDates,
    datasets: [
      {
        label: "Fiber",
        data: [70, 68, 72, 69, 71, 73],
        borderColor: "#22C55E",
        backgroundColor: "#22C55E",
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: (context) => {
          return context.dataIndex === chartDates.length - 1 ? 6 : 3;
        },
        pointBackgroundColor: "#22C55E",
        pointBorderColor: "#22C55E",
        pointBorderWidth: 2,
      },
      {
        label: "Protein",
        data: [60, 62, 63, 61, 64, 66],
        borderColor: "#3B82F6",
        backgroundColor: "#3B82F6",
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: (context) => {
          return context.dataIndex === chartDates.length - 1 ? 6 : 3;
        },
        pointBackgroundColor: "#3B82F6",
        pointBorderColor: "#3B82F6",
        pointBorderWidth: 2,
      },
      {
        label: "Fat",
        data: [45, 46, 47, 46, 48, 49],
        borderColor: "#FACC15",
        backgroundColor: "#FACC15",
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: (context) => {
          return context.dataIndex === chartDates.length - 1 ? 6 : 3;
        },
        pointBackgroundColor: "#FACC15",
        pointBorderColor: "#FACC15",
        pointBorderWidth: 2,
      },
      {
        label: "Sugar",
        data: [35, 38, 37, 39, 36, 40],
        borderColor: "#EF4444",
        backgroundColor: "#EF4444",
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: (context) => {
          return context.dataIndex === chartDates.length - 1 ? 6 : 3;
        },
        pointBackgroundColor: "#EF4444",
        pointBorderColor: "#EF4444",
        pointBorderWidth: 2,
      },
    ],
  };
  const dietTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
        grid: {
          display: true,
          color: (context) => {
            return context.index === chartDates.length - 1 ? "#E5E7EB" : "transparent";
          },
          lineWidth: (context) => {
            return context.index === chartDates.length - 1 ? 1 : 0;
          },
        },
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
        pointRadius: (context) => {
          return context.dataIndex === dates.length - 1 ? 6 : 3;
        },
        pointBackgroundColor: "#14B8A6",
        pointBorderColor: "#14B8A6",
        pointBorderWidth: 2,
        pointHoverRadius: 4,
      },
      {
        label: "Consis",
        data: [50, 55, 58, 60, 62, 64, 68],
        borderColor: "#A855F7",
        backgroundColor: "#A855F7",
        tension: 0.4,
        pointRadius: (context) => {
          return context.dataIndex === dates.length - 1 ? 6 : 3;
        },
        pointBackgroundColor: "#A855F7",
        pointBorderColor: "#A855F7",
        pointBorderWidth: 2,
      },
      {
        label: "Ease",
        data: [40, 43, 46, 48, 52, 55, 60],
        borderColor: "#F59E0B",
        backgroundColor: "#F59E0B",
        tension: 0.4,
        pointRadius: (context) => {
          return context.dataIndex === dates.length - 1 ? 6 : 3;
        },
        pointBackgroundColor: "#F59E0B",
        pointBorderColor: "#F59E0B",
        pointBorderWidth: 2,
      },
      {
        label: "Overall",
        data: [30, 33, 35, 37, 40, 43, 48],
        borderColor: "#6B4F4F",
        backgroundColor: "#6B4F4F",
        tension: 0.4,
        pointRadius: (context) => {
          return context.dataIndex === dates.length - 1 ? 6 : 3;
        },
        pointBackgroundColor: "#6B4F4F",
        pointBorderColor: "#6B4F4F",
        pointBorderWidth: 2,
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
      datalabels: { display: false },
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        grid: {
          display: true,
          color: (context) => {
            return context.index === dates.length - 1 ? "#E5E7EB" : "transparent";
          },
          lineWidth: (context) => {
            return context.index === dates.length - 1 ? 1 : 0;
          },
        },
        ticks: { font: { size: 11 } },
      },
    },
  }


  return (
    <div className="pr-[15px] pl-[15px]">
      {/* Score Card */}
      <div className="bg-white rounded-[27px] p-[32px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] mb-[29px]">
        <div className="flex items-center justify-between">
          <div className="pl-[50px]">
            <div className="text-3xl font-medium text-[#B5A6D2]">82</div>
            <div className="text-sm text-custom-12">Good</div>
          </div>
          <div className="text-base text-[#B5A6D2]">+7% vs Last</div>
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

      {/* Daily Type Distribution */}
      <div className="text-base mb-3 font-medium pl-[15px] text-primary">Daily Types</div>
      <div className="bg-white rounded-[20px] p-6 shadow-[2px_0_10px_rgba(3,3,3,0.1)] mb-[34px]">
        <div className="flex items-end justify-between gap-2">
          {dailyTypeValues.map((value, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              {/* Colored Bar with Gray Background and Icon Inside */}
              <div className="w-full bg-[#E6E6E6] rounded-lg relative overflow-hidden flex flex-col" style={{ height: '120px' }}>
                {/* Circular Icon at Top */}
                <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mx-auto mt-2 mb-2 z-10">
                  <img
                    src={[GrainsImage, ProteinImage, FruitsVegImage, DairyImage, OtherImage][index]}
                    alt={`Type ${index + 1}`}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                {/* Colored Bar Fill */}
                {value > 0 ? (
                  <div
                    className="w-full rounded-lg flex items-center justify-center absolute bottom-0"
                    style={{
                      height: `${value}%`,
                      backgroundColor: dailyTypeColors[index],
                      minHeight: '20px',
                    }}
                  >
                    <span className="text-white text-xs">
                      {value}%
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center absolute">
                    <span className="text-custom-1 text-xs">0%</span>
                  </div>
                )}
              </div>
              {/* Label Below Bar */}
              <div className="text-xs text-primary mt-2 text-center">
                <span className="whitespace-nowrap" style={{ color: "#705d57" }}>{dailyTypeLabels[index].label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diet Trends */}
      <div className="text-primary text-base font-medium pl-[15px] mb-[14px] mt-9">Diet & Bowel Trends</div>
      <div className="w-full rounded-[27px] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.08)] space-y-4">
        {/* Date pills */}
        <div className="flex gap-2 overflow-x-auto items-center justify-center pt-[23px]">
          {dates.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDate(d)}
              className={`px-2 py-1 rounded-full text-xs ${selectedDate === d
                ? "bg-[#b5a6d2] text-white"
                : "bg-[#f4f4f4] text-[#705d57]"
                }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 pl-[20px]">
          <span className="text-lg"><MdRamenDining className="text-secondary" /></span>
          <h2 className="text-sm font-medium text-secondary">Diet Trends</h2>
        </div>

        {/* Chart */}
        <div className="h-48 grid grid-cols-[30px_1fr] gap-2 relative pl-[10px] pr-[10px]">
          {/* LEFT LABELS */}
          <div className="flex flex-col justify-between text-xs pt-2 pb-6">
            <span className="text-green-600">Fiber</span>
            <span className="text-blue-600">Protein</span>
            <span className="text-yellow-600">Fat</span>
            <span className="text-red-600">Sugar</span>
          </div>
          <div className="relative">
            <Line data={dietTrendData} options={dietTrendOptions} />
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 text-xs mb-[32px]">
          <Legend color="bg-green-500" label="Fiber" />
          <Legend color="bg-blue-500" label="Protein" />
          <Legend color="bg-yellow-500" label="Fat" />
          <Legend color="bg-red-500" label="Sugar" />
        </div>
      </div>

      {/* Bowel Trend */}
      <div className="w-full rounded-[27px] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.08)] space-y-4 mt-8">
        {/* Date pills */}
        <div className="flex gap-2 overflow-x-auto items-center justify-center pt-[23px]">
          {dates.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDate(d)}
              className={`px-2 py-1 rounded-full text-xs ${selectedDate === d
                ? "bg-[#b5a6d2] text-white"
                : "bg-[#f4f4f4] text-[#705d57]"
                }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 pl-[20px]">
          <span className="text-xl"><FaPoo className="text-secondary" /></span>
          <h2 className="text-sm font-medium text-secondary">Bowel Trend</h2>
        </div>

        {/* Chart with left labels */}
        <div className="h-48 grid grid-cols-[30px_1fr] gap-2 relative pl-[10px] pr-[10px]">
          {/* LEFT LABELS */}
          <div className="flex flex-col justify-between pb-6 pt-4 text-xs">
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
        <div className="flex justify-center gap-4 text-xs mb-[32px]">
          <Legend color="bg-teal-500" label="Freq" />
          <Legend color="bg-purple-500" label="Consis" />
          <Legend color="bg-amber-500" label="Ease" />
          <Legend color="bg-stone-500" label="Overall" />
        </div>
      </div>

      {/* <Upgrade /> */}
    </div >
  );
};

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-1 text-secondary text-xs">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  )
}

export default Free;
