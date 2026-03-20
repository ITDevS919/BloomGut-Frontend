const STORAGE_KEY = "premium_entitled_v1";

export const isPremiumEntitled = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

export const setPremiumEntitled = (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, value ? "true" : "false");
  } catch {
    // Ignore storage failures (e.g. privacy mode)
  }
};

export const getPremiumEntitlementSnapshot = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return { premiumEntitled: raw === "true" };
  } catch {
    return { premiumEntitled: false };
  }
};

