import {SiteInfoBackButton} from "@/components/site-info-back-button";
import {AppContentContainer} from "@/components/app-content-container";
import Link from "next/link";
export const metadata={title:"개인정보 처리방침",description:"웅이연구소 파일 처리, 브라우저 저장 데이터, 익명 사용량 집계, 쿠키와 서비스 운영 정보 안내"};
export default function Page(){return <AppContentContainer as="main" className="content-page site-info-page">
<SiteInfoBackButton/>
<h1>개인정보 처리방침</h1><p>적용 대상: 웅이연구소(ung-lab.com). 이 문서는 현재 공개된 코드의 데이터 처리 방식을 설명하며, 광고 또는 분석 서비스가 추가되면 실제 운영 설정에 맞춰 갱신합니다.</p>
<h2>파일 처리</h2><p>사용자가 선택한 이미지, PDF 및 문서는 브라우저 내부에서 처리하며, 파일을 처리하려고 서비스 API로 원본 파일을 전송하지 않습니다. 원본 파일의 백업과 보관은 이용자가 직접 보관해야 합니다.</p>
<h2>브라우저에 저장되는 정보</h2><p>즐겨찾기, 최근 사용한 도구, 채팅 화면 입력 기록은 브라우저 세션 저장소에 보관될 수 있습니다. 브라우저 탭이나 세션을 종료하거나 저장소를 삭제하면 해당 정보는 사라질 수 있습니다.</p>
<h2>익명 사용량 집계</h2><p>인기 도구와 추천 질문 유형을 개선하기 위해 이용한 도구의 식별자와 집계 횟수를 Supabase 데이터베이스에 저장할 수 있습니다. 질문 원문이나 처리 대상 파일은 이 집계 API로 보내지 않습니다. 중복 집계 방지를 위해 HttpOnly SameSite=Lax 쿠키(ung-lab-visited-tools, ung-lab-counted-prompts)를 사용할 수 있습니다. 쿠키에는 도구 식별자만 포함됩니다.</p>
<h2>외부 제공자와 기술적 접속 정보</h2><p>서비스 호스팅·보안 및 데이터베이스 제공자는 서비스 요청 처리 과정에서 IP 주소 등 통상적인 접속 정보를 취급할 수 있습니다. 이미지 배경 제거용 AI 모델 및 라이브러리 다운로드 과정에서도 외부 배포 서버와의 통신이 발생할 수 있습니다.</p>
<h2>광고 및 동의</h2><p>현재 코드에서는 Google AdSense 광고 스크립트가 기본적으로 실행되지 않습니다. 추후 광고 기능을 활성화한다면 광고 제공자, 쿠키 사용, 지역별 동의 선택 및 거부 절차를 포함하도록 이 문서를 갱신할 예정입니다.</p>
<h2>문의</h2><p>데이터 처리 관련 문의는 <Link href="/contact">문의 페이지</Link>를 이용하세요. 공개 GitHub 이슈에 민감한 정보나 원본 파일을 게시하지 마세요.</p>
</AppContentContainer>}
