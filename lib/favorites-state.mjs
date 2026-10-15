/** Session-only favorites. Never persist files or document metadata. */
export const FAVORITES_KEY = "ung-lab:favorites:v1";
export const FAVORITES_EVENT = "ung-lab:favorites-change";

/**
 * @param {string|null} raw
 * @param {ReadonlySet<string>} validSlugs
 * @returns {string[]}
 */
export function parseFavoriteIds(raw, validSlugs) {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return [...new Set(value.filter((slug) => typeof slug === "string" && validSlugs.has(slug)))];
  } catch {
    return [];
  }
}

/**
 * @param {readonly string[]} ids
 * @param {string} slug
 * @param {ReadonlySet<string>} validSlugs
 * @returns {string[]}
 */
export function toggleFavoriteId(ids, slug, validSlugs) {
  const current = parseFavoriteIds(JSON.stringify(ids), validSlugs);
  if (!validSlugs.has(slug)) return current;
  return current.includes(slug) ? current.filter((id) => id !== slug) : [...current, slug];
}
