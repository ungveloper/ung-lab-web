#!/usr/bin/env python3
"""Conservative, read-only Korean content audit inspired by im-not-ai.
Do not auto-rewrite quotes, legal text, metrics, or product behavior.
"""
from pathlib import Path
import re
root=Path(__file__).resolve().parent.parent
folders=['app','components','lib']
patterns={
 '번역투(에 있어서)':r'에 있어서',
 '번역투(를 통해)':r'를 통해',
 '중복 수식(매우 중요한)':r'매우 중요한',
 'AI 관용구(시사)':r'시사하는 바가 크다',
 'AI 관용구(결론적으로)':r'결론적으로',
 '추상적 표현(혁신적인)':r'혁신적인',
 '중복 피동':r'되어진다|되어지는',
 '형식명사(할 필요가 있다)':r'할 필요가 있다',
}
allcount=0;rows=[]
for folder in folders:
  for f in (root/folder).rglob('*'):
    if f.suffix not in {'.tsx','.ts','.mjs','.md'} or f.name.endswith('.test.mjs'):continue
    try:text=f.read_text(encoding='utf-8')
    except (OSError,UnicodeDecodeError):continue
    allcount+=1
    for kind,pattern in patterns.items():
      for match in list(re.finditer(pattern,text))[:20]:
        ln=text.count('\n',0,match.start())+1
        rows.append((str(f.relative_to(root)),ln,kind))
print(f'한국어 표현 점검: {allcount}개 소스 파일, 검토할 문구 {len(rows)}곳')
for path,line,kind in rows[:25]:print(f'  {path}:{line}  {kind}')
if len(rows)>25:print(f'  외 {len(rows)-25}곳. 법률·정책 문서는 사람이 원문과 대조하세요.')
