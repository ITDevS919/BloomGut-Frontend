import { Button } from "@/components/ui/button";
import { FaWaveSquare } from "react-icons/fa6";
import { FaUserCog } from "react-icons/fa";
import { LuChartNoAxesColumn } from "react-icons/lu";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BloomGut from "@/assets/BloomGut-透明板.png";

import Icon from "@/components/common/Icon";

const OnBoardScreen = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const slides = [
    {
      icon: <Icon name="iconWave" width={40} height={40} />,
      title: "Smart Health Tracker",
      description: "Record and analyze your key health metrics",
    },
    {
      icon: <Icon name="userCog" width={40} height={40} />,
      title: "Personalized",
      description: "Recive expert health advice from AI Assistant",
    },
    {
      icon: <Icon name="barChart" width={40} height={40} />,
      title: "Data Visualization",
      description: "Intutive Health Trend Analysis",
    },
  ];

  return (
    <div className="bg-ivory flex flex-col justify-center items-center text-primary p-6">
      <div className="w-full flex justify-end">
        <Button variant="ghost" onClick={() => navigate("/home")}>
          Skip
        </Button>
      </div>
      <div className="relative w-80 h-65">
        <img
          src={BloomGut}
          alt="Logo"
          className=" object-cover"
        />
      </div>
      <div className="flex flex-col items-center text-center gap-4 mt-15">
        {slides[activeSlide].icon}
        <h3 className="font-semibold text-lg text-primary leading-2 mt-15">
          {slides[activeSlide].title}
        </h3>
        <p className="text-sm leading-[18px] text-primary">
          {slides[activeSlide].description}
        </p>
      </div>
      <div className="flex gap-2 mt-20">
        {slides.map((_, index) => (
          <Button
            variant="link"
            key={index}
            className={`p-0 h-2 rounded-full transition-all duration-300 w-2 ${index === activeSlide ? "bg-custom-7" : "bg-custom-18"
              }`}
          />
        ))}
      </div>
      {activeSlide === 2 && (
        <div className="mt-4">
          <Button
            variant="outline"
            className="border border-custom-16 shadow-sm mt-15"
            onClick={() => navigate("/home")}
          >
            Start Now
          </Button>
        </div>
      )}
    </div>
  );
};

export default OnBoardScreen;
