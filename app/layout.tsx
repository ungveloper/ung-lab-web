import { BrandSymbol } from "@/components/brand-identity";
import { SITE_URL } from "@/lib/site-url";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Github, ShieldCheck } from "lucide-react";
import "./tailwind.css";
import { AppToaster } from "@/app/_components/common/app-toaster";

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
    <html lang="ko" data-scroll-behavior="smooth" className={`[--bg:#ffffff] [--ink:#18253d] [--muted:#67758e] [--line:#e5eaf2] [--blue:#2563eb] [--pale:#f5f8ff] [scroll-behavior:smooth]`}>
      <body className={`[&_*]:box-border m-0 bg-[#fff] text-[var(--ink)] font-[Arial,"Apple_SD_Gothic_Neo","Malgun_Gothic",sans-serif] text-base leading-[1.55] [&_button]:[font:inherit] [&_input]:[font:inherit] [&_select]:[font:inherit] [&_textarea]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:opacity-[.52] [&_button:disabled]:cursor-not-allowed [&_a]:text-[inherit] [&_a]:no-underline [&_a:hover]:text-[var(--blue)] focus-visible:[outline:3px_solid_#2563eb] focus-visible:[outline-offset:3px] [&_h1]:mt-0 [&_h2]:mt-0 [&_h3]:mt-0 [&_p]:mt-0 [&_h1]:tracking-[-.04em] [&_h2]:tracking-[-.04em] [&_h3]:tracking-[-.04em] [&:has(.chat-home)_.site-header]:hidden [&:has(.chat-home)_.site-footer]:hidden [&:has(.chat-home)]:bg-[#fff] [&:has(.tool-app-shell)_.site-header]:hidden [&:has(.tool-app-shell)_.site-footer]:hidden [&:has(.tool-app-shell)]:bg-[#fff] [&:has(.tool-app-loading)_.site-header]:hidden [&:has(.tool-app-loading)_.site-footer]:hidden [&:has(.guides-app-shell)_.site-header]:hidden [&:has(.guides-app-shell)_.site-footer]:hidden`}>
        {adsEnabled && <Script id="adsense-autoads" async strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisher}`}
          crossOrigin="anonymous" />}
        <header className={`site-header [border-bottom:1px_solid_#eef0f5] bg-[#fff] relative z-5 [&_nav]:flex [&_nav]:gap-8 [&_nav]:text-[#536176] [&_nav]:text-base [&_nav]:font-[650] max-[600px]:[&_nav]:gap-[14px] max-[600px]:[&_nav]:text-sm max-[600px]:[&_nav_a:last-child]:hidden max-[370px]:[&_nav_a:nth-child(2)]:hidden print:!hidden`}>
          <div className={`site-width head-row w-[min(1240px,calc(100%_-_48px))] [margin-inline:auto] h-[76px] flex items-center justify-between [.hero_&]:relative [.hero_&]:z-1 max-[600px]:w-[min(100%_-_32px,1240px)] max-[600px]:h-[66px] print:w-full print:m-0 print:p-0 [.tool-page-scroll>__&.tool-page]:w-[min(1100px,calc(100%_-_64px))] [.tool-page-scroll>__&.tool-page]:[margin-inline:auto] [.tool-page-scroll>__&.tool-page]:pt-5 [.tool-page-scroll>__&.tool-page]:pb-[100px] max-[1050px]:[.tool-page-scroll>__&.tool-page]:w-[min(100%_-_40px,1100px)] max-[720px]:[.tool-page-scroll>__&.tool-page]:w-[calc(100%_-_26px)] max-[720px]:[.tool-page-scroll>__&.tool-page]:pt-[18px] max-[720px]:[.tool-page-scroll>__&.tool-page]:pb-[75px]`}>
            <Link href="/" className={`logo flex items-center gap-[11px] text-[21px] font-extrabold leading-[1.07] tracking-[-.06em] [&_small]:text-[11px] [&_small]:block [&_small]:tracking-[.17em] [&_small]:text-[#8a96a9] [&_small]:font-bold [&_small]:mt-[6px] max-[600px]:text-lg`} aria-label="웅이연구소 홈">
              <span className={`logo-icon w-10 h-10 flex items-center justify-center rounded-[12px] bg-[var(--blue)] text-[#fff] shadow-[0_8px_15px_#2563eb20] max-[600px]:w-[34px] max-[600px]:h-[34px]`}><BrandSymbol size={21} /></span>
              <span>웅이연구소<small>UNG LAB</small></span>
            </Link>
            <nav aria-label="주 메뉴">
              <Link href="/tools">전체 도구</Link><Link href="/guides">가이드</Link><Link href="/about">소개</Link>
            </nav>
          </div>
        </header>
        {children}
        <AppToaster />
        <footer className={`site-footer bg-[#f9fafc] [border-top:1px_solid_#e9ecf2] [padding:48px_0_0] [&_p]:text-sm [&_p]:text-[#8b96a6] [&_p]:leading-[1.9] [&_p]:[margin:14px_0] [&_h3]:text-[15px] [&_h3]:[margin:0_0_14px] [&_a]:flex [&_a]:items-center [&_a]:gap-[5px] [&_a]:text-sm [&_a]:text-[#8792a3] [&_a]:mb-[9px] print:!hidden`}>
          <div className={`site-width foot-grid w-[min(1240px,calc(100%_-_48px))] [margin-inline:auto] [.hero_&]:relative [.hero_&]:z-1 grid [grid-template-columns:2fr_1fr_1fr] gap-10 max-[900px]:[grid-template-columns:2fr_1fr_1fr] max-[600px]:w-[min(100%_-_32px,1240px)] max-[600px]:[grid-template-columns:1fr_1fr] max-[600px]:gap-5 max-[600px]:[&>div:first-child]:[grid-column:1/-1] print:w-full print:m-0 print:p-0 [.tool-page-scroll>__&.tool-page]:w-[min(1100px,calc(100%_-_64px))] [.tool-page-scroll>__&.tool-page]:[margin-inline:auto] [.tool-page-scroll>__&.tool-page]:pt-5 [.tool-page-scroll>__&.tool-page]:pb-[100px] max-[1050px]:[.tool-page-scroll>__&.tool-page]:w-[min(100%_-_40px,1100px)] max-[720px]:[.tool-page-scroll>__&.tool-page]:w-[calc(100%_-_26px)] max-[720px]:[.tool-page-scroll>__&.tool-page]:pt-[18px] max-[720px]:[.tool-page-scroll>__&.tool-page]:pb-[75px]`}>
            <div>
              <div className={`foot-brand flex gap-[7px] items-center text-[19px] font-extrabold text-[#243248] [&_svg]:text-[#2665e3]`}><BrandSymbol size={20} /> 웅이연구소</div>
              <p>PDF, 이미지, 문서 작업을 웹에서 바로 처리하세요.<br />원본 파일은 서비스 서버로 전송하지 않습니다.</p>
              <div className={`foot-safe text-[13px] text-[#5377a7] flex items-center gap-[5px] hidden`}><ShieldCheck size={15} /> 원본 파일은 브라우저에서 처리합니다</div>
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
          <div className={`site-width foot-bottom w-[min(1240px,calc(100%_-_48px))] [margin-inline:auto] [.hero_&]:relative [.hero_&]:z-1 [border-top:1px_solid_#e7ecf2] mt-10 [padding:19px_0] text-[13px] text-[#a1abb9] max-[600px]:w-[min(100%_-_32px,1240px)] print:w-full print:m-0 print:p-0 [.tool-page-scroll>__&.tool-page]:w-[min(1100px,calc(100%_-_64px))] [.tool-page-scroll>__&.tool-page]:[margin-inline:auto] [.tool-page-scroll>__&.tool-page]:pt-5 [.tool-page-scroll>__&.tool-page]:pb-[100px] max-[1050px]:[.tool-page-scroll>__&.tool-page]:w-[min(100%_-_40px,1100px)] max-[720px]:[.tool-page-scroll>__&.tool-page]:w-[calc(100%_-_26px)] max-[720px]:[.tool-page-scroll>__&.tool-page]:pt-[18px] max-[720px]:[.tool-page-scroll>__&.tool-page]:pb-[75px]`}>© 2026 웅이연구소 · ung-lab.com</div>
        </footer>
      </body>
    </html>
  );
}
