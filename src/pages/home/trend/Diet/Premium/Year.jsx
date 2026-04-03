import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Info } from "lucide-react";
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend
);
import { Bar, Line, Radar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import { getTrendDietYearlySummary, postTrendDietYearlyAdvice } from "@/api/http";
const Year = ({ referenceDate }) => {
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();

  //   in take ratio chart
  const [inTakeRatioLabels, setInTakeRatioLabels] = useState([
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]);
  const [fiberYear, setFiberYear] = useState(Array(12).fill(0));
  const [proteinYear, setProteinYear] = useState(Array(12).fill(0));
  const [fatYear, setFatYear] = useState(Array(12).fill(0));
  const [sugarYear, setSugarYear] = useState(Array(12).fill(0));
  const [yearlySummary, setYearlySummary] = useState("");
  const [yearlyGoals, setYearlyGoals] = useState([

  ]);
  const [keyTransitions, setKeyTransitions] = useState([

  ]);
  const [loadingYear, setLoadingYear] = useState(false);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [showAnnualAnalysis, setShowAnnualAnalysis] = useState(false);
  const [showDietBowelFindings, setShowDietBowelFindings] = useState(false);

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchYearly = async () => {
      setLoadingYear(true);
      try {
        const res = await getTrendDietYearlySummary(api, {
          params: {
            userId: auth.user.id,
            referenceDate: referenceDate ? referenceDate.toISOString() : undefined,
          },
        });
        const payload = res.data?.data ?? res.data;
        if (!payload) return;

        if (Array.isArray(payload.labels) && payload.labels.length === 12) {
          setInTakeRatioLabels(payload.labels);
        }
        if (Array.isArray(payload.fiber)) setFiberYear(payload.fiber);
        if (Array.isArray(payload.protein)) setProteinYear(payload.protein);
        if (Array.isArray(payload.fat)) setFatYear(payload.fat);
        if (Array.isArray(payload.sugar)) setSugarYear(payload.sugar);

        setLoadingAdvice(true);
        try {
          const adviceRes = await postTrendDietYearlyAdvice(api, {
            userId: auth.user.id,
            referenceDate: referenceDate ? referenceDate.toISOString() : undefined,
          });
          const advicePayload = adviceRes.data?.data ?? adviceRes.data;
          if (advicePayload) {
            if (typeof advicePayload.summary === "string" && advicePayload.summary.trim()) {
              setYearlySummary(advicePayload.summary.trim());
            }
            if (Array.isArray(advicePayload.goals) && advicePayload.goals.length) {
              setYearlyGoals(
                advicePayload.goals
                  .filter((g) => typeof g === "string" && g.trim())
                  .slice(0, 3)
              );
            }
            if (Array.isArray(advicePayload.keyTransitions) && advicePayload.keyTransitions.length) {
              setKeyTransitions(
                advicePayload.keyTransitions
                  .filter(
                    (k) =>
                      k &&
                      typeof k.period === "string" &&
                      k.period.trim() &&
                      typeof k.note === "string" &&
                      k.note.trim()
                  )
                  .slice(0, 2)
              );
            }
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("Failed to load yearly diet advice:", error);
        } finally {
          setLoadingAdvice(false);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load yearly diet summary:", error);
      } finally {
        setLoadingYear(false);
      }
    };

    fetchYearly();
  }, [api, auth?.user?.id, referenceDate]);

  const inTakeRatioData = {
    labels: inTakeRatioLabels,
    datasets: [
      {
        label: "Fiber",
        data: fiberYear,
        backgroundColor: "rgba(34,197,94,0.6)",
        borderColor: "#22C55E",
        fill: true,
        tension: 0.4,
        stack: "stack1",
      },
      {
        label: "Protein",
        data: proteinYear,
        backgroundColor: "rgba(59,130,246,0.6)",
        borderColor: "#3B82F6",
        fill: true,
        tension: 0.4,
        stack: "stack1",
      },
      {
        label: "Fat",
        data: fatYear,
        backgroundColor: "rgba(245,158,11,0.6)",
        borderColor: "#F59E0B",
        fill: true,
        tension: 0.4,
        stack: "stack1",
      },
      {
        label: "Sugar",
        data: sugarYear,
        backgroundColor: "rgba(239,68,68,0.6)",
        borderColor: "#EF4444",
        fill: true,
        tension: 0.4,
        stack: "stack1",
      },
    ],
  };
  const inTakeRatioOptions = {
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
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}%`,
        },
      },
    },
    scales: {
      y: {
        stacked: true,
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
          callback: (v) => `${v}%`,
          font: { size: 11 },
        },
        grid: {
          color: "#E5E7EB",
          borderDash: [4, 4],
        },
      },
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
    },
  };

  //   sensitive food chart
  const sensitiveFoodLabels = [
    "Spicy food",
    "Dairy",
    "Fried food",
    "Sugar",
    "Gluten (bread)",
  ];
  const sensitiveFoodValues = [82, 75, 72, 68, 55];
  const sensitiveFoodColors = [
    "#DC2626", // High
    "#F97316", // Mod-High
    "#F97316",
    "#FACC15", // Moderate
    "#FACC15",
  ];
  const sensitiveFoodData = {
    labels: sensitiveFoodLabels,
    datasets: [
      // background track
      //   {
      //     data: sensitiveFoodLabels.map(() => 100),
      //     backgroundColor: "#E5E7EB",
      //     borderRadius: 8,
      //     barThickness: 14,
      //   },
      // actual value
      {
        data: sensitiveFoodValues,
        backgroundColor: sensitiveFoodColors,
        borderRadius: 8,
        barThickness: 14,
      },
    ],
  };
  const sensitiveFoodOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw}%`,
        },
      },
      datalabels: { display: false },
    },
    scales: {
      x: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
          callback: (v) => `${v}%`,
          font: { size: 10 },
        },
        grid: { color: "#E5E7EB" },
      },
      y: {
        ticks: {
          font: { size: 11 },
        },
        grid: { display: false },
      },
    },
  };

  const dietBoweldata = {
    labels: ["Fiber", "Protein", "Fat", "Sugar", "Refined", "Processed"],
    datasets: [
      {
        label: "Diet Intensity",
        data: [75, 80, 60, 65, 70, 55],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.25)",
        pointBackgroundColor: "#3B82F6",
        pointRadius: 3,
      },
      {
        label: "Bowel Quality",
        data: [70, 78, 50, 55, 60, 48],
        borderColor: "#EF4444",
        backgroundColor: "rgba(239,68,68,0.25)",
        pointBackgroundColor: "#EF4444",
        pointRadius: 3,
      },
    ],
  };
  const dietBowelOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}`,
        },
      },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          display: false,
        },
        grid: {
          color: "#E5E7EB",
        },
        angleLines: {
          color: "#E5E7EB",
        },
        pointLabels: {
          font: { size: 11 },
          color: "#6B7280",
        },
      },
    },
  };

  return (
    <div className="px-4 sm:px-[15px] mt-[15px]">
      {/* Annual Trend of Food */}
      <div className="text-primary font-medium text-base pl-1 sm:pl-[15px] mb-3">
        Annual Trend of Food
      </div>
      <div className="w-full rounded-[20px] bg-white px-4 py-5 sm:p-5 shadow-[2px_0_10px_rgba(0,0,0,0.15)]">
        <h2 className="mb-[10px] text-base text-secondary">
          Intake Ratio (%)
        </h2>

        <div className="h-40">
          {loadingYear ? (
            <Loader />
          ) : (
            <Line data={inTakeRatioData} options={inTakeRatioOptions} />
          )}
        </div>
      </div>

      {/* Next Month's Goals */}
      <div className="w-full rounded-[12px] bg-[#EFF6FF] border border-custom-8 px-4 py-5 sm:p-5 shadow-[0_2px_4px_rgba(0,0,0,0.08)] space-y-3 mt-5 relative">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-medium text-primary">Next Month’s Goals</h2>
          <button
            type="button"
            className="text-xs text-blue-500 hover:underline"
            onClick={() => setShowAnnualAnalysis((prev) => !prev)}
          >
            {showAnnualAnalysis ? "Hide Analysis" : "View Analysis"}
          </button>
        </div>

        {/* Goals (from AI yearlyAdvice) */}
        <ul className="space-y-2 text-base text-secondary">
          {loadingAdvice ? (
            <div className="flex items-center justify-center py-2">
              <Loader />
            </div>
          ) : yearlyGoals.length ? (
            yearlyGoals.map((goal, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-secondary" />
                <span>{goal}</span>
              </li>
            ))
          ) : (
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-secondary" />
              <span>
                Once enough yearly diet data is available, AI will suggest 2–3 clear goals for
                the coming month.
              </span>
            </li>
          )}
        </ul>

        {/* AI annual analysis cards (design from screenshot) */}
        {showAnnualAnalysis && (
          loadingAdvice ? (
            <div className="flex items-center justify-center py-4">
              <Loader />
            </div>
          ) : (
            <div className="space-y-3 mt-2">
              {/* First Half Analysis */}
              <div className="rounded-[12px] bg-white p-4 border border-custom-8">
                <p className="text-sm text-primary mb-2">First Half Analysis</p>
                <p className="text-xs text-secondary">
                  <span className=" text-[#2563eb]">Change: </span>
                  {yearlyGoals[0] ||
                    "Once enough yearly data is available, AI will summarize how fiber, fat and sugar shifted in the first half of the year."}
                </p>
                <p className="text-xs text-secondary mt-1">
                  <span className=" text-[#28b070]">Impact: </span>
                  {yearlySummary ||
                    "Early yearly trends suggest that balanced fiber and moderate fat support smoother bowel movements."}
                </p>
              </div>

              {/* Second Half Analysis */}
              <div className="rounded-[12px] bg-white p-4 border border-custom-8">
                <p className="text-base text-primary mb-2">Second Half Analysis</p>
                <p className="text-xs text-secondary">
                  <span className=" text-[#28b070]">Change: </span>
                  {yearlyGoals[1] ||
                    "AI will highlight how holiday or seasonal eating in the second half affects fat and sugar balance once more data is collected."}
                </p>
                <p className="text-xs text-secondary mt-1">
                  <span className=" text-[#2563eb]">Impact: </span>
                  {yearlySummary ||
                    "Shifts in fat and sugar later in the year may relate to more sensitive gut days compared with the first half."}
                </p>
              </div>

              {/* Annual Analysis */}
              <div className="rounded-[12px] bg-white p-4 border border-custom-8">
                <p className="text-sm text-primary mb-2">Annual Analysis</p>
                <p className="text-xs text-secondary">
                  <span className=" text-[#28b070]">Change: </span>
                  {yearlyGoals[2] ||
                    "Overall fiber and protein trends versus fat and sugar will be summarized here as more yearly data accumulates."}
                </p>
                <p className="text-xs text-secondary mt-1">
                  <span className=" text-[#2563eb]">Impact: </span>
                  {yearlySummary ||
                    "Current AI summary suggests that consistent fiber with controlled fat and sugar supports more stable bowel comfort over the year."}
                </p>
              </div>

              {/* Annual Suggestion */}
              <div className="rounded-[12px] bg-[#fefce8] p-4 border border-custom-8">
                <p className="text-xs font-medium text-primary mb-1">Annual Suggestion</p>
                <p className="text-xs text-secondary">
                  {yearlyGoals[0] ||
                    "Keep the balanced pattern from your best months, reduce heavy fat & sugar bursts in festive periods, and add a small daily fiber habit."}
                </p>
              </div>
            </div>
          )
        )}
      </div>

      {/* Key Transition */}
      <div className="w-full rounded-[12px] bg-white px-4 py-6 sm:p-6 shadow-[0_2px_4px_rgba(0,0,0,0.08)] space-y-3 mt-5 border border-[#d3d3d3]">
        {/* Title */}
        <h2 className="text-sm text-primary">Key Transition</h2>

        {/* Items */}
        {loadingAdvice ? (
          <div className="flex items-center justify-center py-2">
            <Loader />
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 text-sm text-gray-700">
            {keyTransitions.slice(0, 2).map((kt, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={index} className="flex items-start gap-2">
                <span
                  className={`mt-1 h-2.5 w-2.5 rounded-full ${kt.status === "positive"
                    ? "bg-green-500"
                    : kt.status === "caution"
                      ? "bg-yellow-400"
                      : "bg-gray-400"
                    }`}
                />
                <div>
                  <p className="text-secondary text-sm">{kt.period}</p>
                  <p className="text-secondary text-sm">{kt.note}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sensitive Foods */}
      <div className="text-primary text-base font-medium pl-1 sm:pl-[15px] mb-3 mt-5">
        Top Sensitivie Foods
      </div>
      <div className="w-full max-w-sm rounded-[20px] bg-white px-4 py-5 sm:p-5 shadow-md space-y-4 mx-auto">
        {/* Header */}
        <div>
          <h2 className="text-base mb-5 text-secondary">About Sensitive Foods</h2>
          <p className="text-sm text-custom-12">
            Sensitive foods link to constipation/bloating. Based on early diet &
            bowel records, showing top 5 foods. Click bars for advice.
          </p>
        </div>

        {/* Chart */}
        <div className="h-40">
          <Bar data={sensitiveFoodData} options={sensitiveFoodOptions} />
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 text-xs">
          <SensitiveFoodLegend color="bg-yellow-400" label="Moderate" />
          <SensitiveFoodLegend color="bg-orange-400" label="Mod-High" />
          <SensitiveFoodLegend color="bg-red-600" label="High" />
        </div>

        {/* Findings */}
        <div className="space-y-2 text-sm text-secondary">
          <p className="font-medium text-primary text-base">Overall Findings</p>
          <ul className="list-disc pl-4 space-y-1 text-secondary text-sm">
            <li>Gluten (bread) → constipation</li>
            <li>Dairy & caffeine → bloating</li>
            <li>Sugar & fried foods → gut harm</li>
          </ul>
        </div>
      </div>

      {/* Diet & Bowel */}
      <div className="text-primary text-base font-medium pl-1 sm:pl-[15px] mb-3 mt-5">
        Diet & Bowel
      </div>
      <div className="w-full rounded-[20px] bg-white px-4 py-5 sm:p-5 shadow-[2px_0_10px_rgba(0,0,0,0.15)] space-y-4">
        {/* Header */}
        <div className="rounded-[12px] bg-[#EFF6FF] p-4 text-sm border border-custom-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 text-primary">
              Diet and Bowel Movement
            </div>
            <button
              type="button"
              className="text-xs text-blue-500 hover:underline"
              onClick={() => setShowDietBowelFindings((prev) => !prev)}
            >
              {showDietBowelFindings ? "Hide Analysis" : "View Analysis"}
            </button>
          </div>
          <p className="text-xs text-custom-12">
            This radar chart shows how diet types affect bowel quality. Click
            each category for details.
          </p>
        </div>

        {/* Radar */}
        <div className="h-56">
          <Radar data={dietBoweldata} options={dietBowelOptions} />
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 text-xs">
          <DietBowelLegend color="bg-blue-500" txtcolor="text-blue-500" label="Diet Intensity" />
          <DietBowelLegend color="bg-red-500" txtcolor="text-red-500" label="Bowel Quality" />
        </div>

        {/* Status */}
        <div className="flex justify-center gap-6 text-xs text-secondary">
          <Status color="bg-green-500" label="Positive" />
          <Status color="bg-yellow-400" label="Neutral" />
          <Status color="bg-red-500" label="Negative" />
        </div>

        {/* Findings (toggled by View Analysis) */}
        {showDietBowelFindings && (
          <div className="text-sm space-y-2">
            <p className="text-primary text-base mb-2">Annual Correlation</p>
            <p className="text-secondary text-xs mb-4">
              {loadingAdvice
                ? "Summarizing how your yearly diet pattern relates to gut comfort…"
                : yearlySummary ||
                "Fiber and protein appear supportive, while higher fat and sugar periods may relate to gut discomfort."}
            </p>
            <ul className="list-disc pl-4 space-y-1 text-secondary text-sm">
              {yearlyGoals.map((goal, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={index}>{goal}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center text-custom-12 p-4 italic text-sm mt-3 text-center">
        This analysis is based on recent behavior and health indicators, for
        reference only
      </div>

      <div className="flex items-center justify-center mt-[27px] mb-[27px]">
        <button
          className="flex items-center justify-center bg-white rounded-[8px] px-6 py-2 text-lg text-secondary shadow-md"
          onClick={() =>
            navigate("/trend-analysis?plan=free", { state: { trendType: "diet", viewMode: "week" } })
          }
        >
          OverView
        </button>
      </div>
    </div>
  );
};

function SensitiveFoodLegend({ color, label }) {
  return (
    <div className="flex items-center gap-1 text-custom-12 mb-[33px]">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}

function DietBowelLegend({ color, txtcolor, label }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span className={`${txtcolor}`}>{label}</span>
    </div>
  );
}

function Status({ color, label }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}

export default Year;
