import { HiChatBubbleLeft, HiIdentification } from "react-icons/hi2";
import { FaBell, FaSignOutAlt } from "react-icons/fa";
import { FaSlidersH } from "react-icons/fa";
import { FaCrown } from "react-icons/fa";
import { FaShieldAlt } from "react-icons/fa";
import { IoChatbubbles, IoHeadset } from "react-icons/io5";
import { LogOut, ChevronLeft } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { MdChat } from "react-icons/md";
import { FaComment, FaComments, FaIdCard } from "react-icons/fa6";

const Settings = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);

  const { signOut } = useAuth(); // Assuming useAuth is defined elsewhere
  const account = [
    {
      icon: <FaIdCard />,
      label: "Account",
      onclick: () => navigate("/setting/account"),
    },
    {
      icon: <FaBell />,
      label: "Notification",
      onclick: () => navigate("/setting/notification"),
    },
    {
      icon: <FaSlidersH />,
      label: "App Settings",
      onclick: () => navigate("/setting/app-setting"),
    },
    {
      icon: <FaCrown />,
      label: "Upgrade Plan",
      onclick: () => navigate("/setting/upgrade-plan"),
    },
  ];

  const privacyAndSupport = [
    {
      icon: <FaShieldAlt />,
      label: "Privacy Policy",
      onclick: () => navigate("/setting/privacy-policy"),
    },
    {
      icon: <FaComments />,
      label: "About Us",
      onclick: () => navigate("/setting/about-us"),
    },
    {
      icon: <IoHeadset />,
      label: "Help And Customer Service",
      onclick: () => navigate("/setting/help-support"),
    },
    {
      icon: <FaSignOutAlt />,
      label: "Log out",
      onclick: () => openLogoutModal(),
    },
  ];
  return (
    <div className="bg-ivory min-h-full p-6 text-primary">
      <div className="flex items-center gap-4 mb-[43px]">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-[40px] leading-none cursor-pointer  cursor-pointer" />
        </button>
        <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">Settings</h2>
      </div>

      <div className="space-y-4 text-primary font-['Noto_Sans_TC', sans-serif]">
        <section className="mb-[24px]">
          <h2 className="text-[18px] mb-[20px] pl-3">Account</h2>
          <div className="bg-transparent rounded-[8px] overflow-hidden">
            {account.map((item, index) => (
              <button
                key={index}
                onClick={item.onclick}
                className={`w-full flex items-center justify-between gap-4 px-3 py-3 rounded-[8px] mb-[22px] text-left cursor-pointer`}
              >
                <div className="flex items-center gap-3" onClick={item.onclick}>
                  <div className="text-secondary" width="21px" height="28px">{item.icon}</div>
                  <span className="text-secondary text-[16px]">{item.label}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-[18px] mb-[28px] pl-3">Privacy & Support</h3>
          <div className="bg-transparent rounded-[8px] overflow-hidden">
            {privacyAndSupport.map((item, index) => (
              <button
                key={index}
                onClick={item.onclick}
                className={`w-full flex items-center justify-between cursor-pointer gap-4 px-3 py-3 rounded-[8px] mb-[22px] text-left ${item.label.toLowerCase().includes("logout")
                  ? "text-red-500"
                  : ""
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-secondary" width="21px" height="28px">{item.icon}</div>
                  <span className="text-secondary text-[16px]">{item.label}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      {showLogoutModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
          onClick={closeLogoutModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fffffb",
              paddingLeft: "46px",
              paddingRight: "46px",
              width: "288px",
              height: "162px",
              paddingTop: "16px",
              paddingBottom: "22px",
              textAlign: "center",
            }}
            className="rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
          >
            <div className="text-primary text-[18px] mb-[18px]">
              Log out?
            </div>
            <div style={{ display: "flex", justifyContent: "center" }} className="gap-[16px] mb-[18px]">
              <button
                type="button"
                onClick={closeLogoutModal}
                className="shadow-[0_2px_6px_#afafaf] rounded-[8px] text-[#d32f2f] w-[64px] h-[38px] text-[14px] font-['Roboto', sans-serif] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => signOut()}
                className="shadow-[0_2px_6px_#afafaf] rounded-[8px] text-primary w-[64px] h-[38px] text-[14px] font-['Roboto', sans-serif] border-secondary border-[1px] cursor-pointer"
              >
                Confirm
              </button>
            </div>
            <div className="text-[12px] text-[#929292]">
              You'll need to sign in again
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
