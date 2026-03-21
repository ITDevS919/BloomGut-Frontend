import { ChevronLeft } from "lucide-react";
import { FaCrown } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Capacitor } from "@capacitor/core";
import { isPremiumEntitled, setPremiumEntitled } from "@/lib/premiumEntitlement";
import {
  initCdvPurchase,
  purchasePremium,
  restorePurchases,
} from "@/lib/iap/cdvPurchase";
import { IAP_PRODUCT_ID } from "@/lib/iap/iapConfig";

const SubScription = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getToken } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();

  const trendType = searchParams.get("trendType") || "bowel";
  const plan = searchParams.get("plan");
  const iapEntitled =
    searchParams.get("entitled") === "true" ||
    searchParams.get("iapStatus") === "success";

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [premiumActive, setPremiumActive] = useState(isPremiumEntitled());

  useEffect(() => {
    if (plan !== "premium") return;
    if (!iapEntitled) return;

    setPremiumEntitled(true);
    setPremiumActive(true);
  }, [iapEntitled, plan]);

  useEffect(() => {
    setPremiumActive(isPremiumEntitled());
  }, []);

  const handleBuyPremium = async () => {
    setError("");
    if (!userLoaded || !user) {
      setError("Please sign in to subscribe.");
      return;
    }
    if (!Capacitor.isNativePlatform()) {
      setError(
        "In-app purchases run in the BloomGut iOS/Android app. Open this screen there after installing from the store."
      );
      return;
    }

    setBusy(true);
    try {
      await initCdvPurchase(getToken);
      await purchasePremium(IAP_PRODUCT_ID, getToken);
      setPremiumActive(true);
    } catch (e) {
      setError(e?.message || "Purchase failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleRestore = async () => {
    setError("");
    if (!userLoaded || !user) {
      setError("Please sign in to restore purchases.");
      return;
    }
    if (!Capacitor.isNativePlatform()) {
      setError("Restore is available in the iOS/Android app.");
      return;
    }
    setBusy(true);
    try {
      await initCdvPurchase(getToken);
      await restorePurchases(getToken);
      await new Promise((r) => setTimeout(r, 2500));
      if (isPremiumEntitled()) {
        setPremiumActive(true);
      } else {
        setError("No active subscription found for this account.");
      }
    } catch (e) {
      setError(e?.message || "Restore failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleGoToTrends = () => {
    const nextPlan = premiumActive ? "premium" : "free";
    navigate(`/trend-analysis?plan=${nextPlan}`, { state: { trendType } });
  };

  const showNativeIap = Capacitor.isNativePlatform();

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
          <div className="flex flex-col items-center gap-3 mb-[31px]">
            <button
              type="button"
              disabled={busy}
              onClick={handleBuyPremium}
              className="w-[209px] px-3 py-2 mx-auto bg-[#FBB667] rounded-md shadow-sm text-sm text-secondary flex items-center justify-center"
            >
              {busy ? "Working..." : `Buy Premium ($4.99/month)`}
            </button>
            {showNativeIap ? (
              <button
                type="button"
                disabled={busy}
                onClick={handleRestore}
                className="text-sm text-primary underline underline-offset-2"
              >
                Restore purchases
              </button>
            ) : null}
          </div>
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
          {showNativeIap
            ? "Purchases are validated on our server and tied to your account."
            : "Use the mobile app to complete checkout; premium then syncs when you sign in."}
        </p>
      </div>
    </div>
  );
};

export default SubScription;
