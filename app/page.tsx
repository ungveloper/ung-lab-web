import {ToolExplorer} from "@/components/tool-explorer";
import {ArrowRight} from "lucide-react";
import Link from "next/link";
import {Suspense} from "react";
export default function Home(){return <main><section className="hero"><div className="site-width"><h1>복잡한 작업도,<br/><span>여기서는 간단하게.</span></h1><p>PDF 변환부터 이미지 편집, 문서 미리보기까지.<br/>설치 없이, 가입 없이, 필요한 도구를 바로 사용하세요.</p></div></section><Suspense fallback={<div className="site-width" style={{height:350,paddingTop:75}}>도구 목록을 불러오는 중...</div>}><ToolExplorer/></Suspense><div className="site-width" style={{paddingBottom:54}}><Link href="/guides" className="subtle-link">온라인 도구 사용법과 문제 해결 가이드 보기 <ArrowRight size={16}/></Link></div></main>}
