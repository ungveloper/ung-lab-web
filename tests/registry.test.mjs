import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');

test('정확히 11개 도구를 등록한다',()=>{
  const source=fs.readFileSync(path.join(root,'lib/tools.ts'),'utf8');
  const slugs=[...source.matchAll(/\{slug:"([^"]+)"/g)].map(match=>match[1]);
  assert.equal(slugs.length,11);
  assert.equal(new Set(slugs).size,11);
  for(const required of ['image-converter','pptx-viewer','background-remover','csv-viewer'])assert.ok(slugs.includes(required));
});

test('WebP to PNG 변환을 포함한다',()=>{
  const source=fs.readFileSync(path.join(root,'lib/tools.ts'),'utf8');
  assert.match(source,/WebP → PNG/);
});

test('출시 전 색인 차단, 파일 업로드 API 금지, 읽기 전용 카탈로그 API 허용',()=>{
  const robots=fs.readFileSync(path.join(root,'app/robots.ts'),'utf8');
  assert.match(robots,/NEXT_PUBLIC_LAUNCH_READY/);
  const apiRoot=path.join(root,'app/api');
  assert.deepEqual(fs.readdirSync(apiRoot),['tool-catalog']);
  const route=fs.readFileSync(path.join(apiRoot,'tool-catalog/route.ts'),'utf8');
  assert.match(route,/export async function GET/);
  assert.doesNotMatch(route,/\b(?:POST|PUT|PATCH|DELETE)\b/);
});

test('기본 파일 처리에서 업로드 fetch API를 사용하지 않는다',()=>{
  for(const file of ['components/tool-workspace.tsx','lib/process-files.ts']){
    const source=fs.readFileSync(path.join(root,file),'utf8');
    assert.doesNotMatch(source,/\bfetch\s*\(/);
  }
});
