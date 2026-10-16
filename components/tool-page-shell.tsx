"use client";

import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Menu, Search } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import type { Tool } from "@/lib/tools";
import { readToolReturn, saveToolReturn } from "@/lib/recent-tools-state.mjs";
import { visitRecentTool } from "@/lib/use-recent-tools";

type Props = { slug: string; title: string; catalog: Tool[]; children: ReactNode };
export function ToolPageShell({ slug, title, catalog, children }: Props) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => { visitRecentTool(slug); }, [slug]);
  function captureToolNavigation(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const href = target.closest("a[href]")?.getAttribute("href") ?? "";
    const next = /^\/tools\/([a-z0-9-]+)(?:[?#]|$)/.exec(href)?.[1];
    if (next && next !== slug) saveToolReturn(next, `/tools/${slug}`);
  }
  function goBack() { router.push(readToolReturn(slug)); }
  return <div className={`tool-app-shell${collapsed ? " chat-home--compact" : ""}`} onClickCapture={captureToolNavigation}>
    <AppSidebar mode="tool" catalog={catalog} activeToolSlug={slug} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} collapsed={collapsed} setCollapsed={setCollapsed}/>
    <div className="chat-main tool-app-main">
      <header className="chat-topbar tool-app-topbar">
        <button type="button" className="chat-menu-button" aria-label="메뉴 열기" onClick={() => setMobileOpen(true)}><Menu size={22}/></button>
        <button type="button" className="tool-app-back" onClick={goBack}><ArrowLeft size={18}/><span>이전 화면으로</span></button>
        <span className="tool-app-top-title" title={title}>{title}</span>
        <button type="button" className="chat-browse-button" onClick={() => router.push("/?view=all")}><Search size={16}/><span>모든 기능 보기</span></button>
      </header>
      <div className="tool-page-scroll">{children}</div>
    </div>
  </div>;
}
