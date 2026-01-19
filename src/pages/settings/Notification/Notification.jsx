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
    background: checked ? "#b07a4f" : "#e6e0dc",
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
  <div style={{ height: 1, background: "#e6e0dc", margin: "18px 0" }} />
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
    <div className="bg-ivory min-h-full p-6 text-secondary">
      <div className="flex items-center gap-4 mb-10">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
          style={{ background: "transparent", border: "none", padding: 0 }}
        >
          <ChevronLeft className="text-primary text-xl leading-none" />
        </button>
        <h2 className="text-xl font-semibold">Notification Settings</h2>
      </div>

      <div>
        <div className="text-x3 font-semibold text-primary">Interaction</div>
        <div className="flex justify-between items-center mt-4">
          <div>
            <div>One-click Open</div>
            <div style={subtitle}>Enable to get all notifications</div>
          </div>
          <Switch
            checked={oneClickOpen}
            onChange={() => {
              setOneClickOpen(!oneClickOpen);
              setSubUpdates(!oneClickOpen);
              setOffers(!oneClickOpen);
              setMaintenance(!oneClickOpen);
              setInApp(!oneClickOpen);
              setEmail(!oneClickOpen);
            }}
          />
        </div>
      </div>

      <SectionDivider />

      <div>
        <div className="text-x3 font-semibold text-primary">Notification</div>
        <div className="flex justify-between items-center mt-4">
          <div>Subscription updates, payment</div>
          <Switch
            checked={subUpdates}
            onChange={() => {
              setSubUpdates(!subUpdates);
              if (subUpdates || !offers || !maintenance || !inApp || !email)
                setOneClickOpen(false);
              else setOneClickOpen(true);
            }}
          />
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>Offers, membership upgrade</div>
          <Switch
            checked={offers}
            onChange={() => {
              setOffers(!offers);
              if (!subUpdates || offers || !maintenance || !inApp || !email)
                setOneClickOpen(false);
              else setOneClickOpen(true);
            }}
          />
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>Maintenance, version updates</div>
          <Switch
            checked={maintenance}
            onChange={() => {
              setMaintenance(!maintenance);
              if (!subUpdates || !offers || maintenance || !inApp || !email)
                setOneClickOpen(false);
              else setOneClickOpen(true);
            }}
          />
        </div>
      </div>

      <SectionDivider />

      <div>
        <div className="text-x3 font-semibold text-primary">
          Notification Method
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>In-app Notifications</div>
          <Switch
            checked={inApp}
            onChange={() => {
              setInApp(!inApp);
              if (!subUpdates || !offers || !maintenance || inApp || !email)
                setOneClickOpen(false);
              else setOneClickOpen(true);
            }}
          />
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>Email Notifications</div>
          <Switch
            checked={email}
            onChange={() => {
              setEmail(!email);
              if (!subUpdates || !offers || !maintenance || !inApp || email)
                setOneClickOpen(false);
              else setOneClickOpen(true);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Notification;
