import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import { postTrendBowelPremiumMonthAdvice } from "@/api/http";
import Loader from "@/components/common/Loader";

const PremiumMonth = () => {
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();
  const [aiTooltipMap, setAiTooltipMap] = useState({});
  const [summaryTips, setSummaryTips] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Function to get background color based on percentage (updated thresholds)
  const getCellColor = (percentage) => {
    if (percentage <= 45) return "#CFF3D7"; // Green - Low
    if (percentage <= 65) return "#FFF1B8"; // Yellow - Medium
    return "#FFC2B5"; // Pink/Red - High
  };

  const [foodData, setFoodData] = useState([]);

  const getTooltipData = (food, week, percentage) => {
    const aiFood = aiTooltipMap?.[food]?.[week];
    if (aiFood && aiFood.note && aiFood.tip) {
      return {
        note: aiFood.note,
        tip: aiFood.tip,
      };
    }

    const tooltipMap = {
      "Milk": {
        "Week 1": { note: "High sensitivity observed.", tip: "Reduce intake or try alternatives." },
        "Week 2": { note: "Moderate to high sensitivity.", tip: "Monitor portion sizes carefully." },
        "Week 3": { note: "Moderate sensitivity.", tip: "Consider lactose-free options." },
        "Week 4": { note: "Moderate sensitivity.", tip: "Generally manageable with moderation." },
      },
      "Bread": {
        "Week 1": { note: "Low sensitivity.", tip: "Generally well-tolerated." },
        "Week 2": { note: "High sensitivity observed.", tip: "Try gluten-free alternatives." },
        "Week 3": { note: "Moderate sensitivity.", tip: "Monitor portion sizes." },
        "Week 4": { note: "Moderate sensitivity.", tip: "Consider whole grain options." },
      },
      "Peanuts": {
        "Week 1": { note: "Moderate sensitivity.", tip: "Monitor portion sizes." },
        "Week 2": { note: "High sensitivity observed.", tip: "Reduce intake or avoid if severe." },
        "Week 3": { note: "High sensitivity observed.", tip: "Avoid or try roasted alternatives." },
        "Week 4": { note: "High sensitivity.", tip: "Consider eliminating from diet." },
      },
      "Eggs": {
        "Week 1": { note: "Low sensitivity.", tip: "Generally safe." },
        "Week 2": { note: "Low sensitivity.", tip: "Usually well-tolerated." },
        "Week 3": { note: "Moderate sensitivity.", tip: "Cook thoroughly and monitor portions." },
        "Week 4": { note: "High sensitivity observed.", tip: "Reduce intake or try egg whites only." },
      },
      "Seafood": {
        "Week 1": { note: "High sensitivity observed.", tip: "Ensure freshness and proper cooking." },
        "Week 2": { note: "Moderate sensitivity.", tip: "Start with small portions." },
        "Week 3": { note: "Low sensitivity.", tip: "Generally well-tolerated." },
        "Week 4": { note: "Low sensitivity.", tip: "Safe in moderation." },
      },
      "Beans": {
        "Week 1": { note: "Low sensitivity.", tip: "Soak before cooking to reduce gas." },
        "Week 2": { note: "Low sensitivity.", tip: "Generally well-tolerated when cooked properly." },
        "Week 3": { note: "Moderate sensitivity.", tip: "Increase water intake with beans." },
        "Week 4": { note: "Moderate sensitivity.", tip: "Soak and cook thoroughly." },
      },
      "Nuts": {
        "Week 1": { note: "Moderate sensitivity.", tip: "Monitor portion sizes." },
        "Week 2": { note: "Moderate sensitivity.", tip: "Try different types of nuts." },
        "Week 3": { note: "Low sensitivity.", tip: "Generally safe in moderation." },
        "Week 4": { note: "Low sensitivity.", tip: "Usually well-tolerated." },
      },
    };

    return tooltipMap[food]?.[week] || { note: "No additional notes.", tip: "Monitor your symptoms." };
  };

  const handleCellHover = (e, food, week, percentage) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const tooltipData = getTooltipData(food, week, percentage);
    setHoveredCell(`${food}-${week}`);
    setTooltip({
      food,
      status: week,
      percentage,
      ...tooltipData,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handleCellLeave = () => {
    setTooltip(null);
    setHoveredCell(null);
  };

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchPremiumMonthAdvice = async () => {
      setAiLoading(true);
      try {
        const res = await postTrendBowelPremiumMonthAdvice(api, {
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
        console.error("Failed to load PremiumMonth bowel advice:", err);
      } finally {
        setAiLoading(false);
      }
    };

    fetchPremiumMonthAdvice();
  }, [api, auth?.user?.id]);

  return (
    <div className="pl-[15px] pr-[15px] mb-[93px] relative">
      <div className="text-base pl-[15px] font-medium mb-[11px] text-primary">
        Food vs Symptoms
      </div>
      <div className="w-full max-w-2xl rounded-[8px] bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.08)] relative">
        {/* Table */}
        <div className="overflow-x-auto bg-quinary rounded-[8px]">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-center text-sm font-bold text-primary pb-2 px-2">Food</th>
                <th className="text-center text-sm font-bold text-primary pb-2 px-2">Week 1</th>
                <th className="text-center text-sm font-bold text-primary pb-2 px-2">Week 2</th>
                <th className="text-center text-sm font-bold text-primary pb-2 px-2">Week 3</th>
                <th className="text-center text-sm font-bold text-primary pb-2 px-2">Week 4</th>
              </tr>
            </thead>
            <tbody>
              {foodData.map((row, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="text-center text-sm text-primary py-2 px-2">{row.food}</td>
                  <td
                    className={`text-center text-sm py-2 px-2 cursor-pointer ${hoveredCell === `${row.food}-Week 1` ? 'ring-2 ring-gray-400' : ''}`}
                    style={{ backgroundColor: getCellColor(row.week1) }}
                    onMouseEnter={(e) => handleCellHover(e, row.food, "Week 1", row.week1)}
                    onMouseLeave={handleCellLeave}
                  >
                    {row.week1}%
                  </td>
                  <td
                    className={`text-center text-sm py-2 px-2 cursor-pointer ${hoveredCell === `${row.food}-Week 2` ? 'ring-2 ring-gray-400' : ''}`}
                    style={{ backgroundColor: getCellColor(row.week2) }}
                    onMouseEnter={(e) => handleCellHover(e, row.food, "Week 2", row.week2)}
                    onMouseLeave={handleCellLeave}
                  >
                    {row.week2}%
                  </td>
                  <td
                    className={`text-center text-sm py-2 px-2 cursor-pointer ${hoveredCell === `${row.food}-Week 3` ? 'ring-2 ring-gray-400' : ''}`}
                    style={{ backgroundColor: getCellColor(row.week3) }}
                    onMouseEnter={(e) => handleCellHover(e, row.food, "Week 3", row.week3)}
                    onMouseLeave={handleCellLeave}
                  >
                    {row.week3}%
                  </td>
                  <td
                    className={`text-center text-sm py-2 px-2 cursor-pointer ${hoveredCell === `${row.food}-Week 4` ? 'ring-2 ring-gray-400' : ''}`}
                    style={{ backgroundColor: getCellColor(row.week4) }}
                    onMouseEnter={(e) => handleCellHover(e, row.food, "Week 4", row.week4)}
                    onMouseLeave={handleCellLeave}
                  >
                    {row.week4}%
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

        {aiLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Loader />
          </div>
        )}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.15)] p-5 max-w-xs"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
            marginTop: '-8px',
          }}
          onMouseEnter={() => setTooltip(tooltip)}
          onMouseLeave={handleCellLeave}
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

export default PremiumMonth;
