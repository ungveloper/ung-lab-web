import type {ReactNode} from "react";
import {Star, Flame} from "lucide-react";
import type {Tool} from "@/lib/tools";
import {ToolCard} from "@/app/_components/tools/tool-card";

export function ToolGrid({tools,onTag,activeTags}: {tools:readonly Tool[]; onTag:(tag:string)=>void;activeTags:string[]}) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{tools.map(tool=><ToolCard key={tool.slug} tool={tool} onTag={onTag} activeTags={activeTags}/>)}</div>;
}
export function ToolSection({title,count,kind,children}: {title:string;count?:number;kind?:"favorites"|"popular";children:ReactNode}) {
  return <section className="mb-12">
    <div className="mb-5 flex flex-wrap items-center gap-2">
      {kind==="favorites"&&<Star size={17} className="text-amber-500" aria-hidden="true"/>}
      {kind==="popular"&&<Flame size={17} className="text-orange-500" aria-hidden="true"/>}
      <h2 className="text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl">{title}</h2>
      {count!==undefined&&<span className="text-sm font-semibold text-blue-600">{count}</span>}
    </div>
    {children}
  </section>;
}
