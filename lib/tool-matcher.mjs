/** Deterministic, zero-cost tool search. OpenAI can be attached as a separate fallback later. */
const normalize = (text) => String(text ?? "").toLocaleLowerCase("ko").normalize("NFKC").replace(/[\s_.·!?~]+/g, "");
const tokenise = (text) => String(text ?? "").toLocaleLowerCase("ko").normalize("NFKC")
  .replace(/[.,!?()\[\]{}:;·]/g, " ").split(/\s+/).map(t => t.replace(/(으로|에서|으로|에게|하고|싶어|싶어요|해줘|해주세요|파일|사진|이미지|문서|좀|것|거|를|을|은|는|이|가|에|로|와|과|도)$/g, "")).filter(t => t.length >= 2);
const intents = [
  ["background-remover", /배경.*(지우|제거|없애|투명|분리)|누끼|배경지우|배경제거|투명배경|뒷배경/],
  ["image-cropper", /자르|크롭|crop|테두리잘라|부분만잘라|원하는영역/],
  ["image-compressor", /용량줄|압축|최적화|파일크기줄|가볍게/],
  ["image-resizer", /크기변경|크기조절|리사이즈|resize|픽셀바꾸|해상도변경/],
  ["image-converter", /(webp|png|jpg|jpeg|avif).*(webp|png|jpg|jpeg|avif)|확장자변경|형식변환|포맷변환/],
  ["pdf-to-image", /pdf.*(이미지|사진|png|jpg|jpeg|webp)|피디에프.*(이미지|사진)|pdf페이지추출/],
  ["image-to-pdf", /(사진|이미지|jpg|jpeg|png|webp).*(pdf|피디에프)|사진.*(합치|묶)|사진여러장.*문서/],
  ["docx-viewer", /docx|워드.*(열|보기|확인|미리)|word.*(open|view)/],
  ["pptx-viewer", /pptx|파워포인트|ppt.*(열|보|확인)|슬라이드.*(열|보)/],
  ["xlsx-viewer", /xlsx|엑셀.*(열|보|확인|미리)|스프레드시트.*(열|보)/],
  ["csv-viewer", /csv|tsv|쉼표.*(파일|데이터)|인코딩.*(열|확인)/],
];
const unsupported = [
  { pattern: /(엑셀|xlsx|워드|docx|pptx|ppt).*(pdf|피디에프).*(변환|바꿔|만들)|(?:pdf|피디에프).*(엑셀|xlsx|워드|docx|pptx).*(변환|바꿔|만들)/, reason: "현재 Office 문서를 PDF로 변환하는 도구는 제공하지 않습니다." },
  { pattern: /(동영상|영상|mp4|avi|mov).*(편집|변환|자르|압축)/, reason: "현재 동영상 처리 도구는 제공하지 않습니다." },
];
/** @param {string} query @param {Array<{slug:string,title:string,subtitle:string,tags:string[],aliases:string[],formats:string,category:string}>} catalog */
export function recommendTools(query, catalog, limit = 3) {
  const raw = String(query ?? "").trim().slice(0, 500);
  if (!raw) return { results: [], reason: "어떤 작업을 원하시나요?" };
  const q = normalize(raw);
  for (const item of unsupported) if (item.pattern.test(q)) return { results: [], reason: item.reason };
  const tokens = tokenise(raw);
  const ranked = catalog.map(tool => {
    const values = [tool.title, tool.subtitle, tool.formats, ...(tool.tags ?? []), ...(tool.aliases ?? [])].map(normalize);
    let score = 0;
    if (normalize(tool.title) === q) score += 130;
    for (const alias of tool.aliases ?? []) {
      const v = normalize(alias);
      if (v.length >= 3 && (q.includes(v) || v.includes(q) && q.length >= 4)) score += 42;
    }
    if (q.length >= 3 && normalize(tool.title).includes(q)) score += 45;
    for (const tag of tool.tags ?? []) if (normalize(tag).length >= 2 && q.includes(normalize(tag))) score += 5;
    let matches = 0;
    for (const token of tokens) if (values.some(value => value.includes(normalize(token)))) matches++;
    score += Math.min(matches, 4) * 7;
    if (tokens.length >= 2 && matches === tokens.length) score += 18;
    const intent = intents.find(([slug]) => slug === tool.slug);
    if (intent?.[1].test(q)) score += 100;
    // A single generic word such as "image" should not fabricate a confident recommendation.
    return { tool, score };
  }).filter(item => item.score >= 18).sort((a,b) => b.score-a.score || a.tool.title.localeCompare(b.tool.title,"ko"));
  if (!ranked.length) return { results: [], reason: "정확히 맞는 도구를 찾지 못했습니다. ‘WebP를 PNG로’, ‘PDF를 이미지로’처럼 작업을 조금 더 구체적으로 말씀해 주세요." };
  const best = ranked[0].score;
  return { results: ranked.filter((item,index) => index === 0 || item.score >= Math.max(22, best*0.38)).slice(0, Math.max(1,limit)).map(item => item.tool), reason: null };
}
