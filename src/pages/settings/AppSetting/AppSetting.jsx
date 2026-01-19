import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SectionDivider = () => <div className="h-px bg-[#e6e0dc] my-4" />;

const AppSetting = () => {
    const navigate = useNavigate();
  return (
    <div className="bg-ivory min-h-full p-6 text-secondary">
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-xl leading-none" />
        </button>
        <h2 className="text-xl font-semibold">App Settings</h2>
      </div>

      <div className="max-w-md mt-15">
        <div className="p-4 mb-6 flex items-center justify-between">
          <div>
            <div className="text-s2 font-medium">
              Current Version: <span className="">3.5.2</span>
            </div>
            <div className="text-xs text-gray-400">Update Date: 2025-03-10</div>
          </div>
          <button className="ml-4 px-4 py-2 bg-[#C69C6D] text-white rounded-lg shadow-sm" onClick={() => navigate("/setting/app-setting/check-update")}>
            Check Update
          </button>
        </div>

        <SectionDivider />

        <div className="p-4">
          <div className="text-s2 font-medium mb-3">Display Settings</div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm">Font Size</div>
              <div className="text-xs text-gray-400">
                Change font size in app
              </div>
            </div>
            <button onClick={() => navigate("/setting/app-setting/font-size")}>
              <ChevronRight className="text-gray-400" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm">Language Settings</div>
              <div className="text-xs text-gray-400">
                Select app language
              </div>
            </div>
            <button onClick={() => navigate("/setting/app-setting/language")}>
              <ChevronRight className="text-gray-400" />
            </button>
          </div>
        </div>
        
        <SectionDivider />

        <div className="p-4">
          <div className="text-x2 font-medium mb-3">Storage and Cache</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm">Clear Cache</div>
              <div className="text-xs text-gray-400">Cache: 156 MB</div>
            </div>
            <button className="px-4 py-2 bg-white rounded-lg shadow-sm">
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSetting;
