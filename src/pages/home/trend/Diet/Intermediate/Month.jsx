import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);
import { Doughnut, Pie } from "react-chartjs-2";
import { AlertTriangle } from "lucide-react";
import Free from "../Free";

const Month = () => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const data = {
    labels: ["Fiber", "Protein", "Fat", "Sugar"],
    datasets: [
      {
        data: [25, 30, 28, 17],
        backgroundColor: [
          "#22C55E", // Fiber
          "#3B82F6", // Protein
          "#F59E0B", // Fat
          "#EF4444", // Sugar
        ],
        borderColor: "#FFFFFF",
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          font: { size: 11 },
        },
      },
      datalabels: {
        display: true,
        formatter: (value, context) => `${value}%`,
        color: 'white',
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw}%`,
        },
      },
    },
  };
  return (
    <>
      <Free />
      <div className="pl-[15px] pr-[15px]">
        <div className="text-primary text-base pl-[15px] mb-3">Monthly Diet Category</div>
        <div className="w-full max-w-sm rounded-[20px] bg-white p-5 shadow-md space-y-4">
          {/* Donut */}
          <div className="h-48 flex justify-center items-center">
            <Pie data={data} options={options} />
          </div>

          {/* Header */}
          <div className="flex justify-between items-center text-sm">
            <h3 className="text-primary">Monthly Diet Overview</h3>
            <button
              className="text-blue-500 hover:underline italic"
              onClick={() => setShowAnalysis(!showAnalysis)}
            >
              {showAnalysis ? "Hide Analysis" : "Click to view"}
            </button>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <LegendItem color="#28B070" label="Fiber" value="25%" />
            <LegendItem color="#2196F3" label="Protein" value="30%" />
            <LegendItem color="#FFC107" label="Fat" value="28%" />
            <LegendItem color="#F44336" label="Sugar" value="17%" />
          </div>

          {/* Highlight */}
          <div className="rounded-[8px] bg-[#FEFCE8] p-4 text-sm border-2 border-[#ededef]">
            <h3 className="text-primary mb-2">Dietary Advice Highlights</h3>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
              <p className="text-secondary">
                Fat intake is high, recommend reducing fried foods and animal fats.
              </p>
            </div>
          </div>

          {/* Detail cards */}
          {showAnalysis && (
            <>
              <Advice dotColor="#22C55E" label="Fiber" value="25%" advice="Fiber intake is good, keep it up." />
              <Advice dotColor="#3B82F6" label="Protein" value="30%" advice="Protein moderate, note." />
              <Advice dotColor="#F59E0B" label="Fat" value="28%" advice="Fat high, cut fried/animal fat." />
              <Advice dotColor="#EF4444" label="Sugar" value="17%" advice="Sugar good, avoid refined." />

              {/* Overall */}
              <div className="rounded-[8px] bg-green-50 p-4 text-sm">
                <p className="text-primary mb-2 text-sm font-medium">Overall Suggestions</p>
                <p className="text-secondary text-xs">
                  Diet mostly balanced; reduce fat, eat more fruits/veggies for
                  gut health.
                </p>
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

function LegendItem({ color, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-secondary text-sm">
        {label}: {value}
      </span>
    </div>
  );
}

function Advice({ dotColor, label, value, advice }) {
  return (
    <div className="rounded-[12px] bg-[#eff6ff] p-4 text-sm border border-[#e5e7eb]">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="h-2.5 w-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: dotColor }}
        />
        <p className="text-primary">
          {label}: ({value})
        </p>
      </div>
      <p className="text-secondary pl-[18px]">
        {advice}
      </p>
    </div>
  );
}

export default Month;
