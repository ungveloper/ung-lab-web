import { assertStyle, assertOnlyTailwindStylesheet } from "./_tailwind-contract.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("문의 폼은 iframe 없이 기본 문서 흐름에 위치한다", () => {
  const content = read("app/(workspace)/contact/page.tsx");
  assert.match(content, /id="contact-form"/);
  assert.match(content, /<ContactForm\s*\/>/);
  assert.doesNotMatch(content, /<iframe\b/i);
});

test("문의 페이지만 workspace 컨테이너의 숨겨진 스크롤을 해제한다",()=>{
  assertStyle('.workspace-page-body:has(#contact-form)','overflow-y','auto');
  assertStyle('.workspace-page-body:has(#contact-form)','min-height','0');
  assertStyle('.workspace-page-body:has(#contact-form) > .app-content-container','overflow','visible');
  assertOnlyTailwindStylesheet();
});

