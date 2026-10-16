/** Public presentation of manager-curated prompt types and aggregate usage. */
export const DEFAULT_PROMPTS = [
  {slug:"background-remover", question:"사진 배경을 투명하게 만들어줘", is_default:true, display_order:1, question_count:0},
  {slug:"pdf-to-image", question:"PDF를 이미지로 저장하고 싶어", is_default:true, display_order:2, question_count:0},
  {slug:"image-converter", question:"WebP 파일을 PNG로 바꿔줘", is_default:true, display_order:3, question_count:0},
  {slug:"xlsx-viewer", question:"엑셀 파일을 열어보고 싶어", is_default:true, display_order:4, question_count:0},
];
/** @param {Array<{slug:string;question:string;is_default?:boolean;display_order?:number;question_count?:number}>} rows @param {number} [limit] */
export function choosePromptQuestions(rows,limit=4){
  const valid=rows.filter(row=>row&&typeof row.slug==="string"&&typeof row.question==="string"&&row.question.trim().length>=3&&row.question.length<=90);
  const uniq=[...new Map(valid.map(row=>[row.slug,row])).values()];
  // An actual ranking comes first; remaining slots use the manager's defaults.
  const ranked=uniq.filter(row=>Number(row.question_count)>0).sort((a,b)=>Number(b.question_count)-Number(a.question_count)||Number(a.display_order??100)-Number(b.display_order??100));
  const defaults=uniq.filter(row=>row.is_default).sort((a,b)=>Number(a.display_order??100)-Number(b.display_order??100));
  const remainder=uniq.sort((a,b)=>Number(a.display_order??100)-Number(b.display_order??100));
  const seen=new Set();const chosen=[];
  for(const row of [...ranked,...defaults,...remainder]){
    if(seen.has(row.slug))continue;
    seen.add(row.slug);chosen.push(row.question.trim());if(chosen.length>=limit)break;
  }
  return chosen;
}
