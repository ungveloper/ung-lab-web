import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("404 페이지는 명확한 안내와 주요 이동 버튼을 제공한다", () => {
  const source = read("app/not-found.tsx");
  assert.match(source, /404 ERROR/);
  assert.match(source, /페이지를 찾을 수 없습니다/);
  assert.match(source, /href="\/"/);
  assert.match(source, /href="\/tools"/);
  // 가이드 링크는 quickLinks 배열에 정의되고 href={link.href}로 렌더링됩니다.
  assert.match(source, /href:\s*"\/guides"/);
  assert.match(source, /href:\s*"\/contact"/);
  assert.match(source, /<Link\s+href=\{link\.href\}/);
  assert.match(source, /홈으로 돌아가기/);
  assert.match(source, /전체 도구 보기/);
});

test("404 전용 스타일은 버튼 글자 대비와 포커스 상태를 제공한다", () => {
  const css = read("app/not-found.module.css");
  assert.match(css, /\.primary\s*\{[\s\S]*color:\s*#ffffff/i);
  assert.match(css, /\.secondary\s*\{[\s\S]*background:\s*#ffffff/i);
  assert.match(css, /:focus-visible/);
  assert.match(css, /min-height:\s*52px/);
});
