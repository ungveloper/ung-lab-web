import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {isFeatureRequestCandidate,featureRequestSubject,featureRequestMessage,savePendingFeatureRequest,readPendingFeatureRequest,clearPendingFeatureRequest,FEATURE_REQUEST_STORAGE_KEY} from "../lib/feature-request.mjs";
import {recommendTools} from "../lib/tool-matcher.mjs";
const read=p=>readFileSync(new URL(`../${p}`,import.meta.url),"utf8");
function storage(){const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k),data}}

test("새 채팅의 지원되지 않는 기능에는 제안이 표시되나 일반 인사에는 표시하지 않는다",()=>{
  const tools=[{slug:"pdf-to-image",title:"PDF 이미지 변환",subtitle:"PDF PNG",tags:["PDF"],aliases:["pdf png"],formats:"PDF PNG",category:"pdf"}];
  assert.equal(recommendTools("PDF 파일 압축해줘",tools).results.length,0);
  assert.equal(isFeatureRequestCandidate("PDF 파일 압축해줘"),true);
  assert.equal(isFeatureRequestCandidate("QR 코드 생성"),true);
  for(const q of ["안녕","qqqppp","이미지","test"])assert.equal(isFeatureRequestCandidate(q),false,q);
});
test("기능 제안 제목에는 원문만 넣고 접미사를 붙이지 않는다",()=>{
  assert.equal(featureRequestSubject("PDF 파일 압축해줘"),"PDF 파일 압축해줘");
  const title=featureRequestSubject("가".repeat(500));
  assert.equal(title,"가".repeat(120));
  assert.doesNotMatch(featureRequestSubject("이미지 줄이기"),/기능 추가 요청|\[문의\]/);
});
test("문의 본문은 기능 맥락을 담되 수정 가능한 간략한 초안이다",()=>{
  const body=featureRequestMessage("PDF 파일 압축해줘");
  assert.match(body,/요청한 작업: PDF 파일 압축해줘/);
  assert.match(body,/파일 형식이나 원하는 사용 방법/);
  assert.ok(body.length>=10&&body.length<=4000);
});
test("채팅 원문은 URL 대신 세션 저장소로 30분만 전달된다",()=>{
  const s=storage();
  assert.equal(savePendingFeatureRequest(s,"PDF 파일 압축해줘",1000),true);
  assert.equal(readPendingFeatureRequest(s,1001)?.query,"PDF 파일 압축해줘");
  assert.ok(s.getItem(FEATURE_REQUEST_STORAGE_KEY));
  assert.equal(readPendingFeatureRequest(s,1000+30*60*1000+1),null);
  assert.equal(s.getItem(FEATURE_REQUEST_STORAGE_KEY),null);
});
test("성공 전에는 원문을 보존하고 접수 성공 시에만 삭제한다",()=>{
  const s=storage();savePendingFeatureRequest(s,"오디오 자막 생성",2000);
  assert.equal(readPendingFeatureRequest(s,2002)?.query,"오디오 자막 생성");
  clearPendingFeatureRequest(s);
  assert.equal(readPendingFeatureRequest(s,2003),null);
});
test("저장소 접근이 제한되어도 폼으로 이동할 수 있도록 실패를 안전하게 반환한다",()=>{
  const broken={setItem(){throw Error("blocked")},getItem(){throw Error("blocked")},removeItem(){throw Error("blocked")}};
  assert.equal(savePendingFeatureRequest(broken,"PDF 압축",100),false);
  assert.equal(readPendingFeatureRequest(broken,101),null);
  assert.doesNotThrow(()=>clearPendingFeatureRequest(broken));
});
test("새 채팅은 실패한 매칭일 때만 CTA와 Sonner를 사용하고 원문을 서버로 보내지 않는다",()=>{
  const chat=read("components/tool-chat-home.tsx");
  const action=read("app/_components/chat/feature-request-action.tsx");
  assert.match(chat,/canPropose=!results\.length&&isFeatureRequestCandidate\(text\)/);
  assert.match(chat,/toast\.info\("원하는 기능을 찾지 못했어요"/);
  assert.match(chat,/<FeatureRequestAction/);
  assert.match(action,/기능 제안하기/);
  assert.match(chat,/router\.push\(saved\?"\/contact\?type=feature":"\/contact"\)/);
  assert.doesNotMatch(chat,/router\.push\([^\n]*encodeURIComponent/);
});
test("기존 문의에서는 초안을 자동 채우지 않고 실제 제출 성공 시에만 초안을 지운다",()=>{
  const form=read("components/contact-form.tsx");
  assert.match(form,/get\("type"\) !== "feature"/);
  assert.match(form,/readPendingFeatureRequest\(window\.sessionStorage\)/);
  assert.match(form,/subject\.value = featureRequestSubject/);
  assert.match(form,/message\.value = featureRequestMessage/);
  assert.match(form,/if \(featureMode\) \{/);
  assert.ok(form.indexOf("if (featureMode) {")>form.indexOf("if (response.status !== 201) {"));
  assert.match(form,/toast\.success/);
  assert.match(form,/ref=\{formRef\}/);
});
test("Notion 분류는 웅이연구소를 유지하며 제목에 임의 접두어를 붙이지 않는다",()=>{
  const api=read("app/api/contact/route.ts");
  assert.match(api,/categoryName = "⚙️ 웅이연구소"/);
  assert.match(api,/richText\(subject\)/);
  assert.doesNotMatch(api,/\[문의\] \$\{subject\}/);
});
