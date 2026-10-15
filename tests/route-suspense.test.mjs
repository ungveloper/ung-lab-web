import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const routes = [
  ['app/tools/[slug]/page.tsx', 'ToolPageContent'],
  ['app/category/[slug]/page.tsx', 'CategoryPageContent'],
  ['app/guides/[slug]/page.tsx', 'GuidePageContent'],
];

test('Next.js 16 dynamic pages await params inside Suspense children', () => {
  for (const [file, child] of routes) {
    const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
    assert.match(source, /import\s*\{\s*Suspense\s*\}\s*from\s*["']react["']/);
    assert.match(source, new RegExp(`async function ${child}\\(`));
    assert.match(source, /const\s*\{\s*slug\s*\}\s*=\s*await params/);
    assert.match(source, /export default function/);
    assert.match(source, /<Suspense\s+fallback=/);
    assert.ok(source.includes(`<${child} params={params}`), `${file} must pass params inside Suspense`);
  }
});

test('smooth scrolling is declared in root html to let Next manage navigation', () => {
  const source = readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8');
  assert.match(source, /<html lang="ko" data-scroll-behavior="smooth">/);
});
