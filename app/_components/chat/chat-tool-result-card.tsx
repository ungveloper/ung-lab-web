"use client";

import Link from "next/link";
import {ArrowRight} from "lucide-react";
import type {Tool} from "@/lib/tools";
import {ToolIcon} from "@/components/tool-icon";
import {FavoriteButton} from "@/components/favorite-button";

/** One compact result row, without implicit CSS grid tracks or stretched rows. */
export function ChatToolResultCard({tool}: {tool:Tool}) {
  const iconTone = tool.category === "pdf"
    ? "bg-red-50 text-red-600"
    : tool.category === "image"
      ? "bg-blue-50 text-blue-600"
      : "bg-violet-50 text-violet-600";

  return (
    <div className="chat-result-card flex w-full min-w-0 shrink-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-colors hover:border-blue-200 sm:gap-4 sm:p-4">
      <div className="flex w-9 shrink-0 items-center justify-center sm:w-10">
        <FavoriteButton slug={tool.slug} title={tool.title} variant="compact" />
      </div>
      <Link
        href={`/tools/${tool.slug}`}
        aria-label={`${tool.title} 도구 열기`}
        className="group flex min-w-0 flex-1 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:gap-4"
      >
        <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl sm:size-12 ${iconTone}`}>
          <ToolIcon name={tool.icon} size={23} />
        </span>
        <span className="chat-result-copy flex min-w-0 flex-1 flex-col gap-1">
          <strong className="truncate text-base font-bold leading-6 text-slate-900 group-hover:text-blue-700">{tool.title}</strong>
          <small className="line-clamp-2 text-sm leading-5 text-slate-500">{tool.subtitle}</small>
          <span className="chat-result-tags truncate text-xs text-slate-400">{tool.tags.slice(0,3).join(" · ")}</span>
        </span>
        <span className="chat-result-open flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600" aria-hidden="true">
          <ArrowRight size={17} />
        </span>
      </Link>
    </div>
  );
}
