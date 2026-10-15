import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { FAVORITES_KEY, parseFavoriteIds, toggleFavoriteId } from "../lib/favorites-state.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const allowed = new Set(["image-cropper", "pdf-to-image", "xlsx-viewer"]);

test("즐겨찾기 설정은 탭 세션 스토리지 키를 사용한다", () => {
  assert.match(FAVORITES_KEY, /favorites/);
  const source = readFileSync(join(root, "lib/use-favorites.ts"), "utf8");
  assert.match(source, /window\.sessionStorage\.setItem/);
  assert.doesNotMatch(source, /localStorage/);
});

test("즐겨찾기 데이터가 없거나 손상됐으면 빈 목록으로 처리한다", () => {
  assert.deepEqual(parseFavoriteIds(null, allowed), []);
  assert.deepEqual(parseFavoriteIds("broken json", allowed), []);
  assert.deepEqual(parseFavoriteIds("{}", allowed), []);
});

test("등록된 도구만 복원하고 중복을 제거하며 순서를 보존한다", () => {
  assert.deepEqual(parseFavoriteIds(JSON.stringify(["image-cropper", "deleted-tool", "image-cropper", 3, "pdf-to-image"]), allowed), ["image-cropper", "pdf-to-image"]);
});

test("별표 토글은 추가와 해제를 수행한다", () => {
  assert.deepEqual(toggleFavoriteId([], "image-cropper", allowed), ["image-cropper"]);
  assert.deepEqual(toggleFavoriteId(["pdf-to-image"], "image-cropper", allowed), ["pdf-to-image", "image-cropper"]);
  assert.deepEqual(toggleFavoriteId(["image-cropper", "pdf-to-image"], "image-cropper", allowed), ["pdf-to-image"]);
  assert.deepEqual(toggleFavoriteId(["image-cropper"], "unknown-tool", allowed), ["image-cropper"]);
});

test("모든 도구 카드와 상세·카테고리에서 별표를 사용할 수 있다", () => {
  const cards = readFileSync(join(root, "components/tool-explorer.tsx"), "utf8");
  const detail = readFileSync(join(root, "app/tools/[slug]/page.tsx"), "utf8");
  const category = readFileSync(join(root, "app/category/[slug]/page.tsx"), "utf8");
  assert.match(cards, /즐겨찾는 도구/);
  for (const source of [cards, detail, category]) assert.match(source, /FavoriteButton/);
  const button = readFileSync(join(root, "components/favorite-button.tsx"), "utf8");
  assert.match(button, /aria-pressed/);
});
