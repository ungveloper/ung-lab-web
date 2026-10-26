#!/bin/bash
set -euo pipefail
BASE="${1:-https://ung-lab.com}"; BASE="${BASE%/}"
echo "== 실서버 공개 상태 점검: $BASE =="
for path in / /tools /guides /about /contact /privacy /terms /robots.txt /sitemap.xml /favicon.ico /apple-touch-icon.png /images/brand/logo.png; do
  code="$(curl -L -s -o /dev/null -w '%{http_code}' --max-time 15 "$BASE$path" || true)"
  printf '%-32s %s
' "$path" "$code"
done
html="$(curl -fsSL --max-time 15 "$BASE/" || true)"
robots="$(curl -fsSL --max-time 15 "$BASE/robots.txt" || true)"
sitemap="$(curl -fsSL --max-time 15 "$BASE/sitemap.xml" || true)"
printf '
색인 차단: '; if printf '%s' "$html" | grep -Eiq '<meta[^>]*name=["'"']robots["'"'][^>]*noindex|<meta[^>]*content=["'"'][^>]*noindex';then echo '주의: noindex 존재';else echo 'HTML에서 noindex 미검출';fi
printf 'Google 인증: '; if printf '%s' "$html" | grep -q 'google-site-verification';then echo '태그 발견';else echo '미등록';fi
printf 'Naver 인증: '; if printf '%s' "$html" | grep -q 'naver-site-verification';then echo '태그 발견';else echo '미등록';fi
printf '사이트맵: '; if printf '%s' "$sitemap" | grep -q '<urlset';then echo 'XML 형식 발견';else echo 'XML 미검출';fi
printf 'robots: '; if printf '%s' "$robots" | grep -qi 'disallow: /';then echo '차단 규칙 확인 필요';else echo '전체 차단 규칙 미검출';fi
