import { assertStyle } from "./_tailwind-contract.mjs";
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
function* tsxFiles(dir){
 if(!fs.existsSync(dir))return;
 for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  const p=path.join(dir,e.name);
  if(e.isDirectory())yield* tsxFiles(p);
  else if(/\.(tsx|jsx)$/.test(e.name))yield p;
 }
}
test('기존 플라스크 브랜드 아이콘은 런타임 JSX에서 제거됨',()=>{
 for(const dir of ['app','components','lib']){
  for(const f of tsxFiles(path.join(root,dir))){
   assert.doesNotMatch(fs.readFileSync(f,'utf8'),/\bFlaskConical\b/,`기존 아이콘 잔존: ${f}`);
  }
 }
});
test('720:166 공식 로고와 favicon만 브랜드로 사용',()=>{
 const brand=read('components/brand-identity.tsx');
 assert.match(brand,/width=\{720\} height=\{166\}/);
 assert.match(brand,/\/images\/brand\/logo\.png/);
 assert.match(brand,/\/android-chrome-192x192\.png/);
 assert.ok(fs.existsSync(path.join(root,'public/images/brand/logo.png')));
 assert.ok(fs.existsSync(path.join(root,'public/android-chrome-192x192.png')));
});
test('Next.js 버전과 lockfile은 16.4.3으로 함께 고정됨',()=>{
 const pkg=JSON.parse(read('package.json'));
 const lock=JSON.parse(read('package-lock.json'));
 assert.equal(pkg.dependencies.next,'16.4.3');
 assert.equal(lock.packages['node_modules/next']?.version,'16.4.3');
});
test('기능 아이콘을 무조건 삭제하지 않음',()=>{
  assert.match(read('components/brand-identity.tsx'),/BrandSymbol/);
  assertStyle('.brand-wordmark','aspect-ratio','720/166');
});

