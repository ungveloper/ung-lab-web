import { SiteInfoBackButton } from "@/components/site-info-back-button";
import { AppContentContainer } from "@/components/app-content-container";

export const metadata = {
  title: "문의 및 오류 신고",
  description: "웅이연구소의 기능 오류와 사용법 문의를 접수하는 방법입니다.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return <AppContentContainer as="main" className="content-page site-info-page">
    <SiteInfoBackButton />
    <h1>문의 및 오류 신고</h1>
    <p>파일이 열리지 않거나 도구가 예상과 다르게 작동한다면 GitHub 이슈로 알려주세요. 서비스 개선에 필요한 제보를 확인하는 공개 창구입니다.</p>
    <p><a href="https://github.com/ungveloper/ung-lab-web/issues" target="_blank" rel="noopener noreferrer">GitHub에서 문의하기 →</a></p>
    <h2>무엇을 적으면 좋을까요?</h2>
    <p>사용한 도구, 브라우저와 운영체제, 어떤 순서로 작업했는지, 화면에 나타난 오류 메시지를 알려주세요. 가능하면 개인정보를 가린 화면 사진도 도움이 됩니다.</p>
    <h2>개인정보에 주의해 주세요</h2>
    <p>GitHub 이슈는 누구나 읽을 수 있습니다. 원본 문서, 주민등록번호, 비밀번호, 연락처처럼 공개되면 곤란한 정보는 첨부하지 마세요. 현재 별도의 비공개 이메일 상담 창구는 운영하지 않습니다.</p>
  </AppContentContainer>;
}
