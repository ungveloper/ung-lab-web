import Link from "next/link";
import { SiteInfoBackButton } from "@/components/site-info-back-button";
import { AppContentContainer } from "@/components/app-content-container";
import ContactForm from "@/components/contact-form";

export const metadata = {
  title: "문의하기",
  description: "웅이연구소의 사용법, 오류 및 서비스 개선 의견을 문의 양식으로 접수합니다.",
  alternates: { canonical: "/contact" },
};

const NOTION_FORM_LINK = "https://jealous-growth-583.notion.site/34f7f0af97c2800aa222d3faf6e6443b?pvs=105";

const sectionHeading = "text-[21px] font-bold leading-[1.5] tracking-tight text-slate-900";

export default function Page() {
  const isConnected = Boolean(process.env.NOTION_API_TOKEN && process.env.NOTION_DATA_SOURCE_ID);
  return (
    <AppContentContainer as="main" className="!mx-auto !w-full !max-w-[780px] !px-5 !pb-28 !pt-9 md:!px-8">
      <SiteInfoBackButton />
      <article className="site-info-article min-w-0 text-slate-700">
        <header className="site-info-hero mb-8 border-b border-slate-200 pb-8">
          <span className="mb-3 block text-[13px] font-bold tracking-wide text-slate-500">고객 지원</span>
          <h1 className="!m-0 text-[clamp(30px,5vw,40px)] font-extrabold leading-tight tracking-tight text-slate-950">문의하기</h1>
          <p className="site-info-lead !mt-4 text-base leading-8 text-slate-600">
            사용법이 궁금하거나 오류를 발견하셨나요? 아래 문의 양식을 작성해 보내주세요.
            보내주신 내용은 문의 확인과 서비스 개선에 활용합니다.
          </p>
        </header>

        <nav aria-label="문의 페이지 목차" className="site-info-toc mb-8 flex flex-wrap gap-2 text-sm">
          <a href="#contact-form" className="rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600 hover:bg-slate-50">문의 작성</a>
          <a href="#contact-help" className="rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600 hover:bg-slate-50">작성 안내</a>
          <a href="#contact-privacy" className="rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600 hover:bg-slate-50">개인정보</a>
        </nav>

        <section id="contact-form" aria-labelledby="contact-form-title" className="site-info-section mb-10 scroll-mt-8 border-b border-slate-200 pb-10">
          <h2 id="contact-form-title" className={sectionHeading}>문의 양식 작성하기</h2>
          <p className="my-4 text-base leading-8 text-slate-600">성함 또는 닉네임, 답변받을 이메일과 문의 내용을 입력해 주세요.</p>
          {isConnected ? (
            <ContactForm />
          ) : (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <p className="m-0 text-base leading-7 text-slate-700">현재 사이트 내 문의 접수 준비 중입니다. 아래 버튼으로 문의 양식을 열어 작성해 주세요.</p>
              <a href={NOTION_FORM_LINK} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-5 text-[15px] font-bold text-white! no-underline! hover:bg-blue-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-400">
                문의 양식 열기
              </a>
            </div>
          )}
          {isConnected && (
            <p className="mt-5 text-sm leading-7 text-slate-500">
              사이트에서 제출하기 어렵다면 <a href={NOTION_FORM_LINK} className="font-semibold text-blue-700 underline underline-offset-4" target="_blank" rel="noopener noreferrer">문의 양식을 새 창에서 열어 작성</a>할 수 있습니다.
            </p>
          )}
        </section>

        <section id="contact-help" aria-labelledby="contact-help-title" className="site-info-section mb-10 scroll-mt-8 border-b border-slate-200 pb-10">
          <h2 id="contact-help-title" className={sectionHeading}>이런 내용을 적어 주세요</h2>
          <ul className="mt-4 list-disc space-y-3 pl-6 text-[15px] leading-8 text-slate-600">
            <li>어떤 기능을 사용했는지, 어떤 문제가 있었는지</li>
            <li>오류가 발생했다면 기기·브라우저·파일 형식 및 오류 메시지</li>
            <li>답변을 받을 수 있는 이메일 주소</li>
          </ul>
          <p className="mt-4 text-[15px] leading-8 text-slate-600">기본 사용법은 <Link href="/guides" className="font-semibold text-blue-700 underline underline-offset-4">사용 가이드</Link>에서도 확인할 수 있습니다.</p>
        </section>

        <section id="contact-privacy" aria-labelledby="contact-privacy-title" className="site-info-section scroll-mt-8">
          <h2 id="contact-privacy-title" className={sectionHeading}>개인정보 안내</h2>
          <p className="mt-4 text-[15px] leading-8 text-slate-600">제출한 이름·닉네임, 이메일 및 문의 내용은 문의 확인을 위해 Notion 데이터베이스에 저장됩니다. 원본 파일, 비밀번호, 주민등록번호 등 민감한 내용은 적지 마세요. 외부 문의 양식으로 이동하면 Notion이 접속 관련 정보를 별도로 처리할 수 있습니다.</p>
          <p className="mt-3 text-[15px] leading-8 text-slate-600"><Link href="/privacy" className="font-semibold text-blue-700 underline underline-offset-4">개인정보 처리방침</Link>에서 자세한 안내를 확인할 수 있습니다.</p>
        </section>
      </article>
    </AppContentContainer>
  );
}
