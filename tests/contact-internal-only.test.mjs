import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read = p => readFileSync(new URL(`../${p}`,import.meta.url),"utf8");

test("문의 페이지는 외부 양식으로 이동하는 링크와 대체 수단을 제공하지 않는다",()=>{
  const page=read("app/(workspace)/contact/page.tsx");
  assert.match(page,/<ContactForm \/>/);
  assert.match(page,/현재 문의 접수를 준비 중입니다/);
  assert.doesNotMatch(page,/NOTION_FORM_LINK|notion\.site|새 창에서 열어 작성|target="_blank"/);
});
test("문의 실패는 내부 재시도만 안내하고 전송 내용을 보존한다",()=>{
  const form=read("components/contact-form.tsx");
  const api=read("app/api/contact/route.ts");
  assert.match(form,/response\.status !== 201/);
  assert.match(form,/입력 내용은 유지됩니다\. 잠시 후 다시 시도해 주세요/);
  assert.match(form,/toast\.success/);
  assert.doesNotMatch(form+api,/외부 문의 양식|외부 사이트|notion\.site/);
});
