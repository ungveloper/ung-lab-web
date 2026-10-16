import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=(p)=>readFileSync(new URL(`../${p}`,import.meta.url),"utf8");

test("가이드 목록과 상세 페이지는 하나의 영속 레이아웃으로 사이드바를 공유한다",()=>{
  assert.match(read("app/(workspace)/layout.tsx"),/<WorkspaceShell>\{children\}<\/WorkspaceShell>/);
  assert.match(read("app/(workspace)/guides/page.tsx"),/<GuideBrowser\/>/);
  assert.doesNotMatch(read("app/(workspace)/guides/page.tsx"),/<GuideShell/);
  assert.doesNotMatch(read("app/(workspace)/guides/[slug]/page.tsx"),/<GuideShell/);
  assert.match(read("components/workspace-shell.tsx"),/<AppSidebar mode={mode}/);
});

test("Next.js 가이드 라우트 로딩에 공통 스피너가 표시된다",()=>{
  assert.match(read("app/(workspace)/guides/loading.tsx"),/<GuideRouteLoading\/>/);
  assert.match(read("app/(workspace)/guides/[slug]/page.tsx"),/<Suspense fallback=\{<GuideRouteLoading\/>\}>/);
  const loading=read("components/guide-route-loading.tsx");
  assert.match(loading,/className="guide-route-loading" role="status" aria-live="polite" aria-busy="true"/);
  assert.match(loading,/className="tool-app-loading-spinner" aria-hidden="true"/);
  assert.match(loading,/가이드를 불러오는 중/);
});

test("로딩은 가이드 본문 영역 중앙에 표시하고 모바일 헤더 높이를 고려한다",()=>{
  const css=read("app/chat.css");
  assert.match(css,/\.guide-route-loading\{[^}]*display:flex;flex-direction:column;align-items:center;justify-content:center/);
  assert.match(css,/min-height:calc\(100dvh - 64px\)/);
  assert.match(css,/@media\(max-width:720px\)\{\.guide-route-loading\{min-height:calc\(100dvh - 58px\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)\{\.tool-app-loading-spinner/);
});
