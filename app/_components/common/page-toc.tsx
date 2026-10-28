export type TocEntry = { href: `#${string}`; label: string };
export function PageToc({items, label}: {items: readonly TocEntry[]; label: string}) {
  return <nav aria-label={label} className="mb-10 flex flex-wrap items-center justify-center gap-2 md:mb-12">
    {items.map(item => <a key={item.href} href={item.href}
      className="inline-flex min-h-10 items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">{item.label}</a>)}
  </nav>;
}
