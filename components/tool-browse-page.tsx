"use client";

import {useEffect,useState,type MouseEvent} from "react";
import {tools,type Tool} from "@/lib/tools";
import {AppContentContainer} from "@/components/app-content-container";
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
  return <main className={`chat-browse-page flex-1 min-h-0 overflow-auto [padding:28px_0_140px] max-[1050px]:[padding:25px_0_120px] max-[720px]:[padding:17px_0_110px] [.tools-app-shell_&]:min-h-full [.tools-app-shell_&]:overflow-visible [.workspace-page-body>__&]:flex-1 [.workspace-page-body>__&]:min-h-0 [.workspace-page-body>__&]:w-full [.workspace-page-body>__&]:overflow-y-auto`} aria-label="모든 기능 보기" onClickCapture={captureToolNavigation}>
      <AppContentContainer className={`chat-browse-content [.tools-app-shell_&]:pt-0`}>
        <div className={`chat-browse-heading mb-[26px] [&_h1]:text-[34px] [&_h1]:tracking-[-.055em] [&_h1]:[margin:12px_0] max-[720px]:mb-[23px] max-[720px]:[&_h1]:text-[28px]`}><h1>모든 기능 보기</h1></div>
        <ToolExplorer catalog={catalog} popularSlugs={popularitySlugs(popularity,catalog.map(tool=>tool.slug))}/>
      </AppContentContainer>
  </main>;
}
