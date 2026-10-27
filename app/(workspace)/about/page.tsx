import { SiteInfoBackButton } from "@/components/site-info-back-button";
import { AppContentContainer } from "@/components/app-content-container";
import Link from "next/link";

export const metadata = {
  title: "서비스 소개",
  description: "웅이연구소에서 제공하는 PDF·이미지 변환, 문서 미리보기 기능과 파일 처리 방식을 소개합니다.",
  alternates: { canonical: "/about" },
};

export default function Page() {
  return <AppContentContainer as="main" className="content-page site-info-page">
    <SiteInfoBackButton />
    <article className="site-info-article">
      <header className="site-info-hero">
        <span className="site-info-eyebrow">서비스 안내</span>
        <h1>웅이연구소 소개</h1>
        <p className="site-info-lead">파일 형식을 바꾸거나 문서를 확인하려고 프로그램을 따로 설치할 필요는 없습니다. 웅이연구소는 자주 쓰는 파일 작업을 브라우저에서 바로 처리할 수 있도록 만든 도구 모음입니다.</p>
      </header>
      <nav className="site-info-toc" aria-label="소개 페이지 목차">
        <span className="site-info-toc-label">이 페이지에서</span>
        <a href="#about-tools">지원 기능</a><a href="#about-files">파일 처리</a><a href="#about-limits">사용 전 확인</a><a href="#about-help">도움받기</a>
      </nav>
      <section className="site-info-section" id="about-tools" aria-labelledby="about-tools-title">
        <h2 id="about-tools-title">어떤 작업을 할 수 있나요?</h2>
        <p>PDF의 필요한 페이지만 PNG나 JPG로 저장하고, 여러 사진은 PDF 하나로 묶을 수 있습니다. 사진 용량 줄이기, 크기 조절, 형식 변환, 자르기와 인물 사진 배경 제거도 지원합니다.</p>
        <p>Word·PowerPoint·Excel·CSV 파일은 별도 프로그램 없이 읽기 전용으로 열어볼 수 있습니다. 지금 제공하는 기능은 <Link href="/tools">전체 도구</Link>에서 확인하세요.</p>
      </section>
      <section className="site-info-section" id="about-files" aria-labelledby="about-files-title">
        <h2 id="about-files-title">파일은 어디에서 처리하나요?</h2>
        <p>사용자가 선택한 원본 파일은 브라우저에서 처리합니다. 파일을 변환하려고 웅이연구소 서버에 원본을 업로드하지 않습니다.</p>
        <p>다만 인물 배경 제거 기능을 처음 사용할 때는 외부 배포 서버에서 AI 모델을 내려받습니다. 많이 쓰는 도구를 파악하기 위해 제한된 사용 횟수를 집계할 수도 있습니다. 기록과 쿠키에 관한 자세한 내용은 <Link href="/privacy">개인정보 처리방침</Link>에 적었습니다.</p>
      </section>
      <section className="site-info-section" id="about-limits" aria-labelledby="about-limits-title">
        <h2 id="about-limits-title">사용 전에 확인해 주세요</h2>
        <p>작업 속도는 기기의 성능과 브라우저에 따라 달라집니다. Office 문서에서는 복잡한 표나 고급 서식, 일부 수식 결과가 원본 프로그램과 다르게 보일 수 있습니다.</p>
        <p>제출해야 하거나 중요한 문서라면 결과를 직접 열어보고, 원본 파일도 따로 보관해 주세요.</p>
      </section>
      <section className="site-info-section" id="about-help" aria-labelledby="about-help-title">
        <h2 id="about-help-title">처음 사용하는 기능이라면</h2>
        <p><Link href="/guides">사용 가이드</Link>에서 실제 작업 순서와 주의할 점을 볼 수 있습니다. 오류를 발견했거나 사용법이 궁금하다면 <Link href="/contact">문의 페이지</Link>를 확인하세요.</p>
      </section>
    </article>
  </AppContentContainer>;
}
