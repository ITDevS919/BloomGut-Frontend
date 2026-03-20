import { Activity, ChevronLeft, Coffee, Droplet, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import Bowel from "./Bowel";
import Water from "./Water";
import Urine from "./Urine";
import Diet from "./Diet";
import { FaToilet, FaUtensils } from "react-icons/fa6";
import { FaGlassWhiskey, FaTint } from "react-icons/fa";
import { MdLocalDrink } from "react-icons/md";
import usePremiumEntitlement from "@/hooks/usePremiumEntitlement";

const TrendHeader = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedIcon, setSelectedIcon] = useState("toilet");
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");
  const { premiumEntitled } = usePremiumEntitlement();
  const isPremiumRoute = plan === "premium" || plan === "intermediate" || plan === "pro";
  const showPremium = premiumEntitled && isPremiumRoute;

  const handleBackClick = () => {
    if (location.state?.trendType === "bowel" || selectedIcon === "toilet") {
      navigate("/stool");
    } else if (location.state?.trendType === "diet" || selectedIcon === "utensils") {
      navigate("/diet-record");
    } else if (location.state?.trendType === "water" || selectedIcon === "water") {
      navigate("/water-record");
    } else if (location.state?.trendType === "urine" || selectedIcon === "urine") {
      navigate("/urine-record");
    } else {
      window.history.back();
    }
  };

  useEffect(() => {
    // Set initial selected icon based on navigation state
    if (location.state?.trendType) {
      const trendType = location.state.trendType;
      switch (trendType) {
        case "bowel":
          setSelectedIcon("toilet");
          break;
        case "diet":
          setSelectedIcon("utensils");
          break;
        case "water":
          setSelectedIcon("water");
          break;
        case "urine":
          setSelectedIcon("urine");
          break;
        default:
          setSelectedIcon("toilet");
      }
    }
  }, [location.state]);

  const getBackButtonLabel = () => {
    if (location.state?.trendType === "bowel" || selectedIcon === "toilet") {
      return "Go back to stool records";
    }
    if (location.state?.trendType === "diet" || selectedIcon === "utensils") {
      return "Go back to diet records";
    }
    if (location.state?.trendType === "water" || selectedIcon === "water") {
      return "Go back to water records";
    }
    if (location.state?.trendType === "urine" || selectedIcon === "urine") {
      return "Go back to urine records";
    }
    return "Go back to previous page";
  };

  return (
    <div className="bg-ivory p-1 text-secondary font-['Noto_Sans_TC', sans-serif]">
      <div className="flex items-center gap-4 mb-6 mt-[20px] ml-[20px]">
        <button
          type="button"
          className="text-primary text-xl leading-none cursor-pointer"
          aria-label={getBackButtonLabel()}
          onClick={handleBackClick}
        >
          <ChevronLeft className="text-primary text-[40px] leading-none" />
        </button>
        <h2 className="text-lg text-primary">Health Trends</h2>
      </div>

      <div className={`flex justify-end ${showPremium ? "mt-5 mb-[40px]" : "mt-5"}`}>
        <button
          type="button"
          className={`border border-custom-8 text-sm px-6 py-1 rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.12)] mr-5 cursor-pointer ${showPremium
              ? "bg-[#fff5c0] text-secondary"
              : "bg-[#E2F1DB] text-[#4F7E4E]"
            }`}
          aria-label={
            showPremium ? "Current plan: Premium" : "Current plan: Free, 7 days"
          }
        >
          {showPremium ? "Premium" : "Free/7 Days"}
        </button>
      </div>

      {/* {plan !== "premium" && ( */}
        <div className="mt-[60px]">
          {/* icons row */}
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex flex-col items-center text-sm text-gray-500">
              <FaToilet
                className={`w-8 h-8 cursor-pointer ${selectedIcon === "toilet" ? "text-[#E29C53]" : "text-[#F3D5B2]"}`}
                onClick={() => { setSelectedIcon("toilet"); props.setTrendType(<Bowel />) }}
                role="button"
                tabIndex={0}
                aria-label="Show bowel trend"
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedIcon("toilet");
                    props.setTrendType(<Bowel />);
                  }
                }}
              />
              <div className="mt-[11px] text-secondary">Bowel Trend</div>
            </div>
            <div className="flex flex-col items-center text-sm text-gray-500">
              <FaUtensils
                className={`w-8 h-8 cursor-pointer ${selectedIcon === "utensils" ? "text-[#6AA84F]" : "text-[#CFE4B8]"}`}
                onClick={() => { setSelectedIcon("utensils"); props.setTrendType(<Diet />) }}
                role="button"
                tabIndex={0}
                aria-label="Show diet trend"
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedIcon("utensils");
                    props.setTrendType(<Diet />);
                  }
                }}
              />
              <div className="mt-2 text-secondary">Diet Trend</div>
            </div>
            <div className="flex flex-col items-center text-sm text-gray-500">
              <FaGlassWhiskey
                className={`w-8 h-8 cursor-pointer ${selectedIcon === "water" ? "text-custom-13" : "text-[#D6EAF8]"}`}
                onClick={() => { setSelectedIcon("water"); props.setTrendType(<Water />) }}
                role="button"
                tabIndex={0}
                aria-label="Show water trend"
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedIcon("water");
                    props.setTrendType(<Water />);
                  }
                }}
              />
              <div className="mt-2 text-secondary">Water Trend</div>
            </div>
            <div className="flex flex-col items-center text-sm text-gray-500">
              <FaTint
                className={`w-8 h-8 cursor-pointer ${selectedIcon === "urine" ? "text-[#F6C700]" : "text-[#FDE8B4]"}`}
                onClick={() => { setSelectedIcon("urine"); props.setTrendType(<Urine />) }}
                role="button"
                tabIndex={0}
                aria-label="Show urine trend"
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedIcon("urine");
                    props.setTrendType(<Urine />);
                  }
                }}
              />
              <div className="mt-2 text-secondary">Urine Trend</div>
            </div>
          </div>
        </div>
      {/* )} */}
    </div>
  );
};

export default TrendHeader;
