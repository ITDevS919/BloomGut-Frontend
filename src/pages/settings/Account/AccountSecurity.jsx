import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AccountSecurity = () => {
  const auth = useSelector((state) => state.auth);
  const [twoStep, setTwoStep] = useState(false);
  const securityPercent = 60; // placeholder - compute from actual bindings if available
  const navigate = useNavigate();

  const maskEmail = (email) => {
    const [username, domain] = email.split("@");
    const visible = username.slice(0, 3);
    return `${visible}****@${domain}`;
  };

  return (
    <div className="bg-ivory min-h-full p-6 text-primary">
      <div className="flex items-center gap-4 mb-40">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-[40px] " />
        </button>
        <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">Account Security</h2>
      </div>

      {/* Security progress card */}
      <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-[16px] mb-[14px] rounded-[8px] font-['Roboto', sans-serif]">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-primary">
            Account Security
          </div>
          <div className="text-sm font-semibold text-primary">
            {securityPercent}%
          </div>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
          <div
            className="h-2 bg-secondary rounded-full"
            style={{ width: `${securityPercent}%` }}
          />
        </div>

        <div className="text-xs text-secondary">
          Enable 2-step verification for better security
        </div>
      </div>

      <div className="space-y-3">
        {/* Two-Step toggle */}
        <div className="bg-white rounded-[8px] px-4 py-3 flex items-center justify-between shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <div className="text-sm text-primary">Two-Step</div>
          <button
            onClick={() => setTwoStep((s) => !s)}
            aria-pressed={twoStep}
            className="w-12 h-7 flex items-center p-1 rounded-full transition-colors bg-custom-8"
          >
            <div
              className={`w-5 h-5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] transform transition-transform ${twoStep ? "translate-x-5 bg-[#C69C6D]" : "translate-x-0 bg-[#C69C6D]"
                }`}
            />
          </button>
        </div>

        {/* Bind Phone */}
        <button className="w-full flex items-center justify-between gap-4 p-[16px] bg-white rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-left mt-5" onClick={() => navigate('/setting/account/mobile')}>
          <div className=" text-sm text-primary">Bind Phone</div>
          <span className="text-xs text-secondary ">Bound: 09XX-XXX-</span>
          <ChevronRight className="text-custom-12" width="16px" height="16px"/>
        </button>

        {/* Bind Email */}
        <button className="w-full mx-auto flex items-center justify-between gap-4 p-[16px] bg-white rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-left mt-5" onClick={() => navigate('/setting/account/mailbox')}>
          <div className=" text-sm text-primary">Bind Email</div>
          <span className="text-xs text-secondary ">
            Bound: {maskEmail(auth.user.primaryEmailAddress)}
          </span>
          <ChevronRight className="text-custom-12" width="16px" height="16px"/>
        </button>
      </div>
    </div>
  );
};

export default AccountSecurity;
