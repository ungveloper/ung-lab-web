import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read=(path)=>readFileSync(new URL(`../${path}`,import.meta.url),"utf8");
test("Notion 실패는 schema/create 단계를 구분하고 사용자 비밀 정보는 로깅하지 않는다",()=>{
  const source=read("app/api/contact/route.ts");
  assert.match(source,/notionFailure\("schema", schemaResponse\)/);
  assert.match(source,/notionFailure\("create", res\)/);
  assert.match(source,/contact:notion/);
  assert.match(source,/CONTACT_NETWORK_ERROR/);
  assert.doesNotMatch(source,/console\.(?:log|error)\([^\n]*(?:token|body|email|name|subject|message)/i);
});
test("문의 화면은 서버의 안전한 실패 코드를 사용하고 내부 재시도만 안내한다",()=>{
  const source=read("components/contact-form.tsx");
  assert.match(source,/response\.json\(\)\.catch/);
  assert.match(source,/CONTACT_\[A-Z_\]/);
  assert.match(source,/입력 내용은 유지됩니다\. 잠시 후 다시 시도해 주세요/);
  assert.doesNotMatch(source,/외부 문의 양식|notion\.site/);
  assert.match(source,/setState\("success"\)/);
});
test("진단 명령은 Notion 데이터 소스 조회만 수행하고 쓰기 요청을 하지 않는다",()=>{
  const source=read("scripts/diagnose-contact-notion.mjs");
  assert.match(source,/api\.notion\.com\/v1\/data_sources/);
  assert.match(source,/2026-03-11/);
  assert.doesNotMatch(source,/method:\s*["']POST["']/);
  assert.doesNotMatch(source,/console\.(?:log|error)\([^\n]*\$\{token\}/);
});
