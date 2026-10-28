import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { categories, tools } from "@/lib/tools";
import { guides } from "@/lib/guides";
import { getCatalogTool, getToolCatalog } from "@/lib/tool-catalog";
import { ToolIcon } from "@/components/tool-icon";
import { ToolWorkspace } from "@/components/tool-workspace";
import { ToolPageShell } from "@/components/tool-page-shell";
import { FavoriteButton } from "@/components/favorite-button";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getCatalogTool(slug);
  if (!tool) return {};
  return {
    title: tool.title,
    description: `${tool.subtitle}. ${tool.formats}. 가입이나 설치 없이 웹에서 사용할 수 있습니다.`,
    alternates: { canonical: `/tools/${slug}` },
    openGraph: { title: tool.title, description: tool.subtitle, url: `/tools/${slug}` },
  };
}

async function ToolPageContent({ params }: PageProps) {
  const { slug } = await params;
  const { tools: catalog } = await getToolCatalog();
  const tool = catalog.find((item) => item.slug === slug);
  if (!tool) notFound();
  const category = categories[tool.category];
  const related = catalog.filter((item) => item.category === tool.category && item.slug !== slug).slice(0, 3);
  const guide=guides.find(item=>item.tool===tool.slug);

  return (
    <ToolPageShell slug={slug} title={tool.title} catalog={catalog}>
      <main className={`site-width tool-page w-[min(1240px,calc(100%_-_48px))] [margin-inline:auto] [.hero_&]:relative [.hero_&]:z-1 pt-[27px] pb-[90px] max-[600px]:w-[min(100%_-_32px,1240px)] max-[600px]:pt-5 print:w-full print:m-0 print:p-0 [.tool-page-scroll>__&.tool-page]:w-[min(1100px,calc(100%_-_64px))] [.tool-page-scroll>__&.tool-page]:[margin-inline:auto] [.tool-page-scroll>__&.tool-page]:pt-5 [.tool-page-scroll>__&.tool-page]:pb-[100px] max-[1050px]:[.tool-page-scroll>__&.tool-page]:w-[min(100%_-_40px,1100px)] max-[720px]:[.tool-page-scroll>__&.tool-page]:w-[calc(100%_-_26px)] max-[720px]:[.tool-page-scroll>__&.tool-page]:pt-[18px] max-[720px]:[.tool-page-scroll>__&.tool-page]:pb-[75px]`}>
        <nav className={`breadcrumb flex items-center gap-2 text-sm text-[#9aa4b4] mb-[38px] [&_a]:text-[#6d7b92] max-[600px]:mb-6 print:!hidden`} aria-label="현재 위치">
          <Link href="/">홈</Link><ChevronRight size={14}/>
          <Link href={`/category/${tool.category}`}>{category.name}</Link><ChevronRight size={14}/>
          <span>{tool.title}</span>
        </nav>
        <div className={`tool-intro flex items-center gap-[18px] mb-[28px] [&_h1]:text-[35px] [&_h1]:[margin:5px_0_3px] [&_p]:text-base [&_p]:text-[#8492a8] [&_p]:m-0 max-[600px]:[&_h1]:text-2xl max-[600px]:[&_p]:text-sm print:!hidden`}>
          <span className={`${`tool-icon icon-${tool.category}`} inline-flex items-center justify-center w-[49px] h-[49px] rounded-[13px] [flex-shrink:0] bg-[#fff0f0] text-[#db585e] bg-[#edf4ff] text-[#3174e8] bg-[#f4efff] text-[#9064d4] [.tool-intro_&]:w-[66px] [.tool-intro_&]:h-[66px] max-[600px]:w-[39px] max-[600px]:h-[39px] max-[600px]:[.tool-intro_&]:w-12 max-[600px]:[.tool-intro_&]:h-12 [.chat-result-card_&]:w-[45px] [.chat-result-card_&]:h-[45px] [.chat-result-card_&]:[flex-shrink:0] max-[720px]:[.chat-result-card_&]:w-[39px] max-[720px]:[.chat-result-card_&]:h-[39px]`}><ToolIcon name={tool.icon} size={29}/></span>
          <div>
            <div className={`tool-intro-title flex items-center gap-[13px] [&_h1]:mr-0`}><h1>{tool.title}</h1><FavoriteButton slug={tool.slug} title={tool.title} variant="detail"/></div>
            <p>{tool.subtitle}</p>
          </div>
        </div>
        <ToolWorkspace tool={tool}/>
        <section className={`tool-help mt-8 [padding:20px_22px] [border:1px_solid_#e8edf4] rounded-[12px] [&_h2]:text-[19px] [&_h2]:[margin:0_0_15px] [&_ol]:pl-[22px] [&_ol]:leading-[1.7] [&_ol]:[margin:8px_0_16px] [&_ul]:pl-[22px] [&_ul]:leading-[1.7] [&_ul]:[margin:8px_0_16px] [&_li+li]:mt-[6px] [&_a]:text-[#1d4ed8] [&_a]:font-[650] [&_a]:underline [&_a]:underline-offset-[3px]`} aria-labelledby="tool-help-title">
          <h2 id="tool-help-title">사용법과 지원 범위</h2>
          <ol>{tool.steps.map((step,index)=><li key={index}>{step}</li>)}</ol>
          <ul>{tool.details.map((detail,index)=><li key={index}>{detail}</li>)}</ul>
          {guide&&<Link href={`/guides/${guide.slug}`}>자세한 사용 가이드 보기 →</Link>}
        </section>
        {related.length > 0 && <section className={`related [&_h2]:text-2xl [&_h2]:[margin:35px_0_19px] [border-top:1px_solid_#e9eef6] print:!hidden`} aria-label="관련 도구">
          <h2>관련 도구</h2>
          <div className={`related-grid grid [grid-template-columns:repeat(3,1fr)] gap-3 [&_a]:[border:1px_solid_#e6ecf4] [&_a]:flex [&_a]:items-center [&_a]:gap-[11px] [&_a]:p-[15px] [&_a]:rounded-[12px] [&_a]:text-[15px] [&_a]:font-[650] [&_a_svg:first-child]:text-[#4978d9] [&_a_svg:last-child]:ml-auto max-[900px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-[600px]:[grid-template-columns:1fr]`}>{related.map((item) => <div className={`related-item relative min-w-0 [.related-grid_&>a]:flex [.related-grid_&>a]:items-center [.related-grid_&>a]:gap-[11px] [.related-grid_&>a]:[padding:15px_54px_15px_15px] [.related-grid_&>a]:[border:1px_solid_#e6ecf4] [.related-grid_&>a]:rounded-[12px] [.related-grid_&>a]:text-[15px] [.related-grid_&>a]:font-[650] [.related-grid_&>a]:min-h-[60px] [.related-grid_&>a_svg:first-child]:text-[#4978d9] [.related-grid_&>a_svg:last-child]:ml-auto`} key={item.slug}>
            <Link href={`/tools/${item.slug}`}><ToolIcon name={item.icon}/><span>{item.title}</span><ArrowRight size={16}/></Link>
            <FavoriteButton slug={item.slug} title={item.title} variant="compact"/>
          </div>)}</div>
        </section>}
      </main>
    </ToolPageShell>
  );
}

export default function ToolPage({ params }: PageProps) {
  return (
    <Suspense fallback={<main className={`tool-app-loading min-h-[100dvh] flex items-center justify-center bg-[#fff]`} role="status" aria-busy="true" aria-label="도구 불러오는 중"><span className={`tool-app-loading-spinner w-[38px] h-[38px] [border:3px_solid_#e5ecf8] [border-top-color:#2563eb] rounded-full [animation:spin_.75s_linear_infinite] motion-reduce:[animation-duration:2s] [.guide-route-loading_&]:[flex:0_0_auto]`} aria-hidden="true"/><span className="sr-only">도구 불러오는 중</span></main>}>
      <ToolPageContent params={params}/>
    </Suspense>
  );
}
