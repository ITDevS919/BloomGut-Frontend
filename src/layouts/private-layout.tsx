import React from "react";
import { FaArrowTrendUp } from "react-icons/fa6";
import { IoIosHome } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import { LuNotebookPen } from "react-icons/lu";
import { Outlet, useNavigate } from "react-router-dom";

const PrivateLayout = ({ children }) => {
  const navigate = useNavigate();

  const navItems = [
    {
      icon: IoIosHome,
      label: "Home",
      path: "/dashboard",
      color: "#C69C6D",
    },
    {
      icon: LuNotebookPen,
      label: "Records",
      path: "/diet-record",
      color: "#FBB667",
    },
    {
      icon: FaArrowTrendUp,
      label: "Trends",
      path: "/trend-analysis",
      color: "#4CAF50",
    },
    {
      icon: IoSettingsSharp,
      label: "Settings",
      path: "/setting",
      color: "#705D56",
    },
  ];

  return (
    <div className="flex flex-col h-screen relative">
      <div className="flex-1 overflow-y-auto pb-24">{children}</div>

      <div className="flex justify-between items-center w-full px-2 py-3 bg-[#EFEBE4] absolute bottom-0 left-0 z-10 rounded-t-2xl">
        {navItems.map((item) => {
          const IconComponent = item.icon;

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className="flex flex-col justify-center items-center gap-1.5 flex-1 cursor-pointer transition-opacity hover:opacity-80 active:opacity-70"
            >
              <IconComponent 
                size={24} 
                style={{ color: item.color }}
                className="shrink-0"
              />
              <p className="text-xs" style={{ color: "#705D56" }}>
                {item.label}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PrivateLayout;
