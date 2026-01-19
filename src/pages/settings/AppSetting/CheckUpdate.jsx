import { useState } from "react";
import { ChevronLeft } from "lucide-react";

const CheckUpdate = () => {
  const [autoUpdate, setAutoUpdate] = useState(false);

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
        <h2 className="text-xl font-semibold">Check for</h2>
      </div>

      <div className="max-w-md mt-30">
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 bg-sky-200 rounded-md flex items-center justify-center text-sky-600">☁️</div>
          <div>
            <div className="text-sm text-primary">Current Version:</div>
            <div className="text-sm text-primary">BloomGut Health Assistant</div>
            <div className="text-xs text-gray-400">Update Date: March 10, 2025</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 mb-3 shadow-sm flex items-center justify-between text-primary">
          <div className="text-sm">Update History</div>
          <div className="text-gray-400"> <span className="inline-block">›</span></div>
        </div>

        <div className="bg-white rounded-xl p-3 mb-6 shadow-sm flex items-center justify-between">
          <div className="text-sm">Auto Update</div>
          <label className="relative inline-flex items-center">
            <input
              type="checkbox"
              checked={autoUpdate}
              onChange={() => setAutoUpdate((s) => !s)}
              className="sr-only peer"
            />
            <div className={`w-12 h-7 rounded-full transition-colors ${autoUpdate ? 'bg-[#C69C6D]' : 'bg-gray-300'}`}></div>
            <div className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${autoUpdate ? 'translate-x-5' : ''}`}></div>
          </label>
        </div>

        <div className="mb-6">
          <button className="w-10/12 mx-auto flex items-center justify-center bg-[#C69C6D] text-white py-3 rounded-2xl shadow-sm">Check Updates</button>
          <div className="text-xs text-gray-400 mt-3 text-center">Last Checked: April 29, 2025, 08:00 AM</div>
        </div>
      </div>
    </div>
  );
};

export default CheckUpdate;
