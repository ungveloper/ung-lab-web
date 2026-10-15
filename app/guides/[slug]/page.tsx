import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";
import { guides } from "@/lib/guides";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.steps.join(" "),
    alternates: { canonical: `/guides/${guide.slug}` },
  };
}

async function GuidePageContent({ params }: PageProps) {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) notFound();

  return (
    <main className="content-page">
      <Link href="/guides">← 가이드 목록</Link>
      <h1>{guide.title}</h1>
      <p>웅이연구소에서 별도 설치나 파일 업로드 서버 없이 이용할 수 있는 방법입니다.</p>
      <div className="guide-article">
        <h3>사용 순서</h3>
        <ol>{guide.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        <p><strong>알아두세요:</strong> {guide.tip}</p>
      </div>
      <Link className="btn btn-primary" href={`/tools/${guide.tool}`}>
        도구 바로 사용하기 →
      </Link>
    </main>
  );
}


// The slug promise must be awaited under Suspense during instant navigation.
export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<main className="content-page" role="status" aria-busy="true"><h1>가이드를 불러오는 중입니다…</h1></main>}>
      <GuidePageContent params={params} />
    </Suspense>
  );
}
