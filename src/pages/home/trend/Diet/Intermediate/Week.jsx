import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import { getTrendDietMacroWeekly, postTrendDietWeeklyAdvice } from "@/api/http";
import Free from "../Free";
import Loader from "@/components/common/Loader";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RECOMMENDED_SCORES = [80, 75, 60, 50, 55];

const Week = ({ referenceDate }) => {
  const navigate = useNavigate();
  const [showAnalysis, setShowAnalysis] = useState(false);
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();

  const [fiberAvg, setFiberAvg] = useState(0);
  const [proteinAvg, setProteinAvg] = useState(0);
  const [fatAvg, setFatAvg] = useState(0);
  const [sugarAvg, setSugarAvg] = useState(0);
  const [sodiumAvg, setSodiumAvg] = useState(0);
  const [loading, setLoading] = useState(false);

  const [aiAnalysis, setAiAnalysis] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchWeeklyMacrosAndAdvice = async () => {
      setLoading(true);
      try {
        const res = await getTrendDietMacroWeekly(api, {
          params: {
            userId: auth.user.id,
            referenceDate: referenceDate ? referenceDate.toISOString() : undefined,
            timezoneOffsetMinutes: new Date().getTimezoneOffset(),
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
        const sodium = 60; // neutral placeholder – sodium is not tracked in macroWeekly yet

        setFiberAvg(fiber);
        setProteinAvg(protein);
        setFatAvg(fat);
        setSugarAvg(sugar);
        setSodiumAvg(sodium);

        const overallScore = Math.round(
          (fiber + protein + (100 - Math.max(0, fat - 60)) + (100 - sugar) + (100 - sodium)) /
            5
        );

        setAiLoading(true);
        try {
          const adviceRes = await postTrendDietWeeklyAdvice(api, {
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
          console.error("Failed to load diet weekly AI advice:", error);
          setAiAnalysis([]);
          setAiRecommendations([]);
        } finally {
          setAiLoading(false);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load diet weekly macros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyMacrosAndAdvice();
  }, [api, auth?.user?.id, referenceDate]);

  const radarData = useMemo(
    () => ({
      labels: ["Fiber", "Protein", "Fat", "Sugar", "Sodium"],
      datasets: [
        {
          label: "Recommended",
          data: RECOMMENDED_SCORES,
          borderColor: "#22C55E",
          backgroundColor: "rgba(34,197,94,0.15)",
          pointBackgroundColor: "#22C55E",
          pointRadius: 4,
        },
        {
          label: "Actual",
          data: [fiberAvg, proteinAvg, fatAvg, sugarAvg, sodiumAvg],
          borderColor: "#EF4444",
          backgroundColor: "rgba(239,68,68,0.25)",
          pointBackgroundColor: "#EF4444",
          pointRadius: 4,
        },
      ],
    }),
    [fiberAvg, proteinAvg, fatAvg, sugarAvg, sodiumAvg]
  );

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
      datalabels: {
        display: false,
      },
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
          stepSize: 25,
          backdropColor: "transparent",
          font: { size: 10 },
        },
        grid: { color: "#E5E7EB" },
        angleLines: { color: "#D1D5DB" },
        pointLabels: {
          font: { size: 11 },
          color: "#6B7280",
        },
      },
    },
  };
  return (
    <>
      <Free showUpgrade={false} referenceDate={referenceDate} viewMode="week" />

      <div className="pl-[15px] pr-[15spx]">
        <div className="text-primary text-base pl-[15px] mb-3">Weekly Diet Analysis</div>
        <div className="w-full max-w-sm rounded-[20px] bg-white p-5 shadow-md space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-primary text-sm">This Week</span>
            <button
              className="text-blue-500"
              onClick={() => setShowAnalysis(!showAnalysis)}
            >
              {showAnalysis ? "Hide Analysis" : "View Analysis"}
            </button>
          </div>

          {/* Radar Chart */}
        <div className="h-56 relative">
          <Radar data={radarData} options={options} />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
              <Loader />
            </div>
          )}
        </div>

          {/* Diet Analysis */}
          {showAnalysis && (
            <>
              <div className="rounded-[8px] bg-blue-50 p-4 text-sm space-y-2 shadow-[2px_0_10px_rgba(3,3,3,0.1)]">
                <p className="font-medium text-primary">Diet Analysis</p>
                {aiLoading ? (
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
                ) : aiAnalysis.length ? (
                  aiAnalysis.map((row, index) => (
                    <AnalysisRow
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      warn={row.type === "warn"}
                      ok={row.type === "ok"}
                      text={row.text}
                    />
                  ))
                ) : (
                  <>
                    <AnalysisRow warn text="Not enough diet data this week to give detailed insights." />
                  </>
                )}
              </div>

              {/* Recommended */}
              <div className="rounded-[8px] bg-green-50 p-4 text-sm space-y-1">
                <p className="font-medium text-primary">Recommended</p>
                {aiLoading ? (
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
                      Increase: Fruits, veggies, whole grains, legumes.
                    </p>
                    <p className="text-secondary">
                      Decrease: Fried, processed foods and desserts on a few days.
                    </p>
                    <p className="text-secondary">Maintain: Balanced protein across meals.</p>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-center items-center text-gray-400 italic text-sm mt-3 text-center p-4">
          This analysis is based on recent behavior and health indicators, for
          reference only
        </div>
      </div>
      <div className="flex items-center justify-center mb-[47px]">
        <button
          className="flex items-center justify-center bg-white rounded-[8px] px-6 py-2 text-lg text-secondary shadow-md"
          onClick={() => navigate("/trend-analysis?plan=premium", { state: { trendType: "diet" } })}
        >
          In-depth Analysis
        </button>
      </div>
    </>
  );
};

function AnalysisRow({ text, warn, ok }) {
  return (
    <div className="flex items-center gap-2">
      {warn && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
      {ok && <CheckCircle className="h-4 w-4 text-green-500" />}
      <span className="text-secondary">{text}</span>
    </div>
  );
}

export default Week;
