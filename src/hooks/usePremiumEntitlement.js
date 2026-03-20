import { useEffect, useState } from "react";
import { getPremiumEntitlementSnapshot } from "@/lib/premiumEntitlement";

const usePremiumEntitlement = () => {
  const [state, setState] = useState(getPremiumEntitlementSnapshot());

  useEffect(() => {
    const onStorage = (e) => {
      if (e?.key !== "premium_entitled_v1") return;
      setState(getPremiumEntitlementSnapshot());
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return state;
};

export default usePremiumEntitlement;

