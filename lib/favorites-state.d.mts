export const FAVORITES_KEY: string;
export const FAVORITES_EVENT: string;
export function parseFavoriteIds(raw: string | null, validSlugs: ReadonlySet<string>): string[];
export function toggleFavoriteId(ids: readonly string[], slug: string, validSlugs: ReadonlySet<string>): string[];
