import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import { toast } from "sonner";

const FontSize = () => {
  const [value, setValue] = useState(100);
  const [selected, setSelected] = useState("100");
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();

  useEffect(() => {
    const fetchSettings = async () => {
      if (!auth?.user?.id) return;
      try {
        const res = await api.get("/setting/app", {
          params: { userId: auth.user.id },
        });
        const payload = res.data?.data ?? res.data;
        if (!payload || typeof payload.fontSize !== "number") return;
        const size = String(payload.fontSize);
        if (size === "75" || size === "100" || size === "125") {
          setSelected(size);
          setValue(Number(size));
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load font size setting:", error);
      }
    };

    fetchSettings();
  }, [api, auth?.user?.id]);

  const handleSave = async () => {
    if (!auth?.user?.id) {
      toast.error("You need to be signed in to update settings.");
      return;
    }
    try {
      await api.post("/setting/app", {
        userId: auth.user.id,
        fontSize: Number(selected),
      });
      toast.success("Font size saved.");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to save font size:", error);
      toast.error("Failed to save font size.");
    }
  };

  return (
    <div className="bg-ivory min-h-full p-6 text-primary font-['Noto_Sans_TC', sans-serif]">
      <style>{`
        .font-range{appearance:none}
        .font-range:focus{outline:none}
        .font-range::-webkit-slider-runnable-track{height:4px;border-radius:9999px;background:transparent}
        .font-range::-webkit-slider-thumb{appearance:none;width:20px;height:20px;border-radius:9999px;background:#594037;border:none;margin-top:-6px;box-shadow:0 2px 4px rgba(0,0,0,0.15);cursor:pointer}
        .font-range::-moz-range-track{height:4px;border-radius:9999px;background:transparent}
        .font-range::-moz-range-thumb{width:20px;height:20px;border-radius:9999px;background:#594037;border:none;box-shadow:0 2px 4px rgba(0,0,0,0.15);cursor:pointer}

        /* custom radio */
        .font-radio{appearance:none;width:22px;height:22px;border-radius:9999px;border:2px solid #C69C6D;background:#fff;display:inline-block;position:relative}
        .font-radio:after{content:' ';position:absolute;inset:4px;border-radius:9999px;background:transparent}
        .font-radio:checked{background:#fff;border:2px solid #C69C6D}
        .font-radio:checked:after{background:#C69C6D}
      `}</style>
      <div className="flex items-center gap-4 mb-[57px]">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-[40px] leading-none cursor-pointer " />
        </button>
        <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">Font Size</h2>
      </div>

      <div className="">
        <div className="bg-white rounded-[8px] p-4 mb-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <div className="text-sm text-secondary">Adjust the display size of the text within the app. The larger the value, the larger the font. Recommended setting: Standard (100%).</div>
        </div>

        <div className="text-lg mb-[10px] text-primary">Preview Effect</div>
        <div className="bg-white rounded-[8px] p-4 mb-[15px] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <div style={{ fontSize: `${value * 0.01 * 8 + 8}px` }} className="font-bold text-primary">This is Header Text</div>
          <div style={{ fontSize: `${value * 0.01 * 14}px` }} className="text-secondary">This is body text. The adjusted effect will be displayed here immediately. Please choose the size that suits you.</div>
        </div>

        <div className="text-lg text-primary mb-[9px]">Font Size Selection</div>
        <div className="mb-[27px]">
          <div className="flex items-center gap-3">
            <div className="text-xs text-[#705D56] whitespace-nowrap">
              Small <br />(75%)
            </div>
            <input
              type="range"
              min="75"
              max="125"
              step="1"
              value={value}
              onChange={(e) => { setValue(Number(e.target.value)); setSelected(e.target.value); }}
              className="font-range flex-1"
              style={{
                background: `linear-gradient(90deg, #594037 ${((value - 75) / 50) * 100}%, #a9a9a9 ${((value - 75) / 50) * 100}%)`,
                borderRadius: 9999
              }}
            />
            <div className="text-xs text-[#705D56] whitespace-nowrap">
              Large <br />(125%)
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[8px] p-4 mb-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-[32px]">
          <div className=" gap-4 text-primary">
            <label className="flex items-center justify-between">
              <div>
                <div className="text-sm">Small (75%)</div>
                <div className="text-xs text-gray-400">Suitable for</div>
              </div>
              <input className="font-radio" type="radio" name="font" checked={selected === "75"} onChange={() => { setSelected("75"); setValue(75); }} />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <div className="text-sm">Standard (100%)</div>
                <div className="text-xs text-gray-400">Default</div>
              </div>
              <input className="font-radio" type="radio" name="font" checked={selected === "100"} onChange={() => { setSelected("100"); setValue(100); }} />
            </label>

            <label className="flex items-center justify-between col-span-2">
              <div>
                <div className="text-sm">Larger (125%)</div>
                <div className="text-xs text-gray-400">For readability</div>
              </div>
              <input className="font-radio" type="radio" name="font" checked={selected === "125"} onChange={() => { setSelected("125"); setValue(125); }} />
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-[242px] mx-auto transition-all duration-150 active:scale-[0.98] active:shadow-[0_4px_10px_rgba(0,0,0,0.18)] min-h-[48px] flex items-center justify-center text-white text-base rounded-[24px] bg-[#C69C6D] py-3 shadow-[0_4px_10px_rgba(0,0,0,0.18)]"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default FontSize;