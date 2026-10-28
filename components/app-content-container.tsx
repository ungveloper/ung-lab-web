import type {ReactNode} from "react";

type Props={children:ReactNode;className?:string;as?:"main"|"div"};

/** A single 1040px Tailwind frame for public pages, directories and guides.
 * Inner chat frames retain their existing independent sizing. */
export function AppContentContainer({children,className="",as:Element="div"}:Props){
  const pageFrame=Element==="main" || className.split(/\s+/).includes("chat-browse-content");
  return <Element className={`${`app-content-container${pageFrame?" mx-auto! min-w-0! w-[calc(100%-48px)]! max-w-[1040px]! max-[720px]:w-[calc(100%-32px)]!":""}${className?` ${className}`:""}`} [--app-content-max-width:1040px] w-[min(var(--app-content-max-width),calc(100%_-_48px))] max-w-[var(--app-content-max-width)] [margin-inline:auto] min-w-0 max-[720px]:w-[calc(100%_-_32px)] [&.content-page.site-info-page]:[padding:42px_0_116px] [&.content-page.site-info-page]:text-base [&.content-page.site-info-page]:leading-[1.95] [&.content-page.site-info-page]:text-[#334155] max-[720px]:[&.content-page.site-info-page]:[padding:24px_0_78px] max-[720px]:[&.content-page.site-info-page]:text-base max-[720px]:[&.content-page.site-info-page]:leading-[1.93] [.workspace-page-body:has(#contact-form)_>__&]:![flex:0_0_auto] [.workspace-page-body:has(#contact-form)_>__&]:!h-auto [.workspace-page-body:has(#contact-form)_>__&]:!max-h-[none] [.workspace-page-body:has(#contact-form)_>__&]:min-h-[max-content] [.workspace-page-body:has(#contact-form)_>__&]:!overflow-visible`}>{children}</Element>;
}
