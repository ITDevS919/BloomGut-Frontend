// src/pages/home/trend/Bowel/Free.jsx
import { Suspense, useEffect, useState, lazy } from "react";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import usePremiumEntitlement from "@/hooks/usePremiumEntitlement";
import Type1Image from "@/assets/Images/bowel-types/Type 1.webp";
import Type2Image from "@/assets/Images/bowel-types/Type 2.webp";
import Type3Image from "@/assets/Images/bowel-types/Type 3.webp";
import Type4Image from "@/assets/Images/bowel-types/Type 4.webp";
import Type5Image from "@/assets/Images/bowel-types/Type 5.webp";
import Upgrade from "./Upgrade";
import Loader from "@/components/common/Loader";

// Lazy‑load the heavy Chart.js + react-chartjs-2 bundle
const DailyBowelChart = lazy(() => import("./DailyBowelChart"));

const BOWEL_PRIMARY_COLOR = "#1abc9c";

const Free = ({ showUpgrade = true }) => {
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();
  const { premiumEntitled } = usePremiumEntitlement();

  const [loadingDailyCounts, setLoadingDailyCounts] = useState(false);
  const [loadingWeeklySummary, setLoadingWeeklySummary] = useState(false);
  const [hasRequestedAdvice, setHasRequestedAdvice] = useState(false);

  // Daily bowel count data
  const [dailyData, setDailyData] = useState([1, 2, 3, 1, 2, 0, 1]);
  const [days, setDays] = useState([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ]);

  // Weekly bowel health summary
  const [score, setScore] = useState(78);
  const [status, setStatus] = useState("Good");
  const [change, setChange] = useState("+0% vs Last");
  const [scorePosition, setScorePosition] = useState(45);
  const [dailyTypeValues, setDailyTypeValues] = useState([15, 30, 35, 20, 0]);
  const [aiWeeklySummary, setAiWeeklySummary] = useState("");
  const [aiDayTooltips, setAiDayTooltips] = useState([]);

  useEffect(() => {
    if (!auth?.user?.id) return;

    let isCancelled = false;

    const fetchDailyCounts = async () => {
      try {
        setLoadingDailyCounts(true);
        const referenceDate = new Date().toISOString();
        const timezoneOffsetMinutes = new Date().getTimezoneOffset();
        const response = await api.get("/trend/bowel/dailyCount", {
          params: {
            userId: auth.user.id,
            referenceDate,
            timezoneOffsetMinutes,
          },
        });
        const payload = response.data?.data || response.data;
        if (payload?.dailyCounts && payload?.days) {
          if (!isCancelled) {
            setDailyData(payload.dailyCounts);
            setDays(payload.days);
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load bowel daily counts:", error);
      } finally {
        if (!isCancelled) {
          setLoadingDailyCounts(false);
        }
      }
    };

    const fetchWeeklySummary = async () => {
      try {
        setLoadingWeeklySummary(true);
        const referenceDate = new Date().toISOString();
        const timezoneOffsetMinutes = new Date().getTimezoneOffset();
        const response = await api.get("/trend/bowel/weeklySummary", {
          params: {
            userId: auth.user.id,
            referenceDate,
            timezoneOffsetMinutes,
          },
        });
        const payload = response.data?.data || response.data;
        if (!payload) return;

        // Prefer explicit today/yesterday scores if backend provides them,
        // since the UI copy compares "today" vs "yesterday".
        const todayScore =
          typeof payload.todayScore === "number"
            ? Math.round(payload.todayScore)
            : null;
        const yesterdayScore =
          typeof payload.yesterdayScore === "number"
            ? Math.round(payload.yesterdayScore)
            : null;

        if (todayScore !== null) {
          if (!isCancelled) {
            setScore(todayScore);
          }
          const clamped = Math.max(0, Math.min(100, todayScore));
          if (!isCancelled) {
            setScorePosition(clamped);
          }
        } else if (typeof payload.score === "number") {
          const rounded = Math.round(payload.score);
          if (!isCancelled) {
            setScore(rounded);
          }
          const clamped = Math.max(0, Math.min(100, rounded));
          if (!isCancelled) {
            setScorePosition(clamped);
          }
        }

        // Build the "today vs yesterday" change text.
        let changeText = "";
        if (todayScore !== null && yesterdayScore !== null) {
          const diff = todayScore - yesterdayScore;
          const absDiff = Math.abs(diff);
          const sign = diff > 0 ? "+" : diff < 0 ? "-" : "";
          changeText = `${sign}${absDiff}% vs Yesterday`;
        } else if (typeof payload.changePercent === "number") {
          const sign = payload.changePercent > 0 ? "+" : "";
          changeText = `${sign}${payload.changePercent}% vs Last`;
        }

        if (!isCancelled && changeText) {
          setChange(changeText);
        }

        if (payload.status) {
          if (!isCancelled) {
            setStatus(payload.status);
          }
        }

        if (Array.isArray(payload.typeDistribution)) {
          if (!isCancelled) {
            setDailyTypeValues(payload.typeDistribution);
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load bowel weekly summary:", error);
      } finally {
        if (!isCancelled) {
          setLoadingWeeklySummary(false);
        }
      }
    };

    const loadAll = async () => {
      await Promise.all([fetchDailyCounts(), fetchWeeklySummary()]);
    };

    loadAll();

    return () => {
      isCancelled = true;
    };
  }, [api, auth?.user?.id]);

  // Function to get color based on value
  const getPointColor = (value) => {
    if (value === 0) return "#ef4444"; // Red
    if (value === 3) return "#f59e0b"; // Gold/Orange
    return "#10b981"; // Green (for 1-2)
  };

  const dailyTypeLabels = [
    {
      color: '#9AD0A1',
      label: 'Type 1'
    },
    {
      color: '#D4AE7C',
      label: 'Type 2'
    },
    {
      color: '#E0B85C',
      label: 'Type 3'
    },
    {
      color: '#B5652E',
      label: 'Type 4'
    },
    {
      color: '#9CA3AF',
      label: 'Type 5'
    }
  ];
  const dailyTypeColors = [
    "#9AD0A1", // green
    "#D4AE7C", // tan
    "#E0B85C", // yellow
    "#B5652E", // brown
    "#9CA3AF", // gray
  ];

  const getIndicatorColor = (value) => {
    if (value >= 81) return BOWEL_PRIMARY_COLOR;
    if (value >= 61) return "#FBC02D"; // Yellow segment (61–80)
    return "#F66B6B"; // Red segment (0–60)
  };

  // Fetch AI weekly bowel advice (OpenAI via backend) once data is available
  useEffect(() => {
    if (!auth?.user?.id || !premiumEntitled) return;
    if (!Array.isArray(dailyData) || !dailyData.length) return;
    if (loadingDailyCounts || loadingWeeklySummary) return;
    if (hasRequestedAdvice) return;

    const hasAnyData = dailyData.some((v) => Number(v || 0) > 0);
    if (!hasAnyData) {
      setAiWeeklySummary("");
      return;
    }

    let isCancelled = false;

    const run = async () => {
      try {
        const summaryPayload = {
          score,
          status,
          changeText: change,
          typeDistribution: dailyTypeValues,
          dailyCounts: dailyData,
        };
        const response = await api.post(
          "/trend/bowel/weeklyAdvice",
          summaryPayload
        );
        const payload = response.data?.data || response.data;
        if (isCancelled || !payload) return;

        if (payload.summary) {
          setAiWeeklySummary(payload.summary);
        }
        if (Array.isArray(payload.dayTooltips)) {
          setAiDayTooltips(payload.dayTooltips);
        }

        setHasRequestedAdvice(true);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load bowel weekly AI advice:", error);
      }
    };

    run();

    return () => {
      isCancelled = true;
    };
  }, [
    api,
    auth?.user?.id,
    score,
    status,
    change,
    dailyTypeValues,
    dailyData,
    loadingDailyCounts,
    loadingWeeklySummary,
    hasRequestedAdvice,
  ]);

  const hasTodayBowelRecord = (() => {
    if (!Array.isArray(days) || !Array.isArray(dailyData) || !days.length) {
      return false;
    }

    const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const todayLabel = weekLabels[new Date().getDay()];
    const idx = days.indexOf(todayLabel);
    const todayCount = idx >= 0 ? Number(dailyData[idx] || 0) : 0;

    return todayCount > 0;
  })();

  const effectiveScore = hasTodayBowelRecord ? score : 0;
  const effectiveStatus = hasTodayBowelRecord ? status : "Not Recorded";
  const effectiveChange = hasTodayBowelRecord ? change : "";
  const effectiveScorePosition = hasTodayBowelRecord ? scorePosition : 0;
  const effectiveDailyTypeValues = hasTodayBowelRecord
    ? dailyTypeValues
    : [0, 0, 0, 0, 0];

  const dailyBowelChartData = {
    labels: days,
    datasets: [
      {
        data: dailyData,
        borderColor: "#6b7280", // Dark gray for dotted line
        backgroundColor: "transparent",
        borderWidth: 2,
        borderDash: [5, 5], // Dotted line
        pointRadius: 16, // Size of circles
        pointBackgroundColor: "white",
        pointBorderColor: dailyData.map(getPointColor),
        pointBorderWidth: 2,
        pointHoverRadius: 18,
        tension: 0.4, // Smooth curve,
      },
    ],
  };

  const dailyBowelChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "white",
        titleColor: "#4b332d",
        titleFont: { size: 18, weight: "bold", family: "sans-serif" },
        bodyColor: "#6b7280",
        bodyFont: { size: 14, family: "sans-serif" },
        padding: {
          top: 16,
          right: 20,
          bottom: 20,
          left: 20,
        },
        displayColors: false,
        borderColor: "transparent",
        borderWidth: 0,
        cornerRadius: 12,
        boxPadding: 0,
        usePointStyle: false,
        callbacks: {
          title: (context) => {
            const index = context[0]?.dataIndex ?? 0;
            const dayLabel = days[index] ?? "";
            return dayLabel ? `Details · ${dayLabel}` : "Details";
          },
          label: (context) => {
            const index = context.dataIndex;
            const value =
              context.parsed?.y ?? context.dataset.data[index] ?? 0;

            const aiTooltip =
              Array.isArray(aiDayTooltips) && aiDayTooltips[index]
                ? aiDayTooltips[index]
                : null;

            // If no bowel movement recorded that day
            if (!value) {
              if (aiTooltip) {
                return [
                  `Health: ${aiTooltip.health}`,
                  `Status: ${aiTooltip.status}`,
                  `Impact: ${aiTooltip.impact}`,
                  `Type: ${aiTooltip.type}`,
                  `Factor: ${aiTooltip.factor}`,
                ];
              }

              return [
                "Health: 0%",
                "Status: Not Recorded",
                "Impact: Low",
                "Type: 0 (None)",
                "Factor: Multiple",
              ];
            }

            if (aiTooltip) {
              return [
                `Health: ${aiTooltip.health}`,
                `Status: ${aiTooltip.status}`,
                `Impact: ${aiTooltip.impact}`,
                `Type: ${aiTooltip.type}`,
                `Factor: ${aiTooltip.factor}`,
              ];
            }

            // Fallback if AI tooltip is not available
            return [
              `Bowel movements: ${value}`,
              "Keep observing your stool shape, color and frequency for patterns.",
            ];
          },
          afterBody: () =>
            aiWeeklySummary ? ["Analyzed with System"] : [],
          footer: () => "",
          labelTextColor: () => "#6b7280",
          afterBodyColor: () => "#9ca3af",
          footerColor: () => "#9ca3af",
          labelFont: () => ({ size: 14, family: "sans-serif" }),
          footerFont: () => ({ size: 12, family: "sans-serif" }),
        },
      },
      datalabels: {
        anchor: "center",
        align: "center",
        color: (context) => {
          const value = context.parsed?.y ?? context.dataset.data[context.dataIndex];
          return getPointColor(value);
        },
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: (value) => value,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          display: true,
          color: "#6b7280",
          font: {
            size: 12,
            weight: "medium",
          },
          padding: 10,
        },
      },
      y: {
        display: false, // Hide Y-axis
        grid: { display: false },
        border: { display: false },
      },
    },
    layout: {
      padding: {
        top: 10,
        // bottom: 10,
        left: 10,
        right: 10,
      },
    },
  };

  return (
    <main className="pr-[15px] pl-[15px]">
      <style>{`
        div[id*="chartjs-tooltip"],
        .chartjs-tooltip {
          text-align: left !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
        }
        .chartjs-tooltip .chartjs-tooltip-title {
          text-align: left !important;
          font-weight: bold !important;
          color: #4b332d !important;
          font-size: 18px !important;
        }
        .chartjs-tooltip .chartjs-tooltip-body {
          text-align: left !important;
        }
        .chartjs-tooltip .chartjs-tooltip-body-list {
          text-align: left !important;
        }
        .chartjs-tooltip .chartjs-tooltip-body-list li {
          text-align: left !important;
          color: #6b7280 !important;
          font-size: 14px !important;
        }
        .chartjs-tooltip .chartjs-tooltip-body-list:last-of-type {
          text-align: center !important;
          margin-top: 12px !important;
          padding-top: 12px !important;
          padding-bottom: 4px !important;
          border-top: 1px solid #e5e7eb !important;
        }
        div[id*="chartjs-tooltip"] .chartjs-tooltip-body-list:last-of-type li,
        .chartjs-tooltip .chartjs-tooltip-body-list:last-of-type li {
          font-size: 12px !important;
          color: #9ca3af !important;
          text-align: center !important;
          display: block !important;
          margin: 0 !important;
          padding: 0 !important;
          line-height: 1.5 !important;
        }
        .chartjs-tooltip .chartjs-tooltip-body-list:last-of-type li span {
          font-size: 12px !important;
          color: #9ca3af !important;
          text-align: center !important;
          display: block !important;
        }
        .chartjs-tooltip .chartjs-tooltip-body-list:last-of-type li * {
          font-size: 12px !important;
          color: #9ca3af !important;
          text-align: center !important;
        }
        .chartjs-tooltip .chartjs-tooltip-footer {
          text-align: center !important;
          margin-top: 12px !important;
          padding-top: 12px !important;
          padding-bottom: 4px !important;
          border-top: 1px solid #e5e7eb !important;
        }
        .chartjs-tooltip .chartjs-tooltip-footer li {
          font-size: 12px !important;
          color: #9ca3af !important;
          text-align: center !important;
        }
      `}</style>
      {/* Score Card */}
      <div className="bg-white rounded-[27px] p-[32px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] mb-[29px] relative">
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="pl-[50px]">
              <div className="text-3xl font-bold text-[#1abc9c] text-center">
                {effectiveScore}
              </div>
              <div className="text-sm text-custom-12 text-center">
                {effectiveStatus}
              </div>
            </div>
            <div className="text-base pr-[50px] text-center text-[#1abc9c]">
              {effectiveChange}
            </div>
          </div>

          {/* Progress Bar (Health Score) */}
          <div className="mt-4">
            <div
              className="h-2 rounded-full relative overflow-hidden"
              style={{
                background: `linear-gradient(to right,
                  ${BOWEL_PRIMARY_COLOR} 0%,
                  ${BOWEL_PRIMARY_COLOR} 60%,
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
                  left: `${effectiveScorePosition}%`,
                  transform: "translateX(-50%)",
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: getIndicatorColor(effectiveScorePosition),
                  }}
                />
              </div>
            </div>
          </div>
        </>

        {loadingWeeklySummary && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Loader />
          </div>
        )}
      </div>
      {/* Stool Type Cards */}
      <div className="text-base mb-3 font-medium pl-[15px] text-primary">Daily Types</div>
      <div className="bg-white rounded-[20px] p-6 shadow-[2px_0_10px_rgba(3,3,3,0.1)] mb-[34px] relative">
        <div className="flex items-end justify-between gap-2">
          {effectiveDailyTypeValues.map((value, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              {/* Colored Bar with Gray Background and Icon Inside */}
              <div
                className="w-full bg-[#E6E6E6] rounded-lg relative overflow-hidden flex flex-col"
                style={{ height: "120px" }}
              >
                {/* Circular Icon at Top */}
                <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mx-auto mt-2 mb-2 z-10">
                  <img
                    src={[
                      Type1Image,
                      Type2Image,
                      Type3Image,
                      Type4Image,
                      Type5Image,
                    ][index]}
                    alt={`Type ${index + 1}`}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                {/* Colored Bar Fill */}
                {value > 0 ? (
                  <div
                    className="w-full rounded-lg flex items-center justify-center absolute bottom-0"
                    style={{
                      height: `${value}%`,
                      backgroundColor: dailyTypeColors[index],
                      minHeight: "20px",
                    }}
                  >
                    <span className="text-white text-xs">{value}%</span>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-end justify-center absolute bottom-0 pb-1">
                    <span className="text-custom-1 text-xs">0%</span>
                  </div>
                )}
              </div>
              {/* Label Below Bar */}
              <div className="text-xs text-primary mt-2 text-center">
                <span style={{ color: dailyTypeLabels[index].color }}>
                  {dailyTypeLabels[index].label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {loadingWeeklySummary && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Loader />
          </div>
        )}
      </div>

      {/* Daily Bowel Count */}
      <div className="text-base pl-[15px] font-medium mb-5 text-primary">
        Daily Bowel Count
      </div>
      <div className="bg-white rounded-[27px] p-6 shadow-[0_2px_4px_rgba(0,0,0,0.08)] mb-[35px] relative">
        <div className="h-50">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-8 text-sm text-custom-12">
                Loading chart…
              </div>
            }
          >
            <DailyBowelChart
              data={dailyBowelChartData}
              options={dailyBowelChartOptions}
            />
          </Suspense>
        </div>

        {loadingDailyCounts && (
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
