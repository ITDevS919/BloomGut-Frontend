import { ChevronLeft } from "lucide-react";
import { Activity, Heart, Droplet, Coffee } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TrendHeader from "./TrendHeader";
import Bowel from "./Bowel";
import Diet from "./Diet";
import Water from "./Water";
import Urine from "./Urine";

const Trend = () => {
  const location = useLocation();
  const [trendType, setTrendType] = useState(<Bowel />);

  useEffect(() => {
    // Check if trendType was passed via navigation state
    if (location.state?.trendType) {
      const selectedTrend = location.state.trendType;
      switch (selectedTrend) {
        case "bowel":
          setTrendType(<Bowel />);
          break;
        case "diet":
          setTrendType(<Diet />);
          break;
        case "water":
          setTrendType(<Water />);
          break;
        case "urine":
          setTrendType(<Urine />);
          break;
        default:
          setTrendType(<Bowel />);
      }
    } else {
      // Default to Bowel if no trend type is specified
      setTrendType(<Bowel />);
    }
  }, [location.state]);

  return (
    <main>
      <TrendHeader setTrendType={setTrendType} />
      {trendType}
    </main>
  );
};

export default Trend;
