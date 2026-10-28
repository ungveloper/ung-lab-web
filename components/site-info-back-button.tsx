import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** 소개·정책 페이지는 유입 경로와 관계없이 메인 화면으로 이동합니다. */
export function SiteInfoBackButton() {
  return (
    <Link href="/" className={`site-info-back inline-flex items-center gap-2 [border:1px_solid_#dbe3ed] bg-[transparent] rounded-[10px] [padding:9px_13px] min-h-10 text-sm font-[650] text-[inherit] cursor-pointer mb-5 hover:border-[#3b82f6] hover:text-[#2563eb] focus-visible:border-[#3b82f6] focus-visible:text-[#2563eb] [.site-info-page_&]:mb-[34px] [.site-info-page_&]:min-h-[44px] [.site-info-page_&]:[padding:10px_15px] max-[720px]:[.site-info-page_&]:mb-[27px]`} aria-label="웅이연구소 홈으로 돌아가기">
      <ArrowLeft size={17} aria-hidden="true" /> 뒤로가기
    </Link>
  );
}
