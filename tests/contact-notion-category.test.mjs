import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const routeSource = readFileSync(new URL("../app/api/contact/route.ts", import.meta.url), "utf8");
const output = ts.transpileModule(routeSource, {
  fileName: "route.ts",
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
const categoryName = "⚙️ 웅이연구소";
const req = {
  headers: { get(name) { return { origin: "http://localhost:3001", "content-type": "application/json" }[name] ?? null; } },
  nextUrl: { origin: "http://localhost:3001" },
  async text() { return JSON.stringify({ name: "Tester", email: "tester@example.com", subject: "사이트 이용 문의", message: "정상 문의 접수를 검증합니다." }); },
};

function instantiate(fetcher) {
  const exports = {};
  runInNewContext(output, {
    exports,
    require(name) {
      if (name === "next/server") return { NextResponse: { json(body, { status }) { return { status, body }; } } };
      throw Error(`Unknown test import: ${name}`);
    },
    process: { env: { NOTION_API_TOKEN: "fake-token-for-test", NOTION_DATA_SOURCE_ID: "a".repeat(32) } },
    fetch: fetcher,
    AbortSignal,
    console: { error() {} },
  });
  return exports.POST;
}

function fakeResponse(status, body) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}
function schemaWithCategory(type = "select", hasOption = true) {
  const options = hasOption ? [{ name: categoryName }, { name: "기타" }] : [{ name: "기타" }];
  return { properties: {
    이름: { type: "title" },
    "성함 혹은 닉네임": { type: "rich_text" },
    "이메일": { type: "email" },
    상태: { type: "status", status: { options: [{ name: "접수" }] } },
    ...(type ? { 구분: { type, [type]: { options } } } : {}),
  } };
}

for (const kind of ["select", "multi_select"]) {
  test(`문의 제목을 그대로 저장하고 ${kind} 구분을 지정한다`, async () => {
    const calls = [];
    const post = instantiate(async (url, opts) => {
      calls.push({ url, opts });
      if (url.endsWith("/v1/pages")) return fakeResponse(201, { object: "page" });
      return fakeResponse(200, schemaWithCategory(kind));
    });
    const result = await post(req);
    assert.equal(result.status, 201);
    const page = calls.find(c => c.url.endsWith("/v1/pages"));
    assert.ok(page, "Notion pages API must be called");
    const saved = JSON.parse(page.opts.body);
    assert.equal(saved.properties.이름.title[0].text.content, "사이트 이용 문의");
    assert.doesNotMatch(saved.properties.이름.title[0].text.content, /\[문의\]/);
    if (kind === "select") assert.equal(saved.properties.구분.select.name, categoryName);
    else assert.equal(saved.properties.구분.multi_select[0].name, categoryName);
    assert.equal(saved.properties.상태.status.name, "접수");
    assert.equal(saved.properties["성함 혹은 닉네임"].rich_text[0].text.content, "Tester");
    assert.equal(saved.properties.이메일.email, "tester@example.com");
    assert.match(JSON.stringify(saved.children), /정상 문의 접수를 검증합니다/);
  });
}

for (const variant of ["missing", "missing-option", "unsupported-type"]) {
  test(`구분 ${variant} 시 페이지를 생성하지 않는다`, async () => {
    let created = false;
    const post = instantiate(async (url) => {
      if (url.endsWith("/v1/pages")) { created = true; return fakeResponse(201, {}); }
      return fakeResponse(200, variant === "missing" ? schemaWithCategory(null)
        : variant === "missing-option" ? schemaWithCategory("select", false)
        : schemaWithCategory("rich_text"));
    });
    const result = await post(req);
    assert.equal(result.status, 503);
    assert.equal(created, false);
  });
}

test("Notion 페이지 생성 실패는 성공으로 취급하지 않는다", async () => {
  const post = instantiate(async (url) => url.endsWith("/v1/pages")
    ? fakeResponse(403, { code: "restricted_resource" })
    : fakeResponse(200, schemaWithCategory()));
  const result = await post(req);
  assert.equal(result.status, 502);
  assert.equal(result.body.code, "CONTACT_WRITE_FAILED");
});
