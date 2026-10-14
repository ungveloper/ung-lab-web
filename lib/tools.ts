export type Category = "pdf" | "image" | "document";
export type Tool = {
  slug: string; title: string; subtitle: string; category: Category;
  tags: string[]; aliases: string[]; icon: string; featured?: boolean;
  steps: [string,string,string]; formats: string; details: string[];
};
export const categories: Record<Category,{name:string; color:string; description:string}> = {
  pdf: {name:"PDF",color:"#e96064",description:"PDF 페이지와 문서를 간편하게 변환합니다."},
  image: {name:"이미지",color:"#3478f6",description:"사진을 원하는 크기와 형식으로 가공합니다."},
  document: {name:"문서",color:"#9a6ce7",description:"프로그램 설치 없이 문서 내용을 확인합니다."},
};
export const tools:Tool[] = [
  {slug:"pdf-to-image",title:"PDF를 이미지로 변환",subtitle:"원하는 PDF 페이지를 PNG, JPG, WebP로 저장",category:"pdf",tags:["PDF","이미지","변환","추출"],aliases:["pdf jpg","pdf png","pdf webp","pdf 사진","피디에프 이미지"],icon:"FileImage",featured:true,steps:["PDF 파일을 선택하세요","페이지와 이미지 형식을 선택하세요","변환 후 이미지 또는 ZIP을 받으세요"],formats:"PDF → PNG / JPG / WebP",details:["암호가 있는 PDF는 비밀번호를 알고 있을 때 열 수 있습니다.","페이지 범위와 개별 페이지를 선택할 수 있습니다.","고급 설정에서 렌더링 배율을 변경할 수 있습니다."]},
  {slug:"image-to-pdf",title:"이미지를 PDF로 변환",subtitle:"여러 장의 사진을 하나의 PDF로 묶기",category:"pdf",tags:["PDF","이미지","변환","병합"],aliases:["jpg pdf","png pdf","사진 pdf","이미지 합치기"],icon:"Files",featured:true,steps:["이미지를 여러 장 추가하세요","순서와 용지 설정을 조절하세요","PDF 파일을 다운로드하세요"],formats:"JPG / PNG / WebP → PDF",details:["드래그로 페이지 순서를 바꿀 수 있습니다.","A4·A3·Letter·원본 크기와 여백을 지원합니다.","HEIC/AVIF는 브라우저 호환성이 확인된 환경에서만 열립니다."]},
  {slug:"image-compressor",title:"이미지 최적화",subtitle:"화질을 고려해 이미지 용량 줄이기",category:"image",tags:["이미지","압축","최적화"],aliases:["tinypng","사진 용량 줄이기","이미지 압축","사진 최적화"],icon:"Minimize2",featured:true,steps:["이미지를 추가하세요","압축 강도와 품질을 설정하세요","전후 용량을 확인하고 저장하세요"],formats:"JPG / PNG / WebP",details:["원본보다 결과가 커지면 원본을 유지합니다.","손실 압축과 가능한 범위의 원본 유지 모드를 제공합니다.","여러 이미지를 한 번에 처리합니다."]},
  {slug:"image-resizer",title:"이미지 크기 변경",subtitle:"픽셀·비율·프리셋으로 일괄 크기 조절",category:"image",tags:["이미지","크기","편집"],aliases:["사진 사이즈","resize","이미지 리사이즈","픽셀 변경"],icon:"Scaling",steps:["이미지를 추가하세요","가로·세로 또는 비율을 지정하세요","크기 변경 이미지를 저장하세요"],formats:"JPG / PNG / WebP",details:["가로세로 비율을 잠글 수 있습니다.","확대할 경우 화질 저하가 생길 수 있습니다.","동일한 크기를 여러 장에 적용할 수 있습니다."]},
  {slug:"image-converter",title:"이미지 형식 변환",subtitle:"WebP → PNG를 포함한 이미지 확장자 변환",category:"image",tags:["이미지","변환","WebP","PNG"],aliases:["webp png","webp를 png로","jpg png","png webp","사진 형식 변환"],icon:"RefreshCw",featured:true,steps:["이미지 파일을 선택하세요","변환할 출력 형식을 지정하세요","결과 파일을 다운로드하세요"],formats:"JPG ↔ PNG ↔ WebP / 지원 환경의 AVIF",details:["WebP → PNG 변환은 필수 지원 경로입니다.","투명도를 JPG로 변환할 때 배경색을 선택합니다.","애니메이션은 지원하지 않으며 감지 시 안내합니다."]},
  {slug:"image-cropper",title:"이미지 자르기",subtitle:"비율 설정·회전·반전으로 원하는 영역 편집",category:"image",tags:["이미지","자르기","편집"],aliases:["crop","사진 자르기","사진 편집","비율 맞추기"],icon:"Crop",steps:["이미지를 선택하세요","영역·회전·비율을 조절하세요","잘린 이미지를 다운로드하세요"],formats:"JPG / PNG / WebP",details:["1:1·4:3·16:9·9:16 및 사용자 지정 비율을 제공합니다.","확대·회전·반전·실행 취소를 지원합니다.","모바일 터치 환경에서도 조작할 수 있습니다."]},
  {slug:"background-remover",title:"이미지 배경 제거",subtitle:"AI를 브라우저에서 실행해 인물 배경 분리",category:"image",tags:["이미지","배경","AI","편집"],aliases:["누끼","remove background","배경제거","투명 배경"],icon:"ScanFace",steps:["인물이 나온 이미지를 선택하세요","AI 모델을 기기에 내려받아 처리하세요","투명 배경 이미지 또는 배경색 이미지를 저장하세요"],formats:"JPG / PNG / WebP → 투명 PNG / WebP",details:["최초 사용 시 AI 모델을 내려받고 브라우저에서 추론합니다.","MODNet은 인물 중심 모델로 일반 상품 사진에는 잘 맞지 않을 수 있습니다.","모델이나 기기 상태에 따라 처리 시간이 길어질 수 있습니다."]},
  {slug:"docx-viewer",title:"Word(DOCX) 뷰어",subtitle:"Word를 설치하지 않고 문서 내용 미리보기",category:"document",tags:["문서","Word","뷰어","DOCX"],aliases:["워드 뷰어","docx 열기","docx 미리보기"],icon:"FileText",steps:["DOCX 파일을 선택하세요","페이지를 확대하거나 검색하세요","내용을 확인하고 원본을 저장하세요"],formats:"DOCX",details:["읽기 전용으로 처리하며 매크로를 실행하지 않습니다.","복잡한 레이아웃은 Word 원본과 다르게 보일 수 있습니다.","브라우저 인쇄는 원본과 차이가 날 수 있습니다."]},
  {slug:"pptx-viewer",title:"PowerPoint(PPTX) 뷰어",subtitle:"슬라이드와 썸네일을 브라우저에서 확인",category:"document",tags:["문서","PPTX","뷰어","슬라이드"],aliases:["파워포인트 뷰어","pptx 열기","ppt 미리보기"],icon:"Presentation",steps:["PPTX 파일을 선택하세요","슬라이드를 넘기거나 확대하세요","내용을 확인하고 원본을 저장하세요"],formats:"PPTX",details:["원본 비율과 정적 슬라이드 중심으로 표시합니다.","애니메이션·일부 SmartArt·특수 글꼴은 다르게 보일 수 있습니다.","파일 내용은 서버로 전송하지 않습니다."]},
  {slug:"xlsx-viewer",title:"Excel(XLSX) 뷰어",subtitle:"시트·수식·표를 읽기 전용으로 확인",category:"document",tags:["문서","XLSX","뷰어","표"],aliases:["엑셀 뷰어","xlsx 열기","엑셀 미리보기"],icon:"Table2",steps:["XLSX 파일을 선택하세요","시트를 전환하고 셀을 확인하세요","검색·필터 또는 CSV 내보내기를 이용하세요"],formats:"XLSX",details:["저장된 수식 결과값은 최신 계산 결과가 아닐 수 있습니다.","시트를 탐색하고 선택 셀의 수식을 볼 수 있습니다.","매크로·외부 데이터 연결은 실행하지 않습니다."]},
  {slug:"csv-viewer",title:"CSV 뷰어",subtitle:"인코딩 자동 추정·검색·필터·CSV 저장",category:"document",tags:["문서","CSV","뷰어","표"],aliases:["csv 열기","csv 뷰어","cp949","엑셀 csv"],icon:"ListFilter",steps:["CSV 파일을 선택하세요","인코딩과 구분자를 확인하세요","정렬·필터 후 필요한 데이터를 저장하세요"],formats:"CSV / TSV",details:["한글 CP949 등의 인코딩을 선택할 수 있습니다.","전화번호·식별자의 선행 0을 보존합니다.","필터된 결과는 원본 보존과 안전 내보내기를 구분합니다."]},
];
export const toolBySlug=(slug:string)=>tools.find(t=>t.slug===slug);
export const normalize=(s:string)=>s.toLocaleLowerCase("ko").replace(/\s+/g, "").replace(/[-_]/g,"");
export function searchTools(query:string,category:string,tags:string[]){
 return tools.filter(t=>(category==="all"||t.category===category)&&(!tags.length||tags.some(tag=>t.tags.includes(tag)))&&(!query.trim()||[t.title,t.subtitle,t.formats,...t.tags,...t.aliases].some(v=>normalize(v).includes(normalize(query)))));
}
