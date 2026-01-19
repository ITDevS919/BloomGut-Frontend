import { useState } from "react";
import { ChevronLeft } from "lucide-react";

const LanguageSetting = () => {
  const [selected, setSelected] = useState("en-US");

  return (
    <div className="bg-ivory min-h-full p-6 text-secondary">
      <style>{`
        .font-radio{appearance:none;width:20px;height:20px;border-radius:9999px;border:2px solid #cfa76f;background:#fff;display:inline-block;position:relative}
        .font-radio:after{content:'';position:absolute;inset:5px;border-radius:9999px;background:transparent}
        .font-radio:checked{background:#fff;border:2px solid #cfa76f}
        .font-radio:checked:after{background:#cfa76f}
      `}</style>
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-xl leading-none" />
        </button>
        <h2 className="text-xl font-semibold">Language Settings</h2>
      </div>

      <div className="max-w-sm mt-30">
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="text-sm text-gray-700">Select your preferred app interface language. The app will restart to apply the new language. All features and data remain unaffected.</div>
        </div>

        <div className="text-sm font-medium mb-3">Current Language</div>

        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">English</div>
            <div className="text-xs text-gray-400">English (US)</div>
          </div>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="language"
              value="en-US"
              checked={selected === "en-US"}
              onChange={() => setSelected("en-US")}
              className="font-radio relative mr-0"
            />
            <span className="sr-only">Select English</span>
          </label>
        </div>

        <button
          type="button"
          className="w-full bg-[#cfa76f] text-white py-3 rounded-2xl shadow-sm"
          onClick={() => alert(`Saved language: ${selected}`)}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default LanguageSetting;
