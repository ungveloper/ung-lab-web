import Link from "next/link";
import {notFound} from "next/navigation";
import {Suspense} from "react";
import type {Metadata} from "next";
import {ArrowLeft,ArrowUpRight} from "lucide-react";
import {guides} from "@/lib/guides";
import {GuideShell} from "@/components/guide-shell";
import {AppContentContainer} from "@/components/app-content-container";

type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return guides.map(guide=>({slug:guide.slug}))}
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {slug}=await params;const guide=guides.find(item=>item.slug===slug);
  return guide?{title:guide.title,description:guide.steps.join(" "),alternates:{canonical:`/guides/${slug}`}}:{};
}
async function GuidePageContent({params}:Props){
  const {slug}=await params;const guide=guides.find(item=>item.slug===slug);if(!guide)notFound();
  return <GuideShell><AppContentContainer as="main" className="guide-article-page">
    <Link className="guide-back" href="/guides"><ArrowLeft size={17}/> 가이드 목록</Link>
    <h1>{guide.title}</h1>
    <ol className="guide-steps">{guide.steps.map((step,index)=><li key={index}><span>{index+1}</span>{step}</li>)}</ol>
    <p className="guide-tip">{guide.tip}</p>
    <Link className="guide-open-tool" href={`/tools/${guide.tool}`}>도구 열기 <ArrowUpRight size={18}/></Link>
  </AppContentContainer></GuideShell>;
}
export default function Page({params}:Props){return <Suspense fallback={<main className="tool-app-loading" role="status" aria-busy="true"><span className="tool-app-loading-spinner"/><span className="sr-only">가이드 불러오는 중</span></main>}><GuidePageContent params={params}/></Suspense>}
