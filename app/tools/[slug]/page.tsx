import {notFound} from "next/navigation";
import Link from "next/link";
import {ChevronRight,ShieldCheck,FileCheck2,ArrowRight} from "lucide-react";
import {categories,tools,toolBySlug} from "@/lib/tools";
import {ToolIcon} from "@/components/tool-icon";
import {ToolWorkspace} from "@/components/tool-workspace";
import {FavoriteButton} from "@/components/favorite-button";
import type {Metadata} from "next";
import {Suspense} from "react";
export function generateStaticParams(){return tools.map(t=>({slug:t.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const t=toolBySlug(slug);if(!t)return {};return {title:t.title,description:`${t.subtitle}. ${t.formats}. 로그인·설치 없이 브라우저에서 바로 사용하세요.`,alternates:{canonical:`/tools/${slug}`},openGraph:{title:t.title,description:t.subtitle,url:`/tools/${slug}`}}}
async function ToolPageContent({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const t=toolBySlug(slug);if(!t)notFound();const cat=categories[t.category];const related=tools.filter(x=>x.category===t.category&&x.slug!==slug).slice(0,3);return <main className="site-width tool-page"><div className="breadcrumb"><Link href="/">홈</Link><ChevronRight size={14}/><Link href={`/category/${t.category}`}>{cat.name}</Link><ChevronRight size={14}/><span>{t.title}</span></div><div className="tool-intro"><span className={`tool-icon icon-${t.category}`}><ToolIcon name={t.icon} size={29}/></span><div><span className="eyebrow">{cat.name.toUpperCase()} TOOL</span><div className="tool-intro-title"><h1>{t.title}</h1><FavoriteButton slug={t.slug} title={t.title} variant="detail"/></div><p>{t.subtitle}</p></div></div><ToolWorkspace tool={t}/><div className="trust-strip"><ShieldCheck size={21}/><div><strong>파일은 브라우저 안에서 처리됩니다</strong><span>원본 파일을 서버로 전송하지 않으며, 복잡한 문서는 일부 서식이 다르게 보일 수 있습니다.</span></div></div><section className="details-section"><h2>3단계로 쉽게 사용하기</h2><div className="howto-grid">{t.steps.map((s,i)=><div key={s}><span>0{i+1}</span><p>{s}</p></div>)}</div><h2>지원 형식 및 이용 안내</h2><p className="format-box"><FileCheck2 size={18}/> {t.formats}</p><ul className="detail-list">{t.details.map(d=><li key={d}>{d}</li>)}</ul><h2>자주 묻는 질문</h2><div className="faq"><h3>업로드한 파일은 서버에 저장되나요?</h3><p>아니요. 브라우저의 로컬 파일 처리 기능을 사용하며, 파일 내용을 서버에 업로드하지 않습니다. AI 모델이나 라이브러리 파일은 기기에 다운로드될 수 있습니다.</p><h3>작업이 실패했어요. 어떻게 하나요?</h3><p>지원 형식과 파일 크기를 확인하고 다른 브라우저 또는 더 작은 파일로 다시 시도해 보세요. 오류가 반복되면 <Link href="/contact">문의 페이지</Link>를 이용해 주세요. 개인정보가 담긴 파일은 첨부하지 마세요.</p></div></section><section className="related"><h2>함께 사용하면 좋은 도구</h2><div className="related-grid">{related.map(x=><div className="related-item" key={x.slug}><Link href={`/tools/${x.slug}`}><ToolIcon name={x.icon}/><span>{x.title}</span><ArrowRight size={16}/></Link><FavoriteButton slug={x.slug} title={x.title} variant="compact"/></div>)}</div></section></main>}


// Keep URL-specific route data behind Suspense for Next.js 16 instant navigation.
export default function ToolPage({params}:{params:Promise<{slug:string}>}) {
  return (
    <Suspense fallback={
      <main className="site-width tool-page" role="status" aria-busy="true">
        <div className="tool-intro"><h1>도구를 준비하는 중입니다…</h1></div>
        <div className="workspace" style={{minHeight: 320}}/>
      </main>
    }>
      <ToolPageContent params={params}/>
    </Suspense>
  );
}
