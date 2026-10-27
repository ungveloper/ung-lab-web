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

test("문의 페이지만 workspace 컨테이너의 숨겨진 스크롤을 해제한다", () => {
  const css = read("app/site-info.css");
  const block = css.slice(css.indexOf("UNGLAB_CONTACT_WORKSPACE_SCROLL_V1"));
  assert.ok(block.length > 100, "문의 스크롤 스타일을 찾을 수 없습니다.");
  assert.match(block, /\.workspace-page-body:has\(#contact-form\)/);
  assert.match(block, /overflow-y:\s*auto\s*!important/);
  assert.match(block, /min-height:\s*0\s*!important/);
  assert.match(block, /overflow:\s*visible\s*!important/);
  assert.match(read("app/layout.tsx"), /import "\.\/site-info\.css"/);
});
