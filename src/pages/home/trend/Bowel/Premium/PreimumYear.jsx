import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { Line } from "react-chartjs-2";
import { Info } from "lucide-react";
import { FaUserDoctor } from "react-icons/fa6";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  annotationPlugin
);

const PremiumYear = () => {
  const foods = [
    {
      rank: 1,
      name: "Milk",
      sensit: "86%",
      main: "Diarrhea",
      second: "Abd Pain",
      type: 7,
      bg: "#fcc", // Pink
    },
    {
      rank: 2,
      name: "Peanuts",
      sensit: "74%",
      main: "Constip",
      second: "Abd Pain",
      type: 2,
      bg: "#fff0ac", // Yellow
    },
    {
      rank: 3,
      name: "Seafood",
      sensit: "65%",
      main: "Bloat",
      second: "Abd Pain",
      type: 6,
      bg: "#fff0ac", // Light yellow
    },
  ];

  //   Overall Gut Reaction Chart
  const overallLabels = Array.from({ length: 12 }, (_, i) => i + 1);
  const overallData = {
    labels: overallLabels,
    datasets: [
      {
        label: "Gut Index",
        data: [50, 47, 47, 48, 60, 65, 80, 87, 87, 85, 0, 88],
        borderColor: "#22C55E", // Green
        backgroundColor: "transparent",
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#22C55E",
        pointBorderColor: "#22C55E",
        pointBorderWidth: 0,
        fill: false,
      },
      {
        label: "Last Yr",
        data: [40, 42, 43, 44, 45, 47, 48, 50, 51, 52, 53, 55],
        borderColor: "#9CA3AF", // Gray
        backgroundColor: "transparent",
        borderDash: [6, 6], // Dashed line
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0, // No points for dashed line
        fill: false,
      },
    ],
  };
  const overallOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        align: "start",
        labels: {
          color: "#6B7280", // Medium gray for both labels
          usePointStyle: false,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "white",
        titleColor: "#50403c",
        titleFont: {
          size: 18,
          weight: "bold",
        },
        bodyColor: "#9ca3af",
        bodyFont: {
          size: 14,
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 6,
        usePointStyle: false,
        callbacks: {
          title: (context) => {
            const monthNames = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ];
            const index = context[0].dataIndex;
            return monthNames[index] || `Month ${index + 1}`;
          },
          label: (context) => {
            const label = context.dataset.label === "Gut Index"
              ? "Gut Health"
              : context.dataset.label === "Last Yr"
                ? "Last Year"
                : context.dataset.label;
            return `${label}: ${context.parsed.y}`;
          },
          labelColor: (context) => {
            const datasetLabel = context.dataset.label;
            let color = "#9CA3AF"; // Default gray
            if (datasetLabel === "Gut Index") {
              color = "#EF4444"; // Red/pinkish-red for Gut Health
            } else if (datasetLabel === "Last Yr") {
              color = "#9CA3AF"; // Gray for Last Year
            }
            return {
              borderColor: color,
              backgroundColor: color,
              borderWidth: 0,
              borderRadius: 5,
            };
          },
        },
      },
      datalabels: { display: false },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)", // Faint grid lines
        },
        ticks: {
          stepSize: 1,
          color: "#6b7280",
          font: {
            size: 11,
          },
        },
      },
      y: {
        display: true,
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
          color: "#6b7280",
          font: {
            size: 11,
          },
          callback: function (value) {
            return value;
          },
        },
        grid: {
          display: false,
          color: "rgba(0, 0, 0, 0.05)", // Faint grid lines
        },
      },
    },
  };

  //   Seasonal Stool Trend Chart
  const seasonalData = {
    labels: ["SPRING", "SUMMER", "AUTUMN", "WINTER"],
    datasets: [
      {
        label: "Stool Trend",
        data: [4, 3, 4.5, 4],
        borderColor: "#22C55E",
        backgroundColor: "transparent",
        borderWidth: 3,
        tension: 0.4,
        fill: false,

        // points
        pointRadius: 6,
        pointBackgroundColor: "#22C55E",
        pointBorderColor: "#22C55E",
      },
    ],
  };
  const seasonalOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: { display: false },
    },
    scales: {
      x: {
        grid: {
          borderDash: [4, 4],
          color: "#E5E7EB",
        },
        ticks: {
          font: { weight: "600" },
          color: (context) => {
            const colors = ["#22C55E", "#3B82F6", "#D97706", "#6B7280"]; // Green, Blue, Orange-brown, Dark gray
            return colors[context.index] || "#111827";
          },
        },
      },
      y: {
        min: 1,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: (value) => {
            const map = {
              1: "Loose",
              2: "Rare",
              3: "Best",
              4: "Hard",
              5: "Ideal",
            };
            return map[value] || "";
          },
          color: "#6B7280",
        },
        grid: {
          borderDash: [4, 4],
          color: "#E5E7EB",
        },
      },
    },
  };
  const seasonLabels = ["Loose", "Rare", "Best", "Hard"];

  return (
    <div className="pl-[15px] pr-[15px]">
      {/* Top 3 Gut-Sensitivity Foods Cards */}
      <div className="w-full max-w-3xl p-4 rounded-[12px] bg-[#FEFAEF] shadow-[0_2px_4px_rgba(0,0,0,0.08)] mb-5">
        {/* Title */}
        <h2 className="mb-6 text-center text-lg font-bold text-primary">
          Top 3 Gut-Sensitivity Foods
        </h2>

        <div className="grid gap-3 grid-cols-3">
          {foods.map((food) => (
            <div
              key={food.rank}
              className="rounded-[8px] p-4"
              style={{ backgroundColor: food.bg }}
            >
              <h3 className="text-base text-primary mb-1 text-center">
                {food.rank}. {food.name}
              </h3>

              <div className="my-2 h-0.5 bg-white" />

              <div className="space-y-1 text-xs text-primary mt-2 text-center">
                <p>Sensit: {food.sensit}</p>
                <p>Main: {food.main}</p>
                <p>2nd: {food.second}</p>
                <p>Type: {food.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Gut Reaction Chart */}
      <div className="w-full max-w-2xl rounded-[12px] bg-white p-6 shadow-md mb-[15px]">
        {/* Title */}
        <div className="text-center text-base mb-4 text-primary">
          Overall Gut Reaction
        </div>

        {/* Ideal Range Indicator */}
        <div className="mb-[15px] rounded-[8px] bg-gray-100 px-3 py-2 text-sm text-primary">
          Ideal Range
        </div>

        {/* Chart Container with relative positioning for info icon */}
        <div className="relative h-64">
          <style>{`
            div[id*="chartjs-tooltip"],
            .chartjs-tooltip {
              background: white !important;
              border-radius: 8px !important;
              box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
              padding: 12px !important;
            }
            .chartjs-tooltip .chartjs-tooltip-title {
              color: #D38E5A !important;
              font-size: 18px !important;
              font-weight: bold !important;
              margin-bottom: 8px !important;
            }
            .chartjs-tooltip .chartjs-tooltip-body {
              color: #9ca3af !important;
              font-size: 14px !important;
            }
            .chartjs-tooltip .chartjs-tooltip-body-list {
              margin: 0 !important;
              padding: 0 !important;
            }
            .chartjs-tooltip .chartjs-tooltip-body-list li {
              display: flex !important;
              align-items: center !important;
              gap: 8px !important;
              margin: 4px 0 !important;
            }
            .chartjs-tooltip .chartjs-tooltip-body-list li span {
              display: inline-block !important;
              width: 10px !important;
              height: 10px !important;
              border-radius: 50% !important;
            }
          `}</style>
          <Line data={overallData} options={overallOptions} className="bg-[#F9FEFA] rounded-sm shadow-sm" />

          {/* Information Icon Overlay at x=4 (index 3) */}
          <div
            className="absolute"
            style={{
              left: "calc(25% + 8.33% * 3)", // Approximate position for x=4
              top: "calc(50% - 12px)", // Position based on data point
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <Info className="w-4 h-4 text-yellow-800" />
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-custom-12 text-center">May–Aug 2025 | Swipe ← →</div>

      {/* Seasonal Stool Trend Chart */}
      <div className="w-full max-w-2xl rounded-[8px] bg-septenary p-6 shadow-md mt-5">
        <div className="text-center text-base mb-[31px] text-primary" >
          Seasonal Stool Trends
        </div>


        <div className="relative h-50 bg-white rounded-[8px] border border-[#e6e6e6] p-2">
          {/* "Ideal" label on left */}
          {/* <div className="absolute left-2 top-1/2 transform -translate-y-1/2 -translate-x-full">
            <span className="text-sm text-gray-600 whitespace-nowrap">
              Ideal
            </span>
          </div> */}

          <Line data={seasonalData} options={seasonalOptions} />
        </div>
      </div>

      {/* Analysis Card */}
      <div className="w-full max-w-2xl rounded-[8px] bg-[#FEFAEF] p-6 shadow-[0_2px_4px_rgba(0,0,0,0.08)] mt-5">
        {/* Header with Icon and Title */}
        <div className="flex items-center gap-3 mb-4">
          {/* Stethoscope Icon - Person with stethoscope */}
          <FaUserDoctor className="text-[#f2751d] w-[18px] h-[28px]" />
          <h3 className="text-lg text-primary">Analysis Explanation</h3>
        </div>

        {/* Content Sections */}
        <div className="space-y-3 text-secondary text-sm mb-[12px]">
          <div>
            <span className="">Food Tips: </span>
            <span>Use plant milk, lactase, mind timing</span>
          </div>
          <div>
            <span className="text-primary">Seasonal: </span>
            <span>Winter GI index lower, likely from low water and cold.</span>
          </div>
          <div>
            <span className="text-primary">Action: </span>
            <span>More water in winter, keep routines in autumn</span>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-custom-12 mt-[12px] mb-[58px]">Based on past diet & bowel data, for reference only</div>
    </div>
  );
};

export default PremiumYear;
