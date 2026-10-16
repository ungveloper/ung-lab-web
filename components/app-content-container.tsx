import type {ReactNode} from "react";

type Props={children:ReactNode;className?:string;as?:"main"|"div"};

export function AppContentContainer({children,className="",as:Element="div"}:Props){
  return <Element className={`app-content-container${className?` ${className}`:""}`}>{children}</Element>;
}
