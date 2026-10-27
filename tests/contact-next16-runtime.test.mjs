import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../app/api/contact/route.ts", import.meta.url), "utf8");

test("Next.js 16 cacheComponents 문의 API는 호환되지 않는 runtime 설정을 사용하지 않는다", () => {
  assert.doesNotMatch(source, /^export\s+const\s+runtime\b/m);
  assert.match(source, /export async function POST\(/);
});

test("문의 API는 서버 전용 Notion 접수와 no-store 응답을 유지한다", () => {
  assert.match(source, /process\.env\.NOTION_API_TOKEN/);
  assert.match(source, /process\.env\.NOTION_DATA_SOURCE_ID/);
  assert.match(source, /api\.notion\.com\/v1\/pages/);
  assert.match(source, /no-store/);
  assert.doesNotMatch(source, /NEXT_PUBLIC_NOTION/);
});
