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
    <article className="site-info-article">
      <header className="site-info-hero">
        <span className="site-info-eyebrow">개인정보 안내</span>
        <h1>개인정보 처리방침</h1>
        <p className="site-info-lead">웅이연구소(www.ung-lab.com)에서 파일과 이용 기록을 어떻게 다루는지 설명합니다. 실제 광고나 데이터 처리 방식이 바뀌면 이 안내도 그에 맞게 수정하겠습니다.</p>
      </header>
      <nav className="site-info-toc" aria-label="개인정보 처리방침 목차">
        <span className="site-info-toc-label">이 페이지에서</span>
        <a href="#privacy-files">파일 처리</a><a href="#privacy-storage">브라우저 저장</a><a href="#privacy-analytics">사용량·쿠키</a><a href="#privacy-external">외부 서비스</a><a href="#privacy-ads">광고</a><a href="#privacy-contact">문의</a>
      </nav>
      <section className="site-info-section" id="privacy-files" aria-labelledby="privacy-files-title">
        <h2 id="privacy-files-title">파일 처리</h2>
        <p>사용자가 선택한 PDF·이미지·문서 파일은 브라우저에서 처리합니다. 변환을 위해 원본 파일을 웅이연구소 서버로 보내지 않으며, 완료한 파일도 서버에 보관하지 않습니다.</p>
        <p>작업을 마치기 전 결과를 직접 내려받고, 필요한 원본 파일은 별도로 백업해 주세요.</p>
      </section>
      <section className="site-info-section" id="privacy-storage" aria-labelledby="privacy-storage-title">
        <h2 id="privacy-storage-title">브라우저에 저장되는 정보</h2>
        <p>즐겨찾기, 최근 사용한 도구, 채팅 입력 기록은 브라우저 저장소에 남을 수 있습니다. 브라우저의 저장 정보를 지우거나 세션이 종료되면 해당 기록도 사라질 수 있습니다.</p>
      </section>
      <section className="site-info-section" id="privacy-analytics" aria-labelledby="privacy-analytics-title">
        <h2 id="privacy-analytics-title">사용량 집계와 쿠키</h2>
        <p>많이 사용하는 도구와 추천 질문 유형을 파악하기 위해 도구 식별자 및 이용 횟수를 Supabase 데이터베이스에 집계할 수 있습니다. 질문 원문이나 작업 대상 파일은 집계 API로 전송하지 않습니다.</p>
        <p>중복 집계를 줄이기 위해 HttpOnly·SameSite=Lax 쿠키인 ung-lab-visited-tools, ung-lab-counted-prompts를 사용할 수 있습니다. 이 쿠키에는 도구 식별자가 포함될 수 있습니다.</p>
      </section>
      <section className="site-info-section" id="privacy-external" aria-labelledby="privacy-external-title">
        <h2 id="privacy-external-title">외부 서비스와 접속 정보</h2>
        <p>웹 호스팅, 보안 및 데이터베이스 제공자는 서비스 연결 과정에서 IP 주소 등 기술적 접속 정보를 처리할 수 있습니다. 인물 배경 제거 기능은 처음 사용하거나 모델 파일이 필요할 때 외부 모델 배포 서버에 연결될 수 있습니다.</p>
        <p>문의 페이지에서 제출한 이름·닉네임, 이메일, 문의 내용은 웅이연구소 서버를 거쳐 Notion 데이터베이스에 저장되며, 문의 확인과 답변을 위해 사용됩니다. 별도 양식으로 이동하는 경우에는 Notion에 접속하며 Notion이 접속 관련 정보를 처리할 수 있습니다. 이 정보는 문의 확인과 답변을 위해 사용합니다. 민감한 개인 정보나 작업 원본 파일을 첨부하지 마세요. 자세한 서비스별 처리 기준은 <a href="https://www.notion.so/privacy" target="_blank" rel="noopener noreferrer">Notion 개인정보 처리 안내 (새 창)</a>를 확인해 주세요.</p>
      </section>
      <section className="site-info-section" id="privacy-ads" aria-labelledby="privacy-ads-title">
        <h2 id="privacy-ads-title">광고와 관련 정보</h2>
        {adsEnabled ? <>
          <p>운영비 마련을 위해 Google AdSense 광고 코드를 사용합니다. Google과 광고 제공자는 광고 노출, 측정, 부정 이용 방지 등을 위해 쿠키나 유사 기술, IP 주소 등 접속 정보를 사용할 수 있습니다. 광고 개인화와 동의 선택은 사용 지역과 Google 광고 설정에 따라 달라질 수 있습니다.</p>
          <p>Google의 데이터 처리 방식은 <a href="https://policies.google.com/technologies/ads?hl=ko" target="_blank" rel="noopener noreferrer">Google 광고 개인정보 안내 (새 창)</a>에서 확인할 수 있습니다. 법령상 동의가 필요한 지역에서는 적절한 동의 관리 설정을 적용해야 합니다.</p>
        </> : <>
          <p>현재 웅이연구소의 Google AdSense 광고 코드는 비활성화 상태입니다. 광고를 시작하면 광고 제공자가 쿠키와 접속 정보를 사용할 수 있으며, 필요한 지역에서는 동의 절차도 마련하겠습니다.</p>
        </>}
      </section>
      <section className="site-info-section" id="privacy-contact" aria-labelledby="privacy-contact-title">
        <h2 id="privacy-contact-title">개인정보 관련 문의</h2>
        <p>이용 기록이나 개인정보 처리에 관한 문의는 <Link href="/contact">문의 양식</Link>을 이용해 주세요. 이름·이메일·문의 내용은 양식 설정에 따라 노션 데이터베이스에 접수될 수 있습니다. 원본 파일이나 민감한 개인정보는 전달하지 마세요.</p>
      </section>
    </article>
  </AppContentContainer>;
}
