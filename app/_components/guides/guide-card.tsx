import Link from "next/link";
import {ArrowUpRight, BookOpen} from "lucide-react";
import {ToolIcon} from "@/components/tool-icon";

export function GuideCard({slug, title, overview, toolTitle, icon}: {slug:string; title:string; overview:string; toolTitle:string; icon?:string}) {
  return <Link href={`/guides/${slug}`}
    className="group flex min-h-44 flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-blue-300 hover:bg-blue-50/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
    <span className="flex items-center justify-between text-slate-400">
      <span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-600">{icon ? <ToolIcon name={icon} size={22}/> : <BookOpen size={22}/>}</span>
      <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/>
    </span>
    <strong className="text-base leading-6 tracking-tight text-slate-900">{title}</strong>
    <span className="text-sm leading-6 text-slate-600">{overview}</span>
    <span className="mt-auto pt-2 text-xs font-medium text-slate-500">{toolTitle}</span>
  </Link>;
}
