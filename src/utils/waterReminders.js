export const WATER_REMINDERS_STORAGE_KEY = "bloomgut_water_reminders";

/**
 * Load persisted water reminder settings from localStorage.
 * @returns {{ enabled: boolean, frequency: string, reminders: string[] } | null}
 */
export function loadWaterReminders() {
  try {
    const raw = localStorage.getItem(WATER_REMINDERS_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data && typeof data.enabled === "boolean" && Array.isArray(data.reminders)) {
      return {
        enabled: data.enabled,
        frequency: data.frequency === "2h" || data.frequency === "4h" ? data.frequency : "custom",
        reminders: data.reminders.filter((t) => typeof t === "string" && /^\d{2}:\d{2}$/.test(t)),
      };
    }
  } catch (e) {
    // ignore
  }
  return null;
}

/**
 * Persist water reminder settings to localStorage.
 */
export function saveWaterReminders(enabled, frequency, reminders) {
  try {
    localStorage.setItem(
      WATER_REMINDERS_STORAGE_KEY,
      JSON.stringify({ enabled, frequency, reminders })
    );
  } catch (e) {
    // ignore
  }
}
