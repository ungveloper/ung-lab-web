import {notFound} from "next/navigation";
import Link from "next/link";
import {Suspense} from "react";
import {ChevronRight,ShieldCheck,FileCheck2,ArrowRight} from "lucide-react";
import type {Metadata} from "next";
import {categories,tools} from "@/lib/tools";
import {getCatalogTool,getToolCatalog} from "@/lib/tool-catalog";
import {ToolIcon} from "@/components/tool-icon";
import {ToolWorkspace} from "@/components/tool-workspace";
import {ToolPageShell} from "@/components/tool-page-shell";
import {FavoriteButton} from "@/components/favorite-button";

type PageProps={params:Promise<{slug:string}>};
export function generateStaticParams(){return tools.map(t=>({slug:t.slug}))}
export async function generateMetadata({params}:PageProps):Promise<Metadata>{
  const {slug}=await params;const t=await getCatalogTool(slug);if(!t)return {};
  return {title:t.title,description:`${t.subtitle}. ${t.formats}. 로그인·설치 없이 브라우저에서 바로 사용하세요.`,alternates:{canonical:`/tools/${slug}`},openGraph:{title:t.title,description:t.subtitle,url:`/tools/${slug}`}};
}
async function ToolPageContent({params}:PageProps){
  const {slug}=await params;const {tools:catalog}=await getToolCatalog();const t=catalog.find(item=>item.slug===slug);if(!t)notFound();
  const cat=categories[t.category];const related=catalog.filter(item=>item.category===t.category&&item.slug!==slug).slice(0,3);
  return <ToolPageShell slug={slug} title={t.title} catalog={catalog}><main className="site-width tool-page">
    <div className="breadcrumb"><Link href="/">홈</Link><ChevronRight size={14}/><Link href={`/category/${t.category}`}>{cat.name}</Link><ChevronRight size={14}/><span>{t.title}</span></div>
    <div className="tool-intro"><span className={`tool-icon icon-${t.category}`}><ToolIcon name={t.icon} size={29}/></span><div><span className="eyebrow">{cat.name.toUpperCase()} TOOL</span><div className="tool-intro-title"><h1>{t.title}</h1><FavoriteButton slug={t.slug} title={t.title} variant="detail"/></div><p>{t.subtitle}</p></div></div>
    <ToolWorkspace tool={t}/>
    <div className="trust-strip"><ShieldCheck size={21}/><div><strong>파일은 브라우저 안에서 처리됩니다</strong><span>원본 파일을 서버로 전송하지 않으며, 복잡한 문서는 일부 서식이 다르게 보일 수 있습니다.</span></div></div>
    <section className="details-section"><h2>3단계로 쉽게 사용하기</h2><div className="howto-grid">{t.steps.map((step,i)=><div key={`${i}-${step}`}><span>0{i+1}</span><p>{step}</p></div>)}</div><h2>지원 형식 및 이용 안내</h2><p className="format-box"><FileCheck2 size={18}/> {t.formats}</p><ul className="detail-list">{t.details.map((item,i)=><li key={`${i}-${item}`}>{item}</li>)}</ul><h2>자주 묻는 질문</h2><div className="faq"><h3>업로드한 파일은 서버에 저장되나요?</h3><p>아니요. 브라우저에서 로컬 파일을 처리하며 서버로 업로드하지 않습니다. AI 모델과 라이브러리는 다운로드될 수 있습니다.</p><h3>작업이 실패했어요. 어떻게 하나요?</h3><p>지원 형식 및 파일 크기를 확인하세요. 오류가 반복되면 <Link href="/contact">문의 페이지</Link>를 이용해 주세요.</p></div></section>
    <section className="related"><h2>함께 사용하면 좋은 도구</h2><div className="related-grid">{related.map(item=><div className="related-item" key={item.slug}><Link href={`/tools/${item.slug}`}><ToolIcon name={item.icon}/><span>{item.title}</span><ArrowRight size={16}/></Link><FavoriteButton slug={item.slug} title={item.title} variant="compact"/></div>)}</div></section>
  </main></ToolPageShell>
}
export default function ToolPage({params}:PageProps){return <Suspense fallback={<main className="site-width tool-page" role="status" aria-busy="true"><div className="tool-intro"><h1>도구를 불러오는 중입니다…</h1></div><div className="workspace" style={{minHeight:320}}/></main>}><ToolPageContent params={params}/></Suspense>}
