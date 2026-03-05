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
import { useEffect, useState } from "react";
import { Wheat, Beef, Salad, Milk, MoreHorizontal, UtensilsCrossed } from "lucide-react";
import { IoRestaurant } from "react-icons/io5";
import { FaUtensils } from "react-icons/fa6";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";

const Year = ({ referenceDate }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();

  const [yearlyAdvice, setYearlyAdvice] = useState(null);
  const [adviceLoading, setAdviceLoading] = useState(false);

  const data = {
    labels: [
      "High Protein Foods",
      "Caffeinated Drinks",
      "Sugary Drinks",
      "Salty Foods",
      "Spicy Foods",
      "Processed Foods",
      "Vegetables and Fruits",
    ],
    datasets: [
      {
        label: "Dark Yellow",
        data: [70, 55, 40, 60, 75, 50, 45],
        borderColor: "#F59E0B",
        backgroundColor: "rgba(245, 158, 11, 0.25)",
        pointBackgroundColor: "#F59E0B",
        pointRadius: 4,
      },
      {
        label: "Urine Odor",
        data: [55, 45, 50, 65, 80, 60, 40],
        borderColor: "#EF4444",
        backgroundColor: "rgba(239, 68, 68, 0.25)",
        pointBackgroundColor: "#EF4444",
        pointRadius: 4,
      },
      {
        label: "Frequent",
        data: [40, 70, 65, 55, 45, 35, 60],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.25)",
        pointBackgroundColor: "#3B82F6",
        pointRadius: 4,
      },
    ],
  };
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

  const items = [
    { title: "High Protein", yellow: 85, odor: 70 },
    { title: "Sugary Drinks", yellow: 60, odor: 30 },
    { title: "Alcohol", yellow: 80, odor: 85 },
    { title: "Spicy Foods", yellow: 70, odor: 80 },
    { title: "Processed", yellow: 65, odor: 75 },
    { title: "Fruits & Veg", yellow: 85, odor: 15 },
  ];

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchYearlyAdvice = async () => {
      setAdviceLoading(true);
      try {
        const payload = {
          categories: data.labels,
          series: data.datasets.map((ds) => ({
            name: ds.label,
            values: ds.data,
          })),
          foods: items.map((f) => ({
            name: f.title,
            yellowPercent: f.yellow,
            odorPercent: f.odor,
          })),
          year: referenceDate
            ? referenceDate.getFullYear()
            : new Date().getFullYear(),
        };
        const res = await api.post("/trend/urine/yearlyAdvice", payload);
        const adv = res.data?.data ?? res.data;
        setYearlyAdvice(adv || null);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load yearly urine advice:", error);
        setYearlyAdvice(null);
      } finally {
        setAdviceLoading(false);
      }
    };

    fetchYearlyAdvice();
  }, [api, auth?.user?.id, referenceDate]);

  const mainFoods =
    yearlyAdvice?.mainFoods && yearlyAdvice.mainFoods.length
      ? yearlyAdvice.mainFoods
      : ["Banana", "Broccoli", "Tomato", "Apple"];

  const ingredientSuggestions =
    yearlyAdvice?.ingredientSuggestions && yearlyAdvice.ingredientSuggestions.length
      ? yearlyAdvice.ingredientSuggestions
      : ["Leafy", "Sweet Potato", "Broccoli", "Apple"];

  return (
    <div className="pl-[15px] pr-[15px] mt-[20px]">
      <div className="">
        <div className="w-full rounded-[20px] bg-white p-5 shadow-md mb-[32px]">
          <div className="h-64 flex items-center justify-center">
            {adviceLoading ? (
              <span className="text-xs text-secondary">
                Loading yearly urine pattern…
              </span>
            ) : (
              <Radar data={data} options={options} />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-5">
          <div className="text-base font-medium text-primary">
            Foods Affecting Urine
          </div>

          <button className="text-sm text-blue-500" onClick={() => setShowAnalysis(!showAnalysis)}>
            {showAnalysis ? "Hide Analysis" : "View Analysis"}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 max-w-sm mt-3">
          {items.map((item) => (
            <div key={item.title} className="rounded-[8px] bg-white p-2">
              <p className="mb-3 text-sm font-medium text-primary">
                {item.title}
              </p>

              <div className="grid grid-cols-2 gap-2">
                <Badge
                  bg="bg-[#FEF9C3]"
                  label={`Yellow ${item.yellow}%`}
                />
                <Badge
                  bg="bg-[#FEF2F2]"
                  label={`Odor ${item.odor}%`}
                />
              </div>
            </div>
          ))}
        </div>

            {showAnalysis && (
          <div>
            {/* Fruits & Veg Impact */}
            <div className="w-full max-w-sm rounded-[12px] p-5 bg-white mt-8 space-y-4">
              {/* Header */}
              <div className="flex items-center gap-2 mb-5">
                <FaUtensils className="w-5 h-5 text-[#f59e0b]" />
                <h2 className="text-sm font-medium text-primary">Fruits & Veg Impact</h2>
              </div>

              {/* Main Food Items */}
              <div className="mb-5">
                <p className="text-sm text-secondary mb-[9px]">
                  {adviceLoading
                    ? "Loading main food items…"
                    : yearlyAdvice?.fruitsVegImpact ||
                      "Main Food Items"}
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

              {/* Dietary Ingredient Suggestions */}
              <div className="rounded-[12px] bg-blue-50 p-4 mb-5">
                <h3 className="text-sm font-medium text-primary mb-2">
                  Dietary Ingredient Suggestions
                </h3>
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

              {/* Frequency Adjustment */}
              <div className="rounded-[12px] bg-green-50 p-4">
                <h3 className="text-sm font-medium text-primary mb-[7px]">
                  Frequency Adjustment
                </h3>
                <p className="text-xs text-secondary">
                  {adviceLoading
                    ? "Loading frequency tip…"
                    : yearlyAdvice?.frequencyText ||
                      "3-5 servings/day of fruits & veg helps urine clarity & health"}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="text-custom-12 italic text-sm mt-5 mb-[33px] flex justify-center items-center">
          For reference only. Consult a doctor if needed.
        </div>
      </div>
    </div >
  );
};

function Badge({ bg, text, label }) {
  return (
    <span
      className={`rounded-full px-2 py-1 text-xs text-secondary font-['Roboto'] ${bg} ${text}`}
    >
      {label}
    </span>
  );
}

export default Year;
