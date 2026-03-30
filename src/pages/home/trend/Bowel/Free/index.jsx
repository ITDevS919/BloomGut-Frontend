// src/pages/home/trend/Bowel/Free.jsx
import { Suspense, useEffect, useState, lazy } from "react";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import {
  getTrendBowelDailyCount,
  getTrendBowelWeeklySummary,
  getTrendBowelMonthlySummary,
  postTrendBowelWeeklyAdvice,
} from "@/api/http";
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

/** 0–100 score zones: bar gradient + thumb color use the same bounds. */
const BOWEL_SCORE_RED_MAX = 60;
const BOWEL_SCORE_YELLOW_MAX = 80;

const bowelScoreTrackGradient = `linear-gradient(to right,
  #F66B6B 0%,
  #FBC02D 60%,
  #1ABC9C 80%,
  #1ABC9C 100%)`;

const Free = ({ showUpgrade = true, referenceDate, viewMode = "week" }) => {
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();
  const { premiumEntitled } = usePremiumEntitlement();

  const [loadingDailyCounts, setLoadingDailyCounts] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [hasRequestedAdvice, setHasRequestedAdvice] = useState(false);
  const [loadingAiAdvice, setLoadingAiAdvice] = useState(false);

  // Daily bowel count data (filled from API)
  const [dailyData, setDailyData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [days, setDays] = useState([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ]);

  // Populated from weekly summary (week mode) or monthly summary (month mode); drives effectiveScore.
  const [score, setScore] = useState(0);
  const [recordCount, setRecordCount] = useState(0);
  const [status, setStatus] = useState("Not Recorded");
  const [change, setChange] = useState("");
  /** Raw Δ from API for coloring (+ / − / 0); null if no numeric comparison. */
  const [changePercentDelta, setChangePercentDelta] = useState(null);
  const [scorePosition, setScorePosition] = useState(0);
  const [dailyTypeValues, setDailyTypeValues] = useState([0, 0, 0, 0, 0]);
  const [aiWeeklySummary, setAiWeeklySummary] = useState("");
  const [aiDayTooltips, setAiDayTooltips] = useState([]);
  /** Trend Analysis SRS: enough distinct record days for week/month view */
  const [trendSufficient, setTrendSufficient] = useState(false);

  useEffect(() => {
    if (!auth?.user?.id) return;

    let isCancelled = false;

    const fetchDailyCounts = async () => {
      try {
        setLoadingDailyCounts(true);
        // const referenceDate = new Date().toISOString();
        const timezoneOffsetMinutes = new Date().getTimezoneOffset();
        const response = await getTrendBowelDailyCount(api, {
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

    const fetchPeriodSummary = async () => {
      try {
        setLoadingSummary(true);
        setChangePercentDelta(null);
        const timezoneOffsetMinutes = new Date().getTimezoneOffset();

        if (viewMode === "month") {
          const response = await getTrendBowelMonthlySummary(api, {
            params: {
              userId: auth.user.id,
              referenceDate,
              timezoneOffsetMinutes,
            },
          });
          const payload = response.data?.data || response.data;
          if (!payload) return;

          if (!isCancelled) {
            setTrendSufficient(payload.is_enough_data === true);
          }

          const monthlyAvgRaw =
            typeof payload.monthlyAverageScore === "number"
              ? payload.monthlyAverageScore
              : typeof payload.score === "number"
                ? payload.score
                : null;

          if (monthlyAvgRaw !== null) {
            const rounded = Math.round(monthlyAvgRaw);
            const clamped = Math.max(0, Math.min(100, rounded));
            if (!isCancelled) {
              setScore(clamped);
              setScorePosition(clamped);
            }
          }

          if (typeof payload.monthRecordCount === "number" && !isCancelled) {
            setRecordCount(payload.monthRecordCount);
          }

          let changeText = "";
          if (typeof payload.changePercent === "number") {
            const cp = payload.changePercent;
            const sign = cp > 0 ? "+" : "";
            changeText = `${sign}${cp}% vs last`;
            if (!isCancelled) setChangePercentDelta(cp);
          } else if (
            payload.changePercent === null &&
            typeof payload.previousMonthRecordCount === "number" &&
            payload.previousMonthRecordCount === 0
          )

            if (!isCancelled) {
              setChange(changeText);
            }
          if (payload.status && !isCancelled) {
            setStatus(payload.status);
          }
          if (Array.isArray(payload.typeDistribution) && !isCancelled) {
            setDailyTypeValues(payload.typeDistribution);
          }
          return;
        }

        const response = await getTrendBowelWeeklySummary(api, {
          params: {
            userId: auth.user.id,
            referenceDate,
            timezoneOffsetMinutes,
          },
        });
        const payload = response.data?.data || response.data;
        if (!payload) return;

        if (!isCancelled) {
          setTrendSufficient(payload.is_enough_data === true);
        }

        const weeklyAvgRaw =
          typeof payload.weeklyAverageScore === "number"
            ? payload.weeklyAverageScore
            : typeof payload.score === "number"
              ? payload.score
              : null;

        if (weeklyAvgRaw !== null) {
          const rounded = Math.round(weeklyAvgRaw);
          const clamped = Math.max(0, Math.min(100, rounded));
          if (!isCancelled) {
            setScore(clamped);
            setScorePosition(clamped);
          }
        }

        if (typeof payload.weekRecordCount === "number" && !isCancelled) {
          setRecordCount(payload.weekRecordCount);
        }

        let changeText = "";
        if (typeof payload.changePercent === "number") {
          const cp = payload.changePercent;
          const sign = cp > 0 ? "+" : "";
          changeText = `${sign}${cp}% vs last`;
          if (!isCancelled) setChangePercentDelta(cp);
        }

        if (!isCancelled) {
          setChange(changeText);
        }

        if (payload.status && !isCancelled) {
          setStatus(payload.status);
        }

        if (Array.isArray(payload.typeDistribution) && !isCancelled) {
          setDailyTypeValues(payload.typeDistribution);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          `Failed to load bowel ${viewMode === "month" ? "monthly" : "weekly"} summary:`,
          error
        );
      } finally {
        if (!isCancelled) {
          setLoadingSummary(false);
        }
      }
    };

    const loadAll = async () => {
      await Promise.all([fetchDailyCounts(), fetchPeriodSummary()]);
    };

    loadAll();

    return () => {
      isCancelled = true;
    };
  }, [api, auth?.user?.id, referenceDate, viewMode]);

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
    const v = Math.max(0, Math.min(100, Number(value) || 0));
    if (v > BOWEL_SCORE_YELLOW_MAX) return BOWEL_PRIMARY_COLOR;
    if (v > BOWEL_SCORE_RED_MAX) return "#FBC02D";
    return "#F66B6B";
  };

  const getIndicatorStyle = (positionPercent) => {
    const clamped = Math.max(0, Math.min(100, Number(positionPercent) || 0));
    const translateX =
      clamped <= 0 ? "0" : clamped >= 100 ? "-100%" : "-50%";
    return {
      left: `${clamped}%`,
      transform: `translateX(${translateX})`,
    };
  };

  // Fetch AI weekly bowel advice (OpenAI via backend) once data is available
  useEffect(() => {
    if (!auth?.user?.id || !premiumEntitled) return;
    if (!Array.isArray(dailyData) || !dailyData.length) return;
    if (loadingDailyCounts || loadingSummary) return;
    if (hasRequestedAdvice) return;

    const hasAnyData = dailyData.some((v) => Number(v || 0) > 0);
    if (!trendSufficient || !hasAnyData) {
      setAiWeeklySummary("");
      return;
    }

    let isCancelled = false;

    const run = async () => {
      try {
        setLoadingAiAdvice(true);
        const summaryPayload = {
          score,
          status,
          changeText: change,
          typeDistribution: dailyTypeValues,
          dailyCounts: dailyData,
        };
        const response = await postTrendBowelWeeklyAdvice(api, summaryPayload);
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
      } finally {
        if (!isCancelled) {
          setLoadingAiAdvice(false);
        }
      }
    };

    run();

    return () => {
      isCancelled = true;
      setLoadingAiAdvice(false);
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
    loadingSummary,
    hasRequestedAdvice,
    premiumEntitled,
    trendSufficient,
  ]);

  /** Week mode: any log in the week (API count or daily chart). Month mode: any log in the month. */
  const hasBowelData =
    viewMode === "month"
      ? recordCount > 0
      : recordCount > 0 ||
      (Array.isArray(dailyData) &&
        dailyData.some((v) => Number(v || 0) > 0));

  const showTrendAnalysis = trendSufficient;

  /** Same as `score`: this week’s shape-based average (week mode) or this month’s (month mode). */
  const effectiveScore = showTrendAnalysis && hasBowelData ? score : 0;
  const effectiveStatus =
    showTrendAnalysis && hasBowelData
      ? status
      : "Insufficient data, continue recording";
  const effectiveChange = showTrendAnalysis && hasBowelData ? change : "";
  const effectiveChangeColor = (() => {
    if (!showTrendAnalysis || !hasBowelData || !effectiveChange) return "#999999";
    const d = changePercentDelta;
    if (d === null || typeof d !== "number" || Number.isNaN(d)) {
      return "#999999";
    }
    if (d > 0) return "#1ABC9C";
    if (d < 0) return "#F66B6B";
    return "#999999";
  })();
  const effectiveScorePosition =
    showTrendAnalysis && hasBowelData ? scorePosition : 0;
  const effectiveDailyTypeValues =
    showTrendAnalysis && hasBowelData ? dailyTypeValues : [0, 0, 0, 0, 0];

  const chartDailyCounts =
    showTrendAnalysis && Array.isArray(dailyData)
      ? dailyData
      : [0, 0, 0, 0, 0, 0, 0];

  const periodAverageLabel =
    viewMode === "month" ? "This month's average" : "This week's average";

  const dailyBowelChartData = {
    labels: days,
    datasets: [
      {
        data: chartDailyCounts,
        borderColor: "#6b7280", // Dark gray for dotted line
        backgroundColor: "transparent",
        borderWidth: 2,
        borderDash: [5, 5], // Dotted line
        pointRadius: 16, // Size of circles
        pointBackgroundColor: "white",
        pointBorderColor: chartDailyCounts.map(getPointColor),
        pointBorderWidth: 2,
        pointHoverRadius: 18,
        tension: 0.4, // Smooth curve,
      },
    ],
  };

  const dailyBowelChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "nearest",
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#FFFFFF",
        titleColor: "#4b332d",
        titleFont: { size: 16, weight: "700", family: "sans-serif" },
        titleMarginBottom: 14,
        bodyColor: "#8a8a8a",
        bodyFont: { size: 13, family: "sans-serif", weight: "600" },
        bodySpacing: 10,
        footerColor: "#9ca3af",
        footerFont: { size: 12, family: "sans-serif", weight: "500" },
        footerMarginTop: 14,
        padding: {
          top: 18,
          right: 20,
          bottom: 16,
          left: 20,
        },
        caretSize: 8,
        caretPadding: 12,
        displayColors: false,
        borderColor: "rgba(75, 51, 45, 0.08)",
        borderWidth: 1,
        cornerRadius: 14,
        boxPadding: 0,
        usePointStyle: false,
        bodyAlign: "left",
        footerAlign: "center",
        callbacks: {
          title: () => "Details",
          label: (context) => {
            const index = context.dataIndex;
            const value =
              context.parsed?.y ?? context.dataset.data[index] ?? 0;

            const aiTooltip =
              Array.isArray(aiDayTooltips) && aiDayTooltips[index]
                ? aiDayTooltips[index]
                : null;

            if (premiumEntitled && loadingAiAdvice) {
              return [
                "Preparing insight…",
                "Your personalized day details will appear in a moment.",
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

            if (!value) {
              return [
                "Health: 0%",
                "Status: Not Recorded",
                "Impact: Low",
                "Type: 0 (None)",
                "Factor: Multiple",
              ];
            }

            return [
              `Health: ${Math.min(100, value * 20)}%`,
              "Status: Logged",
              `Impact: ${value >= 3 ? "High" : value === 2 ? "Medium" : "Low"}`,
              `Type: ${value} ${value === 1 ? "(Hard)" : value === 2 ? "(Firm)" : value === 3 ? "(Normal)" : ""}`.trim(),
              "Factor: Track hydration and stool pattern",
            ];
          },
          footer: () =>
            premiumEntitled && !loadingAiAdvice && aiWeeklySummary
              ? "Analyzed by System"
              : "",
          labelTextColor: () => "#8a8a8a",
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
        display: false,
        grid: { display: false },
        border: { display: false },
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
        bottom: 10,
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
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12) !important;
        }
        .chartjs-tooltip .chartjs-tooltip-title {
          text-align: left !important;
          font-weight: 700 !important;
          color: #4b332d !important;
          font-size: 16px !important;
        }
        .chartjs-tooltip .chartjs-tooltip-body,
        .chartjs-tooltip .chartjs-tooltip-body-list,
        .chartjs-tooltip .chartjs-tooltip-body-list li {
          text-align: left !important;
          color: #8a8a8a !important;
          font-size: 13px !important;
          line-height: 1.6 !important;
        }
        .chartjs-tooltip .chartjs-tooltip-footer {
          text-align: center !important;
          margin-top: 12px !important;
          padding-top: 12px !important;
          border-top: 1px solid #ececec !important;
        }
        .chartjs-tooltip .chartjs-tooltip-footer li {
          font-size: 12px !important;
          color: #9ca3af !important;
          text-align: center !important;
        }
      `}</style>
      {/* Score Card */}
      <div
        className={`bg-white rounded-[27px] p-[32px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] mb-[29px] relative ${!showTrendAnalysis ? "opacity-60 grayscale" : ""}`}
      >
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="pl-[50px]">
              <div className="text-3xl font-bold text-[#F66B6B] text-center">
                {showTrendAnalysis ? effectiveScore : "—"}
              </div>
              <div className="text-sm text-custom-12 text-center mt-1">
                {effectiveStatus}
              </div>
            </div>
            <div
              className="text-base pr-[50px] text-center"
              style={{ color: effectiveChangeColor }}
            >
              {effectiveChange}
            </div>
          </div>

          {/* Progress bar: gradient zones = score bands; thumb = live score + matching zone color */}
          <div className="mt-4">
            <div
              className="relative overflow-visible"
              role="meter"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={hasBowelData ? effectiveScore : 0}
              aria-label={`Bowel ${viewMode === "month" ? "monthly" : "weekly"} average score ${hasBowelData ? effectiveScore : 0} out of 100`}
            >
              <div
                className="h-2 rounded-full relative overflow-hidden"
                style={{ background: bowelScoreTrackGradient }}
              />
              <div
                className="pointer-events-none absolute left-0 right-0 top-0 z-1 h-2"
                aria-hidden
              >
                <span
                  className="absolute top-0 bottom-0 w-px bg-black/20"
                  style={{
                    left: `${BOWEL_SCORE_RED_MAX}%`,
                    transform: "translateX(-50%)",
                  }}
                />
                <span
                  className="absolute top-0 bottom-0 w-px bg-black/20"
                  style={{
                    left: `${BOWEL_SCORE_YELLOW_MAX}%`,
                    transform: "translateX(-50%)",
                  }}
                />
              </div>
              <div
                className="w-3 h-2 rounded-full absolute -top-0.5 border-2 box-border shadow-[0_2px_6px_rgba(0,0,0,0.12)] z-10"
                style={{
                  backgroundColor: "white",
                  borderColor: getIndicatorColor(effectiveScore),
                  ...getIndicatorStyle(effectiveScorePosition),
                }}
                aria-hidden
              />
            </div>
          </div>
        </>

        {loadingSummary && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Loader />
          </div>
        )}
      </div>
      {/* Stool Type Cards */}
      <div className="text-base mb-3 font-medium pl-[15px] text-primary">Daily Types</div>
      <div
        className={`bg-white rounded-[20px] p-6 shadow-[2px_0_10px_rgba(3,3,3,0.1)] mb-[34px] relative ${!showTrendAnalysis ? "opacity-60 grayscale" : ""}`}
      >
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
                <div
                  className="w-full rounded-lg absolute bottom-0"
                  style={{
                    height: `${value}%`,
                    backgroundColor: dailyTypeColors[index],
                  }}
                />

                {/* Value label along fill boundary (keeps with bar fill) */}
                <span
                  className={`absolute left-1/2 -translate-x-1/2 ${value > 0 ? "text-white" : "text-custom-2"} text-sm font-semibold`}
                  style={{
                    bottom: value > 0 ? `calc(33.33% - 12px)` : "8px",
                    pointerEvents: "none",
                  }}
                >
                  {value}%
                </span>
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

        {loadingSummary && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Loader />
          </div>
        )}
      </div>

      {/* Daily Bowel Count */}
      <div className="text-base pl-[15px] font-medium mb-5 text-primary">
        Daily Bowel Count
      </div>
      <div className="mb-[35px]">
        <div
          className={`bg-white rounded-[27px] px-6 pt-6 pb-6 shadow-[0_2px_4px_rgba(0,0,0,0.08)] relative ${!showTrendAnalysis ? "opacity-60 grayscale" : ""}`}
        >
          <div className="relative h-50 w-full min-h-0">
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
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-[27px]">
              <Loader />
            </div>
          )}
        </div>
        {/* Day labels sit below the card; insets match card px-6 + chart layout.padding (10px) */}
        <div
          className="mt-3 flex w-full justify-between gap-4 text-xs font-medium text-[#6b7280]"
          style={{
            paddingLeft: "calc(1.3rem + 8px)",
            paddingRight: "calc(1.2rem + 10px)",
          }}
        >
          {days.map((d) => (
            <span key={d} className="min-w-0 flex-1 text-center">
              {d}
            </span>
          ))}
        </div>
      </div>

      {showUpgrade && <Upgrade />}
    </main>
  );
};

export default Free;
