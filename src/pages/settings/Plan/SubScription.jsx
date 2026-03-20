import { ChevronLeft } from "lucide-react";
import { FaCrown } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { isPremiumEntitled, setPremiumEntitled } from "@/lib/premiumEntitlement";

const SubScription = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const trendType = searchParams.get("trendType") || "bowel";
  const plan = searchParams.get("plan");
  const iapEntitled = searchParams.get("entitled") === "true" || searchParams.get("iapStatus") === "success";

  const productId = useMemo(() => "premium_monthly", []);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [premiumActive, setPremiumActive] = useState(isPremiumEntitled());

  useEffect(() => {
    if (plan !== "premium") return;
    if (!iapEntitled) return;

    setPremiumEntitled(true);
    setPremiumActive(true);
    // Keep the page visible for user feedback (don’t auto-navigate).
  }, [iapEntitled, plan]);

  const requestNativePurchase = async () => {
    // Bridge points (examples):
    // - Capacitor/Custom WebView implementations often expose a promise-based API.
    // - RevenueCat / native wrappers may redirect back with ?entitled=true.
    if (typeof window === "undefined") throw new Error("Not running in a browser.");

    // Promise-based bridges (preferred).
    const candidates = [
      window?.IAP?.purchaseSubscription,
      window?.iap?.purchaseSubscription,
      window?.iap?.subscribe,
      window?.IAP?.subscribe,
    ].filter(Boolean);

    for (const fn of candidates) {
      try {
        const res = await fn.call(null, { productId });
        return res;
      } catch {
        // try next bridge
      }
    }

    throw new Error(
      "Native IAP purchase bridge is not available. Open the subscription page from inside the native app, or integrate an IAP bridge that redirects back with ?entitled=true."
    );
  };

  const handleBuyPremium = async () => {
    setError("");
    setBusy(true);
    try {
      const res = await requestNativePurchase();
      // If the native layer returns entitlement, trust it (the native wrapper should validate with stores).
      if (res?.entitled === true || res?.isEntitled === true) {
        setPremiumEntitled(true);
        setPremiumActive(true);
      }
    } catch (e) {
      setError(e?.message || "Purchase failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleGoToTrends = () => {
    const nextPlan = premiumActive ? "premium" : "free";
    navigate(`/trend-analysis?plan=${nextPlan}`, { state: { trendType } });
  };

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
        <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">Premium Subscription</h2>
      </div>

      <div className="max-w-sm mx-auto text-center mt-20">
        <div className="flex justify-center mb-4">
          <FaCrown className="w-12 h-12 text-[#e29c53]" />
        </div>

        <h3 className="text-lg text-primary">
          {premiumActive ? "Premium Active" : "Unlock Premium"}
        </h3>
        <p className="text-sm text-secondary mb-[30px]">
          {premiumActive
            ? "You can now access Week / Month / Year views."
            : "Buy via App Store / Google Play to enable premium features."}
        </p>

        {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}

        {!premiumActive ? (
          <button
            type="button"
            disabled={busy}
            onClick={handleBuyPremium}
            className="w-[209px] px-3 py-2 mx-auto bg-[#FBB667] rounded-md shadow-sm text-sm text-secondary flex items-center justify-center mb-[31px]"
          >
            {busy ? "Opening Store..." : `Buy Premium ($4.99/month)`}
          </button>
        ) : null}

        <div className="flex flex-col gap-3 mb-[51px]">
          <button
            className="w-[159px] px-3 py-2 mx-auto bg-ivory rounded-md shadow-sm text-sm text-secondary flex items-center justify-center mb-[31px]"
            onClick={handleGoToTrends}
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

        <p className="text-xs text-gray-400">
          If you don’t see access right away, reopen this page with <span className="font-medium">?entitled=true</span> after the store flow completes.
        </p>
      </div>
    </div>
  );
};

export default SubScription;
