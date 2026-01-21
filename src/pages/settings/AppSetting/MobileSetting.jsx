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
    <div className="bg-ivory min-h-full p-6 text-primary">
      <div className="flex items-center gap-4 mb-[84px]">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-[40px] " />
        </button>
        <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">Mobile Settings</h2>
      </div>

      <div className="font-['Roboto', sans-serif]">
        <label className="block text-base text-primary mb-[7px]">Current Binding Status</label>
        <div className="bg-[#e0e0e0] rounded-[8px] text-sm p-[13px] text-primary mb-[20px]">Currently Bound: 09XX-XXX-789</div>

        <label className="block text-base text-primary mb-[7px]">Verify Identity</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password to verify identity"
          className="w-full text-sm border border-[#ccc] rounded-[8px] px-4 py-3 mb-[10px] bg-white placeholder-custom-12"
        />

        <label className="block text-base text-primary mb-[7px]">New Number</label>
        <div className="flex items-center gap-3 mb-1">
          <input
            type="text"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            placeholder="Enter new mobile number"
            className="w-[228px] text-sm border border-[#ccc] rounded-[8px] px-4 py-3 mb-[3px] bg-white placeholder-custom-12"
          />
          <button
            type="button"
            onClick={handleResend}
            className="w-[137px] h-[42px] text-xs px-2 py-3 rounded-lg border border-[#705D57] bg-white text-primary shadow-sm"
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
          </button>
        </div>
        <div className="text-xs text-custom-12 mb-[20px]">*Please enter the new mobile</div>

        <label className="block text-base text-primary mb-2">Verify New</label>
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (error) setError("");
          }}
          placeholder="Enter verification code"
          className={`w-full text-sm border ${error ? "border-red-300" : "border-gray-200"} rounded-[8px] px-4 py-3 bg-white placeholder-custom-12`}
        />
        {error ? (
          <div className="text-xs text-[#d32f2f] mb-[51px]">{error}</div>
        ) : (
          <div className="h-4 mb-[51px]" />
        )}

        <button
          type="button"
          className={`w-[242px] mx-auto flex items-center justify-center text-white text-base py-3 rounded-[8px]  bg-[#C69C6D] shadow-sm`}
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
