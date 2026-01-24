import Free from "../Free";
import DateRangeSelector from "@/components/custom/DateRangeSelector";
import { Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState } from "react";
import Upgrade from "./Upgrade";
import DateRangeSelectorYellowUpdate from "@/components/custom/DateRangeSelectorYellow(Update)";
import DateRangeSelectorYellow from "@/components/custom/DateRangeSelectorYellow";

ChartJS.register(ArcElement, Tooltip, Legend);

function Stat({ label, value, valueColor = "text-gray-800" }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[8px] border border-gray-200 px-3 py-1.5">
      <span className="text-primary">{label}</span>
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
      datalabels: {
        display: false,
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
      datalabels: {
        display: false,
      },
    },
  };

  const [viewMode, setViewMode] = useState("week");

  return (
    <div>
      {/* Date Range Selector Header */}
      <DateRangeSelector setViewMode={setViewMode} />
      <Free showUpgrade={false} />
      <div className="pl-[15px] pr-[15px]">
        {/* Content */}

        {/* Weekly Stats */}
        {viewMode === "week" && (
          <>
            <div className="text-base pl-[15px] font-medium mb-5 text-primary">
              Weekly Stats
            </div>
            <div className="flex items-center gap-6 rounded-[27px] bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.08)] mb-[20px]">
              {/* Pie */}
              <div className="w-40 h-40">
                <Pie data={weeklydata} options={weeklyoptions} />
              </div>

              {/* Legend */}
              <div className="space-y-3 text-sm">
                {weeklydata.labels.map((label, i) => (
                  <div key={label} className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor:
                          weeklydata.datasets[0].backgroundColor[i],
                      }}
                    />
                    <span className="text-secondary">
                      {label} ({weeklydata.datasets[0].data[i]}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center text-xs text-custom-12 pb-[46px]">
              Data for reference only
            </div>
          </>
        )}
        {viewMode === "month" && (
          <>
            <div className="text-base pl-[15px] font-medium mb-5 text-primary">
              Stool Time %
            </div>
            <div className="rounded-[27px] bg-white p-6 shadow-md">
              <h2 className="text-primary mb-4">Monthly</h2>
              <div className="flex items-center gap-6">
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
                  <Stat label="Most" value="Thu" valueColor="text-green-600" />
                  <Stat
                    label="Regularity"
                    value="Good"
                    valueColor="text-green-600"
                  />
                </div>
              </div>
              {/* Progress Bars */}
              <div className="text-x2 mb-3 text-primary mt-5">
                Stool Time %
              </div>
              <div className="space-y-3">
                <Progress value={58} color="bg-[#C4B0F0]" />
                <Progress value={32} color="bg-[#63C174]" />
                <Progress value={10} color="bg-[#FFD43B]" />
              </div>
            </div>

            <div className="flex items-center justify-center text-xs text-custom-12 mt-[20px] mb-[43px]">
              Data for reference only
            </div>
            <Upgrade />
          </>
        )}

      </div>
    </div>
  );
};

export default Intermediate;
