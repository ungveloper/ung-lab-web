import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {safeReturnTarget} from "../lib/recent-tools-state.mjs";
const read=(path)=>readFileSync(new URL(`../${path}`,import.meta.url),"utf8");

test("All tools is an independent route and uses the common app list shell",()=>{
  const page=read("app/tools/page.tsx");
  const directory=read("components/tool-browse-page.tsx");
  const shell=read("components/app-list-shell.tsx");
  assert.match(page,/export default function Page/);
  assert.match(page,/<ToolBrowsePage\/>/);
  assert.match(directory,/<AppListShell mode="browse" catalog=\{catalog\}>/);
  assert.match(directory,/<AppContentContainer className="chat-browse-content">/);
  assert.match(shell,/<AppSidebar mode=\{mode\}/);
  assert.match(read("components/guide-shell.tsx"),/<AppListShell mode="guides">/);
});

test("Sidebar always navigates to /tools; homepage only renders chat",()=>{
  const sidebar=read("components/app-sidebar.tsx");
  const chat=read("components/tool-chat-home.tsx");
  assert.match(sidebar,/<Link href="\/tools"/);
  assert.match(sidebar,/mode === "browse" \? " is-selected"/);
  assert.doesNotMatch(sidebar,/onBrowse|href="\/\?view=all"/);
  assert.doesNotMatch(chat,/<ToolExplorer|chat-browse-page|setMode\("browse"\)/);
  assert.match(chat,/window\.location\.replace\("\/tools"\)/);
});

test("Direct tool navigation returns to standalone all-tools route",()=>{
  const directory=read("components/tool-browse-page.tsx");
  assert.match(directory,/saveToolReturn\(slug,"\/tools"\)/);
  assert.equal(safeReturnTarget("image-compressor","/tools"),"/tools");
  assert.equal(safeReturnTarget("image-compressor","/?view=all"),"/tools");
  assert.equal(safeReturnTarget("image-compressor","//evil.test"),null);
  assert.equal(safeReturnTarget("image-compressor","https://evil.test"),null);
});

test("Directory reuses Supabase and popularity sources, keeping local fallback",()=>{
  const directory=read("components/tool-browse-page.tsx");
  for(const part of ["/api/tool-catalog","/api/tool-popularity","popularitySlugs","useState<Tool[]>(tools)"]) assert.ok(directory.includes(part),part);
  const css=read("app/chat.css");
  assert.match(css,/\.app-content-container\{--app-content-max-width:1040px/);
  assert.match(css,/\.tools-app-shell \.chat-browse-page\{/);
});
