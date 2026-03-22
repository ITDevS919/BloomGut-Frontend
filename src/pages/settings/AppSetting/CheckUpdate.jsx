import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import { getSettingApp, postSettingApp } from "@/api/http";
import { toast } from "sonner";

const CheckUpdate = () => {
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();

  useEffect(() => {
    const fetchSettings = async () => {
      if (!auth?.user?.id) return;
      try {
        const res = await getSettingApp(api, {
          params: { userId: auth.user.id },
        });
        const payload = res.data?.data ?? res.data;
        if (!payload) return;
        if (typeof payload.autoUpdate === "boolean") {
          setAutoUpdate(payload.autoUpdate);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load update settings:", error);
      }
    };

    fetchSettings();
  }, [api, auth?.user?.id]);

  const toggleAutoUpdate = async () => {
    const next = !autoUpdate;
    setAutoUpdate(next);
    if (!auth?.user?.id) return;
    try {
      await postSettingApp(api, {
        userId: auth.user.id,
        autoUpdate: next,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to save auto-update setting:", error);
      toast.error("Failed to save auto-update setting.");
      setAutoUpdate(!next);
    }
  };

  const handleCheckUpdates = () => {
    const now = new Date();
    setLastChecked(now.toLocaleString());
    toast.success("You are on the latest version.");
  };

  return (
    <div className="bg-ivory min-h-full p-6 text-primary font-['Noto_Sans_TC', sans-serif]">
      <div className="flex items-center gap-4 mb-[61px]">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-[40px] leading-none cursor-pointer " />
        </button>
        <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">Check for</h2>
      </div>

      <div className="font-['Roboto', sans-serif]">
        <div className="bg-white rounded-[8px] p-4 mb-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-start gap-3">
          <FaCloudDownloadAlt className="w-10 h-15 rounded-[8px] flex items-center justify-center text-[#027aff]" />
          <div className="flex flex-col ml-[15px]">
            <div className="text-sm text-primary">Current Version:</div>
            <div className="text-sm text-primary">BloomGut Health Assistant</div>
            <div className="text-xs text-custom-12">Update Date: March 10, 2025</div>
          </div>
        </div>

        <div className="bg-white rounded-[8px] p-4 mb-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-between text-primary">
          <div className="text-sm text-primary">Update History</div>
          <ChevronRight className="text-primary w-[16px] h-[16px]" />
        </div>

        <div className="bg-white rounded-[8px] p-3 mb-[165px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-between text-primary">
          <div className="text-sm text-primary">Auto Update</div>
          <label className="relative inline-flex items-center">
            <button
              onClick={toggleAutoUpdate}
              aria-pressed={autoUpdate}
              className={`w-12 h-7 flex items-center p-1 rounded-full transition-colors bg-custom-8 ${autoUpdate ? "border border-[#705d57]" : ""}`}
            >
              <div
                className={`w-5 h-5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] transform transition-transform ${autoUpdate ? "translate-x-5 bg-[#C69C6D]" : "translate-x-0 bg-[#C69C6D]"
                  }`}
              />
            </button>
          </label>
        </div>

        <div className="mb-[10px]">
          <button
            type="button"
            onClick={handleCheckUpdates}
            className="w-[242px] mx-auto flex items-center justify-center bg-[#C69C6D] text-white py-3 rounded-[8px] shadow-[0_6px_12px_rgba(0,0,0,0.15)]"
          >
            Check Updates
          </button>
          <div className="text-xs text-custom-12 mt-[10px] text-center">
            {lastChecked ? `Last Checked: ${lastChecked}` : "Last Checked: Not yet"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckUpdate;
