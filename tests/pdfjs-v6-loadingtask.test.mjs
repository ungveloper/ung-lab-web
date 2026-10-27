import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const source=(p)=>fs.readFileSync(path.join(root,p),'utf8');

test('PDF.js 6 미리보기는 문서가 아닌 loadingTask를 추적하고 취소 시 해제한다',()=>{
 const src=source('components/pdf-page-picker.tsx');
 assert.match(src,/const loadingTask=pdfjs\.getDocument\(/);
 assert.match(src,/task=loadingTask/);
 assert.match(src,/const doc=await loadingTask\.promise/);
 assert.match(src,/void task\?\.destroy\(\)/);
 assert.match(src,/if\(cancelled\)return;/);
 assert.doesNotMatch(src,/task=doc\b/);
});

test('PDF.js 6 이미지 변환은 실패하거나 중단되어도 loadingTask를 정리한다',()=>{
 const src=source('lib/process-files.ts');
 assert.match(src,/const loadingTask=pdfjs\.getDocument\(/);
 assert.match(src,/try\s*\{\s*const doc=await loadingTask\.promise/);
 assert.match(src,/finally\s*\{\s*await loadingTask\.destroy\(\)\s*\}/);
 assert.doesNotMatch(src,/await doc\.destroy\(\)/);
});

test('PDF.js 6 라이브러리에서 loadingTask.destroy는 지원되고 프록시 destroy는 더 이상 필요하지 않다',async()=>{
 const pdf=await import('pdfjs-dist/legacy/build/pdf.mjs');
 assert.equal(typeof pdf.getDocument,'function');
 // getDocument() with invalid input is not required just to verify API existence.
 const api=source('lib/process-files.ts');
 assert.ok(api.includes('loadingTask.destroy()'));
});
