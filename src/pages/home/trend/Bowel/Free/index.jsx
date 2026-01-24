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
import Type1Image from "@/assets/Images/bowel-types/Type 1.png";
import Type2Image from "@/assets/Images/bowel-types/Type 2.png";
import Type3Image from "@/assets/Images/bowel-types/Type 3.png";
import Type4Image from "@/assets/Images/bowel-types/Type 4.png";
import Type5Image from "@/assets/Images/bowel-types/Type 5.png";
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

const Free = ({ showUpgrade = true }) => {
  // Daily bowel count data
  const dailyData = [1, 2, 3, 1, 2, 0, 1];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Tooltip data for each day
  const tooltipData = [
    { health: "60%", status: "Constipation", impact: "High", type: "1 (Hard)", factor: "Low Water" },
    { health: "75%", status: "Normal", impact: "Medium", type: "2 (Lumpy)", factor: "Balanced" },
    { health: "85%", status: "Good", impact: "Low", type: "3 (Firm)", factor: "Adequate" },
    { health: "60%", status: "Constipation", impact: "High", type: "1 (Hard)", factor: "Low Water" },
    { health: "75%", status: "Normal", impact: "Medium", type: "2 (Lumpy)", factor: "Balanced" },
    { health: "40%", status: "Severe", impact: "Very High", type: "0 (None)", factor: "Multiple" },
    { health: "60%", status: "Constipation", impact: "High", type: "1 (Hard)", factor: "Low Water" },
  ];

  // Function to get color based on value
  const getPointColor = (value) => {
    if (value === 0) return "#ef4444"; // Red
    if (value === 3) return "#f59e0b"; // Gold/Orange
    return "#10b981"; // Green (for 1-2)
  };

  const dailyTypeValues = [15, 30, 35, 20, 0];
  const dailyTypeLabels = [
    {
      color: '#9AD0A1',
      label: 'Type 1'
    },
    {
      color: '#D4AE7C',
      label: 'Type 2'
    },
    {
      color: '#E0B85C',
      label: 'Type 3'
    },
    {
      color: '#B5652E',
      label: 'Type 4'
    },
    {
      color: '#9CA3AF',
      label: 'Type 5'
    }
  ];
  const dailyTypeColors = [
    "#9AD0A1", // green
    "#D4AE7C", // tan
    "#E0B85C", // yellow
    "#B5652E", // brown
    "#9CA3AF", // gray
  ];

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
        pointBackgroundColor: "white",
        pointBorderColor: dailyData.map(getPointColor),
        pointBorderWidth: 2,
        pointHoverRadius: 18,
        tension: 0.4, // Smooth curve,
      },
    ],
  };

  const dailyBowelChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "white",
        titleColor: "#4b332d",
        titleFont: { size: 18, weight: "bold", family: "sans-serif" },
        bodyColor: "#6b7280",
        bodyFont: { size: 14, family: "sans-serif" },
        padding: {
          top: 16,
          right: 20,
          bottom: 20,
          left: 20,
        },
        displayColors: false,
        borderColor: "transparent",
        borderWidth: 0,
        cornerRadius: 12,
        boxPadding: 0,
        usePointStyle: false,
        callbacks: {
          title: () => "Details",
          label: (context) => {
            const index = context.dataIndex;
            const data = tooltipData[index];
            return [
              `Health: ${data.health}`,
              `Status: ${data.status}`,
              `Impact: ${data.impact}`,
              `Type: ${data.type}`,
              `Factor: ${data.factor}`,
            ];
          },
          afterBody: () => ["Analyzed by System"],
          footer: () => "",
          labelTextColor: () => "#6b7280",
          afterBodyColor: () => "#9ca3af",
          footerColor: () => "#9ca3af",
          labelFont: () => ({ size: 14, family: "sans-serif" }),
          footerFont: () => ({ size: 12, family: "sans-serif" }),
        },
      },
      datalabels: {
        anchor: "center",
        align: "center",
        color: (context) => {
          const value = context.parsed?.y ?? context.dataset.data[context.dataIndex];
          return getPointColor(value);
        },
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
        // bottom: 10,
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
    <div className="pr-[15px] pl-[15px]">
      <style>{`
        div[id*="chartjs-tooltip"],
        .chartjs-tooltip {
          text-align: left !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
        }
        .chartjs-tooltip .chartjs-tooltip-title {
          text-align: left !important;
          font-weight: bold !important;
          color: #4b332d !important;
          font-size: 18px !important;
        }
        .chartjs-tooltip .chartjs-tooltip-body {
          text-align: left !important;
        }
        .chartjs-tooltip .chartjs-tooltip-body-list {
          text-align: left !important;
        }
        .chartjs-tooltip .chartjs-tooltip-body-list li {
          text-align: left !important;
          color: #6b7280 !important;
          font-size: 14px !important;
        }
        .chartjs-tooltip .chartjs-tooltip-body-list:last-of-type {
          text-align: center !important;
          margin-top: 12px !important;
          padding-top: 12px !important;
          padding-bottom: 4px !important;
          border-top: 1px solid #e5e7eb !important;
        }
        div[id*="chartjs-tooltip"] .chartjs-tooltip-body-list:last-of-type li,
        .chartjs-tooltip .chartjs-tooltip-body-list:last-of-type li {
          font-size: 12px !important;
          color: #9ca3af !important;
          text-align: center !important;
          display: block !important;
          margin: 0 !important;
          padding: 0 !important;
          line-height: 1.5 !important;
        }
        .chartjs-tooltip .chartjs-tooltip-body-list:last-of-type li span {
          font-size: 12px !important;
          color: #9ca3af !important;
          text-align: center !important;
          display: block !important;
        }
        .chartjs-tooltip .chartjs-tooltip-body-list:last-of-type li * {
          font-size: 12px !important;
          color: #9ca3af !important;
          text-align: center !important;
        }
        .chartjs-tooltip .chartjs-tooltip-footer {
          text-align: center !important;
          margin-top: 12px !important;
          padding-top: 12px !important;
          padding-bottom: 4px !important;
          border-top: 1px solid #e5e7eb !important;
        }
        .chartjs-tooltip .chartjs-tooltip-footer li {
          font-size: 12px !important;
          color: #9ca3af !important;
          text-align: center !important;
        }
      `}</style>
      {/* Score Card */}
      <div className="bg-white rounded-[27px] p-[32px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] mb-[29px]">
        <div className="flex items-center justify-between mb-4">
          <div className="pl-[50px]">
            <div className="text-3xl font-bold text-[#1abc9c]">{score}</div>
            <div className="text-sm text-custom-12">{status}</div>
          </div>
          <div className="text-base pr-[50px] text-center text-[#1abc9c]">{change}</div>
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
              className="absolute -top-2 w-3 h-3 rounded-full bg-white border-2 border-gray-300 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              style={{
                left: `${scorePosition}%`,
                transform: "translateX(-50%)",
              }}
            />
          </div>
        </div>
      </div>
      {/* Stool Type Cards */}
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
                    src={[Type1Image, Type2Image, Type3Image, Type4Image, Type5Image][index]}
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
                  <div className="w-full h-full flex items-end justify-center absolute bottom-0 pb-1">
                    <span className="text-custom-1 text-xs">0%</span>
                  </div>
                )}
              </div>
              {/* Label Below Bar */}
              <div className="text-xs text-primary mt-2 text-center">
                <span style={{ color: dailyTypeLabels[index].color }}>{dailyTypeLabels[index].label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Bowel Count */}
      <div className="text-base pl-[15px] font-medium mb-5 text-primary">
        Daily Bowel Count
      </div>
      <div className="bg-white rounded-[27px] p-6 shadow-[0_2px_4px_rgba(0,0,0,0.08)] mb-[35px]">
        <div className="h-50">
          <Line data={dailyBowelChartData} options={dailyBowelChartOptions} />
        </div>
      </div>

      {showUpgrade && <Upgrade />}
    </div>
  );
};

export default Free;
