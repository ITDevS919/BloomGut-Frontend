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
        <h2 className="text-xl font-semibold">Mailbox Settings</h2>
      </div>

      <div className="mt-25">
        <label className="block text-sm text-gray-700 mb-2">
          Current Mailbox Status
        </label>
        <div className="bg-gray-200 rounded-xl p-3 text-sm mb-4 flex items-center justify-between text-gray-700">
          <div>Verified Email: {maskEmail(auth.user.primaryEmailAddress)}</div>
          <EyeOff className="text-gray-500" size={18} />
        </div>

        <label className="block text-sm text-gray-700 mb-2">Verify Email</label>
        <input
          type="email"
          value={verifyEmail}
          onChange={(e) => setVerifyEmail(e.target.value)}
          placeholder="Enter email address to verify"
          className="w-full border border-gray-200 rounded-2xl px-4 py-3 mb-4 bg-white placeholder-gray-400"
        />

        <label className="block text-sm text-gray-700 mb-2">Enter Code</label>
        <div className="flex items-center gap-3 mb-1">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter verification code"
            className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 bg-white placeholder-gray-400"
          />
          <button
            type="button"
            onClick={handleSendCode}
            className="w-28 text-xs px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-600"
          >
            {sendTimer > 0 ? `Send in ${sendTimer}s` : "Send Code"}
          </button>
        </div>
        <div className="text-xs text-gray-400 mb-4">
          *Please enter the received code to
        </div>

        <label className="block text-sm text-gray-700 mb-2">
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
          className={`w-full border ${error ? "border-red-300" : "border-gray-200"} rounded-2xl px-4 py-3 mb-2 bg-white placeholder-gray-400`}
        />
        {error ? (
          <div className="text-sm text-red-600 mb-4">{error}</div>
        ) : (
          <div className="h-4 mb-4" />
        )}

        <button
          type="button"
          className={`w-full text-white py-3 rounded-2xl ${error ? "bg-[#c69b6d] shadow-md" : "bg-[#C69C6D] shadow-sm"}`}
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
