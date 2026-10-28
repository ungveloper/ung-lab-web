import {Suspense} from "react";
import Link from "next/link";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import {categories,type Category} from "@/lib/tools";
import {getToolCatalog} from "@/lib/tool-catalog";
import {ToolIcon} from "@/components/tool-icon";
import {FavoriteButton} from "@/components/favorite-button";
import {ArrowRight} from "lucide-react";
type PageProps={params:Promise<{slug:string}>};
export function generateStaticParams(){return Object.keys(categories).map(slug=>({slug}))}
export async function generateMetadata({params}:PageProps):Promise<Metadata>{const {slug}=await params;if(!Object.hasOwn(categories,slug))return {};const cat=categories[slug as Category];return {title:`${cat.name} 온라인 도구`,description:cat.description,alternates:{canonical:`/category/${slug}`}}}
async function CategoryPageContent({params}:PageProps){const {slug}=await params;if(!Object.hasOwn(categories,slug))notFound();const c=categories[slug as Category];const {tools}=await getToolCatalog();return <main className={`content-page max-w-[850px] [margin:65px_auto_100px] [padding:0_25px] [&_h1]:text-[37px] [&_h2]:text-[21px] [&_h2]:mt-[34px] [&_p]:text-[#66768c] [&_p]:leading-[1.95] [&_li]:text-[#66768c] [&_li]:leading-[1.95] [&_a]:text-[#2563eb]`}><Link href="/">← 전체 도구</Link><h1>{c.name} 온라인 도구</h1><p>{c.description}</p><div className={`guide-grid [.content-page_&]:grid [.content-page_&]:gap-3`}>{tools.filter(t=>t.category===slug).map(t=><div className={`favorite-category-card relative min-w-0`} key={t.slug}><Link href={`/tools/${t.slug}`} className={`guide-card p-[22px] [border:1px_solid_#e6ebf3] rounded-[12px] [&_h3]:[margin:0_0_8px] [&_p]:m-0 [&_p]:text-[15px] [.favorite-category-card_&]:block [.favorite-category-card_&]:pr-[53px]`}><h3><ToolIcon name={t.icon}/>{t.title}<ArrowRight size={15}/></h3><p>{t.subtitle}</p></Link><FavoriteButton slug={t.slug} title={t.title} variant="compact"/></div>)}</div></main>}
export default function CategoryPage({params}:PageProps){return <Suspense fallback={<main className={`content-page max-w-[850px] [margin:65px_auto_100px] [padding:0_25px] [&_h1]:text-[37px] [&_h2]:text-[21px] [&_h2]:mt-[34px] [&_p]:text-[#66768c] [&_p]:leading-[1.95] [&_li]:text-[#66768c] [&_li]:leading-[1.95] [&_a]:text-[#2563eb]`} role="status" aria-busy="true"><h1>카테고리를 불러오는 중입니다…</h1></main>}><CategoryPageContent params={params}/></Suspense>}
