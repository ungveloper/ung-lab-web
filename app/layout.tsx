import type { Metadata } from "next";
import Link from "next/link";
import { FlaskConical, Github, ShieldCheck } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
 metadataBase: new URL("https://ung-lab.com"),
 title: {default:"웅이연구소 | 무료 PDF·이미지·문서 온라인 도구",template:"%s | 웅이연구소"},
 description:"설치·가입 없이 PDF, 이미지, Word, PPTX, Excel, CSV 파일을 브라우저에서 안전하게 처리하세요.",
 openGraph:{locale:"ko_KR",type:"website",siteName:"웅이연구소"},
 robots:process.env.NEXT_PUBLIC_LAUNCH_READY==="true"?{index:true,follow:true}:{index:false,follow:false},
};
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="ko" data-scroll-behavior="smooth"><body><header className="site-header"><div className="site-width head-row"><Link href="/" className="logo" aria-label="웅이연구소 홈"><span className="logo-icon"><FlaskConical size={21}/></span><span>웅이연구소<small>UNG LAB</small></span></Link><nav aria-label="주 메뉴"><Link href="/#all-tools">전체 도구</Link><Link href="/guides">가이드</Link><Link href="/about">소개</Link></nav></div></header>{process.env.NEXT_PUBLIC_LAUNCH_READY!=="true"&&<div className="prelaunch">개발·검증 중인 미리보기입니다. 11개 도구의 품질 검증이 완료되기 전에는 검색 색인이 비활성화됩니다.</div>}{children}<footer className="site-footer"><div className="site-width foot-grid"><div><div className="foot-brand"><FlaskConical size={20}/> 웅이연구소</div><p>필요한 작업을 더 빠르고 간편하게.<br/>사용자 파일은 브라우저 안에서 처리합니다.</p><div className="foot-safe"><ShieldCheck size={15}/> 서버에 원본 파일을 업로드하지 않아요</div></div><div><h3>웅이연구소</h3><Link href="/about">서비스 소개</Link><Link href="/guides">사용 가이드</Link><Link href="/contact">문의</Link></div><div><h3>정책 및 개발</h3><Link href="/privacy">개인정보 처리방침</Link><Link href="/terms">이용약관</Link><a href="https://github.com/ungveloper/ung-lab-web" rel="noreferrer" target="_blank"><Github size={14}/> GitHub</a></div></div><div className="site-width foot-bottom">© 2026 웅이연구소 · ung-lab.com</div></footer></body></html>;
}
