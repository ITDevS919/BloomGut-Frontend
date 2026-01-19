import { useState } from "react";
import { ChevronLeft } from "lucide-react";

const FontSize = () => {
  const [value, setValue] = useState(100);
  const [selected, setSelected] = useState("100");

  const handleSave = () => {
    alert(`Saved font size: ${selected}%`);
  };

  return (
    <div className="bg-ivory min-h-full p-6 text-secondary">
      <style>{`
        .font-range{appearance:none}
        .font-range:focus{outline:none}
        .font-range::-webkit-slider-runnable-track{height:10px;border-radius:9999px;background:transparent}
        .font-range::-webkit-slider-thumb{appearance:none;width:22px;height:22px;border-radius:9999px;background:#6b3b26;border:4px solid #ffffff;margin-top:-6px;box-shadow:0 2px 0 rgba(0,0,0,0.08)}
        .font-range::-moz-range-track{height:10px;border-radius:9999px;background:transparent}
        .font-range::-moz-range-thumb{width:22px;height:22px;border-radius:9999px;background:#6b3b26;border:4px solid #ffffff}

        /* custom radio */
        .font-radio{appearance:none;width:22px;height:22px;border-radius:9999px;border:2px solid #cfa76f;background:#fff;display:inline-block;position:relative}
        .font-radio:after{content:' ';position:absolute;inset:4px;border-radius:9999px;background:transparent}
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
        <h2 className="text-xl font-semibold">Font Size</h2>
      </div>

      <div className="max-w-sm mt-15">
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <div className="text-sm text-gray-700 mb-2">Adjust the display size of the text within the app. The larger the value, the larger the font. Recommended setting: Standard (100%).</div>
        </div>

        <div className="text-sm font-medium mb-2">Preview Effect</div>
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <div style={{ fontSize: `${value * 0.01 * 20 + 8}px` }} className="font-semibold mb-2">This is Header Text</div>
          <div style={{ fontSize: `${value * 0.01 * 14}px` }} className="text-gray-700">This is body text. The adjusted effect will be displayed here immediately. Please choose the size that suits you.</div>
        </div>

        <div className="text-sm font-medium mb-3">Font Size Selection</div>
        <div className="mb-3">
          <div className="flex items-center">
            <div className="text-xs text-gray-600 mr-3">Small (75%)</div>
            <input
              type="range"
              min="75"
              max="125"
              step="1"
              value={value}
              onChange={(e) => { setValue(Number(e.target.value)); setSelected(e.target.value); }}
              className="font-range flex-1 h-1"
              style={{
                background: `linear-gradient(90deg, #6b3b26 ${((value-75)/50)*100}%, #e6e0dc ${((value-75)/50)*100}%)`,
                borderRadius: 9999
              }}
            />
            <div className="text-xs text-gray-600 ml-3">Large (125%)</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className=" gap-4">
            <label className="flex items-center justify-between">
              <div>
                <div className="text-sm">Small (75%)</div>
                <div className="text-xs text-gray-400">Suitable for</div>
              </div>
              <input className="font-radio" type="radio" name="font" checked={selected==="75"} onChange={() => { setSelected("75"); setValue(75); }} />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <div className="text-sm">Standard (100%)</div>
                <div className="text-xs text-gray-400">Default</div>
              </div>
              <input className="font-radio" type="radio" name="font" checked={selected==="100"} onChange={() => { setSelected("100"); setValue(100); }} />
            </label>

            <label className="flex items-center justify-between col-span-2">
              <div>
                <div className="text-sm">Larger (125%)</div>
                <div className="text-xs text-gray-400">For readability</div>
              </div>
              <input className="font-radio" type="radio" name="font" checked={selected==="125"} onChange={() => { setSelected("125"); setValue(125); }} />
            </label>
          </div>
        </div>

        <button className="w-full bg-[#cfa76f] text-white py-3 rounded-2xl shadow-sm" onClick={handleSave}>Save Settings</button>
      </div>
    </div>
  );
};

export default FontSize;