import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=(path)=>readFileSync(new URL(`../${path}`,import.meta.url),"utf8");

test("Next.js typegen runs before tsc for nested guide layouts",()=>{
  const pkg=JSON.parse(read("package.json"));
  assert.equal(pkg.scripts.typecheck,"next typegen && tsc --noEmit");
  assert.match(read("app/guides/layout.tsx"),/export default function GuidesLayout/);
});
test("New guide loading fallback renders without duplicating the sidebar",()=>{
  const route=read("app/guides/loading.tsx");
  const layout=read("app/guides/layout.tsx");
  assert.match(route,/<GuideRouteLoading\/>/);
  assert.doesNotMatch(route,/GuideShell|AppSidebar/);
  assert.match(layout,/<GuideShell>\{children\}<\/GuideShell>/);
});
