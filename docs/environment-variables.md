# 환경변수 관리 안내

프로젝트 루트의 `.env.example`이 환경변수 목록의 기준입니다. 실제 사용 값은 로컬 `.env.local` 또는 배포 서비스의 환경변수 설정에만 입력하세요. **`.env.local`은 패치 과정에서 변경하지 않습니다.**

## 로컬 실행

처음 설정하는 경우에만 저장소 루트에서 다음을 실행합니다.

```bash
cp .env.example .env.local
```

이미 `.env.local`이 있다면 덮어쓰지 말고 `.env.example`과 비교해 빠진 항목만 추가하세요. 값을 수정한 뒤에는 개발 서버를 다시 시작해야 반영될 수 있습니다.

## 환경변수 요약

| 변수 | 언제 필요한가 | 기본/설정 방법 |
|---|---|---|
| `NEXT_PUBLIC_LAUNCH_READY` | 사이트 검색 공개 | QA가 끝난 뒤 `true`로 변경. 미설정/`false`는 `noindex`와 RSS 차단 |
| `NAVER_SITE_VERIFICATION` | 네이버 인증 | 제공한 `07035e99a992fee454944a610d2421460f59743d`를 예시 파일에 기재. 코드에도 같은 기본값 |
| `GOOGLE_SITE_VERIFICATION` | 구글 검색엔진 HTML 인증 | 구글에서 발급한 **content 값**만 입력. DNS 인증을 쓴다면 생략 가능 |
| `ADSENSE_PUBLISHER_ID` | 애드센스 계정 확인 및 `ads.txt` | 본인 계정의 `ca-pub-` + 16자리. 미발급 시 빈 값 |
| `NEXT_PUBLIC_ADSENSE_ENABLED` | 광고 스크립트 활성화 | 유효한 게시자 ID, 정책 고지와 지역별 동의 설정을 준비한 뒤 `true`. 기본은 `false` |
| `SUPABASE_URL` | 외부 DB에서 도구 목록·집계 데이터 사용 | Supabase 프로젝트 URL. 비워 두면 기본 도구 목록을 사용 |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase 연결 | `sb_publishable_` 키 사용 권장 |
| `SUPABASE_ANON_KEY` | 이전 형식 Supabase 프로젝트만 | `SUPABASE_PUBLISHABLE_KEY`가 없는 경우 대신 사용 |
| `SUPABASE_ANALYTICS_SECRET_KEY` | 사용량 기록을 DB에 쓸 때 | **비공개 서버 전용 키**. 필요한 SQL/RLS 설정 후 적용 |

`SUPABASE_ANON_KEY`와 `SUPABASE_ANALYTICS_SECRET_KEY`는 선택 사항이므로 `.env.example`에서 주석 상태입니다. 공개 저장소에 실제 비밀값을 입력하지 마세요. 특히 `SUPABASE_ANALYTICS_SECRET_KEY`에 `NEXT_PUBLIC_` 접두사를 붙이면 안 됩니다.

## 배포 환경

Vercel을 사용하는 경우 **Project Settings → Environment Variables → Production**에 필요한 값을 넣고 재배포하세요. `.env.example`만 GitHub에 올려도 Vercel 환경변수가 자동으로 등록되는 것은 아닙니다.

사이트맵·RSS·Google AdSense 설정에 관해서는 `docs/search-and-adsense-setup.md`를 함께 참고하세요.
