"use client";
import {useRouter} from "next/navigation";
import {ArrowLeft} from "lucide-react";

/** Real browser back for internal navigation; safe /tools fallback for direct visits. */
export function SiteInfoBackButton(){
  const router=useRouter();
  function goBack(){
    if(typeof window==="undefined")return;
    const sameOrigin=document.referrer?new URL(document.referrer).origin===window.location.origin:false;
    if(sameOrigin&&window.history.length>1){router.back();return;}
    router.push("/tools");
  }
  return <button type="button" className="site-info-back" onClick={goBack} aria-label="이전 페이지로 돌아가기">
    <ArrowLeft size={17} aria-hidden="true"/> 뒤로가기
  </button>;
}
