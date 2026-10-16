import type {ReactNode} from "react";
import {GuideShell} from "@/components/guide-shell";

export default function GuidesLayout({children}:{children:ReactNode}){
  return <GuideShell>{children}</GuideShell>;
}
