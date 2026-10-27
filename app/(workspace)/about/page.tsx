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
    <h1>웅이연구소 소개</h1>
    <p>PDF에서 사진 한 장을 꺼내거나, 여러 사진을 PDF로 합쳐야 할 때가 있습니다. 웅이연구소는 이런 파일 작업을 프로그램 설치 없이 처리할 수 있도록 만든 웹 도구 모음입니다. 계정을 만들지 않아도 이용할 수 있습니다.</p>
    <h2>어떤 작업을 지원하나요?</h2>
    <p>PDF 페이지를 이미지로 저장하거나 여러 이미지를 PDF로 합칠 수 있습니다. 사진 용량 줄이기, 크기 변경, 형식 변환, 자르기와 인물 사진 배경 제거도 지원합니다. Word·PowerPoint·Excel·CSV 파일은 읽기 전용으로 열어볼 수 있습니다. <Link href="/tools">전체 도구</Link>에서 필요한 기능을 찾아보세요.</p>
    <h2>파일은 어디에서 처리되나요?</h2>
    <p>선택한 원본 파일은 사용 중인 브라우저에서 처리합니다. 변환을 위해 원본 파일을 웅이연구소 서버에 업로드하지 않습니다. 다만 인물 배경 제거 기능은 처음 실행할 때 외부 서버에서 AI 모델을 내려받습니다. 도구 이용 횟수 등 제한된 사용 기록은 별도로 집계할 수 있습니다. 자세한 내용은 <Link href="/privacy">개인정보 처리방침</Link>에 안내했습니다.</p>
    <h2>사용 전에 알아둘 점</h2>
    <p>브라우저와 기기 성능에 따라 작업 속도가 다릅니다. Office 문서의 복잡한 서식과 일부 수식 결과는 원본 프로그램과 다르게 보일 수 있습니다. 중요한 문서는 작업 후 원본과 비교해 주세요. 원본 파일도 따로 보관하는 편이 안전합니다.</p>
    <h2>사용법과 문의</h2>
    <p>처음 쓰는 기능이라면 <Link href="/guides">사용 가이드</Link>를 참고하세요. 작동하지 않는 기능이나 잘못된 안내를 발견했다면 <Link href="/contact">문의 페이지</Link>에서 알려주세요.</p>
  </AppContentContainer>;
}
