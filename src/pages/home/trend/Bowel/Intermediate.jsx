import Free from "./Free";
import DateRangeSelector from "@/components/custom/DateRangeSelector";
import { Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

function Stat({ label, value, valueColor = "text-gray-800" }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 px-3 py-1.5">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium ${valueColor}`}>{value}</span>
    </div>
  );
}

function Progress({ value, color }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-3 flex-1 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm text-gray-600">{value}%</span>
    </div>
  );
}

const Intermediate = () => {
  const weeklydata = {
    labels: ["Hard", "Firm", "Normal", "Soft"],
    datasets: [
      {
        data: [20, 10, 30, 40],
        backgroundColor: [
          "#8B5E3C", // Hard
          "#C07A2D", // Firm
          "#F2B24C", // Normal
          "#FFD11A", // Soft
        ],
        borderColor: "#FFFFFF",
        borderWidth: 2,
      },
    ],
  };

  const weeklyoptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // we build our own legend
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw}%`,
        },
      },
    },
  };

  const monthlyData = {
    datasets: [
      {
        data: [58, 32, 10],
        backgroundColor: [
          "#C4B0F0", // Morning (purple)
          "#63C174", // Green
          "#FFD43B", // Yellow
        ],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const monthlyOptions = {
    plugins: {
      tooltip: { enabled: false },
    },
  };

  const [viewMode, setViewMode] = useState("week");

  return (
    <div>
      {/* Date Range Selector Header */}
      <DateRangeSelector setViewMode={setViewMode} />
      <Free />
      <div className="p-4">
        {/* Content */}

        {/* Weekly Stats */}
        {viewMode === "week" && (
          <>
            <div className="text-x2 font-medium mb-3 text-primary">
              Weekly Stats
            </div>
            <div className="flex items-center gap-6 rounded-2xl bg-white p-6 shadow-md">
              {/* Pie */}
              <div className="w-40 h-40">
                <Pie data={weeklydata} options={weeklyoptions} />
              </div>

              {/* Legend */}
              <div className="space-y-3 text-sm">
                {weeklydata.labels.map((label, i) => (
                  <div key={label} className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor:
                          weeklydata.datasets[0].backgroundColor[i],
                      }}
                    />
                    <span className="text-gray-700">
                      {label} ({weeklydata.datasets[0].data[i]}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {viewMode === "month" && (
          <>
            <div className="text-x2 font-medium mb-3 text-primary">
              Monthly Stats
            </div>
            <div className="flex items-center gap-6 rounded-2xl bg-white p-6 shadow-md">
              {/* Donut */}
              <div className="relative w-36 h-36">
                <Doughnut data={monthlyData} options={monthlyOptions} />

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-semibold text-gray-900">
                    58%
                  </span>
                  <span className="text-xs text-gray-500">Morning</span>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-2 text-sm">
                <Stat
                  label="Avg Time"
                  value="8 AM"
                  valueColor="text-green-600"
                />
                <Stat label="Most" value="Thu" />
                <Stat
                  label="Regularity"
                  value="Good"
                  valueColor="text-green-600"
                />
              </div>
            </div>

            {/* Progress Bars */}
            <div className="text-x2 font-medium mb-3 text-primary mt-5">
              Stool Time %
            </div>
            <div className="space-y-3">
              <Progress value={58} color="bg-[#C4B0F0]" />
              <Progress value={32} color="bg-[#63C174]" />
              <Progress value={10} color="bg-[#FFD43B]" />
            </div>
          </>
        )}
        <div className="flex items-center justify-center text-sm mt-3 text-gray-400">
          Data for reference only
        </div>
      </div>
    </div>
  );
};

export default Intermediate;
