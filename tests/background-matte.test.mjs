import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { combineForeground, alphaToOpaqueGrayscale } from "../lib/background-matte.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("검은색 의상은 RGB가 검어도 모델 알파가 255면 완전히 보인다", () => {
  const source = new Uint8ClampedArray([13, 16, 18, 255]);
  const mask = new Uint8ClampedArray([13, 16, 18, 255]);
  assert.deepEqual([...combineForeground(source, mask)], [13, 16, 18, 255]);
});

test("피부·옷의 색상은 그대로 두고 RGBA 네 번째 채널만 마스크로 사용한다", () => {
  const source = new Uint8ClampedArray([195, 158, 139, 255, 5, 4, 7, 255]);
  const model = new Uint8ClampedArray([195, 158, 139, 240, 5, 4, 7, 250]);
  assert.deepEqual([...combineForeground(source, model)], [195, 158, 139, 240, 5, 4, 7, 250]);
});

test("투명 배경의 픽셀은 제거되고, 기존 알파와 마스크 알파가 곱해진다", () => {
  const source = new Uint8ClampedArray([234, 222, 210, 255, 10, 20, 30, 128]);
  const model = new Uint8ClampedArray([20, 20, 20, 0, 190, 190, 190, 128]);
  assert.deepEqual([...combineForeground(source, model)], [234, 222, 210, 0, 10, 20, 30, 64]);
});

test("0인 기본 보정은 얇은 머리카락의 반투명 알파를 변경하지 않는다", () => {
  const source = new Uint8ClampedArray([70, 60, 45, 255]);
  const model = new Uint8ClampedArray([12, 14, 16, 63]);
  assert.equal(combineForeground(source, model, 0)[3], 63);
  assert.ok(combineForeground(source, model, 15)[3] < 63);
});

test("오류 상태와 형식 불일치에서 조용히 원본을 훼손하지 않고 예외를 발생시킨다", () => {
  assert.throws(() => combineForeground(new Uint8ClampedArray(4), new Uint8ClampedArray(8)), /일치/);
  assert.throws(() => alphaToOpaqueGrayscale(new Uint8ClampedArray(3)), /채널/);
});

test("리사이즈 시 RGB가 아니라 네 번째 알파 값으로 불투명 흑백 마스크를 만든다", () => {
  assert.deepEqual([...alphaToOpaqueGrayscale(new Uint8ClampedArray([1, 2, 3, 245]))], [245, 245, 245, 255]);
});

test("배경 제거 작업은 실제 모델 알파로 결합하고 빨간색 채널 마스킹을 되풀이하지 않는다", () => {
  const source = fs.readFileSync(path.join(root, "lib/remove-background.ts"), "utf8");
  assert.match(source, /combineForeground\(original\.data, alphaMask, settings\.feather\)/);
  assert.doesNotMatch(source, /getImageData\([^)]*\)\.data;for/);
  const workspace = fs.readFileSync(path.join(root, "components/tool-workspace.tsx"), "utf8");
  assert.match(workspace, /BackgroundPreview/);
});
