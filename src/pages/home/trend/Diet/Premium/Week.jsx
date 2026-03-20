import { Chart as ChartJS, LinearScale, PointElement, Tooltip } from "chart.js";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import Loader from "@/components/common/Loader";

ChartJS.register(LinearScale, PointElement, Tooltip);
import { Scatter } from "react-chartjs-2";

const Week = ({ referenceDate }) => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();

  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [selectedCorrelation, setSelectedCorrelation] = useState(null);

  // X: meal time dimension, Y: stool quality score (1–7, Bristol-like)
  const xLabels = ["Breakfast", "Lunch", "Dinner", "Late Night"];

  const stoolScale = [
    { score: 1, label: "Constipation (Type 1)" },
    { score: 2, label: "Constipation (Type 2)" },
    { score: 3, label: "Healthy (Type 3)" },
    { score: 4, label: "Healthy (Type 4)" },
    { score: 5, label: "Loose (Type 5)" },
    { score: 6, label: "Loose (Type 6)" },
    { score: 7, label: "Diarrhea (Type 7)" },
  ];

  const strength = {
    weak: { color: "#84CC16", r: 4, weight: 1 },
    moderate: { color: "#FACC15", r: 6, weight: 2 },
    modStrong: { color: "#FB923C", r: 8, weight: 3 },
    strong: { color: "#EF4444", r: 10, weight: 4 },
  };

  // Example weekly correlation events (meal + next bowel event)
  const rawCorrelationEvents = [
    {
      mealIndex: 0,
      mealLabel: "Breakfast",
      foodType: "High Fat",
      stoolScore: 2,
      strengthKey: "strong",
    },
    {
      mealIndex: 1,
      mealLabel: "Lunch",
      foodType: "High Fiber",
      stoolScore: 4,
      strengthKey: "modStrong",
    },
    {
      mealIndex: 2,
      mealLabel: "Dinner",
      foodType: "Spicy / High Fat",
      stoolScore: 6,
      strengthKey: "moderate",
    },
    {
      mealIndex: 3,
      mealLabel: "Late Night",
      foodType: "Snack / Processed",
      stoolScore: 5,
      strengthKey: "moderate",
    },
    {
      mealIndex: 2,
      mealLabel: "Dinner",
      foodType: "Balanced",
      stoolScore: 3,
      strengthKey: "weak",
    },
    {
      mealIndex: 1,
      mealLabel: "Lunch",
      foodType: "Processed / Fast Food",
      stoolScore: 5,
      strengthKey: "moderate",
    },
  ];

  const correlationPoints = rawCorrelationEvents.map((ev, idx) => ({
    x: ev.mealIndex,
    y: ev.stoolScore,
    strengthKey: ev.strengthKey,
    index: idx,
    color: strength[ev.strengthKey].color,
    r: strength[ev.strengthKey].r,
  }));

  const data = {
    datasets: [
      {
        label: "Correlation",
        data: correlationPoints,
        pointBackgroundColor: (ctx) => ctx.raw.color,
        pointRadius: (ctx) => ctx.raw.r,
      },
    ],
  };

  const describeCorrelation = (event) => {
    const stoolInfo =
      stoolScale.find((s) => s.score === event.stoolScore) || stoolScale[2];

    if (event.mealLabel === "Breakfast" && event.foodType.includes("High Fat")) {
      return `High‑fat breakfast is linked with ${stoolInfo.label.toLowerCase()}. Greasy or low‑fiber breakfasts may slow gut motility. Add fiber (oats, fruit, whole grains) and increase morning hydration.`;
    }
    if (event.mealLabel === "Lunch" && event.foodType.includes("High Fiber")) {
      return `High‑fiber lunch is associated with ${stoolInfo.label.toLowerCase()}. Vegetables, legumes, and whole grains at lunch appear to support healthier stools the same or next day.`;
    }
    if (event.mealLabel === "Late Night") {
      return `Late‑night snacking is related to ${stoolInfo.label.toLowerCase()}. Eating close to bedtime, especially processed or sugary foods, can make digestion unstable. Try moving the last meal earlier and keeping it lighter.`;
    }

    return `This hotspot shows that ${event.mealLabel.toLowerCase()} (${event.foodType.toLowerCase()}) is followed by ${stoolInfo.label.toLowerCase()}. Adjust fat, fiber, and timing at this meal to nudge stools toward the healthy 3–4 range.`;
  };

  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchWeeklyDietAdvice = async () => {
      setLoadingAdvice(true);
      try {
        // Reuse weekly macro scores as the basis for premium analysis
        const res = await api.get("/trend/diet/macroWeekly", {
          params: {
            userId: auth.user.id,
            referenceDate: referenceDate ? referenceDate.toISOString() : undefined,
          },
        });
        const payload = res.data?.data ?? res.data;
        if (!payload) return;

        const avg = (arr) =>
          Array.isArray(arr) && arr.length
            ? Math.round(
                arr.reduce((sum, v) => sum + (Number(v) || 0), 0) / arr.length
              )
            : 0;

        const fiber = avg(payload.fiber);
        const protein = avg(payload.protein);
        const fat = avg(payload.fat);
        const sugar = avg(payload.sugar);
        const sodium = 60; // neutral placeholder – sodium not tracked explicitly

        const overallScore = Math.round(
          (fiber + protein + (100 - Math.max(0, fat - 60)) + (100 - sugar) + (100 - sodium)) /
            5
        );

        const adviceRes = await api.post("/trend/diet/weeklyAdvice", {
          fiberAvg: fiber,
          proteinAvg: protein,
          fatAvg: fat,
          sugarAvg: sugar,
          sodiumAvg: sodium,
          overallScore,
        });
        const advicePayload = adviceRes.data?.data ?? adviceRes.data;
        if (advicePayload) {
          setAiAnalysis(
            Array.isArray(advicePayload.analysis) ? advicePayload.analysis : []
          );
          setAiRecommendations(
            Array.isArray(advicePayload.recommendations)
              ? advicePayload.recommendations
              : []
          );
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load premium weekly diet advice:", error);
        setAiAnalysis([]);
        setAiRecommendations([]);
      } finally {
        setLoadingAdvice(false);
      }
    };

    fetchWeeklyDietAdvice();
  }, [api, auth?.user?.id, referenceDate]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: { display: false },
    },
    scales: {
      x: {
        min: -0.5,
        max: xLabels.length - 0.5,
        ticks: {
          callback: (v) => xLabels[v] ?? "",
          font: { size: 11 },
        },
        grid: { color: "#E5E7EB" },
      },
      y: {
        min: 0.5,
        max: 7.5,
        ticks: {
          stepSize: 1,
          callback: (v) => {
            const entry = stoolScale.find((s) => s.score === v);
            return entry ? `${v}` : "";
          },
          font: { size: 10 },
        },
        grid: { color: "#E5E7EB" },
      },
    },
  };
  return (
    <div className="pl-[15px] pr-[15px] mt-[33px]">
      <div className="w-full rounded-[20px] bg-white p-5 shadow-[2px_0_10px_rgba(0,0,0,0.15)] space-y-4">
        {/* Header */}
        <div>
          <h2 className="text-base mt-5 text-primary">
            Meal–Bowel Correlation
          </h2>
          <p className="text-xs text-custom-12">
            Each dot links a meal event with the next bowel result (stool score 1–7).
          </p>
        </div>

        {/* Top correlations summary (from AI weeklyAdvice) */}
        <div className="rounded-[10px] bg-[#f9fafb] p-3 text-xs text-secondary border border-custom-8">
          <p className="font-medium text-primary mb-1">Strongest patterns this week</p>
          {loadingAdvice ? (
            <div className="flex items-center justify-center py-2">
              <Loader />
            </div>
          ) : aiAnalysis && aiAnalysis.length ? (
            <ul className="list-disc list-inside space-y-0.5">
              {aiAnalysis.slice(0, 3).map((row, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={index}>{row.text}</li>
              ))}
            </ul>
          ) : (
            <ul className="list-disc list-inside space-y-0.5">
              <li>Not enough premium diet data this week to rank correlations.</li>
              <li>Add more detailed diet and stool records to unlock insights.</li>
            </ul>
          )}
        </div>

        {/* Chart */}
        <div className="h-44">
          <Scatter
            data={data}
            options={options}
            onClick={(events, elements) => {
              if (!elements || !elements.length) return;
              const first = elements[0];
              const index = first.index;
              const rawPoint = correlationPoints[index];
              if (!rawPoint) return;

              const event = rawCorrelationEvents[rawPoint.index];
              if (!event) return;

              setSelectedCorrelation({
                ...event,
                description: describeCorrelation(event),
              });
            }}
          />
        </div>

        {/* Selected hotspot explanation */}
        {selectedCorrelation && (
          <div className="rounded-[12px] bg-[#eff6ff] p-4 text-sm border-2 border-[#ededef]">
            <p className="font-medium mb-1 text-primary">
              {selectedCorrelation.mealLabel} ({selectedCorrelation.foodType})
            </p>
            <p className="text-xs text-custom-12 mb-1">
              Stool score: {selectedCorrelation.stoolScore}
            </p>
            <p className="text-secondary">{selectedCorrelation.description}</p>
          </div>
        )}

        {/* Legend */}
        <div className="flex justify-between text-xs text-gray-600">
          <Legend color="bg-lime-500" label="Weak" />
          <Legend color="bg-yellow-400" label="Moderate" />
          <Legend color="bg-orange-400" label="Mod-Strong" />
          <Legend color="bg-red-500" label="Strong" />
        </div>

        {/* Tooltip / Detailed analysis */}
        {showDetailedAnalysis && (
          <>
            {/* Backdrop */}
            {/* Modal */}
            <div
              className="bg-[#eff6ff] rounded-[12px] border-2 border-[#ededef] p-5 pointer-events-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-medium text-primary">Detailed Analysis</h3>
                <button
                  onClick={() => setShowDetailedAnalysis(false)}
                  className="text-[#808080] hover:text-[#4A3E35] transition-colors"
                  aria-label="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="space-y-2 text-sm text-[#554B40]">
                {loadingAdvice ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader />
                  </div>
                ) : aiAnalysis.length ? (
                  aiAnalysis.map((row, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <p key={index}>{row.text}</p>
                  ))
                ) : (
                  <>
                    <p>Not enough diet data this week for detailed insights.</p>
                    <p>Add more diet records to improve premium analysis.</p>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {/* High Risk */}
        <div className="rounded-[12px] bg-[#fef2f2] p-4 text-sm border-2 border-[#ededef]">
          <p className="font-medium mb-[10px] text-primary">High-Risk Pattern</p>
          {loadingAdvice ? (
            <div className="flex items-center justify-center py-2">
              <Loader />
            </div>
          ) : (
            <p className="text-secondary">
              {(aiAnalysis.find((row) => row.type === "warn") ||
                aiAnalysis[0] || { text: "Not enough diet data this week." }
              ).text}
            </p>
          )}
        </div>

        {/* Overall Trend */}
        <div className="rounded-[12px] bg-[#f0fdf4] p-4 text-sm space-y-1 border-2 border-[#ededef]">
          <p className="font-medium mb-[10px] text-primary">Overall Diet Trend</p>
          {loadingAdvice ? (
            <div className="flex items-center justify-center py-2">
              <Loader />
            </div>
          ) : aiRecommendations.length ? (
            aiRecommendations.map((line, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <p key={index} className="text-secondary">
                {line}
              </p>
            ))
          ) : (
            <>
              <p className="text-secondary">
                Diet looks mostly balanced; keep fiber and protein steady.
              </p>
              <p className="text-secondary">
                Reduce very fatty or sugary dinners on a few days.
              </p>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center text-custom-12 italic text-sm mt-3 text-center p-4">
        This analysis is based on recent behavior and health indicators, for
        reference only
      </div>

      <div className="flex items-center justify-center mt-[27px] mb-[27px]">
        <button
          className="flex items-center justify-center bg-white rounded-[8px] px-6 py-2 text-lg text-secondary"
          onClick={() =>
            navigate("/trend-analysis?plan=premium", { state: { trendType: "diet", viewMode: "month" } })
          }
        >
          OverView
        </button>
      </div>
    </div>
  );
};

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-1 mb-[28px]">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span className="text-custom-12">{label}</span>
    </div>
  );
}

export default Week;
