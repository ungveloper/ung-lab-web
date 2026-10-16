"use client";

import {useEffect,useRef,useState,type FormEvent,type KeyboardEvent} from "react";
import Link from "next/link";
import {ArrowRight,ChevronLeft,FlaskConical,Menu,MessageCirclePlus,PanelLeftClose,Send,Search,Star,X} from "lucide-react";
import {tools,type Tool} from "@/lib/tools";
import {ToolIcon} from "@/components/tool-icon";
import {ToolExplorer} from "@/components/tool-explorer";
import {FavoriteButton} from "@/components/favorite-button";
import {useFavorites} from "@/lib/use-favorites";
import {recommendTools} from "@/lib/tool-matcher.mjs";

type ChatMessage={id:number;kind:"user"|"assistant";text:string;slugs?:string[]};
type CatalogResponse={tools:Tool[];source:"supabase"|"setup-required"|"unavailable"};
const exampleQueries=["사진 배경을 투명하게 만들어줘","PDF를 이미지로 저장하고 싶어","WebP 파일을 PNG로 바꿔줘","엑셀 파일을 열어보고 싶어"];
const transcriptKey="ung-lab:tool-chat:v1";
function loadTranscript():ChatMessage[]{
  try{const raw=window.sessionStorage.getItem(transcriptKey);const parsed:unknown=raw?JSON.parse(raw):[];if(!Array.isArray(parsed))return [];
    return parsed.slice(-40).filter((entry):entry is ChatMessage=>Boolean(entry)&&typeof entry==="object"&&"id" in entry&&"kind" in entry&&"text" in entry&&typeof entry.id==="number"&&["user","assistant"].includes(String(entry.kind))&&typeof entry.text==="string").map(item=>({...item,text:item.text.slice(0,600)}));
  }catch{return []}
}
export function ToolChatHome(){
  const [catalog,setCatalog]=useState<Tool[]>(tools);
  const [source,setSource]=useState<CatalogResponse["source"]>("setup-required");
  const [mode,setMode]=useState<"chat"|"browse">("chat");
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const [sidebarCollapsed,setSidebarCollapsed]=useState(false);
  const [draft,setDraft]=useState("");
  const [messages,setMessages]=useState<ChatMessage[]>([]);
  const inputRef=useRef<HTMLTextAreaElement>(null);
  const bottomRef=useRef<HTMLDivElement>(null);
  const {favoriteIds}=useFavorites();
  useEffect(()=>{let cancelled=false;const controller=new AbortController();
    fetch("/api/tool-catalog",{cache:"no-store",signal:controller.signal}).then(async r=>{if(!r.ok)throw new Error("Catalog HTTP error");return await r.json() as CatalogResponse}).then(data=>{if(!cancelled&&Array.isArray(data.tools)){setCatalog(data.tools);setSource(data.source)}}).catch(()=>{if(!cancelled)setSource("unavailable")});
    return ()=>{cancelled=true;controller.abort()};
  },[]);
  useEffect(()=>{const restored=loadTranscript();if(restored.length)queueMicrotask(()=>setMessages(restored));},[]);
  useEffect(()=>{if(!messages.length)return;try{window.sessionStorage.setItem(transcriptKey,JSON.stringify(messages.slice(-40)))}catch{/* Private browsing: conversation still works. */}},[messages]);
  useEffect(()=>{if(messages.length>0&&mode==="chat")bottomRef.current?.scrollIntoView({block:"end",behavior:"auto"})},[messages,mode]);
  // Grow with input (including pasted/newline text), then scroll only beyond 160px.
  useEffect(()=>{
    const field=inputRef.current;
    if(!field)return;
    field.style.height="auto";
    const fullHeight=field.scrollHeight;
    field.style.height=`${Math.min(fullHeight,160)}px`;
    field.style.overflowY=fullHeight>160?"auto":"hidden";
  },[draft,mode]);
  function submit(value?:string){const text=(value??draft).trim().slice(0,500);if(!text)return;
    const {results,reason}=recommendTools(text,catalog);
    const answer=results.length?`말씀하신 작업에는 ${results[0].title}${results.length>1?" 등 다음 도구":" 도구"}가 적합합니다. 원하는 도구를 선택해 바로 사용하세요.`:reason??"해당 도구를 찾지 못했습니다.";
    // Pure, deterministic IDs: React can re-run this updater during rendering.
    setMessages(prev=>{
      const id=prev.reduce((max,message)=>Math.max(max,message.id),0)+1;
      return [...prev,{id,kind:"user" as const,text},{id:id+1,kind:"assistant" as const,text:answer,slugs:results.map(t=>t.slug)}].slice(-40);
    });
    setDraft("");setMode("chat");setSidebarOpen(false);
  }
  function newChat(){setMessages([]);setDraft("");setMode("chat");setSidebarOpen(false);try{window.sessionStorage.removeItem(transcriptKey)}catch{/* ignore */}inputRef.current?.focus()}
  function showBrowse(){setMode("browse");setSidebarOpen(false)}
  function keyDown(e:KeyboardEvent<HTMLTextAreaElement>){if(e.key==="Enter"&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();submit()}}
  function onSubmit(e:FormEvent<HTMLFormElement>){e.preventDefault();submit()}
  const selectedCatalog=new Map(catalog.map(t=>[t.slug,t]));
  return <div className={`chat-home${sidebarCollapsed?" chat-home--compact":""}`}>
    {sidebarOpen&&<button type="button" aria-label="사이드바 닫기" className="chat-sidebar-shade" onClick={()=>setSidebarOpen(false)}/>}
    <aside className={`chat-sidebar${sidebarOpen?" is-open":""}`} aria-label="도구 탐색 사이드바">
      <div className="chat-sidebar-top"><Link href="/" className="chat-brand" onClick={newChat}><span className="chat-brand-icon"><FlaskConical size={21}/></span><strong>웅이연구소</strong></Link><button type="button" aria-label="사이드바 접기" className="chat-sidebar-collapse" onClick={()=>setSidebarCollapsed(v=>!v)}><PanelLeftClose size={18}/></button><button type="button" aria-label="사이드바 닫기" className="chat-mobile-close" onClick={()=>setSidebarOpen(false)}><X size={19}/></button></div>
      <nav className="chat-side-nav" aria-label="채팅 및 도구">
        <button type="button" className={`chat-side-link${mode==="chat"?" is-selected":""}`} onClick={newChat}><MessageCirclePlus size={19}/><span>새 대화</span></button>
        <button type="button" className={`chat-side-link${mode==="browse"?" is-selected":""}`} onClick={showBrowse}><Menu size={19}/><span>모든 기능 보기</span></button>
      </nav>
      {favoriteIds.length>0&&<div className="chat-sidebar-favorites"><p><Star size={14} fill="currentColor"/> 즐겨찾는 도구</p>{favoriteIds.map(slug=>{const item=selectedCatalog.get(slug);return item?<Link key={slug} href={`/tools/${slug}`} onClick={()=>setSidebarOpen(false)}><ToolIcon name={item.icon} size={17}/><span>{item.title}</span></Link>:null})}</div>}
      <div className="chat-sidebar-bottom"><span>AI API 없이 무료 검색</span><Link href="/guides">사용 가이드 <ArrowRight size={13}/></Link></div>
    </aside>
    <div className="chat-main">
      <header className="chat-topbar"><button type="button" className="chat-menu-button" aria-label="메뉴 열기" onClick={()=>setSidebarOpen(true)}><Menu size={22}/></button><button type="button" className="chat-top-title" onClick={()=>setMode("chat")}>웅이연구소 <span>도구 찾기</span></button><button type="button" className="chat-browse-button" onClick={showBrowse}><Search size={16}/> 모든 기능 보기</button></header>
      {mode==="browse"?<main className="chat-browse-page"><div className="chat-browse-heading"><button className="chat-back-button" type="button" onClick={()=>setMode("chat")}><ChevronLeft size={17}/> 대화로 돌아가기</button><h1>모든 기능 보기</h1><p>카테고리와 태그를 선택하거나 이름으로 검색하세요.</p></div><ToolExplorer catalog={catalog}/></main>:
      <main className={`chat-conversation${messages.length===0?" chat-conversation--empty":""}`} aria-label="도구 찾기 대화">
        <div className="chat-messages">
          {messages.length===0?<div className="chat-welcome"><span className="chat-welcome-logo"><FlaskConical size={30}/></span><h1>어떤 작업을 도와드릴까요?</h1><p>하고 싶은 작업을 평소 말하듯 입력하면 알맞은 도구를 찾아드립니다.</p><div className="chat-examples">{exampleQueries.map(q=><button type="button" key={q} onClick={()=>submit(q)}>{q} <ArrowRight size={14}/></button>)}</div></div>:
          <div className="chat-thread">{messages.map(m=><div key={m.id} className={`chat-message chat-message--${m.kind}`}>{m.kind==="assistant"&&<span className="chat-assistant-avatar"><FlaskConical size={17}/></span>}<div className="chat-message-body"><p>{m.text}</p>{m.kind==="assistant"&&m.slugs&&m.slugs.length>0&&<div className="chat-result-grid">{m.slugs.map(slug=>{const tool=selectedCatalog.get(slug)??tools.find(t=>t.slug===slug);return tool?<div className="chat-result-card" key={slug}><Link href={`/tools/${tool.slug}`} aria-label={`${tool.title} 도구 열기`}><span className={`tool-icon icon-${tool.category}`}><ToolIcon name={tool.icon} size={22}/></span><span className="chat-result-copy"><strong>{tool.title}</strong><small>{tool.subtitle}</small><span className="chat-result-tags">{tool.tags.slice(0,3).join(" · ")}</span></span><ArrowRight size={17} className="chat-result-arrow"/></Link><FavoriteButton slug={tool.slug} title={tool.title} variant="compact"/></div>:null})}</div>}</div></div>)}</div>}
          <div ref={bottomRef}/>
        </div>
        <div className="chat-composer-area"><form className="chat-composer" onSubmit={onSubmit}><textarea ref={inputRef} value={draft} maxLength={500} rows={1} aria-label="원하는 작업 입력" placeholder="어떤 작업을 하고 싶으신가요?" onKeyDown={keyDown} onChange={e=>setDraft(e.target.value)}/><button type="submit" disabled={!draft.trim()} aria-label="메시지 보내기"><Send size={19}/></button></form><p className="chat-composer-hint">JavaScript로 도구를 추천합니다. 실제 AI 대화나 파일 자동 처리는 지원하지 않습니다.{source!=="supabase"&&<span> · {source==="setup-required"?"Supabase 연결 전 기본 목록 사용 중":"DB 연결 오류: 기본 목록 사용 중"}</span>}</p></div>
      </main>}
    </div>
  </div>
}
