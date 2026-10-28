import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { assertStyle } from "./_tailwind-contract.mjs";
const read = file => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

test("기본 본문과 상세 작업 화면에서 읽기 쉬운 글자 크기 적용", () => {
  assert.match(read("app/layout.tsx"), /text-base/);
  assert.match(read("app/_components/tools/tool-card.tsx"), /text-lg/);
  assertStyle(".tool-intro p", "font-size", "16px");
  assertStyle(".settings-grid label", "font-size", "14px");
  assertStyle(".settings-line label", "font-size", "14px");
});
test("채팅·검색 카드의 본문, 라벨, 태그 크기 상향", () => {
  assertStyle(".chat-message-body>p", "font-size", "16px");
  const card=read("app/_components/chat/chat-tool-result-card.tsx");
  assert.match(card,/chat-result-copy/);
  assert.match(card,/text-base font-bold/);
  assert.match(card,/chat-result-tags truncate text-xs/);
  assertStyle(".chat-composer textarea", "font-size", "16px");
});
test("사이드바 글자 확대와 너비 보정, 작은 화면 레이아웃 유지", () => {
  assertStyle(".chat-sidebar", "width", "278px");
  assertStyle(".chat-sidebar", "width", "236px");
  assertStyle(".chat-home--compact .chat-sidebar", "width", "278px");
  assert.match(read("app/_components/chat/chat-tool-result-card.tsx"), /chat-result-card flex/);
});
test("작은 안내 문구는 11px 이상, 모바일 터치 영역과 입력 자동높이를 유지", () => {
  const manifest=JSON.parse(read("docs/tailwind-style-contract.json"));
  for(const item of manifest) {
    if(item.property==="font-size"&&/^\d+px$/.test(item.value))
      assert.ok(parseInt(item.value)>=11,`font too small: ${item.selector} ${item.value}`);
  }
  assertStyle(".chat-composer textarea", "max-height", "160px");
  assertStyle(".chat-composer button", "width", "37px");
});
