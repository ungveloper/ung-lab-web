import { SiteInfoBackButton } from "@/components/site-info-back-button";
import { AppContentContainer } from "@/components/app-content-container";
import Link from "next/link";

export const metadata = {
  title: "문의하기",
  description: "웅이연구소의 기능 오류, 사용법 및 서비스 관련 문의를 온라인 양식으로 접수합니다.",
  alternates: { canonical: "/contact" },
};

// Notion의 'Embed this page' 주소 형식은 /ebd/<page-id>입니다.
// 전달된 임베드 코드의 /ebd// 이중 슬래시는 표준 형식으로 정리했습니다.
// 반드시 데이터베이스의 개별 페이지가 아닌, 실제 공개 Form 보기인지 확인하세요.
const NOTION_FORM_LINK =
  "https://jealous-growth-583.notion.site/34f7f0af97c2800aa222d3faf6e6443b?pvs=105";
const NOTION_FORM_EMBED =
  "https://jealous-growth-583.notion.site/ebd/34f7f0af97c2800aa222d3faf6e6443b";

export default function Page() {
  return (
    <AppContentContainer as="main" className="content-page site-info-page">
      <SiteInfoBackButton />
      <article className="site-info-article">
        <header className="site-info-hero">
          <span className="site-info-eyebrow">고객 지원</span>
          <h1>문의하기</h1>
          <p className="site-info-lead">
            사용법이 궁금하거나 오류를 발견하셨나요? 아래 문의 양식을 작성해 보내주세요.
            보내주신 내용은 서비스 개선과 문의 확인에 활용합니다.
          </p>
        </header>

        <nav className="site-info-toc" aria-label="문의 페이지 목차">
          <span className="site-info-toc-label">이 페이지에서</span>
          <a href="#contact-form">문의 양식</a>
          <a href="#contact-help">작성 안내</a>
          <a href="#contact-privacy">개인정보 안내</a>
        </nav>

        <section className="site-info-section" id="contact-form" aria-labelledby="contact-form-title">
          <h2 id="contact-form-title">문의 양식 작성하기</h2>
          <p>아래 양식에 문의 내용과 답변받을 이메일을 입력한 뒤 제출해 주세요. 제출 후 화면에 표시되는 완료 안내를 확인해 주세요.</p>
          <div className="site-info-contact-form-shell">
            <div className="site-info-contact-form-topline">
              <span className="site-info-contact-form-dot" aria-hidden="true" />
              <strong>웅이연구소 문의하기</strong>
              <span>아래 항목을 작성해 주세요</span>
            </div>
            <iframe
              className="site-info-contact-form-iframe"
              src={NOTION_FORM_EMBED}
              title="웅이연구소 문의 양식"
              loading="lazy"
              scrolling="no"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <p className="site-info-contact-form-fallback">
            양식이 보이지 않거나 입력하기 어렵다면 새 창에서 작성해 주세요.
          </p>
          <p>
            <a className="site-info-primary-link" href={NOTION_FORM_LINK} target="_blank" rel="noopener noreferrer">
              문의 양식 새 창에서 열기
            </a>
          </p>
        </section>

        <section className="site-info-section" id="contact-help" aria-labelledby="contact-help-title">
          <h2 id="contact-help-title">이런 내용을 적어 주세요</h2>
          <ul>
            <li>무엇을 문의하는지 알 수 있는 제목과 구체적인 문의 내용</li>
            <li>오류 제보라면 사용한 도구 이름, 파일 형식과 발생한 순서</li>
            <li>기기, 운영체제, 브라우저와 표시된 오류 메시지</li>
            <li>답변이 필요한 경우 연락받을 수 있는 이메일 주소</li>
          </ul>
          <p>도구 사용법은 <Link href="/guides">사용 가이드</Link>에서도 확인할 수 있습니다. 접수된 내용은 순서대로 확인하지만 답변 시점을 보장하지는 않습니다.</p>
        </section>

        <section className="site-info-section" id="contact-privacy" aria-labelledby="contact-privacy-title">
          <h2 id="contact-privacy-title">개인정보와 문의 내용 안내</h2>
          <p>양식은 외부 서비스인 Notion에서 제공하며, 입력한 이름·닉네임, 이메일, 문의 내용 등이 Notion에 저장될 수 있습니다. 원본 문서, 비밀번호, 주민등록번호, 인증 정보 등 민감한 내용은 입력하지 마세요.</p>
          <p>문의 데이터 처리 방식은 <Link href="/privacy">개인정보 처리방침</Link>에서 확인하실 수 있습니다.</p>
        </section>
      </article>
    </AppContentContainer>
  );
}
