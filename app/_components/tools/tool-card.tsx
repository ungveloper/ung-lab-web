"use client";

import {useState} from "react";
import Link from "next/link";
import {ArrowUpRight} from "lucide-react";
import type {Tool} from "@/lib/tools";
import {ToolIcon} from "@/components/tool-icon";
import {FavoriteButton} from "@/components/favorite-button";

export function ToolCard({tool,onTag,activeTags}: {tool:Tool;onTag:(tag:string)=>void;activeTags:string[]}){
  const [expanded,setExpanded]=useState(false);
  return <article className="tool-card relative flex min-h-52 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6">
    <Link href={`/tools/${tool.slug}`} aria-label={`${tool.title} 사용하기`} className="block rounded-lg pr-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
      <div className="flex items-start justify-between">
        <span className="grid size-12 place-items-center rounded-xl bg-blue-50 text-blue-600"><ToolIcon name={tool.icon}/></span>
        <ArrowUpRight size={19} className="text-slate-400"/>
      </div>
      <h3 className="mb-1 mt-5 text-lg font-extrabold tracking-tight text-slate-900">{tool.title}</h3>
      <p className="mb-4 line-clamp-2 text-sm leading-6 text-slate-500">{tool.subtitle}</p>
    </Link>
    <FavoriteButton slug={tool.slug} title={tool.title}/>
    <div className="relative mt-auto flex flex-wrap gap-1.5">
      {tool.tags.slice(0,3).map(tag=><button key={tag} type="button" aria-pressed={activeTags.includes(tag)}
        className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500 hover:bg-blue-50 hover:text-blue-700 aria-pressed:bg-blue-100 aria-pressed:text-blue-700"
        onClick={()=>onTag(tag)}>{tag}</button>)}
      {tool.tags.length>3&&<button type="button" aria-expanded={expanded} className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500 hover:bg-blue-50" onClick={()=>setExpanded(v=>!v)}>+{tool.tags.length-3}</button>}
      {expanded&&<div className="absolute right-0 top-8 z-10 flex flex-wrap gap-1.5 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">{tool.tags.slice(3).map(tag=><button type="button" key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600 hover:bg-blue-50" onClick={()=>onTag(tag)}>{tag}</button>)}</div>}
    </div>
  </article>;
}
