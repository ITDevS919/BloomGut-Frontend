import { useEffect, useState } from "react";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { useSelector } from "react-redux";

const MailboxSetting = () => {
  const auth = useSelector((state) => state.auth);
  console.log(auth);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [code, setCode] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [sendTimer, setSendTimer] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let t = null;
    if (sendTimer > 0) t = setTimeout(() => setSendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [sendTimer]);

  const handleSendCode = () => {
    if (sendTimer > 0) return;
    // placeholder: trigger send code API
    setSendTimer(60);
  };

  const maskEmail = (email) => {
    const [local, domain] = email.split("@");
    console.log(local);
    return "*".repeat(local.length) + "@" + domain;
  };

  return (
    <div className="bg-ivory min-h-full p-6 text-primary">
      <div className="flex items-center gap-4 mb-[80px]">
        <button
          type="button"
          className="text-primary text-[40px] "
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-[40px] " />
        </button>
        <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">Mailbox Settings</h2>
      </div>

      <div className="font-['Roboto', sans-serif]">
        <label className="block text-base text-primary mb-2">
          Current Mailbox Status
        </label>
        <div className="bg-[#e0e0e0] rounded-[8px] text-sm p-[12px] mb-[20px] flex items-center justify-between text-secondary">
          <div>Verified Email: {maskEmail(auth.user.primaryEmailAddress)}</div>
          <EyeOff className="text-gray-500" size={18} />
        </div>

        <label className="block text-base text-primary mb-2">Verify Email</label>
        <input
          type="email"
          value={verifyEmail}
          onChange={(e) => setVerifyEmail(e.target.value)}
          placeholder="Enter email address to verify"
          className="w-full text-sm border border-[#ccc] rounded-[8px] px-4 py-3 mb-[20px] bg-white placeholder-custom-12"
        />

        <label className="block text-base text-primary mb-2">Enter Code</label>
        <div className="flex items-center gap-3 mb-1">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter verification code"
            className="w-[225px] text-sm border border-[#ccc] rounded-[8px] px-4 py-3 mb-[3px] bg-white placeholder-custom-12"
          />
          <button
            type="button"
            onClick={handleSendCode}
            className="w-[137px] h-[42px] text-sm px-2 py-3 rounded-lg border border-[#705D57] bg-white text-primary shadow-sm"
          >
            {sendTimer > 0 ? `Send in ${sendTimer}s` : "Send Code"}
          </button>
        </div>
        <div className="text-xs text-custom-12 mb-[20px]">
          *Please enter the received code to
        </div>

        <label className="block text-sm text-primary mb-2">
          Verify New Email
        </label>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => {
            setNewEmail(e.target.value);
            if (error) setError("");
          }}
          placeholder="Enter new email"
          className={`w-full text-sm border ${error ? "border-red-300" : "border-gray-200"} rounded-[8px] px-4 py-3 mb-2 bg-white placeholder-gray-400`}
        />
        {error ? (
          <div className="text-xs text-[#d32f2f] mb-[44px]">{error}</div>
        ) : (
          <div className="h-4 mb-[44px]" />
        )}

        <button
          type="button"
          className={`w-[242px] mx-auto flex items-center justify-center text-white text-base py-3 rounded-[8px]  bg-[#C69C6D] shadow-sm`}
          onClick={() => {
            // simple validation: require code, otherwise show specific message; otherwise simulate verification failure
            if (!code) {
              setError("Please enter verification code");
              return;
            }
            setError("Verification code error, please re-enter");
          }}
        >
          Bind
        </button>
      </div>
    </div>
  );
};

export default MailboxSetting;
