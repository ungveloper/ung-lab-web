"use client";
import Image from "next/image";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Clock3, Menu, MessageCirclePlus, PanelLeftClose, PanelLeftOpen, Star, X } from "lucide-react";
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
  const pathname = usePathname();
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
    {mobileOpen && <button type="button" aria-label="사이드바 닫기" className={`chat-sidebar-shade hidden max-[720px]:block max-[720px]:fixed max-[720px]:[inset:0] max-[720px]:border-0 max-[720px]:bg-[#18243a77] max-[720px]:z-25`} onClick={close}/>}
    <aside className={`${`chat-sidebar pt-0!${mobileOpen ? " is-open" : ""}`} [flex:0_0_278px] w-[278px] min-w-0 flex flex-col bg-[var(--chat-sidebar)] [border-right:1px_solid_#f1f1f1] sticky top-0 h-[100dvh] [padding:23px_13px_15px] z-30 [.chat-home--compact_&]:basis-[77px] [.chat-home--compact_&]:w-[77px] [.chat-home--compact_&]:items-center max-[1050px]:basis-[236px] max-[1050px]:w-[236px] max-[720px]:fixed max-[720px]:left-0 max-[720px]:top-0 max-[720px]:bottom-0 max-[720px]:[transform:translateX(-105%)] max-[720px]:[transition:transform_.2s] max-[720px]:shadow-[8px_0_35px_#1018281a] max-[720px]:[&.is-open]:[transform:translateX(0)] max-[720px]:[.chat-home--compact_&]:w-[278px] max-[720px]:[.chat-home--compact_&]:basis-[278px] max-[720px]:[.chat-home--compact_&]:items-stretch motion-reduce:![transition:none]`} aria-label="도구 탐색 사이드바">
      <div className={`chat-sidebar-top h-16! min-h-16! shrink-0! px-2! py-0! flex items-center justify-between [padding:0_8px_22px] [&_button]:border-0 [&_button]:bg-[transparent] [&_button]:p-2 [&_button]:text-[#5c6270] [.chat-home--compact_&]:flex-col [.chat-home--compact_&]:gap-[10px] max-[720px]:[.chat-home--compact_&]:flex-row`}>
        <Link href="/" className={`chat-brand flex items-center gap-[10px] text-lg tracking-[-.05em] [.chat-home--compact_&_strong]:hidden max-[720px]:[.chat-home--compact_&_strong]:[display:initial]`} onClick={() => { close(); onNewChat?.(); }}><strong><Image src="/images/brand/logo.png" alt="웅이연구소" width={720} height={166} className={`brand-wordmark h-auto! w-[150px]! max-w-full! sm:w-[164px]! block w-[clamp(140px,11.5vw,176px)] h-auto [aspect-ratio:720/166] max-w-full object-contain max-[720px]:w-[148px]`} priority/></strong></Link>
        <button type="button" aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"} className={`chat-sidebar-collapse inline-flex items-center justify-center hover:bg-[#eceef3] hover:rounded-[8px] max-[720px]:hidden`} onClick={() => setCollapsed(!collapsed)}>{collapsed ? <PanelLeftOpen size={18}/> : <PanelLeftClose size={18}/>}</button>
        <button type="button" aria-label="사이드바 닫기" className={`chat-mobile-close border-0 bg-[transparent] p-2 text-[#5c6270] hover:bg-[#eceef3] hover:rounded-[8px] hidden max-[720px]:inline-flex`} onClick={close}><X size={19}/></button>
      </div>
      <nav className={`chat-side-nav grid gap-1`} aria-label="채팅 및 도구">
        {onNewChat ? <button type="button" className={`${`chat-side-link${mode === "chat" && pathname === "/" ? " is-selected" : ""}`} flex gap-[13px] items-center [padding:13px_12px] text-[#414550] border-0 bg-[transparent] text-left w-full !text-base rounded-[10px] !font-[620] hover:bg-[#ededf1] [&.is-selected]:bg-[#ededf1] [&_svg]:[flex-shrink:0] [.chat-home--compact_&_span]:hidden [.chat-home--compact_&]:justify-center max-[720px]:[.chat-home--compact_&_span]:[display:initial]`} onClick={() => { onNewChat(); close(); }}><MessageCirclePlus size={19}/><span>새 대화</span></button> :
          <Link href="/" className={`chat-side-link flex gap-[13px] items-center [padding:13px_12px] text-[#414550] border-0 bg-[transparent] text-left w-full !text-base rounded-[10px] !font-[620] hover:bg-[#ededf1] [&.is-selected]:bg-[#ededf1] [&_svg]:[flex-shrink:0] [.chat-home--compact_&_span]:hidden [.chat-home--compact_&]:justify-center max-[720px]:[.chat-home--compact_&_span]:[display:initial]`} onClick={clearChat}><MessageCirclePlus size={19}/><span>새 대화</span></Link>}
        <Link href="/tools" className={`${`chat-side-link${mode === "browse" ? " is-selected" : ""}`} flex gap-[13px] items-center [padding:13px_12px] text-[#414550] border-0 bg-[transparent] text-left w-full !text-base rounded-[10px] !font-[620] hover:bg-[#ededf1] [&.is-selected]:bg-[#ededf1] [&_svg]:[flex-shrink:0] [.chat-home--compact_&_span]:hidden [.chat-home--compact_&]:justify-center max-[720px]:[.chat-home--compact_&_span]:[display:initial]`} aria-current={mode === "browse" ? "page" : undefined} onClick={close}><Menu size={19}/><span>모든 기능 보기</span></Link>
        <Link href="/guides" className={`${`chat-side-link${mode==="guides"?" is-selected":""}`} flex gap-[13px] items-center [padding:13px_12px] text-[#414550] border-0 bg-[transparent] text-left w-full !text-base rounded-[10px] !font-[620] hover:bg-[#ededf1] [&.is-selected]:bg-[#ededf1] [&_svg]:[flex-shrink:0] [.chat-home--compact_&_span]:hidden [.chat-home--compact_&]:justify-center max-[720px]:[.chat-home--compact_&_span]:[display:initial]`} onClick={close}><BookOpen size={19}/><span>사용 가이드</span></Link>
      </nav>
      <div className={`chat-sidebar-scroll flex flex-1 min-h-0 flex-col overflow-y-auto [overscroll-behavior:contain] pb-3 [.chat-home--compact_&]:hidden max-[720px]:[.chat-home--compact_&]:flex`}>
        {favoriteIds.length > 0 && <section className={`chat-sidebar-favorites mt-[25px] [padding:0_7px] grid gap-[2px] min-w-0 [&>p]:flex [&>p]:gap-2 [&>p]:items-center [&>p]:font-[740] [&>p]:text-sm [&>p]:text-[#606c81] [&>p]:mb-2 [&>a]:flex [&>a]:items-center [&>a]:gap-[10px] [&>a]:p-[9px] [&>a]:rounded-[8px] [&>a]:text-[#5b6371] [&>a]:text-[15px] [&>a]:whitespace-nowrap [&>a]:min-w-0 [&>a_span]:overflow-hidden [&>a_span]:[text-overflow:ellipsis] [&>a:hover]:bg-[#ededf1] [.chat-home--compact_&]:hidden max-[720px]:[.chat-home--compact_&]:[display:initial] [&>a.is-selected]:bg-[#ededf1] [&>a.is-selected]:text-[#283448] [.chat-sidebar-scroll_&]:[flex-shrink:0]`} aria-label="즐겨찾는 도구">
          <p><Star size={14} fill="currentColor"/> 즐겨찾는 도구</p>{toolLinks(favoriteIds)}
        </section>}
        {recentIds.length > 0 && <section className={`chat-sidebar-recent mt-[25px] [padding:0_7px] grid gap-[2px] min-w-0 [&>p]:flex [&>p]:gap-2 [&>p]:items-center [&>p]:font-[740] [&>p]:text-sm [&>p]:text-[#606c81] [&>p]:mb-2 [&>a]:flex [&>a]:items-center [&>a]:gap-[10px] [&>a]:p-[9px] [&>a]:rounded-[8px] [&>a]:text-[#5b6371] [&>a]:text-[15px] [&>a]:whitespace-nowrap [&>a]:min-w-0 [&>a_span]:overflow-hidden [&>a_span]:[text-overflow:ellipsis] [&>a:hover]:bg-[#ededf1] [&>a:hover]:text-[#283448] [&>a.is-selected]:bg-[#ededf1] [&>a.is-selected]:text-[#283448] [.chat-sidebar-scroll_&]:[flex-shrink:0] [.chat-home--compact_&]:hidden max-[720px]:[.chat-home--compact_&]:grid [&>p]:justify-between [&>p]:gap-[6px]`} aria-label="최근 사용한 도구">
          <p><Clock3 size={14}/> 최근 사용한 도구 <button type="button" className={`chat-recent-clear ml-auto border-0 bg-[transparent] text-[#79859b] p-[5px] !text-[13px] whitespace-nowrap rounded-[6px] hover:text-[#b42332] hover:bg-[#fff0f1] max-[720px]:p-2`} onClick={clearRecentTools}>전체 지우기</button></p>
          {recentIds.map(slug=>{const item=catalogMap.get(slug);return item?<div className={`chat-recent-row flex items-center gap-px min-w-0 rounded-[8px] [&>a]:min-w-0 [&>a]:flex-1 [&>a]:flex [&>a]:items-center [&>a]:gap-[10px] [&>a]:[padding:9px_5px_9px_9px] [&>a]:text-[#5b6371] [&>a]:text-[15px] [&>a]:whitespace-nowrap [&>a]:rounded-[8px] [&>a>span]:overflow-hidden [&>a>span]:[text-overflow:ellipsis] [&>a>svg]:[flex-shrink:0] [&>a:hover]:bg-[#ededf1] [&>a:hover]:text-[#283448] [&>a.is-selected]:bg-[#ededf1] [&>a.is-selected]:text-[#283448]`} key={slug}>
            <Link href={`/tools/${slug}`} className={slug===activeToolSlug?"is-selected":""} aria-current={slug===activeToolSlug?"page":undefined} onClick={close} title={item.title}><ToolIcon name={item.icon} size={17}/><span>{item.title}</span></Link>
            <button type="button" className={`chat-recent-remove grid [place-items:center] w-[30px] h-[34px] [flex-shrink:0] border-0 bg-[transparent] rounded-[7px] text-[#9aa4b4] hover:text-[#b42332] hover:bg-[#fce8e9] focus-visible:text-[#b42332] focus-visible:bg-[#fce8e9] max-[720px]:w-[38px] max-[720px]:h-10`} aria-label={`${item.title} 최근 목록에서 제거`} title="목록에서 제거" onClick={()=>removeRecentTool(slug)}><X size={15}/></button>
          </div>:null})}
        </section>}
      </div>
      <nav className={`chat-sidebar-bottom adsense-trust-links mt-auto [padding:14px_10px_0] flex flex-col gap-[10px] text-[13px] text-[#858d9c] [border-top:1px_solid_#e9e9ed] [&_a]:flex [&_a]:gap-[5px] [&_a]:items-center [&_a]:text-sm [&_a]:text-[#64748b] [.chat-home--compact_&]:hidden max-[720px]:[.chat-home--compact_&]:[display:initial] [flex-shrink:0] gap-[7px_13px] flex-wrap items-center [padding:12px_15px_15px] [border-top:1px_solid_#e9edf3] [&_a]:text-xs [&_a]:text-[#627084] [&_a]:no-underline [&_a]:whitespace-nowrap [&_a:hover]:text-[#1d4ed8] [&_a:hover]:underline [&_a:focus-visible]:text-[#1d4ed8] [&_a:focus-visible]:underline max-[720px]:[&_a]:[padding-block:5px]`} aria-label="사이트 정보">
        <Link href="/about" onClick={close}>소개</Link>
        <Link href="/contact" onClick={close}>문의</Link>
        <Link href="/privacy" onClick={close}>개인정보 처리방침</Link>
        <Link href="/terms" onClick={close}>이용약관</Link>
      </nav>
    </aside>
  </>;
}
