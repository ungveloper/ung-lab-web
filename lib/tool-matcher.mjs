/** Cost-free, deterministic tool matcher. No network or AI API calls. */
const normalize = (value) => String(value ?? "").toLocaleLowerCase("ko").normalize("NFKC")
  .replace(/[\s_.·!?~,:;()\[\]{}'"→➡]+/g, "");
const particles = /(으로|에서|에게|께서|까지|부터|처럼|하고|해줘요|해주세요|해줘|할래|싶어요|싶어|으로|만을|만|으로|이랑|랑|에도|에는|에선|에서|에서|에게|의|을|를|은|는|이|가|에|로|와|과|도)$/;
function tokensOf(text) {
  const words = String(text ?? "").toLocaleLowerCase("ko").normalize("NFKC").match(/[a-z0-9가-힣]+/g) ?? [];
  return [...new Set(words.map(w => w.replace(particles," ").trim()).filter(w => w.length > 1 && !/^(해줘|해주세요|싶어|싶어요|파일|그냥|하고|하는|작업|만들|어떻게|방법)$/.test(w)))];
}

// High-precision task intents take priority over fuzzy metadata. A short query like
// “이미지 투명” must work even when Supabase doesn't contain an exact alias.
const intentPatterns = [
  ["background-remover", /누끼|배경제거|배경지우|뒷배경|배경.*(?:없애|제거|지우|지워|삭제|투명|분리|날리)|(?:사진|이미지|그림|인물|사람|png|jpg).*(?:투명|배경없|배경날리)|투명.*(?:사진|이미지|배경|png)|(?:피사체|인물).*분리/],
  ["image-cropper", /자르|크롭|crop|원하는영역|부분만.*잘라|테두리.*잘라/],
  ["image-compressor", /압축|최적화|용량.*(?:줄|작게|줄여|낮춰)|(?:사진|이미지|png|jpg).*용량/],
  ["image-resizer", /리사이즈|resize|사이즈(?:변경|조절)|크기(?:변경|조절|맞추)|해상도(?:변경|조절)|픽셀(?:변경|수정|맞추)|(?:사진|이미지).*크기/],
  ["docx-viewer", /docx|워드.*(?:열|보|확인|읽|미리|뷰어)|word.*(?:open|view|read)/],
  ["pptx-viewer", /pptx|파워포인트|ppt.*(?:열|보|확인|읽|뷰어)|슬라이드.*(?:열|보|미리)/],
  ["xlsx-viewer", /xlsx|엑셀.*(?:열|보|확인|미리|뷰어|읽)|스프레드시트.*(?:열|보)/],
  ["csv-viewer", /csv|tsv|인코딩.*(?:열|확인|문제)/],
];
const unsupported = [
  {pattern:/(?:엑셀|xlsx|워드|docx|pptx|파워포인트|ppt).*(?:pdf|피디에프).*(?:변환|바꿔|만들|저장)|(?:pdf|피디에프).*(?:엑셀|xlsx|워드|docx|pptx|ppt).*(?:변환|바꿔|만들|저장)/,reason:"현재 Office 문서와 PDF 간 변환 도구는 제공하지 않습니다."},
  {pattern:/(?:pdf|피디에프).*(?:압축|용량줄|용량축소)|(?:압축|용량줄).*(?:pdf|피디에프)/,reason:"현재 PDF 파일 압축 도구는 제공하지 않습니다."},
  {pattern:/(?:동영상|영상|mp4|avi|mov).*(?:편집|변환|자르|압축|용량)/,reason:"현재 동영상 처리 도구는 제공하지 않습니다."},
];
const imageExt = /(?:webp|png|jpg|jpeg|avif|heic)/g;
function detectIntent(q) {
  const found = [];
  const add = (slug) => { if (!found.includes(slug)) found.push(slug); };
  // Direction of conversion is crucial: PDF→PNG ≠ PNG→PDF.
  if (/(?:pdf|피디에프).*(?:이미지|사진|png|jpg|jpeg|webp)/.test(q)) add("pdf-to-image");
  if (/(?:사진|이미지|jpg|jpeg|png|webp|heic|avif).*(?:pdf|피디에프)/.test(q)) add("image-to-pdf");
  // File-format conversion only when TWO DISTINCT formats are requested.
  if (!/(?:pdf|피디에프)/.test(q) && new Set(q.match(imageExt) ?? []).size >= 2) add("image-converter");
  if (/(?:확장자|포맷|형식).*(?:변환|변경|바꾸)|(?:변환|바꾸).*(?:확장자|포맷|형식)/.test(q) && !/(?:pdf|피디에프)/.test(q)) add("image-converter");
  for (const [slug,pattern] of intentPatterns) if (pattern.test(q)) add(slug);
  return found;
}

/**
 * @param {string} query
 * @param {Array<{slug:string,title:string,subtitle:string,tags:string[],aliases:string[],formats:string,category:string}>} catalog
 * @param {number} [limit]
 */
export function recommendTools(query, catalog, limit = 3) {
  const raw = String(query ?? "").trim().slice(0,500);
  if (!raw) return {results:[],reason:"어떤 작업을 원하시나요?"};
  const q = normalize(raw);
  for (const item of unsupported) if (item.pattern.test(q)) return {results:[],reason:item.reason};
  const intents = detectIntent(q);
  const bySlug = new Map(catalog.map(tool => [tool.slug,tool]));
  const exact = intents.flatMap(slug => bySlug.has(slug) ? [bySlug.get(slug)] : []);
  if (exact.length) return {results:exact.slice(0,Math.max(1,limit)),reason:null};
  const tokens = tokensOf(raw).map(normalize);
  // Fuzzy metadata fallback for newly added Supabase tools. Repeated generic
  // words never by themselves produce a fabricated/confident recommendation.
  const ranked = catalog.map(tool => {
    const title = normalize(tool.title);
    const aliases = (tool.aliases ?? []).map(normalize);
    const values = [title,normalize(tool.subtitle),normalize(tool.formats),...(tool.tags ?? []).map(normalize),...aliases];
    let score = title === q ? 140 : 0;
    if (q.length >= 4 && title.includes(q)) score += 70;
    for (const a of aliases) if (a.length >= 3 && (q.includes(a) || (q.length>=4 && a.includes(q)))) score += 50;
    const matched = tokens.filter(token => values.some(v => v.includes(token)));
    score += Math.min(5,matched.length)*10;
    if (matched.length >= 2) score += 16;
    if (matched.length === 1 && /^(이미지|사진|문서|변환|도구|pdf)$/.test(matched[0])) score = Math.min(score,10);
    return {tool,score};
  }).filter(x=>x.score>=28).sort((a,b)=>b.score-a.score || a.tool.title.localeCompare(b.tool.title,"ko"));
  if (!ranked.length) return {results:[],reason:"알맞은 도구를 찾지 못했습니다. 예: ‘이미지 배경 투명하게’, ‘PDF를 PNG로’, ‘엑셀 파일 열기’처럼 말씀해 주세요."};
  const best=ranked[0].score;
  return {results:ranked.filter(x=>x.score>=Math.max(28,best*0.58)).slice(0,Math.max(1,limit)).map(x=>x.tool),reason:null};
}
