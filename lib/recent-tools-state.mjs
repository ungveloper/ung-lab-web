/** Session-only recent tools. Never persist file names or uploaded data. */
export const RECENT_TOOLS_KEY = "ung-lab:recent-tools:v1";
export const RECENT_TOOLS_EVENT = "ung-lab:recent-tools-changed";
export const TOOL_RETURN_KEY = "ung-lab:tool-return:v1";
export const MAX_RECENT_TOOLS = 8;

/** @param {string|null} raw @param {Set<string>} allowed */
export function parseRecentTools(raw, allowed) {
  try {
    const value = JSON.parse(raw ?? "[]");
    if (!Array.isArray(value)) return [];
    const seen = new Set();
    return value.filter((slug) => {
      if (typeof slug !== "string" || !allowed.has(slug) || seen.has(slug)) return false;
      seen.add(slug);
      return true;
    }).slice(0, MAX_RECENT_TOOLS);
  } catch { return []; }
}
/** @param {string[]} current @param {string} slug @param {Set<string>} allowed */
export function updateRecentTools(current, slug, allowed) {
  if (!allowed.has(slug)) return current;
  return [slug, ...current.filter((item) => item !== slug)].slice(0, MAX_RECENT_TOOLS);
}
/** @param {string[]} current @param {string} slug */
export function removeRecentToolId(current, slug) {
  return current.filter(item => item !== slug);
}
/** @param {string[]} current */
export function clearRecentToolIds(current) { return current.length ? [] : current; }
/** @param {string} slug @param {string} target */
export function safeReturnTarget(slug, target) {
  const safeSlug = /^[a-z0-9-]+$/.test(slug);
  if (!safeSlug) return null;
  if (target === "/?view=all") return "/tools";
  if (target === "/" || target === "/tools") return target;
  if (/^\/tools\/[a-z0-9-]+$/.test(target) && target !== `/tools/${slug}`) return target;
  return null;
}
/** @param {string} slug @param {string} target */
export function saveToolReturn(slug, target) {
  const safe = safeReturnTarget(slug, target);
  if (!safe) return;
  try {
    const previous = JSON.parse(window.sessionStorage.getItem(TOOL_RETURN_KEY) ?? "{}");
    const origins = previous && typeof previous === "object" && !Array.isArray(previous) ? previous : {};
    origins[slug] = safe;
    window.sessionStorage.setItem(TOOL_RETURN_KEY, JSON.stringify(origins));
  } catch { /* Storage may be blocked. */ }
}
/** @param {string} slug */
export function readToolReturn(slug) {
  try {
    const origins = JSON.parse(window.sessionStorage.getItem(TOOL_RETURN_KEY) ?? "{}");
    if (origins && typeof origins === "object" && !Array.isArray(origins) && typeof origins[slug] === "string") {
      return safeReturnTarget(slug, origins[slug]) ?? "/";
    }
  } catch { /* Invalid navigation history. */ }
  return "/";
}
