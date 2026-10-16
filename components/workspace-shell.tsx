"use client";

import {useCallback, useEffect, useState, type ReactNode} from "react";
import Link from "next/link";
import {useRouter, useSelectedLayoutSegment} from "next/navigation";
import {BookOpen, LayoutGrid, Menu} from "lucide-react";
import {AppSidebar} from "@/components/app-sidebar";
import {tools, type Tool} from "@/lib/tools";

/** Persistent navigation frame: only the route children change. */
export function WorkspaceShell({children}:{children:ReactNode}){
  const segment=useSelectedLayoutSegment();
  const router=useRouter();
  const [mobileOpen,setMobileOpen]=useState(false);
  const [collapsed,setCollapsed]=useState(false);
  const [catalog,setCatalog]=useState<Tool[]>(tools);
  const mode=segment==="tools"?"browse":segment==="guides"?"guides":"chat";

  useEffect(()=>{
    const controller=new AbortController();
    fetch("/api/tool-catalog",{cache:"no-store",signal:controller.signal})
      .then(async response=>response.ok?await response.json() as {tools?:Tool[]}:null)
      .then(result=>{if(Array.isArray(result?.tools))setCatalog(result.tools)})
      .catch(()=>{});
    return ()=>controller.abort();
  },[]);

  const newChat=useCallback(()=>{
    try{window.sessionStorage.removeItem("ung-lab:tool-chat:v1")}catch{/* Private mode */}
    window.dispatchEvent(new Event("ung-lab:new-chat"));
    setMobileOpen(false);
    if(segment!==null)router.push("/");
  },[segment,router]);

  return <div className={`guides-app-shell workspace-shell${collapsed?" chat-home--compact":""}`}>
    <AppSidebar mode={mode} catalog={catalog} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}
      collapsed={collapsed} setCollapsed={setCollapsed} onNewChat={newChat}/>
    <div className="chat-main workspace-main">
      <header className="chat-topbar workspace-topbar">
        <button type="button" className="chat-menu-button" aria-label="메뉴 열기" onClick={()=>setMobileOpen(true)}><Menu size={22}/></button>
        {mode==="chat"?<Link href="/" className="chat-top-title">웅이연구소 <span>도구 찾기</span></Link>:
          <Link href={mode==="browse"?"/tools":"/guides"} className="guide-top-title">
            {mode==="browse"?<LayoutGrid size={18}/>:<BookOpen size={18}/>} {mode==="browse"?"모든 기능 보기":"사용 가이드"}
          </Link>}
      </header>
      <div className={`workspace-page-body${mode==="chat"?" workspace-page-body--chat":""}`}>
        {children}
      </div>
    </div>
  </div>;
}
