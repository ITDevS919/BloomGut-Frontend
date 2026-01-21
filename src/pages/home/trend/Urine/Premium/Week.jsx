import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { Line } from "react-chartjs-2";
import { Info } from "lucide-react";
import { useState } from "react";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  annotationPlugin
);

const Week = () => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const intake = [2100, 1950, 2300, 2150, 2500, 2350, 2050];
  const clarity = [75, 68, 82, 70, 88, 80, 72];

  const data = {
    labels,
    datasets: [
      {
        label: "Intake (ml)",
        data: intake,
        borderColor: "#3B82F6",
        backgroundColor: "#3B82F6",
        yAxisID: "y",
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: "Clarity (%)",
        data: clarity,
        borderColor: "#22C55E",
        backgroundColor: "#22C55E",
        yAxisID: "y1",
        tension: 0.4,
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
      datalabels: { display: false },
      annotation: {
        annotations: {
          anomaly: {
            type: "point",
            xValue: "Wed",
            yValue: 2300,
            backgroundColor: "#EF4444",
            radius: 6,
          },
          normal: {
            type: "point",
            xValue: "Fri",
            yValue: 2500,
            backgroundColor: "#3B82F6",
            radius: 6,
          },
        },
      },
    },
    scales: {
      y: {
        position: "left",
        min: 0,
        max: 3500,
        ticks: {
          stepSize: 900,
        },
        grid: {
          color: "#E5E7EB",
          borderDash: [4, 4],
        },
      },
      y1: {
        position: "right",
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        grid: { display: false },
      },
    },
  };
  return (
    <div className="p-6">
      <div className="text-x2 mb-3 mt-3 text-primary">Water and Urine Analysis</div>
      <div className="w-full max-w-sm rounded-[8px] bg-white p-5 shadow-md space-y-4">
        {/* Chart */}
        <div className="h-48">
          <Line data={data} options={options} />
        </div>

        {/* Legend row (extra markers like image) */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex gap-4">
            <LegendDot color="bg-red-400" label="Anomalies" />
            <LegendDot color="bg-blue-400" label="Normal" />
          </div>
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="text-blue-500 text-xs hover:underline"
          >
            {showAnalysis ? "Hide Analysis" : "View Analysis"}
          </button>
        </div>

        {/* Monthly Summary */}
        {showAnalysis && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-medium text-gray-800">
                Monthly Summary
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
              <span>Avg Intake:</span>
              <span className="text-right">2243 ml</span>
              <span>Clarity:</span>
              <span className="text-right">67%</span>
              <span>Drop Days:</span>
              <span className="text-right">2</span>
              <span>Hydration:</span>
              <span className="text-right">71%</span>
            </div>
            {/* Weekly Insights */}
            <div className="rounded-[8px] bg-yellow-50 p-4 text-sm text-gray-700">
              <p className="font-medium mb-1">Weekly Insights</p>
              <p>
                2 drop days, linked to high salt/sugar diet. Drink +20% water
                and avoid caffeine.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center text-gray-400 italic text-sm mt-3">
        For reference only. Consult a doctor if needed.
      </div>
    </div>
  );
};

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}

export default Week;
