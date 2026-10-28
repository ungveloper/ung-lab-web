import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "docs/tailwind-style-contract.json"), "utf8"));
const cache = new Map();
const source = file => {
  if (!cache.has(file)) cache.set(file, readFileSync(resolve(root, file), "utf8"));
  return cache.get(file);
};

/** Assert real CSS declarations have migrated to compiled Tailwind tokens in JSX. */
export function assertStyle(selector, property, value, media = null) {
  const matches = manifest.filter(item => item.selector === selector && item.property === property &&
    (value === undefined || item.value === value) && (media == null || JSON.stringify(item.variant).includes(media)));
  assert.ok(matches.length, `Unmigrated selector/style: ${selector} { ${property}: ${value ?? '*'} } ${media ?? ''}`);
  for (const match of matches) for (const file of match.files) {
    assert.ok(source(file).includes(match.utility), `Tailwind utility missing in ${file}: ${match.utility}`);
  }
}
export function assertOnlyTailwindStylesheet() {
  const imports = source("app/layout.tsx");
  assert.match(imports, /import ["']\.\/tailwind\.css["']/);
  assert.doesNotMatch(imports, /import ["']\.\/(?:globals|chat|site-info|not-found)\.css["']/);
  assert.match(source("app/tailwind.css"), /@import ["']tailwindcss["']/);
  assert.doesNotMatch(source("app/tailwind.css"), /@apply|@utility/);
}
