import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { categories, tools } from "@/lib/tools";
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
    description: `${tool.subtitle}. ${tool.formats}. 로그인·설치 없이 브라우저에서 바로 사용하세요.`,
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

  return (
    <ToolPageShell slug={slug} title={tool.title} catalog={catalog}>
      <main className="site-width tool-page">
        <nav className="breadcrumb" aria-label="현재 위치">
          <Link href="/">홈</Link><ChevronRight size={14}/>
          <Link href={`/category/${tool.category}`}>{category.name}</Link><ChevronRight size={14}/>
          <span>{tool.title}</span>
        </nav>
        <div className="tool-intro">
          <span className={`tool-icon icon-${tool.category}`}><ToolIcon name={tool.icon} size={29}/></span>
          <div>
            <div className="tool-intro-title"><h1>{tool.title}</h1><FavoriteButton slug={tool.slug} title={tool.title} variant="detail"/></div>
            <p>{tool.subtitle}</p>
          </div>
        </div>
        <ToolWorkspace tool={tool}/>
        {related.length > 0 && <section className="related" aria-label="관련 도구">
          <h2>관련 도구</h2>
          <div className="related-grid">{related.map((item) => <div className="related-item" key={item.slug}>
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
    <Suspense fallback={<main className="tool-app-loading" role="status" aria-busy="true" aria-label="도구 불러오는 중"><span className="tool-app-loading-spinner" aria-hidden="true"/><span className="sr-only">도구 불러오는 중</span></main>}>
      <ToolPageContent params={params}/>
    </Suspense>
  );
}
