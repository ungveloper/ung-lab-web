import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {featureRequestSubject} from "../lib/feature-request.mjs";
const read=(p)=>readFileSync(new URL(`../${p}`,import.meta.url),"utf8");

test("추천 도구는 카드 높이를 내용에 맡기는 flex 구조를 쓴다",()=>{
  const card=read("app/_components/chat/chat-tool-result-card.tsx");
  const chat=read("components/tool-chat-home.tsx");
  assert.match(card,/chat-result-card flex w-full min-w-0 shrink-0 items-center/);
  assert.match(card,/min-w-0 flex-1 items-center/);
  assert.match(card,/size-11 shrink-0/);
  assert.match(card,/chat-result-copy flex min-w-0 flex-1 flex-col/);
  assert.match(card,/chat-result-tags truncate text-xs/);
  assert.match(chat,/chat-thread mx-auto flex w-full min-w-0 flex-col/);
  assert.match(chat,/chat-result-grid mt-4 flex w-full min-w-0 flex-col/);
  assert.doesNotMatch(card,/grid-template-columns|grid-column|grid-row/);
});

test("정확히 일치하지 않는 기능 요청에는 무관한 추천 카드 대신 제안 CTA를 보여준다",()=>{
  const chat=read("components/tool-chat-home.tsx");
  assert.match(chat,/const alternatives=results.length\|\|canPropose\?null:suggestFallbackTools/);
  assert.match(chat,/canPropose\s*\?\s*\(reason/);
  assert.match(chat,/<FeatureRequestAction/);
  assert.match(chat,/<ChatToolResultCard key=\{slug\} tool=\{tool\}\/>/);
});

test("기능 제안 문의 제목은 원문과 목적을 함께 표시한다",()=>{
  assert.equal(featureRequestSubject("햄버거 만들기"),"햄버거 만들기 기능 추가 제안");
  assert.equal(featureRequestSubject("PDF 파일 압축해줘"),"PDF 파일 압축해줘 기능 추가 제안");
  const longTitle=featureRequestSubject("가".repeat(180));
  assert.equal(longTitle.length,120);
  assert.ok(longTitle.endsWith(" 기능 추가 제안"));
});
