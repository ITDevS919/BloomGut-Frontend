import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import { toast } from "sonner";

const SectionDivider = () => <div className="h-px bg-[#e6e0dc]" />;

const AppSetting = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();

  const [lastCacheClear, setLastCacheClear] = useState(null);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!auth?.user?.id) return;
      try {
        const res = await api.get("/setting/app", {
          params: { userId: auth.user.id },
        });
        const payload = res.data?.data ?? res.data;
        if (!payload) return;
        if (payload.lastCacheClear) {
          const d = new Date(payload.lastCacheClear);
          if (!Number.isNaN(d.getTime())) {
            setLastCacheClear(d.toISOString());
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load app settings:", error);
      }
    };

    fetchSettings();
  }, [api, auth?.user?.id]);

  const handleClearCache = async () => {
    if (!auth?.user?.id) {
      toast.error("You need to be signed in to update settings.");
      return;
    }
    if (clearing) return;
    setClearing(true);
    try {
      const now = new Date();
      await api.post("/setting/app", {
        userId: auth.user.id,
        lastCacheClear: now.toISOString(),
      });
      setLastCacheClear(now.toISOString());
      toast.success("Cache status updated.");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to clear cache setting:", error);
      toast.error("Failed to update cache status.");
    } finally {
      setClearing(false);
    }
  };

  const cacheSubtitle = (() => {
    if (!lastCacheClear) {
      return "Cache status: Never cleared";
    }
    const d = new Date(lastCacheClear);
    if (Number.isNaN(d.getTime())) return "Cache status: Unknown";
    return `Last cleared: ${d.toLocaleString()}`;
  })();

  return (
    <div className="bg-ivory min-h-full p-6 text-primary font-['Noto_Sans_TC', sans-serif]">
      <div className="flex items-center gap-4 mb-[92px]">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-[40px]] leading-none cursor-pointer" />
        </button>
        <h2 className="text-lg">App Settings</h2>
      </div>

      <div className="">
        <div className="mb-[17px] flex items-center justify-between">
          <div>
            <div className="text-base text-primary">
              Current Version: <span className="">3.5.2</span>
            </div>
            <div className="text-sm text-custom-12">Update Date: 2025-03-10</div>
          </div>
          <button className="px-4 py-2 bg-[#C69C6D] text-white rounded-[8px]  shadow-sm text-sm" onClick={() => navigate("/setting/app-setting/check-update")}>
            Check Update
          </button>
        </div>

        <SectionDivider />

        <div className="mt-[20px]">
          <div className="text-base mb-[20px] text-primary">Display Settings</div>
          <div className="flex items-center justify-between mb-[12px]">
            <div>
              <div className="text-sm text-primary">Font Size</div>
              <div className="text-xs text-custom-12">
                Change font size in app
              </div>
            </div>
            <button onClick={() => navigate("/setting/app-setting/font-size")}>
              <ChevronRight className="text-primary" width="16px" height="16px" />
            </button>
          </div>

          <div className="flex items-center justify-between mb-[20px]">
            <div>
              <div className="text-sm text-primary">Language Settings</div>
              <div className="text-xs text-custom-12">
                Select app language
              </div>
            </div>
            <button onClick={() => navigate("/setting/app-setting/language")}>
              <ChevronRight className="text-primary" width="16px" height="16px" />
            </button>
          </div>
        </div>

        <SectionDivider />

        <div className="mt-[14px]">
          <div className="text-base mb-[7px] text-primary">Storage and Cache</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-primary">Clear Cache</div>
              <div className="text-xs text-gray-400">{cacheSubtitle}</div>
            </div>
            <button
              type="button"
              disabled={clearing}
              onClick={handleClearCache}
              className="px-4 py-2 bg-white rounded-[8px] shadow-sm text-sm text-primary disabled:opacity-60"
            >
              {clearing ? "Clearing..." : "Clear"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSetting;
