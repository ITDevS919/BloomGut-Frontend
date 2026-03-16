// Utility to format dates using the browser's local time (with offset)
// Example output: 2026-03-15T10:30:45.123+08:00
export function toLocalISOString(input) {
  if (!input) return undefined;

  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return undefined;

  const pad = (value, length = 2) => String(value).padStart(length, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const milliseconds = pad(date.getMilliseconds(), 3);

  const offsetMinutes = date.getTimezoneOffset();
  const sign = offsetMinutes <= 0 ? "+" : "-";
  const absMinutes = Math.abs(offsetMinutes);
  const offsetHours = pad(Math.floor(absMinutes / 60));
  const offsetMins = pad(absMinutes % 60);

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${sign}${offsetHours}:${offsetMins}`;
}

