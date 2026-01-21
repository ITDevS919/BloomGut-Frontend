import { useState } from "react";
import { ChevronLeft } from "lucide-react";

const LanguageSetting = () => {
  const [selected, setSelected] = useState("en-US");

  return (
    <div className="bg-ivory min-h-full p-6 text-primary">
      <style>{`
        .font-radio{appearance:none;width:20px;height:20px;border-radius:9999px;border:2px solid #C69C6D;background:#fff;display:inline-block;position:relative}
        .font-radio:after{content:'';position:absolute;inset:5px;border-radius:9999px;background:transparent}
        .font-radio:checked{background:#fff;border:2px solid #C69C6D}
        .font-radio:checked:after{background:#C69C6D}
      `}</style>
      <div className="flex items-center gap-4 mb-[56px]">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-[40px] leading-none" />
        </button>
        <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">Language Settings</h2>
      </div>

      <div className="">
        <div className="bg-white rounded-[8px] p-4 mb-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-[28px]">
          <div className="text-sm text-primary">Select your preferred app interface language. The app will restart to apply the new language. All features and data remain unaffected.</div>
        </div>

        <div className="text-lg mb-[20px] text-primary">Current Language</div>
        <div className="bg-white rounded-[8px] p-4 mb-6 border border-[#ccc] flex items-center justify-between mb-[155px]">
          <div>
            <div className="text-base mb-[7px]">English</div>
            <div className="text-xs text-custom-12">English (US)</div>
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
          className="w-[242px] mx-auto flex items-center justify-center bg-[#C69C6D] text-white py-3 rounded-[8px] shadow-[0_6px_12px_rgba(0,0,0,0.15)]"
          onClick={() => alert(`Saved language: ${selected}`)}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default LanguageSetting;
