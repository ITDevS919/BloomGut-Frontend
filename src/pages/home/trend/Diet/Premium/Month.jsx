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
        display: true,
        color: "#FFFFFF",
        font: {
          weight: "600",
          size: 10,
        },
      },
    },
  };

  return (
    <div className="pl-[15px] pr-[15px] mt-[33px]">
      <div className="text-primary  font-medium text-base pl-[15px] mb-3">Nutritional Dashboard</div>
      <div className="w-full rounded-[20px] bg-white p-5 shadow-[2px_0_10px_rgba(0,0,0,0.15)] space-y-4">
        <h2 className="text-base mt-1 text-secondary">Monthly Overview</h2>

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
        <div className="rounded-[8px] bg-[#fefce8] p-4 text-sm border border-[#e5e7eb]">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-primary text-base">Focus</span>
            <span className="rounded-full bg-[#fef08a] px-2 py-0.5 text-xs text-secondary">
              1 Deficiency
            </span>
          </div>
          <p className="text-secondary">Low calcium, adjust diet</p>
        </div>

        {/* Collapsibles */}
        <Collapse title="Achievement" showAchievement={true} />
        <Collapse title="Summary & Advice" showSummary={true} />
      </div>

      <div className="flex justify-center p-4 items-center text-gray-400 italic text-sm mt-3 text-center">
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
    <div className="rounded-[7px] border-2 border-[#e5e7eb] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-sm"
      >
        <span className="text-primary text-base">{title}</span>
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
                className="bg-white rounded-[7px] p-3 shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-gray-100"
              >
                {/* Header with label and percentage badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-secondary">
                    {item.label}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: item.badgeBg,
                      color: "#705d56",
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
            className="rounded-[8px] p-4"
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
            className="rounded-[8px] p-4"
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
