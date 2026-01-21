import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
    const navigate = useNavigate();
  return (
    <div className="bg-ivory min-h-full p-6 text-primary font-['Noto_Sans_TC', sans-serif]">
      <div className="flex items-center gap-4 mb-[57px]">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-[40px] leading-none" />
        </button>
        <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">Privacy Policy</h2>
      </div>

      <div className="bg-white rounded-[8px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] w-full text-left flex items-center justify-between mb-[13px]">
        <div>
          <h3 className="text-sm">Protect Your Privacy</h3>
          <p className="text-xs text-custom-12">View data use</p>
        </div>
        <button
          type="button"
          aria-label="privacy"
          className="text-primary px-4 py-2 rounded-[8px] border border-secondary shadow-sm text-sm"
          onClick={() => navigate("/setting/privacy-policy/terms-of-use")}
        >
          Privacy
        </button>
      </div>
      <p className="text-xs text-custom-12">Last updated: June 2025</p>
    </div>
  );
};

export default PrivacyPolicy;
