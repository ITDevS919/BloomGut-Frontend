/** When true, all signed-in users are treated as premium (local dev / staging only). */
export function premiumDevUnlockEnabled() {
  return import.meta.env.VITE_PREMIUM_DEV_UNLOCK === "true";
}

export function getConfiguredPremiumSku() {
  const sku = import.meta.env.VITE_PLAY_BILLING_PREMIUM_SKU;
  return typeof sku === "string" && sku.trim() ? sku.trim() : "";
}
