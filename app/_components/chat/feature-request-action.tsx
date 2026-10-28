"use client";

import {ArrowRight,Lightbulb} from "lucide-react";

/** Shown only for a query without a matching supported tool. */
export function FeatureRequestAction({onClick}:{onClick:()=>void}){
  return <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="min-w-0">
      <p className="flex items-center gap-2 text-sm font-bold text-slate-900"><Lightbulb size={17} aria-hidden="true" className="text-blue-600"/> 원하는 기능이 없나요?</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">필요한 기능을 제안해 주시면 서비스 개선에 참고하겠습니다.</p>
    </div>
    <button type="button" onClick={onClick} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white! hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
      기능 제안하기 <ArrowRight size={16} aria-hidden="true"/>
    </button>
  </div>;
}
