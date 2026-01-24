import { ChevronLeft } from "lucide-react";
import React, { useState } from "react";
import { set } from "react-hook-form";

const Switch = ({ checked, onChange }) => {
  const outer = {
    width: 44,
    height: 24,
    borderRadius: 24,
    padding: 3,
    display: "inline-block",
    boxSizing: "border-box",
    background: checked ? "#C69C6D" : "#e6e0dc",
    cursor: "pointer",
    transition: "background 160ms",
  };
  const knob = {
    width: 18,
    height: 18,
    borderRadius: 18,
    background: "white",
    transform: checked ? "translateX(20px)" : "translateX(0)",
    transition: "transform 180ms",
  };
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={outer}
    >
      <div style={knob} />
    </button>
  );
};

const SectionDivider = () => (
  <div style={{ height: 1, background: "#e6e0dc" }} />
);

const Notification = () => {
  const [oneClickOpen, setOneClickOpen] = useState(false);
  const [subUpdates, setSubUpdates] = useState(false);
  const [offers, setOffers] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [inApp, setInApp] = useState(false);
  const [email, setEmail] = useState(false);

  const subtitle = { fontSize: 12, color: "#8b7a73", marginTop: 6 };

  return (
    <div className="bg-ivory min-h-full p-6 text-primary font-['Roboto', sans-serif]">
      <div className="flex items-center gap-4 mb-[48px]">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
          style={{ background: "transparent", border: "none", padding: 0 }}
        >
          <ChevronLeft className="text-primary text-[40px] leading-none cursor-pointer " />
        </button>
        <h2 className="text-lg">Notification Settings</h2>
      </div>

      <div className="">
        <div className="text-base font-bold text-primary mb-[13px]">Interaction</div>
        <div className="flex justify-between items-center mt-4">
          <div>
            <div className="text-base text-primary mb-[3px]">One-click Open</div>
            <div className="text-sm text-custom-12 mb-[16px]">Enable to get all notifications</div>
          </div>
          <button
            onClick={() => {
              setOneClickOpen(!oneClickOpen);
              setSubUpdates(!oneClickOpen);
              setOffers(!oneClickOpen);
              setMaintenance(!oneClickOpen);
              setInApp(!oneClickOpen);
              setEmail(!oneClickOpen);
            }}
            aria-pressed={oneClickOpen}
            className={`w-12 h-7 flex items-center p-1 rounded-full transition-colors bg-custom-8 ${oneClickOpen ? "border border-[#705d57]" : ""}`}
          >
            <div
              className={`w-5 h-5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] transform transition-transform ${oneClickOpen ? "translate-x-5 bg-[#C69C6D]" : "translate-x-0 bg-[#C69C6D]"
                }`}
            />
          </button>
        </div>
      </div>

      <SectionDivider />

      <div className="mt-[24px]">
        <div className="text-base font-bold text-primary mb-[20px]">Notification</div>
        <div className="flex justify-between items-center mb-[20px]">
          <div className="text-sm text-primary">Subscription updates, payment</div>
          <button
            onClick={() => {
              setSubUpdates(!subUpdates);
              if (subUpdates || !offers || !maintenance || !inApp || !email)
                setOneClickOpen(false);
              else setOneClickOpen(true);
            }}
            aria-pressed={subUpdates}
            className={`w-12 h-7 flex items-center p-1 rounded-full transition-colors bg-custom-8 ${subUpdates ? "border border-[#705d57]" : ""}`}
          >
            <div
              className={`w-5 h-5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] transform transition-transform ${subUpdates ? "translate-x-5 bg-[#C69C6D]" : "translate-x-0 bg-[#C69C6D]"
                }`}
            />
          </button>
        </div>
        <div className="flex justify-between items-center mb-[20px]">
          <div className="text-sm text-primary">Offers, membership upgrade</div>
          <button
            onClick={() => {
              setOffers(!offers);
              if (!subUpdates || offers || !maintenance || !inApp || !email)
                setOneClickOpen(false);
              else setOneClickOpen(true);
            }}
            aria-pressed={offers}
            className={`w-12 h-7 flex items-center p-1 rounded-full transition-colors bg-custom-8 ${offers ? "border border-[#705d57]" : ""}`}
          >
            <div
              className={`w-5 h-5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] transform transition-transform ${offers ? "translate-x-5 bg-[#C69C6D]" : "translate-x-0 bg-[#C69C6D]"
                }`}
            />
          </button>
        </div>
        <div className="flex justify-between items-center mb-[18px]">
          <div className="text-sm text-primary">Maintenance, version updates</div>
          <button
            onClick={() => {
              setMaintenance(!maintenance);
              if (!subUpdates || !offers || maintenance || !inApp || !email)
                setOneClickOpen(false);
              else setOneClickOpen(true);
            }}
            aria-pressed={maintenance}
            className={`w-12 h-7 flex items-center p-1 rounded-full transition-colors bg-custom-8 ${maintenance ? "border border-[#705d57]" : ""}`}
          >
            <div
              className={`w-5 h-5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] transform transition-transform ${maintenance ? "translate-x-5 bg-[#C69C6D]" : "translate-x-0 bg-[#C69C6D]"
                }`}
            />
          </button>
        </div>
      </div>

      <SectionDivider/>

      <div className="mt-[24px]">
        <div className="text-base font-bold text-primary mb-[20px]">
          Notification Method
        </div>
        <div className="flex justify-between items-center mb-[20px]">
          <div className="text-sm text-primary">In-app Notifications</div>
          <button
            onClick={() => {
              setInApp(!inApp);
              if (!subUpdates || !offers || !maintenance || inApp || !email)
                setOneClickOpen(false);
              else setOneClickOpen(true);
            }}
            aria-pressed={inApp}
            className={`w-12 h-7 flex items-center p-1 rounded-full transition-colors bg-custom-8 ${inApp ? "border border-[#705d57]" : ""}`}
          >
            <div
              className={`w-5 h-5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] transform transition-transform ${inApp ? "translate-x-5 bg-[#C69C6D]" : "translate-x-0 bg-[#C69C6D]"
                }`}
            />
          </button>
        </div>
        <div className="flex justify-between items-center mb-[20px]">
          <div className="text-sm text-primary">Email Notifications</div>
          <button
            onClick={() => {
              setEmail(!email);
              if (!subUpdates || !offers || !maintenance || !inApp || email)
                setOneClickOpen(false);
              else setOneClickOpen(true);
            }}
            aria-pressed={email}
            className={`w-12 h-7 flex items-center p-1 rounded-full transition-colors bg-custom-8 ${email ? "border border-[#705d57]" : ""}`}
          >
            <div
              className={`w-5 h-5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] transform transition-transform ${email ? "translate-x-5 bg-[#C69C6D]" : "translate-x-0 bg-[#C69C6D]"
                }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
