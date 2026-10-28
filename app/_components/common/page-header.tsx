/** Reference architecture: PageHeader. Typography and spacing are shared by every route. */
export function PageHeader({title, description, eyebrow}: {title: string; description?: string; eyebrow?: string}) {
  return (
    <header className="mb-8 border-b border-slate-200 pb-8 text-center md:mb-10 md:pb-10">
      {eyebrow && <p className="mb-3 text-xs font-bold tracking-wider text-slate-500 md:text-sm">{eyebrow}</p>}
      <h1 className="m-0 text-mo-title-1 font-extrabold tracking-tight text-text-primary md:text-pc-title-2">{title}</h1>
      {description && <p className="mx-auto mt-3 max-w-[760px] text-[15px] leading-7 text-text-secondary whitespace-pre-line break-keep md:mt-4 md:text-base md:leading-8">{description}</p>}
    </header>
  );
}
