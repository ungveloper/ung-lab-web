#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
node --test tests/*.test.mjs
npm run lint
npm run typecheck
NEXT_TELEMETRY_DISABLED=1 npm run build
