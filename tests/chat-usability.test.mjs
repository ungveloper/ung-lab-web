import { assertStyle } from "./_tailwind-contract.mjs";
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const src=(file)=>fs.readFileSync(path.join(root,file),'utf8');
test('미리보기 배너는 제거하되 SEO 색인 차단은 유지한다',()=>{
  const s=src('app/layout.tsx');
  assert.doesNotMatch(s,/className="prelaunch"/);
  assert.match(s,/NEXT_PUBLIC_LAUNCH_READY/);
  assert.match(s,/robots:/);
});
test('빈 대화는 중앙 배치, 메시지 이후는 하단으로 전환',()=>{
  const chat=src('components/tool-chat-home.tsx');
  assert.match(chat,/chat-conversation--empty/);
  assertStyle('.chat-conversation--empty','justify-content','center');
  assertStyle('.chat-conversation--empty .chat-messages','overflow','visible');
});

test('textarea 내용이 많아질 때 자동 높이를 계산하고 드래그 리사이즈는 금지',()=>{
  const tsx=src('components/tool-chat-home.tsx');
  assert.match(tsx,/field\.scrollHeight/);
  assert.match(tsx,/Math\.min\(fullHeight,160\)/);
  assertStyle('.chat-composer textarea','resize','none');
  assertStyle('.chat-composer','align-items','center');
});

test('모든 기능 보기 하단 여백을 데스크톱과 모바일에 확보한다',()=>{
  const frame=src("app/_components/common/page-frame.tsx");
  assert.match(frame, /pb-28/);
  assert.match(frame, /px-5/);
  assert.match(frame, /md:px-8/);
});

