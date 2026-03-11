import React, { useState, useRef, useEffect } from "react";
import { FaArrowTrendUp, FaToilet, FaUtensils } from "react-icons/fa6";
import { IoIosHome } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import { LuNotebookPen } from "react-icons/lu";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import homeIcon from "@/assets/Images/Home.svg";
import selectedHomeIcon from "@/assets/Images/Selected Home.svg";
import recordIcon from "@/assets/Images/Notebook.svg";
import selectedRecordIcon from "@/assets/Images/Selected Notebook.svg";
import trendIcon from "@/assets/Images/Icon query stats.svg";
import selectedTrendIcon from "@/assets/Images/Selected Icon query stats.svg";
import settingIcon from "@/assets/Images/Icon settings.svg";
import selectedSettingIcon from "@/assets/Images/Selected Icon settings.svg";
import Icon from "@/components/common/Icon";
import { FaGlassWhiskey, FaTint } from "react-icons/fa";
import { useAuth } from "@clerk/clerk-react";

const PrivateLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const [selectedIcon, setSelectedIcon] = useState(homeIcon);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showTrendModal, setShowTrendModal] = useState(false);
  const recordsButtonRef = useRef(null);
  const trendButtonRef = useRef(null);
  const modalRef = useRef(null);
  const trendModalRef = useRef(null);
  const previousPathRef = useRef(location.pathname);
  const isManualNavigationRef = useRef(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/auth/login");
    }
  }, [isLoaded, isSignedIn, navigate]);

  const recordOptions = [
    {
      label: "Bowel Log",
      icon: <FaToilet />,
      path: "/stool",
      color: 'text-[#F3D5B2]',
      selectedColor: '#E29C53',
    },
    {
      label: "Diet Log",
      icon: "Utensils",
      path: "/diet-record",
      color: 'text-[#CFE4B8]',
      selectedColor: '#6AA84F',
    },
    {
      label: "Water Log",
      icon: "WaterGlass",
      path: "/water-record",
      color: 'text-[#D6EAF8]',
      selectedColor: '#79b6e2',
    },
    {
      label: "Urine Log",
      icon: "WaterDrop",
      path: "/urine-record",
      color: 'text-[#FDE8B4]',
      selectedColor: '#F6C700',
    },
  ];

  const navItems = [
    {
      icon: homeIcon,
      selectionIcon: selectedHomeIcon,
      label: "Home",
      path: "/dashboard",
      color: "#C69C6D",
      width: '40px',
      height: '40px',
    },

    {
      icon: recordIcon,
      selectionIcon: selectedRecordIcon,
      label: "Records",
      path: "/diet-record",
      color: "#FBB667",
      width: '60px',
      height: '40px',
      isRecords: true,
    },
    {
      icon: trendIcon,
      selectionIcon: selectedTrendIcon,
      label: "Trends",
      path: "/trend-analysis",
      color: "#4CAF50",
      width: '40px',
      height: '40px',
    },
    {
      icon: selectedSettingIcon,
      selectionIcon: settingIcon,
      label: "Settings",
      path: "/setting",
      color: "#705D56",
      width: '30px',
      height: '40px',
    },
  ];

  // Sync selected icon with current route
  useEffect(() => {
    const currentPath = location.pathname;
    const previousPath = previousPathRef.current;

    // If navigation was done via button click, don't override (it's already set)
    if (isManualNavigationRef.current) {
      isManualNavigationRef.current = false;
      previousPathRef.current = currentPath;
      return;
    }

    // Check if current path is a record route
    const recordRoutes = ["/stool", "/diet-record", "/water-record", "/urine-record"];
    if (recordRoutes.includes(currentPath)) {
      setSelectedIcon(selectedRecordIcon);
      // Set selected record option based on current path
      if (currentPath === "/stool") {
        setSelectedRecordOption("toilet");
      } else if (currentPath === "/diet-record") {
        setSelectedRecordOption("utensils");
      } else if (currentPath === "/water-record") {
        setSelectedRecordOption("water");
      } else if (currentPath === "/urine-record") {
        setSelectedRecordOption("urine");
      }
      previousPathRef.current = currentPath;
      return;
    }

    // If on dashboard, set Home icon as active and reset selected record option
    if (currentPath === "/dashboard") {
      setSelectedIcon(selectedHomeIcon);
      setSelectedRecordOption("");
      previousPathRef.current = currentPath;
      return;
    }

    // Match current path with navItems
    const matchedItem = navItems.find(item => item.path === currentPath);
    if (matchedItem && !matchedItem.isRecords) {
      setSelectedIcon(matchedItem.selectionIcon);
    }

    previousPathRef.current = currentPath;
  }, [location.pathname]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showRecordModal &&
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        recordsButtonRef.current &&
        !recordsButtonRef.current.contains(event.target)
      ) {
        setShowRecordModal(false);
      }
      if (
        showTrendModal &&
        trendModalRef.current &&
        !trendModalRef.current.contains(event.target) &&
        trendButtonRef.current &&
        !trendButtonRef.current.contains(event.target)
      ) {
        setShowTrendModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showRecordModal, showTrendModal]);

  const handleRecordClick = () => {
    setShowRecordModal(!showRecordModal);
  };

  const handleRecordOptionClick = (path) => {
    isManualNavigationRef.current = true;
    navigate(path);
    setShowRecordModal(false);
    setSelectedIcon(selectedRecordIcon);
  };

  const handleTrendClick = () => {
    setShowTrendModal(!showTrendModal);
  };

  const handleTrendOptionClick = (trendType) => {
    isManualNavigationRef.current = true;
    navigate("/trend-analysis", { state: { trendType } });
    setShowTrendModal(false);
    setSelectedIcon(selectedTrendIcon);
  };

  const [selectedRecordOption, setSelectedRecordOption] = useState("");
  const [selectedTrendOption, setSelectedTrendOption] = useState("");
  return (
    <div className="flex flex-col min-h-screen relative o">
      <div className="flex-1 overflow-y-auto pb-24 min-h-0">{children}</div>

      <div className="flex justify-between items-center w-full px-2 py-4 bg-[#EFEBE4] fixed bottom-0 left-0 right-0 z-10 shadow-sm border border-custom-8">
        {navItems.map((item) => {
          // const IconComponent = item.icon;

          return (
            <button
              key={item.path}
              ref={item.isRecords ? recordsButtonRef : item.label === "Trends" ? trendButtonRef : null}
              type="button"
              onClick={() => {
                if (item.isRecords) {
                  handleRecordClick();
                } else if (item.label === "Trends") {
                  handleTrendClick();
                } else {
                  isManualNavigationRef.current = true;
                  navigate(item.path);
                  setSelectedIcon(item.selectionIcon);
                }
                if (item.label === "Home") {
                  setSelectedRecordOption("");
                  setSelectedTrendOption("");
                }
                if (item.label === "Settings") {
                  setSelectedRecordOption("");
                  setSelectedTrendOption("");
                }
              }}
              className="flex flex-col justify-center items-center gap-1.5 flex-1 cursor-pointer transition-opacity hover:opacity-80 active:opacity-70 relative"
            >
              {/* <IconComponent 
                size={24} 
                style={{ color: item.color }}
                className="shrink-0"
              /> */}
              <img
                src={selectedIcon === item.selectionIcon ? item.selectionIcon : item.icon}
                alt={item.label}
                className="object-contain"
                style={{ width: item.width, height: item.height }}
              />
              <p className="text-sm" style={{ color: "#705D56" }}>
                {item.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* Record Selection Modal */}
      {showRecordModal && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 z-20 bg-black/20"
            onClick={() => setShowRecordModal(false)}
          />
          {/* Modal positioned above Records button */}
          <div className="fixed bottom-24 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
            <div
              ref={modalRef}
              className="bg-white rounded-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.16)] px-6 py-5 pointer-events-auto"
              style={{
                width: "auto",
                maxWidth: "480px",
              }}
            >
              <h3 className="text-base text-primary mb-4">
                Choose Record
              </h3>
              <div className="flex justify-between items-center gap-4">
                {/* {recordOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecordOptionClick(option.path)}
                    className="flex flex-col items-center gap-3 flex-1 cursor-pointer transition-opacity hover:opacity-80 active:opacity-70"
                  >
                    <div className="flex items-center justify-center w-16 h-16">
                      {option.icon}
                    </div>
                    <p className="text-sm text-center leading-tight whitespace-nowrap" style={{ color: "#705D56" }}>
                      {option.label}
                    </p>
                  </button>
                ))} */}
                <button className="flex flex-col items-center gap-3 flex-1 cursor-pointer" onClick={() => { handleRecordOptionClick("/stool"); setSelectedRecordOption("toilet"); setSelectedTrendOption("") }}>
                  <FaToilet className={` ${selectedRecordOption === "toilet" ? "text-[#E29C53]" : "text-[#F3D5B2]"}`} size={32} />
                  <p className="text-sm text-center leading-tight whitespace-nowrap" style={{ color: "#705D56" }}>
                    Bowel Log
                  </p>
                </button>
                <button className="flex flex-col items-center gap-3 flex-1 cursor-pointer" onClick={() => { handleRecordOptionClick("/diet-record"); setSelectedRecordOption("utensils"); setSelectedTrendOption("") }}>
                  <FaUtensils className={` ${selectedRecordOption === "utensils" ? "text-[#6AA84F]" : "text-[#CFE4B8]"}`} size={32} />
                  <p className="text-sm text-center leading-tight whitespace-nowrap" style={{ color: "#705D56" }}>
                    Diet Log
                  </p>
                </button>
                <button className="flex flex-col items-center gap-3 flex-1 cursor-pointer" onClick={() => { handleRecordOptionClick("/water-record"); setSelectedRecordOption("water"); setSelectedTrendOption("") }}>
                  <FaGlassWhiskey className={` ${selectedRecordOption === "water" ? "text-[#79b6e2]" : "text-[#D6EAF8]"}`} size={32} />
                  <p className="text-sm text-center leading-tight whitespace-nowrap" style={{ color: "#705D56" }}>
                    Water Log
                  </p>
                </button>
                <button className="flex flex-col items-center gap-3 flex-1 cursor-pointer" onClick={() => { handleRecordOptionClick("/urine-record"); setSelectedRecordOption("urine"); setSelectedTrendOption("") }}>
                  <FaTint className={` ${selectedRecordOption === "urine" ? "text-[#F6C700]" : "text-[#FDE8B4]"}`} size={32} />
                  <p className="text-sm text-center leading-tight whitespace-nowrap" style={{ color: "#705D56" }}>
                    Urine Log
                  </p>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Trend Selection Modal */}
      {showTrendModal && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 z-20 bg-black/20"
            onClick={() => setShowTrendModal(false)}
          />
          {/* Modal positioned above Trend button */}
          <div className="fixed bottom-24 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
            <div
              ref={trendModalRef}
              className="bg-white rounded-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.16)] px-6 py-5 pointer-events-auto"
              style={{
                width: "auto",
                maxWidth: "480px",
              }}
            >
              <h3 className="text-base text-primary mb-4">
                Choose Trend
              </h3>
              <div className="flex justify-between items-center gap-4">
                <button
                  className="flex flex-col items-center gap-3 flex-1 cursor-pointer transition-opacity hover:opacity-80 active:opacity-70"
                  onClick={() => { handleTrendOptionClick("bowel"); setSelectedTrendOption("toilet"); setSelectedRecordOption("") }}
                >
                  <FaToilet className={` ${selectedTrendOption === "toilet" ? "text-[#E29C53]" : "text-[#F3D5B2]"}`} size={32} />
                  <p className="text-sm text-center leading-tight whitespace-nowrap text-secondary">
                    Bowel Trend
                  </p>
                </button>
                <button
                  className="flex flex-col items-center gap-3 flex-1 cursor-pointer transition-opacity hover:opacity-80 active:opacity-70"
                  onClick={() => { handleTrendOptionClick("diet"); setSelectedTrendOption("utensils"); setSelectedRecordOption("") }}
                >
                  <FaUtensils className={` ${selectedTrendOption === "utensils" ? "text-[#6AA84F]" : "text-[#CFE4B8]"}`} size={32} />
                  <p className="text-sm text-center leading-tight whitespace-nowrap text-secondary">
                    Diet Trend
                  </p>
                </button>
                <button
                  className="flex flex-col items-center gap-3 flex-1 cursor-pointer transition-opacity hover:opacity-80 active:opacity-70"
                  onClick={() => { handleTrendOptionClick("water"); setSelectedTrendOption("water"); setSelectedRecordOption("") }}
                >
                  <FaGlassWhiskey className={` ${selectedTrendOption === "water" ? "text-[#79b6e2]" : "text-[#D6EAF8]"}`} size={32} />
                  <p className="text-sm text-center leading-tight whitespace-nowrap text-secondary">
                    Water Trend
                  </p>
                </button>
                <button
                  className="flex flex-col items-center gap-3 flex-1 cursor-pointer transition-opacity hover:opacity-80 active:opacity-70"
                  onClick={() => { handleTrendOptionClick("urine"); setSelectedTrendOption("urine"); setSelectedRecordOption("") }}
                >
                  <FaTint className={` ${selectedTrendOption === "urine" ? "text-[#F6C700]" : "text-[#FDE8B4]"}`} size={32} />
                  <p className="text-sm text-center leading-tight whitespace-nowrap text-secondary">
                    Urine Trend
                  </p>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PrivateLayout;