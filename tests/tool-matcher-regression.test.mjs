import test from 'node:test';
import assert from 'node:assert/strict';
import {recommendTools} from '../lib/tool-matcher.mjs';

const slugs = ['background-remover','image-to-pdf','pdf-to-image','image-converter','image-cropper','image-resizer','image-compressor','xlsx-viewer','csv-viewer','docx-viewer','pptx-viewer'];
const labels = {
  'background-remover':['이미지 배경 제거','AI로 인물 배경 분리',['이미지','배경','AI'],['누끼','remove background']],
  'image-to-pdf':['이미지를 PDF로 변환','사진을 PDF로 묶기',['이미지','PDF','변환'],['사진 pdf']],
  'pdf-to-image':['PDF를 이미지로 변환','PDF 페이지 PNG 추출',['PDF','이미지','변환'],['pdf png']],
  'image-converter':['이미지 형식 변환','WebP JPG PNG 형식 변경',['이미지','변환','WebP'],['webp png']],
  'image-cropper':['이미지 자르기','사진 영역 편집',['이미지','자르기','편집'],['crop']],
  'image-resizer':['이미지 크기 변경','가로 세로 픽셀 조절',['이미지','크기','편집'],['resize']],
  'image-compressor':['이미지 최적화','사진 용량 줄이기',['이미지','압축','최적화'],['사진 용량']],
  'xlsx-viewer':['Excel(XLSX) 뷰어','엑셀 파일 열기',['문서','XLSX','뷰어'],['엑셀']],
  'csv-viewer':['CSV 뷰어','CSV 파일 열기',['문서','CSV','뷰어'],['csv']],
  'docx-viewer':['Word(DOCX) 뷰어','워드 파일 열기',['문서','DOCX','뷰어'],['워드']],
  'pptx-viewer':['PowerPoint(PPTX) 뷰어','PPT 슬라이드 보기',['문서','PPTX','뷰어'],['pptx']],
};
const catalog=slugs.map(slug=>({slug,title:labels[slug][0],subtitle:labels[slug][1],tags:labels[slug][2],aliases:labels[slug][3],formats:'',category:slug.includes('pdf')?'pdf':'image'}));
const cases=[
 ['이미지 투명','background-remover'],
 ['이미지를 투명하게','background-remover'],
 ['사진 배경을 투명하게 만들어줘','background-remover'],
 ['뒷배경 날려줘','background-remover'],
 ['인물 사진 누끼 따줘','background-remover'],
 ['사진 속 사람만 남기고 배경 지워줘','background-remover'],
 ['png 투명 배경 만들기','background-remover'],
 ['이미지 크기 변경','image-resizer'],
 ['이미지 자르기','image-cropper'],
 ['사진 용량 줄이기','image-compressor'],
 ['이미지 최적화','image-compressor'],
 ['PDF를 PNG로 변환','pdf-to-image'],
 ['PDF에서 사진 추출','pdf-to-image'],
 ['PNG를 PDF로 변환','image-to-pdf'],
 ['여러 사진을 PDF로 묶어줘','image-to-pdf'],
 ['WebP를 PNG로','image-converter'],
 ['엑셀 파일 열기','xlsx-viewer'],
 ['파워포인트 보기','pptx-viewer'],
 ['워드 문서 열기','docx-viewer'],
 ['csv 열기','csv-viewer'],
];
for(const [query,slug] of cases)test(`추천: ${query} -> ${slug}`,()=>assert.equal(recommendTools(query,catalog).results[0]?.slug,slug));
for(const query of ['알 수 없는 질문 qqqppp','주식 자동 매매','PDF 파일 용량 압축','워드 파일을 PDF로 변환','동영상 편집하기','이미지'])test(`지원하지 않는/불명확한 요청: ${query}`,()=>assert.equal(recommendTools(query,catalog).results.length,0));
test('복합 작업은 실제 제공하는 도구만 제시한다',()=>{const slugs=recommendTools('배경 지우고 사진 용량 줄여줘',catalog).results.map(t=>t.slug);assert.deepEqual(slugs,['background-remover','image-compressor'])});
test('DB에 메타데이터로 새 도구가 추가되면 검색될 수 있다',()=>{const tools=[...catalog,{slug:'custom-optimizer',title:'문서 중복 정리 도구',subtitle:'중복 문장 정리',tags:['중복'],aliases:['중복 문장 제거'],formats:'TXT',category:'document'}];assert.equal(recommendTools('중복 문장 제거',tools).results[0]?.slug,'custom-optimizer')});
