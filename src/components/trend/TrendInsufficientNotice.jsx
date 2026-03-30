/**
 * Unified copy for Trend Analysis SRS when record_days is below the view threshold.
 */
export const TREND_INSUFFICIENT_MESSAGE = "Insufficient data, continue recording";

export default function TrendInsufficientNotice({ className = "" }) {
  return (
    <div
      className={`rounded-[10px] border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900 ${className}`}
      role="status"
    >
      {TREND_INSUFFICIENT_MESSAGE}
    </div>
  );
}
