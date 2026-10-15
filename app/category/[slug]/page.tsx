import {Suspense} from "react";
import Link from "next/link";import {notFound} from "next/navigation";import type {Metadata} from "next";import {categories,tools,type Category} from "@/lib/tools";import {ToolIcon} from "@/components/tool-icon";import {ArrowRight} from "lucide-react";
export function generateStaticParams(){return Object.keys(categories).map(slug=>({slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;if(!Object.hasOwn(categories,slug))return {};const cat=categories[slug as Category];return {title:`${cat.name} 온라인 도구`,description:cat.description,alternates:{canonical:`/category/${slug}`}}}
async function CategoryPageContent({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!Object.hasOwn(categories,slug))notFound();const c=categories[slug as Category];return <main className="content-page"><Link href="/">← 전체 도구</Link><h1>{c.name} 온라인 도구</h1><p>{c.description}</p><div className="guide-grid">{tools.filter(t=>t.category===slug).map(t=><Link href={`/tools/${t.slug}`} className="guide-card" key={t.slug}><h3><ToolIcon name={t.icon}/> {t.title} <ArrowRight size={15}/></h3><p>{t.subtitle}</p></Link>)}</div></main>}


// Share the category shell across links; resolve params only in this boundary.
export default function CategoryPage({params}:{params:Promise<{slug:string}>}) {
  return (
    <Suspense fallback={<main className="content-page" role="status" aria-busy="true"><h1>카테고리를 불러오는 중입니다…</h1></main>}>
      <CategoryPageContent params={params}/>
    </Suspense>
  );
}
