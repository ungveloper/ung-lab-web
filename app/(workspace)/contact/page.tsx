import Link from "next/link";
import ContactForm from "@/components/contact-form";

import {SiteInfoLayout} from "@/app/_components/site-info/site-info-layout";
import {PageSection, PageParagraph, PAGE_LINK_CLASSES} from "@/app/_components/common/page-section";

export const metadata = {
  title: "문의하기",
  description: "웅이연구소의 사용법, 오류 및 서비스 개선 의견을 문의 양식으로 접수합니다.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  const isConnected = Boolean(process.env.NOTION_API_TOKEN && process.env.NOTION_DATA_SOURCE_ID);
  return <SiteInfoLayout
    title="문의하기" eyebrow="고객 지원"
    description="사용법이 궁금하거나 오류를 발견하셨나요? 아래 문의 양식을 작성해 보내주세요. 보내주신 내용은 문의 확인과 서비스 개선에 활용합니다."
    tocLabel="문의하기 목차"
    toc={[
      {href: "#contact-form", label: "문의 작성"},
      {href: "#contact-help", label: "작성 안내"},
      {href: "#contact-privacy", label: "개인정보"},
    ]}
  >
    <PageSection id="contact-form" title="문의 양식 작성하기">
      <PageParagraph>성함 또는 닉네임, 답변받을 이메일과 문의 내용을 입력해 주세요.</PageParagraph>
      {isConnected ? (
        <ContactForm />
      ) : (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6" role="status">
          <PageParagraph>현재 문의 접수를 준비 중입니다. 잠시 후 다시 이용해 주세요.</PageParagraph>
        </div>
      )}
    </PageSection>
    <PageSection id="contact-help" title="이런 내용을 적어 주세요">
      <ul className="mb-4 list-disc space-y-2 pl-6 text-[15px] leading-8 text-slate-600">
                  <li className="break-keep">어떤 기능을 사용했는지, 어떤 문제가 있었는지</li>
                  <li className="break-keep">오류가 발생했다면 기기·브라우저·파일 형식 및 오류 메시지</li>
                  <li className="break-keep">답변을 받을 수 있는 이메일 주소</li>
                </ul>
                <PageParagraph>기본 사용법은 <Link className={PAGE_LINK_CLASSES} href="/guides">사용 가이드</Link>에서도 확인할 수 있습니다.</PageParagraph>
    </PageSection>
    <PageSection id="contact-privacy" title="개인정보 안내">
      <PageParagraph>제출한 이름·닉네임, 이메일 및 문의 내용은 문의 확인을 위해 Notion 데이터베이스에 저장됩니다. 원본 파일, 비밀번호, 주민등록번호 등 민감한 내용은 적지 마세요.</PageParagraph>
                <PageParagraph><Link className={PAGE_LINK_CLASSES} href="/privacy">개인정보 처리방침</Link>에서 자세한 안내를 확인할 수 있습니다.</PageParagraph>
    </PageSection>
  </SiteInfoLayout>;
}
