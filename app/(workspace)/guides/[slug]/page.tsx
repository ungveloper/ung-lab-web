import Link from "next/link";
import {notFound} from "next/navigation";
import {Suspense} from "react";
import type {Metadata} from "next";
import {ArrowUpRight} from "lucide-react";
import {guides} from "@/lib/guides";
import {GuideRouteLoading} from "@/components/guide-route-loading";
import {PageFrame} from "@/app/_components/common/page-frame";
import {PageBackLink} from "@/app/_components/common/page-back-link";
import {PageHeader} from "@/app/_components/common/page-header";
import {GuideSteps, GuideInfoSection} from "@/app/_components/guides/guide-steps";

type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return guides.map(guide=>({slug:guide.slug}))}
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {slug}=await params;const guide=guides.find(item=>item.slug===slug);
  return guide?{title:guide.title,description:guide.steps.join(" "),alternates:{canonical:`/guides/${slug}`}}:{};
}
async function GuidePageContent({params}:Props){
  const {slug}=await params;const guide=guides.find(item=>item.slug===slug);if(!guide)notFound();
  return <PageFrame className="guide-article-page">
    <PageBackLink href="/guides">가이드 목록</PageBackLink>
    <PageHeader title={guide.title} description={guide.overview}/>
    <GuideSteps steps={guide.steps}/>
    <GuideInfoSection id="guide-checks-title" title="확인할 점" items={guide.checks}/>
    <GuideInfoSection id="guide-errors-title" title="문제가 생길 때" items={guide.troubleshooting}/>
    <Link className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-[15px] font-bold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500" href={`/tools/${guide.tool}`}>
      도구 열기 <ArrowUpRight size={18}/>
    </Link>
  </PageFrame>;
}
export default function Page({params}:Props){return <Suspense fallback={<GuideRouteLoading/>}><GuidePageContent params={params}/></Suspense>}
