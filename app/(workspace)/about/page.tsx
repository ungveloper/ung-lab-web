import {SiteInfoBackButton} from "@/components/site-info-back-button";
import {AppContentContainer} from "@/components/app-content-container";
import Link from "next/link";
export const metadata={title:"서비스 소개",description:"웅이연구소가 제공하는 무료 PDF·이미지·문서 온라인 도구와 운영 원칙을 소개합니다."};
export default function Page(){return <AppContentContainer as="main" className="content-page site-info-page">
<SiteInfoBackButton/>
<h1>웅이연구소 소개</h1>
<p>웅이연구소는 PDF, 이미지, 문서 파일을 다룰 때 반복되는 작업을 브라우저에서 수행할 수 있도록 만든 온라인 도구 모음입니다. 가입 없이 필요한 도구를 찾아 파일을 처리할 수 있도록 설계했습니다.</p>
<h2>무엇을 할 수 있나요?</h2><p>PDF 페이지 이미지 변환과 이미지 PDF 합치기, 사진 압축·크기 조절·형식 변환·자르기, 인물 중심 배경 제거, Office 문서 및 CSV 읽기 전용 확인 기능을 제공합니다. 각 기능의 실제 지원 범위는 <Link href="/tools">모든 기능 보기</Link>에서 확인할 수 있습니다.</p>
<h2>파일은 어떻게 처리하나요?</h2><p>선택한 원본 파일은 브라우저의 처리 기능으로 다룹니다. 변환을 위해 서비스 서버로 원본 파일을 업로드하는 방식은 사용하지 않습니다. 다만 AI 배경 제거는 모델 파일을 외부 배포 서버에서 내려받을 수 있습니다.</p>
<h2>정확성과 한계</h2><p>기기 성능, 파일 형식, 브라우저 지원 범위에 따라 결과가 다를 수 있습니다. 문서 뷰어는 읽기 전용이며 일부 고급 서식이나 수식 결과를 원본과 똑같이 재현하지 못할 수 있습니다. 중요한 결과는 원본 프로그램에서 다시 확인하세요.</p>
<h2>도움받기</h2><p><Link href="/guides">사용 가이드</Link>에서 각 도구의 순서와 문제 해결 방법을 확인하거나 <Link href="/contact">문의 페이지</Link>에서 문제를 제보할 수 있습니다.</p>
</AppContentContainer>}
