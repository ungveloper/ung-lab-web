"use client";

import Link from "next/link";
import { BookOpen, Clock3, FlaskConical, Menu, MessageCirclePlus, PanelLeftClose, PanelLeftOpen, Star, X } from "lucide-react";
import { tools, type Tool } from "@/lib/tools";
import { ToolIcon } from "@/components/tool-icon";
import { useFavorites } from "@/lib/use-favorites";
import { useRecentTools, removeRecentTool, clearRecentTools } from "@/lib/use-recent-tools";

type Props = {
  mode: "chat" | "browse" | "tool" | "guides";
  catalog?: Tool[];
  activeToolSlug?: string;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onNewChat?: () => void;
};

export function AppSidebar({ mode, catalog = tools, activeToolSlug, mobileOpen, setMobileOpen, collapsed, setCollapsed, onNewChat }: Props) {
  const { favoriteIds } = useFavorites();
  const recentIds = useRecentTools();
  const catalogMap = new Map([...tools, ...catalog].map((tool) => [tool.slug, tool]));
  function close() { setMobileOpen(false); }
  function clearChat() {
    try { window.sessionStorage.removeItem("ung-lab:tool-chat:v1"); } catch { /* optional */ }
    close();
  }
  const toolLinks = (ids: string[]) => ids.map((slug) => {
    const item = catalogMap.get(slug);
    return item ? <Link href={`/tools/${slug}`} key={slug} className={slug === activeToolSlug ? "is-selected" : ""} aria-current={slug === activeToolSlug ? "page" : undefined} onClick={close} title={item.title}>
      <ToolIcon name={item.icon} size={17}/><span>{item.title}</span>
    </Link> : null;
  });
  return <>
    {mobileOpen && <button type="button" aria-label="사이드바 닫기" className="chat-sidebar-shade" onClick={close}/>}
    <aside className={`chat-sidebar${mobileOpen ? " is-open" : ""}`} aria-label="도구 탐색 사이드바">
      <div className="chat-sidebar-top">
        <Link href="/" className="chat-brand" onClick={() => { close(); onNewChat?.(); }}><span className="chat-brand-icon"><FlaskConical size={21}/></span><strong>웅이연구소</strong></Link>
        <button type="button" aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"} className="chat-sidebar-collapse" onClick={() => setCollapsed(!collapsed)}>{collapsed ? <PanelLeftOpen size={18}/> : <PanelLeftClose size={18}/>}</button>
        <button type="button" aria-label="사이드바 닫기" className="chat-mobile-close" onClick={close}><X size={19}/></button>
      </div>
      <nav className="chat-side-nav" aria-label="채팅 및 도구">
        {onNewChat ? <button type="button" className={`chat-side-link${mode === "chat" ? " is-selected" : ""}`} onClick={() => { onNewChat(); close(); }}><MessageCirclePlus size={19}/><span>새 대화</span></button> :
          <Link href="/" className="chat-side-link" onClick={clearChat}><MessageCirclePlus size={19}/><span>새 대화</span></Link>}
        <Link href="/tools" className={`chat-side-link${mode === "browse" ? " is-selected" : ""}`} aria-current={mode === "browse" ? "page" : undefined} onClick={close}><Menu size={19}/><span>모든 기능 보기</span></Link>
        <Link href="/guides" className={`chat-side-link${mode==="guides"?" is-selected":""}`} onClick={close}><BookOpen size={19}/><span>사용 가이드</span></Link>
      </nav>
      <div className="chat-sidebar-scroll">
        {favoriteIds.length > 0 && <section className="chat-sidebar-favorites" aria-label="즐겨찾는 도구">
          <p><Star size={14} fill="currentColor"/> 즐겨찾는 도구</p>{toolLinks(favoriteIds)}
        </section>}
        {recentIds.length > 0 && <section className="chat-sidebar-recent" aria-label="최근 사용한 도구">
          <p><Clock3 size={14}/> 최근 사용한 도구 <button type="button" className="chat-recent-clear" onClick={clearRecentTools}>전체 지우기</button></p>
          {recentIds.map(slug=>{const item=catalogMap.get(slug);return item?<div className="chat-recent-row" key={slug}>
            <Link href={`/tools/${slug}`} className={slug===activeToolSlug?"is-selected":""} aria-current={slug===activeToolSlug?"page":undefined} onClick={close} title={item.title}><ToolIcon name={item.icon} size={17}/><span>{item.title}</span></Link>
            <button type="button" className="chat-recent-remove" aria-label={`${item.title} 최근 목록에서 제거`} title="목록에서 제거" onClick={()=>removeRecentTool(slug)}><X size={15}/></button>
          </div>:null})}
        </section>}
      </div>

    </aside>
  </>;
}
