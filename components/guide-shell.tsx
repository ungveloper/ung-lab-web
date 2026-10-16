import type {ReactNode} from "react";
import {AppListShell} from "@/components/app-list-shell";

export function GuideShell({children}:{children:ReactNode}){
  return <AppListShell mode="guides">{children}</AppListShell>;
}
