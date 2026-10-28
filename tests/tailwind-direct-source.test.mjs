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

test("코드에서 CSS 복제 @apply 및 @utility 없이 직접 Tailwind 컴포넌트를 사용한다",()=>{
  const style=read("app/tailwind.css");
  assert.doesNotMatch(style, /@apply|@utility/);
  const files=["app/_components/common/page-frame.tsx","app/_components/common/page-back-link.tsx",
    "app/_components/common/page-header.tsx","app/_components/common/page-toc.tsx",
    "app/_components/common/page-section.tsx"];
  for(const file of files){
    const source=read(file);
    assert.match(source,/className=/,file);
    assert.match(source,/(?:flex|px-5|rounded-|border-|text-)/,file);
  }
  for(const name of ["about","contact","privacy","terms"])
    assert.match(read(`app/(workspace)/${name}/page.tsx`),/<SiteInfoLayout/);
});
