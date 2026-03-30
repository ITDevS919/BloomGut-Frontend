import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import Upgrade from "./Upgrade";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import { getTrendWaterMonthlyTime, postTrendWaterMonthlyAdvice } from "@/api/http";
import Free from "../Free";
import Loader from "@/components/common/Loader";
import TrendInsufficientNotice from "@/components/trend/TrendInsufficientNotice";

ChartJS.register(ArcElement, Tooltip, Legend);

const SESSION_NAMES = ["Morning", "Noon", "Afternoon", "Evening"];
const SESSION_COLORS = ["bg-[#B9E1ED]", "bg-[#8EC4D9]", "bg-[#7CB6CF]", "bg-[#5CA3C2]"];

const emptySessions = () =>
  SESSION_NAMES.map((name, i) => ({
    name,
    percentage: 0,
    ml: 0,
    tips: [],
    color: SESSION_COLORS[i],
  }));

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
  const [isEnoughData, setIsEnoughData] = useState(false);
  const [bestTime, setBestTime] = useState({
    name: "—",
    description: "—",
  });

  const [sessions, setSessions] = useState(emptySessions);

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
        if (!payload) return;

        const enough = payload.is_enough_data === true;
        setIsEnoughData(enough);

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
          tips: [],
          color: SESSION_COLORS[i],
        }));

        setSessions(enough ? updated : emptySessions());

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

        if (!enough) {
          setBestTime({ name: "—", description: "—" });
          setMonthlyAdvice(null);
          setTipsLoading(false);
        } else if (updated.length) {
          const top = updated.reduce((max, s) =>
            (s.percentage || 0) > (max.percentage || 0) ? s : max
          );
          setBestTime({
            name: top.name,
            description: `Best hydration period: ${top.name}.`,
          });

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
                    Array.isArray(ai?.tips) && ai.tips.length > 0 ? ai.tips : [];
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

  return (
    <div className="mt-[36px]">
      <Free showUpgrade={false} />
      <div className="pl-[20px] text-base font-medium mb-[10px] text-primary">
        Water Intake Chart
      </div>
      <div className="p-4">
        {!isEnoughData && !loadingMonthlyTime && (
          <TrendInsufficientNotice className="mb-3 max-w-md" />
        )}
        <div
          className={`w-full max-w-md space-y-4 ${!isEnoughData ? "opacity-50 grayscale pointer-events-none" : ""}`}
        >
          {/* Donut Card — no chart series when below month threshold */}
          <div className="relative rounded-[27.44px] bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.15)] mb-[28px]">
            <div
              className={`relative mx-auto h-52 w-52 ${!isEnoughData ? "flex items-center justify-center rounded-full border border-dashed border-gray-200 bg-gray-50/80" : ""}`}
            >
              {isEnoughData ? (
                <>
                  <Doughnut data={data} options={options} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-800">{total}</span>
                    <span className="text-sm text-gray-500">ml</span>
                  </div>
                </>
              ) : (
                <span className="text-2xl text-gray-300 select-none" aria-hidden>
                  —
                </span>
              )}
            </div>

            {loadingMonthlyTime && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
                <Loader />
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              title="Monthly"
              value={isEnoughData ? `${total} ml` : "—"}
              sub={isEnoughData ? `Daily Avg: ${monthlySummary.avgDailyMl || 0} ml` : "—"}
            />
            <StatCard
              title="Rate"
              value={
                !isEnoughData
                  ? "—"
                  : monthlyAdvice?.changePercent != null
                    ? `${monthlyAdvice.changePercent > 0 ? "+" : ""}${monthlyAdvice.changePercent}%`
                    : "—"
              }
              sub={
                !isEnoughData
                  ? "—"
                  : monthlyAdvice?.changePercent != null
                    ? `${100 + monthlyAdvice.changePercent}% of Last Month`
                    : "—"
              }
            />
            <StatCard
              title="Best Time"
              value={isEnoughData ? bestTime.name : "—"}
              sub={isEnoughData ? bestTime.description : "—"}
            />
          </div>
        </div>

        {/* Water Intake Sessions */}
        <div
          className={`w-full max-w-md mt-8 shadow-[0_2px_4px_rgba(0,0,0,0.15)] rounded-[27px] bg-white p-5 space-y-4 ${!isEnoughData ? "opacity-50 grayscale pointer-events-none" : ""}`}
        >
          {/* Main Session Card */}
          <div className="rounded-[12px] bg-[#eff6ff] p-5 shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#b9e1ed]"></div>
                <h3 className="text-base font-medium text-primary">{currentSession.name} Session</h3>
              </div>
              <span className="text-xs font-medium text-secondary">
                {isEnoughData
                  ? `${currentSession.ml}ml (${currentSession.percentage}%)`
                  : "—"}
              </span>
            </div>
            <div className="space-y-1">
              {!isEnoughData ? null : tipsLoading ? (
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
                  {session.name}: {isEnoughData ? `${session.percentage}%` : "—"}
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
          className="flex items-center justify-center bg-white rounded-[8px] px-6 py-2 text-lg text-secondary shadow-md"
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

export default Month;