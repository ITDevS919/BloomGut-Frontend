import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

ChartJS.register(ArcElement, Tooltip, ChartDataLabels);

const Month = () => {
  const rings = [
    { label: "Vit C", value: 65, color: "#FACC15" },
    { label: "Water", value: 62, color: "#06B6D4" },
    { label: "Iron", value: 68, color: "#F87171" },
    { label: "Fiber", value: 72, color: "#22C55E" },
    { label: "Protein", value: 67, color: "#3B82F6" },
    { label: "Calcium", value: 81, color: "#F59E0B" },
  ];

  const data = {
    datasets: rings.map((r, i) => ({
      data: [r.value, 100 - r.value],
      backgroundColor: [r.color, "#F3F4F6"],
      borderWidth: 0,
      cutout: `${70 - i * 8}%`,
      radius: `${90 - i * 8}%`,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        display: false,
        color: "#FFFFFF",
        font: {
          weight: "600",
          size: 10,
        },
        formatter: (v) => (v > 0 && v < 100 ? `${v}%` : ""),
      },
    },
  };

  return (
    <div className="p-6">
      <div className="text-primary text-x2 mb-3">Nutritional Dashboard</div>
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-md space-y-4">
        <h2 className="text-sm text-primary">Monthly Overview</h2>

        {/* Chart */}
        <div className="flex justify-center">
          <div className="h-52 w-52">
            <Doughnut data={data} options={options} />
          </div>

          {/* Legend */}
          <div className="ml-4 space-y-2 text-xs">
            {rings.map((r) => (
              <Legend key={r.label} color={r.color} label={r.label} />
            ))}
          </div>
        </div>

        {/* Focus */}
        <div className="rounded-xl bg-yellow-50 p-4 text-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium">Focus</span>
            <span className="rounded-full bg-yellow-300 px-2 py-0.5 text-xs">
              1 Deficiency
            </span>
          </div>
          <p className="text-gray-700">Low calcium, adjust diet</p>
        </div>

        {/* Collapsibles */}
        <Collapse title="Achievement" showAchievement={true} />
        <Collapse title="Summary & Advice" showSummary={true} />
      </div>

      <div className="flex justify-center items-center text-gray-400 italic text-sm mt-3 text-center">
        This analysis is based on recent behavior and health indicators, for
        reference only
      </div>
    </div>
  );
};

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </div>
  );
}

function Collapse({ title, showAchievement = false, showSummary = false }) {
  const [isOpen, setIsOpen] = useState(false);

  // Achievement data
  const achievementData = [
    {
      label: "Vit C",
      percentage: 85,
      badgeBg: "#E8F5E9",
      badgeText: "#4CAF50",
      barColor: "#FFEB3B",
    },
    {
      label: "Water",
      percentage: 81,
      badgeBg: "#E8F5E9",
      badgeText: "#4CAF50",
      barColor: "#03A9F4",
    },
    {
      label: "Iron",
      percentage: 72,
      badgeBg: "#FFFDE7",
      badgeText: "#FFC107",
      barColor: "#F44336",
    },
    {
      label: "Fiber",
      percentage: 68,
      badgeBg: "#FFFDE7",
      badgeText: "#FFC107",
      barColor: "#4CAF50",
    },
    {
      label: "Protein",
      percentage: 62,
      badgeBg: "#FFFDE7",
      badgeText: "#FFC107",
      barColor: "#2196F3",
    },
    {
      label: "Calcium",
      percentage: 55,
      badgeBg: "#FBE9E7",
      badgeText: "#FF5722",
      barColor: "#FF9800",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-sm"
      >
        <span className="text-primary">{title}</span>
        <ChevronDown
          className="h-4 w-4 text-gray-400 transition-transform"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {isOpen && showAchievement && (
        <div className="p-4 pt-0">
          <div className="grid grid-cols-2 gap-3">
            {achievementData.map((item) => (
              <div
                key={item.label}
                className="bg-white rounded-lg p-3 shadow-sm border border-gray-100"
              >
                {/* Header with label and percentage badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-primary">
                    {item.label}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: item.badgeBg,
                      color: item.badgeText,
                    }}
                  >
                    {item.percentage}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.barColor,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isOpen && showSummary && (
        <div className="p-4 pt-0 space-y-3">
          {/* Monthly Nutrition Summary Card */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "#FCE4EC" }} // Light pink
          >
            <h3 className="text-base text-primary mb-2">
              Monthly Nutrition Summary
            </h3>
            <div className="space-y-1 text-sm text-secondary">
              <p>This month: 70.5% (+3.2%).</p>
              <p>Protein low at lunch/dinner.</p>
              <p>Calcium lacking, increase intake.</p>
            </div>
          </div>

          {/* Next Month's Goals Card */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "#E8F5E9" }} // Light green
          >
            <h3 className="text-base text-primary mb-2">Next Month's Goals</h3>
            <ul className="space-y-1 text-sm text-secondary list-disc list-inside">
              <li>More lunch protein (chicken, legumes)</li>
              <li>More calcium (dairy, tofu, greens)</li>
              <li>Maintain hydration</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Month;
