"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, X, ArrowUpRight, ArrowRight, Flame, Star } from "lucide-react";
import { categories, tools, searchTools, type Tool } from "@/lib/tools";
import { ToolIcon } from "@/components/tool-icon";
import { FavoriteButton } from "@/components/favorite-button";
import { useFavorites } from "@/lib/use-favorites";

const commonTags = ["PDF", "이미지", "변환", "뷰어", "편집", "압축", "WebP", "문서"];
const allowedTags = new Set(tools.flatMap((tool) => tool.tags));
const toolMap = new Map(tools.map((tool) => [tool.slug, tool]));

function Card({ tool, onTag, selectedTags }: {
  tool: Tool;
  onTag: (tag: string) => void;
  selectedTags: string[];
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article className="tool-card">
      <Link href={`/tools/${tool.slug}`} className="card-link" aria-label={`${tool.title} 사용하기`}>
        <div className="card-top">
          <span className={`tool-icon icon-${tool.category}`}><ToolIcon name={tool.icon} /></span>
          <ArrowUpRight size={19} className="card-arrow" />
        </div>
        <h3>{tool.title}</h3>
        <p>{tool.subtitle}</p>
      </Link>
      <FavoriteButton slug={tool.slug} title={tool.title} />
      <div className="card-tags">
        {tool.tags.slice(0, 3).map((tag) => (
          <button type="button" className="mini-tag" aria-pressed={selectedTags.includes(tag)} onClick={() => onTag(tag)} key={tag}>{tag}</button>
        ))}
        {tool.tags.length > 3 && (
          <button type="button" className="mini-tag more-tags" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>+{tool.tags.length - 3}</button>
        )}
        {expanded && <div className="extra-tags">{tool.tags.slice(3).map((tag) => (
          <button type="button" key={tag} onClick={() => onTag(tag)}>{tag}</button>
        ))}</div>}
      </div>
    </article>
  );
}

export function ToolExplorer() {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [cat, setCat] = useState(["pdf", "image", "document"].includes(params.get("category") ?? "") ? params.get("category")! : "all");
  const [tags, setTags] = useState<string[]>((params.get("tags") ?? "").split(",").filter((tag) => allowedTags.has(tag)));
  const { favoriteIds } = useFavorites();
  const favoriteTools = favoriteIds.flatMap((slug) => {
    const tool = toolMap.get(slug);
    return tool ? [tool] : [];
  });

  function update(q: string, category: string, selected: string[]) {
    setQuery(q);
    setCat(category);
    setTags(selected);
    const sp = new URLSearchParams();
    if (q.trim()) sp.set("q", q.trim());
    if (category !== "all") sp.set("category", category);
    if (selected.length) sp.set("tags", selected.join(","));
    router.replace(`/${sp.toString() ? `?${sp.toString()}` : ""}#all-tools`, { scroll: false });
  }

  const found = useMemo(() => searchTools(query, cat, tags), [query, cat, tags]);
  const featured = tools.filter((tool) => tool.featured);
  const toggleTag = (tag: string) => update(query, cat, tags.includes(tag) ? tags.filter((item) => item !== tag) : [...tags, tag]);

  return (
    <section className="site-width explorer" id="all-tools">
      <div className="search-container">
        <Search size={22} />
        <input aria-label="도구 검색" placeholder="어떤 도구가 필요하세요? 예: WebP PNG, PDF 변환, 사진 용량 줄이기" value={query} onChange={(event) => update(event.target.value, cat, tags)} />
        {query && <button aria-label="검색어 지우기" onClick={() => update("", cat, tags)}><X size={17} /></button>}
        <span className="search-shortcut">도구 검색</span>
      </div>

      {favoriteTools.length > 0 && (
        <section className="favorites-section" aria-labelledby="favorites-title">
          <div className="section-title">
            <div>
              <span className="eyebrow"><Star size={14} fill="currentColor" /> YOUR FAVORITES</span>
              <h2 id="favorites-title">즐겨찾는 도구 <em>{favoriteTools.length}</em></h2>
            </div>
          </div>
          <div className="tools-grid">
            {favoriteTools.map((tool) => <Card key={tool.slug} tool={tool} onTag={toggleTag} selectedTags={tags} />)}
          </div>
        </section>
      )}

      <div className="filter-area">
        <div className="filter-top"><strong>카테고리</strong><small>필요한 작업을 빠르게 찾아보세요</small></div>
        <div className="tabs" role="group" aria-label="카테고리 필터">
          {[{ id: "all", name: "전체 도구" }, ...Object.entries(categories).map(([id, value]) => ({ id, name: value.name }))].map((category) => (
            <button key={category.id} className={cat === category.id ? "selected" : ""} aria-pressed={cat === category.id} onClick={() => update(query, category.id, tags)}>{category.name}</button>
          ))}
        </div>
        <div className="tag-row">
          <span>빠른 필터</span>
          {commonTags.map((tag) => <button key={tag} aria-pressed={tags.includes(tag)} className={tags.includes(tag) ? "tag-active" : ""} onClick={() => toggleTag(tag)}>{tag}</button>)}
          {(query || cat !== "all" || tags.length > 0) && <button className="clear-btn" onClick={() => update("", "all", [])}><X size={13} /> 초기화</button>}
        </div>
      </div>

      {!query && !tags.length && cat === "all" && (
        <section className="featured">
          <div className="section-title">
            <div><span className="eyebrow"><Flame size={14} /> POPULAR TOOLS</span><h2>많이 찾는 도구</h2></div>
            <span>자주 쓰는 기능을 모았어요</span>
          </div>
          <div className="tools-grid">{featured.map((tool) => <Card key={tool.slug} tool={tool} onTag={toggleTag} selectedTags={tags} />)}</div>
        </section>
      )}

      <section>
        <div className="section-title">
          <div><span className="eyebrow">EXPLORE TOOLS</span><h2>{query || cat !== "all" || tags.length ? "검색 결과" : "모든 온라인 도구"} <em>{found.length}</em></h2></div>
          <span>필요한 도구를 골라 바로 시작하세요</span>
        </div>
        {found.length ? <div className="tools-grid">{found.map((tool) => <Card key={tool.slug} tool={tool} onTag={toggleTag} selectedTags={tags} />)}</div> : (
          <div className="empty-result">
            <Search size={30} />
            <h3>조건에 맞는 도구가 없어요</h3><p>검색어를 줄이거나 필터를 해제해 보세요.</p>
            <button className="btn btn-primary" onClick={() => update("", "all", [])}>전체 도구 다시 보기 <ArrowRight size={16} /></button>
          </div>
        )}
      </section>
    </section>
  );
}
