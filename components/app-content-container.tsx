import type {ReactNode} from "react";

type Props={children:ReactNode;className?:string;as?:"main"|"div"};

/** A single 1040px Tailwind frame for public pages, directories and guides.
 * Inner chat frames retain their existing independent sizing. */
export function AppContentContainer({children,className="",as:Element="div"}:Props){
  const pageFrame=Element==="main" || className.split(/\s+/).includes("chat-browse-content");
  return <Element className={`app-content-container${pageFrame?" mx-auto! min-w-0! w-[calc(100%-48px)]! max-w-[1040px]! max-[720px]:w-[calc(100%-32px)]!":""}${className?` ${className}`:""}`}>{children}</Element>;
}
