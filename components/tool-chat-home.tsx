"use client";

import {useEffect,useRef,useState,type FormEvent,type KeyboardEvent,type MouseEvent} from "react";
import Link from "next/link";
import {ArrowRight,ChevronLeft,FlaskConical,Menu,Send,Search} from "lucide-react";
import {tools,type Tool} from "@/lib/tools";
import {ToolIcon} from "@/components/tool-icon";
import {ToolExplorer} from "@/components/tool-explorer";
import {FavoriteButton} from "@/components/favorite-button";
import {AppSidebar} from "@/components/app-sidebar";
import {saveToolReturn} from "@/lib/recent-tools-state.mjs";
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
  useEffect(()=>{let cancelled=false;const controller=new AbortController();
    fetch("/api/tool-catalog",{cache:"no-store",signal:controller.signal}).then(async r=>{if(!r.ok)throw new Error("Catalog HTTP error");return await r.json() as CatalogResponse}).then(data=>{if(!cancelled&&Array.isArray(data.tools)){setCatalog(data.tools);setSource(data.source)}}).catch(()=>{if(!cancelled)setSource("unavailable")});
    return ()=>{cancelled=true;controller.abort()};
  },[]);
  useEffect(()=>{if(new URLSearchParams(window.location.search).get("view")==="all")queueMicrotask(()=>setMode("browse"));},[]);
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
  function captureToolNavigation(event:MouseEvent<HTMLDivElement>){
    const target=event.target;
    if(!(target instanceof Element))return;
    const href=target.closest("a[href]")?.getAttribute("href")??"";
    const slug=/^\/tools\/([a-z0-9-]+)(?:[?#]|$)/.exec(href)?.[1];
    if(slug)saveToolReturn(slug,mode==="browse"?"/?view=all":"/");
  }
  return <div className={`chat-home${sidebarCollapsed?" chat-home--compact":""}`} onClickCapture={captureToolNavigation}>
    <AppSidebar mode={mode} catalog={catalog} mobileOpen={sidebarOpen} setMobileOpen={setSidebarOpen} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} onNewChat={newChat} onBrowse={showBrowse}/>
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
