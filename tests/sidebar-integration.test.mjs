import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
test("홈과 도구 상세 화면이 동일한 사이드바 컴포넌트를 사용한다", () => {
  assert.match(read("components/tool-chat-home.tsx"), /<AppSidebar/);
  assert.match(read("components/tool-page-shell.tsx"), /<AppSidebar/);
  assert.match(read("app/tools/[slug]/page.tsx"), /<ToolPageShell/);
});
test("최근 사용한 도구 그룹은 비어 있으면 표시하지 않는다", () => {
  const src=read("components/app-sidebar.tsx");
  assert.match(src, /최근 사용한 도구/);
  assert.match(src, /recentIds\.length > 0/);
  assert.match(src, /favoriteIds\.length > 0/);
});
test("도구 상세 URL에 직접 접속한 경우에도 이전 화면으로 이동 가능", () => {
  const src=read("components/tool-page-shell.tsx");
  assert.match(src, /readToolReturn\(slug\)/);
  assert.match(src, /이전 화면으로/);
  assert.match(src, /visitRecentTool\(slug\)/);
  assert.match(read("components/tool-chat-home.tsx"), /get\("view"\)==="all"/);
  assert.match(read("components/tool-browse-page.tsx"), /saveToolReturn\(slug,"\/tools"\)/);
});
test("공유 사이드바 CSS가 홈과 상세 화면에 모두 제공된다", () => {
  assert.match(read("app/layout.tsx"), /import "\.\/chat\.css"/);
  assert.doesNotMatch(read("app/page.tsx"), /chat\.css/);
  const css=read("app/chat.css");
  assert.match(css,/\.tool-app-shell\{/);
  assert.match(css,/\.chat-sidebar-recent/);
});
