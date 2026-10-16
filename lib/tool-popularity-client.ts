"use client";

/** One optional aggregate count per tool/browser session; never includes files or chat text. */
const sessionKey = "ung-lab:counted-tool-visits:v1";
const pending = new Set<string>();
export async function recordToolVisit(slug: string) {
  if (!/^[a-z0-9-]{2,64}$/.test(slug) || pending.has(slug)) return;
  try {
    const stored = JSON.parse(window.sessionStorage.getItem(sessionKey) ?? "[]") as unknown;
    const counted = Array.isArray(stored) ? stored.filter((x): x is string => typeof x === "string") : [];
    if (counted.includes(slug)) return;
    pending.add(slug);
    const response = await fetch("/api/tool-popularity", {
      method: "POST", headers: {"Content-Type":"application/json"},
      body: JSON.stringify({slug}), credentials: "same-origin", keepalive: true,
    });
    if (response.ok && response.headers.get("X-Analytics-Enabled") === "1") {
      window.sessionStorage.setItem(sessionKey, JSON.stringify([...new Set([...counted,slug])]));
    }
  } catch { /* Optional analytics must never interrupt tools. */ }
  finally { pending.delete(slug); }
}
