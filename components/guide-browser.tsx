"use client";

import {useMemo,useState} from "react";
import Link from "next/link";
import {ArrowUpRight, BookOpen, Search, X} from "lucide-react";
import {guides} from "@/lib/guides";
import {tools} from "@/lib/tools";
import {ToolIcon} from "@/components/tool-icon";
import {AppContentContainer} from "@/components/app-content-container";

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
  return <AppContentContainer as="main" className={`guide-browser [margin:0_auto] [padding:42px_0_130px] [&_h1]:text-[clamp(25px,2.6vw,33px)] [&_h1]:[margin:0_0_26px] [&_h1]:tracking-[-.05em] max-[720px]:[padding:25px_0_100px] [.workspace-page-body>__&]:[flex:0_0_auto]`}>
    <h1>사용 가이드</h1>
    <div className={`guide-search flex items-center gap-[11px] [border:1px_solid_#e1e8f2] rounded-[15px] [padding:12px_16px] mb-[26px] text-[#7183a1] bg-[#fff] [&:focus-within]:border-[#8fb1f9] [&_input]:[font:inherit] [&_input]:text-[15px] [&_input]:[outline:0] [&_input]:flex-1 [&_input]:min-w-0 [&_input]:border-0 [&_input]:bg-[transparent] [&_input]:text-[#334155] [&_button]:grid [&_button]:[place-items:center] [&_button]:border-0 [&_button]:bg-[none] [&_button]:text-[#64748b] [&_button]:p-[5px]`}><Search size={20}/><input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="가이드 검색" aria-label="가이드 검색"/>{query&&<button type="button" aria-label="검색 지우기" onClick={()=>setQuery("")}><X size={17}/></button>}</div>
    <div className={`guide-cards grid [grid-template-columns:repeat(3,minmax(0,1fr))] gap-[17px] max-[1020px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-[720px]:[grid-template-columns:1fr] max-[720px]:gap-[11px]`}>{filtered.map(guide=>{
      const tool=bySlug.get(guide.tool);
      return <Link className={`guide-tile [border:1px_solid_#e7eaf0] rounded-[15px] min-h-[174px] p-[22px] flex flex-col gap-[14px] [transition:border-color_.18s,box-shadow_.18s] hover:border-[#aec9fe] hover:shadow-[0_8px_24px_#21324c12] [&_strong]:text-base [&_strong]:leading-[1.45] [&_strong]:tracking-[-.02em] max-[720px]:min-h-[145px] max-[720px]:p-[17px]`} href={`/guides/${guide.slug}`} key={guide.slug}>
        <span className={`guide-tile-top flex justify-between items-center text-[#7183a1]`}><span className={`guide-tile-icon w-[44px] h-[44px] rounded-[13px] bg-[#edf4ff] grid [place-items:center] text-[#306de4]`}>{tool?<ToolIcon name={tool.icon} size={22}/>:<BookOpen size={22}/>}</span><ArrowUpRight size={19}/></span>
        <strong>{guide.title}</strong><span className={`guide-tile-summary text-[13px] text-[#66768c] leading-[1.55]`}>{guide.overview}</span><span className={`guide-tile-action mt-auto text-[#8796ab] text-[13px]`}>{tool?.title??"가이드 보기"}</span>
      </Link>;
    })}</div>
    {filtered.length===0&&<div className={`guide-no-results p-[50px] text-center text-[#78859a] [&_button]:[border:1px_solid_#dde5f1] [&_button]:[padding:10px_15px] [&_button]:rounded-[9px] [&_button]:bg-[white]`}><p>검색 결과 없음</p><button type="button" onClick={()=>setQuery("")}>전체 보기</button></div>}
  </AppContentContainer>;
}
