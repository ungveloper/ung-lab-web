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
    <AppContentContainer as="main" className="!mx-auto !px-0 !pb-28 !pt-9 md:!pt-11">
      <SiteInfoBackButton />
      <article className={`site-info-article min-w-0 text-slate-700 [.site-info-page_&]:min-w-0`}>
        <header className={`site-info-hero mb-8 border-b border-slate-200 pb-8 [.site-info-page_&]:[margin:0_0_34px] [.site-info-page_&]:[padding:0_0_34px] [.site-info-page_&]:[border-bottom:1px_solid_#e2e8f0] [.site-info-page_&_h1]:m-0 [.site-info-page_&_h1]:text-[#0f172a] [.site-info-page_&_h1]:text-[clamp(29px,4vw,39px)] [.site-info-page_&_h1]:leading-[1.37] [.site-info-page_&_h1]:tracking-[-.035em] [.site-info-page_&_h1]:font-[750] [.site-info-page_&_h1]:[overflow-wrap:break-word] max-[720px]:[.site-info-page_&]:mb-[26px] max-[720px]:[.site-info-page_&]:pb-[27px]`}>
          <span className="mb-3 block text-[13px] font-bold tracking-wide text-slate-500">고객 지원</span>
          <h1 className="!m-0 text-[clamp(30px,5vw,40px)] font-extrabold leading-tight tracking-tight text-slate-950">문의하기</h1>
          <p className={`site-info-lead !mt-4 text-base leading-8 text-slate-600 [.site-info-page_&]:[margin:20px_0_0] [.site-info-page_&]:text-[#475569] [.site-info-page_&]:text-[17px] [.site-info-page_&]:font-[450] [.site-info-page_&]:leading-[2.03] [.site-info-page_&]:tracking-[-.012em] [.site-info-page_&]:[overflow-wrap:break-word] [.site-info-page_&]:break-keep max-[720px]:[.site-info-page_&]:text-base max-[720px]:[.site-info-page_&]:leading-[1.95] max-[720px]:[.site-info-page_&]:mt-[15px]`}>
            사용법이 궁금하거나 오류를 발견하셨나요? 아래 문의 양식을 작성해 보내주세요.
            보내주신 내용은 문의 확인과 서비스 개선에 활용합니다.
          </p>
        </header>

        <nav aria-label="문의 페이지 목차" className={`site-info-toc mb-8 flex flex-wrap gap-2 text-sm [.site-info-page_&]:flex [.site-info-page_&]:flex-wrap [.site-info-page_&]:items-center [.site-info-page_&]:gap-[8px_10px] [.site-info-page_&]:[margin:0_0_36px] [.site-info-page_&]:[padding:0_0_3px] [.site-info-page_&_a]:inline-flex [.site-info-page_&_a]:items-center [.site-info-page_&_a]:min-h-[36px] [.site-info-page_&_a]:[padding:6px_12px] [.site-info-page_&_a]:[border:1px_solid_#e2e8f0] [.site-info-page_&_a]:rounded-[999px] [.site-info-page_&_a]:text-[#475569] [.site-info-page_&_a]:no-underline [.site-info-page_&_a]:text-[13px] [.site-info-page_&_a]:font-semibold [.site-info-page_&_a]:leading-normal [.site-info-page_&_a]:bg-[#fff] [.site-info-page_&_a:hover]:border-[#94a3b8] [.site-info-page_&_a:hover]:bg-[#f8fafc] [.site-info-page_&_a:hover]:text-[#0f172a] max-[720px]:[.site-info-page_&]:gap-[7px] max-[720px]:[.site-info-page_&]:mb-[29px] max-[359px]:[.site-info-page_&_a]:[padding:6px_10px]`}>
          <a href="#contact-form" className="rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600 hover:bg-slate-50">문의 작성</a>
          <a href="#contact-help" className="rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600 hover:bg-slate-50">작성 안내</a>
          <a href="#contact-privacy" className="rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600 hover:bg-slate-50">개인정보</a>
        </nav>

        <section id="contact-form" aria-labelledby="contact-form-title" className={`site-info-section mb-10 scroll-mt-8 border-b border-slate-200 pb-10 [.site-info-page_&]:[padding:0_0_30px] [.site-info-page_&]:[margin:0_0_34px] [.site-info-page_&]:[border-bottom:1px_solid_#edf2f7] [.site-info-page_&]:[scroll-margin-top:36px] [.site-info-page_&:last-child]:[border-bottom:0] [.site-info-page_&:last-child]:mb-0 [.site-info-page_&:last-child]:pb-0 [.site-info-page_&_h2]:[margin:0_0_17px] [.site-info-page_&_h2]:text-[#16233a] [.site-info-page_&_h2]:text-[clamp(19px,2.6vw,22px)] [.site-info-page_&_h2]:font-[740] [.site-info-page_&_h2]:leading-[1.55] [.site-info-page_&_h2]:tracking-[-.024em] [.site-info-page_&_h2]:[overflow-wrap:break-word] [.site-info-page_&_h2]:break-keep [.site-info-page_&_p]:[margin:0_0_16px] [.site-info-page_&_p]:text-[#334155] [.site-info-page_&_p]:text-base [.site-info-page_&_p]:leading-loose [.site-info-page_&_p]:tracking-[-.006em] [.site-info-page_&_p]:break-keep [.site-info-page_&_p]:[overflow-wrap:anywhere] [.site-info-page_&_p:last-child]:mb-0 [.site-info-page_&_ul]:[margin:0_0_16px] [.site-info-page_&_ul]:pl-6 [.site-info-page_&_li]:[margin:0_0_8px] [.site-info-page_&_li]:pl-[3px] [.site-info-page_&_li]:text-[#334155] [.site-info-page_&_li]:leading-[1.96] [.site-info-page_&_li]:break-keep [.site-info-page_&_li]:[overflow-wrap:anywhere] [.site-info-page_&_li:last-child]:mb-0 [.site-info-page_&_a]:font-semibold [.site-info-page_&_a]:text-[#1d4ed8] [.site-info-page_&_a]:underline [.site-info-page_&_a]:decoration-[#93c5fd] [.site-info-page_&_a]:underline-offset-[3px] [.site-info-page_&_a:hover]:decoration-[currentColor] max-[720px]:[.site-info-page_&]:mb-[29px] max-[720px]:[.site-info-page_&]:pb-[26px] max-[720px]:[.site-info-page_&_h2]:mb-[14px] max-[720px]:[.site-info-page_&_p]:leading-[1.96]`}>
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

        <section id="contact-help" aria-labelledby="contact-help-title" className={`site-info-section mb-10 scroll-mt-8 border-b border-slate-200 pb-10 [.site-info-page_&]:[padding:0_0_30px] [.site-info-page_&]:[margin:0_0_34px] [.site-info-page_&]:[border-bottom:1px_solid_#edf2f7] [.site-info-page_&]:[scroll-margin-top:36px] [.site-info-page_&:last-child]:[border-bottom:0] [.site-info-page_&:last-child]:mb-0 [.site-info-page_&:last-child]:pb-0 [.site-info-page_&_h2]:[margin:0_0_17px] [.site-info-page_&_h2]:text-[#16233a] [.site-info-page_&_h2]:text-[clamp(19px,2.6vw,22px)] [.site-info-page_&_h2]:font-[740] [.site-info-page_&_h2]:leading-[1.55] [.site-info-page_&_h2]:tracking-[-.024em] [.site-info-page_&_h2]:[overflow-wrap:break-word] [.site-info-page_&_h2]:break-keep [.site-info-page_&_p]:[margin:0_0_16px] [.site-info-page_&_p]:text-[#334155] [.site-info-page_&_p]:text-base [.site-info-page_&_p]:leading-loose [.site-info-page_&_p]:tracking-[-.006em] [.site-info-page_&_p]:break-keep [.site-info-page_&_p]:[overflow-wrap:anywhere] [.site-info-page_&_p:last-child]:mb-0 [.site-info-page_&_ul]:[margin:0_0_16px] [.site-info-page_&_ul]:pl-6 [.site-info-page_&_li]:[margin:0_0_8px] [.site-info-page_&_li]:pl-[3px] [.site-info-page_&_li]:text-[#334155] [.site-info-page_&_li]:leading-[1.96] [.site-info-page_&_li]:break-keep [.site-info-page_&_li]:[overflow-wrap:anywhere] [.site-info-page_&_li:last-child]:mb-0 [.site-info-page_&_a]:font-semibold [.site-info-page_&_a]:text-[#1d4ed8] [.site-info-page_&_a]:underline [.site-info-page_&_a]:decoration-[#93c5fd] [.site-info-page_&_a]:underline-offset-[3px] [.site-info-page_&_a:hover]:decoration-[currentColor] max-[720px]:[.site-info-page_&]:mb-[29px] max-[720px]:[.site-info-page_&]:pb-[26px] max-[720px]:[.site-info-page_&_h2]:mb-[14px] max-[720px]:[.site-info-page_&_p]:leading-[1.96]`}>
          <h2 id="contact-help-title" className={sectionHeading}>이런 내용을 적어 주세요</h2>
          <ul className="mt-4 list-disc space-y-3 pl-6 text-[15px] leading-8 text-slate-600">
            <li>어떤 기능을 사용했는지, 어떤 문제가 있었는지</li>
            <li>오류가 발생했다면 기기·브라우저·파일 형식 및 오류 메시지</li>
            <li>답변을 받을 수 있는 이메일 주소</li>
          </ul>
          <p className="mt-4 text-[15px] leading-8 text-slate-600">기본 사용법은 <Link href="/guides" className="font-semibold text-blue-700 underline underline-offset-4">사용 가이드</Link>에서도 확인할 수 있습니다.</p>
        </section>

        <section id="contact-privacy" aria-labelledby="contact-privacy-title" className={`site-info-section scroll-mt-8 [.site-info-page_&]:[padding:0_0_30px] [.site-info-page_&]:[margin:0_0_34px] [.site-info-page_&]:[border-bottom:1px_solid_#edf2f7] [.site-info-page_&]:[scroll-margin-top:36px] [.site-info-page_&:last-child]:[border-bottom:0] [.site-info-page_&:last-child]:mb-0 [.site-info-page_&:last-child]:pb-0 [.site-info-page_&_h2]:[margin:0_0_17px] [.site-info-page_&_h2]:text-[#16233a] [.site-info-page_&_h2]:text-[clamp(19px,2.6vw,22px)] [.site-info-page_&_h2]:font-[740] [.site-info-page_&_h2]:leading-[1.55] [.site-info-page_&_h2]:tracking-[-.024em] [.site-info-page_&_h2]:[overflow-wrap:break-word] [.site-info-page_&_h2]:break-keep [.site-info-page_&_p]:[margin:0_0_16px] [.site-info-page_&_p]:text-[#334155] [.site-info-page_&_p]:text-base [.site-info-page_&_p]:leading-loose [.site-info-page_&_p]:tracking-[-.006em] [.site-info-page_&_p]:break-keep [.site-info-page_&_p]:[overflow-wrap:anywhere] [.site-info-page_&_p:last-child]:mb-0 [.site-info-page_&_ul]:[margin:0_0_16px] [.site-info-page_&_ul]:pl-6 [.site-info-page_&_li]:[margin:0_0_8px] [.site-info-page_&_li]:pl-[3px] [.site-info-page_&_li]:text-[#334155] [.site-info-page_&_li]:leading-[1.96] [.site-info-page_&_li]:break-keep [.site-info-page_&_li]:[overflow-wrap:anywhere] [.site-info-page_&_li:last-child]:mb-0 [.site-info-page_&_a]:font-semibold [.site-info-page_&_a]:text-[#1d4ed8] [.site-info-page_&_a]:underline [.site-info-page_&_a]:decoration-[#93c5fd] [.site-info-page_&_a]:underline-offset-[3px] [.site-info-page_&_a:hover]:decoration-[currentColor] max-[720px]:[.site-info-page_&]:mb-[29px] max-[720px]:[.site-info-page_&]:pb-[26px] max-[720px]:[.site-info-page_&_h2]:mb-[14px] max-[720px]:[.site-info-page_&_p]:leading-[1.96]`}>
          <h2 id="contact-privacy-title" className={sectionHeading}>개인정보 안내</h2>
          <p className="mt-4 text-[15px] leading-8 text-slate-600">제출한 이름·닉네임, 이메일 및 문의 내용은 문의 확인을 위해 Notion 데이터베이스에 저장됩니다. 원본 파일, 비밀번호, 주민등록번호 등 민감한 내용은 적지 마세요. 외부 문의 양식으로 이동하면 Notion이 접속 관련 정보를 별도로 처리할 수 있습니다.</p>
          <p className="mt-3 text-[15px] leading-8 text-slate-600"><Link href="/privacy" className="font-semibold text-blue-700 underline underline-offset-4">개인정보 처리방침</Link>에서 자세한 안내를 확인할 수 있습니다.</p>
        </section>
      </article>
    </AppContentContainer>
  );
}
