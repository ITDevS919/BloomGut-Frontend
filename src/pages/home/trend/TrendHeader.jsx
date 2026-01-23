import { Activity, ChevronLeft, Coffee, Droplet, Heart } from "lucide-react";
import { useState } from "react";
import Bowel from "./Bowel";
import Water from "./Water";
import Urine from "./Urine";
import Diet from "./Diet";
import { FaToilet, FaUtensils } from "react-icons/fa6";
import { FaGlassWhiskey, FaTint } from "react-icons/fa";
import { MdLocalDrink } from "react-icons/md";

const TrendHeader = (props) => {
  const [selectedIcon, setSelectedIcon] = useState("toilet");

  return (
    <div className="bg-ivory p-1 text-secondary font-['Noto_Sans_TC', sans-serif]">
      <div className="flex items-center gap-4 mb-6 mt-[20px]">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-[40px] leading-none cursor-pointer " />
        </button>
        <h2 className="text-lg font-medium text-primary">Health Trends</h2>
      </div>

      <div className="flex justify-end mt-5">
        <button className="bg-[#E2F1DB] border border-custom-8 text-[#4F7E4E] text-sm px-6 py-1 rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.12)]">
          Free/7 Days
        </button>
      </div>

      <div className="mt-[60px]">
        {/* icons row */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex flex-col items-center text-sm text-gray-500">
            <FaToilet
              className={`w-6 h-6 cursor-pointer ${selectedIcon === "toilet" ? "text-[#E29C53]" : "text-[#F3D5B2]"}`}
              onClick={() => { setSelectedIcon("toilet"); props.setTrendType(<Bowel />) }}
            />
            <div className="mt-[11px] text-secondary">Bowel Trend</div>
          </div>
          <div className="flex flex-col items-center text-sm text-gray-500">
            <FaUtensils
              className={`w-6 h-6 cursor-pointer ${selectedIcon === "utensils" ? "text-[#6AA84F]" : "text-[#CFE4B8]"}`}
              onClick={() => { setSelectedIcon("utensils"); props.setTrendType(<Diet />) }}
            />
            <div className="mt-2 text-secondary">Diet Trend</div>
          </div>
          <div className="flex flex-col items-center text-sm text-gray-500">
            <FaGlassWhiskey
              className={`w-6 h-6 cursor-pointer ${selectedIcon === "water" ? "text-[#79b6e2]" : "text-[#D6EAF8]"}`}
              onClick={() => { setSelectedIcon("water"); props.setTrendType(<Water />) }}
            />
            <div className="mt-2 text-secondary">Water Trend</div>
          </div>
          <div className="flex flex-col items-center text-sm text-gray-500">
            <FaTint
              className={`w-6 h-6 cursor-pointer ${selectedIcon === "urine" ? "text-[#F6C700]" : "text-[#FDE8B4]"}`}
              onClick={() => { setSelectedIcon("urine"); props.setTrendType(<Urine />) }}
            />
            <div className="mt-2 text-secondary">Urine Trend</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendHeader;
