# 웅이연구소 최종 배포·검색엔진 등록 체크리스트

**코드 배포와 도메인 연결은 별개입니다.** GitHub push만으로 ung-lab.com의 DNS가 변경되거나 검색엔진에 소유권이 확인되지 않습니다.

## 환경 변수 (호스팅 서비스의 Production 환경에 설정)
- `NEXT_PUBLIC_LAUNCH_READY=true` — 실제 사이트가 정상 공개될 때만 지정. false/미설정은 기존 noindex 유지.
- `GOOGLE_SITE_VERIFICATION=...` — Search Console URL 접두어 속성에서 제공한 `google-site-verification` **content 값**만 입력.
- `NAVER_SITE_VERIFICATION=...` — Naver Search Advisor에서 제공한 `naver-site-verification` **content 값**만 입력.
- 실제 애드센스 계정이 있다면 `ADSENSE_PUBLISHER_ID=ca-pub-...`를 설정하고, 자동 광고는 `NEXT_PUBLIC_ADSENSE_ENABLED=true`로 별도 활성화합니다. 개인정보 고지와 지역별 CMP 설정을 먼저 확인하세요.

Production 설정 후 **재배포**해야 Next가 빌드한 `<head>` 메타태그에 반영될 수 있습니다. 계정 비밀키는 브라우저에 노출하지 마세요.

## 실서버 확인
1. 최신 커밋이 실제 배포 서비스에 반영됐는지, HTTPS와 www/non-www 리다이렉트가 정상인지 확인합니다.
2. `https://www.ung-lab.com/`, `/tools`, `/guides`, `/about`, `/contact`, `/privacy`, `/terms`와 실제 11개 도구·가이드 URL의 응답과 내부 링크를 확인합니다.
3. `https://www.ung-lab.com/robots.txt`가 검색 봇을 허용하고 `https://www.ung-lab.com/sitemap.xml`에 완전한 HTTPS canonical URL이 있는지 확인합니다. `noindex`가 남아 있는지 점검합니다.
4. 사이트 소스 보기(view-source:https://www.ung-lab.com/)에서 `<meta name="google-site-verification" ...>` 및 `<meta name="naver-site-verification" ...>`가 head에 있는지 확인합니다. **React로 나중에 추가한 태그는 Naver 검증이 안 될 수 있습니다.**
5. Google Search Console과 Naver Search Advisor에서 사이트 소유 확인 후 `https://www.ung-lab.com/sitemap.xml` 제출, 핵심 페이지 수집 요청과 색인 현황 확인을 진행합니다.
6. AdSense는 소유권·콘텐츠·정책·광고 동의 관련 운영 점검을 마친 뒤 신청합니다.

## 확인 스크립트
`bash scripts/check-live-seo.sh https://www.ung-lab.com`

공식 문서: https://developers.google.com/search/docs/monitor-debug/search-console-start · https://searchadvisor.naver.com/guide/faq-start-register
