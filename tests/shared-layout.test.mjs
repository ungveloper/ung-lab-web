import { assertStyle } from "./_tailwind-contract.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=(path)=>readFileSync(new URL(`../${path}`,import.meta.url),"utf8");

test("Shared content frame uses one responsive max-width",()=>{
  const component=read("components/app-content-container.tsx");
  assert.match(component,/app-content-container/);
  assertStyle('.app-content-container','--app-content-max-width','1040px');
  assertStyle('.app-content-container','width','calc(100% - 32px)','720px');
});

test("Chat, browse and both guide routes all use the same frame",()=>{
  const chat=read("components/tool-chat-home.tsx");
  const browsePage=read("components/tool-browse-page.tsx");
  const browse=read("components/guide-browser.tsx");
  const article=read("app/(workspace)/guides/[slug]/page.tsx");
  for(const name of ["chat-empty-center","chat-thread","chat-composer-area"])
    assert.ok(chat.includes(name),name);
  assert.match(browsePage,/chat-browse-content/);
  assert.match(browse,/guide-browser/);
  assert.match(article,/guide-article-page/);
});

test("Duplicate all-tools action is absent from every header; sidebar navigation remains",()=>{
  const sidebar=read("components/app-sidebar.tsx");
  assert.match(sidebar,/모든 기능 보기/);
  assert.match(sidebar,/chat-side-link/);
  assert.match(read("components/workspace-shell.tsx"),/chat-menu-button/);
  assert.doesNotMatch(read("components/tool-page-shell.tsx"),/모든 기능 보기<\/span>/);
});

test("Mobile browse and guides share horizontal margin policy",()=>{
  const frame = read("app/_components/common/page-frame.tsx");
  assert.match(frame, /px-5/);
  assert.match(frame, /md:px-8/);
  for(const name of ["components/tool-browse-page.tsx", "components/guide-browser.tsx", "app/(workspace)/guides/[slug]/page.tsx"])
    assert.match(read(name), /<PageFrame/);
});

