#!/usr/bin/env python3
"""Read-only inventory of legacy styles for a subsequent full Tailwind migration."""
from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
files=sorted(p for p in root.rglob("*.css") if not any(x in p.parts for x in ("node_modules", ".next", ".git")))
print("\n[CSS/Tailwind migration inventory]")
for p in files:
    data=p.read_text(encoding="utf-8",errors="replace")
    selectors=len(re.findall(r"\{", data))
    print(f"  {p.relative_to(root)} | lines={data.count(chr(10))+1} rules_approx={selectors}")
print("주의: 기존 CSS 파일이 남아 있는 동안 사이트 전체가 Tailwind로 변환되었다고 볼 수 없습니다.")
