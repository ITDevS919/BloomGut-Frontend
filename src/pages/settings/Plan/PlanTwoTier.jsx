import { ChevronLeft, Check } from "lucide-react";
import { FaCrown } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";

const PlanTwoTier = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trendTypeParam = searchParams.get("trendType");

  const freeTier = {
    name: "FREE",
    price: "$0",
    subtitle: "Basic access",
    features: [
      "7-day view only",
      "Basic input (bowel, diet, water, urine)",
      "Basic trend charts",
      "No AI insights",
      "No correlation analysis",
      "No full history",
    ],
  };

  const premiumTier = {
    name: "PREMIUM",
    price: "$4.99",
    subtitle: "Unlock full health insights",
    features: [
      "Week / Month / Year views",
      "Full history",
      "Correlation analysis",
      "AI personalized insights",
      "Advanced charts and comparisons",
      "Trend analysis",
    ],
  };

  return (
    <div className="bg-ivory min-h-full p-6 text-primary font-['Noto_Sans_TC', sans-serif]">
      <div className="flex items-center gap-4 mb-[51px]">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-[40px] leading-none cursor-pointer " />
        </button>
        <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">Plan</h2>
      </div>

      <div className="max-w-sm mx-auto mb-[18px]">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-[11px]">
            <FaCrown className="w-[59px] h-[48px] text-[#e29c53]" />
          </div>
          <h3 className="text-lg text-primary mb-[11px]">Upgrade Plan</h3>
          <p className="text-sm text-secondary mb-[25px]">
            Unlock full health analysis & tracking
          </p>
        </div>
      </div>

      <div className="max-w-sm mx-auto space-y-[22px]">
        {/* Free */}
        <div className="bg-white rounded-[8px] shadow-md p-6 relative w-[287px] mx-auto">
          <div className="absolute top-4 right-4">
            <span className="text-base text-primary uppercase">{freeTier.name}</span>
          </div>

          <div className="text-center mt-[43px] mb-[40px]">
            <div className="text-[32px] text-primary mb-[20px]">{freeTier.price}</div>
            <div className="text-xs text-primary">{freeTier.subtitle}</div>
          </div>

          <div className="space-y-3 mb-[26px]">
            {freeTier.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 mt-[24px]">
                <Check className="w-5 h-5 text-custom-5 shrink-0 mt-0.5" />
                <span className="text-sm text-secondary">{feature}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="w-[176px] flex justify-center items-center mx-auto py-[10px] rounded-[8px] border border-custom-16 bg-white text-primary text-sm shadow-sm mb-[52px]"
            onClick={() => navigate("/trend-analysis?plan=free")}
          >
            Use
          </button>
        </div>

        {/* Premium */}
        <div className="bg-white rounded-[8px] shadow-md p-6 relative w-[287px] mx-auto border-2 border-[#fbb667]">
          <div className="absolute top-4 right-4">
            <span className="text-base font-medium text-primary uppercase">
              {premiumTier.name}
            </span>
          </div>

          <div className="text-center mb-[22px] mt-[36px]">
            <div className="text-[32px] text-primary mb-[10px]">
              {premiumTier.price}
              <span className="text-xs text-primary ml-1">/ Month</span>
            </div>
            <div className="text-sm text-primary mb-10 flex items-center justify-center">
              {premiumTier.subtitle}
            </div>
          </div>

          <div className="space-y-3 mb-[43px]">
            {premiumTier.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 mb-[22px]">
                <Check className="w-5 h-5 text-[#f59e0b] shrink-0 mt-0.5" />
                <span className="text-sm text-primary">{feature}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="w-[183px] flex items-center justify-center mx-auto py-2 rounded-lg text-secondary text-sm bg-[#FBB667] shadow-sm mb-[52px]"
            onClick={() => {
              if (trendTypeParam) {
                navigate("/trend-analysis?plan=premium", {
                  state: { trendType: trendTypeParam },
                });
              } else {
                navigate("/trend-analysis?plan=premium");
              }
            }}
          >
            Use premium
          </button>
        </div>
      </div>

      <div className="text-center mt-6 text-xs text-gray-400">
        Selecting indicates agreement to [Terms of Service] and [Privacy Policy]
      </div>
    </div>
  );
};

export default PlanTwoTier;

