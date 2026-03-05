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
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";

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
  const [fiberYear, setFiberYear] = useState([20, 22, 25, 28, 30, 35, 38, 36, 32, 30, 28, 25]);
  const [proteinYear, setProteinYear] = useState([18, 20, 22, 25, 28, 30, 32, 30, 28, 26, 24, 22]);
  const [fatYear, setFatYear] = useState([25, 26, 27, 28, 30, 32, 30, 28, 26, 25, 24, 23]);
  const [sugarYear, setSugarYear] = useState([37, 32, 26, 19, 12, 3, 0, 6, 14, 19, 24, 30]);
  const [yearlySummary, setYearlySummary] = useState("");
  const [yearlyGoals, setYearlyGoals] = useState([
    "Fiber ↑ in H1, slight ↓ in H2",
    "Fat & sugar ↑ in H2",
    "Protein stable all year",
  ]);
  const [keyTransitions, setKeyTransitions] = useState([
    { period: "April–June", note: "Fiber ↑", status: "positive" },
    { period: "Oct–Dec", note: "Fat & Sugar ↑", status: "caution" },
  ]);
  const [loadingYear, setLoadingYear] = useState(false);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchYearly = async () => {
      setLoadingYear(true);
      try {
        const res = await api.get("/trend/diet/yearlySummary", {
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
          const adviceRes = await api.post("/trend/diet/yearlyAdvice", {
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
    <div className="pl-[15px] pr-[15px] mt-[15px]">
      {/* Annual Trend of Food */}
      <div className="text-primary  font-medium text-base pl-[15px] mb-3">Annual Trend of Food</div>
      <div className="w-full rounded-[20px] bg-white p-5 shadow-[2px_0_10px_rgba(0,0,0,0.15)]">
        <h2 className="mb-[10px] text-base text-secondary">
          Intake Ratio (%)
        </h2>

        <div className="h-40">
          {loadingYear ? (
            <div className="flex h-full items-center justify-center text-xs text-secondary">
              Loading yearly diet trend…
            </div>
          ) : (
            <Line data={inTakeRatioData} options={inTakeRatioOptions} />
          )}
        </div>
      </div>

      {/* Next Month's Goals */}
      <div className="w-full rounded-[12px] bg-[#EFF6FF] border border-custom-8 p-5 shadow-[0_2px_4px_rgba(0,0,0,0.08)] space-y-3 mt-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium text-primary">Next Month’s Goals</h2>
          <button className="text-xs text-blue-500 hover:underline">
            View Analysis
          </button>
        </div>

        {/* Goals */}
        <ul className="space-y-2 text-base text-secondary">
          {loadingAdvice ? (
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-secondary" />
              <span>Analyzing yearly pattern…</span>
            </li>
          ) : (
            yearlyGoals.map((goal, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-secondary" />
                <span>{goal}</span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Key Transition */}
      <div className="w-full rounded-[12px] bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.08)] space-y-3 mt-5 border border-[#d3d3d3]">
        {/* Title */}
        <h2 className="text-sm text-primary">Key Transition</h2>

        {/* Items */}
        <div className="flex justify-between text-sm text-gray-700">
          {keyTransitions.slice(0, 2).map((kt, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index} className="flex items-start gap-2">
              <span
                className={`mt-1 h-2.5 w-2.5 rounded-full ${
                  kt.status === "positive"
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
      </div>

      {/* Sensitive Foods */}
      <div className="text-primary text-base font-medium pl-[15px] mb-3 mt-5">Top Sensitivie Foods</div>
      <div className="w-full max-w-sm rounded-[20px] bg-white p-5 shadow-md space-y-4">
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
      <div className="text-primary text-base font-medium pl-[15px] mb-3 mt-5">Diet & Bowel</div>
      <div className="w-full rounded-[20px] bg-white p-5 shadow-[2px_0_10px_rgba(0,0,0,0.15)] space-y-4">
        {/* Header */}
        <div className="rounded-[12px] bg-[#EFF6FF] p-4 text-sm border border-custom-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 text-primary">
              Diet and Bowel Movement
            </div>
            <button className="text-xs text-blue-500 hover:underline">
              View Analysis
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

        {/* Findings */}
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
      </div>

      <div className="flex justify-center items-center text-custom-12 p-4 italic text-sm mt-3 text-center">
        This analysis is based on recent behavior and health indicators, for
        reference only
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
