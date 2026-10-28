import Image from "next/image";

/** User-provided original transparent wordmark (720 × 166). */
export function BrandLogo({className = ""}: {className?:string}) {
  return <Image src="/images/brand/logo.png" alt="웅이연구소" width={720} height={166} className={className} priority />;
}
/** Compact identity icon uses the supplied favicon. Not a Lucide flask. */
export function BrandSymbol({size=22}: {size?:number}) {
  return <Image src="/android-chrome-192x192.png" alt="" aria-hidden="true"
    width={size} height={size} className={`brand-symbol-image inline-block [flex-shrink:0] w-[var(--brand-symbol-size,22px)] h-[var(--brand-symbol-size,22px)] object-contain [vertical-align:middle]`} style={{width:size,height:size}} unoptimized />;
}
