"use client";

import {useState,type ReactNode} from "react";
import Link from "next/link";
import {BookOpen, Menu, Search} from "lucide-react";
import {AppSidebar} from "@/components/app-sidebar";

export function GuideShell({children}:{children:ReactNode}){
  const [mobileOpen,setMobileOpen]=useState(false);
  const [collapsed,setCollapsed]=useState(false);
  return <div className={`guides-app-shell${collapsed?" chat-home--compact":""}`}>
    <AppSidebar mode="guides" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} collapsed={collapsed} setCollapsed={setCollapsed}/>
    <div className="chat-main guide-main">
      <header className="chat-topbar guide-topbar">
        <button type="button" className="chat-menu-button" aria-label="메뉴 열기" onClick={()=>setMobileOpen(true)}><Menu size={22}/></button>
        <Link href="/guides" className="guide-top-title"><BookOpen size={18}/> 사용 가이드</Link>
        <Link href="/?view=all" className="chat-browse-button"><Search size={16}/><span>모든 기능 보기</span></Link>
      </header>
      <div className="guide-page-scroll">{children}</div>
    </div>
  </div>;
}
