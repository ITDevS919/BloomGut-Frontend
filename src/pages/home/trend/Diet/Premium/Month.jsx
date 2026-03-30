import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import { postTrendDietMonthlyAdvice } from "@/api/http";
import Loader from "@/components/common/Loader";
import { useNavigate } from "react-router-dom";
import TrendInsufficientNotice from "@/components/trend/TrendInsufficientNotice";

ChartJS.register(ArcElement, Tooltip, ChartDataLabels);

const Month = ({ referenceDate }) => {
  const [rings, setRings] = useState([
    { label: "Fiber", value: 0, color: "#22C55E" },
    { label: "Protein", value: 0, color: "#3B82F6" },
    { label: "Calcium", value: 0, color: "#F59E0B" },
    { label: "Vit C", value: 0, color: "#FACC15" },
    { label: "Water", value: 0, color: "#06B6D4" },
    { label: "Iron", value: 0, color: "#F87171" },
  ]);
  const [isEnoughData, setIsEnoughData] = useState(false);

  const data = {
    datasets: rings.map((r, i) => ({
      data: [r.value, 100 - r.value],
      backgroundColor: [r.color, "#F3F4F6"],
      borderWidth: 0,
      cutout: `5%`,
      radius: `100%`,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        display: true,
        color: "#FFFFFF",
        font: {
          size: 12,
        },
      },
    },
  };

  const auth = useSelector((state) => state.auth);
  const api = useApiClient();
  const navigate = useNavigate();

  const [focusText, setFocusText] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [goalLines, setGoalLines] = useState([]);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchMonthlyDietAdvice = async () => {
      setLoadingAdvice(true);
      try {
        const res = await postTrendDietMonthlyAdvice(api, {
          userId: auth.user.id,
          referenceDate: referenceDate ? referenceDate.toISOString() : undefined,
        });
        const payload = res.data?.data ?? res.data;
        if (!payload) return;

        const enough = payload.is_enough_data === true;
        setIsEnoughData(enough);

        if (!enough) {
          setRings([
            { label: "Fiber", value: 0, color: "#22C55E" },
            { label: "Protein", value: 0, color: "#3B82F6" },
            { label: "Calcium", value: 0, color: "#F59E0B" },
            { label: "Vit C", value: 0, color: "#FACC15" },
            { label: "Water", value: 0, color: "#06B6D4" },
            { label: "Iron", value: 0, color: "#F87171" },
          ]);
          setFocusText("");
          setSummaryText("");
          setGoalLines([]);
          return;
        }

        const percents = payload.percents || {};
        const fiberVal = typeof percents.fiber === "number" ? percents.fiber : 0;
        const proteinVal = typeof percents.protein === "number" ? percents.protein : 0;
        const fatVal = typeof percents.fat === "number" ? percents.fat : 0;
        const sugarVal = typeof percents.sugar === "number" ? percents.sugar : 0;

        setRings([
          { label: "Fiber", value: fiberVal, color: "#22C55E" },
          { label: "Protein", value: proteinVal, color: "#3B82F6" },
          { label: "Fat", value: fatVal, color: "#F59E0B" },
          { label: "Sugar", value: sugarVal, color: "#FACC15" },
          { label: "Water", value: 0, color: "#06B6D4" },
          { label: "Iron", value: 0, color: "#F87171" },
        ]);

        const advice = payload.advice || {};

        if (typeof advice.highlight === "string" && advice.highlight.trim()) {
          setFocusText(advice.highlight.trim());
        } else {
          setFocusText("");
        }

        if (typeof advice.overall === "string" && advice.overall.trim()) {
          setSummaryText(advice.overall.trim());
        } else {
          setSummaryText("");
        }

        if (Array.isArray(advice.perMacro) && advice.perMacro.length) {
          const lines = advice.perMacro
            .map((m) => m.advice)
            .filter((t) => typeof t === "string" && t.trim())
            .slice(0, 3);
          setGoalLines(lines);
        } else {
          setGoalLines([]);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load premium monthly diet advice:", error);
      } finally {
        setLoadingAdvice(false);
      }
    };

    fetchMonthlyDietAdvice();
  }, [api, auth?.user?.id, referenceDate]);

  return (
    <div className="pl-[15px] pr-[15px] mt-[33px]">
      <div className="text-primary  font-medium text-base pl-[15px] mb-3">Nutritional Dashboard</div>
      <div className="w-full rounded-[20px] bg-white p-5 shadow-[2px_0_10px_rgba(0,0,0,0.15)] space-y-4">
        <h2 className="text-base mt-1 text-secondary">Monthly Overview</h2>

        {!loadingAdvice && !isEnoughData && <TrendInsufficientNotice className="mb-3" />}

        {/* Chart */}
        <div
          className={`flex justify-center ${!loadingAdvice && !isEnoughData ? "opacity-40 grayscale pointer-events-none" : ""}`}
        >
          <div className="h-52 w-52 flex items-center justify-center">
            {loadingAdvice ? (
              <Loader />
            ) : (
              <Doughnut data={data} options={options} />
            )}
          </div>

          {/* Legend */}
          <div className="ml-4 space-y-2 text-xs">
            {rings.map((r) => (
              <Legend key={r.label} color={r.color} label={r.label} />
            ))}
          </div>
        </div>

        {/* Focus */}
        <div className="rounded-[8px] bg-[#fefce8] p-4 text-sm border border-custom-8">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-primary text-base">Focus</span>
            <span className="rounded-full bg-[#fef08a] px-2 py-0.5 text-xs text-secondary">
              {loadingAdvice ? "…" : "AI insight"}
            </span>
          </div>
          <p className="text-secondary">
            {loadingAdvice ? "Analyzing monthly diet focus…" : isEnoughData ? focusText : ""}
          </p>
        </div>

        {/* Collapsibles */}
        <Collapse title="Achievement" showAchievement rings={rings} />
        <Collapse
          title="Summary & Advice"
          showSummary
          summaryText={summaryText}
          goalLines={goalLines}
        />
      </div>

      <div className="flex items-center justify-center mt-[27px] mb-[27px]">
        <button
          className="flex items-center justify-center bg-white rounded-[8px] px-6 py-2 text-lg text-secondary shadow-md"
          onClick={() =>
            navigate("/trend-analysis?plan=free", { state: { trendType: "diet", viewMode: "month" } })
          }
        >
          OverView
        </button>
      </div>

      <div className="flex justify-center p-4 items-center text-gray-400 italic text-sm mt-3 text-center">
        This analysis is based on recent behavior and health indicators, for
        reference only
      </div>
    </div>
  );
};

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </div>
  );
}

function Collapse({
  title,
  showAchievement = false,
  showSummary = false,
  summaryText,
  goalLines,
  rings = [],
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Achievement data
  const achievementData =
    Array.isArray(rings) && rings.length
      ? rings.map((r) => {
        const pct = Math.round(r.value ?? 0);
        let badgeBg = "#E8F5E9";
        if (pct < 50) badgeBg = "#FBE9E7";
        else if (pct < 70) badgeBg = "#FFFDE7";
        return {
          label: r.label,
          percentage: pct,
          badgeBg,
          barColor: r.color,
        };
      })
      : [];

  return (
    <div className="rounded-[7px] border-2 border-custom-8 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-sm"
      >
        <span className="text-primary text-base">{title}</span>
        <ChevronDown
          className="h-4 w-4 text-gray-400 transition-transform"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {isOpen && showAchievement && (
        <div className="p-4 pt-0">
          <div className="grid grid-cols-2 gap-3">
            {achievementData.map((item) => (
              <div
                key={item.label}
                className="bg-white rounded-[7px] p-3 shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-gray-100"
              >
                {/* Header with label and percentage badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-secondary">
                    {item.label}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: item.badgeBg,
                      color: "#705d56",
                    }}
                  >
                    {item.percentage}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.barColor,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isOpen && showSummary && (
        <div className="p-4 pt-0 space-y-3">
          {/* Monthly Nutrition Summary Card */}
          <div
            className="rounded-[8px] p-4"
            style={{ backgroundColor: "#FCE4EC" }} // Light pink
          >
            <h3 className="text-base text-primary mb-2">
              Monthly Nutrition Summary
            </h3>
            <div className="space-y-1 text-sm text-secondary">
              <p>{summaryText}</p>
            </div>
          </div>

          {/* Next Month's Goals Card */}
          <div
            className="rounded-[8px] p-4"
            style={{ backgroundColor: "#E8F5E9" }} // Light green
          >
            <h3 className="text-base text-primary mb-2">Next Month's Goals</h3>
            <ul className="space-y-1 text-sm text-secondary list-disc list-inside">
              {goalLines && goalLines.length ? (
                goalLines.map((line, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <li key={index}>{line}</li>
                ))
              ) : (
                <>
                  <li>More lunch protein (chicken, legumes).</li>
                  <li>More calcium (dairy, tofu, greens).</li>
                  <li>Maintain hydration.</li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Month;
