import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

import { useEffect, useMemo, useState } from "react";
import { Line, Scatter } from "react-chartjs-2";
import { Info } from "lucide-react";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import {
  getTrendUrineMonthlyDailyVolume,
  getTrendWaterMonthlyDailyMl,
  postTrendUrineMonthlyAdvice,
} from "@/api/http";
import TrendInsufficientNotice from "@/components/trend/TrendInsufficientNotice";
import Loader from "@/components/common/Loader";

const Month = ({ referenceDate }) => {
  const [mode, setMode] = useState("line");
  const [showAnalysis, setShowAnalysis] = useState(false);

  const auth = useSelector((state) => state.auth);
  const api = useApiClient();

  const [dailyVolumes, setDailyVolumes] = useState([]);
  const [intakePerDay, setIntakePerDay] = useState([]);
  const [monthlyAdvice, setMonthlyAdvice] = useState(null);
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [urineLoading, setUrineLoading] = useState(false);
  const [intakeLoading, setIntakeLoading] = useState(false);
  const [urineEnough, setUrineEnough] = useState(false);

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchMonthlyVolumes = async () => {
      setUrineLoading(true);
      try {
        const response = await getTrendUrineMonthlyDailyVolume(api, {
          params: {
            userId: auth.user.id,
            referenceDate: referenceDate ? referenceDate.toISOString() : undefined,
          },
        });
        const payload = response.data?.data || response.data;
        if (!payload) return;
        setUrineEnough(payload.is_enough_data === true);
        if (!Array.isArray(payload.days) || !Array.isArray(payload.volumes)) {
          setDailyVolumes([]);
          return;
        }

        const getOrdinal = (day) => {
          if (day === 1 || day === 21 || day === 31) return `${day}st`;
          if (day === 2 || day === 22) return `${day}nd`;
          if (day === 3 || day === 23) return `${day}rd`;
          return `${day}th`;
        };

        const series = payload.days.map((day, idx) => {
          return {
            day,
            label: getOrdinal(day),
            volume: payload.volumes[idx] || 0,
          };
        });

        setDailyVolumes(series);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load urine monthly volumes (premium):", error);
      } finally {
        setUrineLoading(false);
      }
    };

    fetchMonthlyVolumes();
  }, [api, auth?.user?.id, referenceDate]);

  useEffect(() => {
    if (!auth?.user?.id || !referenceDate) return;

    const fetchMonthlyIntake = async () => {
      setIntakeLoading(true);
      try {
        const res = await getTrendWaterMonthlyDailyMl(api, {
          params: {
            userId: auth.user.id,
            referenceDate: referenceDate.toISOString(),
          },
        });
        const payload = res.data?.data ?? res.data;
        if (!payload || !Array.isArray(payload.mlPerDay)) return;
        setIntakePerDay(payload.mlPerDay);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load monthly water intake (premium):", error);
        setIntakePerDay([]);
      } finally {
        setIntakeLoading(false);
      }
    };

    fetchMonthlyIntake();
  }, [api, auth?.user?.id, referenceDate]);

  useEffect(() => {
    if (!auth?.user?.id || dailyVolumes.length === 0 || !urineEnough) return;

    const fetchMonthlyAdvice = async () => {
      setAdviceLoading(true);
      try {
        const total = dailyVolumes.reduce((s, d) => s + d.volume, 0);
        const avgVolume = dailyVolumes.length ? Math.round(total / dailyVolumes.length) : 0;
        const withVolume = dailyVolumes.map((d) => ({ day: d.day, volume: d.volume }));
        const highest = dailyVolumes.length
          ? dailyVolumes.reduce((a, b) => (a.volume >= b.volume ? a : b))
          : null;
        const lowest = dailyVolumes.length
          ? dailyVolumes.reduce((a, b) => (a.volume <= b.volume ? a : b))
          : null;
        let normalCount = 0;
        let lowCount = 0;
        let highCount = 0;
        dailyVolumes.forEach((d) => {
          if (d.volume >= 1200 && d.volume <= 2400) normalCount += 1;
          else if (d.volume < 1200) lowCount += 1;
          else highCount += 1;
        });

        const res = await postTrendUrineMonthlyAdvice(api, {
          dailyVolumes: withVolume,
          avgVolume,
          highestDay: highest?.day ?? null,
          highestVolume: highest?.volume ?? 0,
          lowestDay: lowest?.day ?? null,
          lowestVolume: lowest?.volume ?? 0,
          normalCount,
          lowCount,
          highCount,
          totalDays: dailyVolumes.length,
        });
        const data = res.data?.data ?? res.data;
        if (data) setMonthlyAdvice(data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to load monthly urine advice (premium):", err);
      } finally {
        setAdviceLoading(false);
      }
    };

    fetchMonthlyAdvice();
  }, [api, auth?.user?.id, dailyVolumes, urineEnough]);

  const labels = useMemo(
    () => (dailyVolumes.length ? dailyVolumes.map((d) => d.label) : []),
    [dailyVolumes]
  );

  const urine = useMemo(
    () => (dailyVolumes.length ? dailyVolumes.map((d) => d.volume) : []),
    [dailyVolumes]
  );

  const intake = useMemo(() => {
    if (intakePerDay.length) return intakePerDay;
    return urine.length ? urine.map(() => 0) : [];
  }, [intakePerDay, urine]);

  const avgUrine = useMemo(
    () =>
      urine.length ? Math.round(urine.reduce((sum, v) => sum + v, 0) / urine.length) : 0,
    [urine]
  );

  const avgIntake = useMemo(
    () =>
      intake.length
        ? Math.round(intake.reduce((sum, v) => sum + v, 0) / intake.length)
        : 0,
    [intake]
  );

  const abnormalCount = useMemo(
    () => urine.filter((v) => v < 1200 || v > 2400).length,
    [urine]
  );

  const lineData = {
    labels,
    datasets: [
      {
        label: "Urine (ml)",
        data: urine,
        borderColor: "#FACC15",
        backgroundColor: "#FACC15",
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: "Intake (ml)",
        data: intake,
        borderColor: "#38BDF8",
        backgroundColor: "#38BDF8",
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  const scatterData = {
    datasets: [
      {
        label: "Urine (ml)",
        data: urine.map((y, i) => ({ x: i + 1, y })),
        backgroundColor: "#FACC15",
      },
      {
        label: "Intake (ml)",
        data: intake.map((y, i) => ({ x: i + 1, y })),
        backgroundColor: "#38BDF8",
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
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} ml`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 3500,
        ticks: { stepSize: 900 },
        grid: { color: "#E5E7EB", borderDash: [4, 4] },
      },
      x: {
        grid: { display: false },
      },
    },
  };
  const chartLoading = urineLoading || intakeLoading;
  const statsLoading = chartLoading || adviceLoading;

  return (
    <div className="pl-[15px] pr-[15px] mt-[38px]">
      <div className="text-base font-medium pl-[15px] mb-[10px] text-primary">Water & Urine Analysis</div>
      <div className="w-full rounded-[20px] bg-white p-5 shadow-md space-y-4 mb-[33px]">
        {/* Tabs */}
        <div className="flex gap-3 items-center justify-center">
          <Tab active={mode === "line"} onClick={() => setMode("line")}>
            Double Line
          </Tab>
          <Tab active={mode === "scatter"} onClick={() => setMode("scatter")}>
            Scatter Plot
          </Tab>
        </div>

        {!chartLoading && !urineEnough && <TrendInsufficientNotice className="mb-2" />}

        {/* Chart */}
        <div
          className={`h-56 ${!chartLoading && !urineEnough ? "opacity-40 grayscale pointer-events-none" : ""}`}
        >
          {chartLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
              <Loader />
            </div>
          ) : mode === "line" ? (
            <Line data={lineData} options={options} />
          ) : (
            <Scatter data={scatterData} options={options} />
          )}
        </div>

        {/* Legend row */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex gap-4">
            <LegendDot color="bg-yellow-400" label="Urine" />
            <LegendDot color="bg-sky-400" label="Water Intake" />
          </div>
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="text-blue-500 text-xs"
          >
            {showAnalysis ? "Hide Analysis" : "View Analysis"}
          </button>
        </div>

        {/* Stats */}
        {statsLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Stat
              title="Avg Urine"
              value={avgUrine ? `${avgUrine} ml` : "-"}
              accent="yellow"
            />
            <Stat
              title="Avg Intake"
              value={avgIntake ? `${avgIntake} ml` : "-"}
              accent="blue"
            />
            <Stat
              title="Clarity"
              value={
                monthlyAdvice?.normalRatePercent != null
                  ? `${monthlyAdvice.normalRatePercent}%`
                  : "-"
              }
              accent="green"
            />
            <Stat
              title="Abnormal Days"
              value={abnormalCount || abnormalCount === 0 ? `${abnormalCount}` : "-"}
              accent="indigo"
            />
          </div>
        )}

        {showAnalysis && (
          <div>
            <div className="flex items-center gap-2 mb-[21px]">
              <div className="flex h-[24px] w-[24px] items-center justify-center rounded-full">
                <Info className="h-[24px] w-[24px] text-blue-500" />
              </div>
              <h2 className="text-base font-medium text-primary">Analysis Results</h2>
            </div>

            {/* Correlation */}
            <div className="space-y-1 mb-5">
              <h3 className="text-sm text-primary font-medium">
                Correlation with Changes
              </h3>
              {adviceLoading ? (
                <div className="flex items-center justify-center py-2">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="24px"
                    height="30px"
                    viewBox="0 0 24 30"
                    style={{ enableBackground: "new 0 0 50 50" }}
                    xmlSpace="preserve"
                  >
                    <rect x="0" y="0" width="4" height="10" fill="#ef4444">
                      <animateTransform
                        attributeType="xml"
                        attributeName="transform"
                        type="translate"
                        values="0 0; 0 20; 0 0"
                        begin="0"
                        dur="0.6s"
                        repeatCount="indefinite"
                      />
                    </rect>
                    <rect x="10" y="0" width="4" height="10" fill="#ef4444">
                      <animateTransform
                        attributeType="xml"
                        attributeName="transform"
                        type="translate"
                        values="0 0; 0 20; 0 0"
                        begin="0.2s"
                        dur="0.6s"
                        repeatCount="indefinite"
                      />
                    </rect>
                    <rect x="20" y="0" width="4" height="10" fill="#ef4444">
                      <animateTransform
                        attributeType="xml"
                        attributeName="transform"
                        type="translate"
                        values="0 0; 0 20; 0 0"
                        begin="0.4s"
                        dur="0.6s"
                        repeatCount="indefinite"
                      />
                    </rect>
                  </svg>
                </div>
              ) : monthlyAdvice?.monthlyNotes?.length ? (
                <ul className="list-disc pl-4 space-y-1 text-xs text-secondary">
                  {monthlyAdvice.monthlyNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-secondary leading-relaxed">
                  Monthly insights will appear here based on your urine volume pattern.
                </p>
              )}
            </div>

            {/* Drinking Time */}
            <div className="space-y-1 mb-[15px]">
              <h3 className="text-sm text-primary font-medium mb-2">
                Drinking Time Analysis
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                {monthlyAdvice?.hydrationBalancePercent != null
                  ? `Overall hydration balance this month is ${monthlyAdvice.hydrationBalancePercent}%.`
                  : "Keep intake distributed across the day to support stable urine volume."}
              </p>
            </div>

            {/* Abnormal Days */}
            <div className="space-y-1 mb-3">
              <h3 className="text-sm text-primary font-medium mb-2">
                Abnormal Days Analysis
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                {monthlyAdvice?.normalRatePercent != null
                  ? `Normal urine days this month: ${monthlyAdvice.normalRatePercent}%.`
                  : "Monitor days with unusually low or high urine volume and relate them to hydration or diet changes."}
              </p>
            </div>

            {/* Personal Tip */}
            <div className="rounded-[8px] bg-blue-50 p-4 text-sm text-gray-700">
              <p className="text-[#619af8] mb-1">Personal Tip</p>
              {adviceLoading ? (
                <div className="flex items-center justify-center py-2">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="24px"
                    height="30px"
                    viewBox="0 0 24 30"
                    style={{ enableBackground: "new 0 0 50 50" }}
                    xmlSpace="preserve"
                  >
                    <rect x="0" y="0" width="4" height="10" fill="#ef4444">
                      <animateTransform
                        attributeType="xml"
                        attributeName="transform"
                        type="translate"
                        values="0 0; 0 20; 0 0"
                        begin="0"
                        dur="0.6s"
                        repeatCount="indefinite"
                      />
                    </rect>
                    <rect x="10" y="0" width="4" height="10" fill="#ef4444">
                      <animateTransform
                        attributeType="xml"
                        attributeName="transform"
                        type="translate"
                        values="0 0; 0 20; 0 0"
                        begin="0.2s"
                        dur="0.6s"
                        repeatCount="indefinite"
                      />
                    </rect>
                    <rect x="20" y="0" width="4" height="10" fill="#ef4444">
                      <animateTransform
                        attributeType="xml"
                        attributeName="transform"
                        type="translate"
                        values="0 0; 0 20; 0 0"
                        begin="0.4s"
                        dur="0.6s"
                        repeatCount="indefinite"
                      />
                    </rect>
                  </svg>
                </div>
              ) : monthlyAdvice?.suggestions?.length ? (
                <ul className="list-disc pl-4 space-y-1 text-xs text-secondary">
                  {monthlyAdvice.suggestions.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-secondary">
                  Aim for 1800–2400ml intake, and avoid large amounts of water just before bed to support healthy urine patterns.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center items-center text-gray-400 italic text-sm mt-5 mb-[32px]">For reference only. Consult a doctor if needed.</div>
    </div>
  );
};

function Tab({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? "rounded-md bg-white px-4 py-1.5 font-base shadow-sm text-secondary"
          : "rounded-md px-4 py-1.5 text-sm text-secondary"
      }
    >
      {children}
    </button>
  );
}

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span className="text-xs font-['Aleo'] text-primary">{label}</span>
    </div>
  );
}

function Stat({ title, value, accent }) {
  const map = {
    yellow: "border-[#FDEF89]",
    blue: "border-[#B8D3F5]",
    green: "border-[#BAF5CE]",
    indigo: "border-[#C5D0FC]",
  };

  return (
    <div className={`rounded-[8px] border-l-4 ${map[accent]} bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-3`}>
      <p className="text-sm text-primary font-medium">{title}</p>
      <p className="text-sm  text-primary font-medium">{value}</p>
    </div>
  );
}

export default Month;
