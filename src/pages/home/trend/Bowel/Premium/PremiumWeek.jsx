import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";

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

  const foodData = [
    { food: "Milk", abdPain: 90, diarrh: 70, constip: 30, bloat: 10 },
    { food: "Bread", abdPain: 20, diarrh: 80, constip: 40, bloat: 30 },
    { food: "Peanuts", abdPain: 50, diarrh: 20, constip: 90, bloat: 70 },
    { food: "Eggs", abdPain: 30, diarrh: 40, constip: 20, bloat: 80 },
    { food: "Seafood", abdPain: 80, diarrh: 60, constip: 50, bloat: 40 },
    { food: "Beans", abdPain: 40, diarrh: 30, constip: 60, bloat: 50 },
    { food: "Nuts", abdPain: 60, diarrh: 50, constip: 30, bloat: 20 },
  ];

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchPremiumWeekAdvice = async () => {
      setAiLoading(true);
      try {
        const res = await api.post("/trend/bowel/premiumWeekAdvice", {
          foods: foodData,
        });
        const data = res.data?.data ?? res.data;
        if (data) {
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

    const tooltipMap = {
      "Milk": {
        "Abd Pain": { note: "Often after milk intake.", tip: "Avoid empty stomach, try lactase, or use alternatives." },
        "Diarrh": { note: "Common with lactose intolerance.", tip: "Consider lactose-free options or reduce intake." },
        "Constip": { note: "Rare but possible.", tip: "Increase water intake with milk consumption." },
        "Bloat": { note: "Minimal impact.", tip: "Usually well-tolerated in small amounts." },
      },
      "Bread": {
        "Abd Pain": { note: "Low sensitivity.", tip: "Generally well-tolerated." },
        "Diarrh": { note: "High sensitivity observed.", tip: "Try gluten-free alternatives or reduce portion size." },
        "Constip": { note: "Moderate sensitivity.", tip: "Increase fiber intake and hydration." },
        "Bloat": { note: "Moderate sensitivity.", tip: "Consider whole grain options." },
      },
      "Peanuts": {
        "Abd Pain": { note: "Moderate sensitivity.", tip: "Monitor portion sizes." },
        "Diarrh": { note: "Low sensitivity.", tip: "Generally safe in moderation." },
        "Constip": { note: "High sensitivity observed.", tip: "Reduce intake or avoid if severe." },
        "Bloat": { note: "High sensitivity.", tip: "Try roasted or avoid if persistent." },
      },
      "Eggs": {
        "Abd Pain": { note: "Low sensitivity.", tip: "Usually well-tolerated." },
        "Diarrh": { note: "Moderate sensitivity.", tip: "Cook thoroughly and monitor portions." },
        "Constip": { note: "Low sensitivity.", tip: "Generally safe." },
        "Bloat": { note: "High sensitivity.", tip: "Reduce intake or try egg whites only." },
      },
      "Seafood": {
        "Abd Pain": { note: "High sensitivity.", tip: "Ensure freshness and proper cooking." },
        "Diarrh": { note: "Moderate sensitivity.", tip: "Start with small portions." },
        "Constip": { note: "Moderate sensitivity.", tip: "Increase water intake." },
        "Bloat": { note: "Moderate sensitivity.", tip: "Monitor portion sizes." },
      },
      "Beans": {
        "Abd Pain": { note: "Moderate sensitivity.", tip: "Soak before cooking to reduce gas." },
        "Diarrh": { note: "Low sensitivity.", tip: "Generally well-tolerated when cooked properly." },
        "Constip": { note: "Moderate sensitivity.", tip: "Increase water intake with beans." },
        "Bloat": { note: "Moderate sensitivity.", tip: "Soak and cook thoroughly." },
      },
      "Nuts": {
        "Abd Pain": { note: "Moderate sensitivity.", tip: "Monitor portion sizes." },
        "Diarrh": { note: "Moderate sensitivity.", tip: "Try different types of nuts." },
        "Constip": { note: "Low sensitivity.", tip: "Generally safe in moderation." },
        "Bloat": { note: "Low sensitivity.", tip: "Usually well-tolerated." },
      },
    };

    return tooltipMap[food]?.[symptom] || { note: "No additional notes.", tip: "Monitor your symptoms." };
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
      <div className="w-full max-w-2xl rounded-[8px] bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
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
       
      </div>

      {/* Cell Tooltip */}
      {/* {tooltip && (
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
      )} */}

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
          className="flex items-center justify-center bg-white rounded-[8px] px-6 py-2 text-lg text-secondary"
          onClick={() => navigate("/trend-analysis?plan=intermediate", { state: { trendType: "bowel", viewMode: "month", subscribed: true } })}
        >
          OverView
        </button>
      </div>
    </div>
  );
};

export default PremiumWeek;
