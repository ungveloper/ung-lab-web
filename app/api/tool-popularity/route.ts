import { NextRequest, NextResponse } from "next/server";
import { tools } from "@/lib/tools";

const known = new Set(tools.map(tool => tool.slug));
const cookieName = "ung-lab-visited-tools";
const noCache = {"Cache-Control":"no-store, max-age=0"};

function config() {
  const base = process.env.SUPABASE_URL?.trim();
  const publicKey = (process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY)?.trim();
  if (!base || !publicKey) return null;
  try {
    const endpoint = new URL(base);
    if (endpoint.protocol !== "https:" || endpoint.username || endpoint.password) return null;
    return {endpoint, publicKey, secret:process.env.SUPABASE_ANALYTICS_SECRET_KEY?.trim()};
  } catch { return null; }
}
function headers(key:string):Record<string,string> {
  const values:Record<string,string> = {apikey:key,"Content-Type":"application/json"};
  if (key.split(".").length===3) values.Authorization = `Bearer ${key}`;
  return values;
}

export async function GET() {
  const c=config();
  if(!c) return NextResponse.json({source:"setup-required",counts:{}},{headers:noCache});
  try {
    const url=new URL("/rest/v1/tool_usage_daily", c.endpoint);
    const since=new Date(); since.setUTCDate(since.getUTCDate()-29);
    url.searchParams.set("select","tool_slug,visit_count");
    url.searchParams.set("used_on",`gte.${since.toISOString().slice(0,10)}`);
    url.searchParams.set("limit","1000");
    const res=await fetch(url,{headers:headers(c.publicKey),cache:"no-store",signal:AbortSignal.timeout(5000)});
    if (!res.ok) throw new Error(`Usage HTTP ${res.status}`);
    const rows:unknown=await res.json();
    if (!Array.isArray(rows)) throw new Error("Invalid popularity response");
    const counts:Record<string,number>={};
    for (const item of rows) {
      if(!item||typeof item!=="object")continue;
      const row=item as {tool_slug?:unknown;visit_count?:unknown};
      if(typeof row.tool_slug!=="string" || !known.has(row.tool_slug))continue;
      const n=Number(row.visit_count);
      if(Number.isSafeInteger(n)&&n>=0)counts[row.tool_slug]=(counts[row.tool_slug]??0)+n;
    }
    return NextResponse.json({source:"supabase",counts},{headers:noCache});
  } catch {
    return NextResponse.json({source:"unavailable",counts:{}},{headers:noCache});
  }
}

export async function POST(request:NextRequest) {
  const c=config();
  if(!c?.secret) return new NextResponse(null,{status:204,headers:{...noCache,"X-Analytics-Enabled":"0"}});
  const origin=request.headers.get("origin");
  const expectedOrigin=`${request.nextUrl.protocol}//${request.headers.get("x-forwarded-host") || request.headers.get("host") || request.nextUrl.host}`;
  if(!origin || origin!==expectedOrigin || request.headers.get("sec-fetch-site")==="cross-site")return NextResponse.json({error:"Forbidden"},{status:403,headers:noCache});
  if(!request.headers.get("content-type")?.startsWith("application/json"))return NextResponse.json({error:"Invalid content type"},{status:415,headers:noCache});
  if(Number(request.headers.get("content-length")??"0")>256)return NextResponse.json({error:"Request too large"},{status:413,headers:noCache});
  let slug:unknown;
  try { ({slug}=await request.json() as {slug?:unknown}); } catch {return NextResponse.json({error:"Invalid JSON"},{status:400,headers:noCache});}
  if(typeof slug!=="string" || !known.has(slug))return NextResponse.json({error:"Unknown tool"},{status:400,headers:noCache});
  const visited=(request.cookies.get(cookieName)?.value??"").split(".").filter(item=>known.has(item));
  if(visited.includes(slug))return new NextResponse(null,{status:204,headers:{...noCache,"X-Analytics-Enabled":"1"}});
  try {
    const url=new URL("/rest/v1/rpc/record_tool_visit",c.endpoint);
    const res=await fetch(url,{method:"POST",headers:headers(c.secret),body:JSON.stringify({p_slug:slug}),cache:"no-store",signal:AbortSignal.timeout(5000)});
    if(!res.ok)throw new Error("Usage write failed");
    const response=new NextResponse(null,{status:204,headers:{...noCache,"X-Analytics-Enabled":"1"}});
    response.cookies.set(cookieName,[...new Set([...visited,slug])].join("."),{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/"});
    return response;
  } catch {return NextResponse.json({error:"Usage temporarily unavailable"},{status:503,headers:noCache});}
}
