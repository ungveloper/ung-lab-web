# 웅이연구소 — ung-lab.com

Next.js 16 / React 19 기반의 무료 온라인 도구 플랫폼입니다. **초기 구현·검증 단계**이며 `NEXT_PUBLIC_LAUNCH_READY=true`를 설정하기 전에는 SEO 색인이 차단됩니다.

## 도구 (11)

- PDF → PNG/JPG/WebP (암호 PDF 및 페이지 범위 지원)
- 이미지 → PDF (여러 이미지 순서 변경)
- 이미지 최적화, 크기 변경, 형식 변환 (**WebP → PNG**), 이미지 자르기, 배경 제거 (MODNet 인물 전용)
- DOCX/PPTX/XLSX/CSV 읽기 전용 뷰어

## 실행

처음 설정할 때는 루트의 `.env.example`을 `.env.local`로 복사하고 필요한 값만 채우세요. 환경변수 목록과 설정 범위는 `docs/environment-variables.md`에 정리했습니다. 기존 `.env.local`은 덮어쓰지 마세요.

```bash
npm install
npm run dev
npm run verify
```

- Node 22 권장. 초기 의존성 설치가 끝나면 `package-lock.json`도 함께 커밋해야 합니다.
- 기본값은 **미출시 상태** (`NEXT_PUBLIC_LAUNCH_READY`를 지정하지 않음)입니다. 11개 도구를 대표 샘플, 대용량/손상 파일, Chrome/Edge/Safari/Firefox/iOS Safari/Android Chrome으로 테스트하고 개인정보/법적 문서 검토 후에만 출시 플래그를 설정하세요.
- 사용자의 로컬 파일은 서버로 업로드하지 않습니다. AI 모델은 처음 실행할 때 모델 배포 서버에서 내려받습니다. `Xenova/modnet`은 Apache-2.0의 인물 분리 모델이므로 상품 배경 제거 품질을 보장하지 않습니다.
- Office 미리보기는 레이아웃 재현이 완벽하지 않으며 매크로·외부 링크를 실행하지 않는 읽기 전용을 목표로 합니다.
- `app/ads.txt/route.ts`가 유효한 `ADSENSE_PUBLISHER_ID`를 설정했을 때만 `/ads.txt`를 응답합니다. 실제 계정 ID만 입력하세요.
- 기존 `ung-lab.com` 색인 URL은 전환 전에 목록을 정리하고, 정확히 대응하는 새 경로에만 301을 적용하세요.

## 코드 구조

- `lib/tools.ts`: typed Tool Registry, 검색, 태그, 카테고리
- `components/tool-explorer.tsx`: 검색 중심 홈페이지
- `components/tool-workspace.tsx`: 업로드, 옵션, 이미지/PDF 작업, 다운로드
- `components/office-viewer.tsx`, `table-viewer.tsx`: 문서 뷰어
- `lib/process-files.ts`, `file-utils.ts`, `csv.ts`: 파일 처리

## 출시 전 검증 체크

1. PDF.js worker 경로와 암호 PDF 렌더링 검증
2. HEIC/AVIF 지원 여부 브라우저별 검증
3. PPTX의 차트/도형, DOCX 레이아웃, XLSX 병합/서식/수식 샘플 검증
4. 이미지 자르기의 모바일 터치/자유 영역/회전 좌표 검증
5. MODNet 인물 경계, CPU/GPU 메모리, 모델 배포·캐시/라이선스 검증
6. CSP 및 의존성 취약점 점검, 접근성, 실제 기기 E2E/시각 회귀 테스트
7. SEO/법적 문서 검토, 도메인 이전, Vercel 상용 플랜 검토

개발 스캐폴드이므로 위 검증을 수행하지 않고 **정식 출시 완료**로 간주하지 마세요.
