import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { assertOnlyTailwindStylesheet } from "./_tailwind-contract.mjs";

const read = name => readFileSync(new URL(`../${name}`, import.meta.url), "utf8");

test("레거시 네 CSS 파일을 제거하고 Tailwind v4만 진입점으로 사용한다", () => {
  for (const css of ["globals", "chat", "site-info", "not-found"])
    assert.equal(existsSync(new URL(`../app/${css}.css`, import.meta.url)), false);
  assertOnlyTailwindStylesheet();
});

test("실제 JSX에 옮긴 속성을 Tailwind 후보와 소스 파일에서 추적한다", () => {
  const styles=JSON.parse(read("docs/tailwind-style-contract.json"));
  assert.ok(styles.length > 2000, "전환 속성 수가 예상치보다 적습니다.");
  const fileCache=new Map();
  for(const item of styles) {
    assert.ok(item.utility, `${item.selector}: missing utility`);
    assert.ok(item.files.length, `${item.selector}: target JSX is missing`);
    for(const file of item.files) {
      if(!fileCache.has(file))fileCache.set(file,read(file));
      assert.ok(fileCache.get(file).includes(item.utility), `${file}: ${item.selector} => ${item.utility}`);
    }
  }
  assert.ok(fileCache.has("components/app-sidebar.tsx"));
  assert.ok(fileCache.has("components/tool-chat-home.tsx"));
});
