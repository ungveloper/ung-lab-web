import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {fileURLToPath} from "node:url";
const r=p=>fs.readFileSync(fileURLToPath(new URL(`../${p}`,import.meta.url)),"utf8");
test("공통 레이아웃: 소개·문의·개인정보·약관은 workspace 아래 있다",()=>{
 for(const p of ["about","contact","privacy","terms"]){
   assert.ok(fs.existsSync(fileURLToPath(new URL(`../app/(workspace)/${p}/page.tsx`,import.meta.url))));
   assert.ok(!fs.existsSync(fileURLToPath(new URL(`../app/${p}/page.tsx`,import.meta.url))));
   assert.match(r(`app/(workspace)/${p}/page.tsx`),/SiteInfoLayout/);
 }
});
test("720:166 비율의 원본 로고와 PNG 아이콘",()=>{
 const s=r("components/app-sidebar.tsx");
 assert.match(s,/width=\{720\} height=\{166\}/);
 assert.match(s,/images\/brand\/logo.png/);
 for(const p of ["favicon.ico","apple-touch-icon.png","android-chrome-192x192.png","android-chrome-512x512.png"])
   assert.ok(fs.existsSync(fileURLToPath(new URL(`../public/${p}`,import.meta.url))));
});
test("Google / Naver 인증과 robots 출시 게이트 보존",()=>{
 const s=r("app/layout.tsx");
 for(const x of ["GOOGLE_SITE_VERIFICATION","NAVER_SITE_VERIFICATION","naver-site-verification","NEXT_PUBLIC_LAUNCH_READY"])assert.ok(s.includes(x));
 assert.match(r("app/robots.ts"),/NEXT_PUBLIC_LAUNCH_READY/);
 assert.match(r("app/sitemap.ts"),/NEXT_PUBLIC_LAUNCH_READY/);
});
test("내비게이션과 로고의 접근성",()=>{
 assert.match(r("app/_components/common/page-back-link.tsx"),/href = "\/"/);
 assert.match(r("components/app-sidebar.tsx"),/alt="웅이연구소"/);
});
