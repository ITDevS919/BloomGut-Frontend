/** Premium is not gated by a store subscription; plan selection is via URL only. */
export const isPremiumEntitled = () => true;

export const setPremiumEntitled = () => {};

export const getPremiumEntitlementSnapshot = () => ({ premiumEntitled: true });
