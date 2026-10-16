"use client";

import {useMemo,useState} from "react";
import Link from "next/link";
import {ArrowUpRight, BookOpen, Search, X} from "lucide-react";
import {guides} from "@/lib/guides";
import {tools} from "@/lib/tools";
import {ToolIcon} from "@/components/tool-icon";

const bySlug=new Map(tools.map(tool=>[tool.slug,tool]));
export function GuideBrowser(){
  const [query,setQuery]=useState("");
  const filtered=useMemo(()=>{
    const term=query.toLocaleLowerCase("ko").replace(/\s/g,"");
    return guides.filter(guide=>{
      const tool=bySlug.get(guide.tool);
      const text=[guide.title,guide.tip,...guide.steps,tool?.title??"",...(tool?.tags??[]),...(tool?.aliases??[])].join(" ").toLocaleLowerCase("ko").replace(/\s/g,"");
      return !term||text.includes(term);
    });
  },[query]);
  return <main className="guide-browser">
    <h1>사용 가이드</h1>
    <div className="guide-search"><Search size={20}/><input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="가이드 검색" aria-label="가이드 검색"/>{query&&<button type="button" aria-label="검색 지우기" onClick={()=>setQuery("")}><X size={17}/></button>}</div>
    <div className="guide-cards">{filtered.map(guide=>{
      const tool=bySlug.get(guide.tool);
      return <Link className="guide-tile" href={`/guides/${guide.slug}`} key={guide.slug}>
        <span className="guide-tile-top"><span className="guide-tile-icon">{tool?<ToolIcon name={tool.icon} size={22}/>:<BookOpen size={22}/>}</span><ArrowUpRight size={19}/></span>
        <strong>{guide.title}</strong><span className="guide-tile-action">{tool?.title??"가이드 보기"}</span>
      </Link>;
    })}</div>
    {filtered.length===0&&<div className="guide-no-results"><p>검색 결과 없음</p><button type="button" onClick={()=>setQuery("")}>전체 보기</button></div>}
  </main>;
}
