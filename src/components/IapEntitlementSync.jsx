import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import useApiClient from "@/hooks/useApiClient";
import { setPremiumEntitled } from "@/lib/premiumEntitlement";
import { initCdvPurchase } from "@/lib/iap/cdvPurchase";
import { setIapUserId } from "@/lib/iap/iapUserId";

/**
 * Keeps Clerk user id on the IAP plugin for account-holding, syncs premium from MongoDB,
 * and initializes CdvPurchase on native builds.
 */
const IapEntitlementSync = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const api = useApiClient();

  useEffect(() => {
    setIapUserId(user?.id || null);
  }, [user?.id]);

  useEffect(() => {
    if (!isLoaded || !user) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/iap/entitlement");
        const inner = res.data?.data;
        if (!cancelled && inner?.premiumActive) setPremiumEntitled(true);
      } catch {
        // unsigned-in or network; ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, user, api]);

  useEffect(() => {
    if (!isLoaded || !user) return undefined;
    let cancelled = false;
    initCdvPurchase(getToken).catch(() => {
      if (!cancelled) {
        /* native-only; web skips */
      }
    });
    return () => {
      cancelled = true;
    };
  }, [isLoaded, user, getToken]);

  return null;
};

export default IapEntitlementSync;
