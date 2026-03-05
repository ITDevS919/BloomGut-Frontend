import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Upgrade from "./Upgrade";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  ChartDataLabels
);
ChartJS.register(ArcElement);

const goalLine = {
  id: "goalLine",
  afterDatasetsDraw(chart) {
    const {
      ctx,
      chartArea: { left, right },
      scales: { y },
    } = chart;

    const goal = 2000;
    const yPos = y.getPixelForValue(goal);

    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(left, yPos);
    ctx.lineTo(right, yPos);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.fillStyle = "#f59e0b";
    ctx.font = "12px sans-serif";
    ctx.fillText("Goal: 2000ml", left + 6, yPos - 6);
    ctx.restore();
  },
};

const options = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
    datalabels: {
      anchor: "end",
      align: "end",
      offset: 4,
      color: "#111827",
      font: {
        weight: "600",
        size: 12,
      },
      formatter: (value) => value,
    },
  },
  scales: {
    x: { grid: { display: false } },
    y: { display: false, suggestedMax: 2600 },
  },
};

const buildChartData = (labels, values) => ({
  labels,
  datasets: [
    {
      data: values,
      backgroundColor: [
        "#bae6fd",
        "#3b82f6",
        "#2563eb",
        "#1d4ed8",
        "#2563eb",
        "#1e40af",
        "#bae6fd",
      ],
      borderRadius: 10,
    },
  ],
});

const CircleStat = ({ value, label, color, showUpgrade = true }) => {
  const data = {
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: [color, "#e5e7eb"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "80%",
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
      datalabels: { display: false },
    },
  };

  return (
    <div className="relative w-24 h-24">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xl font-bold" style={{ color }}>
          {value}%
        </span>
        <span className="text-sm font-medium" style={{ color }}>
          {label}
        </span>
      </div>
      {/* {showUpgrade && <Upgrade />} */}
    </div>
  );
};

const Free = ({ showUpgrade = true, referenceDate }) => {
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();

  const [labels, setLabels] = useState(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
  const [mlPerDay, setMlPerDay] = useState([1600, 1850, 2100, 2300, 2200, 2450, 1900]);

  const totalWeekMl = mlPerDay.reduce((sum, v) => sum + v, 0);
  const avgMl = Math.round(totalWeekMl / (mlPerDay.length || 1));
  const maxMl = mlPerDay.length ? Math.max(...mlPerDay) : 0;
  const minMl = mlPerDay.length ? Math.min(...mlPerDay) : 0;

  const goal = 2000;
  const toPercent = (ml) => Math.max(0, Math.min(100, Math.round((ml / goal) * 100)));

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchDailyWater = async () => {
      try {
        const ref =
          referenceDate && referenceDate.toISOString
            ? referenceDate.toISOString()
            : undefined;
        const response = await api.get("/trend/water/dailyMl", {
          params: { userId: auth.user.id, referenceDate: ref },
        });
        const payload = response.data?.data || response.data;
        if (payload?.days && payload?.mlPerDay) {
          setLabels(payload.days);
          setMlPerDay(payload.mlPerDay);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load water daily ml:", error);
      }
    };

    fetchDailyWater();
  }, [api, auth?.user?.id, referenceDate]);
  return (
    <div className="pl-[15px] pr-[15px]">
      <div className="bg-white rounded-[27px] p-[32px] shadow-md mb-[36px]">
        <div className="flex items-center justify-between">
          <div className="pl-[50px]">
            <div className="text-3xl font-medium text-[#4682B4]">
              {toPercent(avgMl)}
            </div>
            <div className="text-sm text-custom-12">Hydration Score</div>
          </div>
          <div className="text-sm text-[#4682B4] pr-[50px]">
            Weekly Avg: {avgMl}ml
          </div>
        </div>

        <div className="mt-4">
          <div className="h-2 bg-green-200 rounded-full relative">
            <div
              className="absolute left-0 top-0 h-2 bg-[#4682B4] rounded-full"
              style={{ width: "45%" }}
            />
            <div
              className="absolute left-[45%] top-0 h-2 bg-yellow-300 rounded-full"
              style={{ width: "30%" }}
            />
            <div
              className="absolute left-[75%] top-0 h-2 bg-rose-300 rounded-full"
              style={{ width: "25%" }}
            />
            <div className="absolute left-[44%] -top-2 w-3 h-3 rounded-full bg-white border-2 border-emerald-300" />
          </div>
        </div>
      </div>

      {/* daily intake */}
      <div className="text-base font-medium mb-5 text-primary">
        Daily Intake (ml)
      </div>
      <div className="bg-white rounded-[12px] shadow p-6 mb-[39px]">
        <Bar data={buildChartData(labels, mlPerDay)} options={options} plugins={[goalLine]} />
      </div>

      <div className="text-base font-medium mb-[9px] text-primary">
        Daily Intake Rate
      </div>
      <div className="bg-white rounded-[27px] shadow p-6 flex gap-8 justify-center mb-5">
        <CircleStat value={toPercent(avgMl)} label="Avg" color="#1d4ed8" />
        <CircleStat value={toPercent(maxMl)} label="Max" color="#1d4ed8" />
        <CircleStat value={toPercent(minMl)} label="Min" color="#7dd3fc" />
      </div>

      {showUpgrade && <Upgrade />}
    </div>
  );
};

export default Free;
