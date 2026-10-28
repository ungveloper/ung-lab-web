import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
const read=(path)=>readFileSync(new URL(`../${path}`,import.meta.url),"utf8");

test("참고 Inner 구조: 모든 일반 페이지가 한 프레임의 가로/세로 패딩을 사용한다",()=>{
  const frame=read("app/_components/common/page-frame.tsx");
  for(const utility of ["max-w-[1040px]","px-5","pt-10","pb-28","md:px-8","md:pt-12"])
    assert.ok(frame.includes(utility), utility);
  for(const page of ["about","contact","privacy","terms"])
    assert.match(read(`app/(workspace)/${page}/page.tsx`), /<SiteInfoLayout/);
  const layout=read("app/_components/site-info/site-info-layout.tsx");
  for(const c of ["PageFrame","PageBackLink","PageHeader","PageToc"])
    assert.ok(layout.includes(`<${c}`),c);
});

test("뒤로가기/헤더/섹션/목차를 각각 독립 공통 컴포넌트로 관리한다",()=>{
  const back=read("app/_components/common/page-back-link.tsx");
  assert.match(back,/href = "\/"/);
  assert.match(back,/focus-visible:outline-2/);
  const header=read("app/_components/common/page-header.tsx");
  assert.match(header,/text-mo-title-1/);
  assert.match(header,/md:text-pc-title-2/);
  const section=read("app/_components/common/page-section.tsx");
  assert.match(section,/aria-labelledby/);
  assert.match(section,/scroll-mt-24/);
  const toc=read("app/_components/common/page-toc.tsx");
  assert.match(toc,/href=\{item.href\}/);
  assert.match(toc,/focus-visible:outline-2/);
});

test("정보 페이지의 목차와 섹션 ID가 모두 일치한다",()=>{
  for(const page of ["about","contact","privacy","terms"]){
    const body=read(`app/(workspace)/${page}/page.tsx`);
    const ids=[...body.matchAll(/<PageSection id="([^"]+)"/g)].map(x=>x[1]);
    assert.ok(ids.length>=3);
    assert.equal(ids.length,new Set(ids).size);
    for(const id of ids)assert.ok(body.includes(`href: "#${id}"`),id);
  }
});

test("목록 카드는 공유 GuideCard/ToolCard, 그리드·가이드는 공통 페이지 프레임으로 렌더링한다",()=>{
  assert.match(read("components/guide-browser.tsx"),/GuideCard/);
  assert.match(read("components/guide-browser.tsx"),/<PageFrame/);
  assert.match(read("components/tool-explorer.tsx"),/<ToolGrid/);
  assert.match(read("app/_components/tools/tool-section.tsx"),/<ToolCard/);
  assert.match(read("app/_components/tools/tool-card.tsx"),/<FavoriteButton/);
  assert.match(read("components/tool-browse-page.tsx"),/<PageFrame/);
  assert.match(read("app/(workspace)/guides/[slug]/page.tsx"),/<PageFrame/);
});

test("전역 CSS는 참고 프로젝트의 토큰만 사용하며 레거시/커스텀 유틸리티가 없다",()=>{
  const css=read("app/tailwind.css");
  assert.match(css,/@import "tailwindcss"/);
  assert.match(css,/@theme static/);
  assert.match(css,/--color-text-primary/);
  assert.match(css,/--text-mo-title-1/);
  assert.match(css,/--text-pc-title-2/);
  assert.doesNotMatch(css, /@(?:apply|utility)\b/);
  for(const name of ["chat","globals","not-found","site-info"])
    assert.ok(!existsSync(new URL(`../app/${name}.css`,import.meta.url)),name);
});

test("홈 채팅은 그대로 잠기고 소개·문의·개인정보·약관은 모두 스크롤된다",()=>{
  const shell=read("components/workspace-shell.tsx");
  assert.match(shell,/mode === "chat" && !informationPage \? "overflow-hidden" : "overflow-y-auto"/);
  for(const route of ["/about","/contact","/privacy","/terms"])
    assert.ok(shell.includes(`pathname==="${route}"`),route);
});
