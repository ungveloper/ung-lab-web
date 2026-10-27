import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("문의 페이지는 공개 노션 폼 임베드와 새 창 대체 링크를 제공한다", () => {
  const page = read("app/(workspace)/contact/page.tsx");
  assert.match(page, /canonical:\s*"\/contact"/);
  assert.match(page, /SiteInfoBackButton/);
  assert.match(page, /site-info-article/);
  assert.match(page, /<iframe\b/);
  assert.match(page, /src=\{NOTION_FORM_EMBED\}/);
  assert.match(page, /title="웅이연구소 문의 양식"/);
  assert.match(page, /loading="lazy"/);
  assert.match(page, /scrolling="no"/);
  assert.match(page, /href=\{NOTION_FORM_LINK\}/);
  assert.match(page, /target="_blank"/);
  assert.match(page, /rel="noopener noreferrer"/);
  assert.match(page, /href="\/guides"/);
  assert.match(page, /href="\/privacy"/);
  assert.doesNotMatch(page, /github\.com\/ungveloper\/ung-lab-web\/issues/);
});

test("임베드 링크에 노션의 이중 슬래시 URL 오류가 없다", () => {
  const page = read("app/(workspace)/contact/page.tsx");
  assert.match(page, /https:\/\/jealous-growth-583\.notion\.site\/ebd\/34f7f0af97c2800aa222d3faf6e6443b/);
  assert.match(page, /https:\/\/jealous-growth-583\.notion\.site\/34f7f0af97c2800aa222d3faf6e6443b\?pvs=105/);
  assert.doesNotMatch(page, /https:\/\/jealous-growth-583\.notion\.site\/ebd\/\//);
});

test("문의 양식의 CSS와 외부 서비스 고지가 연결돼 있다", () => {
  const css = read("app/site-info.css");
  assert.match(css, /\.site-info-contact-form-iframe/);
  assert.match(css, /\.site-info-contact-form-shell/);
  assert.match(css, /height:\s*1360px/);
  assert.match(css, /min-height:\s*1360px/);
  assert.match(css, /height:1600px;min-height:1600px/);
  assert.match(css, /@media\s*\(max-width:\s*720px\)/);
  const layout = read("app/layout.tsx");
  assert.match(layout, /import "\.\/site-info\.css"/);
  const privacy = read("app/(workspace)/privacy/page.tsx");
  assert.match(privacy, /Notion/);
  assert.match(privacy, /문의 내용/);
  assert.doesNotMatch(privacy, /GitHub 이슈는 공개/);
});


test("일반 사용자 안내는 외부 서비스 이름 대신 문의 양식으로 안내한다", () => {
  const page = read("app/(workspace)/contact/page.tsx");
  assert.match(page, /아래 문의 양식을 작성해 보내주세요/);
  assert.match(page, /문의 양식 새 창에서 열기/);
  assert.doesNotMatch(page, /아래 노션 양식/);
  assert.doesNotMatch(page, /Notion Form/);
  // 개인정보 고지는 실제 외부 제공자를 공개해야 합니다.
  assert.match(page, /외부 서비스인 Notion/);
});
