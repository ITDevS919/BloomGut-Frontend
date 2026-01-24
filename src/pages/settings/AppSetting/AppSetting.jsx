import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SectionDivider = () => <div className="h-px bg-[#e6e0dc]" />;

const AppSetting = () => {
  const navigate = useNavigate();
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
              <div className="text-xs text-gray-400">Cache: 156 MB</div>
            </div>
            <button className="px-4 py-2 bg-white rounded-[8px] shadow-sm text-sm text-primary">
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSetting;
