import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import { getTrendDietMacroWeekly, postTrendDietWeeklyAdvice } from "@/api/http";
import Loader from "@/components/common/Loader";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Week = ({ referenceDate }) => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();

  const [loadingMacro, setLoadingMacro] = useState(true);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [chartLabels, setChartLabels] = useState([]);
  const [fiber, setFiber] = useState([]);
  const [protein, setProtein] = useState([]);
  const [fat, setFat] = useState([]);
  const [sugar, setSugar] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);

  useEffect(() => {
    if (!auth?.user?.id) return;

    const run = async () => {
      setLoadingMacro(true);
      try {
        const res = await getTrendDietMacroWeekly(api, {
          params: {
            userId: auth.user.id,
            referenceDate: referenceDate ? referenceDate.toISOString() : undefined,
          },
        });
        const payload = res.data?.data ?? res.data;
        if (!payload) {
          return;
        }

        if (Array.isArray(payload.labels)) setChartLabels(payload.labels);
        if (Array.isArray(payload.fiber)) setFiber(payload.fiber);
        if (Array.isArray(payload.protein)) setProtein(payload.protein);
        if (Array.isArray(payload.fat)) setFat(payload.fat);
        if (Array.isArray(payload.sugar)) setSugar(payload.sugar);

        const avg = (arr) =>
          Array.isArray(arr) && arr.length
            ? Math.round(
                arr.reduce((sum, v) => sum + (Number(v) || 0), 0) / arr.length
              )
            : 0;

        const fiberAvg = avg(payload.fiber);
        const proteinAvg = avg(payload.protein);
        const fatAvg = avg(payload.fat);
        const sugarAvg = avg(payload.sugar);
        const sodiumAvg = 0;

        const overallScore = Math.round(
          (fiberAvg +
            proteinAvg +
            (100 - Math.max(0, fatAvg - 60)) +
            (100 - sugarAvg) +
            (100 - sodiumAvg)) /
            5
        );

        setLoadingAdvice(true);
        try {
          const adviceRes = await postTrendDietWeeklyAdvice(api, {
            fiberAvg,
            proteinAvg,
            fatAvg,
            sugarAvg,
            sodiumAvg,
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
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load macro weekly:", error);
      } finally {
        setLoadingMacro(false);
      }
    };

    run();
  }, [api, auth?.user?.id, referenceDate]);

  const lineData = useMemo(
    () => ({
      labels: chartLabels.length ? chartLabels : ["—", "—", "—", "—", "—", "—", "—"],
      datasets: [
        {
          label: "Fiber",
          data: fiber.length ? fiber : Array(7).fill(0),
          borderColor: "#22C55E",
          backgroundColor: "rgba(34,197,94,0.15)",
          tension: 0.3,
          fill: false,
        },
        {
          label: "Protein",
          data: protein.length ? protein : Array(7).fill(0),
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59,130,246,0.15)",
          tension: 0.3,
          fill: false,
        },
        {
          label: "Fat",
          data: fat.length ? fat : Array(7).fill(0),
          borderColor: "#F59E0B",
          backgroundColor: "rgba(245,158,11,0.15)",
          tension: 0.3,
          fill: false,
        },
        {
          label: "Sugar",
          data: sugar.length ? sugar : Array(7).fill(0),
          borderColor: "#EF4444",
          backgroundColor: "rgba(239,68,68,0.15)",
          tension: 0.3,
          fill: false,
        },
      ],
    }),
    [chartLabels, fiber, protein, fat, sugar]
  );

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { font: { size: 10 }, usePointStyle: true },
      },
      datalabels: { display: false },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: { stepSize: 25 },
        grid: { color: "#E5E7EB" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="pl-[15px] pr-[15px] mt-[33px]">
      <div className="w-full rounded-[20px] bg-white p-5 shadow-[2px_0_10px_rgba(0,0,0,0.15)] space-y-4">
        <div>
          <h2 className="text-base mt-5 text-primary">Weekly macro trend</h2>
          <p className="text-xs text-custom-12">
            Daily scores (0–100) from your diet records for the selected week (API).
          </p>
        </div>

        <div className="h-52">
          {loadingMacro ? (
            <div className="flex h-full items-center justify-center">
              <Loader />
            </div>
          ) : (
            <Line data={lineData} options={lineOptions} />
          )}
        </div>

        <div className="rounded-[10px] bg-[#f9fafb] p-3 text-xs text-secondary border border-custom-8">
          <p className="font-medium text-primary mb-1">Patterns</p>
          {loadingAdvice ? (
            <div className="flex items-center justify-center py-2">
              <Loader />
            </div>
          ) : aiAnalysis.length ? (
            <ul className="list-disc list-inside space-y-0.5">
              {aiAnalysis.slice(0, 3).map((row, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={index}>{row.text}</li>
              ))}
            </ul>
          ) : (
            <p className="text-custom-12">
              No AI patterns returned for this week.
            </p>
          )}
        </div>

        <div className="rounded-[12px] bg-[#fef2f2] p-4 text-sm border-2 border-[#ededef]">
          <p className="font-medium mb-[10px] text-primary">Watch</p>
          {loadingAdvice ? (
            <div className="flex items-center justify-center py-2">
              <Loader />
            </div>
          ) : aiAnalysis.length ? (
            <p className="text-secondary">
              {aiAnalysis.find((row) => row.type === "warn")?.text ||
                aiAnalysis[0]?.text ||
                ""}
            </p>
          ) : (
            <p className="text-secondary text-custom-12" />
          )}
        </div>

        <div className="rounded-[12px] bg-[#f0fdf4] p-4 text-sm space-y-1 border-2 border-[#ededef]">
          <p className="font-medium mb-[10px] text-primary">Recommendations</p>
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
            <p className="text-secondary text-custom-12" />
          )}
        </div>
      </div>
      <div className="flex justify-center items-center text-custom-12 italic text-sm mt-3 text-center p-4">
        This analysis is based on recent behavior and health indicators, for reference only
      </div>

      <div className="flex items-center justify-center mt-[27px] mb-[27px]">
        <button
          type="button"
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

export default Week;
