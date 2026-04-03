import { useAuth } from "@clerk/clerk-react";
import { useCallback, useEffect, useState } from "react";
import {
  getPlayBillingStatus,
  postPlayBillingAcknowledge,
} from "@/api/http";
import useApiClient from "@/hooks/useApiClient";
import {
  getPlayDigitalGoodsService,
  listPlayPurchases,
} from "@/lib/playBilling";
import {
  getConfiguredPremiumSku,
  premiumDevUnlockEnabled,
} from "@/lib/premiumEntitlement";

export default function usePremiumEntitlement() {
  const { isSignedIn, isLoaded } = useAuth();
  const api = useApiClient();
  const [premiumEntitled, setPremiumEntitled] = useState(() =>
    premiumDevUnlockEnabled()
  );
  const [isLoadingEntitlement, setIsLoadingEntitlement] = useState(
    () => !premiumDevUnlockEnabled()
  );

  const refreshEntitlement = useCallback(async () => {
    if (premiumDevUnlockEnabled()) {
      setPremiumEntitled(true);
      setIsLoadingEntitlement(false);
      return { entitled: true };
    }

    if (!isLoaded) return { entitled: false };

    if (!isSignedIn) {
      setPremiumEntitled(false);
      setIsLoadingEntitlement(false);
      return { entitled: false };
    }

    const sku = getConfiguredPremiumSku();

    try {
      setIsLoadingEntitlement(true);

      const service = await getPlayDigitalGoodsService();
      if (service && sku) {
        const purchases = await listPlayPurchases();
        const match = purchases.find((p) => p.itemId === sku);
        if (match?.purchaseToken) {
          try {
            await postPlayBillingAcknowledge(api, {
              purchaseToken: match.purchaseToken,
              sku: match.itemId,
            });
          } catch (err) {
            console.warn("Play Billing sync (acknowledge) failed:", err);
          }
        }
      }

      const res = await getPlayBillingStatus(api);
      const entitled = !!res?.data?.data?.entitled;
      setPremiumEntitled(entitled);
      return { entitled };
    } catch (err) {
      console.warn("Premium entitlement check failed:", err);
      setPremiumEntitled(false);
      return { entitled: false };
    } finally {
      setIsLoadingEntitlement(false);
    }
  }, [api, isSignedIn, isLoaded]);

  useEffect(() => {
    refreshEntitlement();
  }, [refreshEntitlement]);

  return {
    premiumEntitled,
    isLoadingEntitlement,
    refreshEntitlement,
  };
}
