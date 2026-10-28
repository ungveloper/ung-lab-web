"use client";

import {useMemo,useState} from "react";
import {Search, X} from "lucide-react";
import {guides} from "@/lib/guides";
import {tools} from "@/lib/tools";
import {PageFrame} from "@/app/_components/common/page-frame";
import {PageHeader} from "@/app/_components/common/page-header";
import {GuideCard} from "@/app/_components/guides/guide-card";

const bySlug=new Map(tools.map(tool=>[tool.slug,tool]));
export function GuideBrowser(){
  const [query,setQuery]=useState("");
  const filtered=useMemo(()=>{
    const term=query.toLocaleLowerCase("ko").replace(/\s/g,"");
    return guides.filter(guide=>{
      const tool=bySlug.get(guide.tool);
      const text=[guide.title,guide.overview,guide.tip,...guide.steps,...guide.checks,...guide.troubleshooting,tool?.title??"",...(tool?.tags??[]),...(tool?.aliases??[])].join(" ").toLocaleLowerCase("ko").replace(/\s/g,"");
      return !term||text.includes(term);
    });
  },[query]);
  return <PageFrame className="guide-browser">
    <PageHeader title="사용 가이드" description="도구별 사용 방법과 해결 방법을 확인하세요."/>
    <div className="mb-8 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-500 focus-within:border-blue-400">
      <Search size={20}/>
      <input type="search" value={query} onChange={event=>setQuery(event.target.value)}
        className="min-w-0 flex-1 bg-transparent text-[15px] text-slate-800 outline-none placeholder:text-slate-400"
        placeholder="가이드 검색" aria-label="가이드 검색"/>
      {query&&<button type="button" className="rounded-lg p-2 hover:bg-slate-100" aria-label="검색 지우기" onClick={()=>setQuery("")}><X size={17}/></button>}
    </div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(guide=>{
      const tool=bySlug.get(guide.tool);
      return <GuideCard key={guide.slug} slug={guide.slug} title={guide.title} overview={guide.overview}
        toolTitle={tool?.title??"가이드 보기"} icon={tool?.icon}/>;
    })}</div>
    {filtered.length===0&&<div className="rounded-xl border border-slate-200 bg-slate-50 p-12 text-center text-slate-600">
      <p className="mb-4 text-base">검색 결과 없음</p>
      <button type="button" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-blue-50" onClick={()=>setQuery("")}>전체 보기</button>
    </div>}
  </PageFrame>;
}
