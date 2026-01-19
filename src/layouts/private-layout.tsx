import React from "react";
import { FaArrowTrendUp } from "react-icons/fa6";
import { IoIosHome } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import { LuNotebookPen } from "react-icons/lu";
import { Outlet, useNavigate } from "react-router-dom";

const PrivateLayout = ({ children }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-screen relative">
      <div className="flex-1 overflow-y-auto pb-24">{children}</div>

      <div className="flex justify-between w-full p-4 bg-[#eae5dd] absolute bottom-0 left-0 z-10 shadow-md border-t-2 border-[#d3d3d3]">
        <div className="flex flex-col justify-center items-center gap-2">
          <IoIosHome style={{ color: "blue" }} size={42} onClick={() => navigate("/dashboard")} />
          <p className="text-primary-muted text-xs">Home</p>
        </div>
        <div className="flex flex-col justify-center items-center gap-2">
          <LuNotebookPen size={42} onClick={() => navigate("/dashboard")} />
          <p className="text-primary-muted text-xs">Record</p>
        </div>
        <div className="flex flex-col justify-center items-center gap-2">
          <FaArrowTrendUp size={42} onClick={() => navigate("/trend-analysis")} />
          <p className="text-primary-muted text-xs">Trends</p>
        </div>
        <div
          className="flex flex-col justify-center items-center gap-2"
          onClick={() => {
            navigate("/setting");
          }}
        >
          <IoSettingsSharp size={42} />
          <p className="text-primary-muted text-xs">Settings</p>
        </div>
      </div>
    </div>
  );
};

export default PrivateLayout;
