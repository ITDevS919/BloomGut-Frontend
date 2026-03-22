import { ChevronLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import { getSettingApp, postSettingApp } from "@/api/http";
import { toast } from "sonner";

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
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();

  const [oneClickOpen, setOneClickOpen] = useState(false);
  const [subUpdates, setSubUpdates] = useState(false);
  const [offers, setOffers] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [inApp, setInApp] = useState(false);
  const [email, setEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const subtitle = { fontSize: 12, color: "#8b7a73", marginTop: 6 };

  const syncOneClickFromToggles = (nextSub, nextOffers, nextMaint, nextInApp, nextEmail) => {
    const allOn = nextSub && nextOffers && nextMaint && nextInApp && nextEmail;
    setOneClickOpen(allOn);
  };

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await getSettingApp(api, {
          params: { userId: auth.user.id },
        });
        const payload = res.data?.data ?? res.data;
        if (!payload) return;

        const notif = payload.notifications || {};
        const method = payload.notificationMethod || {};

        const nextSub = !!notif.subscriptionUpdates;
        const nextOffers = !!notif.membershipOffers;
        const nextMaint = !!notif.maintenanceUpdates;
        const nextInApp = !!method.inApp;
        const nextEmail = !!method.email;

        setSubUpdates(nextSub);
        setOffers(nextOffers);
        setMaintenance(nextMaint);
        setInApp(nextInApp);
        setEmail(nextEmail);
        syncOneClickFromToggles(nextSub, nextOffers, nextMaint, nextInApp, nextEmail);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load app notification settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [api, auth?.user?.id]);

  const persistSettings = async (nextState) => {
    if (!auth?.user?.id) return;
    setSaving(true);
    try {
      await postSettingApp(api, {
        userId: auth.user.id,
        oneClickOpen: nextState.oneClickOpen,
        notifications: {
          subscriptionUpdates: nextState.subUpdates,
          membershipOffers: nextState.offers,
          maintenanceUpdates: nextState.maintenance,
        },
        notificationMethod: {
          inApp: nextState.inApp,
          email: nextState.email,
        },
      });
      toast.success("Notification settings saved.");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to save app notification settings:", error);
      toast.error("Failed to save notification settings.");
    } finally {
      setSaving(false);
    }
  };

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
              const nextOneClick = !oneClickOpen;
              const nextSub = nextOneClick;
              const nextOffers = nextOneClick;
              const nextMaint = nextOneClick;
              const nextInApp = nextOneClick;
              const nextEmail = nextOneClick;

              setOneClickOpen(nextOneClick);
              setSubUpdates(nextSub);
              setOffers(nextOffers);
              setMaintenance(nextMaint);
              setInApp(nextInApp);
              setEmail(nextEmail);

              persistSettings({
                oneClickOpen: nextOneClick,
                subUpdates: nextSub,
                offers: nextOffers,
                maintenance: nextMaint,
                inApp: nextInApp,
                email: nextEmail,
              });
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
              const nextSub = !subUpdates;
              const nextState = {
                subUpdates: nextSub,
                offers,
                maintenance,
                inApp,
                email,
              };
              syncOneClickFromToggles(
                nextState.subUpdates,
                nextState.offers,
                nextState.maintenance,
                nextState.inApp,
                nextState.email
              );
              setSubUpdates(nextSub);
              persistSettings({
                oneClickOpen:
                  nextState.subUpdates &&
                  nextState.offers &&
                  nextState.maintenance &&
                  nextState.inApp &&
                  nextState.email,
                ...nextState,
              });
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
              const nextOffers = !offers;
              const nextState = {
                subUpdates,
                offers: nextOffers,
                maintenance,
                inApp,
                email,
              };
              syncOneClickFromToggles(
                nextState.subUpdates,
                nextState.offers,
                nextState.maintenance,
                nextState.inApp,
                nextState.email
              );
              setOffers(nextOffers);
              persistSettings({
                oneClickOpen:
                  nextState.subUpdates &&
                  nextState.offers &&
                  nextState.maintenance &&
                  nextState.inApp &&
                  nextState.email,
                ...nextState,
              });
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
              const nextMaint = !maintenance;
              const nextState = {
                subUpdates,
                offers,
                maintenance: nextMaint,
                inApp,
                email,
              };
              syncOneClickFromToggles(
                nextState.subUpdates,
                nextState.offers,
                nextState.maintenance,
                nextState.inApp,
                nextState.email
              );
              setMaintenance(nextMaint);
              persistSettings({
                oneClickOpen:
                  nextState.subUpdates &&
                  nextState.offers &&
                  nextState.maintenance &&
                  nextState.inApp &&
                  nextState.email,
                ...nextState,
              });
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
              const nextInApp = !inApp;
              const nextState = {
                subUpdates,
                offers,
                maintenance,
                inApp: nextInApp,
                email,
              };
              syncOneClickFromToggles(
                nextState.subUpdates,
                nextState.offers,
                nextState.maintenance,
                nextState.inApp,
                nextState.email
              );
              setInApp(nextInApp);
              persistSettings({
                oneClickOpen:
                  nextState.subUpdates &&
                  nextState.offers &&
                  nextState.maintenance &&
                  nextState.inApp &&
                  nextState.email,
                ...nextState,
              });
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
              const nextEmail = !email;
              const nextState = {
                subUpdates,
                offers,
                maintenance,
                inApp,
                email: nextEmail,
              };
              syncOneClickFromToggles(
                nextState.subUpdates,
                nextState.offers,
                nextState.maintenance,
                nextState.inApp,
                nextState.email
              );
              setEmail(nextEmail);
              persistSettings({
                oneClickOpen:
                  nextState.subUpdates &&
                  nextState.offers &&
                  nextState.maintenance &&
                  nextState.inApp &&
                  nextState.email,
                ...nextState,
              });
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

      {saving && (
        <div className="mt-4 text-xs text-custom-12 text-center">
          Saving…
        </div>
      )}
    </div>
  );
};

export default Notification;
