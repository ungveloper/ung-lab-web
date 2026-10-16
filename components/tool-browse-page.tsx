"use client";

import {useEffect,useState,type MouseEvent} from "react";
import {tools,type Tool} from "@/lib/tools";
import {AppListShell} from "@/components/app-list-shell";
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
  return <AppListShell mode="browse" catalog={catalog}>
    <main className="chat-browse-page" aria-label="모든 기능 보기" onClickCapture={captureToolNavigation}>
      <AppContentContainer className="chat-browse-content">
        <div className="chat-browse-heading"><h1>모든 기능 보기</h1></div>
        <ToolExplorer catalog={catalog} popularSlugs={popularitySlugs(popularity,catalog.map(tool=>tool.slug))}/>
      </AppContentContainer>
    </main>
  </AppListShell>;
}
