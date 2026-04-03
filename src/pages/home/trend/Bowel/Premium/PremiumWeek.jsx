import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import { postTrendBowelPremiumWeekAdvice } from "@/api/http";
import Loader from "@/components/common/Loader";

const PremiumWeek = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();
  const [tooltip, setTooltip] = useState(null); // { food, status, percentage, note, tip, x, y }
  const [foodTooltip, setFoodTooltip] = useState(null); // { food, status, percentage, note, tip, x, y }
  const [aiTooltipMap, setAiTooltipMap] = useState({});
  const [summaryTips, setSummaryTips] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  const getCellColor = (percentage) => {
    if (percentage <= 30) return "#CFF3D7"; // Green - Low
    if (percentage <= 60) return "#FFF1B8"; // Yellow - Medium
    return "#FFC2B5"; // Pink/Red - High
  };

  const [foodData, setFoodData] = useState([]);

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchPremiumWeekAdvice = async () => {
      setAiLoading(true);
      try {
        const res = await postTrendBowelPremiumWeekAdvice(api, {
          userId: auth.user.id,
        });
        const data = res.data?.data ?? res.data;
        if (data) {
          if (Array.isArray(data.foods)) {
            setFoodData(data.foods);
          }
          setAiTooltipMap(data.tooltipMap || {});
          setSummaryTips(Array.isArray(data.summaryTips) ? data.summaryTips : []);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to load PremiumWeek bowel advice:", err);
      } finally {
        setAiLoading(false);
      }
    };

    fetchPremiumWeekAdvice();
  }, [api, auth?.user?.id]);

  const getTooltipData = (food, symptom, percentage) => {
    const aiFood = aiTooltipMap?.[food]?.[symptom];
    if (aiFood && aiFood.note && aiFood.tip) {
      return {
        note: aiFood.note,
        tip: aiFood.tip,
      };
    }

    const p = Number(percentage) || 0;
    const levels = {
      low: {
        note: `${food} shows low ${symptom.toLowerCase()} correlation (${p}%). Keep tracking but no major changes needed.`,
        tip: "Maintain current diet and observe if symptoms remain stable.",
      },
      medium: {
        note: `${food} has moderate ${symptom.toLowerCase()} sensitivity (${p}%). Monitor portion size and frequency.`,
        tip: "Try smaller servings or spread intake across days to check tolerance.",
      },
      high: {
        note: `${food} has high ${symptom.toLowerCase()} sensitivity (${p}%). Consider reducing intake.`,
        tip: "Cut back intake and consult a healthcare pro if symptoms persist.",
      },
    };

    if (p <= 30) return levels.low;
    if (p <= 60) return levels.medium;
    return levels.high;
  };

  const handleCellHover = (e, food, symptom, percentage) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const tooltipData = getTooltipData(food, symptom, percentage);
    setTooltip({
      food,
      status: symptom,
      percentage,
      ...tooltipData,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handleCellLeave = () => {
    setTooltip(null);
  };

  // Get the highest sensitivity symptom for a food item
  const getHighestSensitivity = (foodItem) => {
    const symptoms = [
      { name: "Abd Pain", value: foodItem.abdPain },
      { name: "Diarrh", value: foodItem.diarrh },
      { name: "Constip", value: foodItem.constip },
      { name: "Bloat", value: foodItem.bloat },
    ];

    const highest = symptoms.reduce((max, symptom) =>
      symptom.value > max.value ? symptom : max
    );

    return highest;
  };

  const handleFoodHover = (e, foodItem) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const highestSymptom = getHighestSensitivity(foodItem);
    const tooltipData = getTooltipData(foodItem.food, highestSymptom.name, highestSymptom.value);

    setFoodTooltip({
      food: foodItem.food,
      status: highestSymptom.name,
      percentage: highestSymptom.value,
      ...tooltipData,
      x: rect.left,
      y: rect.top + rect.height / 2,
    });
  };

  const handleFoodLeave = () => {
    setFoodTooltip(null);
  };

  const symptoms = ["Abd Pain", "Diarrh", "Constip", "Bloat"];

  return (
    <div className="pl-[15px] pr-[15px] mb-[60px] relative">
      <div className="text-base pl-[15px] font-medium mb-[11px] text-primary">
        Food vs Symptoms
      </div>
      <div className="w-full max-w-2xl rounded-[8px] bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.08)] relative">
        {/* Table */}
        <div className="overflow-x-auto bg-quinary rounded-[8px]">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-center  text-sm font-bold text-primary pb-2 px-2">Food</th>
                <th className="text-center text-sm font-bold text-primary pb-2 px-2">Abd Pain</th>
                <th className="text-center text-sm font-bold text-primary pb-2 px-2">Diarrh</th>
                <th className="text-center text-sm font-bold text-primary pb-2 px-2">Constip</th>
                <th className="text-center text-sm font-bold text-primary pb-2 px-2">Bloat</th>
              </tr>
            </thead>
            <tbody>
              {foodData.map((row, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td
                    className="text-center text-sm text-primary py-2 px-2 cursor-pointer hover:bg-gray-50 transition-colors"
                    onMouseEnter={(e) => handleFoodHover(e, row)}
                    onMouseLeave={handleFoodLeave}
                  >
                    {row.food}
                  </td>
                  <td
                    className="text-center text-sm py-2 px-2 cursor-pointer"
                    style={{ backgroundColor: getCellColor(row.abdPain) }}
                    onMouseEnter={(e) => handleCellHover(e, row.food, "Abd Pain", row.abdPain)}
                    onMouseLeave={handleCellLeave}
                  >
                    {row.abdPain}%
                  </td>
                  <td
                    className="text-center text-sm py-2 px-2 cursor-pointer"
                    style={{ backgroundColor: getCellColor(row.diarrh) }}
                    onMouseEnter={(e) => handleCellHover(e, row.food, "Diarrh", row.diarrh)}
                    onMouseLeave={handleCellLeave}
                  >
                    {row.diarrh}%
                  </td>
                  <td
                    className="text-center text-sm py-2 px-2 cursor-pointer"
                    style={{ backgroundColor: getCellColor(row.constip) }}
                    onMouseEnter={(e) => handleCellHover(e, row.food, "Constip", row.constip)}
                    onMouseLeave={handleCellLeave}
                  >
                    {row.constip}%
                  </td>
                  <td
                    className="text-center text-sm py-2 px-2 cursor-pointer"
                    style={{ backgroundColor: getCellColor(row.bloat) }}
                    onMouseEnter={(e) => handleCellHover(e, row.food, "Bloat", row.bloat)}
                    onMouseLeave={handleCellLeave}
                  >
                    {row.bloat}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sensitivity legend */}
        <div className="mt-[19px] rounded-[8px] bg-[#FFFDF6] p-4 shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs text-gray-500 whitespace-nowrap">Sensit</span>
            <div className="h-5 flex-1 rounded-full bg-linear-to-r from-green-300 via-yellow-200 to-red-300" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 whitespace-nowrap ml-[50px]">Low</span>
            <div className="flex-1" />
            <span className="text-xs text-gray-500 whitespace-nowrap">High</span>
          </div>
        </div>

        {/* AI Summary Tips */}
        {summaryTips.length > 0 && (
          <div className="mt-[19px] rounded-[8px] bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
            <h3 className="text-base font-medium text-primary mb-3">AI Insights</h3>
            <ul className="space-y-2">
              {summaryTips.map((tip, index) => (
                <li key={index} className="text-sm text-secondary flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {aiLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Loader />
          </div>
        )}
      </div>

      {/* Cell Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.15)] p-5 max-w-xs"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
            marginTop: '-8px',
          }}
          // onMouseEnter={() => setTooltip(tooltip)}
          // onMouseLeave={handleCellLeave}
        >
          <h3 className="text-lg font-bold text-primary mb-4">Details</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Food: {tooltip.food}</p>
            <p>Status: {tooltip.status}</p>
            <p>Sensit: {tooltip.percentage}%</p>
            <p className="text-gray-500 text-xs mt-4">Note: {tooltip.note}</p>
            <p className="text-gray-500 text-xs">Tip: {tooltip.tip}</p>
          </div>
        </div>
      )}

      {/* Food Name Tooltip */}
      {foodTooltip && (
        <div
          className="fixed z-50 bg-white rounded-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.16)] p-4 pointer-events-none"
          style={{
            left: `${foodTooltip.x + 10}px`,
            top: `${foodTooltip.y}px`,
            transform: 'translateY(-50%)',
            minWidth: '200px',
            maxWidth: '280px',
          }}
        >
          <h3 className="text-base font-medium text-primary mb-4">Details</h3>
          <div className="flex flex-col gap-2 text-sm text-secondary">
            <p><span className="font-medium">Food:</span> {foodTooltip.food}</p>
            <p><span className="font-medium">Status:</span> {foodTooltip.status}</p>
            <p><span className="font-medium">Sensit:</span> {foodTooltip.percentage}%</p>
            <p className="mt-2"><span className="font-medium">Note:</span> {foodTooltip.note}</p>
            <p><span className="font-medium">Tip:</span> {foodTooltip.tip}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center mt-[27px]">
        <button
          className="flex items-center justify-center bg-white rounded-[8px] px-6 py-2 text-lg text-secondary shadow-sm"
          onClick={() =>
            navigate("/trend-analysis?plan=free", {
              state: { trendType: "bowel", viewMode: "week", subscribed: true },
            })
          }
        >
          OverView
        </button>
      </div>
    </div>
  );
};

export default PremiumWeek;
