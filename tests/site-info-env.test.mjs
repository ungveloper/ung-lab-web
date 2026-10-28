import { assertOnlyTailwindStylesheet } from "./_tailwind-contract.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const src = path => readFileSync(fileURLToPath(new URL(`../${path}`, import.meta.url)), "utf8");

const pages = ["about", "contact", "privacy", "terms"];

test("환경변수 샘플은 Git에 추적하며 로컬 실제 설정은 제외한다", () => {
  const ignored = src(".gitignore");
  const env = src(".env.example");
  assert.match(ignored, /^\.env\*$/m);
  assert.match(ignored, /^!\.env\.example$/m);
  assert.match(ignored, /^\.env\.local$/m);
  const required = [
    "NEXT_PUBLIC_LAUNCH_READY", "NAVER_SITE_VERIFICATION", "GOOGLE_SITE_VERIFICATION",
    "ADSENSE_PUBLISHER_ID", "NEXT_PUBLIC_ADSENSE_ENABLED", "SUPABASE_URL",
    "SUPABASE_PUBLISHABLE_KEY", "SUPABASE_ANON_KEY", "SUPABASE_ANALYTICS_SECRET_KEY",
  ];
  for (const name of required) assert.match(env, new RegExp(`\\b${name}=`), name);
  assert.doesNotMatch(env, /SUPABASE_ANALYTICS_SECRET_KEY=sb_secret_[a-zA-Z0-9]{8,}/);
  assert.match(env, /NEXT_PUBLIC_LAUNCH_READY=false/);
  assert.match(env, /NEXT_PUBLIC_ADSENSE_ENABLED=false/);
});

test("정보 페이지는 공통 페이지 템플릿, 목차, 접근 가능한 섹션을 공유한다", () => {
  const layout=src("app/_components/site-info/site-info-layout.tsx");
  assert.match(layout, /<PageFrame>/);
  assert.match(layout, /<PageBackLink \/>/);
  assert.match(layout, /<PageHeader/);
  assert.match(layout, /<PageToc/);
  const section=src("app/_components/common/page-section.tsx");
  assert.match(section, /aria-labelledby=\{`\$\{id\}-title`\}/);
  for(const page of pages){
    const content=src(`app/(workspace)/${page}/page.tsx`);
    assert.match(content, /<SiteInfoLayout/);
    const ids=[...content.matchAll(/<PageSection id="([^"]+)"/g)].map(m=>m[1]);
    assert.ok(ids.length>=3, `${page}: missing sections`);
    assert.equal(ids.length,new Set(ids).size, `${page}: duplicated sections`);
    for(const id of ids)assert.ok(content.includes(`href: "#${id}"`), `${page}: missing TOC entry ${id}`);
  }
});

test("약관·개인정보의 기능 설명과 광고 고지는 유지한다", () => {
  const privacy = src("app/(workspace)/privacy/page.tsx");
  assert.match(privacy, /NEXT_PUBLIC_ADSENSE_ENABLED/);
  assert.match(privacy, /ADSENSE_PUBLISHER_ID/);
  for (const term of ["ung-lab-visited-tools", "ung-lab-counted-prompts", "Supabase", "HttpOnly", "SameSite=Lax"]) assert.ok(privacy.includes(term));
  assert.match(src("app/(workspace)/terms/page.tsx"), /브라우저 호환성/);
  assert.match(src("app/(workspace)/contact/page.tsx"), /ContactForm/);
  assert.doesNotMatch(src("app/(workspace)/contact/page.tsx"), /<iframe/);
});

test("정보 페이지는 Tailwind 유틸리티로 본문 여백·가독성·포커스를 통일한다",()=>{
  assertOnlyTailwindStylesheet();
  const frame=src("app/_components/common/page-frame.tsx");
  const section=src("app/_components/common/page-section.tsx");
  const link=src("app/_components/common/page-back-link.tsx");
  assert.match(frame,/px-5.*md:px-8/);
  assert.match(section,/leading-8/);
  assert.match(section,/break-keep/);
  assert.match(link,/focus-visible:outline-2/);
});
