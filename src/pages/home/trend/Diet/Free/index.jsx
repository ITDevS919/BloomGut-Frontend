import { Suspense, useEffect, useState } from "react";
import { Wheat, Beef, Salad, Milk, MoreHorizontal, UtensilsCrossed } from "lucide-react";
import Upgrade from "./Upgrade";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import {
  getTrendBowelDailyTrendForDiet,
  getTrendDietCategory,
  getTrendDietMacroWeekly,
  getTrendDietPeriodSummary,
  getTrendUrineWeeklyScore,
} from "@/api/http";
import Loader from "@/components/common/Loader";
import GrainsImage from "@/assets/Images/diet-types/Grains.webp";
import ProteinImage from "@/assets/Images/diet-types/Protein.webp";
import FruitsVegImage from "@/assets/Images/diet-types/Fruits.webp";
import DairyImage from "@/assets/Images/diet-types/Dairy.webp";
import OtherImage from "@/assets/Images/diet-types/Others.webp";
import { MdRamenDining } from "react-icons/md";
import { FaPoo } from "react-icons/fa6";
import { DietLineChart, BowelLineChart } from "./DietTrendCharts";

const DIET_PRIMARY_COLOR = "#B5A6D2";

const getScorePosition = (score) =>
  Math.max(0, Math.min(100, Math.round(typeof score === "number" ? score : 0)));

const getIndicatorColor = (value) => {
  if (value >= 81) return DIET_PRIMARY_COLOR;
  if (value >= 61) return "#FBC02D"; // Yellow segment (61–80)
  return "#F66B6B"; // Red segment (0–60)
};

const Free = ({ showUpgrade = true, referenceDate, viewMode = "week" }) => {
  const [selectedDate, setSelectedDate] = useState("3/16");

  // Urine health summary (reused on Diet Free screen)
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();
  /** Diet health score: period average (week or calendar month from API) */
  const [periodAverageScore, setPeriodAverageScore] = useState(0);
  const [periodChangePercent, setPeriodChangePercent] = useState(null);
  const [periodSummaryEnough, setPeriodSummaryEnough] = useState(false);
  const [clarityRate, setClarityRate] = useState(0);
  const [clearCount, setClearCount] = useState(0);
  const [yellowCount, setYellowCount] = useState(0);
  const [abnormalCount, setAbnormalCount] = useState(0);

  const [dailyTypeValues, setDailyTypeValues] = useState([35, 25, 20, 10, 5]);
  const [dietMacroLabels, setDietMacroLabels] = useState([
    "3/11",
    "3/12",
    "3/13",
    "3/14",
    "3/15",
    "3/16",
  ]);
  const [fiberSeries, setFiberSeries] = useState([70, 68, 72, 69, 71, 73]);
  const [proteinSeries, setProteinSeries] = useState([60, 62, 63, 61, 64, 66]);
  const [fatSeries, setFatSeries] = useState([45, 46, 47, 46, 48, 49]);
  const [sugarSeries, setSugarSeries] = useState([35, 38, 37, 39, 36, 40]);
  const [bowelLabels, setBowelLabels] = useState([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ]);
  const [bowelFreq, setBowelFreq] = useState([60, 65, 68, 70, 75, 78, 85]);
  const [bowelConsis, setBowelConsis] = useState([50, 55, 58, 60, 62, 64, 68]);
  const [bowelEase, setBowelEase] = useState([40, 43, 46, 48, 52, 55, 60]);
  const [bowelOverall, setBowelOverall] = useState([
    30, 33, 35, 37, 40, 43, 48,
  ]);

  const [loadingDietScores, setLoadingDietScores] = useState(true);
  const [loadingTrendData, setLoadingTrendData] = useState(true);
  const [trendMacroOk, setTrendMacroOk] = useState(false);
  const [trendCategoryOk, setTrendCategoryOk] = useState(false);
  const [trendBowelOk, setTrendBowelOk] = useState(false);

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchDietPeriodSummary = async () => {
      try {
        const response = await getTrendDietPeriodSummary(api, {
          params: {
            userId: auth.user.id,
            referenceDate: referenceDate ? referenceDate.toISOString() : undefined,
            timezoneOffsetMinutes: new Date().getTimezoneOffset(),
            period: viewMode === "month" ? "month" : "week",
          },
        });
        const payload = response.data?.data || response.data;
        if (!payload) return;
        setPeriodSummaryEnough(payload.is_enough_data === true);
        setPeriodAverageScore(
          typeof payload.periodAverageScore === "number" ? payload.periodAverageScore : 0
        );
        const cp = payload.changePercent;
        setPeriodChangePercent(typeof cp === "number" && !Number.isNaN(cp) ? cp : null);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load diet period summary:", error);
        setPeriodSummaryEnough(false);
        setPeriodAverageScore(0);
        setPeriodChangePercent(null);
      }
    };

    const fetchWeeklyDots = async () => {
      try {
        const response = await getTrendUrineWeeklyScore(api, {
          params: {
            userId: auth.user.id,
            referenceDate: referenceDate
              ? referenceDate.toISOString()
              : new Date().toISOString(),
            timezoneOffsetMinutes: new Date().getTimezoneOffset(),
          },
        });
        const payload = response.data?.data || response.data;
        if (!payload) return;
        const rows = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.series)
            ? payload.series
            : [];
        if (
          !Array.isArray(payload) &&
          payload.is_enough_data !== true
        ) {
          return;
        }

        let clarity = 0;
        let clear = 0;
        let yellow = 0;
        let abnormal = 0;

        rows.forEach((item) => {
          const score = item.score ?? 0;
          clarity += score;
          if (score >= 66) clear += 1;
          else if (score >= 33) yellow += 1;
          else abnormal += 1;
        });

        const daysCount = rows.length || 1;
        const avgScore = clarity / daysCount;
        const maxTotal = 100;

        setClarityRate(Math.round((avgScore / maxTotal) * 100));
        setClearCount(clear);
        setYellowCount(yellow);
        setAbnormalCount(abnormal);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load urine weekly report:", error);
      }
    };

    const run = async () => {
      setLoadingDietScores(true);
      try {
        await Promise.all([fetchDietPeriodSummary(), fetchWeeklyDots()]);
      } finally {
        setLoadingDietScores(false);
      }
    };

    run();
  }, [api, auth?.user?.id, referenceDate, viewMode]);

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchDietCategory = async () => {
      try {
        const res = await getTrendDietCategory(api, {
          params: {
            userId: auth.user.id,
            referenceDate: referenceDate ? referenceDate.toISOString() : undefined,
            timezoneOffsetMinutes: new Date().getTimezoneOffset(),
          },
        });
        const payload = res.data?.data ?? res.data;
        setTrendCategoryOk(payload?.is_enough_data === true);
        if (
          payload?.is_enough_data === true &&
          Array.isArray(payload.values) &&
          payload.values.length === 5
        ) {
          setDailyTypeValues(payload.values);
        } else {
          setDailyTypeValues([0, 0, 0, 0, 0]);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load diet category distribution:", error);
      } finally {
        // no-op
      }
    };

    const fetchDietMacroWeekly = async () => {
      try {
        const res = await getTrendDietMacroWeekly(api, {
          params: {
            userId: auth.user.id,
            referenceDate: referenceDate ? referenceDate.toISOString() : undefined,
            timezoneOffsetMinutes: new Date().getTimezoneOffset(),
          },
        });
        const payload = res.data?.data ?? res.data;
        if (!payload || !Array.isArray(payload.labels)) {
          setTrendMacroOk(false);
          return;
        }

        setTrendMacroOk(payload.is_enough_data === true);
        if (payload.is_enough_data === true) {
          setDietMacroLabels(payload.labels);
          if (Array.isArray(payload.fiber)) setFiberSeries(payload.fiber);
          if (Array.isArray(payload.protein)) setProteinSeries(payload.protein);
          if (Array.isArray(payload.fat)) setFatSeries(payload.fat);
          if (Array.isArray(payload.sugar)) setSugarSeries(payload.sugar);
        } else {
          setDietMacroLabels([]);
          setFiberSeries([]);
          setProteinSeries([]);
          setFatSeries([]);
          setSugarSeries([]);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load diet macro weekly trend:", error);
      } finally {
        // no-op
      }
    };

    const fetchBowelTrend = async () => {
      try {
        const res = await getTrendBowelDailyTrendForDiet(api, {
          params: {
            userId: auth.user.id,
            referenceDate: referenceDate ? referenceDate.toISOString() : undefined,
            timezoneOffsetMinutes: new Date().getTimezoneOffset(),
          },
        });
        const payload = res.data?.data ?? res.data;
        if (!payload || !Array.isArray(payload.labels)) {
          setTrendBowelOk(false);
          return;
        }

        setTrendBowelOk(payload.is_enough_data === true);
        if (payload.is_enough_data === true) {
          setBowelLabels(payload.labels);
          if (Array.isArray(payload.freq)) setBowelFreq(payload.freq);
          if (Array.isArray(payload.consis)) setBowelConsis(payload.consis);
          if (Array.isArray(payload.ease)) setBowelEase(payload.ease);
          if (Array.isArray(payload.overall)) setBowelOverall(payload.overall);
        } else {
          setBowelLabels([]);
          setBowelFreq([]);
          setBowelConsis([]);
          setBowelEase([]);
          setBowelOverall([]);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load bowel daily trend for diet:", error);
      } finally {
        // no-op
      }
    };

    const runTrends = async () => {
      setLoadingTrendData(true);
      try {
        await Promise.all([
          fetchDietCategory(),
          fetchDietMacroWeekly(),
          fetchBowelTrend(),
        ]);
      } finally {
        setLoadingTrendData(false);
      }
    };

    runTrends();
  }, [api, auth?.user?.id, referenceDate]);
  const dailyTypeLabels = [
    {
      color: '#d0ab7f',
      label: 'Grains'
    },
    {
      color: '#ce8540',
      label: 'Protein'
    },
    {
      color: '#8cbf86',
      label: 'Fruits & Veg'
    },
    {
      color: '#edd169',
      label: 'Dairy'
    },
    {
      color: '#94a3b8',
      label: 'Other'
    }
  ];
  const dailyTypeColors = [
    "#d0ab7f", // green
    "#ce8540", // tan
    "#8cbf86", // yellow
    "#edd169", // brown
    "#94a3b8", // gray
  ];

  // Create chart options for each category
  const createChartOptions = (item) => ({
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        anchor: "center",
        align: "center",
        color: item.textColor,
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: (value) => `${value}%`,
      },
    },
    scales: {
      x: {
        display: false,
        grid: { display: false },
      },
      y: {
        display: false,
        min: 0,
        max: 100,
        grid: { display: false },
      },
    },
  });

  // Create chart data for each category
  const createChartData = (item) => ({
    labels: [""],
    datasets: [
      {
        data: [item.percentage],
        backgroundColor: item.color,
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  });

  const dates =
    dietMacroLabels.length > 0
      ? dietMacroLabels
      : bowelLabels.length > 0
        ? bowelLabels
        : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const chartDates = dates;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formatFullDateLabel = (label) => {
    if (!label || typeof label !== "string") return label || "";
    const parts = label.split("/");
    if (parts.length !== 2) return label;
    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);
    if (Number.isNaN(month) || Number.isNaN(day)) return label;
    const monthIndex = month - 1;
    if (monthIndex < 0 || monthIndex > 11) return label;
    return `${monthNames[monthIndex]} ${day}`;
  };

  const externalTooltipHandler = (context) => {
    // Hide if no tooltip
    const { chart, tooltip } = context;
    if (!chart || typeof window === "undefined") return;

    let tooltipEl = chart.canvas.parentNode.querySelector(".diet-bowel-tooltip");

    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.className = "diet-bowel-tooltip";
      tooltipEl.style.position = "absolute";
      tooltipEl.style.pointerEvents = "none";
      tooltipEl.style.zIndex = "40";

      const card = document.createElement("div");
      card.className =
        "bg-white rounded-[16px] shadow-[0_8px_24px_rgba(15,23,42,0.18)] border border-[#f3e5d8] px-4 py-3 text-[12px] text-[#705d57] min-w-[160px]";
      tooltipEl.appendChild(card);

      chart.canvas.parentNode.appendChild(tooltipEl);
    }

    const card = tooltipEl.firstChild;

    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }

    // Build content
    while (card.firstChild) {
      card.removeChild(card.firstChild);
    }

    const dataPoints = tooltip.dataPoints || [];
    if (!dataPoints.length) {
      tooltipEl.style.opacity = 0;
      return;
    }

    const idx = dataPoints[0].dataIndex;
    const rawLabel =
      (chart.config.data && chart.config.data.labels && chart.config.data.labels[idx]) || "";
    const fullLabel = formatFullDateLabel(rawLabel);

    const title = document.createElement("div");
    title.textContent = fullLabel;
    title.className = "text-[13px] font-semibold text-[#705d57] mb-1";
    card.appendChild(title);

    const divider = document.createElement("div");
    divider.className = "h-px bg-[#f3e5d8] my-1";
    card.appendChild(divider);

    dataPoints.forEach((dp) => {
      const row = document.createElement("div");
      row.className = "flex items-center gap-2 py-0.5";

      const dot = document.createElement("span");
      dot.className = "h-2.5 w-2.5 rounded-full";
      const bg =
        (Array.isArray(dp.dataset.backgroundColor)
          ? dp.dataset.backgroundColor[dp.dataIndex]
          : dp.dataset.backgroundColor) || dp.dataset.borderColor;
      dot.style.background = bg || "#64748b";

      const labelSpan = document.createElement("span");
      labelSpan.className = "text-[12px]";
      const value =
        typeof dp.raw === "number"
          ? Math.round(dp.raw)
          : typeof dp.parsed?.y === "number"
            ? Math.round(dp.parsed.y)
            : dp.raw || "";
      labelSpan.textContent = `${dp.dataset.label}: ${value}`;

      row.appendChild(dot);
      row.appendChild(labelSpan);
      card.appendChild(row);
    });

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = `${positionX + tooltip.caretX - card.offsetWidth / 2}px`;
    tooltipEl.style.top = `${positionY + tooltip.caretY - card.offsetHeight - 16}px`;
  };

  const dietTrendData = {
    labels: chartDates,
    datasets: [
      {
        label: "Fiber",
        data: fiberSeries,
        borderColor: "#22C55E",
        backgroundColor: "#22C55E",
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: (context) => {
          return context.dataIndex === chartDates.length - 1 ? 6 : 3;
        },
        pointBackgroundColor: "#22C55E",
        pointBorderColor: "#22C55E",
        pointBorderWidth: 2,
      },
      {
        label: "Protein",
        data: proteinSeries,
        borderColor: "#3B82F6",
        backgroundColor: "#3B82F6",
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: (context) => {
          return context.dataIndex === chartDates.length - 1 ? 6 : 3;
        },
        pointBackgroundColor: "#3B82F6",
        pointBorderColor: "#3B82F6",
        pointBorderWidth: 2,
      },
      {
        label: "Fat",
        data: fatSeries,
        borderColor: "#FACC15",
        backgroundColor: "#FACC15",
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: (context) => {
          return context.dataIndex === chartDates.length - 1 ? 6 : 3;
        },
        pointBackgroundColor: "#FACC15",
        pointBorderColor: "#FACC15",
        pointBorderWidth: 2,
      },
      {
        label: "Sugar",
        data: sugarSeries,
        borderColor: "#EF4444",
        backgroundColor: "#EF4444",
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: (context) => {
          return context.dataIndex === chartDates.length - 1 ? 6 : 3;
        },
        pointBackgroundColor: "#EF4444",
        pointBorderColor: "#EF4444",
        pointBorderWidth: 2,
      },
    ],
  };
  const dietTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },
      tooltip: {
        enabled: false,
        external: externalTooltipHandler,
      },
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        grid: {
          display: true,
          color: (context) => {
            return context.index === chartDates.length - 1 ? "#E5E7EB" : "transparent";
          },
          lineWidth: (context) => {
            return context.index === chartDates.length - 1 ? 1 : 0;
          },
        },
        ticks: { font: { size: 11 } },
      },
    },
  };

  const dietBoweldata = {
    labels: dates,
    datasets: [
      {
        label: "Freq",
        data: bowelFreq,
        borderColor: "#14B8A6",
        backgroundColor: "#14B8A6",
        tension: 0.4,
        pointRadius: (context) =>
          context.dataIndex === dates.length - 1 ? 6 : 3,
        pointBackgroundColor: "#14B8A6",
        pointBorderColor: "#14B8A6",
        pointBorderWidth: 2,
        pointHoverRadius: 4,
      },
      {
        label: "Consis",
        data: bowelConsis,
        borderColor: "#A855F7",
        backgroundColor: "#A855F7",
        tension: 0.4,
        pointRadius: (context) =>
          context.dataIndex === dates.length - 1 ? 6 : 3,
        pointBackgroundColor: "#A855F7",
        pointBorderColor: "#A855F7",
        pointBorderWidth: 2,
      },
      {
        label: "Ease",
        data: bowelEase,
        borderColor: "#F59E0B",
        backgroundColor: "#F59E0B",
        tension: 0.4,
        pointRadius: (context) =>
          context.dataIndex === dates.length - 1 ? 6 : 3,
        pointBackgroundColor: "#F59E0B",
        pointBorderColor: "#F59E0B",
        pointBorderWidth: 2,
      },
      {
        label: "Overall",
        data: bowelOverall,
        borderColor: "#6B4F4F",
        backgroundColor: "#6B4F4F",
        tension: 0.4,
        pointRadius: (context) =>
          context.dataIndex === dates.length - 1 ? 6 : 3,
        pointBackgroundColor: "#6B4F4F",
        pointBorderColor: "#6B4F4F",
        pointBorderWidth: 2,
      },
    ],
  };

  const dietBowelOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false,
        external: externalTooltipHandler,
      },
      datalabels: { display: false },
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        grid: {
          display: true,
          color: (context) => {
            return context.index === dates.length - 1 ? "#E5E7EB" : "transparent";
          },
          lineWidth: (context) => {
            return context.index === dates.length - 1 ? 1 : 0;
          },
        },
        ticks: { font: { size: 11 } },
      },
    },
  };

  const effectiveScore = periodSummaryEnough ? periodAverageScore : 0;
  const effectiveStatus = !periodSummaryEnough
    ? "Insufficient data, continue recording"
    : effectiveScore > 0
      ? effectiveScore > 75
        ? "Excellent"
        : effectiveScore > 50
          ? "Good"
          : effectiveScore > 25
            ? "Fair"
            : "Poor"
      : "Not Recorded";

  const changeLabel = viewMode === "month" ? "last month" : "last week";
  const effectiveChangeText =
    periodSummaryEnough && periodChangePercent !== null
      ? `${periodChangePercent > 0 ? "+" : periodChangePercent < 0 ? "-" : ""}${Math.abs(
        periodChangePercent
      )}% vs ${changeLabel}`
      : "";
  const changePercentTextColor =
    periodSummaryEnough && periodChangePercent !== null
      ? periodChangePercent > 0
        ? "#1ABC9C"
        : periodChangePercent < 0
          ? "#F66B6B"
          : "#999999"
      : "#B5A6D2";
  const scorePosition = getScorePosition(effectiveScore);

  return (
    <main className="pr-[15px] pl-[15px]">
      {/* Score Card: period average diet health (week or month) vs previous period */}
      <div className="bg-white rounded-[27px] p-[32px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] mb-[29px] relative">
        <div className="flex items-center justify-between">
          <div className="pl-[50px]">
            <div className="text-3xl font-medium text-[#B5A6D2] text-center">
              {periodSummaryEnough ? effectiveScore : "—"}
            </div>
            <div className="text-sm text-custom-12 text-center">
              {effectiveStatus}
            </div>
          </div>
          <div
            className="text-base text-center pr-[50px]"
            style={{ color: changePercentTextColor }}
          >
            {effectiveChangeText}
          </div>
        </div>

        {/* Progress Bar (Health Score) */}
        <div className="mt-4">
          <div
            className="h-2 rounded-full relative overflow-visible"
            style={{
              background: `linear-gradient(to right,
                  #F66B6B 0%,
                  #FBC02D 60%,
                  #1ABC9C 80%,
                  #1ABC9C 100%)`,
            }}
          >
            {/* Indicator (outer ring + inner fill) */}
            {/* <div
                className="absolute -top-2.5 w-5 h-5 rounded-full border border-[#9E9E9E] bg-white flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.12)]"

              > */}
            <div
              className="w-3 h-2 rounded-full absolute items-center justify-center -top-0.3 border-[#1ABC9C] border"
              style={{
                backgroundColor: "white",
                left: `${effectiveScore}%`,
                transform: "translateX(-50%)",
              }}
            />
          </div>
          {/* </div> */}
        </div>

        {loadingDietScores && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Loader />
          </div>
        )}
      </div>

      {/* Daily Type Distribution */}
      <div className="text-base mb-3 font-medium pl-[15px] text-primary">Daily Types</div>
      <div
        className={`bg-white rounded-[20px] p-6 shadow-[2px_0_10px_rgba(3,3,3,0.1)] mb-[34px] relative ${!trendCategoryOk ? "opacity-60 grayscale" : ""}`}
      >
        <div className="flex items-end justify-between gap-2">
          {dailyTypeValues.map((value, index) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className="flex flex-col items-center flex-1"
              title={`${dailyTypeLabels[index].label}: ${value}% of today’s diet calories`}
            >
              {/* Colored Bar with Gray Background and Icon Inside */}
              <div
                className="w-full bg-[#E6E6E6] rounded-lg relative overflow-hidden flex flex-col"
                style={{ height: "120px" }}
              >
                {/* Circular Icon at Top */}
                <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mx-auto mt-2 mb-2 z-10">
                  <img
                    src={
                      [
                        GrainsImage,
                        ProteinImage,
                        FruitsVegImage,
                        DairyImage,
                        OtherImage,
                      ][index]
                    }
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
                <span
                  className="whitespace-nowrap"
                  style={{ color: "#705d57" }}
                >
                  {dailyTypeLabels[index].label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {loadingTrendData && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Loader />
          </div>
        )}
      </div>

      {/* Diet Trends */}
      <div className="text-primary text-base font-medium pl-[15px] mb-[14px] mt-9">Diet & Bowel Trends</div>
      {(!trendMacroOk || !trendCategoryOk) && (
        <div className="text-sm text-[#705d57] pl-[15px] mb-2">
          Insufficient data, continue recording
        </div>
      )}
      <div
        className={`w-full rounded-[27px] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.08)] space-y-4 ${!trendMacroOk || !trendCategoryOk ? "opacity-60 grayscale" : ""}`}
      >
        {/* Date pills */}
        <div className="flex gap-2 overflow-x-auto items-center justify-center pt-[23px]">
          {dates.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDate(d)}
              className={`px-2 py-1 rounded-full text-xs ${selectedDate === d
                ? "bg-[#b5a6d2] text-white"
                : "bg-[#f4f4f4] text-[#705d57]"
                }`}
              aria-label={
                selectedDate === d
                  ? `Selected date ${d} in diet and bowel trends`
                  : `Select date ${d} in diet and bowel trends`
              }
            >
              {d}
            </button>
          ))}
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 pl-[20px]">
          <span className="text-lg"><MdRamenDining className="text-secondary" /></span>
          <h2 className="text-sm font-medium text-secondary">Diet Trends</h2>
        </div>

        {/* Chart */}
        <div className="h-48 grid grid-cols-[30px_1fr] gap-2 relative pl-[10px] pr-[10px]">
          {/* LEFT LABELS */}
          <div className="flex flex-col justify-between text-xs pt-2 pb-6">
            <span className="text-green-600">Fiber</span>
            <span className="text-blue-600">Protein</span>
            <span className="text-yellow-600">Fat</span>
            <span className="text-red-600">Sugar</span>
          </div>
          <div className="relative">
            <Suspense
              fallback={
                <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                  <Loader />
                </div>
              }
            >
              <DietLineChart
                data={dietTrendData}
                options={dietTrendOptions}
                loading={loadingTrendData}
                Loader={Loader}
              />
            </Suspense>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 text-xs mb-[32px]">
          <Legend color="bg-green-500" label="Fiber" />
          <Legend color="bg-blue-500" label="Protein" />
          <Legend color="bg-yellow-500" label="Fat" />
          <Legend color="bg-red-500" label="Sugar" />
        </div>
      </div>

      {/* Bowel Trend */}
      {!trendBowelOk && (
        <div className="text-sm text-[#705d57] pl-[15px] mb-2 mt-6">
          Insufficient data, continue recording
        </div>
      )}
      <div
        className={`w-full rounded-[27px] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.08)] space-y-4 mt-8 ${!trendBowelOk ? "opacity-60 grayscale" : ""}`}
      >
        {/* Date pills */}
        <div className="flex gap-2 overflow-x-auto items-center justify-center pt-[23px]">
          {dates.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDate(d)}
              className={`px-2 py-1 rounded-full text-xs ${selectedDate === d
                ? "bg-[#b5a6d2] text-white"
                : "bg-[#f4f4f4] text-[#705d57]"
                }`}
              aria-label={
                selectedDate === d
                  ? `Selected date ${d} in bowel trend`
                  : `Select date ${d} in bowel trend`
              }
            >
              {d}
            </button>
          ))}
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 pl-[20px]">
          <span className="text-xl"><FaPoo className="text-secondary" /></span>
          <h2 className="text-sm font-medium text-secondary">Bowel Trend</h2>
        </div>

        {/* Chart with left labels */}
        <div className="h-48 grid grid-cols-[30px_1fr] gap-2 relative pl-[10px] pr-[10px]">
          {/* LEFT LABELS */}
          <div className="flex flex-col justify-between pb-6 pt-4 text-xs">
            <span className="text-teal-500">Freq</span>
            <span className="text-purple-500">Consis</span>
            <span className="text-amber-500">Ease</span>
            <span className="text-gray-600">Overall</span>
          </div>

          {/* CHART */}
          <div className="relative">
            <Suspense
              fallback={
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
                  <Loader />
                </div>
              }
            >
              <BowelLineChart
                data={dietBoweldata}
                options={dietBowelOptions}
                loading={loadingTrendData}
                Loader={Loader}
              />
            </Suspense>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 text-xs mb-[32px]">
          <Legend color="bg-teal-500" label="Freq" />
          <Legend color="bg-purple-500" label="Consis" />
          <Legend color="bg-amber-500" label="Ease" />
          <Legend color="bg-stone-500" label="Overall" />
        </div>
      </div>

      {showUpgrade && <Upgrade />}
    </main >
  );
};

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-1 text-secondary text-xs">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  )
}

export default Free;
