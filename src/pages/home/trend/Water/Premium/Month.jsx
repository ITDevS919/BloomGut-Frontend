import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Sun, AlertTriangle, Moon, Clock } from "lucide-react";
import { useState, useRef } from "react";

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const Month = () => {
  const chartRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, data: null });

  const labels = ["Week 1", "Week 2", "Week 3", "Week 4"];

  const data = {
    labels,
    datasets: [
      {
        type: "bar",
        label: "Morning",
        data: [260, 320, 230, 240],
        backgroundColor: "#BAE6FD",
        borderRadius: 6,
      },
      {
        type: "bar",
        label: "Noon",
        data: [230, 300, 210, 230],
        backgroundColor: "#6AA8CF",
        borderRadius: 6,
      },
      {
        type: "bar",
        label: "Afternoon",
        data: [200, 220, 260, 250],
        backgroundColor: "#2C7DA0",
        borderRadius: 6,
      },
      {
        type: "bar",
        label: "Evening",
        data: [170, 150, 180, 170],
        backgroundColor: "#2E5578",
        borderRadius: 6,
      },
      {
        type: "line",
        label: "Monthly Trend",
        data: [270, 300, 255, 265],
        borderColor: "#60C7F2",
        backgroundColor: "#60C7F2",
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#8FD3F4",
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
        color: "#6B7280",
        font: {
          size: 10,
          weight: "600",
        },

        // Default for bars
        anchor: "end",
        align: "top",
        offset: 4,

        formatter: (value) => value,
      },

      tooltip: {
        enabled: false,
        external: (context) => {
          const { chart, tooltip } = context;
          if (tooltip.opacity === 0) {
            setTooltip({ visible: false, x: 0, y: 0, data: null });
            return;
          }

          // Check if hovering over the line dataset
          const hoveredDataset = tooltip.dataPoints?.[0];
          if (hoveredDataset && hoveredDataset.datasetIndex === 4) { // Line dataset is index 4
            const dataIndex = hoveredDataset.dataIndex;
            const weekLabel = labels[dataIndex];

            // Get values for Morning, Noon, Afternoon from bar datasets
            const morning = data.datasets[0].data[dataIndex];
            const noon = data.datasets[1].data[dataIndex];
            const afternoon = data.datasets[2].data[dataIndex];

            const chartPosition = chart.canvas.getBoundingClientRect();
            const x = chartPosition.left + tooltip.caretX;
            const y = chartPosition.top + tooltip.caretY;

            setTooltip({
              visible: true,
              x,
              y,
              data: {
                week: weekLabel,
                morning,
                noon,
                afternoon,
              },
            });
          } else {
            setTooltip({ visible: false, x: 0, y: 0, data: null });
          }
        },
      },
    },

    scales: {
      y: {
        min: 0,
        max: 360,
        ticks: { stepSize: 90 },
      },
    },
  };
  return (
    <div className="pl-[15px] pr-[15px] mt-[38px]">
      <div className="w-full rounded-[20px] bg-white p-5 shadow-[2px_0_10px_rgba(0,0,0,0.15)] mb-[54px]">
      {/* Header */}
      <h2 className="text-center text-base text-primary mb-[13px]">
        Weekly Intake Analysis
      </h2>
      <p className="mb-4 text-center text-xs text-gray-400">Monthly Trend</p>

      {/* Chart */}
      <div className="relative h-60">
        <Bar ref={chartRef} data={data} options={options} />

        {/* Custom Tooltip */}
        {tooltip.visible && tooltip.data && (
          <div
            className="fixed z-50 bg-white rounded-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.16)] p-4 pointer-events-none"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y - 150}px`,
              transform: 'translateX(-50%)',
              minWidth: '200px',
            }}
          >
            <h3 className="text-base font-medium text-primary mb-4">
              {tooltip.data.week}
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: "#BAE6FD" }}
                />
                <span className="text-sm text-secondary">
                  Morning: {tooltip.data.morning} ml
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: "#6AA8CF" }}
                />
                <span className="text-sm text-secondary">
                  Noon: {tooltip.data.noon} ml
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: "#2C7DA0" }}
                />
                <span className="text-sm text-secondary">
                  Afternoon: {tooltip.data.afternoon} ml
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Icons */}
      <div className="mt-4 flex justify-center gap-4">
        <IconBtn icon={Sun} color="text-yellow-400" />
        <IconBtn icon={AlertTriangle} color="text-orange-500" />
        <IconBtn icon={Moon} color="text-blue-300" />
        <IconBtn icon={Clock} color="text-gray-500" />
      </div>

      {/* Footer */}
      <p className="mt-5 text-center text-xs text-custom-12 italic">
          Tap icons for details
        </p>
      </div>
    </div>
  );
};

function IconBtn({ icon: Icon, color = "text-gray-600" }) {
  return (
    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] transition-shadow">
      <Icon className={`h-4 w-4 ${color}`} />
    </button>
  );
}

export default Month;
