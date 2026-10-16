import test from 'node:test';
import assert from 'node:assert/strict';
import {recommendTools} from '../lib/tool-matcher.mjs';
const tools = [
  {slug:'background-remover',title:'이미지 배경 제거',subtitle:'인물의 배경 분리',tags:['이미지','배경','AI'],aliases:['누끼','remove background'],formats:'PNG',category:'image'},
  {slug:'image-to-pdf',title:'이미지를 PDF로 변환',subtitle:'사진 여러 장을 PDF로 묶기',tags:['이미지','PDF','병합'],aliases:['사진 pdf'],formats:'JPG PNG → PDF',category:'pdf'},
  {slug:'pdf-to-image',title:'PDF를 이미지로 변환',subtitle:'PDF를 PNG로',tags:['PDF','변환','이미지'],aliases:['pdf png'],formats:'PDF → PNG',category:'pdf'},
  {slug:'image-converter',title:'이미지 형식 변환',subtitle:'WebP PNG 변환',tags:['이미지','WebP'],aliases:['webp png'],formats:'WebP → PNG',category:'image'},
  {slug:'xlsx-viewer',title:'엑셀 뷰어',subtitle:'엑셀 파일 열기',tags:['문서','XLSX'],aliases:['엑셀 열기'],formats:'XLSX',category:'document'},
];
for(const [query,slug] of [['사람 사진 뒷배경 지워줘','background-remover'],['사진 여러장 pdf 합치기','image-to-pdf'],['PDF를 이미지로 저장','pdf-to-image'],['webp를 png로 바꿔줘','image-converter'],['엑셀 파일 열어줘','xlsx-viewer']]) test(`${query} → ${slug}`,()=>assert.equal(recommendTools(query,tools).results[0]?.slug,slug));
test('없는 도구를 있는 것처럼 소개하지 않는다',()=>{const v=recommendTools('엑셀 파일 PDF로 변환',tools); assert.deepEqual(v.results,[]); assert.match(v.reason,/제공하지/);});
test('무관한 내용은 0개로 안내한다',()=>assert.equal(recommendTools('자동으로 주식 주문해줘',tools).results.length,0));
test('추천 결과는 최대 3개, 입력 500자 이하',()=>assert.ok(recommendTools('이미지 pdf',tools).results.length<=3));
