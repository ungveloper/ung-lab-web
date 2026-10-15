/** Pure helpers for the background-removal before/after comparison. */
export function clampComparison(value) {
  if (!Number.isFinite(value)) return 50;
  return Math.min(100, Math.max(0, Math.round(value)));
}

/** Map either mouse or touch PointerEvent.clientX to the visible image width. */
export function comparisonAtX(clientX, left, width) {
  if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(clientX) || !Number.isFinite(left)) return 50;
  return clampComparison((clientX - left) / width * 100);
}

/** Return null for unhandled keys, so keyboard scrolling still works elsewhere. */
export function comparisonByKey(current, key, shift = false) {
  if (key === "Home") return 0;
  if (key === "End") return 100;
  const step = shift ? 10 : 2;
  if (key === "ArrowLeft" || key === "ArrowDown") return clampComparison(current - step);
  if (key === "ArrowRight" || key === "ArrowUp") return clampComparison(current + step);
  return null;
}
