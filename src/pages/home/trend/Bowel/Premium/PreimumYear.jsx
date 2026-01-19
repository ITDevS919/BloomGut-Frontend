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
      bg: "bg-red-200",
    },
    {
      rank: 2,
      name: "Peanuts",
      sensit: "74%",
      main: "Constip",
      second: "Abd Pain",
      type: 2,
      bg: "bg-yellow-200",
    },
    {
      rank: 3,
      name: "Seafood",
      sensit: "65%",
      main: "Bloat",
      second: "Abd Pain",
      type: 6,
      bg: "bg-yellow-100",
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
      },
      tooltip: {
        enabled: true,
      },
      annotation: {
        annotations: {
          idealRange: {
            type: "box",
            xMin: -0.5,
            xMax: 11.5,
            yMin: 60,
            yMax: 85,
            backgroundColor: "rgba(229, 231, 235, 0.3)", // Light gray with transparency
            borderColor: "transparent",
            borderWidth: 0,
          },
        },
      },
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
          display: true,
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
    },
    scales: {
      x: {
        grid: {
          borderDash: [4, 4],
          color: "#E5E7EB",
        },
        ticks: {
          font: { weight: "600" },
          color: "#111827",
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
              3: "",
              4: "Ideal",
              5: "Hard",
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
    <div className="p-2 mt-5">
      {/* Top 3 Gut-Sensitivity Foods Cards */}
      <div className="w-full max-w-3xl p-1 rounded-2xl bg-[#FFFDF6] shadow-md">
        {/* Title */}
        <h2 className="mb-6 text-center text-lg text-primary">
          Top 3 Gut-Sensitivity Foods
        </h2>

        <div className="grid gap-2 grid-cols-3">
          {foods.map((food) => (
            <div key={food.rank} className={`rounded-2xl p-4 ${food.bg}`}>
              <h3 className="text-sm  text-primary">
                {food.rank}. {food.name}
              </h3>

              <div className="my-2 h-px bg-black/10" />

              <ul className="space-y-1 text-sm text-gray-700">
                <li>
                  <span className="font-medium">Sensit:</span> {food.sensit}
                </li>
                <li>
                  <span className="font-medium">Main:</span> {food.main}
                </li>
                <li>
                  <span className="font-medium">2nd:</span> {food.second}
                </li>
                <li>
                  <span className="font-medium">Type:</span> {food.type}
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Gut Reaction Chart */}
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-md mt-5">
        {/* Title */}
        <div className="text-center text-lg mb-4 text-primary">
          Overall Gut Reaction
        </div>

        {/* Ideal Range Indicator */}
        <div className="mb-3 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700">
          Ideal Range
        </div>

        {/* Chart Container with relative positioning for info icon */}
        <div className="relative h-64">
          <Line data={overallData} options={overallOptions} />

          {/* Information Icon Overlay at x=4 (index 3) */}
          <div
            className="absolute"
            style={{
              left: "calc(25% + 8.33% * 3)", // Approximate position for x=4
              top: "calc(50% - 12px)", // Position based on data point
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center shadow-sm">
              <Info className="w-4 h-4 text-yellow-800" />
            </div>
          </div>
        </div>
      </div>

      {/* Seasonal Stool Trend Chart */}
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-md mt-5">
        <div className="text-center text-lg mb-4" style={{ color: "#92400e" }}>
          Seasonal Stool Trends
        </div>

        <div className="relative h-50 mb-4">
          {/* "Ideal" label on left */}
          {/* <div className="absolute left-2 top-1/2 transform -translate-y-1/2 -translate-x-full">
            <span className="text-sm text-gray-600 whitespace-nowrap">
              Ideal
            </span>
          </div> */}

          <Line data={seasonalData} options={seasonalOptions} />
        </div>
      </div>
    </div>
  );
};

export default PremiumYear;
