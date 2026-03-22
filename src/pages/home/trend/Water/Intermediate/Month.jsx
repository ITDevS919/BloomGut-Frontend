import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import Upgrade from "./Upgrade";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import {
  getTrendUrineWeeklyScore,
  getTrendWaterMonthlyTime,
  postTrendWaterMonthlyAdvice,
} from "@/api/http";
import Free from "../Free";
import Loader from "@/components/common/Loader";
ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend
);

const SESSION_NAMES = ["Morning", "Noon", "Afternoon", "Evening"];
const SESSION_COLORS = ["bg-[#B9E1ED]", "bg-[#8EC4D9]", "bg-[#7CB6CF]", "bg-[#5CA3C2]"];
const DEFAULT_TIPS = {
  Morning: ["Great morning hydration, boosts metabolism.", "Drink 250–300ml warm water within 30 min after waking."],
  Noon: ["Good midday hydration.", "Continue regular water intake throughout the day."],
  Afternoon: ["Afternoon hydration is adequate.", "Consider increasing intake during afternoon hours."],
  Evening: ["Evening hydration is adequate.", "Avoid large amounts within 10 min before bed."],
};

const Month = ({ showUpgrade = true, referenceDate }) => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();
  const [selectedSession, setSelectedSession] = useState("Morning");
  const [tipsLoading, setTipsLoading] = useState(false);
  const [loadingMonthlyTime, setLoadingMonthlyTime] = useState(false);
  const [monthlyAdvice, setMonthlyAdvice] = useState(null);
  const [monthlySummary, setMonthlySummary] = useState({
    totalMl: 0,
    avgDailyMl: 0,
  });
  const [bestTime, setBestTime] = useState({
    name: "Morning",
    description: "Best Hydration: 6–9 AM",
  });

  const [sessions, setSessions] = useState([
    {
      name: "Morning",
      percentage: 0,
      ml: 0,
      tips: [
        "Great morning hydration, boosts metabolism.",
        "Drink 250–300ml warm water within 30 min after waking.",
      ],
      color: "bg-[#B9E1ED]",
    },
    {
      name: "Noon",
      percentage: 0,
      ml: 0,
      tips: [
        "Good midday hydration.",
        "Continue regular water intake throughout the day.",
      ],
      color: "bg-[#8EC4D9]",
    },
    {
      name: "Afternoon",
      percentage: 0,
      ml: 0,
      tips: [
        "Afternoon hydration is adequate.",
        "Consider increasing intake during afternoon hours.",
      ],
      color: "bg-[#7CB6CF]",
    },
    {
      name: "Evening",
      percentage: 0,
      ml: 0,
      tips: [
        "Evening hydration is adequate.",
        "Avoid large amounts within 10 min before bed.",
      ],
      color: "bg-[#5CA3C2]",
    },
  ]);

  const [urineDailyVolumes, setUrineDailyVolumes] = useState([]);

  const currentSession =
    sessions.find((s) => s.name === selectedSession) || sessions[0];

  const total = monthlySummary.totalMl || 0;
  const segments = sessions.map((s) => s.percentage || 0);

  const data = {
    datasets: [
      {
        data: segments,
        backgroundColor: ["#D6EFFB", "#BFE3F8", "#A7D7F2", "#8BCBF0"],
        borderColor: "#FFFFFF",
        borderWidth: 3,
        cutout: "70%",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      datalabels: { display: false },
    },
  };

  useEffect(() => {
    if (!auth?.user?.id) return;

    let isCancelled = false;

    const fetchMonthlyTime = async () => {
      try {
        setLoadingMonthlyTime(true);
        const ref =
          referenceDate && referenceDate.toISOString
            ? referenceDate.toISOString()
            : undefined;
        const timezoneOffsetMinutes = new Date().getTimezoneOffset();
        const response = await getTrendWaterMonthlyTime(api, {
          params: { userId: auth.user.id, referenceDate: ref, timezoneOffsetMinutes },
        });
        const payload = response.data?.data || response.data;
        console.log("payload", payload);
        if (!payload) return;

        const updated = SESSION_NAMES.map((name, i) => ({
          name,
          percentage: {
            Morning: payload.morningPercent,
            Noon: payload.noonPercent,
            Afternoon: payload.afternoonPercent,
            Evening: payload.eveningPercent,
          }[name] ?? 0,
          ml: {
            Morning: payload.morningMl,
            Noon: payload.noonMl,
            Afternoon: payload.afternoonMl,
            Evening: payload.eveningMl,
          }[name] ?? 0,
          tips: DEFAULT_TIPS[name],
          color: SESSION_COLORS[i],
        }));

        setSessions(updated);

        const backendTotal =
          typeof payload.totalMl === "number"
            ? payload.totalMl
            : updated.reduce((sum, s) => sum + (s.ml || 0), 0);
        const backendAvgDaily =
          typeof payload.avgDailyMl === "number"
            ? payload.avgDailyMl
            : Math.round(backendTotal / 30);

        setMonthlySummary({
          totalMl: backendTotal,
          avgDailyMl: backendAvgDaily,
        });

        // Derive best time based on highest percentage as baseline
        if (updated.length) {
          const top = updated.reduce((max, s) =>
            (s.percentage || 0) > (max.percentage || 0) ? s : max
          );
          setBestTime({
            name: top.name,
            description: `Best hydration period: ${top.name}.`,
          });
        }

        setTipsLoading(true);
        try {
          const adviceRes = await postTrendWaterMonthlyAdvice(api, {
            morningMl: payload.morningMl ?? 0,
            noonMl: payload.noonMl ?? 0,
            afternoonMl: payload.afternoonMl ?? 0,
            eveningMl: payload.eveningMl ?? 0,
            totalMl: payload.totalMl ?? 0,
            avgDailyMl: payload.avgDailyMl ?? 0,
            morningPercent: payload.morningPercent ?? 0,
            noonPercent: payload.noonPercent ?? 0,
            afternoonPercent: payload.afternoonPercent ?? 0,
            eveningPercent: payload.eveningPercent ?? 0,
          });
          const adviceData = adviceRes.data?.data ?? adviceRes.data;
          setMonthlyAdvice(adviceData || null);

          const aiSessions = adviceData?.sessions;
          if (Array.isArray(aiSessions) && aiSessions.length > 0) {
            setSessions((prev) =>
              prev.map((s) => {
                const ai = aiSessions.find((a) => a && a.name === s.name);
                const tips =
                  Array.isArray(ai?.tips) && ai.tips.length > 0 ? ai.tips : s.tips;
                return { ...s, tips };
              })
            );
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("Failed to load monthly water advice:", err);
        } finally {
          if (!isCancelled) {
            setTipsLoading(false);
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load water monthly time distribution:", error);
      } finally {
        if (!isCancelled) {
          setLoadingMonthlyTime(false);
        }
      }
    };

    fetchMonthlyTime();

    return () => {
      isCancelled = true;
    };
  }, [api, auth?.user?.id, referenceDate]);

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchUrineMonthlyVolumes = async () => {
      try {
        const ref =
          referenceDate && referenceDate.toISOString
            ? referenceDate.toISOString()
            : undefined;
        const timezoneOffsetMinutes = new Date().getTimezoneOffset();
        const response = await getTrendUrineWeeklyScore(api, {
          params: { userId: auth.user.id, referenceDate: ref, timezoneOffsetMinutes },
        });
        const payload = response.data?.data || response.data;
        if (!Array.isArray(payload)) return;

        const aggregated = {};
        payload.forEach((item) => {
          const date = new Date(item.records?.createdAt || item.createdAt);
          const day = date.getDate();
          const key = `${day}`;
          const volume = item.records?.estimatedTimeVolumeMl || 0;
          aggregated[key] = (aggregated[key] || 0) + volume;
        });

        const days = Object.keys(aggregated)
          .map((d) => parseInt(d, 10))
          .sort((a, b) => a - b);

        const series = days.map((day) => ({
          day,
          label: `${day}th`,
          volume: aggregated[day] || 0,
        }));

        setUrineDailyVolumes(series);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load urine monthly volumes:", error);
      }
    };

    fetchUrineMonthlyVolumes();
  }, [api, auth?.user?.id, referenceDate]);

  const urineLabels = useMemo(
    () =>
      urineDailyVolumes.length
        ? urineDailyVolumes.map((d) => d.label)
        : [
          "1st",
          "3rd",
          "5th",
          "7th",
          "9th",
          "11th",
          "13th",
          "15th",
          "17th",
          "19th",
          "21st",
          "23rd",
          "25th",
          "27th",
          "29th",
          "31st",
        ],
    [urineDailyVolumes]
  );

  const urineValues = useMemo(
    () =>
      urineDailyVolumes.length
        ? urineDailyVolumes.map((d) => d.volume)
        : [
          2300, 1900, 2100, 1800, 1200, 1100, 1300, 1600, 1500, 1800, 2000,
          1850, 2100, 3000, 3300, 3600,
        ],
    [urineDailyVolumes]
  );

  const urineChartData = {
    labels: urineLabels,
    datasets: [
      {
        label: "Urine Volume",
        data: urineValues,
        borderColor: "#FACC15",
        backgroundColor: "rgba(250, 204, 21, 0.35)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const urineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw} ml`,
        },
      },
      datalabels: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
      y: {
        min: 0,
        max: 3600,
        ticks: {
          stepSize: 900,
          font: { size: 11 },
        },
        grid: {
          color: "white",
          borderDash: [4, 4],
        },
      },
    },
  };

  return (
    <div className="mt-[36px]">
      <Free showUpgrade={false} />
      <div className="pl-[20px] text-base font-medium mb-[10px] text-primary">
        Water Intake Chart
      </div>
      <div className="p-4">
        <div className="w-full max-w-md space-y-4">
          {/* Donut Card */}
          <div className="relative rounded-[27.44px] bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.15)] mb-[28px]">
            <div className="relative mx-auto h-52 w-52">
              <Doughnut data={data} options={options} />

              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">{total}</span>
                <span className="text-sm text-gray-500">ml</span>
              </div>
            </div>

            {loadingMonthlyTime && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                <Loader />
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              title="Monthly"
              value={`${total} ml`}
              sub={`Daily Avg: ${monthlySummary.avgDailyMl || 0} ml`}
            />
            <StatCard
              title="Rate"
              value={
                monthlyAdvice?.changePercent != null
                  ? `${monthlyAdvice.changePercent > 0 ? "+" : ""}${monthlyAdvice.changePercent
                  }%`
                  : "-"
              }
              sub={
                monthlyAdvice?.changePercent != null
                  ? `${100 + monthlyAdvice.changePercent}% of Last Month`
                  : "+0% vs Last Month"
              }
            />
            <StatCard
              title="Best Time"
              value={bestTime.name}
              sub={bestTime.description}
            />
          </div>
        </div>

        {/* Water Intake Sessions */}
        <div className="w-full max-w-md mt-8 shadow-[0_2px_4px_rgba(0,0,0,0.15)] rounded-[27px] bg-white p-5 space-y-4">
          {/* Main Session Card */}
          <div className="rounded-[12px] bg-[#eff6ff] p-5 shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#b9e1ed]"></div>
                <h3 className="text-base font-medium text-primary">{currentSession.name} Session</h3>
              </div>
              <span className="text-xs font-medium text-secondary">
                {currentSession.ml}ml ({currentSession.percentage}%)
              </span>
            </div>
            <div className="space-y-1">
              {tipsLoading ? (
                <div className="flex items-center justify-center py-2">
                  <Loader />
                </div>
              ) : (
                (currentSession.tips || []).map((tip, index) => (
                  <p key={index} className="text-sm text-[#3c74ed]">
                    {tip}
                  </p>
                ))
              )}
            </div>
          </div>

          {/* Session Overview */}
          <div className="grid grid-cols-2 gap-2">
            {sessions.map((session) => (
              <button
                key={session.name}
                onClick={() => setSelectedSession(session.name)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm ${selectedSession === session.name
                  ? "bg-[#eff6ff] text-secondary"
                  : "bg-transparent text-secondary"
                  }`}
              >
                <div
                  className={`w-2 h-2 rounded-full
                     ${session.color}
                }`}
                ></div>
                <span>
                  {session.name}: {session.percentage}%
                </span>
              </button>
            ))}
          </div>

          {/* Call to Action */}
          <p className="text-center text-xs text-custom-12">
            Tap a section for details
          </p>
        </div>
      </div>
      {/* <Upgrade /> */}
      {showUpgrade && <Upgrade />}

      <div className="flex items-center justify-center mb-[47px] mt-[20px]">
        <button
          className="flex items-center justify-center bg-white rounded-[8px] px-6 py-2 text-lg text-secondary"
          onClick={() => navigate("/trend-analysis?plan=premium", { state: { trendType: "water" } })}
        >
          In-depth Analysis
        </button>
      </div>
    </div>
  );
};

function StatCard({ title, value, sub }) {
  return (
    <div className="rounded-[10px] bg-white p-3 text-center shadow-[2px_0_10px_rgba(0,0,0,0.15)]">
      <p className="text-sm text-secondary">{title}</p>
      <p className="mt-1 text-base font-semibold text-[#4682b4]">{value}</p>
      <p className="mt-1 text-xs text-custom-12">{sub}</p>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`h-3 w-3 rounded ${color}`} />
      <span>{label}</span>
    </div>
  );
}

export default Month;