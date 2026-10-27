import type { Metadata } from "next";
import { ToolChatHome } from "@/components/tool-chat-home";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() { return <ToolChatHome />; }
