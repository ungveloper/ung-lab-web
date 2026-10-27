# 웅이연구소 검색엔진 등록과 광고 설정

이 문서는 2026-10-27 기준 `ungveloper/ung-lab-web`에 적용한 검색 노출·RSS·AdSense 설정 안내입니다.

## 먼저 확인할 환경 변수

Vercel(또는 실제 호스팅)의 **Production** 환경 변수를 설정하고 다시 배포해야 합니다.

| 이름 | 설정 | 설명 |
|---|---|---|
| `NEXT_PUBLIC_LAUNCH_READY` | `true` | 실제 서비스 검증 뒤 입력. 미설정 시 noindex, robots 전체 차단, 사이트맵 빈 목록, RSS 404. |
| `NAVER_SITE_VERIFICATION` | 선택 | 코드에 이미 `07035e99a992fee454944a610d2421460f59743d`가 기본값으로 들어 있습니다. 기존 값을 덮어쓰고 싶을 때만 입력. |
| `GOOGLE_SITE_VERIFICATION` | 선택 | 구글 서치 콘솔에서 받은 HTML 메타 인증 코드. |
| `ADSENSE_PUBLISHER_ID` | 승인받은 실제 `ca-pub-` + 16자리 | 발급 전에는 비워 둡니다. 유효한 ID가 있을 때 계정 확인 메타 태그와 `/ads.txt`가 생성됩니다. |
| `NEXT_PUBLIC_ADSENSE_ENABLED` | `true` (광고를 실제 켤 때) | 실제 게시자 ID가 함께 설정된 경우에만 AdSense 자동 광고 스크립트를 불러옵니다. 기본값은 꺼짐. |

`SITE_URL`은 `lib/site-url.ts`에 있는 `https://www.ung-lab.com`입니다. 실제 호스팅에서도 `https://ung-lab.com` → `https://www.ung-lab.com`으로 301 리디렉션을 설정하고, 서치 콘솔에는 실사용 대표 도메인을 등록하세요. Vercel에서 원하는 도메인을 Primary로 설정하고 다른 도메인의 Redirect to Primary 설정을 확인하면 됩니다. 배포가 다른 플랫폼이라면 플랫폼에 맞는 리디렉션 규칙을 이용하세요.

## 서치 콘솔과 네이버 등록 주소

- 사이트맵: `https://www.ung-lab.com/sitemap.xml`
- RSS: `https://www.ung-lab.com/rss.xml`
- robots: `https://www.ung-lab.com/robots.txt`
- 네이버 인증: 사이트 HTML의 `naver-site-verification` 메타 태그
- Google 인증: `GOOGLE_SITE_VERIFICATION` 설정 또는 지원되는 도메인 DNS 인증
- ads.txt: `https://www.ung-lab.com/ads.txt` (실제 게시자 ID가 설정되기 전에는 404가 정상)

검색엔진에는 XML 사이트맵을 먼저 제출하세요. RSS도 보조 피드로 제출할 수 있지만, RSS가 사이트맵을 대신해 모든 페이지를 보장하지는 않습니다. RSS에는 가이드 11개가 포함되며, `lib/guides.ts`에 가이드가 추가되면 자동으로 늘어납니다. RSS 게시일은 확인할 수 없는 날짜를 임의로 쓰지 않았습니다. `sitemap.xml` 역시 실제 수정일을 알 수 없으므로 `lastmod`를 허위로 기록하지 않습니다.

배포 확인:

```bash
bash scripts/check-live-seo.sh https://www.ung-lab.com
```

## 애드센스 신청 전 확인

1. 실제 게시자 ID를 받은 후 `ADSENSE_PUBLISHER_ID`를 입력해 소유권 인증 메타 태그와 `ads.txt`를 활성화합니다. 광고 코드 방식으로 소유권을 확인하려면 `NEXT_PUBLIC_ADSENSE_ENABLED=true`도 설정하세요.
2. Google AdSense의 **사이트** 메뉴에서 `www.ung-lab.com` 또는 실제 등록 가능한 대표 도메인을 추가해 심사를 요청합니다. 광고 게재 여부는 Google이 결정합니다.
3. 개인정보 처리방침, 이용약관, 소개, 문의 페이지를 실제 운영 상황과 비교합니다. 지금은 공개 GitHub 이슈만 문의 경로로 안내하며, 존재하지 않는 이메일·사업자정보를 임의로 넣지 않았습니다.
4. 11개 도구를 실제 파일, 오류 파일, 모바일에서 검사합니다. 검색엔진과 심사 로봇이 사이트를 열 수 있어야 하며 로그인 또는 강제 팝업으로 주요 콘텐츠를 막으면 안 됩니다.
5. AdSense의 **자동 광고**를 사용한다면 광고가 업로드/다운로드·탐색 버튼을 가리지 않는지 실제 화면에서 확인하고 자동 광고 배치를 조정합니다. 콘텐츠가 없는 페이지에 광고를 채우거나 광고 클릭을 유도하지 마세요.
6. EEA·영국·스위스 등 동의가 필요한 지역에서 광고를 게재한다면 Google에서 요구하는 인증 CMP 및 광고 동의 설정을 확인하고 활성화하세요. 이 패치에 CMP가 자동 설치되는 것은 아닙니다.
7. 쿠키, 광고, 데이터 전송 정책은 실제 운영 방식에 맞춰 검토합니다. 개인정보 처리방침의 기술적 서술은 공개 코드에서 확인할 수 있는 동작을 기반으로 작성했습니다.

**중요:** 검색 등록과 애드센스 승인 모두 보장할 수 없습니다. 특히 콘텐츠의 독창성·충분성·탐색 편의성·정책 준수를 Google이 직접 심사합니다.

## 코드 변경과 문구 기준

- 소개/정책/문의 및 주요 고정 UI 문구를 자연스러운 한국어로 다듬었습니다.
- [im-not-ai](https://github.com/epoko77-ai/im-not-ai)에서 제시하는 의미 보존·번역투 최소화·과윤문 방지 기준을 참고했습니다. 원본의 전문 스킬을 실제로 실행하거나 자동 검증했다고 주장하지 않습니다.
- Supabase가 별도로 관리하는 도구 설명 및 추천 질문은 **배포된 코드와 다른 텍스트**일 수 있습니다. 기존 DB 데이터는 이 패치가 임의로 덮어쓰지 않습니다. 관리자 화면 또는 SQL 데이터도 필요하면 별도로 검수하세요.
