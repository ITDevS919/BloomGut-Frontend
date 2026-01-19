import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";

const MobileSetting = () => {
  const [password, setPassword] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [code, setCode] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let t = null;
    if (resendTimer > 0) {
      t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    }
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleResend = () => {
    if (resendTimer > 0) return;
    // placeholder for actual resend logic
    setResendTimer(60);
  };

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
        <h2 className="text-xl font-semibold">Mobile Settings</h2>
      </div>

      <div className="mt-25">
        <label className="block text-sm text-gray-700 mb-2">Current Binding Status</label>
        <div className="bg-gray-200 rounded-xl p-3 text-sm mb-4 text-gray-700">Currently Bound: 09XX-XXX-789</div>

        <label className="block text-sm text-gray-700 mb-2">Verify Identity</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password to verify identity"
          className="w-full border border-gray-200 rounded-2xl px-4 py-3 mb-4 bg-white placeholder-gray-400"
        />

        <label className="block text-sm text-gray-700 mb-2">New Number</label>
        <div className="flex items-center gap-3 mb-1">
          <input
            type="text"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            placeholder="Enter new mobile number"
            className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 bg-white placeholder-gray-400"
          />
          <button
            type="button"
            onClick={handleResend}
            className="w-28 text-xs px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-600"
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
          </button>
        </div>
        <div className="text-xs text-gray-400 mb-4">*Please enter the new mobile</div>

        <label className="block text-sm text-gray-700 mb-2">Verify New</label>
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (error) setError("");
          }}
          placeholder="Enter verification code"
          className={`w-full border ${error ? "border-red-300" : "border-gray-200"} rounded-2xl px-4 py-3 mb-1 bg-white placeholder-gray-400`}
        />
        {error ? (
          <div className="text-sm text-red-600 mb-4">{error}</div>
        ) : (
          <div className="h-4 mb-4" />
        )}

        <button
          type="button"
          className={`w-full text-white py-3 rounded-2xl ${error ? "bg-[#c69b6d] shadow-md" : "bg-[#cfa76f] shadow-sm"}`}
          onClick={() => {
            // simple client-side validation demo: show error when code empty or incorrect
            if (!code) {
              setError("Please enter verification code");
              return;
            }
            // simulate verification failure to match the screenshot
            setError("Verification code error, please re-enter");
          }}
        >
          Bind
        </button>
      </div>
    </div>
  );
};

export default MobileSetting;
