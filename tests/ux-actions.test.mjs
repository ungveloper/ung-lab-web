import { assertStyle } from "./_tailwind-contract.mjs";
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const content = (name) => readFileSync(join(root, name), 'utf8');

test('추천 카드의 별표와 이동 링크는 독립된 레이아웃 영역을 갖는다',()=>{
  assertStyle('.chat-result-card','grid-template-columns','minmax(0,1fr) 62px');
  assertStyle('.chat-result-card .favorite-button','position','static');
  assertStyle('.chat-result-card>a','border-right','0');
  const jsx=content('components/tool-chat-home.tsx');
  assert.match(jsx, /chat-result-open/);
  assert.match(jsx, /<FavoriteButton slug=\{tool\.slug\}/);
});

test('사이드바 접기와 펼치기는 실제 상태별 아이콘과 레이블을 변경한다', () => {
  const jsx = content('components/app-sidebar.tsx');
  assert.match(jsx, /PanelLeftClose, PanelLeftOpen/);
  assert.match(jsx, /collapsed \? <PanelLeftOpen size=\{18\}\/> : <PanelLeftClose size=\{18\}\/>/);
  assert.match(jsx, /collapsed \? "사이드바 펼치기" : "사이드바 접기"/);
});

test('도구 페이지 로딩은 중앙 spinner와 스크린리더 상태를 제공한다',()=>{
  const jsx = content('app/tools/[slug]/page.tsx');
  assert.match(jsx, /Suspense fallback=/);
  assert.match(jsx, /tool-app-loading-spinner/);
  assert.match(jsx, /role="status" aria-busy="true"/);
  assertStyle('.tool-app-loading','min-height','100dvh');
  assertStyle('.tool-app-loading','justify-content','center');
});

test('반복 안내 대신 행동 중심 레이아웃을 제공하고 정책을 문서화한다', () => {
  const jsx = content('components/tool-chat-home.tsx');
  const page = content('app/tools/[slug]/page.tsx');
  const agents = content('AGENTS.md');
  assert.doesNotMatch(jsx, /실제 AI 대화나 파일 자동 처리는 지원하지 않습니다/);
  assert.doesNotMatch(page, /3단계로 쉽게 사용하기|자주 묻는 질문|파일은 브라우저 안에서 처리됩니다/);
  assert.match(agents, /행동 우선/);
  assert.match(agents, /법적 의무 안내, 개인정보/);
  assert.match(agents, /후속 패치/);
});
