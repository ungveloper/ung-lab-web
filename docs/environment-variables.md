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

## 문의 양식: Notion 직접 접수

사이트에서 바로 작성하는 문의 폼은 iframe을 사용하지 않습니다. Vercel의 Production 환경변수에 `NOTION_API_TOKEN` 및 `NOTION_DATA_SOURCE_ID`를 추가해야 직접 접수가 활성화됩니다.

1. Notion에서 내부 연결(internal integration)을 만들고 읽기 및 콘텐츠 삽입 권한을 부여합니다. 비밀 키는 서버 환경변수에만 넣습니다.
2. 문의 데이터베이스의 **Connections** 메뉴에서 생성한 연결에 권한을 부여합니다.
3. 데이터베이스의 **Manage data sources → Copy data source ID**로 데이터 소스 ID를 복사합니다. 제공된 공개 Form 페이지 ID를 여기에 넣으면 안 됩니다.
4. Notion 속성 `성함 혹은 닉네임`은 rich_text, `이메일`은 email, `상태`는 status(`접수`)로 사용합니다. 제목(title)은 데이터 소스의 실제 title 속성을 자동으로 찾습니다. 문의 내용은 페이지 본문에 저장합니다.
5. Vercel에서 환경변수 두 개를 Production에 설정하고 재배포합니다. 시크릿 창에서 테스트 문의를 전송하고 Notion에 생성되는지 확인합니다.

연결 전에는 기존 공개 Notion Form의 새 창 링크를 표시합니다. 공개 서비스에서는 스팸·남용 방지를 위한 추가 검증/속도 제한(예: Turnstile)을 검토하세요.

## Tailwind 마이그레이션 현황

- 새 문의 화면은 Tailwind v4 utility class를 사용합니다.
- 기존 앱의 `globals.css`, `chat.css`, `site-info.css`, `not-found.css` 등은 기능 보존을 위해 유지됩니다. 즉, **전체 사이트 Tailwind 전환은 아직 완료된 것이 아닙니다.**
- 이번 단계는 Preflight를 빼고 Tailwind를 도입하여 기존 UI 초기화 충돌을 줄입니다.
- `python3 scripts/audit-tailwind-migration.py`로 남은 CSS를 조사할 수 있습니다.
- 전체 컴포넌트·CSS를 검토하며 단계별로 클래스 전환하고 시각 회귀 테스트 후 기존 CSS를 제거해야 합니다.
