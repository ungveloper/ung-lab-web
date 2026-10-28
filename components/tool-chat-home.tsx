"use client";

import {useEffect,useRef,useState,type FormEvent,type KeyboardEvent,type MouseEvent} from "react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {ArrowRight,Send} from "lucide-react";
import {tools,type Tool} from "@/lib/tools";
import {AppContentContainer} from "@/components/app-content-container";
import {FeatureRequestAction} from "@/app/_components/chat/feature-request-action";
import {ChatToolResultCard} from "@/app/_components/chat/chat-tool-result-card";
import {isFeatureRequestCandidate,savePendingFeatureRequest} from "@/lib/feature-request.mjs";
import {saveToolReturn} from "@/lib/recent-tools-state.mjs";
import {recommendTools} from "@/lib/tool-matcher.mjs";
import {suggestFallbackTools} from "@/lib/tool-fallback.mjs";

type ChatMessage={id:number;kind:"user"|"assistant";text:string;slugs?:string[];featureRequest?:string};
type CatalogResponse={tools:Tool[];source:"supabase"|"setup-required"|"unavailable"};
const defaultQueries=["사진 배경을 투명하게 만들어줘","PDF를 이미지로 저장하고 싶어","WebP 파일을 PNG로 바꿔줘","엑셀 파일을 열어보고 싶어"];
const transcriptKey="ung-lab:tool-chat:v1";
function loadTranscript():ChatMessage[]{
  try{const raw=window.sessionStorage.getItem(transcriptKey);const parsed:unknown=raw?JSON.parse(raw):[];if(!Array.isArray(parsed))return [];
    return parsed.slice(-40).filter((entry):entry is ChatMessage=>Boolean(entry)&&typeof entry==="object"&&"id" in entry&&"kind" in entry&&"text" in entry&&typeof entry.id==="number"&&["user","assistant"].includes(String(entry.kind))&&typeof entry.text==="string").map(item=>({...item,text:item.text.slice(0,600),featureRequest:typeof item.featureRequest==="string"?item.featureRequest.slice(0,500):undefined}));
  }catch{return []}
}
export function ToolChatHome(){
  const router=useRouter();
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
  function openFeatureRequest(query:string){
    let saved=false;
    try{saved=savePendingFeatureRequest(window.sessionStorage,query)}catch{/* Storage unavailable. */}
    router.push(saved?"/contact?type=feature":"/contact");
  }
  function submit(value?:string){const text=(value??draft).trim().slice(0,500);if(!text)return;
    const {results,reason}=recommendTools(text,catalog);
    if(results.length){void fetch("/api/tool-prompts",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({slug:results[0].slug}),keepalive:true}).catch(()=>{});}
    const canPropose=!results.length&&isFeatureRequestCandidate(text);
    if(canPropose){
      toast.info("원하는 기능을 찾지 못했어요",{
        id:"ung-lab-feature-proposal",
        description:"새로운 기능이 필요하다면 제안해 주세요.",
        action:{label:"기능 제안하기",onClick:()=>openFeatureRequest(text)},
        duration:8500,
      });
    }
    // A missing capability is not a recommendation. Never show unrelated featured tools as a match.
    const alternatives=results.length||canPropose?null:suggestFallbackTools(text,catalog,popularity);
    const shown=results.length?results:(alternatives?.tools??[]);
    const label=results.length?"추천 도구":(alternatives?.label??"추천 도구");
    const answer=canPropose
      ? (reason?.startsWith("현재 ") ? reason : "현재 요청에 맞는 도구를 찾지 못했어요.")
      : (reason?.startsWith("현재 ")?`${reason} · ${label}`:label);
    // Pure, deterministic IDs: React can re-run this updater during rendering.
    setMessages(prev=>{
      const id=prev.reduce((max,message)=>Math.max(max,message.id),0)+1;
      return [...prev,{id,kind:"user" as const,text},{id:id+1,kind:"assistant" as const,text:answer,slugs:shown.map(t=>t.slug),featureRequest:canPropose?text:undefined}].slice(-40);
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
  return <main className={`${`chat-conversation${messages.length===0?" chat-conversation--empty":""}`} flex flex-1 flex-col min-h-0 justify-center overflow-y-auto [overscroll-behavior:contain] [@media_(max-height:640px)]:justify-start items-stretch w-full [padding:20px_0] max-[720px]:[padding:12px_0] [.workspace-page-body>__&]:flex-1 [.workspace-page-body>__&]:min-h-0 [.workspace-page-body>__&]:w-full`} aria-label="도구 찾기 대화" onClickCapture={captureToolNavigation}>
        {messages.length===0?<AppContentContainer className={`chat-empty-center mx-auto! w-full! max-w-[1040px]! min-w-0 flex flex-col items-stretch gap-0 px-5 py-0 md:px-8`}>
          <div className={`chat-welcome min-h-full max-w-[790px] m-auto flex flex-col items-center justify-center text-center [padding:34px_0_10px] [&_h1]:text-[clamp(26px,3.6vw,38px)] [&_h1]:tracking-[-.055em] [&_h1]:[margin:0_0_26px] [&_h1]:font-extrabold max-[720px]:justify-center max-[720px]:pb-[10px] max-[720px]:[&_h1]:text-[28px] [.chat-conversation--empty_&]:min-h-auto [.chat-conversation--empty_&]:[padding:22px_0_14px] max-[720px]:[.chat-conversation--empty_&]:[padding:14px_0_12px] [.chat-empty-center_&]:min-h-0 [.chat-empty-center_&]:w-full [.chat-empty-center_&]:max-w-[none] [.chat-empty-center_&]:m-0 [.chat-empty-center_&]:p-0 [.chat-empty-center_&]:text-center [.chat-empty-center_&_h1]:[margin:0_0_26px] [.chat-empty-center_&_h1]:text-[clamp(25px,3vw,33px)] [.chat-empty-center_&_h1]:font-bold [.chat-empty-center_&_h1]:tracking-[-.04em] max-[720px]:[.chat-empty-center_&_h1]:text-[clamp(23px,5vw,29px)] max-[720px]:[.chat-empty-center_&_h1]:mb-[22px]`}><h1>어떤 파일 작업이 필요하세요?</h1></div>
          <AppContentContainer className={`chat-composer-area max-w-[none] w-full [margin:0_auto] pb-[max(15px,env(safe-area-inset-bottom))] [flex-shrink:0] bg-[#fff] max-[720px]:w-[calc(100%_-_28px)] max-[720px]:pb-[max(9px,env(safe-area-inset-bottom))] [.chat-conversation--empty_&]:[flex-shrink:0] [.chat-conversation--empty_&]:pb-[22px] max-[720px]:[.chat-conversation--empty_&]:pb-[max(14px,env(safe-area-inset-bottom))] [.chat-empty-center_&]:w-full [.chat-empty-center_&]:max-w-[none] [.chat-empty-center_&]:m-0 [.chat-empty-center_&]:p-0 [.chat-empty-center_&]:bg-[transparent] [.chat-empty-center_&.app-content-container]:w-full [.chat-empty-center_&.app-content-container]:max-w-[none] w-full! max-w-none! min-w-0`}><form className={`chat-composer w-full min-w-0 [border:1px_solid_#e5e6eb] shadow-[0_6px_26px_#1a28400b] flex items-center min-h-[58px] rounded-[22px] [padding:10px_12px_10px_19px] gap-2 [&:focus-within]:border-[#afc4f7] [&_textarea]:flex-1 [&_textarea]:min-w-0 [&_textarea]:max-h-[160px] [&_textarea]:min-h-6 [&_textarea]:h-6 [&_textarea]:[resize:none] [&_textarea]:border-0 [&_textarea]:bg-[transparent] [&_textarea]:[outline:none] [&_textarea]:text-[#242631] [&_textarea]:leading-[24px] [&_textarea]:!text-base [&_textarea]:p-0 [&_textarea]:overflow-y-hidden [&_textarea::placeholder]:text-[#a1a5ad] [&_button]:border-0 [&_button]:rounded-[11px] [&_button]:w-[37px] [&_button]:h-[37px] [&_button]:grid [&_button]:[place-items:center] [&_button]:text-[#fff] [&_button]:bg-[#2463eb] [&_button]:[flex-shrink:0] [&_button:disabled]:bg-[#d2d7df] [&_textarea]:box-border [&_textarea]:block [&_textarea]:[align-self:center] [&_textarea]:[overflow-wrap:anywhere] [.chat-empty-center_&]:min-h-[60px]`} onSubmit={onSubmit}><textarea ref={inputRef} value={draft} maxLength={500} rows={1} aria-label="원하는 작업 입력" placeholder="예: PDF를 이미지로 바꿔줘" onKeyDown={keyDown} onChange={e=>setDraft(e.target.value)}/><button type="submit" disabled={!draft.trim()} aria-label="메시지 보내기"><Send size={19}/></button></form></AppContentContainer>
          <div className={`chat-examples grid [grid-template-columns:repeat(2,minmax(0,1fr))] gap-[10px] w-[min(100%,680px)] text-left [&_button]:[border:1px_solid_#eceef3] [&_button]:bg-[#fff] [&_button]:rounded-[14px] [&_button]:text-left [&_button]:[padding:17px_17px] [&_button]:flex [&_button]:gap-2 [&_button]:justify-between [&_button]:items-center [&_button]:!text-[15px] [&_button]:text-[#444c59] [&_button]:[transition:.2s] [&_button:hover]:border-[#adc5fa] [&_button:hover]:bg-[#f8fbff] [&_button:hover]:[transform:translateY(-1px)] [&_svg]:text-[#8294b5] [&_svg]:[flex-shrink:0] max-[720px]:[grid-template-columns:1fr] max-[720px]:gap-2 max-[720px]:max-w-[460px] max-[720px]:[&_button]:[padding:13px_14px] motion-reduce:[&_button]:![transition:none] [.chat-empty-center_&]:w-full [.chat-empty-center_&]:max-w-[none] [.chat-empty-center_&]:[grid-template-columns:repeat(2,minmax(0,1fr))] [.chat-empty-center_&]:gap-[9px] [.chat-empty-center_&]:mt-[23px] [.chat-empty-center_&_button]:bg-[transparent] [.chat-empty-center_&_button]:border-0 [.chat-empty-center_&_button]:rounded-[10px] [.chat-empty-center_&_button]:[padding:12px_13px] [.chat-empty-center_&_button]:!text-sm [.chat-empty-center_&_button]:text-[#606b7c] [.chat-empty-center_&_button:hover]:bg-[#f2f5fa] [.chat-empty-center_&_button:hover]:[transform:none] max-[720px]:[.chat-empty-center_&]:[grid-template-columns:1fr] max-[720px]:[.chat-empty-center_&]:gap-[3px] max-[720px]:[.chat-empty-center_&]:mt-[14px] max-[720px]:[.chat-empty-center_&_button]:[padding:10px_12px]`} aria-label="추천 질문">{exampleQueries.map(q=><button type="button" key={q} onClick={()=>submit(q)}>{q}<ArrowRight size={14}/></button>)}</div>
        </AppContentContainer>:<>
          <div className={`chat-messages flex-1 min-h-0 overflow-y-auto [overscroll-behavior:contain] [padding:25px_0_10px] max-[720px]:[padding:15px_0_5px] [.chat-conversation--empty_&]:[flex:0_0_auto] [.chat-conversation--empty_&]:min-h-auto [.chat-conversation--empty_&]:overflow-visible [.chat-conversation--empty_&]:pb-0 max-[720px]:[.chat-conversation--empty_&]:[padding:12px_0_0]`}><AppContentContainer className={`chat-thread mx-auto flex w-full min-w-0 flex-col gap-7 py-5 pb-10 max-[720px]:gap-5 max-[720px]:py-3`}>{messages.map(m=><div key={m.id} className={`chat-message chat-message--${m.kind} flex w-full min-w-0 shrink-0 items-start gap-3 ${m.kind === "user" ? "justify-end" : "justify-start"}`}>{m.kind==="assistant"&&<span className={`chat-assistant-avatar w-[33px] h-[33px] rounded-[11px] bg-[#e9f0ff] grid [place-items:center] text-[#2663db] [flex-shrink:0]`} aria-hidden="true">✧</span>}<div className={`chat-message-body min-w-0 max-w-full [&>p]:m-0 [&>p]:text-base [&>p]:leading-7 [&>p]:text-slate-700 [.chat-message--user_&]:max-w-[min(90%,580px)] [.chat-message--user_&]:rounded-2xl [.chat-message--user_&]:bg-slate-100 [.chat-message--user_&]:px-4 [.chat-message--user_&]:py-3 [.chat-message--assistant_&]:w-full [.chat-message--assistant_&]:flex-1 [.chat-message--assistant_&]:pt-1`}><p>{m.text}</p>{m.kind==="assistant"&&m.slugs&&m.slugs.length>0&&<div className="chat-result-grid mt-4 flex w-full min-w-0 flex-col gap-3">{m.slugs.map(slug=>{
              const tool=selectedCatalog.get(slug)??tools.find(t=>t.slug===slug);
              return tool?<ChatToolResultCard key={slug} tool={tool}/>:null;
            })}</div>}{m.kind==="assistant"&&m.featureRequest&&<FeatureRequestAction onClick={()=>openFeatureRequest(m.featureRequest!)} />}</div></div>)}</AppContentContainer><div ref={bottomRef}/></div>
          <AppContentContainer className={`chat-composer-area max-w-[none] w-full [margin:0_auto] pb-[max(15px,env(safe-area-inset-bottom))] [flex-shrink:0] bg-[#fff] max-[720px]:w-[calc(100%_-_28px)] max-[720px]:pb-[max(9px,env(safe-area-inset-bottom))] [.chat-conversation--empty_&]:[flex-shrink:0] [.chat-conversation--empty_&]:pb-[22px] max-[720px]:[.chat-conversation--empty_&]:pb-[max(14px,env(safe-area-inset-bottom))] [.chat-empty-center_&]:w-full [.chat-empty-center_&]:max-w-[none] [.chat-empty-center_&]:m-0 [.chat-empty-center_&]:p-0 [.chat-empty-center_&]:bg-[transparent] [.chat-empty-center_&.app-content-container]:w-full [.chat-empty-center_&.app-content-container]:max-w-[none] w-full! max-w-none! min-w-0`}><form className={`chat-composer w-full min-w-0 [border:1px_solid_#e5e6eb] shadow-[0_6px_26px_#1a28400b] flex items-center min-h-[58px] rounded-[22px] [padding:10px_12px_10px_19px] gap-2 [&:focus-within]:border-[#afc4f7] [&_textarea]:flex-1 [&_textarea]:min-w-0 [&_textarea]:max-h-[160px] [&_textarea]:min-h-6 [&_textarea]:h-6 [&_textarea]:[resize:none] [&_textarea]:border-0 [&_textarea]:bg-[transparent] [&_textarea]:[outline:none] [&_textarea]:text-[#242631] [&_textarea]:leading-[24px] [&_textarea]:!text-base [&_textarea]:p-0 [&_textarea]:overflow-y-hidden [&_textarea::placeholder]:text-[#a1a5ad] [&_button]:border-0 [&_button]:rounded-[11px] [&_button]:w-[37px] [&_button]:h-[37px] [&_button]:grid [&_button]:[place-items:center] [&_button]:text-[#fff] [&_button]:bg-[#2463eb] [&_button]:[flex-shrink:0] [&_button:disabled]:bg-[#d2d7df] [&_textarea]:box-border [&_textarea]:block [&_textarea]:[align-self:center] [&_textarea]:[overflow-wrap:anywhere] [.chat-empty-center_&]:min-h-[60px]`} onSubmit={onSubmit}><textarea ref={inputRef} value={draft} maxLength={500} rows={1} aria-label="원하는 작업 입력" placeholder="예: PDF를 이미지로 바꿔줘" onKeyDown={keyDown} onChange={e=>setDraft(e.target.value)}/><button type="submit" disabled={!draft.trim()} aria-label="메시지 보내기"><Send size={19}/></button></form>{source==="unavailable"&&<span className="sr-only" role="status">기본 도구 목록 사용 중</span>}</AppContentContainer>
        </>}
  </main>;
}
