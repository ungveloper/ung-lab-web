import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (name) => readFileSync(new URL(`../${name}`, import.meta.url), "utf8");

test("Sonner의 Toaster는 루트 레이아웃에 한 번만 설치된다", () => {
  const layout = read("app/layout.tsx");
  const toaster = read("app/_components/common/app-toaster.tsx");
  assert.match(layout, /import \{ AppToaster \} from "@\/app\/_components\/common\/app-toaster"/);
  assert.equal((layout.match(/<AppToaster \/>/g) ?? []).length, 1);
  assert.match(toaster, /"use client"/);
  assert.match(toaster, /import \{ Toaster \} from "sonner"/);
  assert.match(toaster, /<Toaster position="top-right"/);
});

test("문의는 Notion에 실제 접수된 201 응답에만 Sonner 성공 알림을 띄운다", () => {
  const form = read("components/contact-form.tsx");
  const errorIndex = form.indexOf("if (response.status !== 201) {");
  const errorReturn = form.indexOf("return;", errorIndex);
  const successToast = form.indexOf("toast.success(");
  assert.ok(errorIndex > 0 && errorReturn > errorIndex && successToast > errorReturn);
  assert.match(form, /import \{ toast \} from "sonner"/);
  assert.match(form, /toast\.success\("문의가 정상적으로 접수되었습니다\."/);
  assert.match(form, /form\.reset\(\)/);
  assert.ok(form.indexOf("} catch {", successToast) > successToast, "toast occurs in the success path before the catch block");
});

test("502 오류 시 기존 인라인 오류 안내와 입력값 보존 동작을 유지한다", () => {
  const form = read("components/contact-form.tsx");
  const errorBlock = form.slice(form.indexOf("if (response.status !== 201) {"), form.indexOf("form.reset();"));
  assert.match(errorBlock, /setState\("error"\)/);
  assert.match(errorBlock, /setMessage\(`/);
  assert.doesNotMatch(errorBlock, /form\.reset\(\)|toast\.success/);
  assert.match(form, /\{message && <p role="status"/);
  assert.match(form, /state === "sending"/);
});

test("Sonner 패키지는 production dependencies에 고정된다", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.equal(pkg.dependencies?.sonner, "2.0.8");
  const lock = JSON.parse(read("package-lock.json"));
  assert.equal(lock.packages?.[""]?.dependencies?.sonner, "2.0.8");
  assert.equal(lock.packages?.["node_modules/sonner"]?.version, "2.0.8");
});
