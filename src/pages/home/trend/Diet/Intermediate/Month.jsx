import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);
import { Doughnut } from "react-chartjs-2";
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
    cutout: "65%",
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
        display: false,
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
      <div className="p-6">
        <div className="text-primary text-x2 mb-3">Monthly Diet Category</div>
        <div className="w-full max-w-sm rounded-[8px] bg-white p-5 shadow-md space-y-4">
          {/* Donut */}
          <div className="h-48 flex justify-center items-center">
            <Doughnut data={data} options={options} />
          </div>

          {/* Header */}
          <div className="flex justify-between items-center text-sm">
            <h3 className="text-primary">Monthly Diet Overview</h3>
            <button
              className="text-blue-500 hover:underline"
              onClick={() => setShowAnalysis(!showAnalysis)}
            >
              {showAnalysis ? "Hide Analysis" : "View Analysis"}
            </button>
          </div>

          {/* Breakdown */}
          <div className="space-y-1 text-sm text-gray-700">
            <Row color="bg-green-500" label="Fiber" value="25%" />
            <Row color="bg-blue-500" label="Protein" value="30%" />
            <Row color="bg-yellow-500" label="Fat" value="28%" />
            <Row color="bg-red-500" label="Sugar" value="17%" />
          </div>

          {/* Highlight */}
          <div className="rounded-[8px] bg-yellow-50 p-4 text-sm text-gray-700">
            <div className="flex items-center gap-2 font-medium mb-1">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-primary">Dietary Advice Highlights</span>
            </div>
            <p className="text-secondary">
              Fat intake is high, recommend reducing fried foods and animal
              fats.
            </p>
          </div>

          {/* Detail cards */}
          {showAnalysis && (
            <>
              <Advice color="bg-blue-50" title="Fiber (25%)">
                Fiber intake is good, keep it up.
              </Advice>

              <Advice color="bg-blue-50" title="Protein (30%)">
                Protein moderate, note.
              </Advice>

              <Advice color="bg-blue-50" title="Fat (28%)">
                Fat high, cut fried/animal fat.
              </Advice>

              <Advice color="bg-blue-50" title="Sugar (17%)">
                Sugar good, avoid refined.
              </Advice>

              {/* Overall */}
              <div className="rounded-[8px] bg-green-50 p-4 text-sm">
                <p className="text-primary mb-1">Overall Suggestions</p>
                <p className="text-secondary">
                  Diet mostly balanced; reduce fat, eat more fruits/veggies for
                  gut health.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

function Row({ color, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${color}`} />
        <span className="text-primary">{label}</span>
      </div>
      <span className="text-secondary">{value}</span>
    </div>
  );
}

function Advice({ title, children, color }) {
  return (
    <div className={`rounded-[8px] p-4 text-sm ${color}`}>
      <p className="text-primary mb-1">{title}</p>
      <p className="text-secondary">{children}</p>
    </div>
  );
}

export default Month;
