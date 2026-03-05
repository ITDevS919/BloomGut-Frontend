import { Chart as ChartJS, LinearScale, PointElement, Tooltip } from "chart.js";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";

ChartJS.register(LinearScale, PointElement, Tooltip);
import { Scatter } from "react-chartjs-2";

const Week = ({ referenceDate }) => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();

  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  // X: meal time slots, Y: bowel status rows
  const xLabels = ["Early", "Breakfast", "Lunch", "Dinner"];
  const yLabels = ["Constipation", "Undefined", "Bloating", "Smooth"];

  const strength = {
    weak: { color: "#84CC16", r: 4 },
    moderate: { color: "#FACC15", r: 6 },
    modStrong: { color: "#FB923C", r: 8 },
    strong: { color: "#EF4444", r: 10 },
  };

  const data = {
    datasets: [
      {
        label: "Correlation",
        data: [
          // Smooth row (top)
          { x: 0, y: 3, ...strength.weak },
          { x: 1, y: 3, ...strength.moderate },
          { x: 2, y: 3, ...strength.strong },
          { x: 3, y: 3, ...strength.modStrong },

          // Bloating row
          { x: 0, y: 2, ...strength.moderate },
          { x: 1, y: 2, ...strength.modStrong },
          { x: 2, y: 2, ...strength.strong },
          { x: 3, y: 2, ...strength.moderate },

          // Undefined / neutral row
          { x: 0, y: 1, ...strength.weak },
          { x: 1, y: 1, ...strength.moderate },
          { x: 2, y: 1, ...strength.moderate },
          { x: 3, y: 1, ...strength.weak },

          // Constipation row (bottom)
          { x: 0, y: 0, ...strength.strong },
          { x: 1, y: 0, ...strength.weak },
          { x: 2, y: 0, ...strength.moderate },
          { x: 3, y: 0, ...strength.strong },
        ],
        pointBackgroundColor: (ctx) => ctx.raw.color,
        pointRadius: (ctx) => ctx.raw.r,
      },
    ],
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
        max: 3.5,
        ticks: {
          callback: (v) => xLabels[v],
          font: { size: 11 },
        },
        grid: { color: "#E5E7EB" },
      },
      y: {
        min: -0.5,
        max: 3.5,
        ticks: {
          callback: (v) => yLabels[v],
          font: { size: 11 },
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
            Shows strength of meal–bowel correlations. Larger, darker points =
            stronger.
          </p>
        </div>

        {/* Chart */}
        <div className="h-44">
          <Scatter data={data} options={options}
            onClick={ (events,a) => {
              console.log(a);
            }}
          />
        </div>

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
                  <p>Analyzing weekly diet patterns…</p>
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
          <p className="text-secondary">
            {loadingAdvice
              ? "Analyzing which diet patterns are most stressful this week…"
              : (aiAnalysis.find((row) => row.type === "warn") ||
                  aiAnalysis[0] || { text: "Not enough diet data this week." }
                ).text}
          </p>
        </div>

        {/* Overall Trend */}
        <div className="rounded-[12px] bg-[#f0fdf4] p-4 text-sm space-y-1 border-2 border-[#ededef]">
          <p className="font-medium mb-[10px] text-primary">Overall Diet Trend</p>
          {loadingAdvice ? (
            <p className="text-secondary">
              Summarizing this week&apos;s fiber, protein, fat and sugar balance…
            </p>
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
          onClick={() => navigate("/trend-analysis?plan=intermediate", { state: { trendType: "diet", viewMode: "month" } })}
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
