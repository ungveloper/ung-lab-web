# UNG LAB 공통 컴포넌트 · Tailwind 구조 (검토 브랜치)

## 기준

첨부받은 다른 프로젝트의 `src/app/_components/common/inner`, `page-header`, `breadcrumb`와
`about/doctors`, `about/tour`, `about/equipment`의 레이아웃 분리를 참조했습니다.
병원 프로젝트의 이름·브랜딩·색상 전체를 그대로 복사하지 않았습니다.

### 공통 UI의 단일 수정 위치

| 종류 | 파일 | 사용처 |
|---|---|---|
| 콘텐츠 폭/내부 패딩 | `app/_components/common/page-frame.tsx` | 소개·문의·개인정보·약관·도구 목록·가이드 목록·상세 |
| 뒤로가기 링크 | `app/_components/common/page-back-link.tsx` | 법적 안내 전체 + 가이드 상세 |
| 페이지 제목·설명 | `app/_components/common/page-header.tsx` | 안내·도구 목록·가이드 목록/상세 |
| 목차 | `app/_components/common/page-toc.tsx` | 모든 안내 페이지 |
| 본문 섹션/문단 | `app/_components/common/page-section.tsx` | 모든 안내 페이지 |
| 안내 페이지 레이아웃 | `app/_components/site-info/site-info-layout.tsx` | `/about`, `/contact`, `/privacy`, `/terms` |
| 가이드 카드/단계 | `app/_components/guides/*` | `/guides`, `/guides/[slug]` |
| 도구 카드/그리드/섹션 | `app/_components/tools/*` | `/tools` |
| 공통 테마 토큰 | `app/tailwind.css` | 모든 Tailwind 유틸리티 |

`_components`는 Next.js 라우트로 취급되지 않는 일반 컴포넌트 폴더입니다.

## 공통 값

- 최대 콘텐츠 너비: `max-w-[1040px]`
- 모바일 좌우 패딩 `px-5`, 768px 이상 `md:px-8`
- 상단 패딩 `pt-10`, 768px 이상 `md:pt-12`
- 하단 패딩 `pb-28`
- 뒤로가기 버튼은 `PageBackLink` 단일 컴포넌트
- 제목·본문 스타일은 참고 `globals.css`의 `--text-mo-*` / `--text-pc-*` / semantic colors를 바탕으로 `@theme` 토큰으로 사용
- 동적 상태는 `aria-pressed:`, `focus-visible:` 등 Tailwind 기본 상태 유틸리티 사용

## 코드 변경 범위와 검증 제약

업로드된 `ung-lab-web-source.zip`의 **원본 GitHub main**을 시작점으로 삼고,
직전 JSX 직접 Tailwind 전환 검토본을 기반으로 공통 컴포넌트를 재구성했습니다.

- 기존 수작업 CSS 네 파일은 제거되어 Tailwind 한 곳만 import합니다.
- `@apply`, `@utility` 또는 이관된 레거시 CSS 선택자 규칙을 추가하지 않았습니다.
- 채팅, 문서 변환·뷰어, 404 및 서드파티에서 직접 생성하는 DOM에 대한 Tailwind 기계 이관 코드는 남아 있으며,
  수동 시각 검증 없이 기존 화면 동등성을 보장할 수 없습니다.
- 스타일 자동 이관 단계에서 정적 JSX에 매핑되지 않은 **83개 CSS 규칙**(서드파티 DOM 스타일 포함 가능)은 아직 정밀 확인이 필요합니다.
- 동적 인라인 스타일 11곳도 계산/좌표 동작에 사용되므로 일괄 삭제하지 않았습니다.
- 기존 `docs/tailwind-style-contract.json`은 CSS 제거 당시의 이관 기록이므로,
  이 리팩터링에서 새 공통 컴포넌트로 옮긴 클래스의 최신 위치와 다를 수 있습니다.
- 이 환경에는 `next`, `react`, `pdfjs-dist`, `exceljs` 설치본이 없어 전체 `npm run typecheck` / `npm run build`를 실행할 수 없었습니다.
  소스 구문과 177개 중 174개 테스트를 검사했으며, 나머지 3개는 **의존성 미설치**입니다.

## 필수 QA

맥에서 적용 스크립트가 lint/typecheck/tests/build를 모두 통과하고 **검토 브랜치에만** 푸시한 뒤,
다음 화면을 모바일 320px·375px·태블릿·데스크톱에서 실제 확인해야 합니다.

- 소개/문의/개인정보/약관: 뒤로가기, 공통 1040px 폭, 좌우 20/32px 패딩, 목차 이동과 스크롤
- 도구 목록: 즐겨찾기 추가/삭제, 카테고리와 태그 필터, 추천/검색/최근 기능
- 가이드 목록/상세: 검색, 카드 이동, 오류 안내, 도구 이동
- 11개 도구: 변환/다운로드/터치/드래그/문서 미리보기/인쇄
- 모바일 사이드바, 축소 사이드바, 오류/로딩/404, 키보드 포커스

실제 브라우저에서 문제가 남았다면 이 브랜치를 운영 main에 병합하지 마세요.
