# 웅이연구소 — 대화형 도구 탐색 + Supabase 패치

기준: GitHub `ungveloper/ung-lab-web`의 현재 `main`. **기존 11개 도구 처리 엔진, 세션 즐겨찾기 유지.**

## 1. 적용

Mac 다운로드 폴더에서 ZIP을 풀고 `bash ~/Downloads/ung-lab-chat-supabase-20261016/apply.sh` 실행. 설치는 지정 저장소에만 적용하며 로컬 변경 보호, 원본 백업, 검증 후 커밋 및 `git push -u origin main`을 실행합니다. Supabase 설정이 없어도 **기본 도구 카탈로그로 개발 빌드가 가능**합니다.

## 2. 실제 Supabase 연결 (직접 1회 설정해야 함)

1. https://supabase.com/dashboard 에서 새 프로젝트를 만듭니다. 프로젝트 생성과 요금제 선택은 사용자 본인이 합니다. 무료 플랜 사용량 제한을 확인하세요.
2. Supabase > SQL Editor에서 `supabase/001_tool_catalog.sql`, 그다음 `supabase/002_seed_tools.sql`을 순서대로 실행합니다. 11개 도구의 제목, 짧은 설명, 태그, 동의어, 아이콘, 3단계 안내, 지원 형식, 세부 설명이 포함됩니다.
3. `config/supabase.env.example`을 프로젝트 루트 `.env.local`로 복사하고 Project Settings > API에서 **Project URL**과 **publishable (`sb_publishable_...`)** 값을 입력합니다. **service_role key나 secret API key를 넣지 마세요.** `SUPABASE_PUBLISHABLE_KEY`는 서버에서만 읽습니다. 구형 프로젝트의 anon JWT를 사용하려면 `SUPABASE_ANON_KEY`로 대체할 수 있습니다.
4. 개발 서버를 재시작하세요. `/api/tool-catalog`에 접속했을 때 `source: "supabase"`이면 연결이 완료된 것입니다. 초기 상태가 `source: "setup-required"`이면 키 미설정, `"unavailable"`이면 API 네트워크/정책 문제로 기본 카탈로그가 표시됩니다.
5. Vercel 배포에도 동일한 `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` **서버 환경변수**를 입력하고 재배포하세요. `.env.local`은 Git에 올리지 않습니다.

DB 테이블은 읽기 전용 RLS이며 공개 사용자는 **active 도구 메타데이터 SELECT만 가능**합니다. 쓰기 권한은 부여하지 않습니다. 도구 파일은 업로드되지 않고, 질문은 JavaScript로 브라우저에서 분석하며 외부 AI로 전송되지 않습니다. 채팅 내용과 별표는 브라우저 탭의 `sessionStorage`에만 남습니다. 사이트 운영자는 공개 DB 메타데이터만 관리합니다.

## 선택 사항: 최근 사용량 기반 인기 도구

1. Supabase SQL Editor에서 `supabase/003_tool_popularity.sql` 실행 (기존 001/002 완료 후).
2. Supabase 서버의 **Secret API key (`sb_secret_...`)**를 발급하여 `.env.local` 및 Vercel 서버 환경변수에 `SUPABASE_ANALYTICS_SECRET_KEY`로 등록. **절대로 브라우저, `NEXT_PUBLIC_` 변수, Git 커밋에 공개하지 마세요.** 앞선 설명에서 금지한 공개 영역의 Secret 사용과는 다릅니다.
3. 서버 재시작 후 `/api/tool-popularity`를 조회하면 `source: "supabase"`, `counts` 결과가 표시됩니다. DB/비밀키 설정 전에는 기록하지 않고 추천 도구만 사용합니다.
4. 도구 상세 페이지에 실제 진입할 때 브라우저 세션당 각 도구 1회만 카운트합니다. DB에는 날짜별 합계만 저장합니다. 채팅·파일·사용자 신원·IP를 저장하지 않습니다. 이는 고유 이용자 수가 아니라 **대략적인 세션별 도구 방문 수**입니다. 집계 호출은 남용될 수 있으므로 트래픽 증가 시 서버 레이트리밋·봇 방어를 추가하세요.

## 3. 구현 내용

- 홈 화면: ChatGPT와 유사한 대화형 구조(독자 브랜드): 사이드바, 새 대화, 추천 카드, 예시 질문, 하단 입력창, 모바일 햄버거 메뉴.
- "모든 기능 보기": 기존 기능 목록 UI를 발전시킨 카드·카테고리·태그·검색·인기·즐겨찾기 목록.
- DB 카탈로그: 기존 11개 메타데이터를 Supabase PostgreSQL로 옮기는 SQL. 홈·카테고리·도구 상세 메타데이터에 연결. 미설정/장애 시 현재 코드의 기본 카탈로그로 대체(하단 상태 표시).
- 0원 AI API: 외부 OpenAI 호출 없이 `lib/tool-matcher.mjs`의 JavaScript 동의어·태그·의도 점수 매칭. 일치하지 않으면 지원하지 않는다고 안내. 향후 해당 모듈 다음 단계에 OpenAI fallback 추가 가능.
- 기존 11개 도구 이외 새 기능을 DB에 넣더라도 실제 변환 엔진이 없으므로 자동 등록·노출되지 않도록 allowlist 적용.

## 4. 검증

패키지 기본 테스트: `node --test tests/tool-matcher.test.mjs`. 적용 스크립트는 `npm run lint -- --max-warnings=0`, `npm run typecheck`, `npm run test`, `npm run build`를 순차 수행합니다. 전체 Next.js 의존성 빌드는 사용자 Mac에서 완료해야 합니다. Supabase 프로젝트 생성·SQL 실행·실제 API 연결은 자동화되지 않았습니다.

## 5. 주의

`NEXT_PUBLIC_LAUNCH_READY`는 변경하지 않습니다. 기존 도구 QA 완료 전 출시·기존 도메인 교체를 하지 마세요. Supabase 무료 요금제라도 사용량/정책에 따라 제한과 비용이 달라질 수 있습니다.
