import test from "node:test";
import assert from "node:assert/strict";
import { parseRecentTools, updateRecentTools, safeReturnTarget, saveToolReturn, readToolReturn, TOOL_RETURN_KEY, MAX_RECENT_TOOLS } from "../lib/recent-tools-state.mjs";
const slugs = new Set(["image-compressor", "image-cropper", "background-remover", "pdf-to-image", "image-to-pdf", "xlsx-viewer", "csv-viewer", "pptx-viewer", "docx-viewer"]);
test("최근 사용 도구는 세션 값이 없을 때 빈 목록", () => {
  assert.deepEqual(parseRecentTools(null, slugs), []);
  assert.deepEqual(parseRecentTools("INVALID JSON", slugs), []);
  assert.deepEqual(parseRecentTools("{}", slugs), []);
});
test("최근 사용 도구에 잘못된 값과 중복이 섞여 있어도 안전하게 제거", () => {
  assert.deepEqual(parseRecentTools(JSON.stringify(["image-compressor", "invalid", 3, "image-compressor", "image-cropper"]), slugs), ["image-compressor", "image-cropper"]);
});
test("방문 시 최상단 이동, 중복 제거, 최신 최대 8개 보존", () => {
  const first = ["image-compressor", "image-cropper", "background-remover"];
  assert.deepEqual(updateRecentTools(first, "image-cropper", slugs), ["image-cropper", "image-compressor", "background-remover"]);
  assert.deepEqual(updateRecentTools(first, "fake", slugs), first);
  const many = [...slugs];
  assert.equal(updateRecentTools(many, "image-compressor", slugs).length, MAX_RECENT_TOOLS);
  assert.equal(updateRecentTools(many, "image-compressor", slugs)[0], "image-compressor");
});
test("뒤로가기 주소는 도메인 밖으로 벗어나지 않고 현재 도구로 재이동하지 않는다", () => {
  assert.equal(safeReturnTarget("image-compressor", "/"), "/");
  assert.equal(safeReturnTarget("image-compressor", "/?view=all"), "/?view=all");
  assert.equal(safeReturnTarget("image-compressor", "/tools/image-cropper"), "/tools/image-cropper");
  assert.equal(safeReturnTarget("image-compressor", "/tools/image-compressor"), null);
  assert.equal(safeReturnTarget("image-compressor", "https://other.example"), null);
  assert.equal(safeReturnTarget("image-compressor", "//other.example"), null);
});

test("여러 도구의 복귀 위치를 각각 보존하여 도구 간 이동도 복구한다", () => {
  const values = new Map();
  const oldWindow = globalThis.window;
  globalThis.window = {sessionStorage: {getItem: (k) => values.get(k) ?? null, setItem: (k,v) => values.set(k,v)}};
  try {
    saveToolReturn("image-compressor", "/?view=all");
    saveToolReturn("image-cropper", "/tools/image-compressor");
    assert.equal(readToolReturn("image-cropper"), "/tools/image-compressor");
    assert.equal(readToolReturn("image-compressor"), "/?view=all");
    assert.equal(readToolReturn("pdf-to-image"), "/");
    assert.equal(typeof values.get(TOOL_RETURN_KEY), "string");
    saveToolReturn("image-cropper", "https://evil.example");
    assert.equal(readToolReturn("image-cropper"), "/tools/image-compressor");
  } finally {globalThis.window = oldWindow;}
});
