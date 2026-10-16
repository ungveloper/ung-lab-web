import type {ReactNode} from "react";
import {WorkspaceShell} from "@/components/workspace-shell";

/** Shared Next.js layout for /, /tools and /guides (including guide details). */
export default function WorkspaceLayout({children}:{children:ReactNode}){
  return <WorkspaceShell>{children}</WorkspaceShell>;
}
