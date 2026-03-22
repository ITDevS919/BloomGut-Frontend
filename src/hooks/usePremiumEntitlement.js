/** Plan tier (free vs premium) is chosen via trend URL params, not subscription status. */
export default function usePremiumEntitlement() {
  return { premiumEntitled: true };
}
