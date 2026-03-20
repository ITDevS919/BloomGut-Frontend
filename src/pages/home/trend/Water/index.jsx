import { useSearchParams } from "react-router-dom";
import Free from "./Free";
import Premium from "./Premium";
import usePremiumEntitlement from "@/hooks/usePremiumEntitlement";

const Water = () => {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");
  const { premiumEntitled } = usePremiumEntitlement();

  const wantsPremium =
    plan === "premium" || plan === "intermediate" || plan === "pro";

  return <>{wantsPremium && premiumEntitled ? <Premium /> : <Free />}</>;
};

export default Water;
