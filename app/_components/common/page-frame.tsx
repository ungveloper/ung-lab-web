import type { ReactNode } from "react";

type Props = { children: ReactNode; as?: "main" | "div"; className?: string };

/** Reference architecture: Inner. One width and one padding policy for every page. */
export function PageFrame({ children, as: Element = "main", className = "" }: Props) {
  return (
    <Element className={`mx-auto w-full max-w-[1040px] min-w-0 shrink-0 px-5 pt-10 pb-28 md:px-8 md:pt-12 ${className}`}>
      {children}
    </Element>
  );
}
