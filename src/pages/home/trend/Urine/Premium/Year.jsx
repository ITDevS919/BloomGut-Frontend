import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);
import { Radar } from "react-chartjs-2";
import { useEffect, useMemo, useState } from "react";
import { FaUtensils } from "react-icons/fa6";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import { getTrendUrineYearlySummary, postTrendUrineYearlyAdvice } from "@/api/http";
import TrendInsufficientNotice from "@/components/trend/TrendInsufficientNotice";
import Loader from "@/components/common/Loader";

const Year = ({ referenceDate }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();

  const [summaryLoading, setSummaryLoading] = useState(true);
  const [isEnoughData, setIsEnoughData] = useState(false);
  const [radarLabels, setRadarLabels] = useState([]);
  const [radarDatasets, setRadarDatasets] = useState([]);

  const [yearlyAdvice, setYearlyAdvice] = useState(null);
  const [adviceLoading, setAdviceLoading] = useState(false);

  useEffect(() => {
    if (!auth?.user?.id) return;

    const run = async () => {
      setSummaryLoading(true);
      try {
        const ref =
          referenceDate && referenceDate.toISOString
            ? referenceDate.toISOString()
            : undefined;
        const res = await getTrendUrineYearlySummary(api, {
          params: { userId: auth.user.id, referenceDate: ref },
        });
        const payload = res.data?.data ?? res.data;
        if (!payload) return;
        const enough = payload.is_enough_data === true;
        setIsEnoughData(enough);
        setRadarLabels(Array.isArray(payload.radarLabels) ? payload.radarLabels : []);
        setRadarDatasets(Array.isArray(payload.radarDatasets) ? payload.radarDatasets : []);

        if (!enough) {
          setYearlyAdvice(null);
          return;
        }

        setAdviceLoading(true);
        try {
          const categories = payload.radarLabels || [];
          const series = (payload.radarDatasets || []).map((ds) => ({
            name: ds.label,
            values: ds.data || [],
          }));
          const foods = categories.map((name, i) => {
            const v = series[0]?.values?.[i] ?? 0;
            return { name, yellowPercent: v, odorPercent: v };
          });
          const advRes = await postTrendUrineYearlyAdvice(api, {
            categories,
            series,
            foods,
            year: referenceDate ? referenceDate.getFullYear() : new Date().getFullYear(),
          });
          setYearlyAdvice(advRes.data?.data ?? advRes.data ?? null);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("Failed to load yearly urine advice:", error);
          setYearlyAdvice(null);
        } finally {
          setAdviceLoading(false);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load yearly urine summary:", error);
        setIsEnoughData(false);
      } finally {
        setSummaryLoading(false);
      }
    };

    run();
  }, [api, auth?.user?.id, referenceDate]);

  const chartData = useMemo(
    () => ({
      labels: radarLabels.length ? radarLabels : ["—"],
      datasets:
        radarDatasets.length > 0
          ? radarDatasets
          : [
            {
              label: "Urine state %",
              data: [0],
              borderColor: "#3B82F6",
              backgroundColor: "rgba(59, 130, 246, 0.25)",
              pointBackgroundColor: "#3B82F6",
              pointRadius: 4,
            },
          ],
    }),
    [radarLabels, radarDatasets]
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "rect",
          boxWidth: 12,
          font: { size: 11 },
        },
      },
      datalabels: { display: false },
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
          color: "#D1D5DB",
        },
        pointLabels: {
          font: {
            size: 11,
          },
          color: "#6B7280",
        },
      },
    },
  };

  const items = useMemo(() => {
    const ds = radarDatasets[0];
    if (!ds || !Array.isArray(ds.data) || !radarLabels.length) return [];
    return radarLabels.slice(0, 6).map((title, i) => ({
      title,
      yellow: ds.data[i] ?? 0,
      odor: ds.data[i] ?? 0,
    }));
  }, [radarDatasets, radarLabels]);

  const mainFoods =
    yearlyAdvice?.mainFoods && yearlyAdvice.mainFoods.length ? yearlyAdvice.mainFoods : [];

  const ingredientSuggestions =
    yearlyAdvice?.ingredientSuggestions && yearlyAdvice.ingredientSuggestions.length
      ? yearlyAdvice.ingredientSuggestions
      : [];

  const loading = summaryLoading || adviceLoading;

  return (
    <div className="pl-[15px] pr-[15px] mt-[20px]">
      <div className="">
        <div className="w-full rounded-[20px] bg-white p-5 shadow-md mb-[32px]">
          {!summaryLoading && !isEnoughData && <TrendInsufficientNotice className="mb-3" />}
          <div
            className={`h-64 flex items-center justify-center ${!summaryLoading && !isEnoughData ? "opacity-40 grayscale pointer-events-none" : ""}`}
          >
            {summaryLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                <Loader />
              </div>
            ) : (
              <Radar data={chartData} options={options} />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-5">
          <div className="text-base font-medium text-primary">Foods Affecting Urine</div>

          <button
            type="button"
            className="text-sm text-blue-500"
            onClick={() => setShowAnalysis(!showAnalysis)}
          >
            {showAnalysis ? "Hide Analysis" : "View Analysis"}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 max-w-sm mt-3">
          {loading ? (
            <div className="col-span-2 flex items-center justify-center py-4">
              <span className="text-xs text-gray-400">Loading…</span>
            </div>
          ) : isEnoughData && items.length ? (
            items.map((item) => (
              <div key={item.title} className="rounded-[8px] bg-white p-2">
                <p className="mb-3 text-sm font-medium text-primary">{item.title}</p>

                <div className="grid grid-cols-2 gap-2">
                  <Badge bg="bg-[#FEF9C3]" label={`Share ${item.yellow}%`} />
                  <Badge bg="bg-[#FEF2F2]" label={`Share ${item.odor}%`} />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-xs text-gray-400 text-center py-2">
              {isEnoughData ? "" : ""}
            </div>
          )}
        </div>

        {showAnalysis && isEnoughData && (
          <div>
            <div className="w-full max-w-sm rounded-[12px] p-5 bg-white mt-8 space-y-4">
              <div className="flex items-center gap-2 mb-5">
                <FaUtensils className="w-5 h-5 text-[#f59e0b]" />
                <h2 className="text-sm font-medium text-primary">Fruits & Veg Impact</h2>
              </div>

              <div className="mb-5">
                <p className="text-sm text-secondary mb-[9px]">
                  {adviceLoading ? "Loading…" : yearlyAdvice?.fruitsVegImpact || ""}
                </p>
                <div className="flex flex-wrap gap-2">
                  {mainFoods.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-full text-xs bg-[#f3f4f6] text-secondary"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[12px] bg-blue-50 p-4 mb-5">
                <h3 className="text-sm font-medium text-primary mb-2">Dietary Ingredient Suggestions</h3>
                <div className="flex flex-wrap gap-2">
                  {ingredientSuggestions.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-full text-xs bg-white border border-[#d5fae3] text-[#60803d]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[12px] bg-green-50 p-4">
                <h3 className="text-sm font-medium text-primary mb-[7px]">Frequency Adjustment</h3>
                <p className="text-xs text-secondary">
                  {adviceLoading ? "Loading…" : yearlyAdvice?.frequencyText || ""}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="text-custom-12 italic text-sm mt-5 mb-[33px] flex justify-center items-center">
          For reference only. Consult a doctor if needed.
        </div>
      </div>
    </div>
  );
};

function Badge({ bg, label }) {
  return (
    <span className={`rounded-full px-2 py-1 text-xs text-secondary font-['Roboto'] ${bg}`}>
      {label}
    </span>
  );
}

export default Year;
