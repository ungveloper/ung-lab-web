import { assertStyle } from "./_tailwind-contract.mjs";
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
  const jsx=read("components/guide-route-loading.tsx");
  assert.match(jsx,/guide-route-loading/);
  assert.match(jsx,/tool-app-loading-spinner/);
  assert.match(jsx,/aria-busy="true"/);
  assertStyle('.guide-route-loading','display','flex');
});

test("로딩은 가이드 본문 영역 중앙에 표시하고 모바일 헤더 높이를 고려한다",()=>{
  assertStyle('.guide-route-loading','align-items','center');
  assertStyle('.guide-route-loading','justify-content','center');
  assertStyle('.guide-route-loading','min-height','calc(100dvh - 64px)');
  assertStyle('.guide-route-loading','min-height','calc(100dvh - 58px)','720px');
});

