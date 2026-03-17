import { Suspense, lazy, useEffect, useState } from "react";
import Upgrade from "./Upgrade";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import Loader from "@/components/common/Loader";

const WATER_PRIMARY_COLOR = "#4682B4";

const getScorePosition = (score) =>
  Math.max(0, Math.min(100, Math.round(typeof score === "number" ? score : 0)));

const getIndicatorColor = (value) => {
  if (value >= 81) return WATER_PRIMARY_COLOR;
  if (value >= 61) return "#FBC02D"; // Yellow segment (61–80)
  return "#F66B6B"; // Red segment (0–60)
};

// Lazy‑load heavy Chart.js / react-chartjs-2 charts
const WaterBarChart = lazy(() =>
  import("./WaterCharts").then((mod) => ({ default: mod.WaterBarChart }))
);
const WaterCircleStat = lazy(() =>
  import("./WaterCharts").then((mod) => ({ default: mod.WaterCircleStat }))
);

const goalLine = {
  id: "goalLine",
  afterDatasetsDraw(chart) {
    const {
      ctx,
      chartArea: { left, right, top },
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
    ctx.textBaseline = "bottom";

    const labelY = Math.max(top + 14, yPos - 4);
    ctx.fillText("Goal: 2000ml", left + 6, labelY);
    ctx.restore();
  },
};

const options = {
  responsive: true,
  layout: {
    padding: {
      top: 24,
      right: 8,
      left: 8,
      bottom: 8,
    },
  },
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

const Free = ({ showUpgrade = true, referenceDate }) => {
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();

  const [labels, setLabels] = useState(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
  const [mlPerDay, setMlPerDay] = useState([1600, 1850, 2100, 2300, 2200, 2450, 1900]);
  const [score, setScore] = useState(null);
  const [status, setStatus] = useState("Good");
  const [change, setChange] = useState("+0% vs Last");

  const [loadingDailyMl, setLoadingDailyMl] = useState(false);
  const [loadingWeeklySummary, setLoadingWeeklySummary] = useState(false);

  const goal = 2000;
  const toPercentRaw = (ml) => Math.round((ml / goal) * 100);
  const toPercent = (ml, { cap = true } = {}) => {
    const raw = toPercentRaw(ml);
    if (!cap) return Math.max(0, raw);
    return Math.max(0, Math.min(100, raw));
  };

  const dayPercents = mlPerDay.map((ml) => toPercent(ml, { cap: false }));
  const totalWeekPercent = dayPercents.reduce((sum, v) => sum + v, 0);
  const avgPercent = dayPercents.length
    ? Math.round(totalWeekPercent / dayPercents.length)
    : 0;
  const maxPercent = dayPercents.length ? Math.max(...dayPercents) : 0;
  const minPercent = dayPercents.length ? Math.min(...dayPercents) : 0;

  useEffect(() => {
    if (!auth?.user?.id) return;

    let isCancelled = false;

    const fetchDailyWater = async () => {
      try {
        const ref =
          referenceDate && referenceDate.toISOString
            ? referenceDate.toISOString()
            : undefined;
        const timezoneOffsetMinutes = new Date().getTimezoneOffset();
        const response = await api.get("/trend/water/dailyMl", {
          params: { userId: auth.user.id, referenceDate: ref, timezoneOffsetMinutes },
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
      } finally {
        if (!isCancelled) {
          setLoadingDailyMl(false);
        }
      }
    };

    const fetchWeeklySummary = async () => {
      try {
        const ref =
          referenceDate && referenceDate.toISOString
            ? referenceDate.toISOString()
            : undefined;
        const timezoneOffsetMinutes = new Date().getTimezoneOffset();

        const response = await api.get("/trend/water/weeklySummary", {
          params: {
            userId: auth.user.id,
            referenceDate: ref,
            timezoneOffsetMinutes,
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
          setStatus(payload.status);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load water weekly summary:", error);
      } finally {
        if (!isCancelled) {
          setLoadingWeeklySummary(false);
        }
      }
    };

    const loadAll = async () => {
      setLoadingDailyMl(true);
      setLoadingWeeklySummary(true);
      await Promise.all([fetchDailyWater(), fetchWeeklySummary()]);
    };

    loadAll();

    return () => {
      isCancelled = true;
    };
  }, [api, auth?.user?.id, referenceDate]);
  const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayWeekIndex = new Date().getDay();
  const todayLabel = weekLabels[todayWeekIndex];
  const todayIndex = labels.indexOf(todayLabel);
  const todayMl =
    todayIndex >= 0 && Array.isArray(mlPerDay) ? Number(mlPerDay[todayIndex] || 0) : 0;

  const yesterdayWeekIndex = (todayWeekIndex + 6) % 7;
  const yesterdayLabel = weekLabels[yesterdayWeekIndex];
  const yesterdayIndex = labels.indexOf(yesterdayLabel);
  const yesterdayMl =
    yesterdayIndex >= 0 && Array.isArray(mlPerDay) ? Number(mlPerDay[yesterdayIndex] || 0) : 0;

  const hasTodayWaterRecord = todayMl > 0;
  const todayScore = toPercent(todayMl);

  const getTodayStatus = (ml, percent) => {
    if (!hasTodayWaterRecord) return "Not Recorded";
    if (ml < goal * 0.6) return "Too Low";
    if (ml <= goal * 1.2) return "Good";
    return "Too High";
  };

  const effectiveScore = hasTodayWaterRecord ? todayScore : 0;
  const effectiveStatus = getTodayStatus(todayMl, todayScore);
  const changeVsYesterday =
    hasTodayWaterRecord && yesterdayMl > 0
      ? Math.round(((todayMl - yesterdayMl) / yesterdayMl) * 100)
      : null;
  const effectiveChange =
    changeVsYesterday !== null ? `${changeVsYesterday >= 0 ? "+" : ""}${changeVsYesterday}% vs Last` : "";
  const scorePosition = getScorePosition(effectiveScore);

  const loadingStats = loadingDailyMl || loadingWeeklySummary;

  return (
    <main className="pl-[15px] pr-[15px]">
      <div className="bg-white rounded-[27px] p-[32px] shadow-md mb-[36px] relative">
        <div className="flex items-center justify-between">
          <div className="pl-[50px]">
            <div className="text-3xl font-medium text-[#4682B4] text-center">
              {effectiveScore}
            </div>
            <div className="text-sm text-custom-12 text-center">
              {effectiveStatus}
            </div>
          </div>
          <div className="text-sm text-[#4682B4] pr-[50px] text-right">
            {effectiveChange && <div>{effectiveChange}</div>}
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

        {loadingWeeklySummary && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Loader />
          </div>
        )}
      </div>

      {/* daily intake */}
      <div className="text-base font-medium mb-5 text-primary">
        Daily Intake (ml)
      </div>
      <div className="bg-white rounded-[12px] shadow p-6 mb-[39px] relative">
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
              <Loader />
            </div>
          }
        >
          <WaterBarChart
            data={buildChartData(labels, mlPerDay)}
            options={options}
            plugins={[goalLine]}
            loading={loadingDailyMl}
            Loader={Loader}
          />
        </Suspense>
      </div>

      <div className="text-base font-medium mb-[9px] text-primary">
        Daily Intake Rate
      </div>
      <div className="bg-white rounded-[27px] shadow p-6 flex gap-8 justify-center mb-5 relative">
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
              <Loader />
            </div>
          }
        >
          <WaterCircleStat value={avgPercent} label="Avg" color="#1d4ed8" />
          <WaterCircleStat value={maxPercent} label="Max" color="#1d4ed8" />
          <WaterCircleStat value={minPercent} label="Min" color="#7dd3fc" />
        </Suspense>

        {loadingStats && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Loader />
          </div>
        )}
      </div>

      {showUpgrade && <Upgrade />}
    </main>
  );
};

export default Free;
