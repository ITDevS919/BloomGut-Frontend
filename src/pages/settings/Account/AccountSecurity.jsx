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
    <div className="bg-ivory min-h-full p-6 text-secondary">
      <div className="flex items-center gap-4 mb-40">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-xl leading-none" />
        </button>
        <h2 className="text-xl font-semibold">Account Security</h2>
      </div>

      {/* Security progress card */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
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
            className="h-2 bg-primary"
            style={{ width: `${securityPercent}%` }}
          />
        </div>

        <div className="text-xs text-gray-500">
          Enable 2-step verification for better security
        </div>
      </div>

      <div className="space-y-3">
        {/* Two-Step toggle */}
        <div className="bg-white rounded-xl px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="text-base text-primary">Two-Step</div>
          <button
            onClick={() => setTwoStep((s) => !s)}
            aria-pressed={twoStep}
            className={`w-12 h-7 flex items-center p-1 rounded-full transition-colors ${
              twoStep ? "bg-primary" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform ${
                twoStep ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Bind Phone */}
        <button className="w-full flex items-center justify-between gap-4 px-4 py-3 bg-white rounded-xl shadow-sm text-left" onClick={() => navigate('/setting/account/mobile')}>
          <div className=" text-base text-primary">Bind Phone</div>
          <span className="text-xs text-gray-500 ">Bound: 09XX-XXX-</span>
          <ChevronRight className="text-gray-400" />
        </button>

        {/* Bind Email */}
        <button className="w-10/12 mx-auto flex items-center justify-between gap-4 px-4 py-3 bg-white rounded-xl shadow-sm text-left" onClick={() => navigate('/setting/account/mailbox')}>
          <div className=" text-base text-primary">Bind Email</div>
          <span className="text-xs text-gray-500 ">
            Bound: {maskEmail(auth.user.primaryEmailAddress)}
          </span>
          <ChevronRight className="text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default AccountSecurity;
