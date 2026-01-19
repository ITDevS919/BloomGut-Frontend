import { HiIdentification } from "react-icons/hi2";
import { FaBell } from "react-icons/fa";
import { FaSlidersH } from "react-icons/fa";
import { FaCrown } from "react-icons/fa";
import { FaShieldAlt } from "react-icons/fa";
import { IoChatbubbles, IoHeadset } from "react-icons/io5";
import { LogOut, ChevronLeft } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const Settings = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);

  const { signOut } = useAuth(); // Assuming useAuth is defined elsewhere
  const account = [
    {
      icon: <HiIdentification />,
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
      icon: <IoChatbubbles />,
      label: "About Us",
      onclick: () => navigate("/setting/about-us"),
    },
    {
      icon: <IoHeadset />,
      label: "Help And Customer Service",
      onclick: () => navigate("/setting/help-support"),
    },
    {
      icon: <LogOut />,
      label: "Log out",
      onclick: () => openLogoutModal(),
    },
  ];
  return (
    <div className="bg-ivory min-h-full p-6 text-secondary">
      <div className="flex items-center gap-4 mb-10">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-xl leading-none" />
        </button>
        <h2 className="text-xl font-semibold">Settings</h2>
      </div>

      <div className="space-y-4">
        <section>
          <h2 className="font-normal mb-2 pl-3 text-lg">Account</h2>
          <div className="bg-transparent rounded-md overflow-hidden">
            {account.map((item, index) => (
              <button
                key={index}
                onClick={item.onclick}
                className={`w-full flex items-center justify-between gap-4 px-3 py-3 rounded-md mb-2 hover:bg-gray-50 text-left`}
              >
                <div className="flex items-center gap-3" onClick={item.onclick}>
                  <div className="text-primary text-lg">{item.icon}</div>
                  <span className="text-base text-primary">{item.label}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-normal mb-2 pl-3 text-lg">Privacy & Support</h3>
          <div className="bg-transparent rounded-md overflow-hidden">
            {privacyAndSupport.map((item, index) => (
              <button
                key={index}
                onClick={item.onclick}
                className={`w-full flex items-center justify-between gap-4 px-3 py-3 rounded-md mb-2 hover:bg-gray-50 text-left ${
                  item.label.toLowerCase().includes("logout")
                    ? "text-red-500"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-primary text-lg">{item.icon}</div>
                  <span className="text-base text-primary">{item.label}</span>
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
              background: "white",
              padding: 18,
              borderRadius: 10,
              width: 320,
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
              Log out?
            </div>
            <div style={{ fontSize: 13, color: "#8b7a73", marginBottom: 16 }}>
              You'll need to sign in again
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                type="button"
                onClick={closeLogoutModal}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #e6e0dc",
                  background: "white",
                  color: "#c33",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => signOut()}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: "#e9c29a",
                  color: "#4b332d",
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
