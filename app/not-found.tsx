import { NotFoundContent } from "@/components/not-found-content";
import { WorkspaceShell } from "@/components/workspace-shell";

export const metadata = {
  title: "페이지를 찾을 수 없습니다",
  description: "요청한 주소를 찾을 수 없어 홈과 주요 화면으로 이동할 수 있도록 안내합니다.",
  robots: { index: false, follow: true },
};

/** Unknown top-level paths are not inside (workspace), so include the shell here. */
export default function NotFound() {
  return <WorkspaceShell><NotFoundContent /></WorkspaceShell>;
}
