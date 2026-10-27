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
  return <AppContentContainer as="main" className="guide-article-page">
    <Link className="guide-back" href="/guides"><ArrowLeft size={17}/> 가이드 목록</Link>
    <h1>{guide.title}</h1>
    <p className="guide-overview">{guide.overview}</p>
    <ol className="guide-steps">{guide.steps.map((step,index)=><li key={index}><span>{index+1}</span>{step}</li>)}</ol>
    <section className="guide-extra" aria-labelledby="guide-checks-title">
      <h2 id="guide-checks-title">확인할 점</h2>
      <ul>{guide.checks.map((text,index)=><li key={index}>{text}</li>)}</ul>
    </section>
    <section className="guide-extra" aria-labelledby="guide-errors-title">
      <h2 id="guide-errors-title">문제가 생길 때</h2>
      <ul>{guide.troubleshooting.map((text,index)=><li key={index}>{text}</li>)}</ul>
    </section>
    <Link className="guide-open-tool" href={`/tools/${guide.tool}`}>도구 열기 <ArrowUpRight size={18}/></Link>
  </AppContentContainer>;
}
export default function Page({params}:Props){return <Suspense fallback={<GuideRouteLoading/>}><GuidePageContent params={params}/></Suspense>}
