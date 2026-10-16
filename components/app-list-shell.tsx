"use client";

import {useState, type ReactNode} from "react";
import Link from "next/link";
import {BookOpen, LayoutGrid, Menu} from "lucide-react";
import {AppSidebar} from "@/components/app-sidebar";
import type {Tool} from "@/lib/tools";

type Props={children:ReactNode; mode:"browse"|"guides";catalog?:Tool[]};
export function AppListShell({children,mode,catalog}:Props){
  const [mobileOpen,setMobileOpen]=useState(false);
  const [collapsed,setCollapsed]=useState(false);
  const isBrowse=mode==="browse";
  return <div className={`guides-app-shell${isBrowse?" tools-app-shell":""}${collapsed?" chat-home--compact":""}`}>
    <AppSidebar mode={mode} catalog={catalog} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} collapsed={collapsed} setCollapsed={setCollapsed}/>
    <div className="chat-main guide-main">
      <header className="chat-topbar guide-topbar">
        <button type="button" className="chat-menu-button" aria-label="메뉴 열기" onClick={()=>setMobileOpen(true)}><Menu size={22}/></button>
        <Link href={isBrowse?"/tools":"/guides"} className="guide-top-title">{isBrowse?<LayoutGrid size={18}/>:<BookOpen size={18}/>} {isBrowse?"모든 기능 보기":"사용 가이드"}</Link>
      </header>
      <div className="guide-page-scroll">{children}</div>
    </div>
  </div>;
}
