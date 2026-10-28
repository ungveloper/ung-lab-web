# Tailwind 마이그레이션 상태 — 검토 브랜치

- 기존 레거시 CSS 파일 4개 삭제, Tailwind v4 테마만 사용.
- 소개·문의·개인정보·약관·도구 목록·가이드 목록/상세 공통 컴포넌트로 재구성.
- 공통 디자인 토큰은 사용자가 제공한 참고 프로젝트 `globals.css` 기반.
- CSS의 `@apply`·`@utility`를 사용하지 않음.
- 검증되지 않은 부분: 기존 JSX 자동 이관의 83개 매핑 제외 CSS 규칙 및 서드파티 DOM 스타일, 인라인 동적 스타일, 실제 브라우저/빌드 시각 동등성.
- 운영 main 병합 전 QA 필수. 자세한 내용은 `docs/tailwind-component-architecture.md` 참고.
