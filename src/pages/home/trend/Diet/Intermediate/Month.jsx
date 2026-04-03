import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import { postTrendDietMonthlyAdvice } from "@/api/http";
import Loader from "@/components/common/Loader";

ChartJS.register(ArcElement, Tooltip, Legend);
import { Pie } from "react-chartjs-2";
import { AlertTriangle } from "lucide-react";
import Free from "../Free";

const Month = ({ referenceDate }) => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();

  const [showAnalysis, setShowAnalysis] = useState(false);
  const [fiberPercent, setFiberPercent] = useState(0);
  const [proteinPercent, setProteinPercent] = useState(0);
  const [fatPercent, setFatPercent] = useState(0);
  const [sugarPercent, setSugarPercent] = useState(0);

  const [highlight, setHighlight] = useState("");
  const [perMacroAdvice, setPerMacroAdvice] = useState([]);
  const [overallAdvice, setOverallAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchMonthlyDietAdvice = async () => {
      setLoading(true);
      try {
        const res = await postTrendDietMonthlyAdvice(api, {
          userId: auth.user.id,
          referenceDate: referenceDate ? referenceDate.toISOString() : undefined,
          timezoneOffsetMinutes: new Date().getTimezoneOffset(),
        });
        const payload = res.data?.data ?? res.data;
        if (!payload) return;

        const percents = payload.percents;
        if (percents && typeof percents === "object") {
          setFiberPercent(typeof percents.fiber === "number" ? percents.fiber : 0);
          setProteinPercent(typeof percents.protein === "number" ? percents.protein : 0);
          setFatPercent(typeof percents.fat === "number" ? percents.fat : 0);
          setSugarPercent(typeof percents.sugar === "number" ? percents.sugar : 0);
        } else {
          setFiberPercent(0);
          setProteinPercent(0);
          setFatPercent(0);
          setSugarPercent(0);
        }

        const advice = payload.advice;
        if (advice && typeof advice === "object") {
          setHighlight(
            typeof advice.highlight === "string" && advice.highlight.trim()
              ? advice.highlight.trim()
              : ""
          );
          setPerMacroAdvice(Array.isArray(advice.perMacro) ? advice.perMacro : []);
          setOverallAdvice(
            typeof advice.overall === "string" && advice.overall.trim()
              ? advice.overall.trim()
              : ""
          );
        } else {
          setHighlight("");
          setPerMacroAdvice([]);
          setOverallAdvice("");
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load monthly diet advice:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyDietAdvice();
  }, [api, auth?.user?.id, referenceDate]);

  const data = {
    labels: ["Fiber", "Protein", "Fat", "Sugar"],
    datasets: [
      {
        data: [fiberPercent, proteinPercent, fatPercent, sugarPercent],
        backgroundColor: [
          "#22C55E",
          "#3B82F6",
          "#F59E0B",
          "#EF4444",
        ],
        borderColor: "#FFFFFF",
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          font: { size: 11 },
        },
      },
      datalabels: {
        display: true,
        formatter: (value) => `${value}%`,
        color: "white",
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw}%`,
        },
      },
    },
  };
  return (
    <>
      <Free showUpgrade={false} referenceDate={referenceDate} viewMode="month" />
      <div className="pl-[15px] pr-[15px]">
        <div className="text-primary text-base pl-[15px] mb-3">Monthly Diet Category</div>
        <div className="w-full max-w-sm rounded-[20px] bg-white p-5 shadow-md space-y-4 mx-auto">
          {/* Donut */}
          <div className="h-48 flex justify-center items-center relative">
            <Pie data={data} options={options} />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
                <Loader />
              </div>
            )}
          </div>

          {/* Header */}
          <div className="flex justify-between items-center text-sm">
            <h3 className="text-primary">Monthly Diet Overview</h3>
            <button
              className="text-blue-500 hover:underline italic"
              onClick={() => setShowAnalysis(!showAnalysis)}
            >
              {showAnalysis ? "Hide Analysis" : "Click to view"}
            </button>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <LegendItem color="#28B070" label="Fiber" value={`${fiberPercent}%`} />
            <LegendItem color="#2196F3" label="Protein" value={`${proteinPercent}%`} />
            <LegendItem color="#FFC107" label="Fat" value={`${fatPercent}%`} />
            <LegendItem color="#F44336" label="Sugar" value={`${sugarPercent}%`} />
          </div>

          {highlight ? (
            <div className="rounded-[8px] bg-[#FEFCE8] p-4 text-sm border-2 border-[#ededef]">
              <h3 className="text-primary mb-2">Dietary Advice Highlights</h3>
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-[#F59E0B] shrink-0 mt-0.5" />
                <p className="text-secondary">{highlight}</p>
              </div>
            </div>
          ) : null}

          {/* Detail cards */}
          {showAnalysis && (
            <>
              {perMacroAdvice && perMacroAdvice.length ? (
                perMacroAdvice.map((item, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Advice
                    key={index}
                    dotColor={
                      item.label === "Fiber"
                        ? "#22C55E"
                        : item.label === "Protein"
                          ? "#3B82F6"
                          : item.label === "Fat"
                            ? "#F59E0B"
                            : "#EF4444"
                    }
                    label={item.label}
                    value={`${item.value ?? 0}%`}
                    advice={item.advice || ""}
                  />
                ))
              ) : null}

              {/* Overall */}
              {overallAdvice ? (
                <div className="rounded-[8px] bg-green-50 p-4 text-sm">
                  <p className="text-primary mb-2 text-sm font-medium">Overall Suggestions</p>
                  <p className="text-secondary text-xs">{overallAdvice}</p>
                </div>
              ) : null}
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

function LegendItem({ color, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-secondary text-sm">
        {label}: {value}
      </span>
    </div>
  );
}

function Advice({ dotColor, label, value, advice }) {
  return (
    <div className="rounded-[12px] bg-[#eff6ff] p-4 text-sm border border-custom-8">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="h-2.5 w-2.5 rounded-full shrink-0"
          style={{ backgroundColor: dotColor }}
        />
        <p className="text-primary">
          {label}: ({value})
        </p>
      </div>
      <p className="text-secondary pl-[18px]">
        {advice}
      </p>
    </div>
  );
}

export default Month;
