import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('..', import.meta.url)));
const globalCss=readFileSync(resolve(root,'app/globals.css'),'utf8');
const chatCss=readFileSync(resolve(root,'app/chat.css'),'utf8');

test('기본 본문과 상세 작업 화면에서 읽기 쉬운 글자 크기 적용',()=>{
  assert.match(globalCss,/font-size:16px;line-height:1\.55/);
  assert.match(globalCss,/\.tool-card h3\{font-size:18px/);
  assert.match(globalCss,/\.tool-intro p\{font-size:16px/);
  assert.match(globalCss,/\.settings-grid label,\.settings-line label\{font-size:14px/);
});
test('채팅·검색 카드의 본문, 라벨, 태그 크기 상향',()=>{
  assert.match(chatCss,/\.chat-message-body>p\{font-size:16px/);
  assert.match(chatCss,/\.chat-result-copy strong\{font-size:16px/);
  assert.match(chatCss,/\.chat-result-tags\{[^}]*font-size:12px/);
  assert.match(chatCss,/\.chat-composer textarea\{[^}]*font-size:16px!important/);
});
test('사이드바 글자 확대와 너비 보정, 작은 화면 레이아웃 유지',()=>{
  assert.match(chatCss,/\.chat-sidebar\{flex:0 0 278px;width:278px/);
  assert.match(chatCss,/\.chat-sidebar\{flex-basis:236px;width:236px/);
  assert.match(chatCss,/\.chat-home--compact \.chat-sidebar\{width:278px;flex-basis:278px/);
  assert.match(chatCss,/\.chat-result-card\{[^}]*display:grid;grid-template-columns:minmax\(0,1fr\) 62px/);
  assert.match(chatCss,/@media\(max-width:720px\)/);
});
test('작은 안내 문구는 11px 이상, 모바일 터치 영역과 입력 자동높이를 유지',()=>{
  for(const css of [globalCss,chatCss]){
    for(const m of css.matchAll(/font-size:(\d+)px/g))assert.ok(Number(m[1])>=11,`font size too small: ${m[1]}px`);
  }
  assert.match(chatCss,/\.chat-composer textarea\{[^}]*max-height:160px/);
  assert.match(chatCss,/\.chat-composer button\{[^}]*width:37px;height:37px/);
});
