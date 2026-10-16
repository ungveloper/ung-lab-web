/** Cost-free alternatives: related capabilities first, measured visits second. */
const compact = (value) => String(value ?? "").toLocaleLowerCase("ko").normalize("NFKC").replace(/[\s\p{P}\p{S}]+/gu, "");
const terms = [
  {test: /(?:이미지|사진|그림|포토|png|webp|jpg|jpeg|heic|avif)/,category:"image"},
  {test: /(?:pdf|피디에프)/,category:"pdf"},
  {test: /(?:워드|엑셀|문서|ppt|docx|pptx|xlsx|csv|tsv)/,category:"document"},
];
const distinct = new Set(["파일","도구","해줘","해주세요","해봐","좀","싶어","변환","사용","방법","작업","무료","ㅋㅋ","ㅎㅎ","안녕"]);

/** @param {string} query @param {Array<{slug:string,title:string,subtitle:string,category:string,tags:string[],aliases:string[],formats:string,featured?:boolean}>} catalog @param {Record<string,number>} counts @param {number} limit */
export function suggestFallbackTools(query, catalog, counts = {}, limit = 3) {
  const trimmed = String(query ?? "").slice(0,500);
  const normalized = compact(trimmed);
  const words = trimmed.toLocaleLowerCase("ko").normalize("NFKC").match(/[a-z0-9가-힣]+/g) ?? [];
  const categories = terms.filter(term => term.test.test(normalized)).map(term => term.category);
  const ranked = catalog.map(tool => {
    const haystack = [tool.title,tool.subtitle,tool.formats,...(tool.aliases??[]),...(tool.tags??[])].map(compact);
    let score = categories.includes(tool.category) ? 10 : 0;
    for (const word of words) {
      const token = compact(word);
      if (token.length < 2 || distinct.has(token) || /^(이미지|사진|문서|파일|pdf|피디에프)$/.test(token)) continue;
      if (haystack.some(text => text === token)) score += 16;
      else if (token.length > 2 && haystack.some(text => text.includes(token))) score += 12;
    }
    return {tool,score};
  }).filter(item => item.score > 0).sort((a,b)=>b.score-a.score || Number(b.tool.featured??false)-Number(a.tool.featured??false) || a.tool.title.localeCompare(b.tool.title,"ko"));
  if (ranked.length) return {tools: ranked.slice(0,limit).map(item=>item.tool), label:"관련 도구", source:"related"};
  const total = Object.values(counts).reduce((sum,amount)=>sum+(Number.isFinite(amount)&&amount>0?amount:0),0);
  const popular = total >= 10 ? catalog.filter(tool=>(counts[tool.slug]??0)>0).sort((a,b)=>(counts[b.slug]??0)-(counts[a.slug]??0) || a.title.localeCompare(b.title,"ko")) : [];
  if (popular.length) return {tools:popular.slice(0,limit),label:"많이 사용한 도구",source:"popular"};
  return {tools:catalog.filter(tool=>tool.featured).slice(0,limit),label:"추천 도구",source:"featured"};
}

/** @param {Record<string,number>} counts @param {string[]} available */
export function popularitySlugs(counts, available) {
  const total = Object.values(counts).reduce((sum,count)=>sum+(Number.isFinite(count)&&count>0?count:0),0);
  if (total < 10) return [];
  return available.filter(slug=>(counts[slug]??0)>0).sort((a,b)=>(counts[b]??0)-(counts[a]??0) || a.localeCompare(b)).slice(0,4);
}
