import Link from "next/link";
import {notFound} from "next/navigation";
import {Suspense} from "react";
import type {Metadata} from "next";
import {ArrowLeft,ArrowUpRight} from "lucide-react";
import {guides} from "@/lib/guides";
import {GuideRouteLoading} from "@/components/guide-route-loading";
import {AppContentContainer} from "@/components/app-content-container";

type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return guides.map(guide=>({slug:guide.slug}))}
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {slug}=await params;const guide=guides.find(item=>item.slug===slug);
  return guide?{title:guide.title,description:guide.steps.join(" "),alternates:{canonical:`/guides/${slug}`}}:{};
}
async function GuidePageContent({params}:Props){
  const {slug}=await params;const guide=guides.find(item=>item.slug===slug);if(!guide)notFound();
  return <AppContentContainer as="main" className={`guide-article-page [margin:0_auto] [padding:42px_0_130px] [&_h1]:text-[clamp(25px,2.6vw,33px)] [&_h1]:[margin:0_0_26px] [&_h1]:tracking-[-.05em] max-w-[none] max-[720px]:[padding:25px_0_100px] [.workspace-page-body>__&]:[flex:0_0_auto]`}>
    <Link className={`guide-back inline-flex items-center gap-2 text-[#64748b] text-sm mb-[25px]`} href="/guides"><ArrowLeft size={17}/> 가이드 목록</Link>
    <h1>{guide.title}</h1>
    <p className={`guide-overview [margin:16px_0_24px] leading-[1.75] text-[#43516a]`}>{guide.overview}</p>
    <ol className={`guide-steps [counter-reset:none] [list-style:none] p-0 [margin:0_0_20px] grid gap-[11px] [&_li]:flex [&_li]:items-center [&_li]:gap-4 [&_li]:[padding:16px_19px] [&_li]:[border:1px_solid_#e7eaf0] [&_li]:rounded-[12px] [&_li]:text-[15px] [&_li_span]:grid [&_li_span]:[place-items:center] [&_li_span]:w-[30px] [&_li_span]:h-[30px] [&_li_span]:[flex:0_0_30px] [&_li_span]:bg-[#eff4ff] [&_li_span]:rounded-full [&_li_span]:text-[#2463eb] [&_li_span]:font-[750] [&_li_span]:text-[13px]`}>{guide.steps.map((step,index)=><li key={index}><span>{index+1}</span>{step}</li>)}</ol>
    <section className={`guide-extra [margin:16px_0_24px] leading-[1.75] text-[#43516a] [&_h2]:text-[19px] [&_h2]:text-[#253044] [&_h2]:[margin:0_0_11px] [&_ul]:pl-[23px] [&_ul]:[margin:0_0_14px] [&_li+li]:mt-2`} aria-labelledby="guide-checks-title">
      <h2 id="guide-checks-title">확인할 점</h2>
      <ul>{guide.checks.map((text,index)=><li key={index}>{text}</li>)}</ul>
    </section>
    <section className={`guide-extra [margin:16px_0_24px] leading-[1.75] text-[#43516a] [&_h2]:text-[19px] [&_h2]:text-[#253044] [&_h2]:[margin:0_0_11px] [&_ul]:pl-[23px] [&_ul]:[margin:0_0_14px] [&_li+li]:mt-2`} aria-labelledby="guide-errors-title">
      <h2 id="guide-errors-title">문제가 생길 때</h2>
      <ul>{guide.troubleshooting.map((text,index)=><li key={index}>{text}</li>)}</ul>
    </section>
    <Link className={`guide-open-tool inline-flex gap-[10px] items-center [padding:13px_22px] bg-[#2563eb] text-[#fff] rounded-[11px] font-bold hover:bg-[#1d4ed8] hover:text-[#fff]`} href={`/tools/${guide.tool}`}>도구 열기 <ArrowUpRight size={18}/></Link>
  </AppContentContainer>;
}
export default function Page({params}:Props){return <Suspense fallback={<GuideRouteLoading/>}><GuidePageContent params={params}/></Suspense>}
