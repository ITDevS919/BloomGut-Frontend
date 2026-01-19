import { ChevronLeft } from "lucide-react";
import { Activity, Heart, Droplet, Coffee } from "lucide-react";
import { useState } from "react";
import TrendHeader from "./TrendHeader";
import Bowel from "./Bowel";

const Trend = () => {
  const [trendType, setTrendType] = useState(<Bowel />);
  return (
    <>
      <TrendHeader setTrendType={setTrendType} />
      {trendType}
    </>
  );
};

export default Trend;
