import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);
import { Radar } from "react-chartjs-2";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";
import Free from "../Free";

const Week = () => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const data = {
    labels: ["Fiber", "Protein", "Fat", "Sugar", "Sodium"],
    datasets: [
      {
        label: "Recommended",
        data: [80, 75, 60, 50, 55],
        borderColor: "#22C55E",
        backgroundColor: "rgba(34,197,94,0.15)",
        pointBackgroundColor: "#22C55E",
        pointRadius: 4,
      },
      {
        label: "Actual",
        data: [60, 70, 85, 80, 72],
        borderColor: "#EF4444",
        backgroundColor: "rgba(239,68,68,0.25)",
        pointBackgroundColor: "#EF4444",
        pointRadius: 4,
      },
    ],
  };

  const options = {
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
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
          backdropColor: "transparent",
          font: { size: 10 },
        },
        grid: { color: "#E5E7EB" },
        angleLines: { color: "#D1D5DB" },
        pointLabels: {
          font: { size: 11 },
          color: "#6B7280",
        },
      },
    },
  };
  return (
    <>
      <Free />

      <div className="pl-[15px] pr-[15spx]">
        <div className="text-primary text-base pl-[15px] mb-3">Weekly Diet Analysis</div>
        <div className="w-full max-w-sm rounded-[20px] bg-white p-5 shadow-md space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-primary text-sm">March 10 – March 16</span>
            <button
              className="text-blue-500"
              onClick={() => setShowAnalysis(!showAnalysis)}
            >
              {showAnalysis ? "Hide Analysis" : "View Analysis"}
            </button>
          </div>

          {/* Radar Chart */}
          <div className="h-56">
            <Radar data={data} options={options} />
          </div>

          {/* Diet Analysis */}
          {showAnalysis && (
            <>
              <div className="rounded-[8px] bg-blue-50 p-4 text-sm space-y-2 shadow-[2px_0_10px_rgba(3,3,3,0.1)]">
                <p className="font-medium text-primary">Diet Analysis</p>

                <AnalysisRow warn text="Fat +33%" />
                <AnalysisRow warn text="Sodium +17% over" />
                <AnalysisRow warn text="Sugar slightly high" />
                <AnalysisRow ok text="Protein adequate" />
                <AnalysisRow warn text="Fiber 75% of need" />
              </div>

              {/* Recommended */}
              <div className="rounded-[8px] bg-green-50 p-4 text-sm space-y-1">
                <p className="font-medium text-primary">Recommended</p>
                <p className="text-secondary">
                  Increase: Fruits, veggies, grains, legumes
                </p>
                <p className="text-secondary">
                  Decrease: Fried, processed, desserts
                </p>
                <p className="text-secondary">Maintain: Protein</p>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-center items-center text-gray-400 italic text-sm mt-3 text-center p-4">
          This analysis is based on recent behavior and health indicators, for
          reference only
        </div>
      </div>
    </>
  );
};

function AnalysisRow({ text, warn, ok }) {
  return (
    <div className="flex items-center gap-2">
      {warn && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
      {ok && <CheckCircle className="h-4 w-4 text-green-500" />}
      <span className="text-secondary">{text}</span>
    </div>
  );
}

export default Week;
