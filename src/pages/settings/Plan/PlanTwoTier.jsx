import { ChevronLeft, Check } from "lucide-react";
import { FaCrown } from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSwipe } from "@/hooks/useSwipe";
import usePremiumEntitlement from "@/hooks/usePremiumEntitlement";
import useApiClient from "@/hooks/useApiClient";
import { postPlayBillingAcknowledge } from "@/api/http";
import {
  getSkuDetails,
  isPlayBillingApiAvailable,
  requestPlayPurchase,
} from "@/lib/playBilling";
import {
  getConfiguredPremiumSku,
  premiumDevUnlockEnabled,
} from "@/lib/premiumEntitlement";

const PlanTwoTier = () => {
  const navigate = useNavigate();
  const api = useApiClient();
  const { isSignedIn, isLoaded } = useAuth();
  const {
    premiumEntitled,
    refreshEntitlement,
    isLoadingEntitlement,
  } = usePremiumEntitlement();
  const [searchParams] = useSearchParams();
  const trendTypeParam = searchParams.get("trendType");
  const showPremium = searchParams.get("showPremium");
  const [activeSlide, setActiveSlide] = useState(showPremium === "true" ? 1 : 0);
  const [localizedPremiumPrice, setLocalizedPremiumPrice] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const premiumSku = getConfiguredPremiumSku();
  const canUsePlayBilling =
    isPlayBillingApiAvailable() && Boolean(premiumSku);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!premiumSku || !canUsePlayBilling) return;
      try {
        const detail = await getSkuDetails(premiumSku);
        if (cancelled || !detail?.price) return;
        const formatted = new Intl.NumberFormat(navigator.language, {
          style: "currency",
          currency: detail.price.currency,
        }).format(detail.price.value);
        setLocalizedPremiumPrice(formatted);
      } catch {
        /* keep static fallback label */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [premiumSku, canUsePlayBilling]);

  const goPremiumTrends = () => {
    if (trendTypeParam) {
      navigate("/trend-analysis?plan=premium", {
        state: { trendType: trendTypeParam },
      });
    } else {
      navigate("/trend-analysis?plan=free");
    }
  };

  const handlePremiumAction = async () => {
    if (premiumEntitled) {
      goPremiumTrends();
      return;
    }

    if (!isLoaded) return;

    if (!isSignedIn) {
      toast.error("Sign in to subscribe to Premium.");
      navigate("/login");
      return;
    }

    if (canUsePlayBilling) {
      setPurchasing(true);
      let paymentResponse = null;
      try {
        const { response, purchaseToken } = await requestPlayPurchase(premiumSku);
        paymentResponse = response;
        await postPlayBillingAcknowledge(api, {
          purchaseToken,
          sku: premiumSku,
        });
        await paymentResponse.complete("success");
        await refreshEntitlement();
        toast.success("Premium is active.");
        goPremiumTrends();
      } catch (err) {
        const name = err?.name || "";
        if (name === "AbortError") {
          toast.message("Purchase cancelled.");
        } else {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Purchase could not be completed.";
          toast.error(msg);
        }
        if (paymentResponse) {
          try {
            await paymentResponse.complete("fail");
          } catch {
            /* ignore */
          }
        }
      } finally {
        setPurchasing(false);
      }
      return;
    }

    if (premiumDevUnlockEnabled()) {
      goPremiumTrends();
      return;
    }

    toast.error(
      "Google Play purchases are only available in the Bloomgut app from the Play Store."
    );
  };

  const handleRestorePurchases = async () => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      toast.error("Sign in to restore purchases.");
      navigate("/login");
      return;
    }
    if (!canUsePlayBilling) {
      toast.message(
        "Restore is only available in the Bloomgut app from the Play Store."
      );
      return;
    }
    setRestoring(true);
    try {
      const { entitled } = await refreshEntitlement();
      if (entitled) {
        toast.success("Your subscription is active.");
      } else {
        toast.message("No active subscription found for this account.");
      }
    } catch {
      toast.error("Could not restore purchases.");
    } finally {
      setRestoring(false);
    }
  };

  const premiumPrimaryDisabled =
    purchasing ||
    (isLoadingEntitlement &&
      isSignedIn &&
      !premiumEntitled &&
      !premiumDevUnlockEnabled());

  const plans = [
    {
      id: 0,
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
      buttonText: "Use",
      buttonClass: "border border-custom-16 bg-white text-primary",
      handleClick: () => navigate("/trend-analysis?plan=free"),
    },
    {
      id: 1,
      name: "PREMIUM",
      price: localizedPremiumPrice || "$4.99",
      subtitle: "Unlock full health insights",
      features: [
        "Week / Month / Year views",
        "Full history",
        "Correlation analysis",
        "AI personalized insights",
        "Advanced charts and comparisons",
        "Trend analysis",
      ],
      buttonText: purchasing
        ? "Processing…"
        : isLoadingEntitlement &&
            isSignedIn &&
            !premiumEntitled &&
            !premiumDevUnlockEnabled()
          ? "Checking…"
          : premiumEntitled
            ? "Open premium"
            : canUsePlayBilling
              ? "Subscribe with Google Play"
              : premiumDevUnlockEnabled()
                ? "Use premium"
                : "Subscribe (Play app)",
      buttonClass: "bg-[#FBB667] text-secondary",
      borderClass: "border-2 border-[#fbb667]",
      handleClick: handlePremiumAction,
    },
  ];

  const handleSwipeLeft = () => {
    setActiveSlide((prev) => (prev < plans.length - 1 ? prev + 1 : prev));
  };

  const handleSwipeRight = () => {
    setActiveSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const swipeHandlers = useSwipe(handleSwipeLeft, handleSwipeRight);

  return (
    <div className="bg-ivory min-h-full flex flex-col text-primary font-['Noto_Sans_TC', sans-serif]">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 pb-0">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-[40px] leading-none cursor-pointer" />
        </button>
        <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">Plan</h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden p-6">
        {/* Title Section */}
        <div className="text-center mb-8 flex-shrink-0">
          <div className="flex justify-center mb-[11px]">
            <FaCrown className="w-[59px] h-[48px] text-[#e29c53]" />
          </div>
          <h3 className="text-lg text-primary mb-[11px]">Upgrade Plan</h3>
          <p className="text-sm text-secondary mb-[25px]">
            Unlock full health analysis & tracking
          </p>
        </div>

        {/* Swipeable Cards Container */}
        <div
          className="flex-1 flex items-center overflow-hidden cursor-grab active:cursor-grabbing"
          {...swipeHandlers}
          style={{
            userSelect: "none",
            touchAction: "pan-y",
          }}
        >
          <div
            className="flex w-full transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${activeSlide * 100}%)`,
            }}
          >
            {plans.map((plan) => (
              <div key={plan.id} className="w-full flex-shrink-0 flex justify-center px-4">
                <div
                  className={`bg-white rounded-[8px] shadow-md p-6 relative w-full max-w-sm ${
                    plan.borderClass || ""
                  }`}
                >
                  <div className="absolute top-4 right-4">
                    <span className="text-base font-medium text-primary uppercase">
                      {plan.name}
                    </span>
                  </div>

                  <div className="text-center mt-[43px] mb-[40px]">
                    <div className="text-[32px] text-primary mb-[20px]">{plan.price}</div>
                    <div className="text-xs text-primary">{plan.subtitle}</div>
                  </div>

                  <div className="space-y-3 mb-[26px]">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 mt-[24px]">
                        <Check
                          className={`w-5 h-5 shrink-0 mt-0.5 ${
                            plan.name === "FREE"
                              ? "text-custom-5"
                              : "text-[#f59e0b]"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            plan.name === "FREE"
                              ? "text-secondary"
                              : "text-primary"
                          }`}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={plan.id === 1 && premiumPrimaryDisabled}
                    className={`w-[176px] md:w-[183px] flex justify-center items-center mx-auto py-[10px] md:py-2 rounded-[8px] text-sm shadow-sm ${
                      plan.id === 1 && canUsePlayBilling && isSignedIn
                        ? "mb-3"
                        : "mb-[52px]"
                    } disabled:opacity-60 ${plan.buttonClass}`}
                    onClick={plan.handleClick}
                  >
                    {plan.buttonText}
                  </button>
                  {plan.id === 1 && canUsePlayBilling && isSignedIn ? (
                    <button
                      type="button"
                      className="w-full text-center text-xs text-secondary underline underline-offset-2 mb-[52px] disabled:opacity-50"
                      disabled={restoring || purchasing}
                      onClick={handleRestorePurchases}
                    >
                      {restoring ? "Restoring purchases…" : "Restore purchases"}
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mb-6 flex-shrink-0 mt-5">
          {plans.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === activeSlide ? "bg-custom-7 w-8" : "bg-custom-18 w-2"
              }`}
              aria-label={`Go to plan ${index + 1}`}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 flex-shrink-0">
          Selecting indicates agreement to the{" "}
          <Link
            to="/setting/privacy-policy/terms-of-use"
            className="text-custom-7 underline underline-offset-2"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/setting/privacy-policy"
            className="text-custom-7 underline underline-offset-2"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
};

export default PlanTwoTier;
