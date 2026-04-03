const PLAY_METHOD = "https://play.google.com/billing";

export function isPlayBillingApiAvailable() {
  return typeof window !== "undefined" && "getDigitalGoodsService" in window;
}

export async function getPlayDigitalGoodsService() {
  if (!isPlayBillingApiAvailable()) return null;
  try {
    return await window.getDigitalGoodsService(PLAY_METHOD);
  } catch {
    return null;
  }
}

/** @param {string} sku Play Console product or subscription ID */
export async function getSkuDetails(sku) {
  if (!sku) return null;
  const service = await getPlayDigitalGoodsService();
  if (!service) return null;
  const items = await service.getDetails([sku]);
  return items?.[0] ?? null;
}

export async function listPlayPurchases() {
  const service = await getPlayDigitalGoodsService();
  if (!service) return [];
  return service.listPurchases();
}

/**
 * Opens the Play Store purchase sheet (TWA with Play Billing enabled).
 * @returns {Promise<{ response: PaymentResponse; purchaseToken: string }>}
 */
export async function requestPlayPurchase(sku) {
  if (!sku) throw new Error("Missing Play product SKU");

  const paymentMethods = [
    {
      supportedMethods: PLAY_METHOD,
      data: { sku },
    },
  ];

  const paymentDetails = {
    total: {
      label: "Premium",
      amount: { currency: "USD", value: "0" },
    },
  };

  const request = new PaymentRequest(paymentMethods, paymentDetails);
  const response = await request.show();
  const purchaseToken = response.details?.purchaseToken;
  if (!purchaseToken) {
    await response.complete("fail");
    throw new Error("Play Billing did not return a purchase token");
  }
  return { response, purchaseToken };
}
