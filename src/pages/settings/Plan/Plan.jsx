import { ChevronLeft, Check, Crown, Star } from "lucide-react";
import { useState } from "react";

const Plan = () => {
  const [currentPlan, setCurrentPlan] = useState(0); // 0 = FREE, 1 = STANDARD, 2 = PRO
  const [selectedPricing, setSelectedPricing] = useState("month"); // "month" or "quarter" for STANDARD
  const [selectedProPricing, setSelectedProPricing] = useState("6mo"); // "6mo" or "year" for PRO

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

  return (
    <>
      <div className="bg-ivory min-h-full p-6 text-secondary">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            className="text-primary text-xl leading-none"
            aria-label="back"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="text-primary text-xl leading-none" />
          </button>
          <h2 className="text-xl font-semibold">Plan</h2>
        </div>

        {/* Upgrade Plan Card */}
        <div className="max-w-sm mx-auto mb-6">
          <div className="p-8 text-center">
            {/* Crown Icon */}
            <div className="flex justify-center mb-4">
              <Crown className="w-12 h-12 text-[#f59e0b]" />
            </div>

            {/* Title */}
            <h3 className="text-xl text-primary mb-2">
              Upgrade Plan
            </h3>

            {/* Subtitle */}
            <p className="text-sm text-secondary">
              Unlock full health analysis & tracking
            </p>
          </div>
        </div>

        {/* Plan Card */}
        <div className="max-w-sm mx-auto p-4">
          {currentPlan === 0 ? (
            // FREE Plan Card
            <div className="bg-white rounded-xl shadow-sm p-6 relative">
              {/* FREE Label - Top Right */}
              <div className="absolute top-4 right-4">
                <span className="text-sm font-medium text-primary uppercase">
                  {plans[currentPlan].name}
                </span>
              </div>

              {/* Price */}
              <div className="text-center mt-8 mb-2">
                <div className="text-4xl font-bold text-primary mb-1">
                  {plans[currentPlan].price}
                </div>
                <div className="text-sm text-primary">
                  {plans[currentPlan].subtitle}
                </div>
              </div>

              {/* Features List */}
              <div className="mt-8 space-y-3">
                {plans[currentPlan].features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#f59e0b] shrink-0 mt-0.5" />
                    <span className="text-sm text-primary">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Use Button */}
              <button
                type="button"
                className="w-1/2 flex justify-center items-center mx-auto mt-8 py-2 rounded-lg border border-gray-300 bg-white text-primary font-medium text-sm shadow-sm hover:bg-gray-50 transition-colors"
              >
                Use
              </button>
            </div>
          ) : currentPlan === 1 ? (
            // STANDARD Plan Card
            <div className="bg-white rounded-xl shadow-sm p-6 relative border border-orange-200">
              {/* Hot Badge - Top Right Corner */}
              {plans[currentPlan].hasHotBadge && (
                <div className="absolute top-1 right-2">
                  <span className="bg-[#FBB667] text-white text-xs font-medium px-3 py-1 rounded-full">
                    Hot
                  </span>
                </div>
              )}

              {/* STANDARD Title with Star - Below Hot Badge */}
              <div className="flex items-center justify-end gap-2 mb-4">
                <span className="text-lg font-medium text-primary uppercase">
                  {plans[currentPlan].name}
                </span>
                {plans[currentPlan].hasStar && (
                  <Star className="w-5 h-5 text-[#fbbf24] fill-[#fbbf24]" />
                )}
              </div>

              {/* Pricing Options */}
              <div className="flex items-center justify-center gap-3 mb-2">
                <button
                  type="button"
                  onClick={() => setSelectedPricing("month")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedPricing === "month"
                      ? "bg-white border border-gray-300 text-primary shadow-sm"
                      : "text-primary"
                    }`}
                >
                  {plans[currentPlan].price} / Month
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPricing("quarter")}
                  className={`text-sm font-medium transition-colors ${selectedPricing === "quarter"
                      ? "text-primary"
                      : "text-primary"
                    }`}
                >
                  {plans[currentPlan].priceQuarter} / Quarter
                </button>
              </div>

              {/* Subtitle */}
              <div className="text-sm text-primary mb-6 mt-5">
                {plans[currentPlan].subtitle}
              </div>

              {/* Features List */}
              <div className="space-y-3 mb-6">
                {plans[currentPlan].features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 mt-5">
                    <Check className="w-5 h-5 text-[#fbbf24] shrink-0 mt-0.5" />
                    <span className="text-sm text-primary">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Subscribe Button */}
              <button
                type="button"
                className="w-1/2 flex items-center justify-center mx-auto py-3 rounded-lg text-[#705D56] font-medium text-sm hover:opacity-90 transition-opacity bg-[#FBB667] shadow-sm"
              >
                Subscribe
              </button>
            </div>
          ) : (
            // PRO Plan Card
            <div className="bg-white rounded-xl shadow-sm p-6 relative">
              {/* PRO Label - Top Right */}
              <div className="absolute top-4 right-4">
                <span className="text-sm font-medium text-primary uppercase">
                  {plans[currentPlan].name}
                </span>
              </div>

              {/* Pricing Options */}
              <div className="flex items-center justify-center gap-3 mb-2 mt-8">
                <button
                  type="button"
                  onClick={() => setSelectedProPricing("6mo")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedProPricing === "6mo"
                      ? "bg-white border-gray-300 text-primary shadow-sm"
                      : "text-primary"
                    }`}
                >
                  {plans[currentPlan].price} / 6 mo
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProPricing("year")}
                  className={`text-sm font-medium transition-colors ${selectedProPricing === "year"
                      ? "text-primary"
                      : "text-primary"
                    }`}
                >
                  {plans[currentPlan].priceYear} / Year
                </button>
              </div>

              {/* Subtitle */}
              <div className="text-sm text-primary mb-6 mt-5">
                {plans[currentPlan].subtitle}
              </div>

              {/* Features List */}
              <div className="space-y-3 mb-6">
                {plans[currentPlan].features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 mt-5">
                    <Check className="w-5 h-5 text-[#f59e0b] shrink-0 mt-0.5" />
                    <span className="text-sm text-primary">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Subscribe Button */}
              <button
                type="button"
                className="w-1/2 flex items-center justify-center mx-auto py-3 rounded-lg text-[#705D56] font-medium text-sm hover:opacity-90 transition-opacity bg-white shadow-sm"
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