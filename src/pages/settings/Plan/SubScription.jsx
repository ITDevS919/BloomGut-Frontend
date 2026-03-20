import { ChevronLeft, Info } from "lucide-react";
import { Crown } from "lucide-react";
import { FaCrown } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";

const SubScription = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trendType = searchParams.get("trendType");
  const plan = searchParams.get("plan");
  const interval = searchParams.get("interval"); // "month" | "quarter" | "6mo" | "year"

  const addMonths = (date, months) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  };

  const resolveExpiry = () => {
    const now = new Date();
    const monthsMap = {
      month: 1,
      quarter: 3,
      "6mo": 6,
      year: 12,
    };

    const monthsToAdd = monthsMap[interval] ?? 1;
    const expiryDate = addMonths(now, monthsToAdd);
    return expiryDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const expiry = resolveExpiry();
  const isPremium = plan === "premium";
  const memberTierLabel = isPremium ? "Premium Member" : "Intermediate Member";

  return (
    <div className="bg-ivory min-h-full p-6 text-primary font-['Noto_Sans_TC', sans-serif]">
      <div className="flex items-center gap-4 mb-[54px]">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-[40px] leading-none cursor-pointer " />
        </button>
        <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">Subscription</h2>
      </div>

      <div className="max-w-sm mx-auto text-center mt-20">
        {/* Crown Icon */}
        <div className="flex justify-center mb-4">
          <FaCrown className="w-12 h-12 text-[#e29c53]" />
        </div>

        {/* Title */}
        <h3 className="text-lg text-primary">
          Subscription Successful
        </h3>

        {/* Member Tier */}
        <p className="text-lg text-primary mb-5">{memberTierLabel}</p>

        {/* Description */}
        <p className="text-sm text-secondary">
          Access Week/Month charts,
        </p>
        <p className="text-sm text-secondary mb-[50px]">
          exclusive tips & graphs
        </p>


        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mb-[51px]">
          <button
            // onClick={() => navigate("/trend-analysis")}
            className="w-[159px] px-3 py-2 mx-auto bg-ivory rounded-md shadow-sm text-sm text-secondary flex items-center justify-center mb-[31px]"
            onClick={() => {
              // Premium subscribe -> go to Premium trend
              if (isPremium) {
                navigate("/trend-analysis?plan=premium", {
                  state: { trendType: trendType || "bowel" },
                });
                return;
              }

              // Standard subscribe (intermediate) -> go to Intermediate trend
              navigate("/trend-analysis?plan=intermediate", {
                state: { trendType: trendType || "bowel" },
              });
            }}
          >
            Go to Trend Analysis
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-[159px] px-3 py-2 mx-auto bg-white rounded-md shadow-sm text-sm text-secondary flex items-center justify-center"
          >
            Return to Home
          </button>
        </div>

        {/* Membership Expiry Info */}
        <div className="flex items-center gap-2 text-primary mb-[57px] justify-start px-10 text-xs">
          <Info className="w-3 h-3 text-primary" />
          <span>Membership expires: <span className="">{expiry}</span></span>
        </div>

        {/* Renew Subscription */}
        <div className="mb-[33px]">
          <button
            disabled
            className="w-[209px] px-3 py-2 mx-auto bg-white rounded-md shadow-sm text-smflex items-center justify-center mb-[31px] text-[#ececec]"
          >
            Renew Subscription
          </button>
          <p className="text-xs text-custom-12 500 mt-2 italic">Renew within 7 days before expiry</p>
        </div>

        {/* Check Subscription Status Link */}
        <button
          onClick={() => navigate("/setting/plan")}
          className="text-sm text-custom-12 underline mx-auto block mb-[94"
        >
          Check Subscription Status
        </button>
      </div>
    </div>
  );
};

export default SubScription;
