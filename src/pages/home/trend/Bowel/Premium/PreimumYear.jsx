import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Info } from "lucide-react";
import { FaUserDoctor } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useApiClient from "@/hooks/useApiClient";
import {
  getTrendBowelYearlyTopFoods,
  getTrendBowelYearlyTrend,
  postTrendBowelPremiumYearAdvice,
} from "@/api/http";
import { useSelector } from "react-redux";
import Loader from "@/components/common/Loader";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const PremiumYear = () => {
  const navigate = useNavigate();
  const api = useApiClient();
  const auth = useSelector((state) => state.auth);

  const [analysis, setAnalysis] = useState({
    foodTips: "",
    seasonal: "",
    actionPlan: "",
  });
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [foods, setFoods] = useState([
    {
      rank: 1,
      name: "Milk",
      sensit: "86%",
      main: "Diarrhea",
      second: "Abd Pain",
      type: 7,
      bg: "#fcc", // Pink
    },
    {
      rank: 2,
      name: "Peanuts",
      sensit: "74%",
      main: "Constip",
      second: "Abd Pain",
      type: 2,
      bg: "#fff0ac", // Yellow
    },
    {
      rank: 3,
      name: "Seafood",
      sensit: "65%",
      main: "Bloat",
      second: "Abd Pain",
      type: 6,
      bg: "#fff0ac", // Light yellow
    },
  ]);
  const [foodsLoading, setFoodsLoading] = useState(false);

  // Yearly gut index series (current vs last year)
  const [gutIndex, setGutIndex] = useState(Array(12).fill(0));
  const [lastYearIndex, setLastYearIndex] = useState(Array(12).fill(0));
  const [seasonalTrend, setSeasonalTrend] = useState([3, 3, 3, 3]); // SPRING,SUMMER,AUTUMN,WINTER on 1–5 scale
  const [trendLoading, setTrendLoading] = useState(false);

  const overallLabels = Array.from({ length: 12 }, (_, i) => i + 1);
  const overallData = {
    labels: overallLabels,
    datasets: [
      {
        label: "Gut Index",
        data: gutIndex,
        borderColor: "#22C55E", // Green
        backgroundColor: "transparent",
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#22C55E",
        pointBorderColor: "#22C55E",
        pointBorderWidth: 0,
        fill: false,
      },
      {
        label: "Last Yr",
        data: lastYearIndex,
        borderColor: "#9CA3AF", // Gray
        backgroundColor: "transparent",
        borderDash: [6, 6], // Dashed line
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0, // No points for dashed line
        fill: false,
      },
    ],
  };
  const overallOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        align: "start",
        labels: {
          color: "#6B7280", // Medium gray for both labels
          usePointStyle: false,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "white",
        titleColor: "#50403c",
        titleFont: {
          size: 18,
          weight: "bold",
        },
        bodyColor: "#9ca3af",
        bodyFont: {
          size: 14,
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 6,
        usePointStyle: false,
        callbacks: {
          title: (context) => {
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
            const index = context[0].dataIndex;
            return monthNames[index] || `Month ${index + 1}`;
          },
          label: (context) => {
            const label =
              context.dataset.label === "Gut Index"
                ? "Gut Health"
                : context.dataset.label === "Last Yr"
                  ? "Last Year"
                  : context.dataset.label;
            return `${label}: ${context.parsed.y}`;
          },
          labelColor: (context) => {
            const datasetLabel = context.dataset.label;
            let color = "#9CA3AF"; // Default gray
            if (datasetLabel === "Gut Index") {
              color = "#22C55E"; // Match Gut Index line color
            } else if (datasetLabel === "Last Yr") {
              color = "#9CA3AF"; // Gray for Last Year
            }
            return {
              borderColor: color,
              backgroundColor: color,
              borderWidth: 0,
              borderRadius: 5,
            };
          },
        },
      },
      datalabels: { display: false },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)", // Faint grid lines
        },
        ticks: {
          stepSize: 1,
          color: "#6b7280",
          font: {
            size: 11,
          },
        },
      },
      y: {
        display: true,
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
          color: "#6b7280",
          font: {
            size: 11,
          },
          callback: function (value) {
            return value;
          },
        },
        grid: {
          display: false,
          color: "rgba(0, 0, 0, 0.05)", // Faint grid lines
        },
      },
    },
  };

  //   Seasonal Stool Trend Chart
  const seasonalData = {
    labels: ["SPRING", "SUMMER", "AUTUMN", "WINTER"],
    datasets: [
      {
        label: "Stool Trend",
        data: seasonalTrend,
        borderColor: "#22C55E",
        backgroundColor: "transparent",
        borderWidth: 3,
        tension: 0.4,
        fill: false,

        // points
        pointRadius: 6,
        pointBackgroundColor: "#22C55E",
        pointBorderColor: "#22C55E",
      },
    ],
  };
  const seasonalOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: { display: false },
    },
    scales: {
      x: {
        grid: {
          borderDash: [4, 4],
          color: "#E5E7EB",
        },
        ticks: {
          font: { weight: "600" },
          color: (context) => {
            const colors = ["#22C55E", "#3B82F6", "#D97706", "#6B7280"]; // Green, Blue, Orange-brown, Dark gray
            return colors[context.index] || "#111827";
          },
        },
      },
      y: {
        min: 1,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: (value) => {
            const map = {
              1: "Loose",
              2: "Rare",
              3: "Best",
              4: "Hard",
              5: "Ideal",
            };
            return map[value] || "";
          },
          color: "#6B7280",
        },
        grid: {
          borderDash: [4, 4],
          color: "#E5E7EB",
        },
      },
    },
  };
  const seasonLabels = ["Loose", "Rare", "Best", "Hard"];

  /**
   * Load yearly top foods, yearly trend, and then AI yearly advice
   * in a single coordinated flow to avoid extra or premature calls.
   */
  useEffect(() => {
    if (!auth?.user?.id) return;

    let isCancelled = false;

    const loadYearlyDataAndAdvice = async () => {
      setFoodsLoading(true);
      setTrendLoading(true);
      setAnalysisLoading(true);

      try {
        const referenceDate = new Date().toISOString();
        const timezoneOffsetMinutes = new Date().getTimezoneOffset();

        const [foodsRes, trendRes] = await Promise.all([
          getTrendBowelYearlyTopFoods(api, {
            params: { userId: auth.user.id, referenceDate },
          }),
          getTrendBowelYearlyTrend(api, {
            params: {
              userId: auth.user.id,
              referenceDate,
              timezoneOffsetMinutes,
            },
          }),
        ]);

        if (isCancelled) return;

        const foodsPayload = foodsRes.data?.data ?? foodsRes.data;
        if (foodsPayload && Array.isArray(foodsPayload.foods) && foodsPayload.foods.length) {
          const mappedFoods = foodsPayload.foods.map((f, idx) => ({
            rank: f.rank ?? idx + 1,
            name: f.name ?? f.food ?? `Food ${idx + 1}`,
            sensit: f.sensit ?? "",
            main: f.main ?? "",
            second: f.second ?? "",
            type: f.type ?? "",
            bg: idx === 0 ? "#fcc" : "#fff0ac",
          }));
          setFoods(mappedFoods);
        }

        const trendPayload = trendRes.data?.data ?? trendRes.data;
        if (trendPayload) {
          if (Array.isArray(trendPayload.gutIndex)) {
            setGutIndex(trendPayload.gutIndex);
          }
          if (Array.isArray(trendPayload.lastYearIndex)) {
            setLastYearIndex(trendPayload.lastYearIndex);
          }
          if (Array.isArray(trendPayload.seasonalTrend)) {
            setSeasonalTrend(trendPayload.seasonalTrend);
          }
        }

        // After we have the latest foods + trend, request AI advice once.
        const advicePayload = {
          foods: (foodsPayload?.foods || []).map((f, idx) => ({
            food: f.name ?? f.food ?? `Food ${idx + 1}`,
            sensit: f.sensit,
            main: f.main,
            second: f.second,
          })),
          gutIndex: Array.isArray(trendPayload?.gutIndex) ? trendPayload.gutIndex : [],
          lastYearIndex: Array.isArray(trendPayload?.lastYearIndex) ? trendPayload.lastYearIndex : [],
          seasonalTrend: Array.isArray(trendPayload?.seasonalTrend) ? trendPayload.seasonalTrend : [],
        };

        const adviceRes = await postTrendBowelPremiumYearAdvice(api, advicePayload);
        if (isCancelled) return;

        const adviceData = adviceRes.data?.data ?? adviceRes.data;
        if (adviceData) {
          setAnalysis({
            foodTips: adviceData.foodTips ?? "",
            seasonal: adviceData.seasonal ?? "",
            actionPlan: adviceData.actionPlan ?? "",
          });
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to load yearly bowel data/advice:", err);
        if (!isCancelled) {
          setAnalysis({
            foodTips:
              "Milk, peanuts and seafood appear most associated with symptoms; adjust timing and portion or try alternatives.",
            seasonal:
              "Gut index dips in colder months, likely from lower water intake and heavier foods.",
            actionPlan:
              "Consider moderating trigger foods and increasing hydration during your weakest seasons; seek medical advice if pain or diarrhea persists.",
          });
        }
      } finally {
        if (!isCancelled) {
          setFoodsLoading(false);
          setTrendLoading(false);
          setAnalysisLoading(false);
        }
      }
    };

    loadYearlyDataAndAdvice();

    return () => {
      isCancelled = true;
    };
  }, [api, auth?.user?.id]);

  return (
    <div className="pl-[15px] pr-[15px]">
      {/* Top 3 Gut-Sensitivity Foods Cards */}
      <div className="w-full max-w-3xl p-4 rounded-[12px] bg-[#FEFAEF] shadow-[0_2px_4px_rgba(0,0,0,0.08)] mb-5 relative">
        {/* Title */}
        <h2 className="mb-6 text-center text-lg font-bold text-primary">
          Top 3 Gut-Sensitivity Foods
        </h2>

        <div className="grid gap-3 grid-cols-3">
          {foods.map((food) => (
            <div
              key={food.rank}
              className="rounded-[8px] p-4"
              style={{ backgroundColor: food.bg }}
            >
              <h3 className="text-base text-primary mb-1 text-center whitespace-nowrap">
                {food.rank}. {food.name}
              </h3>

              <div className="my-2 h-0.5 bg-white" />

              <div className="space-y-1 text-xs text-primary mt-2 text-center whitespace-nowrap">
                <p className="md:text-[10px] sm:text-[5px]">Sensit: {food.sensit}</p>
                <p>Main: {food.main}</p>
                <p>2nd: {food.second}</p>
                <p>Type: {food.type}</p>
              </div>
            </div>
          ))}
        </div>

        {foodsLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#FEFAEF]/60">
            <Loader />
          </div>
        )}
      </div>

      {/* Overall Gut Reaction Chart */}
      <div className="w-full max-w-2xl rounded-[12px] bg-white p-6 shadow-md mb-[15px]">
        {/* Title */}
        <div className="text-center text-base mb-4 text-primary">
          Overall Gut Reaction
        </div>

        {/* Ideal Range Indicator */}
        <div className="mb-[15px] rounded-[8px] bg-gray-100 px-3 py-2 text-sm text-primary">
          Ideal Range
        </div>

        {/* Chart Container with relative positioning for info icon */}
        <div className="relative h-64">
          <style>{`
            div[id*="chartjs-tooltip"],
            .chartjs-tooltip {
              background: white !important;
              border-radius: 8px !important;
              box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
              padding: 12px !important;
            }
            .chartjs-tooltip .chartjs-tooltip-title {
              color: #D38E5A !important;
              font-size: 18px !important;
              font-weight: bold !important;
              margin-bottom: 8px !important;
            }
            .chartjs-tooltip .chartjs-tooltip-body {
              color: #9ca3af !important;
              font-size: 14px !important;
            }
            .chartjs-tooltip .chartjs-tooltip-body-list {
              margin: 0 !important;
              padding: 0 !important;
            }
            .chartjs-tooltip .chartjs-tooltip-body-list li {
              display: flex !important;
              align-items: center !important;
              gap: 8px !important;
              margin: 4px 0 !important;
            }
            .chartjs-tooltip .chartjs-tooltip-body-list li span {
              display: inline-block !important;
              width: 10px !important;
              height: 10px !important;
              border-radius: 50% !important;
            }
          `}</style>
          {trendLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader />
            </div>
          ) : (
            <Line data={overallData} options={overallOptions} className="bg-[#F9FEFA] rounded-sm shadow-sm" />
          )}

          {/* Information Icon Overlay at x=4 (index 3) */}
          {/* <div
            className="absolute"
            style={{
              left: "calc(25% + 8.33% * 3)", // Approximate position for x=4
              top: "calc(50% - 12px)", // Position based on data point
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <Info className="w-4 h-4 text-yellow-800" />
            </div>
          </div> */}
        </div>
      </div>

      <div className="text-xs text-custom-12 text-center">May–Aug 2025 | Swipe ← →</div>

      {/* Seasonal Stool Trend Chart */}
      <div className="w-full max-w-2xl rounded-[8px] bg-septenary p-6 shadow-md mt-5">
        <div className="text-center text-base mb-[31px] text-primary" >
          Seasonal Stool Trends
        </div>


        <div className="relative h-50 bg-white rounded-[8px] border border-[#e6e6e6] p-2">
          {/* "Ideal" label on left */}
          {/* <div className="absolute left-2 top-1/2 transform -translate-y-1/2 -translate-x-full">
            <span className="text-sm text-gray-600 whitespace-nowrap">
              Ideal
            </span>
          </div> */}

          {trendLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
              <Loader />
            </div>
          ) : (
            <Line data={seasonalData} options={seasonalOptions} />
          )}
        </div>
      </div>

      {/* Analysis Card */}
      <div className="w-full max-w-2xl rounded-[8px] bg-[#FEFAEF] p-6 shadow-[0_2px_4px_rgba(0,0,0,0.08)] mt-5">
        {/* Header with Icon and Title */}
        <div className="flex items-center gap-3 mb-4">
          {/* Stethoscope Icon - Person with stethoscope */}
          <FaUserDoctor className="text-[#f2751d] w-[18px] h-[28px]" />
          <h3 className="text-lg text-primary">Analysis Explanation</h3>
        </div>

        {/* Content Sections */}
        <div className="space-y-3 text-secondary text-sm mb-[12px]">
          {analysisLoading ? (
            <div className="flex items-center justify-center py-2">
              <Loader />
            </div>
          ) : (
            <>
              <div>
                <span className="">Food Tips: </span>
                <span>{analysis.foodTips || "Use plant milk, lactase, and adjust portion timing for sensitive foods."}</span>
              </div>
              <div>
                <span className="text-primary">Seasonal: </span>
                <span>
                  {analysis.seasonal ||
                    "Winter GI index is slightly lower, likely from lower water intake and heavier foods."}
                </span>
              </div>
              <div>
                <span className="text-primary">Action: </span>
                <span>
                  {analysis.actionPlan ||
                    "Increase hydration and fiber in colder months and monitor reactions to top trigger foods."}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="text-center text-xs text-custom-12 mt-[12px]">Based on past diet & bowel data, for reference only</div>
      <div className="flex items-center justify-center mt-[27px] mb-[40px]">
        <button
          className="flex items-center justify-center bg-white rounded-[8px] px-6 py-2 text-lg text-secondary"
          onClick={() =>
            navigate("/trend-analysis?plan=premium", {
              state: { trendType: "bowel", viewMode: "month", subscribed: true },
            })
          }
        >
          OverView
        </button>
      </div>
    </div>
  );
};

export default PremiumYear;
