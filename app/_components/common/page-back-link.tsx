import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function PageBackLink({href = "/", children = "뒤로가기"}: {href?: string; children?: React.ReactNode}) {
  return (
    <Link href={href} aria-label={href === "/" ? "웅이연구소 홈으로 돌아가기" : undefined}
      className="mb-8 inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
      <ArrowLeft aria-hidden="true" size={17} />{children}
    </Link>
  );
}
