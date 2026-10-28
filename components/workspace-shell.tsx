"use client";

import {useCallback, useEffect, useState, type ReactNode} from "react";
import Link from "next/link";
import {usePathname, useRouter, useSelectedLayoutSegment} from "next/navigation";
import {BookOpen, FileText, Info, LayoutGrid, Mail, Menu, MessageCirclePlus, ShieldCheck} from "lucide-react";
import {AppSidebar} from "@/components/app-sidebar";
import {tools, type Tool} from "@/lib/tools";

/** Persistent navigation frame: only the route children change. */
export function WorkspaceShell({children}:{children:ReactNode}){
  const segment=useSelectedLayoutSegment();
  const pathname=usePathname();
  const informationPage=pathname==="/about"?{label:"소개",icon:Info}:
    pathname==="/contact"?{label:"문의하기",icon:Mail}:
    pathname==="/privacy"?{label:"개인정보 처리방침",icon:ShieldCheck}:
    pathname==="/terms"?{label:"이용약관",icon:FileText}:null;
  const HeadingIcon=informationPage?.icon??MessageCirclePlus;
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

  return <div className={`${`guides-app-shell workspace-shell${collapsed?" chat-home--compact":""}`} [--chat-sidebar:#f9f9f9] flex min-h-[100dvh] bg-[#fff] text-[#202123] h-[100dvh] font-[Arial,"Apple_SD_Gothic_Neo","Malgun_Gothic",sans-serif] max-[720px]:h-[100dvh]`}>
    <AppSidebar mode={mode} catalog={catalog} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}
      collapsed={collapsed} setCollapsed={setCollapsed} onNewChat={newChat}/>
    <div className={`chat-main workspace-main flex-1 min-w-0 flex flex-col h-[100dvh] max-[720px]:h-[100dvh] [.tool-app-shell_&]:min-w-0 min-h-0`}>
      <header className={`chat-topbar workspace-topbar h-16! min-h-16! h-16 flex items-center gap-[9px] [padding:0_28px] [flex-shrink:0] max-[720px]:h-[58px] max-[720px]:[padding:0_15px] max-[720px]:gap-1 [border-bottom:1px_solid_#edf0f4]`}>
        <button type="button" className={`chat-menu-button border-0 bg-[transparent] p-2 text-[#5c6270] hover:bg-[#eceef3] hover:rounded-[8px] hidden max-[720px]:inline-flex`} aria-label="메뉴 열기" onClick={()=>setMobileOpen(true)}><Menu size={22}/></button>
        {mode==="chat"?<Link href={informationPage?pathname:"/"} className={`guide-top-title inline-flex items-center gap-[9px] text-base font-[740] text-[#334155]`}>
            <HeadingIcon size={18} aria-hidden="true"/> {informationPage?.label??"새 대화"}
          </Link>:
          <Link href={mode==="browse"?"/tools":"/guides"} className={`guide-top-title inline-flex items-center gap-[9px] text-base font-[740] text-[#334155]`}>
            {mode==="browse"?<LayoutGrid size={18}/>:<BookOpen size={18}/>} {mode==="browse"?"모든 기능 보기":"사용 가이드"}
          </Link>}
      </header>
      <div className={`${`workspace-page-body${mode==="chat"?" workspace-page-body--chat":""}`} flex-1 min-h-0 min-w-0 flex flex-col overflow-y-auto [overscroll-behavior:contain] overflow-hidden [&:has(#contact-form)]:!min-h-0 [&:has(#contact-form)]:!h-full [&:has(#contact-form)]:!overflow-x-hidden [&:has(#contact-form)]:!overflow-y-auto [&:has(#contact-form)]:[overscroll-behavior-y:contain] [&:has(#contact-form)]:[-webkit-overflow-scrolling:touch]`}>
        {children}
      </div>
    </div>
  </div>;
}
