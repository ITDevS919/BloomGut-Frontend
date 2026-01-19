import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
    const navigate = useNavigate();
  return (
    <div className="bg-ivory min-h-full p-6 text-secondary">
      <div className="flex items-center gap-4 mb-10">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-xl leading-none" />
        </button>
        <h2 className="text-xl font-semibold">Privacy Policy</h2>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm mt-5 w-full text-left flex items-center justify-between mt-20">
        <div>
          <h3 className="text-base">Protect Your Privacy</h3>
          <p className="text-xs text-gray-500 mt-1">View data use</p>
        </div>
        <button
          type="button"
          aria-label="privacy"
          style={{
            padding: "6px 12px",
            borderRadius: 14,
            border: "1px solid #e6e0dc",
            background: "white",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 8px rgba(0,0,0,0.06)",
            color: "#4b332d",
            cursor: "pointer",
          }}
          onClick={() => navigate("/setting/privacy-policy/terms-of-use")}
        >
          Privacy
        </button>
      </div>
      <p className="text-xs mt-5">Last updated: June 2025</p>
    </div>
  );
};

export default PrivacyPolicy;
