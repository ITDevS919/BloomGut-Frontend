import { useSearchParams } from "react-router-dom";
import Free from "./Free";
import Premium from "./Premium";
import usePremiumEntitlement from "@/hooks/usePremiumEntitlement";
import Intermediate from "./Intermediate";

const Bowel = () => {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");
  const { premiumEntitled, isLoadingEntitlement } = usePremiumEntitlement();

  const wantsPremium =
    plan === "premium" || plan === "intermediate" || plan === "pro";

  if (wantsPremium && isLoadingEntitlement) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-secondary text-sm font-['Noto_Sans_TC',sans-serif]">
        Loading your plan…
      </div>
    );
  }

  return <>{wantsPremium && premiumEntitled ? <Premium /> : <Intermediate />}</>;
};

export default Bowel;
