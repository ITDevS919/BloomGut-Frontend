import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { MessageCircle } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Week = () => {
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const messageCircleRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, data: null });
  const [messageTooltip, setMessageTooltip] = useState({ visible: false, x: 0, y: 0 });

  const dayNames = {
    "Mon": "Monday",
    "Tue": "Tuesday",
    "Wed": "Wednesday",
    "Thu": "Thursday",
    "Fri": "Friday",
    "Sat": "Saturday",
    "Sun": "Sunday",
  };

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Morning",
        data: [280, 220, 250, 240, 260, 210, 200],
        backgroundColor: "#BAE6FD",
      },
      {
        label: "Noon",
        data: [350, 260, 280, 270, 290, 250, 240],
        backgroundColor: "#6AA8CF",
      },
      {
        label: "Afternoon",
        data: [220, 230, 240, 250, 260, 220, 210],
        backgroundColor: "#2C7DA0",
      },
      {
        label: "Evening",
        data: [180, 210, 220, 230, 240, 200, 190],
        backgroundColor: "#1E3A8A",
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
          pointStyle: "circle",
          boxWidth: 8,
          font: { size: 11 },
        },
      },
      datalabels: { display: false },
      tooltip: {
        enabled: false,
        external: (context) => {
          const { chart, tooltip } = context;
          if (tooltip.opacity === 0) {
            setTooltip({ visible: false, x: 0, y: 0, data: null });
            return;
          }

          const dataIndex = tooltip.dataPoints?.[0]?.dataIndex;
          if (dataIndex !== undefined) {
            const dayLabel = data.labels[dataIndex];
            const dayName = dayNames[dayLabel] || dayLabel;

            // Get values for each time period from the datasets
            const morning = data.datasets[0].data[dataIndex];
            const noon = data.datasets[1].data[dataIndex];
            const afternoon = data.datasets[2].data[dataIndex];
            const evening = data.datasets[3].data[dataIndex];

            const chartPosition = chart.canvas.getBoundingClientRect();
            const x = chartPosition.left + tooltip.caretX;
            const y = chartPosition.top + tooltip.caretY;

            setTooltip({
              visible: true,
              x,
              y,
              data: {
                day: dayName,
                morning,
                noon,
                afternoon,
                evening,
              },
            });
          }
        },
      },
    },
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: {
        stacked: true,
        min: 0,
        max: 1200,
        ticks: { stepSize: 300 },
        grid: { color: "#E5E7EB", borderDash: [4, 4] },
      },
    },
  };

  return (
    <div className="pl-[15px] pr-[15px] mt-[38px]">
      <div className="w-full rounded-[20px] bg-white p-5 shadow-[2px_0_10px_rgba(0,0,0,0.15)] mb-10">
        {/* Header */}
        <h2 className="text-center text-base text-primary mb-[9px]">
          Daily Intake
        </h2>
        <p className="mb-4 text-center text-xs text-custom-12">Weekly Tracker</p>

        {/* Chart wrapper (IMPORTANT) */}
        <div className="relative h-60">
          <Bar ref={chartRef} data={data} options={options} />

          {/* Message icon overlay */}
          <button
            ref={messageCircleRef}
            className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50"
            aria-label="Tips"
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setMessageTooltip({
                visible: true,
                x: rect.left + rect.width / 2,
                y: rect.top,
              });
            }}
            onMouseLeave={() => {
              setMessageTooltip({ visible: false, x: 0, y: 0 });
            }}
          >
            <MessageCircle className="h-5 w-5 text-blue-500" />
          </button>

          {/* Message Circle Tooltip */}
          {messageTooltip.visible && (
            <div
              className="fixed z-50 bg-white rounded-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.16)] p-4 pointer-events-none"
              style={{
                left: `${messageTooltip.x - 100}px`,
                top: `${messageTooltip.y - 100}px`,
                transform: 'translateX(-50%)',
                minWidth: '200px',
                maxWidth: '250px',
              }}
            >
              <h3 className="text-base font-medium text-primary mb-2">
                Sunday Tip
              </h3>
              <p className="text-sm text-secondary leading-relaxed">
                Low afternoon intake, drink more.
              </p>
            </div>
          )}

          {/* Custom Tooltip */}
          {tooltip.visible && tooltip.data && (
            <div
              className="fixed z-50 bg-white rounded-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.16)] p-4 pointer-events-none"
              style={{
                left: `${tooltip.x}px`,
                top: `${tooltip.y - 180}px`,
                transform: 'translateX(-50%)',
                minWidth: '200px',
              }}
            >
              <h3 className="text-base font-mdedium text-primary mb-4">
                {tooltip.data.day}
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
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: "#1E3A8A" }}
                  />
                  <span className="text-sm text-secondary">
                    Evening: {tooltip.data.evening} ml
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer text */}
        <p className="mt-[34px] italic text-center text-xs text-custom-12">
          Tap icon for tips
        </p>
      </div>

      <div className="flex items-center justify-center mb-[27px]">
        <button
          className="flex items-center justify-center bg-white rounded-[8px] px-6 py-2 text-lg text-secondary"
          onClick={() => navigate("/trend-analysis?plan=intermediate", { state: { trendType: "water", viewMode: "month" } })}
        >
          OverView
        </button>
      </div>
    </div>
  );
};

export default Week;
