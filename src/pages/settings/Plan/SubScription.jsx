import { ChevronLeft, Info } from "lucide-react";
import { FaCrown } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Capacitor } from "@capacitor/core";
import useApiClient from "@/hooks/useApiClient";
import { isPremiumEntitled, setPremiumEntitled } from "@/lib/premiumEntitlement";
import {
  initCdvPurchase,
  openSubscriptionManagement,
  purchasePremium,
  restorePurchases,
} from "@/lib/iap/cdvPurchase";
import { IAP_PRODUCT_ID } from "@/lib/iap/iapConfig";

const SubScription = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getToken } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const api = useApiClient();

  const trendType = searchParams.get("trendType") || "bowel";
  const interval = searchParams.get("interval");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [premiumActive, setPremiumActive] = useState(() => isPremiumEntitled());
  const [serverExpiresAt, setServerExpiresAt] = useState(null);

  const addMonths = (date, months) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  };

  const fallbackExpiryLabel = useMemo(() => {
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
  }, [interval]);

  useEffect(() => {
    setPremiumActive(isPremiumEntitled());
  }, []);

  useEffect(() => {
    if (!userLoaded || !user) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/iap/entitlement");
        const inner = res.data?.data;
        if (cancelled) return;
        if (inner?.expiresAt) setServerExpiresAt(inner.expiresAt);
        if (inner?.premiumActive) {
          setPremiumEntitled(true);
          setPremiumActive(true);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userLoaded, user, api]);

  const expiryDisplay = useMemo(() => {
    if (serverExpiresAt) {
      return new Date(serverExpiresAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return fallbackExpiryLabel;
  }, [serverExpiresAt, fallbackExpiryLabel]);

  const memberTierLabel = premiumActive ? "Premium Member" : "Intermediate Member";

  const handleGoToTrends = () => {
    const nextPlan = premiumActive ? "premium" : "free";
    navigate(`/trend-analysis?plan=${nextPlan}`, { state: { trendType } });
  };

  const handleSubscribeOrRenew = async () => {
    setError("");
    if (!userLoaded || !user) {
      setError("Please sign in to subscribe.");
      return;
    }
    if (!Capacitor.isNativePlatform()) {
      setError("Open the BloomGut app on iOS or Android to complete purchase.");
      return;
    }
    setBusy(true);
    try {
      await initCdvPurchase(getToken);
      await purchasePremium(IAP_PRODUCT_ID, getToken);
      setPremiumActive(true);
      const res = await api.get("/iap/entitlement");
      const inner = res.data?.data;
      if (inner?.expiresAt) setServerExpiresAt(inner.expiresAt);
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
      setError("Restore is available in the mobile app.");
      return;
    }
    setBusy(true);
    try {
      await initCdvPurchase(getToken);
      await restorePurchases(getToken);
      await new Promise((r) => setTimeout(r, 2500));
      if (isPremiumEntitled()) {
        setPremiumActive(true);
        const res = await api.get("/iap/entitlement");
        const inner = res.data?.data;
        if (inner?.expiresAt) setServerExpiresAt(inner.expiresAt);
      } else {
        setError("No active subscription found for this account.");
      }
    } catch (e) {
      setError(e?.message || "Restore failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleManageSubscription = async () => {
    setError("");
    if (!Capacitor.isNativePlatform()) return;
    setBusy(true);
    try {
      await openSubscriptionManagement(getToken);
    } catch (e) {
      setError(e?.message || "Could not open subscription settings.");
    } finally {
      setBusy(false);
    }
  };

  const showNative = Capacitor.isNativePlatform();

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

        <p className="text-lg text-primary mb-5">{memberTierLabel}</p>

        <p className="text-sm text-secondary">
          Access Week/Month charts,
        </p>
        <p className="text-sm text-secondary mb-[50px]">
          exclusive tips & graphs
        </p>

        {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}

        <div className="flex flex-col gap-3 mb-[51px]">
          <button
            type="button"
            className="w-[159px] px-3 py-2 mx-auto bg-ivory rounded-md shadow-sm text-sm text-secondary flex items-center justify-center mb-[31px]"
            onClick={handleGoToTrends}
          >
            Go to Trend Analysis
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-[159px] px-3 py-2 mx-auto bg-white rounded-md shadow-sm text-sm text-secondary flex items-center justify-center"
          >
            Return to Home
          </button>
        </div>

        <div className="flex items-center gap-2 text-primary mb-[57px] justify-start px-10 text-xs">
          <Info className="w-3 h-3 text-primary shrink-0" />
          <span>
            Membership expires: <span className="font-medium">{expiryDisplay}</span>
          </span>
        </div>

        <div className="mb-[33px] space-y-2">
          {!premiumActive ? (
            <button
              type="button"
              disabled={busy}
              onClick={handleSubscribeOrRenew}
              className="w-[209px] px-3 py-2 mx-auto bg-[#FBB667] rounded-md shadow-sm text-sm text-secondary flex items-center justify-center mb-2"
            >
              {busy ? "Please wait..." : "Subscribe with App Store / Play"}
            </button>
          ) : (
            <button
              type="button"
              disabled={busy || !showNative}
              onClick={handleSubscribeOrRenew}
              className="w-[209px] px-3 py-2 mx-auto bg-white rounded-md shadow-sm text-sm flex items-center justify-center mb-2 text-primary border border-custom-16"
            >
              {busy ? "Please wait..." : "Renew subscription"}
            </button>
          )}
          {showNative && premiumActive ? (
            <button
              type="button"
              disabled={busy}
              onClick={handleManageSubscription}
              className="text-xs text-primary underline block mx-auto"
            >
              Manage in {Capacitor.getPlatform() === "ios" ? "App Store" : "Google Play"}
            </button>
          ) : null}
          {showNative ? (
            <button
              type="button"
              disabled={busy}
              onClick={handleRestore}
              className="text-xs text-secondary underline block mx-auto"
            >
              Restore purchases
            </button>
          ) : (
            <p className="text-xs text-custom-12 italic px-4">
              Purchases and renewals run inside the installed app (Capacitor).
            </p>
          )}
          <p className="text-xs text-custom-12 mt-2 italic">Renew within 7 days before expiry</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/setting/plan")}
          className="text-sm text-custom-12 underline mx-auto block mb-[94px]"
        >
          Check Subscription Status
        </button>
      </div>
    </div>
  );
};

export default SubScription;
