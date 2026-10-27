import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (filename) => readFileSync(new URL(`../${filename}`, import.meta.url), "utf8");

test("새 대화 선택 상태는 채팅 모드이며 현재 경로가 홈일 때만 표시한다", () => {
  const sidebar = read("components/app-sidebar.tsx");
  assert.match(sidebar, /usePathname\(\)/);
  assert.match(sidebar, /mode === "chat" && pathname === "\/"/);
  assert.match(sidebar, /onNewChat\(\); close\(\);/);
});

test("루트 loading.tsx는 안내 카드와 스켈레톤을 공유한다", () => {
  assert.match(read("app/loading.tsx"), /<RouteLoadingFrame section="웅이연구소 화면"\s*\/>/);
  const frame = read("components/route-loading-frame.tsx");
  assert.match(frame, /role="status"/);
  assert.match(frame, /aria-busy="true"/);
  assert.match(frame, /motion-safe:animate-pulse/);
  assert.match(frame, /motion-safe:animate-spin/);
  assert.doesNotMatch(frame, /WorkspaceShell|AppSidebar/);
});

test("가이드 로딩과 상세 페이지 Suspense는 카드·스켈레톤 UI를 사용한다", () => {
  assert.match(read("app/(workspace)/guides/loading.tsx"), /<GuideRouteLoading\s*\/>/);
  const guide = read("components/guide-route-loading.tsx");
  assert.match(guide, /className="guide-route-loading" role="status" aria-live="polite" aria-busy="true"/);
  assert.match(guide, /className="tool-app-loading-spinner" aria-hidden="true"/);
  assert.match(guide, /rounded-\[28px\]/);
  assert.match(guide, /motion-safe:animate-pulse/);
});
