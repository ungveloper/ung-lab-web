import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { comparisonAtX, comparisonByKey, clampComparison } from "../lib/compare-slider.mjs";

test("터치·마우스 좌표는 표시된 이미지 가로 크기에 매핑된다", () => {
  assert.equal(comparisonAtX(210, 10, 400), 50);
  assert.equal(comparisonAtX(10, 10, 400), 0);
  assert.equal(comparisonAtX(410, 10, 400), 100);
  assert.equal(comparisonAtX(-20, 10, 400), 0);
  assert.equal(comparisonAtX(999, 10, 400), 100);
});

test("모바일 극단 좌표와 잘못된 너비에도 유효한 위치를 유지한다", () => {
  assert.equal(comparisonAtX(20, 5, 0), 50);
  assert.equal(comparisonAtX(Number.NaN, 5, 400), 50);
  assert.equal(clampComparison(Number.POSITIVE_INFINITY), 50);
  assert.equal(clampComparison(50.8), 51);
});

test("좌우 방향키와 Shift, Home/End는 경계를 지킨다", () => {
  assert.equal(comparisonByKey(50, "ArrowLeft"), 48);
  assert.equal(comparisonByKey(50, "ArrowRight", true), 60);
  assert.equal(comparisonByKey(0, "ArrowLeft"), 0);
  assert.equal(comparisonByKey(100, "ArrowRight"), 100);
  assert.equal(comparisonByKey(22, "Home"), 0);
  assert.equal(comparisonByKey(22, "End"), 100);
  assert.equal(comparisonByKey(50, "Escape"), null);
});

test("전·후 이미지가 겹쳐지며, 기본 50%, 포인터 및 키보드 이벤트가 연결된다", () => {
  const source = readFileSync(new URL("../components/background-preview.tsx", import.meta.url), "utf8");
  assert.match(source, /useState\(50\)/);
  assert.match(source, /background-compare-before/);
  assert.match(source, /background-compare-after/);
  assert.match(source, /clipPath:/);
  assert.match(source, /onPointerMove=/);
  assert.match(source, /onPointerCancel=/);
  assert.match(source, /onKeyDown=/);
  assert.match(source, /aria-valuenow=/);
});

test("투명 배경과 터치 스크롤 제어 CSS가 설정된다", () => {
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /background-compare-frame\{/);
  assert.match(css, /touch-action:none/);
  assert.match(css, /background-image:linear-gradient/);
});
