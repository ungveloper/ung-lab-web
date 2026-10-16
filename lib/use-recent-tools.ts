"use client";

import { useSyncExternalStore } from "react";
import { tools } from "@/lib/tools";
import {
  RECENT_TOOLS_KEY, RECENT_TOOLS_EVENT, parseRecentTools, updateRecentTools, removeRecentToolId, clearRecentToolIds,
} from "@/lib/recent-tools-state.mjs";

const knownSlugs = new Set(tools.map((item) => item.slug));
const serverSnapshot = "[]";

function snapshot(): string {
  try { return window.sessionStorage.getItem(RECENT_TOOLS_KEY) ?? serverSnapshot; }
  catch { return serverSnapshot; }
}
function subscribe(notify: () => void) {
  window.addEventListener(RECENT_TOOLS_EVENT, notify);
  window.addEventListener("storage", notify);
  return () => {
    window.removeEventListener(RECENT_TOOLS_EVENT, notify);
    window.removeEventListener("storage", notify);
  };
}
export function visitRecentTool(slug: string) {
  if (!knownSlugs.has(slug)) return;
  try {
    const old = parseRecentTools(snapshot(), knownSlugs);
    // Avoid needless storage events when only re-rendering the same page.
    if (old[0] === slug) return;
    window.sessionStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(updateRecentTools(old, slug, knownSlugs)));
    window.dispatchEvent(new Event(RECENT_TOOLS_EVENT));
  } catch { /* Recent links are optional and must never stop a file tool. */ }
}
function updateHistory(action: (items: string[]) => string[]) {
  try {
    const before=parseRecentTools(snapshot(),knownSlugs);
    const after=action(before);
    if (before.join("|") === after.join("|")) return;
    window.sessionStorage.setItem(RECENT_TOOLS_KEY,JSON.stringify(after));
    window.dispatchEvent(new Event(RECENT_TOOLS_EVENT));
  } catch { /* Storage may be unavailable. */ }
}
export function removeRecentTool(slug: string) {
  if(knownSlugs.has(slug))updateHistory(items=>removeRecentToolId(items,slug));
}
export function clearRecentTools() {updateHistory(clearRecentToolIds);}
export function useRecentTools() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => serverSnapshot);
  return parseRecentTools(raw, knownSlugs);
}
