"use client";

import {useEffect,useRef,useState,type FormEvent,type KeyboardEvent,type MouseEvent} from "react";
import Link from "next/link";
import {ArrowRight,Send} from "lucide-react";
import {tools,type Tool} from "@/lib/tools";
import {ToolIcon} from "@/components/tool-icon";
import {FavoriteButton} from "@/components/favorite-button";
import {AppContentContainer} from "@/components/app-content-container";
import {saveToolReturn} from "@/lib/recent-tools-state.mjs";
import {recommendTools} from "@/lib/tool-matcher.mjs";
import {suggestFallbackTools} from "@/lib/tool-fallback.mjs";

type ChatMessage={id:number;kind:"user"|"assistant";text:string;slugs?:string[]};
type CatalogResponse={tools:Tool[];source:"supabase"|"setup-required"|"unavailable"};
const defaultQueries=["사진 배경을 투명하게 만들어줘","PDF를 이미지로 저장하고 싶어","WebP 파일을 PNG로 바꿔줘","엑셀 파일을 열어보고 싶어"];
const transcriptKey="ung-lab:tool-chat:v1";
function loadTranscript():ChatMessage[]{
  try{const raw=window.sessionStorage.getItem(transcriptKey);const parsed:unknown=raw?JSON.parse(raw):[];if(!Array.isArray(parsed))return [];
    return parsed.slice(-40).filter((entry):entry is ChatMessage=>Boolean(entry)&&typeof entry==="object"&&"id" in entry&&"kind" in entry&&"text" in entry&&typeof entry.id==="number"&&["user","assistant"].includes(String(entry.kind))&&typeof entry.text==="string").map(item=>({...item,text:item.text.slice(0,600)}));
  }catch{return []}
}
export function ToolChatHome(){
  const [catalog,setCatalog]=useState<Tool[]>(tools);
  const [popularity,setPopularity]=useState<Record<string,number>>({});
  const [exampleQueries,setExampleQueries]=useState<string[]>(defaultQueries);
  const [source,setSource]=useState<CatalogResponse["source"]>("setup-required");
  const [draft,setDraft]=useState("");
  const [messages,setMessages]=useState<ChatMessage[]>([]);
  const inputRef=useRef<HTMLTextAreaElement>(null);
  const bottomRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{let cancelled=false;const controller=new AbortController();
    fetch("/api/tool-catalog",{cache:"no-store",signal:controller.signal}).then(async r=>{if(!r.ok)throw new Error("Catalog HTTP error");return await r.json() as CatalogResponse}).then(data=>{if(!cancelled&&Array.isArray(data.tools)){setCatalog(data.tools);setSource(data.source)}}).catch(()=>{if(!cancelled)setSource("unavailable")});
    return ()=>{cancelled=true;controller.abort()};
  },[]);
  useEffect(()=>{let alive=true;const controller=new AbortController();
    fetch("/api/tool-popularity",{signal:controller.signal,cache:"no-store"})
      .then(async response=>response.ok?await response.json() as {source:string;counts:Record<string,number>}:null)
      .then(result=>{if(alive&&result?.source==="supabase"&&result.counts)setPopularity(result.counts)})
      .catch(()=>{});
    return ()=>{alive=false;controller.abort()};
  },[]);
  useEffect(()=>{let alive=true;const controller=new AbortController();
    fetch("/api/tool-prompts",{signal:controller.signal,cache:"no-store"})
      .then(async response=>response.ok?await response.json() as {questions?:string[]}:null)
      .then(data=>{if(alive&&Array.isArray(data?.questions)&&data.questions.every(item=>typeof item==="string")&&data.questions.length<=4)setExampleQueries(data.questions)})
      .catch(()=>{});
    return ()=>{alive=false;controller.abort()};
  },[]);
  useEffect(()=>{if(new URLSearchParams(window.location.search).get("view")==="all")window.location.replace("/tools");},[]);
  useEffect(()=>{const restored=loadTranscript();if(restored.length)queueMicrotask(()=>setMessages(restored));},[]);
  useEffect(()=>{
    const reset=()=>{setMessages([]);setDraft("");inputRef.current?.focus()};
    window.addEventListener("ung-lab:new-chat",reset);
    return ()=>window.removeEventListener("ung-lab:new-chat",reset);
  },[]);
  useEffect(()=>{if(!messages.length)return;try{window.sessionStorage.setItem(transcriptKey,JSON.stringify(messages.slice(-40)))}catch{/* Private browsing: conversation still works. */}},[messages]);
  useEffect(()=>{if(messages.length>0)bottomRef.current?.scrollIntoView({block:"end",behavior:"auto"})},[messages]);
  // Grow with input (including pasted/newline text), then scroll only beyond 160px.
  useEffect(()=>{
    const field=inputRef.current;
    if(!field)return;
    field.style.height="auto";
    const fullHeight=field.scrollHeight;
    field.style.height=`${Math.min(fullHeight,160)}px`;
    field.style.overflowY=fullHeight>160?"auto":"hidden";
  },[draft]);
  function submit(value?:string){const text=(value??draft).trim().slice(0,500);if(!text)return;
    const {results,reason}=recommendTools(text,catalog);
    if(results.length){void fetch("/api/tool-prompts",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({slug:results[0].slug}),keepalive:true}).catch(()=>{});}
    const alternatives=results.length?null:suggestFallbackTools(text,catalog,popularity);
    const shown=results.length?results:(alternatives?.tools??[]);
    const label=results.length?"추천 도구":(alternatives?.label??"추천 도구");
    const answer=reason?.startsWith("현재 ")?`${reason} · ${label}`:label;
    // Pure, deterministic IDs: React can re-run this updater during rendering.
    setMessages(prev=>{
      const id=prev.reduce((max,message)=>Math.max(max,message.id),0)+1;
      return [...prev,{id,kind:"user" as const,text},{id:id+1,kind:"assistant" as const,text:answer,slugs:shown.map(t=>t.slug)}].slice(-40);
    });
    setDraft("");
  }
  function keyDown(e:KeyboardEvent<HTMLTextAreaElement>){if(e.key==="Enter"&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();submit()}}
  function onSubmit(e:FormEvent<HTMLFormElement>){e.preventDefault();submit()}
  const selectedCatalog=new Map(catalog.map(t=>[t.slug,t]));
  function captureToolNavigation(event:MouseEvent<HTMLElement>){
    const target=event.target;
    if(!(target instanceof Element))return;
    const href=target.closest("a[href]")?.getAttribute("href")??"";
    const slug=/^\/tools\/([a-z0-9-]+)(?:[?#]|$)/.exec(href)?.[1];
    if(slug)saveToolReturn(slug,"/");
  }
  return <main className={`chat-conversation${messages.length===0?" chat-conversation--empty":""}`} aria-label="도구 찾기 대화" onClickCapture={captureToolNavigation}>
        {messages.length===0?<AppContentContainer className="chat-empty-center">
          <div className="chat-welcome"><h1>어떤 파일 작업이 필요하세요?</h1></div>
          <AppContentContainer className="chat-composer-area"><form className="chat-composer" onSubmit={onSubmit}><textarea ref={inputRef} value={draft} maxLength={500} rows={1} aria-label="원하는 작업 입력" placeholder="예: PDF를 이미지로 바꿔줘" onKeyDown={keyDown} onChange={e=>setDraft(e.target.value)}/><button type="submit" disabled={!draft.trim()} aria-label="메시지 보내기"><Send size={19}/></button></form></AppContentContainer>
          <div className="chat-examples" aria-label="추천 질문">{exampleQueries.map(q=><button type="button" key={q} onClick={()=>submit(q)}>{q}<ArrowRight size={14}/></button>)}</div>
        </AppContentContainer>:<>
          <div className="chat-messages"><AppContentContainer className="chat-thread">{messages.map(m=><div key={m.id} className={`chat-message chat-message--${m.kind}`}>{m.kind==="assistant"&&<span className="chat-assistant-avatar" aria-hidden="true">✧</span>}<div className="chat-message-body"><p>{m.text}</p>{m.kind==="assistant"&&m.slugs&&m.slugs.length>0&&<div className="chat-result-grid">{m.slugs.map(slug=>{const tool=selectedCatalog.get(slug)??tools.find(t=>t.slug===slug);return tool?<div className="chat-result-card" key={slug}>
              <FavoriteButton slug={tool.slug} title={tool.title} variant="compact"/>
              <Link href={`/tools/${tool.slug}`} aria-label={`${tool.title} 도구 열기`}><span className={`tool-icon icon-${tool.category}`}><ToolIcon name={tool.icon} size={22}/></span><span className="chat-result-copy"><strong>{tool.title}</strong><small>{tool.subtitle}</small><span className="chat-result-tags">{tool.tags.slice(0,3).join(" · ")}</span></span><span className="chat-result-open" aria-hidden="true"><ArrowRight size={18}/></span></Link>
            </div>:null})}</div>}</div></div>)}</AppContentContainer><div ref={bottomRef}/></div>
          <AppContentContainer className="chat-composer-area"><form className="chat-composer" onSubmit={onSubmit}><textarea ref={inputRef} value={draft} maxLength={500} rows={1} aria-label="원하는 작업 입력" placeholder="예: PDF를 이미지로 바꿔줘" onKeyDown={keyDown} onChange={e=>setDraft(e.target.value)}/><button type="submit" disabled={!draft.trim()} aria-label="메시지 보내기"><Send size={19}/></button></form>{source==="unavailable"&&<span className="sr-only" role="status">기본 도구 목록 사용 중</span>}</AppContentContainer>
        </>}
  </main>;
}
