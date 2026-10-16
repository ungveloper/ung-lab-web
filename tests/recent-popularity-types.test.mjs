import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname,join} from "node:path";
import * as state from "../lib/recent-tools-state.mjs";
const root=join(dirname(fileURLToPath(import.meta.url)),"..");

test("최근 목록 삭제 함수는 실제 .mjs와 .d.mts에서 모두 export한다",()=>{
  const js=readFileSync(join(root,"lib/recent-tools-state.mjs"),"utf8");
  const types=readFileSync(join(root,"lib/recent-tools-state.d.mts"),"utf8");
  for(const name of ["removeRecentToolId","clearRecentToolIds"]){
    assert.equal(typeof state[name],"function",`${name}: JS export 없음`);
    assert.match(js,new RegExp(`export\\s+function\\s+${name}\\s*\\(`));
    assert.match(types,new RegExp(`export\\s+function\\s+${name}\\s*\\(`),`${name}: 타입 선언 없음`);
  }
});

test("삭제는 항목 단위이며 전체 지우기는 호출자 배열을 변형하지 않는다",()=>{
  const previous=["image-compressor","background-remover","image-cropper"];
  assert.deepEqual(state.removeRecentToolId(previous,"background-remover"),["image-compressor","image-cropper"]);
  assert.deepEqual(state.clearRecentToolIds(previous),[]);
  assert.equal(previous.length,3);
});
