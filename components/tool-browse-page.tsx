"use client";

import {useEffect,useState,type MouseEvent} from "react";
import {tools,type Tool} from "@/lib/tools";
import {PageFrame} from "@/app/_components/common/page-frame";
import {PageHeader} from "@/app/_components/common/page-header";
import {ToolExplorer} from "@/components/tool-explorer";
import {saveToolReturn} from "@/lib/recent-tools-state.mjs";
import {popularitySlugs} from "@/lib/tool-fallback.mjs";

export function ToolBrowsePage(){
  const [catalog,setCatalog]=useState<Tool[]>(tools);
  const [popularity,setPopularity]=useState<Record<string,number>>({});
  useEffect(()=>{
    const controller=new AbortController();
    fetch("/api/tool-catalog",{cache:"no-store",signal:controller.signal})
      .then(async response=>{if(!response.ok)throw new Error("Catalog HTTP error");return await response.json() as {tools?:Tool[]};})
      .then(result=>{if(Array.isArray(result.tools))setCatalog(result.tools)})
      .catch(()=>{});
    return ()=>controller.abort();
  },[]);
  useEffect(()=>{
    const controller=new AbortController();
    fetch("/api/tool-popularity",{cache:"no-store",signal:controller.signal})
      .then(async response=>response.ok?await response.json() as {source:string;counts?:Record<string,number>}:null)
      .then(result=>{if(result?.source==="supabase"&&result.counts)setPopularity(result.counts)})
      .catch(()=>{});
    return ()=>controller.abort();
  },[]);
  function captureToolNavigation(event:MouseEvent<HTMLElement>){
    const target=event.target;
    if(!(target instanceof Element))return;
    const href=target.closest("a[href]")?.getAttribute("href")??"";
    const slug=/^\/tools\/([a-z0-9-]+)(?:[?#]|$)/.exec(href)?.[1];
    if(slug)saveToolReturn(slug,"/tools");
  }
  return <main className="min-h-0 w-full flex-1 overflow-y-auto" aria-label="모든 기능 보기" onClickCapture={captureToolNavigation}>
    <PageFrame as="div" className="chat-browse-content">
      <PageHeader title="모든 기능 보기" description="PDF·이미지·문서 도구를 찾아 바로 사용하세요."/>
      <ToolExplorer catalog={catalog} popularSlugs={popularitySlugs(popularity,catalog.map(tool=>tool.slug))}/>
    </PageFrame>
  </main>;
}
