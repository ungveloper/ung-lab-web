"use client";

import { useSyncExternalStore } from "react";
import { tools } from "@/lib/tools";
import {
  FAVORITES_EVENT,
  FAVORITES_KEY,
  parseFavoriteIds,
  toggleFavoriteId,
} from "@/lib/favorites-state.mjs";

const knownToolSlugs = new Set(tools.map((tool) => tool.slug));
const emptySnapshot = "[]";

function getSnapshot(): string {
  try {
    return window.sessionStorage.getItem(FAVORITES_KEY) ?? emptySnapshot;
  } catch {
    return emptySnapshot;
  }
}

function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener(FAVORITES_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(FAVORITES_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function useFavorites() {
  // Stable serialized string avoids React 19's unstable getSnapshot warning.
  // Server and first hydration both start empty; the client then reads this tab's session.
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => emptySnapshot);
  const favoriteIds = parseFavoriteIds(raw, knownToolSlugs);

  function toggleFavorite(slug: string) {
    if (!knownToolSlugs.has(slug)) return;
    try {
      const current = parseFavoriteIds(getSnapshot(), knownToolSlugs);
      const next = toggleFavoriteId(current, slug, knownToolSlugs);
      window.sessionStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      // The native storage event does not fire in the same document.
      window.dispatchEvent(new Event(FAVORITES_EVENT));
    } catch {
      // Private-mode storage restrictions should never break file tools.
    }
  }

  return { favoriteIds, toggleFavorite };
}
