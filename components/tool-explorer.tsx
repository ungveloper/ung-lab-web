"use client";

import {useMemo,useState} from "react";
import {Search,X} from "lucide-react";
import {categories, type Tool} from "@/lib/tools";
import {useFavorites} from "@/lib/use-favorites";
import {ToolGrid,ToolSection} from "@/app/_components/tools/tool-section";

const commonTags=["PDF","이미지","변환","뷰어","편집","압축","WebP","문서"];

export function ToolExplorer({catalog,popularSlugs=[]}: {catalog:Tool[];popularSlugs?:string[]}){
  const [query,setQuery]=useState("");
  const [category,setCategory]=useState("all");
  const [tags,setTags]=useState<string[]>([]);
  const {favoriteIds}=useFavorites();
  const favoriteTools=favoriteIds.flatMap(slug=>{const tool=catalog.find(item=>item.slug===slug);return tool?[tool]:[]});
  const actualPopular=popularSlugs.flatMap(slug=>{const tool=catalog.find(item=>item.slug===slug);return tool?[tool]:[]});
  const featuredTools=actualPopular.length?actualPopular:catalog.filter(tool=>tool.featured);
  const filtered=useMemo(()=>catalog.filter(tool=>{
    const input=query.trim().toLocaleLowerCase("ko").replace(/\s/g,"");
    const searchable=[tool.title,tool.subtitle,tool.formats,...tool.tags,...tool.aliases].join(" ").toLocaleLowerCase("ko").replace(/\s/g,"");
    return (category==="all"||tool.category===category)&&(!tags.length||tags.some(tag=>tool.tags.includes(tag)))&&(!input||searchable.includes(input));
  }),[catalog,query,category,tags]);
  const onTag=(tag:string)=>setTags(prev=>prev.includes(tag)?prev.filter(value=>value!==tag):[...prev,tag]);
  const reset=()=>{setQuery("");setCategory("all");setTags([])};
  const searching=Boolean(query||tags.length||category!=="all");

  return <section id="all-tools" aria-label="온라인 도구 탐색" className="min-w-0">
    <div className="mb-8 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-blue-600 focus-within:border-blue-400">
      <Search size={20} aria-hidden="true"/>
      <input value={query} onChange={event=>setQuery(event.target.value)} aria-label="도구 검색" placeholder="도구 이름이나 파일 형식으로 검색" className="min-w-0 flex-1 bg-transparent text-[15px] text-slate-800 outline-none placeholder:text-slate-400"/>
      {query&&<button type="button" aria-label="검색어 지우기" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" onClick={()=>setQuery("")}><X size={17}/></button>}
    </div>
    {favoriteTools.length>0&&<div className="mb-10 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 md:p-6">
      <ToolSection title="즐겨찾는 도구" count={favoriteTools.length} kind="favorites"><ToolGrid tools={favoriteTools} onTag={onTag} activeTags={tags}/></ToolSection>
    </div>}
    <div className="mb-12">
      <h2 className="mb-4 text-base font-bold text-slate-900">카테고리</h2>
      <div className="flex flex-wrap gap-2" role="group" aria-label="카테고리 필터">
        {[{id:"all",name:"전체 도구"},...Object.entries(categories).map(([id,value])=>({id,name:value.name}))].map(item=><button key={item.id} type="button" aria-pressed={category===item.id}
          className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${category===item.id?"border-blue-600 bg-blue-600 text-white":"border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50"}`}
          onClick={()=>setCategory(item.id)}>{item.name}</button>)}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-5">
        <span className="mr-1 text-sm font-bold text-slate-500">빠른 필터</span>
        {commonTags.map(tag=><button key={tag} type="button" aria-pressed={tags.includes(tag)}
          className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${tags.includes(tag)?"border-blue-200 bg-blue-100 text-blue-700":"border-slate-100 bg-slate-50 text-slate-600 hover:border-blue-200 hover:bg-blue-50"}`}
          onClick={()=>onTag(tag)}>{tag}</button>)}
        {searching&&<button type="button" className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm text-slate-500 hover:bg-slate-100" onClick={reset}><X size={14}/>초기화</button>}
      </div>
    </div>
    {!searching&&<ToolSection title={actualPopular.length?"많이 사용한 도구":"추천 도구"} kind="popular"><ToolGrid tools={featuredTools} onTag={onTag} activeTags={tags}/></ToolSection>}
    <ToolSection title={searching?"검색 결과":"모든 온라인 도구"} count={filtered.length}>
      {filtered.length ? <ToolGrid tools={filtered} onTag={onTag} activeTags={tags}/>:<div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center text-slate-600">
        <Search className="mx-auto mb-4" size={30} aria-hidden="true"/>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">검색 조건에 맞는 도구가 없어요.</h3>
        <button type="button" onClick={reset} className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50">전체 보기</button>
      </div>}
    </ToolSection>
  </section>;
}
