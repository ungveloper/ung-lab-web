#!/bin/bash
set -euo pipefail
BASE="${1:-https://www.ung-lab.com}"; BASE="${BASE%/}"
if [[ "$BASE" != https://* ]]; then echo "HTTPS URL을 입력하세요." >&2; exit 1; fi
printf '웅이연구소 배포 점검: %s\n' "$BASE"
for path in / /tools /guides /about /contact /privacy /terms /robots.txt /sitemap.xml /rss.xml /favicon.ico /images/brand/logo.png; do
  code="$(curl -L -s -o /dev/null -w '%{http_code}' --max-time 15 "$BASE$path" || true)"
  printf '%-34s %s\n' "$path" "$code"
done
html="$(curl -fsSL --max-time 15 "$BASE/" || true)"
robots="$(curl -fsSL --max-time 15 "$BASE/robots.txt" || true)"
sitemap="$(curl -fsSL --max-time 15 "$BASE/sitemap.xml" || true)"
rss="$(curl -fsSL --max-time 15 "$BASE/rss.xml" || true)"
printf '네이버 인증: '; if printf '%s' "$html" | grep -q '07035e99a992fee454944a610d2421460f59743d'; then echo '태그 확인'; else echo '인증값 확인 필요'; fi
printf 'robots 색인 허용: '; if printf '%s' "$robots" | grep -Eiq '^Disallow: /\s*$'; then echo '차단 중 — 환경변수 점검'; else echo '전체 차단 규칙 없음'; fi
printf 'HTML noindex: '; if printf '%s' "$html" | grep -Eiq '<meta[^>]*name="robots"[^>]*noindex|<meta[^>]*content="[^"]*noindex'; then echo '주의: noindex 감지'; else echo '미검출'; fi
printf 'XML 사이트맵: '; if printf '%s' "$sitemap" | grep -q '<urlset'; then echo '확인'; else echo '미확인 — 출시 플래그 확인'; fi
printf 'RSS: '; if printf '%s' "$rss" | grep -q '<rss version="2.0"'; then echo '확인'; else echo '미확인 — 출시 플래그 확인'; fi
