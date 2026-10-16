import {NextResponse} from "next/server";
import {getToolCatalog} from "@/lib/tool-catalog";

export async function GET() {
  const catalog = await getToolCatalog();
  return NextResponse.json(catalog, {headers: {"Cache-Control": "no-store, max-age=0", "X-Content-Type-Options": "nosniff"}});
}
