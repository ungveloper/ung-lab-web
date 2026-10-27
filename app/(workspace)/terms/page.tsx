import { SiteInfoBackButton } from "@/components/site-info-back-button";
import { AppContentContainer } from "@/components/app-content-container";
import Link from "next/link";

export const metadata = {
  title: "이용약관",
  description: "웅이연구소 파일 처리 도구의 이용 범위와 주의사항을 안내합니다.",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return <AppContentContainer as="main" className="content-page site-info-page">
    <SiteInfoBackButton />
    <h1>이용약관</h1>
    <p>웅이연구소는 PDF·이미지·문서 작업에 필요한 온라인 도구를 제공합니다. 본인이 사용할 권한이 있는 파일만 처리해 주세요.</p>
    <h2>이용 범위</h2>
    <p>지원 파일 형식과 작업 내용은 각 도구 화면에서 확인할 수 있습니다. 결과를 제출하거나 공유하기 전에는 저장된 파일을 직접 열어 내용이 맞는지 살펴봐 주세요. 중요한 계약서나 회계 자료 등은 원본 프로그램에서도 확인하는 것이 좋습니다.</p>
    <h2>알아둘 제한사항</h2>
    <p>브라우저 호환성, 기기 메모리, 파일 손상 여부에 따라 일부 작업이 실패할 수 있습니다. AI를 이용한 인물 배경 제거 결과나 Office 문서의 화면 표시가 원본과 완전히 같다고 보장하지 않습니다.</p>
    <h2>서비스 변경</h2>
    <p>오류 수정이나 보안·성능 개선을 위해 기능과 이용 조건을 변경할 수 있습니다. 문제를 발견하면 <Link href="/contact">문의 페이지</Link>에서 알려주세요.</p>
    <h2>개인정보</h2>
    <p>파일과 이용 기록의 처리 방식은 <Link href="/privacy">개인정보 처리방침</Link>을 참고하세요.</p>
  </AppContentContainer>;
}
