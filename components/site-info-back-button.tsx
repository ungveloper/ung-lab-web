import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** 소개·정책 페이지는 유입 경로와 관계없이 메인 화면으로 이동합니다. */
export function SiteInfoBackButton() {
  return (
    <Link href="/" className="site-info-back" aria-label="웅이연구소 홈으로 돌아가기">
      <ArrowLeft size={17} aria-hidden="true" /> 뒤로가기
    </Link>
  );
}
