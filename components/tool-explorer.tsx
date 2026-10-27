"use client";

import {useMemo,useState} from "react";
import Link from "next/link";
import {Search,X,ArrowUpRight,Star,Flame} from "lucide-react";
import {categories, type Tool} from "@/lib/tools";
import {ToolIcon} from "@/components/tool-icon";
import {FavoriteButton} from "@/components/favorite-button";
import {useFavorites} from "@/lib/use-favorites";

const commonTags=["PDF","이미지","변환","뷰어","편집","압축","WebP","문서"];
function ToolCard({tool, onTag, activeTags}:{tool:Tool,onTag:(tag:string)=>void,activeTags:string[]}){
  const [expanded,setExpanded]=useState(false);
  return <article className="tool-card">
    <Link href={`/tools/${tool.slug}`} className="card-link" aria-label={`${tool.title} 사용하기`}>
      <div className="card-top"><span className={`tool-icon icon-${tool.category}`}><ToolIcon name={tool.icon}/></span><ArrowUpRight size={19} className="card-arrow"/></div>
      <h3>{tool.title}</h3><p>{tool.subtitle}</p>
    </Link>
    <FavoriteButton slug={tool.slug} title={tool.title}/>
    <div className="card-tags">{tool.tags.slice(0,3).map(tag=><button key={tag} type="button" className="mini-tag" aria-pressed={activeTags.includes(tag)} onClick={()=>onTag(tag)}>{tag}</button>)}
      {tool.tags.length>3&&<button type="button" className="mini-tag more-tags" aria-expanded={expanded} onClick={()=>setExpanded(v=>!v)}>+{tool.tags.length-3}</button>}
      {expanded&&<div className="extra-tags">{tool.tags.slice(3).map(tag=><button type="button" key={tag} onClick={()=>onTag(tag)}>{tag}</button>)}</div>}
    </div>
  </article>
}

/** Former home explorer, retained behind "모든 기능 보기" with updated filtering. */
export function ToolExplorer({catalog,popularSlugs=[]}:{catalog:Tool[];popularSlugs?:string[]}){
  const [query,setQuery]=useState("");
  const [category,setCategory]=useState("all");
  const [tags,setTags]=useState<string[]>([]);
  const {favoriteIds}=useFavorites();
  const favoriteTools=favoriteIds.flatMap(slug=>{const tool=catalog.find(item=>item.slug===slug);return tool?[tool]:[]});
  const actualPopular=popularSlugs.flatMap(slug=>{const tool=catalog.find(item=>item.slug===slug);return tool?[tool]:[]});
  const featuredTools=actualPopular.length?actualPopular:catalog.filter(t=>t.featured);
  const filtered=useMemo(()=>catalog.filter(tool=>{
    const input=query.trim().toLocaleLowerCase("ko").replace(/\s/g,"");
    const searchable=[tool.title,tool.subtitle,tool.formats,...tool.tags,...tool.aliases].join(" ").toLocaleLowerCase("ko").replace(/\s/g,"");
    return (category==="all"||tool.category===category)&&(!tags.length||tags.some(tag=>tool.tags.includes(tag)))&&(!input||searchable.includes(input));
  }),[catalog,query,category,tags]);
  const onTag=(tag:string)=>setTags(prev=>prev.includes(tag)?prev.filter(value=>value!==tag):[...prev,tag]);
  return <section className="explorer chat-explorer" id="all-tools">
    <div className="search-container"><Search size={20}/><input value={query} onChange={e=>setQuery(e.target.value)} aria-label="도구 검색" placeholder="도구 이름이나 파일 형식으로 검색"/>{query&&<button type="button" aria-label="검색어 지우기" onClick={()=>setQuery("")}><X size={17}/></button>}</div>
    {favoriteTools.length>0&&<section className="favorites-section" aria-labelledby="favorites-title"><div className="section-title"><div><span className="eyebrow"><Star size={14} fill="currentColor"/> 즐겨찾기</span><h2 id="favorites-title">즐겨찾는 도구 <em>{favoriteTools.length}</em></h2></div></div><div className="tools-grid">{favoriteTools.map(t=><ToolCard key={t.slug} tool={t} onTag={onTag} activeTags={tags}/>)}</div></section>}
    <div className="filter-area"><div className="filter-top"><strong>카테고리</strong></div><div className="tabs" role="group" aria-label="카테고리 필터">{[{id:"all",name:"전체 도구"},...Object.entries(categories).map(([id,value])=>({id,name:value.name}))].map(c=><button type="button" key={c.id} aria-pressed={category===c.id} className={category===c.id?"selected":""} onClick={()=>setCategory(c.id)}>{c.name}</button>)}</div><div className="tag-row"><span>빠른 필터</span>{commonTags.map(tag=><button type="button" key={tag} className={tags.includes(tag)?"tag-active":""} aria-pressed={tags.includes(tag)} onClick={()=>onTag(tag)}>{tag}</button>)}{(query||category!=="all"||tags.length>0)&&<button type="button" className="clear-btn" onClick={()=>{setQuery("");setCategory("all");setTags([])}}><X size={13}/>초기화</button>}</div></div>
    {!query&&!tags.length&&category==="all"&&<section className="featured"><div className="section-title"><div><span className="eyebrow"><Flame size={14}/>{actualPopular.length?" 많이 쓰는 도구":" 도구"}</span><h2>{actualPopular.length?"많이 사용한 도구":"추천 도구"}</h2></div></div><div className="tools-grid">{featuredTools.map(t=><ToolCard key={t.slug} tool={t} onTag={onTag} activeTags={tags}/>)}</div></section>}
    <section><div className="section-title"><div><h2>{query||tags.length||category!=="all"?"검색 결과":"모든 온라인 도구"} <em>{filtered.length}</em></h2></div></div>{filtered.length?<div className="tools-grid">{filtered.map(t=><ToolCard key={t.slug} tool={t} onTag={onTag} activeTags={tags}/>)}</div>:<div className="empty-result"><Search size={30}/><h3>검색 조건에 맞는 도구가 없어요.</h3><button type="button" className="btn btn-light" onClick={()=>{setQuery("");setCategory("all");setTags([])}}>전체 보기</button></div>}</section>
  </section>
}
