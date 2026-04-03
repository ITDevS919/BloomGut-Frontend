import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { AlertTriangle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import { getTrendWaterWeeklyTime, postTrendWaterWeeklyAdvice } from "@/api/http";
import Upgrade from "./Upgrade";
import Free from "../Free";
import Loader from "@/components/common/Loader";
import { useLocation, useSearchParams } from "react-router-dom";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels
);

const Week = ({ showUpgrade = true, referenceDate }) => {
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();

  const [timeMl, setTimeMl] = useState({
    morningMl: 0,
    noonMl: 0,
    afternoonMl: 0,
    eveningMl: 0,
  });
  const [timePercent, setTimePercent] = useState({
    morningPercent: 0,
    noonPercent: 0,
    afternoonPercent: 0,
    eveningPercent: 0,
  });
  const [advice, setAdvice] = useState({ message: "", tip: "" });
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [loadingTime, setLoadingTime] = useState(false);

  useEffect(() => {
    if (!auth?.user?.id) return;

    let isCancelled = false;

    const fetchWeeklyTime = async () => {
      try {
        setLoadingTime(true);
        const ref =
          referenceDate && referenceDate.toISOString
            ? referenceDate.toISOString()
            : undefined;
        const timezoneOffsetMinutes = new Date().getTimezoneOffset();
        const response = await getTrendWaterWeeklyTime(api, {
          params: { userId: auth.user.id, referenceDate: ref, timezoneOffsetMinutes },
        });
        const payload = response.data?.data || response.data;
        if (!payload) return;

        setTimeMl({
          morningMl: payload.morningMl ?? 0,
          noonMl: payload.noonMl ?? 0,
          afternoonMl: payload.afternoonMl ?? 0,
          eveningMl: payload.eveningMl ?? 0,
        });
        setTimePercent({
          morningPercent: payload.morningPercent ?? 0,
          noonPercent: payload.noonPercent ?? 0,
          afternoonPercent: payload.afternoonPercent ?? 0,
          eveningPercent: payload.eveningPercent ?? 0,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load water weekly time distribution:", error);
      } finally {
        if (!isCancelled) {
          setLoadingTime(false);
        }
      }
    };

    fetchWeeklyTime();

    return () => {
      isCancelled = true;
    };
  }, [api, auth?.user?.id, referenceDate]);

  useEffect(() => {
    if (!auth?.user?.id) {
      setAdvice({ message: "", tip: "" });
      return;
    }

    const totalMl =
      timeMl.morningMl +
      timeMl.noonMl +
      timeMl.afternoonMl +
      timeMl.eveningMl;

    const fetchWeeklyAdvice = async () => {
      setAdviceLoading(true);
      try {
        const response = await postTrendWaterWeeklyAdvice(api, {
          morningMl: timeMl.morningMl,
          noonMl: timeMl.noonMl,
          afternoonMl: timeMl.afternoonMl,
          eveningMl: timeMl.eveningMl,
          totalMl,
          morningPercent: timePercent.morningPercent,
          noonPercent: timePercent.noonPercent,
          afternoonPercent: timePercent.afternoonPercent,
          eveningPercent: timePercent.eveningPercent,
        });
        const payload = response.data?.data ?? response.data;
        if (payload?.message != null || payload?.tip != null) {
          setAdvice({
            message: payload.message ?? "",
            tip: payload.tip ?? "",
          });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load water weekly advice:", error);
        setAdvice({ message: "", tip: "" });
      } finally {
        setAdviceLoading(false);
      }
    };

    fetchWeeklyAdvice();
  }, [
    api,
    auth?.user?.id,
    timeMl.morningMl,
    timeMl.noonMl,
    timeMl.afternoonMl,
    timeMl.eveningMl,
    timePercent.morningPercent,
    timePercent.noonPercent,
    timePercent.afternoonPercent,
    timePercent.eveningPercent,
  ]);

  const timePeriods = useMemo(
    () => [
      {
        label: "Morning (6-12)",
        shortLabel: "Morning",
        value: timeMl.morningMl,
        percentage: timePercent.morningPercent,
        color: "#F87171",
      },
      {
        label: "Noon (12-15)",
        shortLabel: "Noon",
        value: timeMl.noonMl,
        percentage: timePercent.noonPercent,
        color: "#9ED5E1",
      },
      {
        label: "Afternoon (15-18)",
        shortLabel: "Afternoon",
        value: timeMl.afternoonMl,
        percentage: timePercent.afternoonPercent,
        color: "#F87171",
      },
      {
        label: "Evening (18-22)",
        shortLabel: "Evening",
        value: timeMl.eveningMl,
        percentage: timePercent.eveningPercent,
        color: "#7BCFA5",
      },
    ],
    [timeMl, timePercent]
  );

  const totalWeekMl = timeMl.morningMl + timeMl.noonMl + timeMl.afternoonMl + timeMl.eveningMl;
  const lowestPeriod = timePeriods.length
    ? timePeriods.reduce((min, p) => (p.percentage < min.percentage ? p : min))
    : null;
  const weeklyTargetMl = 7000;
  const balanceLabel =
    lowestPeriod && lowestPeriod.percentage < 20
      ? "Low"
      : totalWeekMl < weeklyTargetMl
        ? "Below target"
        : "Good";
  const balanceSub =
    lowestPeriod && lowestPeriod.percentage < 20
      ? `${lowestPeriod.shortLabel} low`
      : totalWeekMl < weeklyTargetMl
        ? "Increase daily intake"
        : "Well distributed";

  const data = {
    labels: timePeriods.map((t) => t.label),
    datasets: [
      {
        data: timePeriods.map((t) => t.percentage),
        backgroundColor: timePeriods.map((t) => t.color),
        borderRadius: 6,
        barThickness: 18,
      },
    ],
  };

  const maxValue = 100;
  const options = {
    indexAxis: "y", // Horizontal bars
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        anchor: "inner",
        align: "end",
        offset: 8,
        color: "#111827",
        font: {
          weight: "600",
          size: 12,
        },
        formatter: (value, context) => {
          const period = timePeriods[context.dataIndex];
          return `${period.value}ml (${period.percentage}%)`;
        },
      },
    },
    scales: {
      x: {
        min: 0,
        max: maxValue,
        ticks: {
          stepSize: 20,
          color: "#6b7280",
          callback: (value) => `${value}%`,
          font: {
            size: 11,
          },
        },
        grid: {
          color: "#E5E7EB",
          borderDash: [4, 4],
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 11,
          },
        },
      },
    },
  };


  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");
  const location = useLocation();
  const isSubscribed = location.state?.subscribed || false;

  return (
    <div className=" mt-[44px]">
      <Free showUpgrade={false} referenceDate={referenceDate} />
      <div className="pl-[20px] text-base font-medium text-primary mt-[40px]">
        Water Drinking Time
      </div>
      <div className="p-4">
        <div className="w-full max-w-md rounded-[27px] bg-white p-5 shadow-md mb-[68px] relative">
          {/* Info Block */}
          <div className="mb-4 rounded-[12px] bg-[#eff6ff] px-4 py-3 text-sm text-custom-12">
            Chart shows intake by time period to check balance. Concentrated
            drinking may cause constipation or night urination.
          </div>

          <div className="mb-4 h-48">
            <Bar data={data} options={options} />
          </div>

          <div className="mt-5 space-y-3 rounded-[8px] bg-yellow-50 p-4">
              <div className="flex items-center gap-2 text-sm text-gray-700 mb-[12px]">
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="text-secondary font-medium">Analysis & Advice</span>
              </div>
              {adviceLoading ? (
                <div className="flex items-center justify-center py-2">
                  <Loader />
                </div>
              ) : (
                <>
                  {advice.message && (
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="w-5 h-5 text-[#ffc92b] shrink-0" />
                      <span className="text-[#f57c00] text-xs">
                        {advice.message}
                      </span>
                    </div>
                  )}
                  {advice.tip && (
                    <div className="rounded-[8px] bg-[#fdfdfd] px-3 py-2 text-xs text-custom-19">
                      <span className="font-medium">Tip:</span> {advice.tip}
                    </div>
                  )}
                </>
              )}
            </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <StatCard
              title="Weekly Intake"
              value={`${totalWeekMl}ml`}
              sub={
                totalWeekMl < weeklyTargetMl
                  ? "Below Std."
                  : "On target"
              }
            />
            <StatCard2 title="Balance" value={balanceLabel} sub={balanceSub} />
          </div>

          <p className="mt-[22px] italic text-center text-xs text-custom-12">
            Tap period for tips & impacts.
          </p>

          {loadingTime && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
              <Loader />
            </div>
          )}
        </div>
        {plan !== "premium" && plan !== "pro" && !isSubscribed && <Upgrade />}
        {(plan === "premium" || plan === "pro" || isSubscribed) && (
          <div className="flex items-center justify-center mb-[47px]">
            <button
              className="flex items-center justify-center bg-white rounded-[8px] px-6 py-2 text-lg text-secondary shadow-md"
              onClick={() => navigate("/trend-admin?plan=premium", { state: { trendType: "water" } })}
            >
              In-depth Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

function StatCard({ title, value, sub }) {
  return (
    <div className="rounded-[10px] shadow-[2px_0_10px_rgba(0,0,0,0.15)] bg-white p-3 text-center">
      <p className="text-xs text-secondary mb-1">{title}</p>
      <p className="text-sm text-primary mb-1">{value}</p>
      <p className="text-xs text-[#3c74ed]">{sub}</p>
    </div>
  );
}

function StatCard2({ title, value, sub }) {
  return (
    <div className="rounded-[10px] shadow-[2px_0_10px_rgba(0,0,0,0.15)] bg-white p-3 text-center">
      <p className="text-xs text-secondary mb-1">{title}</p>
      <p className="text-sm text-[#3c74ed] mb-1">{value}</p>
      <p className="text-xs text-secondary">{sub}</p>
    </div>
  );
}

export default Week;
