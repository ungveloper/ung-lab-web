import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("정보 페이지 뒤로가기는 무조건 홈으로 이동", () => {
  const source = read("components/site-info-back-button.tsx");
  assert.match(source, /href="\/"/);
  assert.doesNotMatch(source, /router\.back\(|router\.push\("\/tools"\)/);
  for (const page of ["about", "privacy", "terms", "contact"]) {
    assert.match(read(`app/(workspace)/${page}/page.tsx`), /SiteInfoBackButton/);
  }
});

test("네이버 인증과 조건부 애드센스 설정", () => {
  const source = read("app/layout.tsx");
  assert.match(source, /naver-site-verification/);
  assert.match(source, /07035e99a992fee454944a610d2421460f59743d/);
  assert.match(source, /NAVER_SITE_VERIFICATION/);
  assert.match(source, /ADSENSE_PUBLISHER_ID/);
  assert.match(source, /NEXT_PUBLIC_ADSENSE_ENABLED/);
  assert.match(source, /adsbygoogle\.js/);
  assert.match(source, /application\/rss\+xml/);
  assert.doesNotMatch(source, /ca-pub-1234567890123456/);
});

test("사이트맵·robots·RSS는 같은 대표 도메인과 출시 게이트 사용", () => {
  const config = read("lib/site-url.ts");
  assert.match(config, /https:\/\/www\.ung-lab\.com/);
  for (const path of ["app/sitemap.ts", "app/robots.ts", "app/rss.xml/route.ts"]) {
    const source = read(path);
    assert.match(source, /SITE_URL/);
    assert.match(source, /NEXT_PUBLIC_LAUNCH_READY/);
  }
  const sitemap = read("app/sitemap.ts");
  assert.match(sitemap, /"\/tools"/);
  assert.match(sitemap, /tools\.map/);
  assert.match(sitemap, /guides\.map/);
  assert.match(sitemap, /categories/);
  assert.doesNotMatch(sitemap, /lastModified:\s*new Date/);
  const rss = read("app/rss.xml/route.ts");
  assert.match(rss, /guides\.map/);
  assert.match(rss, /xml\(guide\.title\)/);
  assert.match(rss, /guide\.troubleshooting/);
  assert.match(rss, /application\/rss\+xml/);
});

test("정책·문의·소개 페이지에 실제 내용과 canonical을 제공", () => {
  for (const page of ["about", "privacy", "terms", "contact"]) {
    const source = read(`app/(workspace)/${page}/page.tsx`);
    assert.match(source, /canonical/);
    assert.match(source, /<h1>/);
    // Headings may have an ID so section navigation and aria-labelledby work.
    assert.match(source, /<h2\b[^>]*>/);
    assert.match(source, /<h2\s+id="[^"]+"/);
  }
  assert.match(read("app/(workspace)/privacy/page.tsx"), /ung-lab-visited-tools/);
  assert.match(read("app/(workspace)/privacy/page.tsx"), /Google AdSense/);
});
