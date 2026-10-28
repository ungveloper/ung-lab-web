import Link from "next/link";

import {SiteInfoLayout} from "@/app/_components/site-info/site-info-layout";
import {PageSection, PageParagraph, PAGE_LINK_CLASSES} from "@/app/_components/common/page-section";

export const metadata = {
  title: "서비스 소개",
  description: "웅이연구소에서 제공하는 PDF·이미지 변환, 문서 미리보기 기능과 파일 처리 방식을 소개합니다.",
  alternates: { canonical: "/about" },
};



export default function Page() {
  return <SiteInfoLayout
    title="웅이연구소 소개" eyebrow="서비스 안내"
    description="파일 형식을 바꾸거나 문서를 확인하려고 프로그램을 따로 설치할 필요는 없습니다. 웅이연구소는 자주 쓰는 파일 작업을 브라우저에서 바로 처리할 수 있도록 만든 도구 모음입니다."
    tocLabel="웅이연구소 소개 목차"
    toc={[
      {href: "#about-tools", label: "지원 기능"},
      {href: "#about-files", label: "파일 처리"},
      {href: "#about-limits", label: "사용 전 확인"},
      {href: "#about-help", label: "도움받기"},
    ]}
  >
    <PageSection id="about-tools" title="어떤 작업을 할 수 있나요?">
      <PageParagraph>PDF의 필요한 페이지만 PNG나 JPG로 저장하고, 여러 사진은 PDF 하나로 묶을 수 있습니다. 사진 용량 줄이기, 크기 조절, 형식 변환, 자르기와 인물 사진 배경 제거도 지원합니다.</PageParagraph>
              <PageParagraph>Word·PowerPoint·Excel·CSV 파일은 별도 프로그램 없이 읽기 전용으로 열어볼 수 있습니다. 지금 제공하는 기능은 <Link className={PAGE_LINK_CLASSES} href="/tools">전체 도구</Link>에서 확인하세요.</PageParagraph>
    </PageSection>
    <PageSection id="about-files" title="파일은 어디에서 처리하나요?">
      <PageParagraph>사용자가 선택한 원본 파일은 브라우저에서 처리합니다. 파일을 변환하려고 웅이연구소 서버에 원본을 업로드하지 않습니다.</PageParagraph>
              <PageParagraph>다만 인물 배경 제거 기능을 처음 사용할 때는 외부 배포 서버에서 AI 모델을 내려받습니다. 많이 쓰는 도구를 파악하기 위해 제한된 사용 횟수를 집계할 수도 있습니다. 기록과 쿠키에 관한 자세한 내용은 <Link className={PAGE_LINK_CLASSES} href="/privacy">개인정보 처리방침</Link>에 적었습니다.</PageParagraph>
    </PageSection>
    <PageSection id="about-limits" title="사용 전에 확인해 주세요">
      <PageParagraph>작업 속도는 기기의 성능과 브라우저에 따라 달라집니다. Office 문서에서는 복잡한 표나 고급 서식, 일부 수식 결과가 원본 프로그램과 다르게 보일 수 있습니다.</PageParagraph>
              <PageParagraph>제출해야 하거나 중요한 문서라면 결과를 직접 열어보고, 원본 파일도 따로 보관해 주세요.</PageParagraph>
    </PageSection>
    <PageSection id="about-help" title="처음 사용하는 기능이라면">
      <PageParagraph><Link className={PAGE_LINK_CLASSES} href="/guides">사용 가이드</Link>에서 실제 작업 순서와 주의할 점을 볼 수 있습니다. 오류를 발견했거나 사용법이 궁금하다면 <Link className={PAGE_LINK_CLASSES} href="/contact">문의 페이지</Link>를 확인하세요.</PageParagraph>
    </PageSection>
  </SiteInfoLayout>;
}
