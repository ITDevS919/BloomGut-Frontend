import "cordova-plugin-purchase";
import { Capacitor } from "@capacitor/core";
import { createApiClient } from "@/lib/apiClient";
import { getIapUserId } from "@/lib/iap/iapUserId";
import { IAP_PRODUCT_ID } from "@/lib/iap/iapConfig";
import { setPremiumEntitled } from "@/lib/premiumEntitlement";

let initPromise = null;
let pendingPurchase = null;
let handlersAttached = false;

function getCdv() {
  return typeof window !== "undefined" ? window.CdvPurchase : null;
}

function getStore() {
  const Cdv = getCdv();
  return Cdv?.store;
}

function attachStoreHandlers(store) {
  if (handlersAttached) return;
  handlersAttached = true;
  store.when()
    .approved((transaction) => {
      transaction.verify();
    })
    .verified((receipt) => {
      receipt.finish();
      setPremiumEntitled(true);
      if (pendingPurchase) {
        pendingPurchase.resolve({ entitled: true });
        pendingPurchase = null;
      }
    })
    .unverified((detail) => {
      const msg =
        detail?.payload?.message ||
        detail?.payload?.code ||
        "Subscription could not be verified.";
      if (pendingPurchase) {
        pendingPurchase.reject(new Error(msg));
        pendingPurchase = null;
      }
    });
}

/**
 * @param {() => Promise<string|null|undefined>} getToken – Clerk session token
 */
export function initCdvPurchase(getToken) {
  if (!Capacitor.isNativePlatform()) {
    return Promise.resolve(null);
  }
  if (initPromise) return initPromise;

  const run = async () => {
    const Cdv = getCdv();
    const store = getStore();
    if (!Cdv || !store) {
      console.warn("CdvPurchase store not available");
      return null;
    }

    const api = createApiClient(getToken);

    store.validator = (body, callback) => {
      (async () => {
        try {
          const { data } = await api.post("/iap/validate", body, {
            validateStatus: () => true,
          });
          callback(data);
        } catch (e) {
          callback({
            ok: false,
            message: e?.message || "Validation request failed",
          });
        }
      })();
    };

    store.applicationUsername = () => getIapUserId() || undefined;

    const platform = Capacitor.getPlatform();
    const productPlatform =
      platform === "ios"
        ? Cdv.Platform.APPLE_APPSTORE
        : Cdv.Platform.GOOGLE_PLAY;

    store.register([
      {
        id: IAP_PRODUCT_ID,
        platform: productPlatform,
        type: Cdv.ProductType.PAID_SUBSCRIPTION,
      },
    ]);

    if (platform === "ios") {
      await store.initialize([
        {
          platform: Cdv.Platform.APPLE_APPSTORE,
          options: { needAppReceipt: true },
        },
      ]);
    } else {
      await store.initialize([{ platform: Cdv.Platform.GOOGLE_PLAY }]);
    }

    await new Promise((resolve) => {
      if (store.isReady) resolve();
      else store.ready(() => resolve());
    });

    attachStoreHandlers(store);

    return store;
  };

  initPromise = run().catch((e) => {
    initPromise = null;
    handlersAttached = false;
    throw e;
  });

  return initPromise;
}

export function isNativeIapAvailable() {
  return (
    typeof window !== "undefined" &&
    Capacitor.isNativePlatform() &&
    !!getStore()
  );
}

/**
 * @returns {Promise<{ entitled?: boolean }>}
 */
export async function purchasePremium(productId = IAP_PRODUCT_ID, getToken) {
  await initCdvPurchase(getToken);
  const store = getStore();
  if (!store) {
    throw new Error("In-app purchases are only available in the iOS/Android app.");
  }

  const product = store.get(productId);
  if (!product) {
    throw new Error(
      "Subscription product is not available yet. Check your store listing and product id, then try again."
    );
  }

  return new Promise((resolve, reject) => {
    pendingPurchase = { resolve, reject };
    const offer = product.getOffer?.();
    if (!offer) {
      pendingPurchase = null;
      reject(new Error("No active offer for this product."));
      return;
    }
    offer.order().then((err) => {
      if (!err) return;
      pendingPurchase = null;
      const Cdv = getCdv();
      if (err?.code === Cdv?.ErrorCode?.PAYMENT_CANCELLED) {
        reject(new Error("Purchase cancelled."));
      } else {
        reject(err);
      }
    });
  });
}

/**
 * Restore previous purchases (required on iOS; useful on Android).
 */
export async function restorePurchases(getToken) {
  await initCdvPurchase(getToken);
  const store = getStore();
  if (!store?.restorePurchases) return;
  const err = await store.restorePurchases();
  if (err) throw err;
}
