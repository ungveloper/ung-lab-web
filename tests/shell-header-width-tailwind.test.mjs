import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

test("홈 상단 제목은 새 대화 아이콘이고 일반 안내 페이지도 올바른 제목을 사용한다", () => {
  const shell = read("components/workspace-shell.tsx");
  assert.match(shell, /MessageCirclePlus/);
  assert.match(shell, /informationPage\?\.label\?\?"새 대화"/);
  for (const pathname of ['/about', '/contact', '/privacy', '/terms'])
    assert.ok(shell.includes(`pathname==="${pathname}"`), pathname);
  assert.doesNotMatch(shell, /도구 찾기<\/span>/);
});

test("사이드바 로고와 공통 상단바는 Tailwind 64px 행으로 맞춘다", () => {
  const sidebar = read("components/app-sidebar.tsx");
  const shell = read("components/workspace-shell.tsx");
  const tool = read("components/tool-page-shell.tsx");
  assert.match(sidebar, /chat-sidebar-top h-16! min-h-16!/);
  assert.match(sidebar, /chat-sidebar pt-0!/);
  assert.match(sidebar, /brand-wordmark h-auto! w-\[150px\]!/);
  assert.match(shell, /workspace-topbar h-16! min-h-16!/);
  assert.match(tool, /tool-app-topbar h-16! min-h-16!/);
});

test("모든 공개 페이지와 목록·가이드는 같은 1040px 페이지 프레임을 사용한다", () => {
  const frame = read("app/_components/common/page-frame.tsx");
  assert.match(frame,/max-w-\[1040px\]/);
  assert.match(frame,/px-5 pt-10 pb-28 md:px-8 md:pt-12/);
  const info = read("app/_components/site-info/site-info-layout.tsx");
  assert.match(info, /<PageFrame>/);
  for(const name of ["about","contact","privacy","terms"])
    assert.match(read(`app/(workspace)/${name}/page.tsx`), /<SiteInfoLayout/);
  assert.match(read("components/guide-browser.tsx"),/<PageFrame/);
  assert.match(read("app/(workspace)/guides/[slug]/page.tsx"),/<PageFrame/);
  assert.match(read("components/tool-browse-page.tsx"),/<PageFrame as="div"/);
});
