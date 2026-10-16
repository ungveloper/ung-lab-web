import {tools, type Tool} from "@/lib/tools";

type CatalogRow = {
  slug: string; title: string; subtitle: string; category: string; tags: unknown;
  aliases: unknown; icon: string; featured: boolean; steps: unknown;
  formats: string; details: unknown; display_order: number; is_active: boolean;
};
export type CatalogSource = "supabase" | "setup-required" | "unavailable";
export type ToolCatalogResult = { tools: Tool[]; source: CatalogSource };
const localMap = new Map(tools.map(item => [item.slug, item]));
const knownIcons = new Set(tools.map(item => item.icon));

function stringArray(input: unknown, fallback: string[]): string[] {
  return Array.isArray(input) && input.every(item => typeof item === "string")
    ? input.slice(0, 30).map(item => String(item).slice(0, 200)) : fallback;
}
function toTool(row: CatalogRow): Tool | null {
  // The DB may edit display metadata, but executable routes remain allowlisted by the deployed code.
  const local = localMap.get(row.slug);
  if (!local || !row.is_active || !["pdf", "image", "document"].includes(row.category)) return null;
  const steps = stringArray(row.steps, local.steps);
  return {
    ...local,
    title: typeof row.title === "string" && row.title.trim() ? row.title.slice(0, 150) : local.title,
    subtitle: typeof row.subtitle === "string" ? row.subtitle.slice(0, 300) : local.subtitle,
    tags: stringArray(row.tags, local.tags),
    aliases: stringArray(row.aliases, local.aliases),
    category: row.category as Tool["category"],
    icon: knownIcons.has(row.icon) ? row.icon : local.icon,
    featured: Boolean(row.featured),
    steps: steps.length === 3 ? steps as Tool["steps"] : local.steps,
    formats: typeof row.formats === "string" ? row.formats.slice(0, 400) : local.formats,
    details: stringArray(row.details, local.details),
  };
}

/** Server-only Supabase REST access; no service_role key or user files are used. */
export async function getToolCatalog(): Promise<ToolCatalogResult> {
  const endpoint = process.env.SUPABASE_URL?.trim();
  const anon = (process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY)?.trim();
  if (!endpoint || !anon) return {tools, source: "setup-required"};
  try {
    const base = new URL(endpoint);
    if (base.protocol !== "https:" || base.username || base.password) throw new Error("Invalid Supabase URL");
    const url = new URL("/rest/v1/tool_catalog", base);
    url.searchParams.set("select", "slug,title,subtitle,category,tags,aliases,icon,featured,steps,formats,details,display_order,is_active");
    url.searchParams.set("is_active", "eq.true");
    url.searchParams.set("order", "display_order.asc");
    const headers: Record<string,string> = {apikey: anon, Accept: "application/json"};
    // Legacy anon keys are JWTs; new sb_publishable_* keys are not JWTs.
    if (anon.split(".").length === 3) headers.Authorization = `Bearer ${anon}`;
    const res = await fetch(url, {headers, cache: "no-store", signal: AbortSignal.timeout(7000)});
    if (!res.ok) throw new Error(`Supabase HTTP ${res.status}`);
    const json: unknown = await res.json();
    if (!Array.isArray(json)) throw new Error("Invalid catalog response");
    const parsed: Tool[] = json.slice(0, 100).flatMap(row => {
      const item = row && typeof row === "object" ? toTool(row as CatalogRow) : null;
      return item ? [item] : [];
    });
    // An empty catalog is valid when all tools are disabled in the database.
    return {tools: parsed, source: "supabase"};
  } catch (error) {
    console.error("[tool-catalog] Supabase read failed; using checked-in bootstrap catalog", error instanceof Error ? error.message : "unknown");
    return {tools, source: "unavailable"};
  }
}
export async function getCatalogTool(slug: string): Promise<Tool|undefined> {
  return (await getToolCatalog()).tools.find(item => item.slug === slug);
}
