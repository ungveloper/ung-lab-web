import { assertStyle } from "./_tailwind-contract.mjs";
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {choosePromptQuestions,DEFAULT_PROMPTS} from '../lib/tool-prompts.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const src=(relative)=>fs.readFileSync(path.join(root,relative),'utf8');

test('관리자 설정 기본 질문 4개',()=>{
  assert.equal(choosePromptQuestions(DEFAULT_PROMPTS).length,4);
  assert.deepEqual(choosePromptQuestions(DEFAULT_PROMPTS),DEFAULT_PROMPTS.map(x=>x.question));
});
test('실제 많이 입력된 도구별 질문 유형이 우선한다',()=>{
  const rows=[...DEFAULT_PROMPTS,{slug:'image-compressor',question:'이미지 용량 줄여줘',question_count:7,display_order:20}];
  const res=choosePromptQuestions(rows);
  assert.equal(res[0],'이미지 용량 줄여줘');
  assert.equal(res.length,4);
});
test('질문 유형을 중복 노출하지 않고, 이상한 문구는 제외',()=>{
  const rows=[...DEFAULT_PROMPTS,DEFAULT_PROMPTS[0],{slug:'x',question:'',is_default:true,display_order:-1}];
  assert.equal(choosePromptQuestions(rows).length,4);
});
test('홈은 첫 입력 영역을 독립된 중앙 그룹으로 묶는다',()=>{
  const jsx=src('components/tool-chat-home.tsx');
  assert.match(jsx,/chat-empty-center/);
  assertStyle('.chat-conversation--empty','display','grid');
  assertStyle('.chat-conversation--empty','place-items','center');
  assertStyle('.chat-empty-center .chat-composer-area','width','100%');
  assert.match(jsx,/chat-examples/);
});

test('카드 왼쪽 별표 오른쪽 화살표가 독립된 클릭 표면을 가진다',()=>{
  const jsx=src('components/tool-chat-home.tsx');
  assertStyle('.chat-result-card','grid-template-columns','minmax(0,1fr) 62px');
  assert.ok(jsx.indexOf('<FavoriteButton slug={tool.slug}')<jsx.indexOf('<Link href={`/tools/${tool.slug}`} aria-label='));
});

test('가이드 목록, 상세 모두 사이드바 공유, 3열 및 검색',()=>{
  assert.match(src('app/(workspace)/layout.tsx'),/<WorkspaceShell>\{children\}<\/WorkspaceShell>/);
  assert.match(src('components/guide-browser.tsx'),/type="search"/);
  assert.match(src('components/workspace-shell.tsx'),/<AppSidebar mode={mode}/);
  assert.match(src("components/guide-browser.tsx"), /lg:grid-cols-3/);
});

test('도구별 질문 유형만 서버에 전달하고 원문을 DB에 남기지 않는다',()=>{
  const chat=src('components/tool-chat-home.tsx');const api=src('app/api/tool-prompts/route.ts');const sql=src('supabase/004_tool_prompt_options.sql');
  assert.match(chat,/body:JSON\.stringify\(\{slug:results\[0\]\.slug\}\)/);
  assert.doesNotMatch(sql,/prompt_text|raw_query|ip_address/);
  assert.match(sql,/create policy "Read enabled prompt options"/);
  assert.match(api,/allowed\.has\(slug\)/);
  assert.match(api,/request\.headers\.get\("origin"\)/);
  assert.doesNotMatch(api,/request\.formData/);
});
