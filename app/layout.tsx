import { BrandSymbol } from "@/components/brand-identity";
import { SITE_URL } from "@/lib/site-url";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Github, ShieldCheck } from "lucide-react";
import "./globals.css";
import "./chat.css";

const publisher = process.env.ADSENSE_PUBLISHER_ID?.trim() ?? "";
const hasPublisher = /^ca-pub-\d{16}$/.test(publisher);
const adsEnabled = hasPublisher && process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "웅이연구소 | 무료 PDF·이미지·문서 온라인 도구", template: "%s | 웅이연구소" },
  description: "PDF·이미지 변환과 문서 미리보기를 설치 없이 이용하세요. 파일은 브라우저에서 처리합니다.",
  applicationName: "웅이연구소",
  openGraph: { locale: "ko_KR", type: "website", siteName: "웅이연구소", url: SITE_URL },
  robots: process.env.NEXT_PUBLIC_LAUNCH_READY === "true" ? { index: true, follow: true } : { index: false, follow: false },
  alternates: { types: { "application/rss+xml": `${SITE_URL}/rss.xml` } },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION?.trim() || undefined,
    other: {
      "naver-site-verification": process.env.NAVER_SITE_VERIFICATION?.trim() || "07035e99a992fee454944a610d2421460f59743d",
      ...(hasPublisher ? { "google-adsense-account": publisher } : {}),
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-scroll-behavior="smooth">
      <body>
        {adsEnabled && <Script id="adsense-autoads" async strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisher}`}
          crossOrigin="anonymous" />}
        <header className="site-header">
          <div className="site-width head-row">
            <Link href="/" className="logo" aria-label="웅이연구소 홈">
              <span className="logo-icon"><BrandSymbol size={21} /></span>
              <span>웅이연구소<small>UNG LAB</small></span>
            </Link>
            <nav aria-label="주 메뉴">
              <Link href="/tools">전체 도구</Link><Link href="/guides">가이드</Link><Link href="/about">소개</Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="site-width foot-grid">
            <div>
              <div className="foot-brand"><BrandSymbol size={20} /> 웅이연구소</div>
              <p>PDF, 이미지, 문서 작업을 웹에서 바로 처리하세요.<br />원본 파일은 서비스 서버로 전송하지 않습니다.</p>
              <div className="foot-safe"><ShieldCheck size={15} /> 원본 파일은 브라우저에서 처리합니다</div>
            </div>
            <div>
              <h3>서비스</h3>
              <Link href="/about">소개</Link><Link href="/guides">사용 가이드</Link><Link href="/contact">문의</Link>
            </div>
            <div>
              <h3>정책 및 개발</h3>
              <Link href="/privacy">개인정보 처리방침</Link><Link href="/terms">이용약관</Link>
              <a href="https://github.com/ungveloper/ung-lab-web" rel="noreferrer" target="_blank"><Github size={14} /> GitHub</a>
            </div>
          </div>
          <div className="site-width foot-bottom">© 2026 웅이연구소 · ung-lab.com</div>
        </footer>
      </body>
    </html>
  );
}
