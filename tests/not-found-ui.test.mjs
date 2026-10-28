import { assertStyle, assertOnlyTailwindStylesheet } from "./_tailwind-contract.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("알 수 없는 URL은 공통 사이드바를 포함한 404 레이아웃으로 렌더링한다", () => {
  const root = read("app/not-found.tsx");
  assert.match(root, /WorkspaceShell/);
  assert.match(root, /<WorkspaceShell>\s*<NotFoundContent\s*\/>\s*<\/WorkspaceShell>/);
  const nested = read("app/(workspace)/not-found.tsx");
  assert.match(nested, /NotFoundContent/);
  assert.doesNotMatch(nested, /<WorkspaceShell\b/);
  assert.match(read("app/(workspace)/layout.tsx"), /WorkspaceShell/);
});

test("404 디자인은 CSS 모듈이 아닌 root layout 공통 CSS에서 로드한다",()=>{
  assertOnlyTailwindStylesheet();
  const content = read("components/not-found-content.tsx");
  assert.doesNotMatch(content,/\.module\.css/);
  assert.match(content,/ungnf__hero/);
  assert.match(content,/ungnf__actions/);
  assertStyle('.ungnf__hero','border-radius','26px');
  assertStyle('.ungnf .ungnf__button--primary','color','#fff');
  assertStyle('.ungnf a:focus-visible','outline');
  assertStyle('.ungnf__hero','padding','30px 18px','640px');
});

test("404 페이지에서 홈, 전체 도구, 가이드, 문의로 이동할 수 있다", () => {
  const source = read("components/not-found-content.tsx");
  assert.match(source, /href="\/"/);
  assert.match(source, /href="\/tools"/);
  assert.match(source, /href:\s*"\/tools"/);
  assert.match(source, /href:\s*"\/guides"/);
  assert.match(source, /href:\s*"\/contact"/);
  assert.match(source, /<Link href=\{href\}/);
  assert.match(source, /페이지를 찾을 수 없습니다/);
  assert.match(source, /홈으로 돌아가기/);
  assert.match(source, /전체 도구 살펴보기/);
});
