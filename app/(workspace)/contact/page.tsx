import { SiteInfoBackButton } from "@/components/site-info-back-button";
import { AppContentContainer } from "@/components/app-content-container";
import Link from "next/link";

export const metadata = {
  title: "문의 및 오류 신고",
  description: "웅이연구소의 기능 오류와 사용법 문의를 접수하는 방법입니다.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return <AppContentContainer as="main" className="content-page site-info-page">
    <SiteInfoBackButton />
    <article className="site-info-article">
      <header className="site-info-hero">
        <span className="site-info-eyebrow">고객 지원</span>
        <h1>문의 및 오류 신고</h1>
        <p className="site-info-lead">파일이 열리지 않거나 결과가 예상과 다르다면 알려주세요. 현재 문의는 공개 GitHub 이슈에서 받고 있습니다.</p>
      </header>
      <nav className="site-info-toc" aria-label="문의 페이지 목차">
        <span className="site-info-toc-label">이 페이지에서</span>
        <a href="#contact-report">문의 방법</a><a href="#contact-details">제보할 내용</a><a href="#contact-privacy">개인정보 주의</a>
      </nav>
      <section className="site-info-section" id="contact-report" aria-labelledby="contact-report-title">
        <h2 id="contact-report-title">어디로 문의하면 되나요?</h2>
        <p>웅이연구소 GitHub 저장소에서 새 이슈를 작성할 수 있습니다. 이미 같은 문제가 등록되어 있는지도 살펴보세요. 현재 별도의 비공개 이메일 상담 창구는 운영하지 않습니다.</p>
        <p><a className="site-info-primary-link" href="https://github.com/ungveloper/ung-lab-web/issues" target="_blank" rel="noopener noreferrer">GitHub 이슈에서 문의하기 (새 창)</a></p>
      </section>
      <section className="site-info-section" id="contact-details" aria-labelledby="contact-details-title">
        <h2 id="contact-details-title">이런 내용을 알려주시면 좋아요</h2>
        <ul>
          <li>사용한 도구 이름과 작업하려던 파일 형식</li>
          <li>사용한 브라우저와 운영체제</li>
          <li>오류가 난 순서와 화면에 표시된 오류 메시지</li>
          <li>가능하다면 개인정보를 지운 화면 사진</li>
        </ul>
        <p>문제를 다시 확인할 수 있도록 순서를 짧게 적어주시면 도움이 됩니다. 도구 사용법은 <Link href="/guides">사용 가이드</Link>에서도 확인할 수 있습니다.</p>
      </section>
      <section className="site-info-section" id="contact-privacy" aria-labelledby="contact-privacy-title">
        <h2 id="contact-privacy-title">공개되는 정보에 주의해 주세요</h2>
        <p>GitHub 이슈는 누구나 읽을 수 있습니다. 원본 문서, 주민등록번호, 비밀번호, 연락처 등 외부에 공개되면 곤란한 내용은 올리지 마세요. 공개된 글은 이미 다른 사람이 확인했을 수 있으므로 삭제하더라도 비공개를 보장할 수 없습니다.</p>
      </section>
    </article>
  </AppContentContainer>;
}
