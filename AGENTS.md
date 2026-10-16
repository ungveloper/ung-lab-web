<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## 웅이연구소 UI/UX 정책 (모든 후속 패치에 적용)

- 행동 우선: 사용자가 클릭·입력·업로드·저장·뒤로가기로 다음 행동을 알 수 있게 버튼 위치와 동작, 카드 계층, 상태를 설계한다.
- 사용자에게 불필요한 장문 설명, 반복 안내, 홍보 문장, 기능을 그대로 풀어 쓴 문장은 추가하지 않는다. 필요한 경우 짧은 레이블·힌트 1줄만 사용한다.
- 법적 의무 안내, 개인정보, 파일 형식·크기 제한, 중요한 AI/브라우저 제약, 접근성 레이블, 실제 오류·진행·복구 안내는 임의 제거하지 않는다.
- 추천 도구 카드: 전체 카드 이동 동작과 즐겨찾기 버튼의 클릭 영역이 겹치지 않게 독립된 영역을 확보한다.
- 열림/닫힘·선택/해제 같은 모든 토글은 버튼의 텍스트, aria-label, 아이콘이 현재 상태와 일치해야 한다.
- 로딩 중에는 중앙 정렬 스피너와 스크린리더 상태를 기본으로 하고, 불필요한 로딩 설명은 반복하지 않는다.
- 반응형 320px부터 데스크톱까지 터치 대상과 여백을 확인한다. 변경 전후 테스트를 추가하고, npm run lint -- --max-warnings=0 / typecheck / test / build를 통과시킨다.
- 기존 Next.js 자동 생성 블록을 유지하며, 이 정책 섹션을 후속 패치에도 보존한다.
