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

test("정보 페이지는 한결같은 본문 계층과 목차, 접근 가능한 섹션을 갖는다", () => {
  for (const page of pages) {
    const content = src(`app/(workspace)/${page}/page.tsx`);
    assert.match(content, /SiteInfoBackButton/);
    assert.match(content, /site-info-article/);
    assert.match(content, /site-info-hero/);
    assert.match(content, /site-info-lead/);
    assert.match(content, /site-info-toc/);
    assert.match(content, /<article/);
    assert.match(content, /<section className="site-info-section"/);
    const ids = [...content.matchAll(/<section className="site-info-section" id="([^"]+)"/g)].map(m => m[1]);
    assert.ok(ids.length >= 3, `${page}: 내용 섹션 부족`);
    assert.equal(ids.length, new Set(ids).size, `${page}: 중복 id`);
    for (const id of ids) assert.ok(content.includes(`href="#${id}"`), `${page}: 목차 연결 없음: ${id}`);
  }
});

test("약관·개인정보의 기능 설명과 광고 고지는 유지한다", () => {
  const privacy = src("app/(workspace)/privacy/page.tsx");
  assert.match(privacy, /NEXT_PUBLIC_ADSENSE_ENABLED/);
  assert.match(privacy, /ADSENSE_PUBLISHER_ID/);
  for (const term of ["ung-lab-visited-tools", "ung-lab-counted-prompts", "Supabase", "HttpOnly", "SameSite=Lax"]) assert.ok(privacy.includes(term));
  assert.match(src("app/(workspace)/terms/page.tsx"), /브라우저 호환성/);
  assert.match(src("app/(workspace)/contact/page.tsx"), /NOTION_FORM_EMBED/);
  assert.match(src("app/(workspace)/contact/page.tsx"), /<iframe/);
});

test("정보 페이지 전용 CSS는 읽기 편한 본문과 모바일 여백, 키보드 포커스를 지원한다", () => {
  const styles = src("app/site-info.css");
  assert.match(src("app/layout.tsx"), /\.\/site-info\.css/);
  assert.match(styles, /\.app-content-container\.content-page\.site-info-page/);
  assert.match(styles, /\.site-info-section p\{[^}]*line-height:2/);
  assert.match(styles, /@media\(max-width:720px\)/);
  assert.match(styles, /focus-visible/);
  assert.match(styles, /word-break:keep-all/);
});
