import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const root=path.resolve(import.meta.dirname,'..');
const data=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const pkg=data('package.json');
const lock=data('package-lock.json');
const ver=s=>String(s).split('.').map(x=>Number(x));
const atLeast=(s,required)=>{const a=ver(s),b=ver(required);for(let i=0;i<3;i++){if(a[i]!==b[i])return a[i]>b[i]}return true};
test('Next, PDF.js의 보안 수정 버전을 잠금 파일에 유지한다',()=>{
 for(const [dep,v] of [['next','16.4.3'],['pdfjs-dist','6.2.108']]){
  assert.equal(pkg.dependencies[dep],v);
  assert.equal(lock.packages[`node_modules/${dep}`]?.version,v);
 }
});
test('Transformers의 sharp과 ExcelJS의 uuid가 보안 버전으로 고정된다',()=>{
 assert.equal(pkg.overrides?.sharp,'0.35.5');
 assert.equal(pkg.overrides?.exceljs?.uuid,'11.1.1');
 // Inspect EVERY sharp copy, not just the transformer's guessed location.
 const sharpCopies=Object.entries(lock.packages).filter(([where])=>where==='node_modules/sharp'||where.endsWith('/node_modules/sharp'));
 assert.ok(sharpCopies.length>0,'잠금 파일에 sharp 항목이 없음');
 for(const [where,dep] of sharpCopies){
  assert.ok(atLeast(dep.version,'0.35.5'),`${where} → sharp@${dep.version}는 보안 기준 0.35.5 미만`);
 }
 const resolved=(parent,mod)=>lock.packages[`node_modules/${parent}/node_modules/${mod}`]
   ??lock.packages[`node_modules/${mod}`];
 const dep=resolved('exceljs','uuid');
 assert.ok(dep,'exceljs의 uuid 잠금 항목을 찾을 수 없음');
 assert.ok(atLeast(dep.version,'11.1.1'),`exceljs → uuid@${dep.version}는 안전 기준 11.1.1 미만`);
});
test('Transformers에서 sharp 네이티브 이미지를 처리할 수 있다',async()=>{
 const fromTransformers=createRequire(path.join(root,'node_modules','@huggingface','transformers','package.json'));
 const sharp=fromTransformers('sharp');
 assert.equal(typeof sharp,'function');
 const out=await sharp({create:{width:2,height:2,channels:4,background:{r:70,g:110,b:170,alpha:1}}}).png().toBuffer();
 assert.ok(out.byteLength>0,'sharp가 PNG를 만들지 못했습니다.');
});
test('PDF.js API는 기존 도구에서 사용할 수 있는 getDocument를 제공한다',async()=>{
 const pdf=await import('pdfjs-dist/legacy/build/pdf.mjs');
 assert.equal(typeof pdf.getDocument,'function');
 assert.ok('GlobalWorkerOptions' in pdf);
});
test('ExcelJS의 기본 XLSX 작성·읽기 기능은 안전한 uuid로 동작한다',async()=>{
 const ExcelJS=(await import('exceljs')).default;
 const wb=new ExcelJS.Workbook();
 wb.addWorksheet('확인').getCell('A1').value='한글 테스트';
 const bytes=await wb.xlsx.writeBuffer();
 const roundTrip=new ExcelJS.Workbook();
 await roundTrip.xlsx.load(bytes);
 assert.equal(roundTrip.getWorksheet('확인').getCell('A1').value,'한글 테스트');
 const req=createRequire(createRequire(import.meta.url).resolve('exceljs'));
 const uuid=req('uuid');
 assert.equal(typeof uuid.v4,'function');
});
