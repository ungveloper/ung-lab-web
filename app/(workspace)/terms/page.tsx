import Link from "next/link";

import {SiteInfoLayout} from "@/app/_components/site-info/site-info-layout";
import {PageSection, PageParagraph, PAGE_LINK_CLASSES} from "@/app/_components/common/page-section";

export const metadata = {
  title: "이용약관",
  description: "웅이연구소 파일 처리 도구의 이용 범위와 주의사항을 안내합니다.",
  alternates: { canonical: "/terms" },
};



export default function Page() {
  return <SiteInfoLayout
    title="이용약관" eyebrow="서비스 이용 안내"
    description="웅이연구소의 도구를 사용할 때 알아두어야 할 범위와 주의사항을 정리했습니다. 지원 형식과 작업별 제한은 각 도구 화면에서도 확인할 수 있습니다."
    tocLabel="이용약관 목차"
    toc={[
      {href: "#terms-usage", label: "이용 범위"},
      {href: "#terms-limits", label: "제한사항"},
      {href: "#terms-changes", label: "서비스 변경"},
      {href: "#terms-data", label: "개인정보"},
    ]}
  >
    <PageSection id="terms-usage" title="이용 범위">
      <PageParagraph>웅이연구소는 PDF·이미지·문서 작업을 돕는 온라인 도구를 제공합니다. 본인이 처리하거나 사용할 권한이 있는 파일만 사용해 주세요.</PageParagraph>
              <PageParagraph>결과 파일을 제출하거나 공유하기 전에는 저장된 내용이 올바른지 직접 확인해야 합니다. 계약서나 회계 자료처럼 중요한 문서는 원본 프로그램에서도 다시 확인하는 것이 좋습니다.</PageParagraph>
    </PageSection>
    <PageSection id="terms-limits" title="기능별 제한사항">
      <PageParagraph>브라우저 호환성, 기기 메모리, 파일 손상 여부에 따라 일부 작업은 실패할 수 있습니다. AI 인물 배경 제거 결과와 Office 문서 미리보기는 원본과 완전히 같은 결과를 보장하지 않습니다.</PageParagraph>
              <PageParagraph>각 도구에서 제공하는 파일 형식과 제한을 확인하고, 문제가 생기면 원본 파일을 보관한 상태에서 다시 시도해 주세요.</PageParagraph>
    </PageSection>
    <PageSection id="terms-changes" title="서비스 변경과 오류">
      <PageParagraph>보안, 성능, 호환성 개선 또는 오류 수정 과정에서 기능과 이용 조건이 바뀔 수 있습니다. 문제가 반복되면 <Link className={PAGE_LINK_CLASSES} href="/contact">문의 페이지</Link>에 재현 방법을 남겨주세요.</PageParagraph>
    </PageSection>
    <PageSection id="terms-data" title="개인정보와 파일 처리">
      <PageParagraph>파일 처리와 이용 기록, 쿠키 및 광고 관련 내용은 <Link className={PAGE_LINK_CLASSES} href="/privacy">개인정보 처리방침</Link>을 확인하세요.</PageParagraph>
    </PageSection>
  </SiteInfoLayout>;
}
