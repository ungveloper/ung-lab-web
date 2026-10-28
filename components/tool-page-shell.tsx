"use client";

import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Menu } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import type { Tool } from "@/lib/tools";
import { readToolReturn, saveToolReturn } from "@/lib/recent-tools-state.mjs";
import { visitRecentTool } from "@/lib/use-recent-tools";
import { recordToolVisit } from "@/lib/tool-popularity-client";

type Props = { slug: string; title: string; catalog: Tool[]; children: ReactNode };
export function ToolPageShell({ slug, title, catalog, children }: Props) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => { visitRecentTool(slug); void recordToolVisit(slug); }, [slug]);
  function captureToolNavigation(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const href = target.closest("a[href]")?.getAttribute("href") ?? "";
    const next = /^\/tools\/([a-z0-9-]+)(?:[?#]|$)/.exec(href)?.[1];
    if (next && next !== slug) saveToolReturn(next, `/tools/${slug}`);
  }
  function goBack() { router.push(readToolReturn(slug)); }
  return <div className={`${`tool-app-shell${collapsed ? " chat-home--compact" : ""}`} [--chat-sidebar:#f9f9f9] flex min-h-[100dvh] bg-[#fff] text-[#202123] font-[Arial,"Apple_SD_Gothic_Neo","Malgun_Gothic",sans-serif] [&_button]:[font:inherit]`} onClickCapture={captureToolNavigation}>
    <AppSidebar mode="tool" catalog={catalog} activeToolSlug={slug} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} collapsed={collapsed} setCollapsed={setCollapsed}/>
    <div className={`chat-main tool-app-main flex-1 min-w-0 flex flex-col h-[100dvh] max-[720px]:h-[100dvh] [.tool-app-shell_&]:min-w-0`}>
      <header className={`chat-topbar tool-app-topbar h-16! min-h-16! h-16 flex items-center gap-[9px] [padding:0_28px] [flex-shrink:0] max-[720px]:h-[58px] max-[720px]:[padding:0_15px] max-[720px]:gap-1 [border-bottom:1px_solid_#edf0f4] [&.chat-browse-button]:[flex-shrink:0] max-[720px]:[padding-inline:10px] max-[720px]:[&.chat-browse-button]:!text-[13px] max-[720px]:[&.chat-browse-button]:p-2 max-[370px]:[&.chat-browse-button_span]:hidden`}>
        <button type="button" className={`chat-menu-button border-0 bg-[transparent] p-2 text-[#5c6270] hover:bg-[#eceef3] hover:rounded-[8px] hidden max-[720px]:inline-flex`} aria-label="메뉴 열기" onClick={() => setMobileOpen(true)}><Menu size={22}/></button>
        <button type="button" className={`tool-app-back inline-flex items-center gap-[7px] border-0 bg-[transparent] [padding:9px_12px] rounded-[10px] !text-[15px] !font-[650] text-[#4d5a70] whitespace-nowrap hover:bg-[#f0f3f8] hover:text-[#1d4ed8] max-[720px]:[padding:7px_5px] max-[720px]:!text-sm`} onClick={goBack}><ArrowLeft size={18}/><span>이전 화면으로</span></button>
        <span className={`tool-app-top-title text-sm text-[#9aa4b3] whitespace-nowrap overflow-hidden [text-overflow:ellipsis] min-w-0 max-[720px]:hidden`} title={title}>{title}</span>
      </header>
      <div className={`tool-page-scroll flex-1 min-h-0 overflow-y-auto [overscroll-behavior:contain]`}>{children}</div>
    </div>
  </div>;
}
