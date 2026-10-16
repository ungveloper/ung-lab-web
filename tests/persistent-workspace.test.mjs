import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
const read=(name)=>readFileSync(new URL(`../${name}`,import.meta.url),"utf8");

const paths=["app/(workspace)/page.tsx","app/(workspace)/tools/page.tsx","app/(workspace)/guides/page.tsx","app/(workspace)/guides/[slug]/page.tsx"];
test("공통 route group이 홈페이지·도구 목록·가이드 목록과 상세에서 유지된다",()=>{
  for(const path of paths)assert.equal(existsSync(new URL(`../${path}`,import.meta.url)),true,path);
  for(const path of ["app/page.tsx","app/tools/page.tsx","app/guides/page.tsx","app/guides/layout.tsx","components/app-list-shell.tsx","components/guide-shell.tsx"])
    assert.equal(existsSync(new URL(`../${path}`,import.meta.url)),false,path);
  assert.match(read("app/(workspace)/layout.tsx"),/<WorkspaceShell>\{children\}<\/WorkspaceShell>/);
});
test("사이드바·상단 헤더는 공통 shell에 단 한 번만 존재한다",()=>{
  const shell=read("components/workspace-shell.tsx");
  assert.match(shell,/<AppSidebar mode=\{mode\}/);
  assert.match(shell,/<header className="chat-topbar workspace-topbar">/);
  assert.match(shell,/workspace-page-body/);
  assert.match(shell,/useSelectedLayoutSegment\(\)/);
  assert.match(shell,/catalog=\{catalog\}/);
  for(const file of ["components/tool-chat-home.tsx","components/tool-browse-page.tsx"]){
    const page=read(file);
    assert.doesNotMatch(page,/<AppSidebar|<AppListShell|<header className="chat-topbar/);
  }
});
test("새 대화 버튼은 공통 쉘에서 초기화되며 채팅 UI가 구독한다",()=>{
  const shell=read("components/workspace-shell.tsx");
  const chat=read("components/tool-chat-home.tsx");
  assert.match(shell,/window\.dispatchEvent\(new Event\("ung-lab:new-chat"\)\)/);
  assert.match(chat,/window\.addEventListener\("ung-lab:new-chat"/);
  assert.match(shell,/router\.push\("\/"\)/);
});
test("가이드 로딩은 사이드바 밖이 아닌 교체되는 본문 안에 있다",()=>{
  assert.match(read("app/(workspace)/guides/loading.tsx"),/<GuideRouteLoading\/>/);
  assert.match(read("components/workspace-shell.tsx"),/\{children\}/);
  assert.match(read("app/chat.css"),/\.workspace-page-body--chat\{overflow:hidden/);
  assert.match(read("app/chat.css"),/\.workspace-page-body\{[^}]*flex:1/);
});

// Prevent regression: an unused variable in migrated test code blocks strict lint.
test("공통 레이아웃 테스트에 사용하지 않는 home 임시 변수가 남지 않는다",()=>{
  const source=read("tests/shared-layout.test.mjs");
  assert.doesNotMatch(source,/\bconst home=read\(/);
  assert.match(source,/workspace-shell\.tsx/);
});
