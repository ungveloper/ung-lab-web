import { SiteInfoBackButton } from "@/components/site-info-back-button";
import { AppContentContainer } from "@/components/app-content-container";
import Link from "next/link";

export const metadata = {
  title: "개인정보 처리방침",
  description: "웅이연구소의 파일 처리, 브라우저 저장 정보, 사용량 집계 및 광고 관련 개인정보 안내입니다.",
  alternates: { canonical: "/privacy" },
};

const adsEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" &&
  /^ca-pub-\d{16}$/.test(process.env.ADSENSE_PUBLISHER_ID?.trim() ?? "");

export default function Page() {
  return <AppContentContainer as="main" className="content-page site-info-page">
    <SiteInfoBackButton />
    <h1>개인정보 처리방침</h1>
    <p>웅이연구소(www.ung-lab.com)에서 파일과 이용 기록을 어떻게 다루는지 안내합니다. 광고나 저장 방식이 달라지면 운영 상황에 맞춰 내용을 수정하겠습니다.</p>
    <h2>파일 처리</h2>
    <p>사용자가 선택한 PDF·이미지·문서의 원본은 브라우저에서 처리합니다. 변환을 위해 서비스 서버로 원본 파일을 보내지 않으며, 완료한 파일도 서버에 보관하지 않습니다. 작업 전 원본 파일은 직접 백업해 주세요.</p>
    <h2>브라우저 저장 정보</h2>
    <p>즐겨찾기, 최근 사용한 도구, 채팅 입력 기록 등은 브라우저 저장소에 남을 수 있습니다. 브라우저의 저장 정보를 지우면 해당 기록도 삭제될 수 있습니다.</p>
    <h2>사용량 집계와 쿠키</h2>
    <p>많이 사용하는 도구와 추천 질문 유형을 파악하기 위해 도구 식별자와 이용 횟수를 Supabase 데이터베이스에 집계할 수 있습니다. 질문 원문이나 작업한 파일은 집계 API에 보내지 않습니다. 중복 집계를 줄이기 위해 HttpOnly·SameSite=Lax 쿠키(ung-lab-visited-tools, ung-lab-counted-prompts)를 사용할 수 있으며, 여기에 도구 식별자가 저장됩니다.</p>
    <h2>외부 서비스</h2>
    <p>웹 호스팅·보안·데이터베이스 제공자는 접속 과정에서 IP 주소 등 기술적인 정보를 처리할 수 있습니다. 인물 배경 제거 기능은 사용자의 기기로 AI 모델을 내려받는 동안 외부 모델 배포 서버에 연결됩니다.</p>
    <h2>광고와 관련 정보</h2>
    {adsEnabled ? <>
      <p>운영비 마련을 위해 Google AdSense 광고 코드를 사용합니다. Google과 광고 제공자는 광고 노출·측정·부정 이용 방지 등을 위해 쿠키 또는 비슷한 기술과 IP 주소 등 접속 정보를 사용할 수 있습니다. 광고 개인화 여부와 동의 선택은 사용 지역과 Google 광고 설정에 따라 달라질 수 있습니다.</p>
      <p>Google의 광고 데이터 처리 방식은 <a href="https://policies.google.com/technologies/ads?hl=ko" target="_blank" rel="noopener noreferrer">Google 광고 개인정보 안내</a>에서 확인할 수 있습니다. 법령상 동의가 필요한 지역에서는 적절한 동의 관리 설정을 적용해야 합니다.</p>
    </> : <>
      <p>현재 웅이연구소의 Google AdSense 광고 코드는 비활성화 상태입니다. 추후 광고를 시작할 때에는 광고 제공자가 쿠키나 접속 정보를 사용할 수 있으며, 필요한 경우 이용자 동의 절차도 함께 마련하겠습니다.</p>
    </>}
    <h2>문의</h2>
    <p>이용 기록이나 개인정보 처리에 관해 궁금한 점은 <Link href="/contact">문의 페이지</Link>에서 알려주세요. 공개 GitHub 이슈에는 원본 파일이나 민감한 개인정보를 올리지 마세요.</p>
  </AppContentContainer>;
}
