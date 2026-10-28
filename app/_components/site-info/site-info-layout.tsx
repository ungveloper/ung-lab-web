import type {ReactNode} from "react";
import {PageFrame} from "@/app/_components/common/page-frame";
import {PageBackLink} from "@/app/_components/common/page-back-link";
import {PageHeader} from "@/app/_components/common/page-header";
import {PageToc, type TocEntry} from "@/app/_components/common/page-toc";

/** One template for /about, /contact, /privacy and /terms. */
export function SiteInfoLayout({title, description, eyebrow, toc, tocLabel, children}: {
  title: string; description: string; eyebrow: string; toc: readonly TocEntry[]; tocLabel: string; children: ReactNode;
}) {
  return <PageFrame>
    <PageBackLink />
    <article className="min-w-0 text-slate-700">
      <PageHeader title={title} description={description} eyebrow={eyebrow}/>
      <PageToc items={toc} label={tocLabel}/>
      {children}
    </article>
  </PageFrame>;
}
