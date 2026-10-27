import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("문의 페이지는 iframe을 사용하지 않고 브라우저 네이티브 양식을 제공한다", () => {
  const page = read("app/(workspace)/contact/page.tsx");
  const form = read("components/contact-form.tsx");
  assert.match(page, /canonical:\s*"\/contact"/);
  assert.match(page, /SiteInfoBackButton/);
  assert.match(page, /ContactForm/);
  assert.match(page, /href="\/guides"/);
  assert.match(page, /href="\/privacy"/);
  assert.match(page, /NOTION_FORM_LINK/);
  assert.doesNotMatch(page, /<iframe/);
  assert.match(form, /<form/);
  assert.match(form, /fetch\("\/api\/contact"/);
  assert.match(form, /문의 보내기/);
  assert.match(form, /role="status"/);
});

test("문의 API는 인증 토큰을 서버에서만 쓰고 외부에 유출하지 않는다", () => {
  const api = read("app/api/contact/route.ts");
  assert.match(api, /NOTION_API_TOKEN/);
  assert.match(api, /NOTION_DATA_SOURCE_ID/);
  assert.match(api, /2026-03-11/);
  assert.match(api, /data_sources\/\$\{dataSourceId\}/);
  assert.match(api, /api\.notion\.com\/v1\/pages/);
  assert.match(api, /request\.headers\.get\("origin"\)/);
  assert.doesNotMatch(read("components/contact-form.tsx"), /NOTION_API_TOKEN/);
  assert.doesNotMatch(api, /NEXT_PUBLIC_NOTION/);
});

test("문의 화면은 Tailwind 클래스로 스타일링하고 기존 iframe 스크롤을 사용하지 않는다", () => {
  const page = read("app/(workspace)/contact/page.tsx");
  const form = read("components/contact-form.tsx");
  const tailwind = read("app/tailwind.css");
  assert.match(page, /text-slate-900/);
  assert.match(form, /rounded-xl/);
  assert.match(tailwind, /tailwindcss\/utilities\.css/);
  assert.doesNotMatch(page, /NOTION_FORM_EMBED|scrolling="no"|site-info-contact-form-iframe/);
});
