import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=(path)=>readFileSync(new URL(`../${path}`,import.meta.url),"utf8");

test("Shared content frame uses one responsive max-width",()=>{
  const component=read("components/app-content-container.tsx");
  const css=read("app/chat.css");
  assert.match(component,/className=\{`app-content-container/);
  assert.match(css,/\.app-content-container\{--app-content-max-width:1040px/);
  assert.match(css,/@media\(max-width:720px\)\{\.app-content-container\{width:calc\(100% - 32px\)/);
});

test("Chat, browse and both guide routes all use the same frame",()=>{
  const chat=read("components/tool-chat-home.tsx");
  const browsePage=read("components/tool-browse-page.tsx");
  const browse=read("components/guide-browser.tsx");
  const article=read("app/(workspace)/guides/[slug]/page.tsx");
  for(const name of ["chat-empty-center","chat-thread","chat-composer-area"])
    assert.ok(chat.includes(`<AppContentContainer className="${name}">`),name);
  assert.match(browsePage,/<AppContentContainer className="chat-browse-content">/);
  assert.match(browse,/<AppContentContainer as="main" className="guide-browser">/);
  assert.match(article,/<AppContentContainer as="main" className="guide-article-page">/);
});

test("Duplicate all-tools action is absent from every header; sidebar navigation remains",()=>{
  for(const path of ["components/tool-chat-home.tsx","components/workspace-shell.tsx","components/tool-page-shell.tsx"])
    assert.doesNotMatch(read(path),/chat-browse-button|모든 기능 보기<\/span>/,path);
  const sidebar=read("components/app-sidebar.tsx");
  assert.match(sidebar,/모든 기능 보기/);
  assert.match(sidebar,/chat-side-link/);
  assert.match(read("components/workspace-shell.tsx"),/chat-menu-button/);
});

test("Mobile browse and guides share horizontal margin policy",()=>{
  const css=read("app/chat.css");
  assert.match(css,/\.chat-browse-page\{padding:17px 0 110px/);
  assert.match(css,/\.guide-browser,\.guide-article-page\{padding:25px 0 100px/);
  assert.doesNotMatch(css,/width:min\(1170px|width:min\(790px/);
});
