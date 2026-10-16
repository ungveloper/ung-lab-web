import {NextRequest,NextResponse} from "next/server";
import {tools} from "@/lib/tools";
import {choosePromptQuestions,DEFAULT_PROMPTS} from "@/lib/tool-prompts.mjs";

const allowed=new Set(tools.map(tool=>tool.slug));
const cacheHeaders={"Cache-Control":"no-store, max-age=0"};
const cookieName="ung-lab-counted-prompts";
function settings(){
  const base=process.env.SUPABASE_URL?.trim();
  const pub=(process.env.SUPABASE_PUBLISHABLE_KEY||process.env.SUPABASE_ANON_KEY)?.trim();
  if(!base||!pub)return null;
  try{const url=new URL(base);if(url.protocol!=="https:"||url.username||url.password)return null;
    return {url,pub,secret:process.env.SUPABASE_ANALYTICS_SECRET_KEY?.trim()};
  }catch{return null}
}
function headers(key:string){const result:Record<string,string>={apikey:key,"Content-Type":"application/json"};if(key.split(".").length===3)result.Authorization=`Bearer ${key}`;return result;}
export async function GET(){
  const fallback=choosePromptQuestions(DEFAULT_PROMPTS);
  const config=settings();if(!config)return NextResponse.json({source:"local",questions:fallback},{headers:cacheHeaders});
  try{
    const url=new URL("/rest/v1/tool_prompt_options",config.url);
    url.searchParams.set("select","tool_slug,question,is_default,display_order,question_count");url.searchParams.set("is_enabled","eq.true");url.searchParams.set("limit","40");
    const response=await fetch(url,{headers:headers(config.pub),cache:"no-store",signal:AbortSignal.timeout(5000)});
    if(!response.ok)throw new Error("Prompt lookup unavailable");
    const rows:unknown=await response.json();if(!Array.isArray(rows))throw new Error("Invalid prompts");
    const valid=rows.filter((row):row is {tool_slug:string;question:string;is_default:boolean;display_order:number;question_count:number}=>Boolean(row)&&typeof row==="object"&&"tool_slug" in row&&typeof row.tool_slug==="string"&&allowed.has(row.tool_slug))
      .map(row=>({slug:row.tool_slug,question:row.question,is_default:row.is_default,display_order:row.display_order,question_count:row.question_count}));
    const ranked=choosePromptQuestions(valid);
    return NextResponse.json({source:"supabase",questions:ranked},{headers:cacheHeaders});
  }catch{return NextResponse.json({source:"fallback",questions:fallback},{headers:cacheHeaders})}
}
export async function POST(request:NextRequest){
  const config=settings();if(!config?.secret)return new NextResponse(null,{status:204,headers:cacheHeaders});
  const origin=request.headers.get("origin");
  const expected=`${request.nextUrl.protocol}//${request.headers.get("x-forwarded-host")||request.headers.get("host")||request.nextUrl.host}`;
  if(!origin||origin!==expected||request.headers.get("sec-fetch-site")==="cross-site")return new NextResponse(null,{status:403});
  if(!request.headers.get("content-type")?.startsWith("application/json"))return new NextResponse(null,{status:415});
  if(Number(request.headers.get("content-length")??"0")>128)return new NextResponse(null,{status:413});
  let slug:unknown;try{({slug}=await request.json() as {slug?:unknown})}catch{return new NextResponse(null,{status:400})}
  if(typeof slug!=="string"||!allowed.has(slug))return new NextResponse(null,{status:400});
  const visited=(request.cookies.get(cookieName)?.value??"").split(".").filter(item=>allowed.has(item));
  if(visited.includes(slug))return new NextResponse(null,{status:204,headers:cacheHeaders});
  try{
    const url=new URL("/rest/v1/rpc/record_tool_question",config.url);
    const response=await fetch(url,{method:"POST",headers:headers(config.secret),body:JSON.stringify({p_slug:slug}),cache:"no-store",signal:AbortSignal.timeout(5000)});
    if(!response.ok)throw new Error(`Question count rejected: ${response.status}`);
    const output=new NextResponse(null,{status:204,headers:cacheHeaders});
    output.cookies.set(cookieName,[...new Set([...visited,slug])].join("."),{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/"});
    return output;
  }catch{return new NextResponse(null,{status:503,headers:cacheHeaders})}
}
