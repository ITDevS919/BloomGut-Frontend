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

const WATER_PRIMARY_COLOR = "#4682B4";

const getScorePosition = (score) =>
  Math.max(0, Math.min(100, Math.round(typeof score === "number" ? score : 0)));

const getIndicatorColor = (value) => {
  if (value >= 81) return WATER_PRIMARY_COLOR;
  if (value >= 61) return "#FBC02D"; // Yellow segment (61–80)
  return "#F66B6B"; // Red segment (0–60)
};

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

  const [isLoading, setIsLoading] = useState(true);

  const [labels, setLabels] = useState(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
  const [mlPerDay, setMlPerDay] = useState([1600, 1850, 2100, 2300, 2200, 2450, 1900]);
  const [score, setScore] = useState(null);
  const [status, setStatus] = useState("Good");
  const [change, setChange] = useState("+0% vs Last");

  const totalWeekMl = mlPerDay.reduce((sum, v) => sum + v, 0);
  const avgMl = Math.round(totalWeekMl / (mlPerDay.length || 1));
  const maxMl = mlPerDay.length ? Math.max(...mlPerDay) : 0;
  const minMl = mlPerDay.length ? Math.min(...mlPerDay) : 0;

  const goal = 2000;
  const toPercent = (ml) => Math.max(0, Math.min(100, Math.round((ml / goal) * 100)));

  useEffect(() => {
    if (!auth?.user?.id) return;

    let isCancelled = false;

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
          if (!isCancelled) {
            setLabels(payload.days);
            setMlPerDay(payload.mlPerDay);
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load water daily ml:", error);
      }
    };

    const fetchWeeklySummary = async () => {
      try {
        const ref =
          referenceDate && referenceDate.toISOString
            ? referenceDate.toISOString()
            : undefined;

        const response = await api.get("/trend/water/weeklySummary", {
          params: {
            userId: auth.user.id,
            referenceDate: ref,
          },
        });

        const payload = response.data?.data || response.data;
        if (!payload) return;

        if (typeof payload.score === "number") {
          const rounded = Math.round(payload.score);
          if (!isCancelled) {
            setScore(rounded);
          }
        }

        if (typeof payload.changePercent === "number") {
          const sign = payload.changePercent > 0 ? "+" : "";
          const text = `${sign}${payload.changePercent}% vs Last`;
          if (!isCancelled) {
            setChange(text);
          }
        }

        if (payload.status && !isCancelled) {
          console.log("payload.status", payload.status);
          setStatus(payload.status);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load water weekly summary:", error);
      }
    };

    const loadAll = async () => {
      setIsLoading(true);
      await Promise.all([fetchDailyWater(), fetchWeeklySummary()]);
      if (!isCancelled) {
        setIsLoading(false);
      }
    };

    loadAll();

    return () => {
      isCancelled = true;
    };
  }, [api, auth?.user?.id, referenceDate]);
  const hydrationScore = toPercent(avgMl);
  const effectiveScore = typeof score === "number" ? score : hydrationScore;
  const scorePosition = getScorePosition(effectiveScore);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 border-4 border-[#D6EAF8] border-t-[#79b6e2] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pl-[15px] pr-[15px]">
      <div className="bg-white rounded-[27px] p-[32px] shadow-md mb-[36px]">
        <div className="flex items-center justify-between">
          <div className="pl-[50px]">
            <div className="text-3xl font-medium text-[#4682B4] text-center">
              {effectiveScore}
            </div>
            <div className="text-sm text-custom-12 text-center">
              {status || "Hydration Score"}
            </div>
          </div>
          <div className="text-sm text-[#4682B4] pr-[50px] text-right">
            {change && <div>{change}</div>}
          </div>
        </div>

        {/* Progress Bar (Health Score) */}
        <div className="mt-4">
          <div
            className="h-2 rounded-full relative overflow-hidden"
            style={{
              background: `linear-gradient(to right,
                ${WATER_PRIMARY_COLOR} 0%,
                ${WATER_PRIMARY_COLOR} 60%,
                #FBC02D 60%,
                #FBC02D 80%,
                #F66B6B 80%,
                #F66B6B 100%)`,
            }}
          >
            {/* Indicator (outer ring + inner fill) */}
            <div
              className="absolute -top-2.5 w-5 h-5 rounded-full border border-[#9E9E9E] bg-white flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
              style={{
                left: `${scorePosition}%`,
                transform: "translateX(-50%)",
              }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: getIndicatorColor(scorePosition) }}
              />
            </div>
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
