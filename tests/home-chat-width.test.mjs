import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const chat = readFileSync(new URL("../components/tool-chat-home.tsx", import.meta.url), "utf8");
const frame = readFileSync(new URL("../components/app-content-container.tsx", import.meta.url), "utf8");

test("홈 대화 컨테이너는 grid auto-size가 아닌 flex 기반으로 가로 폭을 채운다", () => {
  const main = chat.match(/return <main className=\{`([^\n]+?)`\} aria-label="도구 찾기 대화"/);
  assert.ok(main, "홈 chat main의 Tailwind 클래스가 필요합니다");
  assert.match(main[1], /\bflex\s+flex-1\s+flex-col\b/);
  assert.match(main[1], /\bitems-stretch\s+w-full\b/);
  assert.doesNotMatch(main[1], /\bgrid\s+\[place-items:center\]/);
});

test("대화 입력 및 예시는 고정 폭으로 축소되지 않고 공통 최대 너비를 사용한다", () => {
  assert.match(chat, /chat-empty-center mx-auto! w-full! max-w-\[1040px\]!/);
  assert.match(chat, /chat-empty-center[^\n]+\bpx-5\s+py-0\s+md:px-8/);
  // The empty state may fill its *parent*; the active composer must not fill the entire workspace.
  assert.equal((chat.match(/chat-composer-area[^\n]+w-full! max-w-none! min-w-0/g) ?? []).length, 1);
  assert.equal((chat.match(/chat-composer w-full min-w-0/g) ?? []).length, 2);
  assert.match(chat, /chat-examples grid[^\n]+\[\.chat-empty-center_&\]:w-full/);
  assert.match(frame, /app-content-container/);
});

test("홈 입력창 수정은 공통 페이지 프레임이나 문의 페이지에 영향을 주지 않는다", () => {
  assert.match(chat, /chat-composer-area/);
  assert.match(chat, /chat-thread/);
  assert.match(chat, /ung-lab:new-chat/);
  assert.match(chat, /onSubmit=\{onSubmit\}/);
  assert.match(chat, /max-\[720px\]/);
});

test("첫 메시지 후 하단 입력창은 공통 1040px 폭·반응형 내부 패딩을 지킨다", () => {
  const afterConversation = chat.slice(chat.indexOf('chat-messages flex-1'));
  assert.match(afterConversation, /chat-composer-area mx-auto! w-full! max-w-\[1040px\]!/);
  assert.match(afterConversation, /bg-white px-5 pb-\[max\(15px,env\(safe-area-inset-bottom\)\)\] md:px-8/);
  assert.doesNotMatch(afterConversation, /chat-composer-area[^\n]*max-w-none!/);
  assert.match(afterConversation, /chat-composer w-full min-w-0/);
});
