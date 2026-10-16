import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("채팅 메시지 ID는 순수한 이전 상태 계산으로 생성하며 Date.now를 사용하지 않는다", () => {
  const source = readFileSync(join(root, "components/tool-chat-home.tsx"), "utf8");
  assert.doesNotMatch(source, /\bDate\.now\s*\(/);
  assert.match(source, /setMessages\(prev\s*=>\s*\{/);
  assert.match(source, /prev\.reduce\(/);
});
