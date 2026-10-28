import type {ReactNode} from "react";

export function PageSection({id, title, children}: {id: string; title: string; children: ReactNode}) {
  return <section id={id} aria-labelledby={`${id}-title`}
    className="mb-10 scroll-mt-24 border-b border-slate-200 pb-10 last:mb-0 last:border-0 last:pb-0">
    <h2 id={`${id}-title`} className="mb-4 text-xl leading-8 font-bold tracking-tight text-text-primary md:text-pc-heading-2">{title}</h2>
    {children}
  </section>;
}
export function PageParagraph({children, className = ""}: {children: ReactNode; className?: string}) {
  return <p className={`mb-4 text-[15px] leading-8 text-text-secondary break-keep [overflow-wrap:anywhere] last:mb-0 md:text-base ${className}`}>{children}</p>;
}
export const PAGE_LINK_CLASSES = "font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:decoration-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500";
