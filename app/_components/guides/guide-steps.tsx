export function GuideSteps({steps}: {steps: readonly string[]}) {
  return <ol className="mb-8 grid gap-3">{steps.map((step,index)=><li key={`${index}-${step}`}
    className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 text-[15px] leading-7 text-slate-700">
    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">{index+1}</span>
    {step}
  </li>)}</ol>;
}
export function GuideInfoSection({id,title,items}: {id:string;title:string;items:readonly string[]}){
  return <section aria-labelledby={id} className="mb-8 border-t border-slate-200 pt-6 text-slate-700">
    <h2 id={id} className="mb-4 text-xl font-bold tracking-tight text-slate-900">{title}</h2>
    <ul className="list-disc space-y-2 pl-6 text-[15px] leading-7">{items.map(item=><li key={item}>{item}</li>)}</ul>
  </section>;
}
