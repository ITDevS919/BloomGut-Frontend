import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Info } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import {
  getTrendUrineCompareWeeklyScore,
  getTrendUrineWeeklyScore,
  getTrendWaterDailyMl,
  postTrendUrineHealthTips,
} from "@/api/http";
import TrendInsufficientNotice from "@/components/trend/TrendInsufficientNotice";
import Loader from "@/components/common/Loader";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const Week = ({ referenceDate }) => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();

  const [showAnalysis, setShowAnalysis] = useState(false);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Weekly urine health summary + AI tips
  const [intakePerDay, setIntakePerDay] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [dotData, setDotData] = useState([]);
  const [clarityRate, setClarityRate] = useState(0);
  const [clearCount, setClearCount] = useState(0);
  const [yellowCount, setYellowCount] = useState(0);
  const [abnormalCount, setAbnormalCount] = useState(0);
  const [weekScore, setWeekScore] = useState(0);
  const [beforeWeekScore, setBeforeWeekScore] = useState(0);
  const [healthTips, setHealthTips] = useState([]);
  const [healthTipsLoading, setHealthTipsLoading] = useState(false);
  const [dotsLoading, setDotsLoading] = useState(false);
  const [intakeLoading, setIntakeLoading] = useState(false);
  const [urineEnough, setUrineEnough] = useState(false);
  const [waterEnough, setWaterEnough] = useState(false);

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchWeeklyDots = async () => {
      setDotsLoading(true);
      try {
        const response = await getTrendUrineWeeklyScore(api, {
          params: {
            userId: auth.user.id,
            referenceDate: referenceDate ? referenceDate.toISOString() : undefined,
          },
        });
        const payload = response.data?.data || response.data;
        if (!payload) return;
        const enough = payload.is_enough_data === true;
        setUrineEnough(enough);
        const rows = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.series)
            ? payload.series
            : [];
        if (!enough) {
          setDotData([]);
          setClearCount(0);
          setYellowCount(0);
          setAbnormalCount(0);
          setClarityRate(0);
          return;
        }

        const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        // Initialize with 0 clarity for all days; DB data will override when present.
        const baseDots = dayLabels.map((d) => ({
          day: d,
          status: "clear",
          score: 0,
        }));

        rows.forEach((item) => {
          const jsDay = typeof item.day === "number" ? item.day : 0; // 0–6
          if (jsDay < 0 || jsDay > 6) return;
          const status =
            item.score >= 66 ? "clear" : item.score >= 33 ? "yellow" : "abnormal";
          baseDots[jsDay] = {
            day: dayLabels[jsDay],
            status,
            score: item.score,
          };
        });

        let clarity = 0;
        let clear = 0;
        let yellow = 0;
        let abnormal = 0;

        baseDots.forEach((item) => {
          clarity += item.score;
          if (item.status === "clear") clear += 1;
          else if (item.status === "yellow") yellow += 1;
          else abnormal += 1;
        });

        setClearCount(clear);
        setYellowCount(yellow);
        setAbnormalCount(abnormal);

        const maxTotal = baseDots.length * 100 || 1;
        setClarityRate(Math.round((clarity / maxTotal) * 100));
        setDotData(baseDots);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to load urine weekly dots:", err);
      } finally {
        setDotsLoading(false);
      }
    };

    fetchWeeklyDots();
  }, [api, auth?.user?.id, referenceDate]);

  // Fetch total water intake per day for the same week
  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchWaterIntake = async () => {
      setIntakeLoading(true);
      try {
        const response = await getTrendWaterDailyMl(api, {
          params: {
            userId: auth.user.id,
            referenceDate: referenceDate ? referenceDate.toISOString() : undefined,
          },
        });
        const payload = response.data?.data || response.data;
        setWaterEnough(payload?.is_enough_data === true);
        if (!payload?.days || !payload?.mlPerDay) return;

        const map = {};
        payload.days.forEach((dayLabel, idx) => {
          map[dayLabel] = payload.mlPerDay[idx] || 0;
        });

        const order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        setIntakePerDay(order.map((d) => map[d] ?? 0));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to load weekly water intake for urine premium view:", err);
        setIntakePerDay([0, 0, 0, 0, 0, 0, 0]);
      } finally {
        setIntakeLoading(false);
      }
    };

    fetchWaterIntake();
  }, [api, auth?.user?.id, referenceDate]);

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchWeeklyScores = async () => {
      try {
        const response = await getTrendUrineCompareWeeklyScore(api, {
          params: {
            userId: auth.user.id,
            referenceDate: referenceDate ? referenceDate.toISOString() : undefined,
          },
        });
        const payload = response.data?.data || response.data;
        if (!payload) return;
        setBeforeWeekScore(payload.beforeWeekScore ?? 0);
        setWeekScore(payload.weekScore ?? 0);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to load urine weekly scores:", err);
      }
    };

    fetchWeeklyScores();
  }, [api, auth?.user?.id, referenceDate]);

  useEffect(() => {
    if (!auth?.user?.id || dotData.length === 0 || !urineEnough) return;

    const fetchHealthTips = async () => {
      setHealthTipsLoading(true);
      try {
        const response = await postTrendUrineHealthTips(api, {
          clarityRate,
          clearCount,
          yellowCount,
          abnormalCount,
          weekScore,
          beforeWeekScore,
          dailyStatuses: dotData.map((d) => ({
            day: d.day,
            status: d.status,
            score: d.score,
          })),
        });
        const payload = response.data?.data ?? response.data;
        const tips = Array.isArray(payload?.tips) ? payload.tips : [];
        setHealthTips(tips);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to load urine health tips:", err);
        setHealthTips([]);
      } finally {
        setHealthTipsLoading(false);
      }
    };

    fetchHealthTips();
  }, [
    api,
    auth?.user?.id,
    clarityRate,
    clearCount,
    yellowCount,
    abnormalCount,
    weekScore,
    beforeWeekScore,
    dotData,
    urineEnough,
  ]);

  const chartIntake = useMemo(
    () =>
      intakePerDay && intakePerDay.length === 7
        ? intakePerDay
        : [0, 0, 0, 0, 0, 0, 0],
    [intakePerDay]
  );

  const chartClarity = useMemo(() => {
    if (!dotData.length) {
      return [0, 0, 0, 0, 0, 0, 0];
    }
    const order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return order.map((label) => {
      const d = dotData.find((item) => item.day === label);
      return d ? d.score : 0; // 0–100 clarity/score
    });
  }, [dotData]);

  const avgIntake = useMemo(
    () =>
      chartIntake.length
        ? Math.round(chartIntake.reduce((sum, v) => sum + v, 0) / chartIntake.length)
        : 0,
    [chartIntake]
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Intake (ml)",
        data: chartIntake,
        borderColor: "#3B82F6",
        backgroundColor: "#3B82F6",
        yAxisID: "y",
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: "Clarity (%)",
        data: chartClarity,
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
  const chartLoading = dotsLoading || intakeLoading;
  const chartDisabled = !urineEnough || !waterEnough;
  return (
    <div className="pl-[15px] pr-[15px] mt-[38px]">
      <div className="text-base font-medium pl-[15px] mb-[10px] text-primary">Water and Urine Analysis</div>
      <div className="w-full rounded-[20px] bg-white p-5 shadow-md space-y-4">
        {!chartLoading && !urineEnough && <TrendInsufficientNotice />}
        {/* Chart */}
        <div
          className={`h-48 ${!chartLoading && chartDisabled ? "opacity-40 grayscale pointer-events-none" : ""}`}
        >
          {chartLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
              <Loader />
            </div>
          ) : (
            <Line data={data} options={options} />
          )}
        </div>

        {/* Legend row (extra markers like image) */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex gap-4">
            <LegendDot color="bg-red-400" label="Anomalies" />
            <LegendDot color="bg-blue-400" label="Normal" />
          </div>
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="text-blue-500 text-xs"
          >
            {showAnalysis ? "Hide Analysis" : "View Analysis"}
          </button>
        </div>

        {/* Monthly Summary */}
        {showAnalysis && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Info className="h-[24px] w-[24px] text-blue-500" />
              <h3 className="text-base font-medium text-primary">
                Monthly Summary
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-y-2 text-sm text-secondary mb-[27px]">
              <span>Avg Intake:</span>
              <span className="text-right">{avgIntake} ml</span>
              <span>Clarity:</span>
              <span className="text-right">{clarityRate}%</span>
              <span>Drop Days:</span>
              <span className="text-right">
                {yellowCount + abnormalCount}
              </span>
              <span>Hydration:</span>
              <span className="text-right">
                {weekScore ? `${Math.round(weekScore)} pts` : "-"}
              </span>
            </div>
            {/* Weekly Insights (AI) */}
            <div className="rounded-[14px] bg-[#fefce8] p-4 text-sm text-primary">
              <p className="font-medium mb-1">Weekly Insights</p>
              {healthTipsLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                  <Loader />
                </div>
              ) : healthTips.length > 0 ? (
                <ul className="list-disc pl-4 space-y-1 text-secondary text-xs">
                  {healthTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-secondary text-xs">
                  Insights will appear here based on your weekly urine pattern.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center text-gray-400 italic text-sm mt-5 mb-[32px]">
        For reference only. Consult a doctor if needed.
      </div>

      <div className="flex items-center justify-center mt-[27px] mb-[27px]">
        <button
          className="flex items-center justify-center bg-white rounded-[8px] px-6 py-2 text-lg text-secondary shadow-md"
          onClick={() =>
            navigate("/trend-analysis?plan=premium", { state: { trendType: "urine", viewMode: "month" } })
          }
        >
          OverView
        </button>
      </div>
    </div>

  );
};

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span className="text-xs font-['Aleo'] text-primary">{label}</span>
    </div>
  );
}

export default Week;
