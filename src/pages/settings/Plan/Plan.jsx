import { ChevronLeft, Check, Crown, Star, CrownIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { FaCrown } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";

const Plan = () => {
  const [searchParams] = useSearchParams();
  const planParam = searchParams.get("plan");
  const trendTypeParam = searchParams.get("trendType");
  
  // Initialize currentPlan based on URL parameter
  const getInitialPlan = (param) => {
    if (param === "standard") return 1; // STANDARD
    if (param === "pro" || param === "premium") return 2; // PRO
    return 0; // FREE (default)
  };
  
  const [currentPlan, setCurrentPlan] = useState(getInitialPlan(planParam));
  const [selectedPricing, setSelectedPricing] = useState("month"); // "month" or "quarter" for STANDARD
  const [selectedProPricing, setSelectedProPricing] = useState("6mo"); // "6mo" or "year" for PRO

  // Update currentPlan when URL parameter changes
  useEffect(() => {
    const plan = getInitialPlan(planParam);
    setCurrentPlan(plan);
  }, [planParam]);

  const plans = [
    {
      name: "FREE",
      price: "$0",
      subtitle: "Suitable for trial users",
      features: [
        "Weekly 7-day view",
        "Health input (bowel, diet, water, urine)",
        "Basic trend graphs (4 modules)",
      ],
    },
    {
      name: "STANDARD",
      price: "$99",
      priceQuarter: "$250",
      subtitle: "Perfect for health tracking",
      features: [
        "Weekly/Monthly advanced views",
        "7-day gut chart with tips",
        "Monthly nutrition stats",
        "Auto trend analysis from records",
      ],
      hasHotBadge: true,
      hasStar: true,
    },
    {
      name: "PRO",
      price: "NT$499",
      priceYear: "NT$899",
      subtitle: "Suitable for In-depth Analysis",
      features: [
        "Week/Month/Year views",
        "All advanced charts + multi-chart comparison",
        "Correlation analysis (bowel, diet, water, urine)",
        "AI personalized health advice",
        "All intermediate member features",
      ],
    },
  ];

  const navigate = useNavigate();

  const handleChevronLeftClick = () => {
    // Cycle backwards through plans: PRO -> STANDARD -> FREE -> PRO
    const nextPlan = currentPlan === 0 ? 2 : currentPlan - 1;
    setCurrentPlan(nextPlan);
  };

  return (
    <>
      <div className="bg-ivory min-h-full p-6 text-primary font-['Noto_Sans_TC', sans-serif]">
        {/* Header */}
        <div className="flex items-center gap-4 mb-[51px]">
          <button
            type="button"
            className="text-primary text-xl leading-none"
            aria-label="back"
            onClick={handleChevronLeftClick}
          >
            <ChevronLeft className="text-primary text-[40px] leading-none cursor-pointer " />
          </button>
          <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">Plan</h2>
        </div>

        {/* Upgrade Plan Card */}
        <div className="max-w-sm mx-auto">
          <div className="p-8 text-center">
            {/* Crown Icon */}
            <div className="flex justify-center mb-[11px]">
              <FaCrown className="w-[59px] h-[48px] text-[#e29c53]" />
            </div>

            {/* Title */}
            <h3 className="text-lg text-primary mb-[11px]">
              Upgrade Plan
            </h3>

            {/* Subtitle */}
            <p className="text-sm text-secondary mb-[73px]">
              Unlock full health analysis & tracking
            </p>
          </div>
        </div>

        {/* Plan Card */}
        <div className="">
          {currentPlan === 0 ? (
            // FREE Plan Card
            <div className="bg-white rounded-[8px] shadow-md p-6 relative w-[287px] mx-auto mb-[38px]">
              {/* FREE Label - Top Right */}
              <div className="absolute top-4 right-4">
                <span className="text-base text-primary uppercase">
                  {plans[currentPlan].name}
                </span>
              </div>

              {/* Price */}
              <div className="text-center mt-[43px] mb-[50px]">
                <div className="text-[32px] text-primary mb-[20px]">
                  {plans[currentPlan].price}
                </div>
                <div className="text-xs text-primary">
                  {plans[currentPlan].subtitle}
                </div>
              </div>

              {/* Features List */}
              <div className=" mb-[208px]">
                {plans[currentPlan].features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 mt-[29px]">
                    <Check className="w-5 h-5 text-custom-5 shrink-0 mt-0.5" />
                    <span className="text-sm text-secondary">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Use Button */}
              <button
                type="button"
                className="w-[176px] flex justify-center items-center mx-auto py-[10px] rounded-[8px] border border-custom-16 bg-white text-primary text-sm shadow-sm mb-[52px]"
                onClick={() => navigate("/trend-analysis?plan=free")}
              >
                Use
              </button>
            </div>
          ) : currentPlan === 1 ? (
            // STANDARD Plan Card
            <div className="bg-white rounded-[8px] shadow-md p-6 relative w-[287px] mx-auto border-2 border-[#fbb667]">
              {/* Hot Badge - Top Right Corner */}
              {plans[currentPlan].hasHotBadge && (
                <div className="absolute top-0 right-0">
                  <span className="bg-[#FBB667] text-white text-xs font-medium px-3 py-1 rounded-full">
                    Hot
                  </span>
                </div>
              )}

              {/* STANDARD Title with Star - Below Hot Badge */}
              <div className="flex items-center justify-center gap-2 mb-[33px]">
                <span className="text-base font-medium text-primary uppercase">
                  {plans[currentPlan].name}
                </span>
                {plans[currentPlan].hasStar && (
                  <Star className="w-5 h-5 text-[#fbbf24] fill-[#fbbf24]" />
                )}
              </div>

              {/* Current Price (updates with selection) */}
              <div className="text-center mb-2">
                <div className="text-[32px] text-primary mb-[10px]">
                  {selectedPricing === "month"
                    ? plans[currentPlan].price
                    : plans[currentPlan].priceQuarter}
                </div>
                <div className="text-xs text-primary">
                  {selectedPricing === "month" ? "/ Month" : "/ Quarter"}
                </div>

                {/* Pricing Options */}
                <div className="flex items-center justify-center gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPricing("month")}
                    className={`text-sm rounded-[8px] px-4 py-2 shadow-sm transition-colors ${
                      selectedPricing === "month"
                        ? "bg-white border text-primary shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                        : "text-secondary bg-white"
                    }`}
                  >
                    {plans[currentPlan].price} / Month
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPricing("quarter")}
                    className={`text-sm rounded-[8px] px-4 py-2 shadow-md transition-colors ${
                      selectedPricing === "quarter"
                        ? "bg-white border text-primary shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                        : "text-secondary bg-white"
                    }`}
                  >
                    {plans[currentPlan].priceQuarter} / Quarter
                  </button>
                </div>
              </div>

              {/* Subtitle */}
              <div className="text-sm flex items-center justify-center text-primary mb-[68px] mt-5">
                {plans[currentPlan].subtitle}
              </div>

              {/* Features List */}
              <div className="space-y-3 mb-[88px]">
                {plans[currentPlan].features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 mb-[52px]">
                    <Check className="w-5 h-5 text-[#fbbf24] shrink-0 mt-0.5" />
                    <span className="text-sm text-primary">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Subscribe Button */}
              <button
                type="button"
                className="w-[183px] flex items-center justify-center mx-auto py-2 rounded-lg text-secondary text-sm bg-[#FBB667] shadow-sm mb-[52px]"
                onClick={() => {
                  const interval = selectedPricing; // "month" | "quarter"
                  const url = trendTypeParam
                    ? `/setting/upgrade-plan/subscription?trendType=${encodeURIComponent(
                        trendTypeParam
                      )}&plan=intermediate&interval=${encodeURIComponent(interval)}`
                    : `/setting/upgrade-plan/subscription?plan=intermediate&interval=${encodeURIComponent(
                        interval
                      )}`;
                  navigate(url);
                }}
              >
                Subscribe
              </button>
            </div>
          ) : (
            // PRO Plan Card
            <div className="bg-white rounded-[8px] shadow-md p-6 relative w-[287px] mx-auto">
              {/* PRO Label - Top Right */}
              <div className="absolute top-4 right-4">
                <span className="text-sm font-medium text-primary uppercase">
                  {plans[currentPlan].name}
                </span>
              </div>

              {/* Current Price (updates with selection) */}
              <div className="text-center mb-[22px] mt-[36px]">
                <div className="text-[32px] text-primary mb-[10px]">
                  {selectedProPricing === "6mo"
                    ? plans[currentPlan].price
                    : plans[currentPlan].priceYear}
                </div>
                <div className="text-xs text-primary">
                  {selectedProPricing === "6mo" ? "/ 6 mo" : "/ Year"}
                </div>

                {/* Pricing Options */}
                <div className="flex items-center justify-center gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProPricing("6mo")}
                    className={`text-sm rounded-[8px] px-4 py-2 shadow-sm ${
                      selectedProPricing === "6mo"
                        ? "bg-white border text-primary shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                        : "text-secondary"
                    }`}
                  >
                    {plans[currentPlan].price}/6 mo
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedProPricing("year")}
                    className={`text-sm rounded-[8px] px-4 py-2 shadow-sm transition-colors ${
                      selectedProPricing === "year"
                        ? "bg-white border text-primary shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                        : "text-secondary"
                    }`}
                  >
                    {plans[currentPlan].priceYear} / Year
                  </button>
                </div>
              </div>

              {/* Subtitle */}
              <div className="text-sm text-primary mb-10 flex items-center justify-center">
                {plans[currentPlan].subtitle}
              </div>

              {/* Features List */}
              <div className="space-y-3 mb-[43px]">
                {plans[currentPlan].features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 mb-[43px]">
                    <Check className="w-5 h-5 text-[#f59e0b] shrink-0 mt-0.5" />
                    <span className="text-sm text-primary">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Subscribe Button */}
              <button
                type="button"
                className="w-[172px] flex items-center justify-center mx-auto py-2 rounded-lg text-secondary text-sm bg-white shadow-sm mb-[52px]"
                onClick={() => {
                  const interval = selectedProPricing; // "6mo" | "year"
                  const url = trendTypeParam
                    ? `/setting/upgrade-plan/subscription?trendType=${encodeURIComponent(
                        trendTypeParam
                      )}&plan=premium&interval=${encodeURIComponent(interval)}`
                    : `/setting/upgrade-plan/subscription?plan=premium&interval=${encodeURIComponent(
                        interval
                      )}`;
                  navigate(url);
                }}
              >
                Subscribe
              </button>
            </div>
          )}



          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentPlan(index)}
                className={`w-2 h-2 rounded-full transition-all ${currentPlan === index
                  ? "bg-primary"
                  : "bg-white border border-gray-300"
                  }`}
                aria-label={`Go to plan ${index + 1}`}
              />
            ))}
          </div>

          {/* Footer Text */}
          <div className="text-center mt-6 text-xs text-gray-400">
            Selecting indicates agreement to [Terms of Service] and [Privacy Policy]
          </div>
        </div>
      </div>
    </>
  );
};

export default Plan;