import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join,dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { removeRecentToolId, clearRecentToolIds } from '../lib/recent-tools-state.mjs';
import { suggestFallbackTools,popularitySlugs } from '../lib/tool-fallback.mjs';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const get=(file)=>readFileSync(join(root,file),'utf8');
const catalog=[
  {slug:'image-compressor',title:'이미지 최적화',subtitle:'사진 용량 줄이기',category:'image',tags:['이미지','압축'],aliases:['사진 압축'],formats:'PNG JPG',featured:true},
  {slug:'image-resizer',title:'이미지 크기 변경',subtitle:'가로 세로 픽셀 수정',category:'image',tags:['이미지','크기'],aliases:['리사이즈'],formats:'PNG JPG',featured:false},
  {slug:'background-remover',title:'이미지 배경 제거',subtitle:'인물 배경 투명하게',category:'image',tags:['누끼'],aliases:['누끼 따기'],formats:'PNG',featured:false},
  {slug:'pdf-to-image',title:'PDF 이미지 변환',subtitle:'PDF 페이지를 PNG로',category:'pdf',tags:['PDF','PNG'],aliases:['피디에프 이미지'],formats:'PDF PNG',featured:true},
  {slug:'xlsx-viewer',title:'엑셀 뷰어',subtitle:'엑셀 읽기',category:'document',tags:['엑셀'],aliases:['엑셀 열기'],formats:'XLSX',featured:true},
];
test('최근 항목을 선택적으로 제거하고, 전체 지우기는 다른 저장 기능에 영향 없음',()=>{
  const current=['image-compressor','background-remover','pdf-to-image'];
  assert.deepEqual(removeRecentToolId(current,'background-remover'),['image-compressor','pdf-to-image']);
  assert.deepEqual(removeRecentToolId(current,'missing'),current);
  assert.deepEqual(clearRecentToolIds(current),[]);
  assert.deepEqual(current,['image-compressor','background-remover','pdf-to-image']);
});
test('짧은 무의미 입력에는 실제 인기 데이터가 없으면 추천 도구가 나온다',()=>{
  const x=suggestFallbackTools('ㅋㅋ',catalog,{});
  assert.equal(x.label,'추천 도구');assert.deepEqual(x.tools.map(v=>v.slug),['image-compressor','pdf-to-image','xlsx-viewer']);
});
test('짧은 무의미 입력에는 사용량 10회 이상부터 실제 순위로 표시한다',()=>{
  const x=suggestFallbackTools('ㅋㅋ',catalog,{'background-remover':13,'pdf-to-image':4});
  assert.equal(x.label,'많이 사용한 도구');assert.deepEqual(x.tools.map(v=>v.slug).slice(0,2),['background-remover','pdf-to-image']);
});
test('이미지 관련 표현은 전체 인기 순위보다 관련 도구를 먼저 보여준다',()=>{
  const x=suggestFallbackTools('사진에 관한 기능',catalog,{'pdf-to-image':200});
  assert.equal(x.label,'관련 도구');assert.ok(x.tools.every(v=>v.category==='image'));
});
test('정확한 변환 도구가 없더라도 유사 파일 타입을 기준으로 대안을 제공한다',()=>{
  const x=suggestFallbackTools('엑셀에서 PDF 바꾸기',catalog,{});
  assert.equal(x.label,'관련 도구');assert.ok(x.tools.find(v=>v.slug==='xlsx-viewer'));
});
test('최소 데이터가 쌓이기 전에는 인기 순위로 오인하지 않는다',()=>{
  assert.deepEqual(popularitySlugs({'background-remover':9},catalog.map(v=>v.slug)),[]);
  assert.deepEqual(popularitySlugs({'background-remover':10,'pdf-to-image':2},catalog.map(v=>v.slug)),['background-remover','pdf-to-image']);
});
test('브라우저에서 최근 목록을 지우는 버튼과 세션 저장 알림을 사용한다',()=>{
  const jsx=get('components/app-sidebar.tsx'),hook=get('lib/use-recent-tools.ts');
  assert.match(jsx,/최근 목록에서 제거/);assert.match(jsx,/전체 지우기/);assert.match(jsx,/removeRecentTool\(slug\)/);
  assert.match(hook,/sessionStorage\.setItem/);assert.match(hook,/RECENT_TOOLS_EVENT/);
});
test('검색 실패시에도 추천 카드로 이어지고 실제 카운트가 있을 때만 인기 레이블을 사용한다',()=>{
  const chat=get('components/tool-chat-home.tsx'),browse=get('components/tool-explorer.tsx');
  assert.match(chat,/suggestFallbackTools/);assert.match(chat,/slugs:shown\.map/);
  assert.match(browse,/actualPopular\.length\?"많이 사용한 도구":"추천 도구"/);
});
test('통계는 서버에서만 쓰고 원본 파일이나 채팅 메시지는 보내지 않는다',()=>{
  const api=get('app/api/tool-popularity/route.ts');const cli=get('lib/tool-popularity-client.ts');const sql=get('supabase/003_tool_popularity.sql');
  assert.match(api,/SUPABASE_ANALYTICS_SECRET_KEY/);assert.match(api,/request\.cookies/);assert.match(api,/sec-fetch-site/);
  assert.match(cli,/JSON\.stringify\(\{slug\}\)/);assert.doesNotMatch(cli,/file\.|chatText|promptText/);
  assert.match(sql,/security invoker/);assert.match(sql,/grant execute on function public\.record_tool_visit\(text\) to service_role/);
  assert.match(sql,/revoke all on function public\.record_tool_visit\(text\) from public, anon, authenticated/);
});
